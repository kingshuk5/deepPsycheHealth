"use client";

import { useEffect, useState } from "react";
import { BDIAnswer, NLPResult, BERTResult, EmotionEntry, EmotionKey, UserProfile, AssessmentDocument } from "@/app/types";
import { BDI_QUESTIONS, BDI_LEVELS, EMOTION_COLORS } from "@/app/lib/data";

interface Step5Props {
  userProfile: UserProfile;
  answers: Record<number, BDIAnswer>;
  nlpResult: NLPResult | null;
  bertResult: BERTResult | null;
  nlpText: string;
  emotionLog: EmotionEntry[];
  frameCount: number;
  onRestart: () => void;
}

export default function Step5Results({
  userProfile,
  answers,
  nlpResult,
  bertResult,
  nlpText,
  emotionLog,
  frameCount,
  onRestart,
}: Step5Props) {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState("");

  const totalScore = Object.values(answers).reduce((s, a) => s + a.score, 0);
  const level = BDI_LEVELS.find((l) => totalScore >= l.min && totalScore <= l.max) ?? BDI_LEVELS[BDI_LEVELS.length - 1];

  // Gauge
  const GAUGE_MAX = 63;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const filled = Math.min((totalScore / GAUGE_MAX) * circumference, circumference);

  const uniqueEmotions = [...new Set(emotionLog.map((e) => e.emotion))];

  const wellnessColor = nlpResult
    ? nlpResult.sentimentScore > 0.6 ? "#34d399"
    : nlpResult.sentimentScore > 0.3 ? "#fbbf24" : "#fb7185"
    : "#94a3b8";

  const bertColor = bertResult?.label?.toLowerCase().includes("not") ? "#34d399" : "#fb7185";

  // Save to MongoDB on mount
  useEffect(() => {
    const save = async () => {
      setSaveStatus("saving");
      const doc: AssessmentDocument = {
        createdAt: new Date().toISOString(),
        userProfile,
        facialExpressions: { log: emotionLog, frameCount, uniqueEmotions },
        nlpAnalysis: { inputText: nlpText, geminiResult: nlpResult, bertResult },
        bdiAssessment: {
          answers,
          totalScore,
          severityLabel: level.label,
          severityColor: level.color,
        },
      };
      try {
        const res = await fetch("/api/save-assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(doc),
        });
        const json = await res.json() as { success: boolean; error?: string };
        if (json.success) {
          setSaveStatus("saved");
        } else {
          throw new Error(json.error || "Unknown error");
        }
      } catch (e) {
        setSaveStatus("error");
        setSaveError(e instanceof Error ? e.message : "Save failed");
      }
    };
    save();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Holistic Diagnostic Results</h2>
        <p className="mt-1 font-mono text-sm text-slate-400">
          Combined analysis from all three assessment modules.
        </p>
      </div>

      {/* Save status banner */}
      {saveStatus === "saving" && (
        <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 font-mono text-[12px] text-slate-400">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-600 border-t-cyan-400" />
          Saving session to database...
        </div>
      )}
      {saveStatus === "saved" && (
        <div className="mb-4 rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3 font-mono text-[12px] text-emerald-400">
          ✓ Session saved to DeepPsyche Health database.
        </div>
      )}
      {saveStatus === "error" && (
        <div className="mb-4 rounded-xl border border-amber-500/25 bg-amber-500/8 px-4 py-3 font-mono text-[12px] text-amber-400">
          ⚠ Could not save to database: {saveError}. Your results are still shown below.
        </div>
      )}

      <div className="space-y-4">
        {/* ── User profile summary ── */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">Patient Profile</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
            {[
              { label: "Name", value: userProfile.name },
              { label: "Age", value: String(userProfile.age) },
              { label: "Gender", value: userProfile.gender || "—" },
              { label: "Contact", value: userProfile.contactNumber },
            ].map((f) => (
              <div key={f.label}>
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-600">{f.label}</p>
                <p className="mt-0.5 text-[14px] font-semibold capitalize text-slate-200">{f.value}</p>
              </div>
            ))}
            {userProfile.email && (
              <div className="col-span-2">
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-600">Email</p>
                <p className="mt-0.5 text-[14px] font-semibold text-slate-200">{userProfile.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── BDI score gauge ── */}
        <div className="flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:flex-row sm:items-center">
          <div className="relative mx-auto h-36 w-36 flex-shrink-0 sm:mx-0">
            <svg viewBox="0 0 140 140" className="h-full w-full">
              <circle cx="70" cy="70" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
              <circle
                cx="70" cy="70" r={radius} fill="none"
                stroke={level.color} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${filled} ${circumference - filled}`}
                strokeDashoffset="0"
                transform="rotate(-90 70 70)"
                style={{ transition: "stroke-dasharray 1.2s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-4xl font-extrabold" style={{ color: level.color }}>{totalScore}</span>
              <span className="font-mono text-[11px] text-slate-500">/ 63</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xl font-bold" style={{ color: level.color }}>{level.label}</p>
            <p className="mt-2 font-mono text-[13px] leading-relaxed text-slate-400">{level.desc}</p>
            <p className="mt-3 font-mono text-[12px] text-slate-600">
              BDI-II total score: <strong className="text-slate-300">{totalScore}</strong> (range 0–63)
            </p>
            {totalScore >= 17 && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/8 px-3 py-2.5 font-mono text-[12px] text-amber-400">
                <span>⚕</span><span>Your score suggests professional consultation is advisable.</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Dual NLP results ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Gemini */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-md bg-indigo-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-indigo-400">Gemini</span>
            </div>
            {nlpResult ? (
              <>
                <p className="font-mono text-[13px] leading-relaxed text-slate-400">{nlpResult.briefAnalysis}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full px-2.5 py-1 font-mono text-[10px] font-medium"
                    style={{ background: nlpResult.depressionDetected ? "rgba(251,113,133,0.1)" : "rgba(52,211,153,0.1)", color: nlpResult.depressionDetected ? "#fb7185" : "#34d399", border: `1px solid ${nlpResult.depressionDetected ? "rgba(251,113,133,0.3)" : "rgba(52,211,153,0.3)"}` }}>
                    Depression: {nlpResult.depressionDetected ? "Detected" : "Not Detected"}
                  </span>
                  <span className="rounded-full px-2.5 py-1 font-mono text-[10px] font-medium"
                    style={{ background: `${wellnessColor}15`, color: wellnessColor, border: `1px solid ${wellnessColor}30` }}>
                    Wellness: {Math.round(nlpResult.sentimentScore * 100)}%
                  </span>
                </div>
              </>
            ) : (
              <p className="font-mono text-[13px] text-slate-600">Gemini analysis not performed.</p>
            )}
          </div>

          {/* BERT */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-md bg-teal-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-teal-400">BERT</span>
            </div>
            {bertResult ? (
              <>
                <div className="mb-3 flex gap-3">
                  <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-center">
                    <p className="font-mono text-base font-bold capitalize" style={{ color: bertColor }}>{bertResult.label}</p>
                    <p className="font-mono text-[9px] uppercase tracking-wide text-slate-500">Classification</p>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-center">
                    <p className="font-mono text-base font-bold text-cyan-400">{(bertResult.confidence * 100).toFixed(1)}%</p>
                    <p className="font-mono text-[9px] uppercase tracking-wide text-slate-500">Confidence</p>
                  </div>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${bertResult.confidence * 100}%`, background: `linear-gradient(90deg, ${bertColor}, #22d3ee)` }} />
                </div>
              </>
            ) : (
              <p className="font-mono text-[13px] text-slate-600">BERT analysis not performed.</p>
            )}
          </div>
        </div>

        {/* ── Facial expressions ── */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">Facial Expression Capture</p>
          {uniqueEmotions.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {uniqueEmotions.map((e) => {
                const c = EMOTION_COLORS[e.toLowerCase() as EmotionKey] || EMOTION_COLORS.default;
                return (
                  <span key={e} className="rounded-full px-2.5 py-1 font-mono text-[10px] font-medium"
                    style={{ background: c + "22", color: c, border: `1px solid ${c}44` }}>
                    {e}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="font-mono text-[13px] text-slate-600">No facial data captured in this session.</p>
          )}
          <p className="mt-3 font-mono text-[11px] text-slate-600">{frameCount} frames analyzed</p>
        </div>

        {/* ── BDI-II item breakdown ── */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-slate-500">BDI-II Item Breakdown</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {BDI_QUESTIONS.map((q) => {
              const ans = answers[q.id];
              const score = ans?.score ?? 0;
              return (
                <div key={q.id}>
                  <div className="mb-1 flex justify-between font-mono text-[12px]">
                    <span className="text-slate-500">{q.id}. {q.title}</span>
                    <span className="text-slate-300">{score}</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-1000"
                      style={{ width: `${(score / 3) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Emergency Mental Health Resources ── */}
        <div className="rounded-2xl border-2 border-rose-500/30 bg-rose-500/5 p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">🆘</span>
            <div>
              <p className="text-[16px] font-bold text-rose-400">Emergency Mental Health Resources</p>
              <p className="font-mono text-[12px] text-rose-400/60">India · Available 24/7</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { name: "Tele-MANAS", number: "14416", desc: "National tele-mental health service — 24/7, free, multilingual" },
              { name: "Psycho-social & First-aid Counselling", number: "8448-8448-453", desc: "Psycho-social first-aid, crisis counselling helpline" },
              { name: "KIRAN Helpline", number: "1800-599-0019", desc: "National mental health rehabilitation helpline — toll-free 24/7" },
              { name: "NIMHANS Helpline", number: "080-4611-0007", desc: "National Institute of Mental Health & Neurosciences, Bengaluru" },
            ].map((r) => (
              <div key={r.name} className="rounded-xl border border-rose-500/20 bg-rose-500/8 p-4">
                <p className="mb-0.5 font-mono text-[11px] uppercase tracking-wider text-rose-400/60">{r.name}</p>
                <p className="font-mono text-2xl font-extrabold text-rose-400">{r.number}</p>
                <p className="mt-1 font-mono text-[11px] leading-relaxed text-rose-400/50">{r.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono text-[11px] text-rose-400/40">
            If you are in immediate danger, please call emergency services (112) or go to your nearest hospital.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl border border-rose-500/15 bg-rose-500/5 px-5 py-4 font-mono text-[12px] leading-relaxed text-rose-400/70">
          ⚠ <strong className="text-rose-400/90">Disclaimer:</strong> This tool provides informational screening only and does not constitute a clinical diagnosis. Please consult a licensed mental health professional for a proper evaluation and treatment plan.
        </div>

        <button onClick={onRestart} className="flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-400 transition-all hover:border-slate-500 hover:text-slate-200">
          ↺ Start New Assessment
        </button>
      </div>
    </div>
  );
}
