"use client";

import { useState } from "react";
import { NLPResult, BERTResult } from "@/app/types";
import { analyzeWithGemini } from "@/app/lib/gemini";
import { analyzeWithBERT } from "@/app/lib/bert";

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
  onResultUpdate: (gemini: NLPResult | null, bert: BERTResult | null) => void;
  savedText: string;
  onTextChange: (text: string) => void;
  savedGeminiResult: NLPResult | null;
  savedBertResult: BERTResult | null;
}

export default function Step3NLP({
  onNext,
  onBack,
  onResultUpdate,
  savedText,
  onTextChange,
  savedGeminiResult,
  savedBertResult,
}: Step3Props) {
  const [text, setText] = useState(savedText);
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [bertLoading, setBertLoading] = useState(false);
  const [geminiError, setGeminiError] = useState("");
  const [bertError, setBertError] = useState("");
  const [geminiResult, setGeminiResult] = useState<NLPResult | null>(savedGeminiResult);
  const [bertResult, setBertResult] = useState<BERTResult | null>(savedBertResult);

  const handleTextChange = (val: string) => {
    setText(val);
    onTextChange(val);
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setGeminiError("Please write something before analyzing.");
      return;
    }
    setGeminiError("");
    setBertError("");

    // Run both pipelines concurrently
    setGeminiLoading(true);
    setBertLoading(true);
    setGeminiResult(null);
    setBertResult(null);
    onResultUpdate(null, null);

    // Gemini pipeline
    analyzeWithGemini(text)
      .then((res) => {
        setGeminiResult(res);
        onResultUpdate(res, bertResult);
      })
      .catch((e: Error) => setGeminiError(e.message))
      .finally(() => setGeminiLoading(false));

    // BERT pipeline
    analyzeWithBERT(text)
      .then((res) => {
        setBertResult(res);
        onResultUpdate(geminiResult, res);
      })
      .catch((e: Error) => setBertError(e.message))
      .finally(() => setBertLoading(false));
  };

  const isAnalyzing = geminiLoading || bertLoading;
  const scoreColor = geminiResult
    ? geminiResult.sentimentScore > 0.6 ? "#34d399"
    : geminiResult.sentimentScore > 0.3 ? "#fbbf24"
    : "#fb7185"
    : "#94a3b8";

  const bertColor =
    bertResult?.label?.toLowerCase().includes("not") ? "#34d399" : "#fb7185";

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Expression & Sentiment Analysis</h2>
        <p className="mt-1 font-mono text-sm text-slate-400">
          Dual NLP pipeline: Gemini 2.5 Flash + BERT classifier running concurrently.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        {/* Info */}
        <div className="mb-5 rounded-lg border border-blue-500/15 bg-blue-500/6 px-4 py-3 font-mono text-[12px] text-blue-400/80">
          Gemini uses{" "}
          <code className="rounded bg-slate-800 px-1 py-0.5 text-[11px] text-blue-300">
            NEXT_PUBLIC_GEMINI_API_KEY
          </code>{" "}
          · BERT targets{" "}
          <code className="rounded bg-slate-800 px-1 py-0.5 text-[11px] text-blue-300">
            NEXT_PUBLIC_BERT_API_URL
          </code>{" "}
          (default: <code className="text-blue-300">http://localhost:8000</code>)
        </div>

        {/* Textarea */}
        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-slate-500">
          How have you been feeling? (past two weeks)
        </label>
        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Write freely about your mood, energy levels, sleep patterns, relationships, or anything on your mind..."
          rows={7}
          className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-sans text-[14px] leading-relaxed text-slate-200 placeholder:font-mono placeholder:text-[13px] placeholder:text-slate-600 focus:border-cyan-500/40 focus:outline-none transition-colors duration-200"
        />
        <div className="mb-4 mt-1.5 text-right font-mono text-[11px] text-slate-600">
          {text.length} characters
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 text-sm font-bold text-slate-950 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
              Analyzing...
            </>
          ) : "Run Dual NLP Analysis →"}
        </button>

        {/* ── Side-by-side result cards ── */}
        {(geminiLoading || geminiResult || geminiError || bertLoading || bertResult || bertError) && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* ── Gemini Card ── */}
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-md bg-indigo-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-indigo-400">
                  Gemini 2.5 Flash
                </span>
                {geminiLoading && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-400" />
                )}
              </div>

              {geminiLoading && (
                <p className="font-mono text-[12px] text-slate-500">Running LLM analysis...</p>
              )}

              {geminiError && !geminiLoading && (
                <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 font-mono text-[12px] text-rose-400">
                  <span>⚠</span><span>{geminiError}</span>
                </div>
              )}

              {geminiResult && !geminiLoading && (
                <>
                  <div className="mb-3 grid grid-cols-3 gap-2">
                    {[
                      { val: geminiResult.depressionDetected ? "Yes" : "No", label: "Depression", color: geminiResult.depressionDetected ? "#fb7185" : "#34d399" },
                      { val: geminiResult.suicidalContent ? "Alert" : "Clear", label: "Crisis", color: geminiResult.suicidalContent ? "#fb7185" : "#34d399" },
                      { val: `${Math.round(geminiResult.sentimentScore * 100)}%`, label: "Wellness", color: scoreColor },
                    ].map((m) => (
                      <div key={m.label} className="rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-center">
                        <p className="font-mono text-base font-bold" style={{ color: m.color }}>{m.val}</p>
                        <p className="font-mono text-[9px] uppercase tracking-wide text-slate-500">{m.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 font-mono text-[12px] leading-relaxed text-slate-400">
                    {geminiResult.briefAnalysis}
                  </p>
                  {geminiResult.depressionDetected && (
                    <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/8 px-3 py-2 font-mono text-[12px] text-amber-400">
                      <span>⚠</span>
                      <span>Depression markers detected. Professional consultation recommended.</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── BERT Card ── */}
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-md bg-teal-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-teal-400">
                  BERT NLP Analysis
                </span>
                {bertLoading && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-700 border-t-teal-400" />
                )}
              </div>

              {bertLoading && (
                <p className="font-mono text-[12px] text-slate-500">Querying BERT classifier...</p>
              )}

              {bertError && !bertLoading && (
                <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 font-mono text-[12px] text-rose-400">
                  <span>⚠</span>
                  <div>
                    <p>{bertError}</p>
                    <p className="mt-1 text-rose-400/60 text-[11px]">
                      Make sure your BERT server is running on{" "}
                      {process.env.NEXT_PUBLIC_BERT_API_URL || "http://localhost:8000"}
                    </p>
                  </div>
                </div>
              )}

              {bertResult && !bertLoading && (
                <>
                  <div className="mb-3 grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-center">
                      <p className="font-mono text-base font-bold capitalize" style={{ color: bertColor }}>
                        {bertResult.label}
                      </p>
                      <p className="font-mono text-[9px] uppercase tracking-wide text-slate-500">Classification</p>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-center">
                      <p className="font-mono text-base font-bold text-cyan-400">
                        {(bertResult.confidence * 100).toFixed(1)}%
                      </p>
                      <p className="font-mono text-[9px] uppercase tracking-wide text-slate-500">Confidence</p>
                    </div>
                  </div>
                  {/* Confidence bar */}
                  <div className="mb-2">
                    <div className="mb-1 flex justify-between font-mono text-[10px] text-slate-500">
                      <span>Confidence</span>
                      <span>{(bertResult.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${bertResult.confidence * 100}%`,
                          background: `linear-gradient(90deg, ${bertColor}, #22d3ee)`,
                        }}
                      />
                    </div>
                  </div>
                  <p className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 font-mono text-[12px] text-slate-400">
                    BERT model classified input as{" "}
                    <strong className="capitalize" style={{ color: bertColor }}>
                      {bertResult.label}
                    </strong>{" "}
                    with {(bertResult.confidence * 100).toFixed(1)}% confidence.
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Crisis box — shown if either model flags it */}
        {(geminiResult?.suicidalContent) && (
          <div className="mt-5 rounded-xl border-2 border-rose-500/40 bg-rose-500/12 p-5">
            <p className="mb-3 text-[15px] font-bold text-rose-400">⚠ Crisis Support — Please Reach Out Now</p>
            <p className="mb-4 font-mono text-[12px] text-rose-300/80">Content suggesting risk of self-harm detected. You are not alone. Please contact one of these resources immediately:</p>
            <div className="space-y-3">
              {[
                { number: "Tele-MANAS: 14416", label: "National tele-mental health service, 24/7" },
                { number: "988", label: "Suicide & Crisis Lifeline (US) — call or text" },
                { number: "iCall: 9152987821", label: "iCall India — Mon–Sat, 8am–10pm" },
                { number: "AASRA: 9820466627", label: "AASRA India — 24/7 crisis support" },
              ].map((r) => (
                <div key={r.number}>
                  <p className="font-mono text-xl font-extrabold text-rose-400">{r.number}</p>
                  <p className="font-mono text-[11px] text-rose-400/60">{r.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={onBack} className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-400 transition-all hover:border-slate-500 hover:text-slate-200">
          ← Back
        </button>
        <button onClick={onNext} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-2.5 text-sm font-bold text-slate-950 transition-all hover:opacity-90 active:scale-95">
          Continue to BDI-II →
        </button>
      </div>
    </div>
  );
}
