import { NLPResult } from "@/app/types";

const SYSTEM_PROMPT = `You are a clinical NLP assistant specialized in mental health screening.
Analyze the provided text ONLY for depression-related indicators.
Return ONLY a valid JSON object with no markdown, no explanation, no preamble.
The JSON must have exactly these four keys:
- "depressionDetected": boolean
- "suicidalContent": boolean
- "sentimentScore": number between 0.0 and 1.0 (1.0 = most positive/healthy, 0.0 = most distressed)
- "briefAnalysis": string (2-3 sentences of plain clinical observation)`;

export async function analyzeWithGemini(text: string): Promise<NLPResult> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error(
      "Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file."
    );
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: [
      {
        parts: [{ text }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const errMsg = (errData as { error?: { message?: string } }).error?.message || `HTTP ${response.status}`;
    throw new Error(`Gemini API error: ${errMsg}`);
  }

  const data = await response.json();
  const rawText: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  // Strip any accidental markdown fences
  const cleaned = rawText.replace(/```json|```/gi, "").trim();

  let parsed: NLPResult;
  try {
    parsed = JSON.parse(cleaned) as NLPResult;
  } catch {
    throw new Error("Failed to parse Gemini response as JSON. Raw output: " + rawText.slice(0, 200));
  }

  // Validate shape
  if (
    typeof parsed.depressionDetected !== "boolean" ||
    typeof parsed.suicidalContent !== "boolean" ||
    typeof parsed.sentimentScore !== "number" ||
    typeof parsed.briefAnalysis !== "string"
  ) {
    throw new Error("Gemini returned unexpected JSON structure.");
  }

  return parsed;
}
