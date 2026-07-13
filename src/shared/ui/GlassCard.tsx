import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className = "" }: GlassCardProps) => {
  return (
    <div
      className={`glass-card w-full max-w-2xl p-6 sm:p-8 rounded-3xl space-y-6 ${className}`}
    >
      {children}
    </div>
  );
};
