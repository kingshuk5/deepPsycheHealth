export type Step = 1 | 2 | 3 | 4 | 5;

export type WsStatus = "disconnected" | "connecting" | "connected" | "error";

export type Gender = "male" | "female" | "non-binary" | "prefer-not-to-say" | "other";

/** User registration data captured in Step 1 */
export interface UserProfile {
  name: string;
  contactNumber: string;
  age: number | "";
  gender: Gender | "";
  email: string; // optional — can be empty string
}

export interface BDIOption {
  score: number;
  key?: string;
  text: string;
}

export interface BDIQuestion {
  id: number;
  title: string;
  isSplit?: boolean;
  options: BDIOption[];
}

export interface BDIAnswer {
  score: number;
  key: string;
  optIdx: number;
}

/** Gemini LLM NLP result */
export interface NLPResult {
  depressionDetected: boolean;
  suicidalContent: boolean;
  sentimentScore: number;
  briefAnalysis: string;
}

/** BERT microservice classification result */
export interface BERTResult {
  label: string;          // e.g. "depressed" | "not depressed"
  confidence: number;     // 0.0 – 1.0
  rawResponse?: unknown;  // full response payload for debugging
}

export interface EmotionEntry {
  emotion: string;
  timestamp: number;
}

export type EmotionKey =
  | "happy"
  | "sad"
  | "angry"
  | "fear"
  | "surprise"
  | "disgust"
  | "neutral"
  | "contempt"
  | "default";

export interface BDILevel {
  min: number;
  max: number;
  label: string;
  color: string;
  desc: string;
}

/** Full assessment document persisted to MongoDB */
export interface AssessmentDocument {
  createdAt: string;
  userProfile: UserProfile;
  facialExpressions: {
    log: EmotionEntry[];
    frameCount: number;
    uniqueEmotions: string[];
  };
  nlpAnalysis: {
    inputText: string;
    geminiResult: NLPResult | null;
    bertResult: BERTResult | null;
  };
  bdiAssessment: {
    answers: Record<number, BDIAnswer>;
    totalScore: number;
    severityLabel: string;
    severityColor: string;
  };
}
