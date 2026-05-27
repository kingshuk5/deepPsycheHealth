"use client";

import { useState } from "react";
import { UserProfile, Gender } from "@/app/types";

interface Step1Props {
  onNext: (profile: UserProfile) => void;
  savedProfile: UserProfile;
}

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
  { value: "other", label: "Other" },
];

interface FieldErrors {
  name?: string;
  contactNumber?: string;
  age?: string;
  gender?: string;
}

export default function Step1Welcome({ onNext, savedProfile }: Step1Props) {
  const [profile, setProfile] = useState<UserProfile>(savedProfile);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof UserProfile, boolean>>>({});

  const set = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setProfile((p) => ({ ...p, [key]: value }));
    setTouched((t) => ({ ...t, [key]: true }));
    // Clear error on change
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): FieldErrors => {
    const e: FieldErrors = {};
    if (!profile.name.trim()) e.name = "Full name is required.";
    if (!profile.contactNumber.trim()) {
      e.contactNumber = "Contact number is required.";
    } else if (!/^\+?[\d\s\-()]{7,15}$/.test(profile.contactNumber.trim())) {
      e.contactNumber = "Enter a valid phone number.";
    }
    if (profile.age === "" || profile.age === undefined) {
      e.age = "Age is required.";
    } else if (Number(profile.age) < 10 || Number(profile.age) > 120) {
      e.age = "Enter a valid age (10–120).";
    }
    if (!profile.gender) e.gender = "Please select a gender.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      setTouched({ name: true, contactNumber: true, age: true, gender: true });
      return;
    }
    onNext(profile);
  };

  const inputBase =
    "w-full rounded-xl border bg-slate-950 px-4 py-3 text-[14px] text-slate-100 placeholder:font-mono placeholder:text-[13px] placeholder:text-slate-600 focus:outline-none transition-colors duration-200";
  const inputOk = "border-slate-700 focus:border-cyan-500/50";
  const inputErr = "border-rose-500/60 focus:border-rose-500/80";

  const field = (key: keyof FieldErrors) =>
    touched[key] && errors[key] ? inputErr : inputOk;

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-slate-900 p-8 overflow-hidden">
      <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl" />

      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/8 px-3 py-1">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
          Multi-Modal Diagnostic Screening
        </span>
      </div>

      <h1 className="mb-2 text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
        Psychological &{" "}
        <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
          Behavioral Assessment
        </span>
      </h1>
      <p className="mb-8 max-w-2xl font-mono text-sm leading-relaxed text-slate-400">
        A comprehensive three-module evaluation combining live facial expression
        analysis, natural language sentiment review, and the clinically validated
        BDI-II. Please complete your registration to begin.
      </p>

      {/* Module pills */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { icon: "📷", color: "bg-cyan-500/10", title: "Face Expression Analysis", desc: "Live webcam stream via WebSocket at 200ms intervals." },
          { icon: "💬", color: "bg-indigo-500/10", title: "NLP Sentiment Review", desc: "Gemini + BERT dual-pipeline depression analysis." },
          { icon: "📋", color: "bg-teal-500/10", title: "BDI-II Questionnaire", desc: "All 21 standardised Beck Depression Inventory items." },
        ].map((m) => (
          <div key={m.title} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg text-lg ${m.color}`}>{m.icon}</div>
            <p className="mb-1 text-[13px] font-semibold text-slate-100">{m.title}</p>
            <p className="font-mono text-[11px] leading-relaxed text-slate-500">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Registration Form ── */}
      <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-6">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-widest text-slate-400">
          Patient Registration
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-slate-500">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => set("name", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              placeholder="Enter your full name"
              className={`${inputBase} ${field("name")}`}
            />
            {touched.name && errors.name && (
              <p className="mt-1 font-mono text-[11px] text-rose-400">{errors.name}</p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-slate-500">
              Contact Number <span className="text-rose-400">*</span>
            </label>
            <input
              type="tel"
              value={profile.contactNumber}
              onChange={(e) => set("contactNumber", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, contactNumber: true }))}
              placeholder="+91 98765 43210"
              className={`${inputBase} ${field("contactNumber")}`}
            />
            {touched.contactNumber && errors.contactNumber && (
              <p className="mt-1 font-mono text-[11px] text-rose-400">{errors.contactNumber}</p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-slate-500">
              Age <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              min={10}
              max={120}
              value={profile.age === "" ? "" : profile.age}
              onChange={(e) =>
                set("age", e.target.value === "" ? "" : Number(e.target.value))
              }
              onBlur={() => setTouched((t) => ({ ...t, age: true }))}
              placeholder="25"
              className={`${inputBase} ${field("age")}`}
            />
            {touched.age && errors.age && (
              <p className="mt-1 font-mono text-[11px] text-rose-400">{errors.age}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-slate-500">
              Gender <span className="text-rose-400">*</span>
            </label>
            <select
              value={profile.gender}
              onChange={(e) => set("gender", e.target.value as Gender)}
              onBlur={() => setTouched((t) => ({ ...t, gender: true }))}
              className={`${inputBase} ${field("gender")} cursor-pointer`}
            >
              <option value="" className="bg-slate-900">Select gender</option>
              {GENDER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-slate-900">
                  {o.label}
                </option>
              ))}
            </select>
            {touched.gender && errors.gender && (
              <p className="mt-1 font-mono text-[11px] text-rose-400">{errors.gender}</p>
            )}
          </div>

          {/* Email (optional) */}
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-slate-500">
              Email{" "}
              <span className="text-slate-600">(optional)</span>
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@example.com"
              className={`${inputBase} border-slate-700 focus:border-cyan-500/50`}
            />
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="mb-6 flex gap-3 rounded-xl border border-amber-500/15 bg-amber-500/5 p-4">
        <span className="mt-0.5 flex-shrink-0 text-base">🔒</span>
        <p className="font-mono text-[12px] leading-relaxed text-amber-400/80">
          <strong className="text-amber-400">Privacy Notice:</strong> Your details
          are used solely for this screening session. Webcam frames are processed
          in real-time and not stored. Text is sent to the Gemini API and your local
          BERT service. With your consent, the session summary is securely saved to
          our encrypted database for clinical reference.
        </p>
      </div>

      <button
        onClick={handleSubmit}
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 px-7 py-3 text-sm font-bold text-slate-950 transition-all duration-150 hover:-translate-y-0.5 hover:opacity-90 active:scale-95"
      >
        Begin Assessment →
      </button>
    </div>
  );
}
