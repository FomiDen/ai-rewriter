import { Send, Camera, Users, MessageCircle, AtSign } from "@/shared/ui/Icons";

export interface Platform {
  id: "telegram" | "instagram" | "vk" | "facebook" | "threads";
  label: string;
  icon: typeof Send;
  color: string;
}

export const platforms: Platform[] = [
  { id: "telegram", label: "Telegram", icon: Send, color: "#2AABEE" },
  { id: "instagram", label: "Instagram", icon: Camera, color: "#E1306C" },
  { id: "vk", label: "ВКонтакте", icon: Users, color: "#0077FF" },
  { id: "facebook", label: "Facebook", icon: MessageCircle, color: "#1877F2" },
  { id: "threads", label: "Threads", icon: AtSign, color: "#000000" },
];

export type PlatformId = Platform["id"];
