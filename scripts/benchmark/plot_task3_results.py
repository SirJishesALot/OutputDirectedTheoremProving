#!/usr/bin/env python3
"""Generates publication-quality charts for Task 3: User-Agent-Directed Benchmark.

Analyzes the human-simulator (User Agent) + multi-tool prover agent collaboration.
Outputs figures into an isolated directory (e.g. ./plots/task3_user_agent_benchmark/).
"""

import argparse
import json
import os
import sys
from typing import Any, Dict, List

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

# Visual aesthetics matching formal methods publication standards
sns.set_theme(style="whitegrid", font_scale=1.1)
plt.rcParams.update(
    {
        "font.family": "sans-serif",
        "font.sans-serif": ["Helvetica", "Arial", "DejaVu Sans"],
        "axes.edgecolor": "#cccccc",
        "axes.linewidth": 1.0,
        "grid.color": "#ebebeb",
        "grid.linestyle": "--",
        "grid.alpha": 0.7,
        "figure.titlesize": 15,
        "figure.titleweight": "bold",
    }
)

COLOR_PASS = "#059669"      # Emerald Green
COLOR_FAIL = "#EF4444"      # Crimson Red
COLOR_ROCQ = "#7C3AED"      # Purple
COLOR_LEAN = "#2563EB"      # Royal Blue
COLOR_SINGLE = "#0284C7"    # Sky Blue
COLOR_MULTI = "#D97706"     # Amber
COLOR_GT_MATCH = "#10B981"  # Mint Green


def load_report_data(report_path: str):
    """Loads Task 3 JSON benchmark report into pandas DataFrames for single-hop and rollout."""
    if not os.path.exists(report_path):
        raise FileNotFoundError(f"Report file not found: {report_path}")

    with open(report_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # 1. Single Hop Data
    single_results = data.get("singleHopResults", [])
    if not single_results and "results" in data:
        single_results = data.get("results", [])

    single_rows = []
    for r in single_results:
        single_rows.append(
            {
                "taskId": r.get("taskId", ""),
                "prover": r.get("prover", "unknown").capitalize(),
                "theorem": r.get("theorem", "unknown"),
                "stageId": r.get("stageId", ""),
                "targetStageId": r.get("targetStageId", ""),
                "tier": r.get("tier", "single").capitalize(),
                "targetDistance": r.get("targetDistance", 1),
                "success": bool(r.get("success", False)),
                "attempts": int(r.get("validationAttempts", 1)),
                "recovered": bool(r.get("recoveredFromError", False)),
                "toolCalls": int(r.get("toolCallCount", 0)),
                "matchesGT": bool(r.get("matchesGroundTruthTargetState", r.get("matchesGroundTruthNextState", False))),
                "durationSec": float(r.get("durationMs", 0)) / 1000.0,
                "intent": r.get("userAgentIntent", ""),
            }
        )

    # 2. Rollout Completion Data
    rollout_results = data.get("rolloutResults", [])
    rollout_rows = []
    for r in rollout_results:
        rollout_rows.append(
            {
                "theoremId": r.get("theoremId", ""),
                "prover": r.get("prover", "unknown").capitalize(),
                "theorem": r.get("theorem", "unknown"),
                "completed": bool(r.get("completed", False)),
                "turnsCount": int(r.get("turnsCount", 0)),
                "successfulTransitions": int(r.get("successfulTransitions", 0)),
                "failedTransitions": int(r.get("failedTransitions", 0)),
                "totalDurationSec": float(r.get("totalDurationMs", 0)) / 1000.0,
            }
        )

    return pd.DataFrame(single_rows), pd.DataFrame(rollout_rows), data


def plot_pass_rate_by_prover(df: pd.DataFrame, output_dir: str):
    """Bar chart of pass rate by theorem prover."""
    plt.figure(figsize=(7, 5))
    grouped = df.groupby("prover")["success"].agg(["mean", "count"]).reset_index()
    grouped["pass_rate"] = grouped["mean"] * 100

    colors = [COLOR_ROCQ if p == "Rocq" else COLOR_LEAN for p in grouped["prover"]]
    bars = plt.bar(grouped["prover"], grouped["pass_rate"], color=colors, width=0.45, edgecolor="black", alpha=0.9)

    for bar, (_, row) in zip(bars, grouped.iterrows()):
        y = bar.get_height()
        plt.text(
            bar.get_x() + bar.get_width() / 2,
            y + 2,
            f"{y:.1f}%\n(N={int(row['count'])})",
            ha="center",
            va="bottom",
            fontweight="bold",
            fontsize=11,
        )

    plt.title("Task 3: Transition Pass Rate by Prover", pad=15)
    plt.ylabel("Pass Rate (%)")
    plt.ylim(0, 115)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "pass_rate_by_prover.png"), dpi=300)
    plt.close()


