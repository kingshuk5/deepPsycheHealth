"use client";

import { useState } from "react";
import { BDIAnswer } from "@/app/types";
import { BDI_QUESTIONS } from "@/app/lib/data";

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
  answers: Record<number, BDIAnswer>;
  onAnswerChange: (answers: Record<number, BDIAnswer>) => void;
}

export default function Step4BDI({ onNext, onBack, answers, onAnswerChange }: Step4Props) {
  const [page, setPage] = useState(1);

  const q = BDI_QUESTIONS[page - 1];
  const totalAnswered = Object.keys(answers).length;
  const progress = (totalAnswered / 21) * 100;

  const selectOption = (qId: number, score: number, key: string, optIdx: number) => {
    const updated = { ...answers, [qId]: { score, key, optIdx } };
    onAnswerChange(updated);
    // Auto-advance after short delay
    setTimeout(() => {
      if (page < 21) setPage((p) => p + 1);
    }, 300);
  };

  const isSelected = (optIdx: number, optKey?: string): boolean => {
    const ans = answers[q.id];
    if (!ans) return false;
    if (q.isSplit && optKey) return ans.key === optKey;
    return ans.optIdx === optIdx;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">BDI-II Questionnaire</h2>
        <p className="mt-1 font-mono text-sm text-slate-400">
          {totalAnswered} of 21 questions answered — read each group carefully and select the statement that best describes the past two weeks.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        {/* Progress bar */}
        <div className="mb-5 h-[3px] w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question header */}
        <div className="mb-5 flex items-center justify-between">
          <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 font-mono text-[11px] text-slate-400">
            Question {page} of 21
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-[12px] font-medium text-slate-400 transition-all hover:border-slate-500 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <button
              onClick={() => setPage((p) => Math.min(21, p + 1))}
              disabled={page === 21}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-[12px] font-medium text-slate-400 transition-all hover:border-slate-500 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>

        {/* Question title */}
        <h3 className="mb-1 text-xl font-bold text-slate-100">
          {page}. {q.title}
        </h3>
        {q.isSplit && (
          <p className="mb-4 font-mono text-[12px] text-slate-500">
            Note: Choose only one option from this group, including today.
          </p>
        )}
        {!q.isSplit && <div className="mb-4" />}

        {/* Options */}
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const selected = isSelected(i, opt.key);
            const scoreLabel = q.isSplit ? (opt.key ?? String(opt.score)) : String(opt.score);
            return (
              <button
                key={q.isSplit ? opt.key : i}
                onClick={() => selectOption(q.id, opt.score, opt.key ?? String(i), i)}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-150 ${
                  selected
                    ? "border-cyan-500/50 bg-cyan-500/6"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/50"
                }`}
              >
                {/* Radio circle */}
                <span
                  className={`mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150 ${
                    selected ? "border-cyan-400" : "border-slate-600"
                  }`}
                >
                  {selected && (
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  )}
                </span>

                {/* Text */}
                <span className={`flex-1 text-[14px] leading-relaxed ${selected ? "text-slate-100" : "text-slate-300"}`}>
                  {opt.text}
                </span>

                {/* Score badge */}
                <span
                  className={`mt-0.5 flex-shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] transition-all ${
                    selected
                      ? "bg-cyan-500/15 text-cyan-400"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {scoreLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Pagination dots */}
        <div className="mt-6 flex flex-wrap gap-1.5">
          {BDI_QUESTIONS.map((qq, i) => {
            const isAnswered = !!answers[qq.id];
            const isActive = i + 1 === page;
            return (
              <button
                key={qq.id}
                onClick={() => setPage(i + 1)}
                className={`flex h-7 w-7 items-center justify-center rounded-md font-mono text-[11px] transition-all duration-150 ${
                  isActive
                    ? "border border-cyan-500 bg-cyan-500/10 text-cyan-400"
                    : isAnswered
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border border-slate-800 bg-transparent text-slate-500 hover:border-slate-600 hover:text-slate-300"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={onBack}
          className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-400 transition-all hover:border-slate-500 hover:text-slate-200"
        >
          ← Back
        </button>
        {totalAnswered === 21 ? (
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-2.5 text-sm font-bold text-slate-950 transition-all hover:opacity-90 active:scale-95"
          >
            View Results →
          </button>
        ) : (
          <button
            onClick={() => setPage((p) => Math.min(21, p + 1))}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-2.5 text-sm font-bold text-slate-950 transition-all hover:opacity-90 active:scale-95"
          >
            Next Question →
          </button>
        )}
        {totalAnswered < 21 && (
          <span className="self-center font-mono text-[12px] text-slate-600">
            {21 - totalAnswered} remaining
          </span>
        )}
      </div>
    </div>
  );
}
