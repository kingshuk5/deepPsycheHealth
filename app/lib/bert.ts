import { BERTResult } from "@/app/types";

const BERT_BASE_URL = process.env.NEXT_PUBLIC_BERT_API_URL?.replace(/\/$/, "");

/**
 * Sends the user's text to the BERT microservice for depression classification.
 * Tries /predict first, then falls back to the root endpoint.
 */
export async function analyzeWithBERT(text: string): Promise<BERTResult> {
  // Try /predict sub-route first, then root
  const endpoints = [ `${BERT_BASE_URL}/`];

  let lastError: Error = new Error("No endpoints tried");

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: AbortSignal.timeout(15_000), // 15 s timeout
      });

      if (!response.ok) {
        lastError = new Error(`BERT API responded with HTTP ${response.status}`);
        continue;
      }

      const data = (await response.json()) as Record<string, unknown>;

      // Normalise varied response shapes from different BERT server implementations
      const label =
        (data.label as string) ||
        (data.prediction as string) ||
        (data.result as string) ||
        (data.class as string) ||
        "unknown";

      const confidence =
        typeof data.confidence === "number"
          ? data.confidence
          : typeof data.score === "number"
          ? data.score
          : typeof data.probability === "number"
          ? data.probability
          : 0;

      return { label, confidence, rawResponse: data };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw new Error(`BERT analysis failed: ${lastError.message}`);
}