def plot_pass_rate_by_tier(df: pd.DataFrame, output_dir: str):
    """Bar chart of pass rate by difficulty tier (Single-Step vs Multi-Step)."""
    plt.figure(figsize=(7, 5))
    grouped = df.groupby("tier")["success"].agg(["mean", "count"]).reset_index()
    grouped["pass_rate"] = grouped["mean"] * 100

    colors = [COLOR_MULTI if t == "Multistep" else COLOR_SINGLE for t in grouped["tier"]]
    bars = plt.bar(grouped["tier"], grouped["pass_rate"], color=colors, width=0.45, edgecolor="black", alpha=0.9)

    for bar, (_, row) in zip(bars, grouped.iterrows()):
        y = bar.get_height()
        label = "Single-Step (Dist=1)" if row["tier"] == "Single" else "Multi-Step Jump (Dist≥2)"
        plt.text(
            bar.get_x() + bar.get_width() / 2,
            y + 2,
            f"{y:.1f}%\n(N={int(row['count'])})",
            ha="center",
            va="bottom",
            fontweight="bold",
            fontsize=11,
        )

    plt.title("Task 3: Pass Rate by Difficulty Tier", pad=15)
    plt.ylabel("Pass Rate (%)")
    plt.ylim(0, 115)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "pass_rate_by_tier.png"), dpi=300)
    plt.close()


def plot_validation_attempts(df: pd.DataFrame, output_dir: str):
    """Distribution of validation attempts and retry recoveries."""
    plt.figure(figsize=(8, 5))
    succ_df = df[df["success"] == True]

    if len(succ_df) == 0:
        plt.close()
        return

    counts = succ_df["attempts"].value_counts().sort_index()
    x = counts.index.astype(str)
    y = counts.values

    bars = plt.bar(x, y, color="#3B82F6", edgecolor="black", width=0.5, alpha=0.85)
    for bar in bars:
        h = bar.get_height()
        plt.text(bar.get_x() + bar.get_width() / 2, h + 0.1, f"{int(h)}", ha="center", va="bottom", fontweight="bold")

    plt.title("Tactic Validation Attempts to Reach Desired State", pad=15)
    plt.xlabel("Validation Attempts")
    plt.ylabel("Number of Successful Tasks")
    plt.ylim(0, max(y) + 2)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "validation_attempts_distribution.png"), dpi=300)
    plt.close()


def plot_ground_truth_alignment(df: pd.DataFrame, output_dir: str):
    """Proportion of User Agent synthesized goals matching human proof stages."""
    plt.figure(figsize=(7, 5))
    gt_counts = df["matchesGT"].value_counts()
    labels = ["Matches Human Ground Truth", "Novel Sound State"]
    vals = [gt_counts.get(True, 0), gt_counts.get(False, 0)]
    colors = [COLOR_GT_MATCH, "#64748B"]

    plt.pie(
        vals,
        labels=labels,
        colors=colors,
        autopct="%1.1f%%",
        startangle=140,
        wedgeprops={"edgecolor": "black", "linewidth": 1.2},
        textprops={"fontsize": 11, "fontweight": "bold"},
    )
    plt.title("User Agent State Realism vs. Human Ground Truth", pad=15)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "ground_truth_alignment.png"), dpi=300)
    plt.close()


