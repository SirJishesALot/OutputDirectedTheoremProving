#!/usr/bin/env python3
"""
Runs the zero-shot Task 1 proof completion baseline using Gemini 3.1 Pro via Portkey.
Evaluates the 19 unique starting states from the 20-task benchmark suite with exactly 1 attempt per task.
"""

import asyncio
import json
import os
import re
import subprocess
import sys
import tempfile
import time
from typing import Any, Dict, List, Tuple

# Add outputdirected_benchmarking to sys.path to access llm_backend
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
BENCH_ROOT = os.path.abspath(os.path.join(REPO_ROOT, "../outputdirected_benchmarking"))
if BENCH_ROOT not in sys.path:
    sys.path.insert(0, BENCH_ROOT)

from llm_backend import clean_llm_response, query_llm_async

PORTKEY_MODEL = "@GCP-public-dataset-integration/gemini-3.1-pro-preview"
TEMPERATURE = 0.7
TIMEOUT_SECONDS = 30


def verify_lean_proof(full_code: str) -> Tuple[bool, str]:
    """Writes code to a temporary file and verifies it with lake env lean."""
    with tempfile.NamedTemporaryFile(suffix=".lean", mode="w", delete=False) as temp_file:
        temp_file.write(full_code)
        temp_path = temp_file.name

    try:
        proc = subprocess.run(
            ["lake", "env", "lean", temp_path],
            cwd=BENCH_ROOT,
            capture_output=True,
            text=True,
            timeout=TIMEOUT_SECONDS,
        )
        is_success = proc.returncode == 0
        err_msg = ""
        if not is_success:
            err_msg = (proc.stdout or proc.stderr or "Lean compilation failed").strip()
        return is_success, err_msg
    except Exception as e:
        return False, str(e)
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


def verify_coq_proof(full_code: str) -> Tuple[bool, str]:
    """Writes code to a temporary file and verifies it with coqc."""
    text = full_code.strip()
    if not text.endswith("Qed."):
        full_code = f"{text}\nQed."

    with tempfile.NamedTemporaryFile(suffix=".v", mode="w", delete=False) as temp_file:
        temp_file.write(full_code)
        temp_path = temp_file.name

    try:
        proc = subprocess.run(
            ["coqc", temp_path],
            cwd=BENCH_ROOT,
            capture_output=True,
            text=True,
            timeout=TIMEOUT_SECONDS,
        )
        is_success = proc.returncode == 0
        err_msg = ""
        if not is_success:
            err_msg = (proc.stderr or proc.stdout or "Coq compilation failed").strip()
        return is_success, err_msg
    except Exception as e:
        return False, str(e)
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        for ext in [".vo", ".glob", ".ok"]:
            aux = temp_path.replace(".v", ext)
            if os.path.exists(aux):
                os.remove(aux)


def align_lean_completion(prefix: str, completion: str) -> List[str]:
    """Generates candidate full-code strings with proper indentation handling."""
    candidates = []
    
    # Candidate 1: Direct concatenation
    candidates.append(f"{prefix}\n{completion}")

    # Candidate 2: Indentation alignment matching prefix
    prefix_lines = [l for l in prefix.splitlines() if l.strip()]
    if prefix_lines:
        last_line = prefix_lines[-1]
        indent_len = len(last_line) - len(last_line.lstrip())
        indent_str = last_line[:indent_len]
        if last_line.strip().endswith("by") or last_line.strip().endswith(":=") or last_line.strip().endswith("=>"):
            indent_str += "  "

        lines = []
        for line in completion.splitlines():
            if line.startswith(indent_str):
                lines.append(line)
            else:
                lines.append(indent_str + line.lstrip())
        candidates.append(f"{prefix}\n" + "\n".join(lines))

    return candidates


