"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { WsStatus, EmotionEntry, EmotionKey } from "@/app/types";
import { useWebSocketStream } from "@/app/lib/useWebSocketStream";
import { EMOTION_COLORS } from "@/app/lib/data";

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
  onExpressionsUpdate: (entries: EmotionEntry[], frameCount: number) => void;
}

const WS_STATUS_MAP: Record<WsStatus, { dot: string; label: string }> = {
  connected: { dot: "bg-emerald-400 animate-pulse", label: "Live" },
  connecting: { dot: "bg-amber-400 animate-pulse", label: "Connecting..." },
  disconnected: { dot: "bg-slate-500", label: "Disconnected" },
  error: { dot: "bg-rose-500", label: "Error" },
};

export default function Step2Webcam({ onNext, onBack, onExpressionsUpdate }: Step2Props) {
  const webcamRef = useRef<Webcam>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

  const [wsStatus, setWsStatus] = useState<WsStatus>("disconnected");
  const [isStreaming, setIsStreaming] = useState(false);
  const [camError, setCamError] = useState("");
  const [currentEmotion, setCurrentEmotion] = useState("");
  const [emotionLog, setEmotionLog] = useState<EmotionEntry[]>([]);
  const [frameCount, setFrameCount] = useState(0);

  const handleMessage = useCallback((emotion: string) => {
    setCurrentEmotion(emotion);
    setEmotionLog((prev) => {
      const next = [...prev, { emotion, timestamp: Date.now() }];
      if (next.length > 60) next.shift();
      return next;
    });
  }, []);

  const { connect, disconnect, getFrameCount } = useWebSocketStream({
    onMessage: handleMessage,
    onStatusChange: setWsStatus,
  });

  // Sync frame count to state every second
  useEffect(() => {
    if (!isStreaming) return;
    const id = setInterval(() => setFrameCount(getFrameCount()), 1000);
    return () => clearInterval(id);
  }, [isStreaming, getFrameCount]);

  // Propagate log + frame count to parent AFTER render, never during
  useEffect(() => {
    onExpressionsUpdate(emotionLog, frameCount);
  }, [emotionLog, frameCount, onExpressionsUpdate]);

  const startStream = useCallback(async () => {
    setCamError("");
    const video = webcamRef.current?.video;
    const canvas = hiddenCanvasRef.current;
    if (!video || !canvas) {
      setCamError("Webcam element not ready. Please try again.");
      return;
    }
    setIsStreaming(true);
    connect(video, canvas);
  }, [connect]);

  const stopStream = useCallback(() => {
    disconnect();
    setIsStreaming(false);
    setCurrentEmotion("");
  }, [disconnect]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const emotionColor =
    (EMOTION_COLORS[currentEmotion.toLowerCase() as EmotionKey] ||
      EMOTION_COLORS.default) ?? "#22d3ee";

  const recentLog = emotionLog.slice(-16);
  const statusInfo = WS_STATUS_MAP[wsStatus];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Live Facial Expression Stream</h2>
        <p className="mt-1 font-mono text-sm text-slate-400">
          Real-time affective state analysis via WebSocket frame streaming at 200ms intervals.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Camera panel */}
          <div>
            <div className="relative overflow-hidden rounded-xl border border-slate-700 bg-black aspect-[4/3] flex items-center justify-center">
              {/* Webcam */}
              <Webcam
                ref={webcamRef}
                audio={false}
                mirrored
                className="h-full w-full object-cover"
                videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
                onUserMediaError={() => {
                  setCamError("Camera access denied. Please allow webcam access.");
                  setIsStreaming(false);
                }}
              />

              {/* Viewfinder corners */}
              <div className="pointer-events-none absolute inset-0">
                <span className="absolute top-2.5 left-2.5 h-5 w-5 border-t-2 border-l-2 border-cyan-400/70 rounded-tl" />
                <span className="absolute top-2.5 right-2.5 h-5 w-5 border-t-2 border-r-2 border-cyan-400/70 rounded-tr" />
                <span className="absolute bottom-2.5 left-2.5 h-5 w-5 border-b-2 border-l-2 border-cyan-400/70 rounded-bl" />
                <span className="absolute bottom-2.5 right-2.5 h-5 w-5 border-b-2 border-r-2 border-cyan-400/70 rounded-br" />
                {/* Scan line */}
                {isStreaming && (
                  <div className="absolute left-2.5 right-2.5 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-[scanline_3s_linear_infinite]" />
                )}
              </div>

              {/* WS Status badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-sm">
                <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
                <span className="font-mono text-[10px] text-slate-300">{statusInfo.label}</span>
              </div>
            </div>

            {/* Hidden canvas for frame capture */}
            <canvas ref={hiddenCanvasRef} className="hidden" />

            {camError && (
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[12px] font-mono text-rose-400">
                ⚠ {camError}
              </div>
            )}

            <button
              onClick={isStreaming ? stopStream : startStream}
              className={`mt-3 w-full rounded-lg border px-4 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                isStreaming
                  ? "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/15"
                  : "border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/15"
              }`}
            >
              {isStreaming ? "⏹ Stop Camera & Stream" : "▶ Start Camera & Connect"}
            </button>
          </div>

          {/* Analytics panel */}
          <div className="flex flex-col gap-4">
            {/* Current expression */}
            <div>
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Current Expression
              </p>
              <div className="flex min-h-[80px] flex-col justify-center rounded-xl border border-slate-800 bg-slate-950 p-4">
                {currentEmotion ? (
                  <>
                    <p
                      className="text-2xl font-bold capitalize transition-colors duration-500"
                      style={{ color: emotionColor }}
                    >
                      {currentEmotion}
                    </p>
                    <p
                      className="mt-1 font-mono text-[11px]"
                      style={{ color: emotionColor + "80" }}
                    >
                      ● active signal
                    </p>
                  </>
                ) : (
                  <p className="text-2xl font-bold text-slate-600">—</p>
                )}
              </div>
            </div>

            {/* Expression log */}
            <div>
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Expression Log
              </p>
              <div className="min-h-[80px] rounded-xl border border-slate-800 bg-slate-950 p-3">
                {recentLog.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {recentLog.map((e, i) => {
                      const c =
                        EMOTION_COLORS[e.emotion.toLowerCase() as EmotionKey] ||
                        EMOTION_COLORS.default;
                      return (
                        <span
                          key={i}
                          className="rounded-full px-2 py-0.5 font-mono text-[10px] font-medium"
                          style={{
                            background: c + "22",
                            color: c,
                            border: `1px solid ${c}44`,
                          }}
                        >
                          {e.emotion}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="font-mono text-[12px] text-slate-600">
                    Waiting for data...
                  </p>
                )}
              </div>
            </div>

            {/* Frame counter */}
            <div>
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Frames Analyzed
              </p>
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div>
                  <p className="font-mono text-3xl font-bold text-cyan-400">{frameCount}</p>
                  <p className="font-mono text-[10px] text-slate-500">frames sent</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[11px] text-slate-500">200ms interval</p>
                  <p className="font-mono text-[11px] text-slate-500">JPEG · 320×240</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={onBack}
          className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-400 transition-all hover:border-slate-500 hover:text-slate-200"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-2.5 text-sm font-bold text-slate-950 transition-all hover:opacity-90 active:scale-95"
        >
          Continue to NLP Analysis →
        </button>
      </div>
    </div>
  );
}