def plot_completion_rate(rollout_df: pd.DataFrame, output_dir: str):
    """Bar chart of full theorem completion rate by prover."""
    plt.figure(figsize=(7, 5))
    grouped = rollout_df.groupby("prover")["completed"].agg(["mean", "count"]).reset_index()
    grouped["comp_rate"] = grouped["mean"] * 100

    colors = [COLOR_ROCQ if p == "Rocq" else COLOR_LEAN for p in grouped["prover"]]
    bars = plt.bar(grouped["prover"], grouped["comp_rate"], color=colors, width=0.45, edgecolor="black", alpha=0.9)

    for bar, (_, row) in zip(bars, grouped.iterrows()):
        y = bar.get_height()
        plt.text(
            bar.get_x() + bar.get_width() / 2,
            y + 2,
            f"{y:.1f}%\n(N={int(row['count'])})",
            ha="center",
            va="bottom",
            fontweight="bold",
            fontsize=11,
        )

    plt.title("Task 3: Full Proof Completion Rate by Prover", pad=15)
    plt.ylabel("Theorems Proved to Completion (%)")
    plt.ylim(0, 115)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "completion_rate_by_prover.png"), dpi=300)
    plt.close()


def plot_rollout_transitions(rollout_df: pd.DataFrame, output_dir: str):
    """Plots successful vs failed transitions and turns taken in rollouts."""
    plt.figure(figsize=(8, 5))
    theorems = rollout_df["theorem"].values
    succ = rollout_df["successfulTransitions"].values
    fail = rollout_df["failedTransitions"].values

    x = np.arange(len(theorems))
    width = 0.35

    plt.bar(x - width/2, succ, width, label="Successful Transitions", color=COLOR_PASS, edgecolor="black")
    plt.bar(x + width/2, fail, width, label="Failed Transitions", color=COLOR_FAIL, edgecolor="black")

    plt.xlabel("Theorems")
    plt.ylabel("Number of Turns")
    plt.title("Interactive Rollout Step Transitions per Theorem", pad=15)
    plt.xticks(x, [f"{t}\n({p})" for t, p in zip(theorems, rollout_df["prover"])], rotation=30, ha="right", fontsize=9)
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "rollout_transitions_and_turns.png"), dpi=300)
    plt.close()


