#!/usr/bin/env python3
"""Generates publication-quality benchmark plots comparing the Multi-Turn

Prover Agent against the 1-Shot Task 2 Baseline on paired theorem transitions.
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

# Set overall publication visual aesthetics
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
        "figure.titlesize": 16,
        "figure.titleweight": "bold",
    }
)

# Color Palette: Distinct, colorblind-friendly
COLOR_AGENT = "#2563EB"     # Royal Blue
COLOR_BASELINE = "#94A3B8"  # Slate Gray
COLOR_ROCQ = "#7C3AED"      # Purple
COLOR_LEAN = "#059669"      # Emerald Green
COLOR_RECOVER = "#F59E0B"   # Amber Gold
COLOR_FAIL = "#EF4444"      # Red


def load_dataset(
    agent_path: str, baseline_path: str
) -> pd.DataFrame:
    """Loads and joins per-task agent and baseline evaluation records."""
    if not os.path.exists(agent_path):
        raise FileNotFoundError(f"Agent results file not found: {agent_path}")
    if not os.path.exists(baseline_path):
        raise FileNotFoundError(f"Baseline results file not found: {baseline_path}")

    with open(agent_path, "r", encoding="utf-8") as f:
        agent_data = json.load(f)
    with open(baseline_path, "r", encoding="utf-8") as f:
        baseline_data = json.load(f)

    agent_results = {r["taskId"]: r for r in agent_data.get("results", [])}
    baseline_results = {r["taskId"]: r for r in baseline_data.get("results", [])}

    rows = []
    for tid, a in agent_results.items():
        b = baseline_results.get(tid, {})
        agent_pass = bool(a.get("success", False))
        baseline_pass = bool(b.get("baselineSuccess", b.get("success", False)))

        # Outcome category
        if agent_pass and not baseline_pass:
            outcome = "Agent Won (Baseline Failed)"
        elif not agent_pass and baseline_pass:
            outcome = "Baseline Won (Agent Failed)"
        elif agent_pass and baseline_pass:
            outcome = "Both Succeeded"
        else:
            outcome = "Both Failed"

        rows.append(
            {
                "taskId": tid,
                "prover": a.get("prover", "unknown").capitalize(),
                "theorem": a.get("theorem", "unknown"),
                "initialStage": a.get("initialStage", ""),
                "targetStage": a.get("targetStage", ""),
                "tier": a.get("tier", "unknown"),
                "editDistance": a.get("editDistance", 1),
                "agentSuccess": agent_pass,
                "baselineSuccess": baseline_pass,
                "agentAttempts": a.get("validationAttempts", 1),
                "recovered": a.get("recoveredFromError", False),
                "agentDuration": a.get("durationMs", 0) / 1000.0,
                "baselineDuration": b.get("durationSeconds", b.get("durationMs", 0) / 1000.0),
                "outcome": outcome,
            }
        )

    df = pd.DataFrame(rows)
    return df


def plot_pass_rate_by_prover(df: pd.DataFrame, output_dir: str):
    """Bar chart comparing Agent vs 1-Shot Baseline Pass Rate by Prover."""
    fig, ax = plt.subplots(figsize=(8, 5.5), dpi=300)

    groups = ["Overall", "Rocq (Coq)", "Lean 4"]
    agent_rates = [
        df["agentSuccess"].mean() * 100,
        df[df["prover"] == "Rocq"]["agentSuccess"].mean() * 100,
        df[df["prover"] == "Lean"]["agentSuccess"].mean() * 100,
    ]
    baseline_rates = [
        df["baselineSuccess"].mean() * 100,
        df[df["prover"] == "Rocq"]["baselineSuccess"].mean() * 100,
        df[df["prover"] == "Lean"]["baselineSuccess"].mean() * 100,
    ]

    x = np.arange(len(groups))
    width = 0.32

    rects1 = ax.bar(
        x - width / 2,
        agent_rates,
        width,
        label="Multi-Turn Agent (Ours)",
        color=COLOR_AGENT,
        edgecolor="black",
        linewidth=0.8,
        zorder=3,
    )
    rects2 = ax.bar(
        x + width / 2,
        baseline_rates,
        width,
        label="Zero-Shot Baseline (Task 1)",
        color=COLOR_BASELINE,
        edgecolor="black",
        linewidth=0.8,
        zorder=3,
    )

    ax.set_ylabel("Pass Rate (%)", fontsize=13, fontweight="bold")
    ax.set_title("Pass Rate Comparison: Multi-Turn Agent vs. Zero-Shot Baseline", fontsize=14, fontweight="bold", pad=28)
    ax.set_xticks(x)
    ax.set_xticklabels(groups, fontsize=12, fontweight="bold")
    ax.set_ylim(0, 125)
    ax.legend(frameon=True, facecolor="white", edgecolor="#cccccc", loc="upper center", bbox_to_anchor=(0.5, 1.08), ncol=2)

    # Add numeric labels and delta
    for i in range(len(groups)):
        ar = agent_rates[i]
        br = baseline_rates[i]
        delta = ar - br
        ax.annotate(
            f"{ar:.1f}%",
            xy=(x[i] - width / 2, ar + 2),
            ha="center",
            va="bottom",
            fontsize=11,
            fontweight="bold",
            color="#1E3A8A",
        )
        ax.annotate(
            f"{br:.1f}%",
            xy=(x[i] + width / 2, br + 2),
            ha="center",
            va="bottom",
            fontsize=11,
            fontweight="bold",
            color="#475569",
        )
        # Delta badge above group
        ax.annotate(
            f"Δ +{delta:.1f}%",
            xy=(x[i], max(ar, br) + 9),
            ha="center",
            va="bottom",
            fontsize=10.5,
            fontweight="bold",
            color="#047857",
            bbox=dict(boxstyle="round,pad=0.25", facecolor="#D1FAE5", edgecolor="#10B981", alpha=0.9),
        )

    plt.tight_layout()
    out_file = os.path.join(output_dir, "pass_rate_by_prover.png")
    plt.savefig(out_file, bbox_inches="tight")
    plt.close()
    print(f"Saved: {out_file}")


def plot_pass_rate_by_tier(df: pd.DataFrame, output_dir: str):
    """Bar chart comparing Agent vs Baseline across task difficulty tiers."""
    fig, ax = plt.subplots(figsize=(8.5, 5.5), dpi=300)

    tier_order = ["step1", "multistep", "completion"]
    tier_labels = ["Step 1 (Dist=1)", "Multi-Step Jump", "Proof Completion"]

    agent_rates = []
    baseline_rates = []
    counts = []

    for t in tier_order:
        sub = df[df["tier"] == t]
        counts.append(len(sub))
        agent_rates.append(sub["agentSuccess"].mean() * 100 if len(sub) else 0)
        baseline_rates.append(sub["baselineSuccess"].mean() * 100 if len(sub) else 0)

    x = np.arange(len(tier_order))
    width = 0.32

    ax.bar(
        x - width / 2,
        agent_rates,
        width,
        label="Multi-Turn Agent (Ours)",
        color=COLOR_AGENT,
        edgecolor="black",
        linewidth=0.8,
        zorder=3,
    )
    ax.bar(
        x + width / 2,
        baseline_rates,
        width,
        label="Zero-Shot Baseline (Task 1)",
        color=COLOR_BASELINE,
        edgecolor="black",
        linewidth=0.8,
        zorder=3,
    )

    ax.set_ylabel("Pass Rate (%)", fontsize=13, fontweight="bold")
    ax.set_title("Pass Rate by Transition Difficulty Tier", fontsize=14, fontweight="bold", pad=28)
    ax.set_xticks(x)
    formatted_labels = [f"{lbl}\n(N={cnt})" for lbl, cnt in zip(tier_labels, counts)]
    ax.set_xticklabels(formatted_labels, fontsize=11, fontweight="bold")
    ax.set_ylim(0, 125)
    ax.legend(frameon=True, facecolor="white", edgecolor="#cccccc", loc="upper center", bbox_to_anchor=(0.5, 1.08), ncol=2)

    for i in range(len(tier_order)):
        ar = agent_rates[i]
        br = baseline_rates[i]
        delta = ar - br
        ax.annotate(
            f"{ar:.1f}%",
            xy=(x[i] - width / 2, ar + 2),
            ha="center",
            va="bottom",
            fontsize=10.5,
            fontweight="bold",
            color="#1E3A8A",
        )
        ax.annotate(
            f"{br:.1f}%",
            xy=(x[i] + width / 2, br + 2),
            ha="center",
            va="bottom",
            fontsize=10.5,
            fontweight="bold",
            color="#475569",
        )
        if delta > 0:
            ax.annotate(
                f"+{delta:.1f}%",
                xy=(x[i], max(ar, br) + 9),
                ha="center",
                va="bottom",
                fontsize=10,
                fontweight="bold",
                color="#047857",
                bbox=dict(boxstyle="round,pad=0.2", facecolor="#D1FAE5", edgecolor="#10B981", alpha=0.9),
            )

    plt.tight_layout()
    out_file = os.path.join(output_dir, "pass_rate_by_tier.png")
    plt.savefig(out_file, bbox_inches="tight")
    plt.close()
    print(f"Saved: {out_file}")


def plot_head_to_head_outcomes(df: pd.DataFrame, output_dir: str):
    """Horizontal stacked / categorical chart illustrating win/loss attribution."""
    fig, ax = plt.subplots(figsize=(9, 4.2), dpi=300)

    categories = [
        "Agent Won\n(Baseline Failed)",
        "Both Succeeded",
        "Baseline Won\n(Agent Failed)",
        "Both Failed",
    ]
    colors = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"]

    counts = [
        (df["outcome"] == "Agent Won (Baseline Failed)").sum(),
        (df["outcome"] == "Both Succeeded").sum(),
        (df["outcome"] == "Baseline Won (Agent Failed)").sum(),
        (df["outcome"] == "Both Failed").sum(),
    ]
    total = len(df)
    percentages = [c / total * 100 for c in counts]

    y = np.arange(len(categories))
    bars = ax.barh(y, counts, color=colors, edgecolor="black", linewidth=0.8, height=0.55, zorder=3)

    ax.set_yticks(y)
    ax.set_yticklabels(categories, fontsize=11, fontweight="bold")
    ax.set_xlabel(f"Number of Tasks (out of {total})", fontsize=12, fontweight="bold")
    ax.set_title("Head-to-Head Outcome Breakdown", fontsize=14, fontweight="bold", pad=15)
    ax.set_xlim(0, max(counts) + 3)
    ax.invert_yaxis()

    for bar, count, pct in zip(bars, counts, percentages):
        width = bar.get_width()
        ax.annotate(
            f"{count} tasks ({pct:.1f}%)",
            xy=(width + 0.25, bar.get_y() + bar.get_height() / 2),
            va="center",
            ha="left",
            fontsize=11,
            fontweight="bold",
            color="#1F2937",
        )

    plt.tight_layout()
    out_file = os.path.join(output_dir, "head_to_head_outcomes.png")
    plt.savefig(out_file, bbox_inches="tight")
    plt.close()
    print(f"Saved: {out_file}")


def plot_agent_attempt_distribution(df: pd.DataFrame, output_dir: str):
    """Bar breakdown of agent success: 1st-turn success vs compiler retry recovery vs failure."""
    fig, ax = plt.subplots(figsize=(7.5, 5), dpi=300)

    pass_1st = ((df["agentSuccess"]) & (~df["recovered"])).sum()
    recovered = ((df["agentSuccess"]) & (df["recovered"])).sum()
    failed = (~df["agentSuccess"]).sum()

    categories = [
        "Passed on\n1st Attempt",
        "Recovered via\nCompiler Feedback",
        "Failed after\nMax Attempts",
    ]
    counts = [pass_1st, recovered, failed]
    colors = ["#2563EB", "#F59E0B", "#EF4444"]

    x = np.arange(len(categories))
    bars = ax.bar(x, counts, color=colors, edgecolor="black", linewidth=0.8, width=0.5, zorder=3)

    ax.set_ylabel("Number of Tasks", fontsize=12, fontweight="bold")
    ax.set_title("Agent Multi-Turn Recovery Dynamics", fontsize=14, fontweight="bold", pad=15)
    ax.set_xticks(x)
    ax.set_xticklabels(categories, fontsize=11, fontweight="bold")
    ax.set_ylim(0, max(counts) + 3)

    for bar, count in zip(bars, counts):
        pct = count / len(df) * 100
        ax.annotate(
            f"{count}\n({pct:.1f}%)",
            xy=(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.2),
            ha="center",
            va="bottom",
            fontsize=11,
            fontweight="bold",
            color="#1F2937",
        )

    plt.tight_layout()
    out_file = os.path.join(output_dir, "agent_recovery_dynamics.png")
    plt.savefig(out_file, bbox_inches="tight")
    plt.close()
    print(f"Saved: {out_file}")


def plot_summary_dashboard(df: pd.DataFrame, output_dir: str):
    """Creates a consolidated 2x2 multi-panel publication dashboard."""
    fig, axs = plt.subplots(2, 2, figsize=(15, 11), dpi=300)
    fig.suptitle("Output-Directed Theorem Proving: Agent vs. Zero-Shot Baseline (Task 1)", fontsize=18, fontweight="bold", y=0.98)

    # Panel A: By Prover
    ax = axs[0, 0]
    groups = ["Overall", "Rocq", "Lean 4"]
    agent_rates = [
        df["agentSuccess"].mean() * 100,
        df[df["prover"] == "Rocq"]["agentSuccess"].mean() * 100,
        df[df["prover"] == "Lean"]["agentSuccess"].mean() * 100,
    ]
    baseline_rates = [
        df["baselineSuccess"].mean() * 100,
        df[df["prover"] == "Rocq"]["baselineSuccess"].mean() * 100,
        df[df["prover"] == "Lean"]["baselineSuccess"].mean() * 100,
    ]
    x = np.arange(len(groups))
    width = 0.32
    ax.bar(x - width / 2, agent_rates, width, label="Multi-Turn Agent (Ours)", color=COLOR_AGENT, edgecolor="black", linewidth=0.8, zorder=3)
    ax.bar(x + width / 2, baseline_rates, width, label="Zero-Shot Baseline (Task 1)", color=COLOR_BASELINE, edgecolor="black", linewidth=0.8, zorder=3)
    ax.set_ylabel("Pass Rate (%)", fontweight="bold")
    ax.set_title("(A) Pass Rate by Prover Backend", fontweight="bold", pad=12)
    ax.set_xticks(x)
    ax.set_xticklabels(groups, fontweight="bold")
    ax.set_ylim(0, 128)
    for i in range(len(groups)):
        ar, br = agent_rates[i], baseline_rates[i]
        ax.annotate(f"{ar:.0f}%", xy=(x[i] - width / 2, ar + 1.5), ha="center", fontsize=9.5, fontweight="bold", color="#1E3A8A")
        ax.annotate(f"{br:.0f}%", xy=(x[i] + width / 2, br + 1.5), ha="center", fontsize=9.5, fontweight="bold", color="#475569")
        ax.annotate(f"Δ +{ar-br:.0f}%", xy=(x[i], max(ar, br) + 7), ha="center", fontsize=9, fontweight="bold", color="#047857",
                    bbox=dict(boxstyle="round,pad=0.2", facecolor="#D1FAE5", edgecolor="#10B981", alpha=0.9))

    # Panel B: By Tier
    ax = axs[0, 1]
    tier_order = ["step1", "multistep", "completion"]
    tier_labels = ["Step 1\n(Dist=1)", "Multi-Step\nJump", "Proof\nCompletion"]
    t_agent = [df[df["tier"] == t]["agentSuccess"].mean() * 100 for t in tier_order]
    t_base = [df[df["tier"] == t]["baselineSuccess"].mean() * 100 for t in tier_order]
    x = np.arange(len(tier_order))
    ax.bar(x - width / 2, t_agent, width, label="Multi-Turn Agent (Ours)", color=COLOR_AGENT, edgecolor="black", linewidth=0.8, zorder=3)
    ax.bar(x + width / 2, t_base, width, label="Zero-Shot Baseline (Task 1)", color=COLOR_BASELINE, edgecolor="black", linewidth=0.8, zorder=3)
    ax.set_ylabel("Pass Rate (%)", fontweight="bold")
    ax.set_title("(B) Pass Rate by Difficulty Tier", fontweight="bold", pad=12)
    ax.set_xticks(x)
    ax.set_xticklabels(tier_labels, fontweight="bold")
    ax.set_ylim(0, 128)
    for i in range(len(tier_order)):
        ar, br = t_agent[i], t_base[i]
        delta = ar - br
        ax.annotate(f"{ar:.0f}%", xy=(x[i] - width / 2, ar + 1.5), ha="center", fontsize=9.5, fontweight="bold", color="#1E3A8A")
        ax.annotate(f"{br:.0f}%", xy=(x[i] + width / 2, br + 1.5), ha="center", fontsize=9.5, fontweight="bold", color="#475569")
        ax.annotate(f"Δ +{delta:.0f}%", xy=(x[i], max(ar, br) + 7), ha="center", fontsize=9, fontweight="bold", color="#047857",
                    bbox=dict(boxstyle="round,pad=0.2", facecolor="#D1FAE5", edgecolor="#10B981", alpha=0.9))

    # Panel C: Head to Head Attribution
    ax = axs[1, 0]
    cats = ["Agent Won\n(Baseline Failed)", "Both Succeeded", "Baseline Won\n(Agent Failed)", "Both Failed"]
    counts = [
        (df["outcome"] == "Agent Won (Baseline Failed)").sum(),
        (df["outcome"] == "Both Succeeded").sum(),
        (df["outcome"] == "Baseline Won (Agent Failed)").sum(),
        (df["outcome"] == "Both Failed").sum(),
    ]
    colors = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"]
    y = np.arange(len(cats))
    bars = ax.barh(y, counts, color=colors, edgecolor="black", linewidth=0.8, height=0.55, zorder=3)
    ax.set_yticks(y)
    ax.set_yticklabels(cats, fontweight="bold", fontsize=10)
    ax.set_xlabel("Number of Tasks", fontweight="bold")
    ax.set_title("(C) Head-to-Head Win/Loss Attribution", fontweight="bold", pad=10)
    ax.invert_yaxis()
    for bar, c in zip(bars, counts):
        ax.annotate(f"{c} ({c/len(df)*100:.0f}%)", xy=(bar.get_width() + 0.2, bar.get_y() + bar.get_height() / 2),
                    va="center", fontsize=10, fontweight="bold")

    # Panel D: Attempt Dynamics
    ax = axs[1, 1]
    p1 = ((df["agentSuccess"]) & (~df["recovered"])).sum()
    rec = ((df["agentSuccess"]) & (df["recovered"])).sum()
    fl = (~df["agentSuccess"]).sum()
    dyn_cats = ["Passed on\n1st Attempt", "Recovered via\nCompiler", "Failed after\nRetries"]
    dyn_counts = [p1, rec, fl]
    dyn_colors = ["#2563EB", "#F59E0B", "#EF4444"]
    bars = ax.bar(np.arange(3), dyn_counts, color=dyn_colors, edgecolor="black", linewidth=0.8, width=0.45, zorder=3)
    ax.set_ylabel("Number of Tasks", fontweight="bold")
    ax.set_title("(D) Agent Multi-Turn Error Recovery", fontweight="bold", pad=10)
    ax.set_xticks(np.arange(3))
    ax.set_xticklabels(dyn_cats, fontweight="bold", fontsize=10)
    ax.set_ylim(0, max(dyn_counts) + 3)
    for bar, c in zip(bars, dyn_counts):
        ax.annotate(f"{c} ({c/len(df)*100:.0f}%)", xy=(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.2),
                    ha="center", fontsize=10, fontweight="bold")

    # Shared Legend at top
    handles, labels = axs[0, 0].get_legend_handles_labels()
    fig.legend(
        handles,
        labels,
        loc="upper center",
        bbox_to_anchor=(0.5, 0.945),
        ncol=2,
        frameon=True,
        facecolor="white",
        edgecolor="#cccccc",
        fontsize=12,
    )

    plt.tight_layout(rect=[0, 0, 1, 0.91])
    out_file = os.path.join(output_dir, "summary_dashboard.png")
    plt.savefig(out_file, bbox_inches="tight")
    plt.close()
    print(f"Saved: {out_file}")


def main():
    parser = argparse.ArgumentParser(description="Generate benchmark comparison plots.")
    default_agent = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "../../benchmark_results/agent_20_tasks_updated.json",
        )
    )
    default_baseline = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "../../benchmark_results/baseline_task1_fresh.json",
        )
    )
    default_out_dir = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "../../benchmark_results/plots",
        )
    )

    parser.add_argument("--agent", default=default_agent, help="Path to agent results JSON")
    parser.add_argument("--baseline", default=default_baseline, help="Path to baseline results JSON")
    parser.add_argument("--output_dir", default=default_out_dir, help="Directory to save output plots")
    args = parser.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)
    df = load_dataset(args.agent, args.baseline)
    print(f"Loaded {len(df)} matched tasks.")

    plot_pass_rate_by_prover(df, args.output_dir)
    plot_pass_rate_by_tier(df, args.output_dir)
    plot_head_to_head_outcomes(df, args.output_dir)
    plot_agent_attempt_distribution(df, args.output_dir)
    plot_summary_dashboard(df, args.output_dir)
    print(f"\nAll plots generated successfully in: {args.output_dir}")


if __name__ == "__main__":
    main()