async def run_single_zero_shot(
    prover: str, theorem: str, stage_id: str, prefix_code: str, sem: asyncio.Semaphore
) -> Dict[str, Any]:
    is_lean = (prover == "lean")

    if is_lean:
        system_instruction = (
            "You are an expert Lean 4 proof engineer. You are given a partial Lean 4 file ending mid-proof. "
            "Complete the proof. Output ONLY valid Lean 4 code/tactics required to finish the proof. "
            "Do not wrap code in markdown ticks or include conversational text."
        )
        contents = f"Complete the following Lean 4 proof:\n\n{prefix_code}"
    else:
        system_instruction = (
            "You are an expert Coq proof engineer. You are given a partial Coq file ending mid-proof. "
            "Complete the proof. Output ONLY valid Coq code/tactics required to finish the proof, ending with 'Qed.' "
            "Do not wrap code in markdown ticks or include conversational text."
        )
        contents = f"Complete the following Coq proof:\n\n{prefix_code}"

    async with sem:
        print(f"  [START] {prover.upper()} {theorem} ({stage_id})...")
        start_time = time.perf_counter()
        raw_completion, usage = await query_llm_async(
            backend="portkey",
            model=PORTKEY_MODEL,
            system_instruction=system_instruction,
            user_content=contents,
            temperature=TEMPERATURE,
            return_metrics=True,
        )
        llm_duration = time.perf_counter() - start_time
        clean_code = clean_llm_response(raw_completion)

        # Verification
        is_success = False
        err_msg = ""

        if is_lean:
            for full_cand in align_lean_completion(prefix_code, clean_code):
                is_success, err_msg = verify_lean_proof(full_cand)
                if is_success:
                    break
        else:
            full_code = f"{prefix_code}\n{clean_code}"
            is_success, err_msg = verify_coq_proof(full_code)

        total_duration = time.perf_counter() - start_time
        status = "✔ PASS" if is_success else "✘ FAIL"
        print(f"  [{status}] {prover.upper()} {theorem} ({stage_id}) in {total_duration:.2f}s (LLM: {llm_duration:.2f}s)")
        if not is_success and err_msg:
            first_err = err_msg.splitlines()[0] if err_msg.splitlines() else err_msg
            print(f"    ↳ Error: {first_err[:120]}")

        return {
            "prover": prover,
            "theorem": theorem,
            "stage_id": stage_id,
            "success": is_success,
            "completion": clean_code,
            "error": err_msg if not is_success else None,
            "durationSeconds": round(total_duration, 2),
            "metrics": usage,
        }