def plot_summary_dashboard(single_df: pd.DataFrame, rollout_df: pd.DataFrame, output_dir: str):
    """4-panel publication-ready executive summary figure."""
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))

    # Panel A: Single-Hop Pass Rate by Prover (or Completion Rate if no single hops)
    if len(single_df) > 0:
        p_grp = single_df.groupby("prover")["success"].mean() * 100
        axes[0, 0].bar(p_grp.index, p_grp.values, color=[COLOR_ROCQ if p == "Rocq" else COLOR_LEAN for p in p_grp.index], edgecolor="black", width=0.4)
        axes[0, 0].set_title("(A) Single-Hop Pass Rate by Prover", fontweight="bold")
        axes[0, 0].set_ylabel("Pass Rate (%)")
        axes[0, 0].set_ylim(0, 115)
        for i, v in enumerate(p_grp.values):
            axes[0, 0].text(i, v + 2, f"{v:.1f}%", ha="center", fontweight="bold")
    elif len(rollout_df) > 0:
        p_grp = rollout_df.groupby("prover")["completed"].mean() * 100
        axes[0, 0].bar(p_grp.index, p_grp.values, color=[COLOR_ROCQ if p == "Rocq" else COLOR_LEAN for p in p_grp.index], edgecolor="black", width=0.4)
        axes[0, 0].set_title("(A) Proof Completion Rate by Prover", fontweight="bold")
        axes[0, 0].set_ylabel("Completion Rate (%)")
        axes[0, 0].set_ylim(0, 115)
        for i, v in enumerate(p_grp.values):
            axes[0, 0].text(i, v + 2, f"{v:.1f}%", ha="center", fontweight="bold")

    # Panel B: Pass Rate by Difficulty Tier (Single-Step vs Multi-Step)
    if len(single_df) > 0:
        t_grp = single_df.groupby("tier")["success"].mean() * 100
        axes[0, 1].bar(t_grp.index, t_grp.values, color=[COLOR_MULTI if t == "Multistep" else COLOR_SINGLE for t in t_grp.index], edgecolor="black", width=0.4)
        axes[0, 1].set_title("(B) Pass Rate by Difficulty Tier", fontweight="bold")
        axes[0, 1].set_ylabel("Pass Rate (%)")
        axes[0, 1].set_ylim(0, 115)
        for i, v in enumerate(t_grp.values):
            axes[0, 1].text(i, v + 2, f"{v:.1f}%", ha="center", fontweight="bold")
    elif len(rollout_df) > 0:
        axes[0, 1].bar(["Completion"], [rollout_df["completed"].mean() * 100], color=COLOR_PASS, edgecolor="black", width=0.4)
        axes[0, 1].set_title("(B) Proof Completion Rate", fontweight="bold")
        axes[0, 1].set_ylabel("Completion Rate (%)")
        axes[0, 1].set_ylim(0, 115)

    # Panel C: Validation Attempts or Rollout Turns
    if len(rollout_df) > 0:
        c_grp = rollout_df.groupby("prover")["completed"].mean() * 100
        axes[1, 0].bar(c_grp.index, c_grp.values, color=[COLOR_ROCQ if p == "Rocq" else COLOR_LEAN for p in c_grp.index], edgecolor="black", width=0.4)
        axes[1, 0].set_title("(C) End-to-End Proofs Completed", fontweight="bold")
        axes[1, 0].set_ylabel("Completion Rate (%)")
        axes[1, 0].set_ylim(0, 115)
        for i, v in enumerate(c_grp.values):
            axes[1, 0].text(i, v + 2, f"{v:.1f}%", ha="center", fontweight="bold")
    elif len(single_df) > 0:
        succ_df = single_df[single_df["success"] == True]
        if len(succ_df) > 0:
            att_counts = succ_df["attempts"].value_counts().sort_index()
            axes[1, 0].bar(att_counts.index.astype(str), att_counts.values, color="#3B82F6", edgecolor="black", width=0.4)
            axes[1, 0].set_title("(C) Multi-Tool Validation Attempts", fontweight="bold")
            axes[1, 0].set_xlabel("Attempts")
            axes[1, 0].set_ylabel("Task Count")
            for i, (idx, val) in enumerate(att_counts.items()):
                axes[1, 0].text(i, val + 0.1, f"{val}", ha="center", fontweight="bold")

    # Panel D: Latency Distribution
    if len(single_df) > 0:
        sns.boxplot(ax=axes[1, 1], data=single_df, x="prover", y="durationSec", hue="prover", palette=[COLOR_ROCQ, COLOR_LEAN], legend=False)
        axes[1, 1].set_title("(D) Task Execution Latency (seconds)", fontweight="bold")
        axes[1, 1].set_ylabel("Duration (s)")
        axes[1, 1].set_xlabel("Prover")
    elif len(rollout_df) > 0:
        sns.boxplot(ax=axes[1, 1], data=rollout_df, x="prover", y="totalDurationSec", hue="prover", palette=[COLOR_ROCQ, COLOR_LEAN], legend=False)
        axes[1, 1].set_title("(D) Rollout Duration (seconds)", fontweight="bold")
        axes[1, 1].set_ylabel("Duration (s)")
        axes[1, 1].set_xlabel("Prover")

    plt.suptitle("Task 3: User-Agent-Directed Benchmark Summary Dashboard", fontsize=16, fontweight="bold", y=0.98)
    plt.tight_layout(rect=[0, 0, 1, 0.95])
    plt.savefig(os.path.join(output_dir, "summary_dashboard.png"), dpi=300)
    plt.close()


def main():
    parser = argparse.ArgumentParser(description="Plot Task 3 Benchmark Results")
    default_report = "./benchmark_results/task3_30tasks/latest_task3_all.json"
    if not os.path.exists(default_report):
        default_report = "./benchmark_results/latest_task3.json"
    parser.add_argument("--report", default=default_report, help=f"Path to Task 3 JSON benchmark report (default: {default_report})")
    parser.add_argument("--output-dir", default="./plots/task3_user_agent_benchmark", help="Directory to save plots")
    args = parser.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)
    single_df, rollout_df, raw_data = load_report_data(args.report)

    print(f"Loaded Task 3 report from {args.report}: {len(single_df)} single-hop tasks, {len(rollout_df)} rollout theorems.")
    print(f"Saving publication charts to: {args.output_dir}")

    if len(single_df) > 0:
        plot_pass_rate_by_prover(single_df, args.output_dir)
        plot_pass_rate_by_tier(single_df, args.output_dir)
        plot_validation_attempts(single_df, args.output_dir)
        plot_ground_truth_alignment(single_df, args.output_dir)

    if len(rollout_df) > 0:
        plot_completion_rate(rollout_df, args.output_dir)
        plot_rollout_transitions(rollout_df, args.output_dir)

    plot_summary_dashboard(single_df, rollout_df, args.output_dir)

    print(f"Publication plots successfully generated in: {args.output_dir}")


if __name__ == "__main__":
    main()
