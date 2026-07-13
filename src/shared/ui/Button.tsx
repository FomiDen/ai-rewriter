import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  gradient?: boolean;
  icon?: ReactNode;
}

export const Button = ({
  children,
  loading,
  gradient = true,
  icon,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`w-full font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
        gradient
          ? "bg-gradient-brand hover:opacity-90"
          : "bg-white/10 hover:bg-white/20"
      } disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-white ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={20} className="animate-spin" /> : icon}
      {children}
    </button>
  );
};
