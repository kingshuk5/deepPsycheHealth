"use client";

import { useRef, useCallback } from "react";
import { WsStatus } from "@/app/types";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  "wss://depression-detection-fast-api-backend.onrender.com/ws/stream";

interface UseWebSocketStreamOptions {
  onMessage: (emotion: string) => void;
  onStatusChange: (status: WsStatus) => void;
}

export function useWebSocketStream({
  onMessage,
  onStatusChange,
}: UseWebSocketStreamOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameCountRef = useRef(0);

  const startFrameLoop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ws = wsRef.current;

      if (!video || !canvas || !ws || ws.readyState !== WebSocket.OPEN) return;

      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, 320, 240);
      canvas.toBlob(
        (blob) => {
          if (blob && wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(blob);
            frameCountRef.current += 1;
          }
        },
        "image/jpeg",
        0.7
      );
    }, 200);
  }, []);

  const connect = useCallback(
    (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
      videoRef.current = video;
      canvasRef.current = canvas;
      frameCountRef.current = 0;
      onStatusChange("connecting");

      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          onStatusChange("connected");
          startFrameLoop();
        };

        ws.onmessage = (event: MessageEvent) => {
          try {
            // Backend may send JSON or plain string
            if (typeof event.data === "string") {
              try {
                const parsed = JSON.parse(event.data) as Record<string, unknown>;
                const emotion =
                  (parsed.emotion as string) ||
                  (parsed.expression as string) ||
                  (parsed.result as string) ||
                  "";
                if (emotion) onMessage(emotion);
              } catch {
                if (event.data.trim()) onMessage(event.data.trim());
              }
            }
          } catch {
            // silently ignore parse errors
          }
        };

        ws.onerror = () => {
          onStatusChange("error");
        };

        ws.onclose = () => {
          onStatusChange("disconnected");
          if (intervalRef.current) clearInterval(intervalRef.current);
        };
      } catch {
        onStatusChange("error");
      }
    },
    [onMessage, onStatusChange, startFrameLoop]
  );

  const disconnect = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    frameCountRef.current = 0;
  }, []);

  const getFrameCount = useCallback(() => frameCountRef.current, []);

  return { connect, disconnect, getFrameCount };
}
