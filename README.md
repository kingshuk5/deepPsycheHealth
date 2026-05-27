# NeuraScan — Psychological Screening Dashboard

A production-grade, multi-modal psychological and behavioral screening application built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS**.

## Features

- **Step 1 — Welcome & Onboarding**: Introduction panel, privacy notice, and assessment overview.
- **Step 2 — Live Face Expression Stream**: Real-time webcam capture via `react-webcam`, frames streamed over WebSocket at 200ms intervals, emotion display with dynamic color-coded feedback.
- **Step 3 — NLP Sentiment Analysis**: Gemini 2.5 Flash zero-shot analysis for depression markers and crisis content, with emergency crisis helplines displayed if suicidal content is detected.
- **Step 4 — BDI-II Questionnaire**: All 21 questions of the Beck Depression Inventory-II with split questions (Q16, Q18), paginated navigation, and auto-advance on selection.
- **Step 5 — Results Dashboard**: Radial gauge, BDI level classification, NLP summary, facial expression recap, and per-item score bars.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Webcam | `react-webcam` |
| AI/NLP | Google Gemini 2.5 Flash (via REST) |
| WebSocket | Native browser WebSocket API |

## Project Structure

```
neurascan/
├── app/
│   ├── components/
│   │   ├── StepHeader.tsx       # Progress indicator header
│   │   ├── Step1Welcome.tsx     # Onboarding portal
│   │   ├── Step2Webcam.tsx      # Live webcam + WebSocket stream
│   │   ├── Step3NLP.tsx         # Gemini NLP analysis
│   │   ├── Step4BDI.tsx         # BDI-II questionnaire
│   │   └── Step5Results.tsx     # Holistic results dashboard
│   ├── lib/
│   │   ├── data.ts              # BDI-II questions, emotion colors, level thresholds
│   │   ├── gemini.ts            # Gemini API call utility
│   │   └── useWebSocketStream.ts # WebSocket + frame capture hook
│   ├── types/
│   │   └── index.ts             # All shared TypeScript interfaces
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # Main wizard orchestrator
├── .env.local                   # Environment variables (not committed)
└── README.md
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local` and fill in your values:

```env
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...your_key_here
NEXT_PUBLIC_WS_URL=wss://depression-detection-fast-api-backend.onrender.com/ws/stream
```

> **Note**: `NEXT_PUBLIC_` variables are exposed to the browser bundle. For production, consider routing Gemini calls through a Next.js API route to keep the key server-side only.

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Build for production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Your Google Gemini API key |
| `NEXT_PUBLIC_WS_URL` | WebSocket endpoint for face expression analysis |

## BDI-II Scoring Reference

| Score | Classification |
|-------|---------------|
| 1–10  | Normal ups and downs |
| 11–16 | Mild mood disturbance |
| 17–20 | Borderline clinical depression |
| 21–30 | Moderate depression |
| 31–40 | Severe depression |
| 40+   | Extreme depression |

## Disclaimer

This application is for **informational and research purposes only** and does not constitute a clinical diagnosis. Always consult a qualified mental health professional.
