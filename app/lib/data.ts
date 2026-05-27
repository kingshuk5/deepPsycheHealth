import { BDIQuestion, BDILevel, EmotionKey } from "@/app/types";

export const BDI_QUESTIONS: BDIQuestion[] = [
  {
    id: 1,
    title: "Sadness",
    options: [
      { score: 0, text: "I do not feel sad." },
      { score: 1, text: "I feel sad much of the time." },
      { score: 2, text: "I am sad all the time." },
      { score: 3, text: "I am so sad or unhappy that I can't stand it." },
    ],
  },
  {
    id: 2,
    title: "Pessimism",
    options: [
      { score: 0, text: "I am not discouraged about my future." },
      { score: 1, text: "I feel more discouraged about my future than I used to." },
      { score: 2, text: "I do not expect things to work out for me." },
      { score: 3, text: "I feel my future is hopeless and will only get worse." },
    ],
  },
  {
    id: 3,
    title: "Past Failure",
    options: [
      { score: 0, text: "I do not feel like a failure." },
      { score: 1, text: "I have failed more than I should have." },
      { score: 2, text: "As I look back, I see a lot of failures." },
      { score: 3, text: "I feel I am a total failure as a person." },
    ],
  },
  {
    id: 4,
    title: "Loss of Pleasure",
    options: [
      { score: 0, text: "I get as much pleasure as I ever did from the things I enjoy." },
      { score: 1, text: "I don't enjoy things as much as I used to." },
      { score: 2, text: "I get very little pleasure from the things I used to enjoy." },
      { score: 3, text: "I can't get any pleasure from the things I used to enjoy." },
    ],
  },
  {
    id: 5,
    title: "Guilty Feelings",
    options: [
      { score: 0, text: "I don't feel particularly guilty." },
      { score: 1, text: "I feel guilty over many things I have done or should have done." },
      { score: 2, text: "I feel quite guilty most of the time." },
      { score: 3, text: "I feel guilty all of the time." },
    ],
  },
  {
    id: 6,
    title: "Punishment Feelings",
    options: [
      { score: 0, text: "I don't feel I am being punished." },
      { score: 1, text: "I feel I may be punished." },
      { score: 2, text: "I expect to be punished." },
      { score: 3, text: "I feel I am being punished." },
    ],
  },
  {
    id: 7,
    title: "Self-Dislike",
    options: [
      { score: 0, text: "I feel the same about myself as ever." },
      { score: 1, text: "I have lost confidence in myself." },
      { score: 2, text: "I am disappointed in myself." },
      { score: 3, text: "I dislike myself." },
    ],
  },
  {
    id: 8,
    title: "Self-Criticalness",
    options: [
      { score: 0, text: "I don't criticize or blame myself more than usual." },
      { score: 1, text: "I am more critical of myself than I used to be." },
      { score: 2, text: "I criticize myself for all of my faults." },
      { score: 3, text: "I blame myself for everything bad that happens." },
    ],
  },
  {
    id: 9,
    title: "Suicidal Thoughts or Wishes",
    options: [
      { score: 0, text: "I don't have any thoughts of killing myself." },
      { score: 1, text: "I have thoughts of killing myself, but I would not carry them out." },
      { score: 2, text: "I would like to kill myself." },
      { score: 3, text: "I would kill myself if I had the chance." },
    ],
  },
  {
    id: 10,
    title: "Crying",
    options: [
      { score: 0, text: "I don't cry anymore than I used to." },
      { score: 1, text: "I cry more than I used to." },
      { score: 2, text: "I cry over every little thing." },
      { score: 3, text: "I feel like crying, but I can't." },
    ],
  },
  {
    id: 11,
    title: "Agitation",
    options: [
      { score: 0, text: "I am no more restless or wound up than usual." },
      { score: 1, text: "I feel more restless or wound up than usual." },
      { score: 2, text: "I am so restless or agitated, it's hard to stay still." },
      { score: 3, text: "I am so restless or agitated that I have to keep moving or doing something." },
    ],
  },
  {
    id: 12,
    title: "Loss of Interest",
    options: [
      { score: 0, text: "I have not lost interest in other people or activities." },
      { score: 1, text: "I am less interested in other people or things than before." },
      { score: 2, text: "I have lost most of my interest in other people or things." },
      { score: 3, text: "It's hard to get interested in anything." },
    ],
  },
  {
    id: 13,
    title: "Indecisiveness",
    options: [
      { score: 0, text: "I make decisions about as well as ever." },
      { score: 1, text: "I find it more difficult to make decisions than usual." },
      { score: 2, text: "I have much greater difficulty in making decisions than I used to." },
      { score: 3, text: "I have trouble making any decisions." },
    ],
  },
  {
    id: 14,
    title: "Worthlessness",
    options: [
      { score: 0, text: "I do not feel I am worthless." },
      { score: 1, text: "I don't consider myself as worthwhile and useful as I used to." },
      { score: 2, text: "I feel more worthless as compared to others." },
      { score: 3, text: "I feel utterly worthless." },
    ],
  },
  {
    id: 15,
    title: "Loss of Energy",
    options: [
      { score: 0, text: "I have as much energy as ever." },
      { score: 1, text: "I have less energy than I used to have." },
      { score: 2, text: "I don't have enough energy to do very much." },
      { score: 3, text: "I don't have enough energy to do anything." },
    ],
  },
  {
    id: 16,
    title: "Changes in Sleeping Pattern",
    isSplit: true,
    options: [
      { score: 0, key: "0", text: "I have not experienced any change in my sleeping." },
      { score: 1, key: "1a", text: "I sleep somewhat more than usual." },
      { score: 1, key: "1b", text: "I sleep somewhat less than usual." },
      { score: 2, key: "2a", text: "I sleep a lot more than usual." },
      { score: 2, key: "2b", text: "I sleep a lot less than usual." },
      { score: 3, key: "3a", text: "I sleep most of the day." },
      { score: 3, key: "3b", text: "I wake up 1–2 hours early and can't get back to sleep." },
    ],
  },
  {
    id: 17,
    title: "Irritability",
    options: [
      { score: 0, text: "I am not more irritable than usual." },
      { score: 1, text: "I am more irritable than usual." },
      { score: 2, text: "I am much more irritable than usual." },
      { score: 3, text: "I am irritable all the time." },
    ],
  },
  {
    id: 18,
    title: "Changes in Appetite",
    isSplit: true,
    options: [
      { score: 0, key: "0", text: "I have not experienced any change in my appetite." },
      { score: 1, key: "1a", text: "My appetite is somewhat less than usual." },
      { score: 1, key: "1b", text: "My appetite is somewhat greater than usual." },
      { score: 2, key: "2a", text: "My appetite is much less than before." },
      { score: 2, key: "2b", text: "My appetite is much greater than usual." },
      { score: 3, key: "3a", text: "I have no appetite at all." },
      { score: 3, key: "3b", text: "I crave food all the time." },
    ],
  },
  {
    id: 19,
    title: "Concentration Difficulty",
    options: [
      { score: 0, text: "I can concentrate as well as ever." },
      { score: 1, text: "I can't concentrate as well as usual." },
      { score: 2, text: "It's hard to keep my mind on anything for very long." },
      { score: 3, text: "I find I can't concentrate on anything." },
    ],
  },
  {
    id: 20,
    title: "Tiredness or Fatigue",
    options: [
      { score: 0, text: "I am no more tired or fatigued than usual." },
      { score: 1, text: "I get more tired or fatigued more easily than usual." },
      { score: 2, text: "I am too tired or fatigued to do a lot of the things I used to do." },
      { score: 3, text: "I am too tired or fatigued to do most of the things I used to do." },
    ],
  },
  {
    id: 21,
    title: "Loss of Interest in Sex",
    options: [
      { score: 0, text: "I have not noticed any recent change in my interest in sex." },
      { score: 1, text: "I am less interested in sex than I used to be." },
      { score: 2, text: "I am much less interested in sex now." },
      { score: 3, text: "I have lost interest in sex completely." },
    ],
  },
];

export const EMOTION_COLORS: Record<EmotionKey, string> = {
  happy: "#34d399",
  sad: "#60a5fa",
  angry: "#fb7185",
  fear: "#a78bfa",
  surprise: "#fbbf24",
  disgust: "#f97316",
  neutral: "#94a3b8",
  contempt: "#f472b6",
  default: "#22d3ee",
};

export const BDI_LEVELS: BDILevel[] = [
  { min: 0, max: 10, label: "Normal Range", color: "#34d399", desc: "These ups and downs are considered normal." },
  { min: 11, max: 16, label: "Mild Mood Disturbance", color: "#22d3ee", desc: "You may be experiencing a mild mood disturbance." },
  { min: 17, max: 20, label: "Borderline Clinical Depression", color: "#fbbf24", desc: "Your score is in the borderline range for clinical depression." },
  { min: 21, max: 30, label: "Moderate Depression", color: "#f97316", desc: "Your score indicates moderate depression. Professional support is recommended." },
  { min: 31, max: 40, label: "Severe Depression", color: "#fb7185", desc: "Your score indicates severe depression. Please seek professional help." },
  { min: 41, max: 63, label: "Extreme Depression", color: "#e11d48", desc: "Your score indicates extreme depression. Please seek immediate professional help." },
];
