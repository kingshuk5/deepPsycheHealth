"use client";

import { useState, useCallback } from "react";
import { Step, BDIAnswer, NLPResult, BERTResult, EmotionEntry, UserProfile } from "@/app/types";
import StepHeader from "@/app/components/StepHeader";
import Step1Welcome from "@/app/components/Step1Welcome";
import Step2Webcam from "@/app/components/Step2Webcam";
import Step3NLP from "@/app/components/Step3NLP";
import Step4BDI from "@/app/components/Step4BDI";
import Step5Results from "@/app/components/Step5Results";

const EMPTY_PROFILE: UserProfile = {
  name: "",
  contactNumber: "",
  age: "",
  gender: "",
  email: "",
};

export default function HomePage() {
  const [step, setStep] = useState<Step>(1);

  // Step 1 — user profile
  const [userProfile, setUserProfile] = useState<UserProfile>(EMPTY_PROFILE);

  // Step 2 — facial expressions
  const [emotionLog, setEmotionLog] = useState<EmotionEntry[]>([]);
  const [frameCount, setFrameCount] = useState(0);

  // Step 3 — dual NLP
  const [userText, setUserText] = useState("");
  const [nlpResult, setNlpResult] = useState<NLPResult | null>(null);
  const [bertResult, setBertResult] = useState<BERTResult | null>(null);

  // Step 4 — BDI-II
  const [bdiAnswers, setBdiAnswers] = useState<Record<number, BDIAnswer>>({});

  const goStep = useCallback((s: Step) => setStep(s), []);

  const handleExpressionsUpdate = useCallback(
    (entries: EmotionEntry[], count: number) => {
      setEmotionLog(entries);
      setFrameCount(count);
    },
    [setEmotionLog, setFrameCount]
  );

  const handleNlpResultUpdate = useCallback(
    (gemini: NLPResult | null, bert: BERTResult | null) => {
      setNlpResult(gemini);
      setBertResult(bert);
    },
    [setNlpResult, setBertResult]
  );

  const handleRestart = useCallback(() => {
    setStep(1);
    setUserProfile(EMPTY_PROFILE);
    setBdiAnswers({});
    setNlpResult(null);
    setBertResult(null);
    setUserText("");
    setEmotionLog([]);
    setFrameCount(0);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      {/* Ambient orbs */}
      <div className="pointer-events-none fixed -right-48 -top-48 h-[600px] w-[600px] rounded-full bg-cyan-500/[0.04] blur-[120px]" />
      <div className="pointer-events-none fixed -bottom-24 -left-36 h-[500px] w-[500px] rounded-full bg-indigo-500/[0.04] blur-[120px]" />

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <StepHeader currentStep={step} />

        {step === 1 && (
          <Step1Welcome
            onNext={(profile) => {
              setUserProfile(profile);
              goStep(2);
            }}
            savedProfile={userProfile}
          />
        )}

        {step === 2 && (
          <Step2Webcam
            onNext={() => goStep(3)}
            onBack={() => goStep(1)}
            onExpressionsUpdate={handleExpressionsUpdate}
          />
        )}

        {step === 3 && (
          <Step3NLP
            onNext={() => goStep(4)}
            onBack={() => goStep(2)}
            onResultUpdate={handleNlpResultUpdate}
            savedText={userText}
            onTextChange={setUserText}
            savedGeminiResult={nlpResult}
            savedBertResult={bertResult}
          />
        )}

        {step === 4 && (
          <Step4BDI
            onNext={() => goStep(5)}
            onBack={() => goStep(3)}
            answers={bdiAnswers}
            onAnswerChange={setBdiAnswers}
          />
        )}

        {step === 5 && (
          <Step5Results
            userProfile={userProfile}
            answers={bdiAnswers}
            nlpResult={nlpResult}
            bertResult={bertResult}
            nlpText={userText}
            emotionLog={emotionLog}
            frameCount={frameCount}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}
