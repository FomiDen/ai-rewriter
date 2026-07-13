import { Send, Camera, } from "@/shared/ui/Icons";
import { MessageCircle, User } from "lucide-react";

export interface Platform {
  id: "telegram" | "instagram" | "vk" | "facebook";
  label: string;
  icon: typeof Send;
  color: string;
}

export const platforms: Platform[] = [
  { id: "telegram", label: "Telegram", icon: Send, color: "#2AABEE" },
  { id: "instagram", label: "Instagram", icon: Camera, color: "#E1306C" },
  { id: "vk", label: "ВКонтакте", icon: User, color: "#0077FF" },
  { id: "facebook", label: "Facebook", icon: MessageCircle, color: "#1877F2" },
];

export type PlatformId = Platform["id"];