async def main():
    agent_path = os.path.join(REPO_ROOT, "benchmark_results/agent_20_tasks_updated.json")
    if not os.path.exists(agent_path):
        print(f"Error: Could not find {agent_path}")
        sys.exit(1)

    with open(agent_path) as f:
        agent_data = json.load(f)

    print("===============================================================")
    print("       ZERO-SHOT TASK 1 BASELINE BENCHMARK (PORTKEY)           ")
    print("===============================================================")
    print(f"Model:       {PORTKEY_MODEL}")
    print(f"Temperature: {TEMPERATURE}")
    print(f"Attempts:    1 attempt per task")
    print("---------------------------------------------------------------")

    # Collect 19 unique starting states
    unique_tasks: Dict[Tuple[str, str, str], Dict[str, Any]] = {}

    for r in agent_data["results"]:
        prover = r["prover"]
        thm = r["theorem"]
        st = r["initialStage"]
        key = (prover, thm, st)
        if key not in unique_tasks:
            # Load prefix_code
            stages_path = os.path.join(BENCH_ROOT, f"task2/{prover}/{thm}/stages.json")
            with open(stages_path) as fp:
                stages = json.load(fp)
            st_obj = next((s for s in stages if s["stage_id"] == st), None)
            if not st_obj:
                print(f"Error: Stage {st} not found for {prover}/{thm}")
                sys.exit(1)
            unique_tasks[key] = {
                "prover": prover,
                "theorem": thm,
                "stage_id": st,
                "prefix_code": st_obj["prefix_code"],
            }

    print(f"Found {len(unique_tasks)} unique starting tasks to evaluate.\n")

    # Run tasks with concurrency limit of 5
    sem = asyncio.Semaphore(5)
    coros = [
        run_single_zero_shot(
            task["prover"], task["theorem"], task["stage_id"], task["prefix_code"], sem
        )
        for task in unique_tasks.values()
    ]

    results_list = await asyncio.gather(*coros)
    results_by_key = {(r["prover"], r["theorem"], r["stage_id"]): r for r in results_list}

    # Map back to all 20 paired tasks (task 15 copies from task 11)
    paired_results = []
    for r in agent_data["results"]:
        tid = r["taskId"]
        prover = r["prover"]
        thm = r["theorem"]
        st = r["initialStage"]
        tier = r["tier"]

        b_res = results_by_key.get((prover, thm, st), {})
        paired_results.append({
            "taskId": tid,
            "prover": prover,
            "theorem": thm,
            "initialStage": st,
            "targetStage": r["targetStage"],
            "tier": tier,
            "success": b_res.get("success", False),
            "completion": b_res.get("completion", ""),
            "error": b_res.get("error"),
            "durationSeconds": b_res.get("durationSeconds", 0.0),
            "metrics": b_res.get("metrics", {}),
        })

    # Summary
    total = len(paired_results)
    passed = sum(1 for r in paired_results if r["success"])
    pass_rate = (passed / total) * 100

    rocq_tasks = [r for r in paired_results if r["prover"] == "rocq"]
    lean_tasks = [r for r in paired_results if r["prover"] == "lean"]

    step1_tasks = [r for r in paired_results if r["tier"] == "step1"]
    multi_tasks = [r for r in paired_results if r["tier"] == "multistep"]
    comp_tasks = [r for r in paired_results if r["tier"] == "completion"]

    print("\n===============================================================")
    print("                TASK 1 BASELINE SUMMARY                        ")
    print("===============================================================")
    print(f"Total Tasks:     {total} (19 evaluated, #15 mapped from #11)")
    print(f"Pass Count:      {passed} / {total}")
    print(f"Pass Rate:       {pass_rate:.1f}%")
    print("---------------------------------------------------------------")
    print("By Prover:")
    print(f"  Rocq:          {sum(1 for r in rocq_tasks if r['success'])}/{len(rocq_tasks)} ({sum(1 for r in rocq_tasks if r['success'])/len(rocq_tasks)*100:.1f}%)")
    print(f"  Lean 4:        {sum(1 for r in lean_tasks if r['success'])}/{len(lean_tasks)} ({sum(1 for r in lean_tasks if r['success'])/len(lean_tasks)*100:.1f}%)")
    print("---------------------------------------------------------------")
    print("By Difficulty Tier:")
    print(f"  Step 1:        {sum(1 for r in step1_tasks if r['success'])}/{len(step1_tasks)} ({sum(1 for r in step1_tasks if r['success'])/len(step1_tasks)*100:.1f}%)")
    print(f"  Multistep:     {sum(1 for r in multi_tasks if r['success'])}/{len(multi_tasks)} ({sum(1 for r in multi_tasks if r['success'])/len(multi_tasks)*100:.1f}%)")
    print(f"  Completion:    {sum(1 for r in comp_tasks if r['success'])}/{len(comp_tasks)} ({sum(1 for r in comp_tasks if r['success'])/len(comp_tasks)*100:.1f}%)")
    print("===============================================================")

    out_file = os.path.join(REPO_ROOT, "benchmark_results/baseline_task1_fresh.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump({
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "backend": "portkey",
            "model": PORTKEY_MODEL,
            "totalTasks": total,
            "successfulTasks": passed,
            "passRate": pass_rate,
            "results": paired_results,
        }, f, indent=2)
    print(f"Saved fresh baseline results to: {out_file}")


if __name__ == "__main__":
    asyncio.run(main())
