export interface Tone {
  id: "casual" | "professional" | "creative" | "aggressive";
  label: string;
}

export const tones: Tone[] = [
  { id: "casual", label: "Дружеский" },
  { id: "professional", label: "Деловой" },
  { id: "creative", label: "Креативный" },
  { id: "aggressive", label: "Агрессивный" },
];

export type ToneId = Tone["id"];
