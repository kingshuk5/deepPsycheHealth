"use client";

import { Step } from "@/app/types";

interface StepHeaderProps {
  currentStep: Step;
}

const STEP_LABELS: Record<Step, string> = {
  1: "Registration",
  2: "Face Stream",
  3: "NLP Analysis",
  4: "BDI-II",
  5: "Results",
};

export default function StepHeader({ currentStep }: StepHeaderProps) {
  const steps: Step[] = [1, 2, 3, 4, 5];

  return (
    <header className="mb-10 flex items-center justify-between border-b border-slate-800 pb-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 text-base">
          🧠
        </div>
        <span className="text-[15px] font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 bg-clip-text text-transparent">
          DeepPsyche Health
        </span>
      </div>

      {/* Step dots + label */}
      <div className="flex items-center gap-2">
        {steps.map((s) => {
          const isActive = s === currentStep;
          const isDone = s < currentStep;
          return (
            <div
              key={s}
              className={`h-2 w-2 rounded-full border transition-all duration-300 ${
                isActive
                  ? "border-cyan-400 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                  : isDone
                  ? "border-teal-500 bg-teal-500"
                  : "border-slate-700 bg-transparent"
              }`}
              title={STEP_LABELS[s]}
            />
          );
        })}
        <span className="ml-2 font-mono text-[11px] text-slate-500">
          {STEP_LABELS[currentStep]} · {currentStep}/5
        </span>
      </div>
    </header>
  );
}
