
export interface Tone {
  id: "casual" | "professional" | "creative";
  label: string;
}

export const tones: Tone[] = [
  { id: "casual", label: "Дружеский" },
  { id: "professional", label: "Деловой" },
  { id: "creative", label: "Креативный" },
];

export type ToneId = Tone["id"];
