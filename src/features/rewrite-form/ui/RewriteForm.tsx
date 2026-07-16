"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/ui/Button";
import { RefreshCw, Copy } from "@/shared/ui/Icons";
import { platforms, type PlatformId } from "@/entities/platform/model";
import { tones, type ToneId } from "@/entities/tone/model";
import { fetchRewrite } from "@/shared/api/rewrite";
import toast from "react-hot-toast";

interface RewriteFormProps {
  disabled?: boolean;
  onSuccess?: () => void;
}

function isMeaningful(text: string): boolean {
  const cleaned = text.trim();
  if (cleaned.replace(/\s/g, "").length < 10) return false;
  if (!/[a-zA-Zа-яА-ЯёЁ]/.test(cleaned)) return false;
  const words = cleaned.split(/\s+/).filter((w) => w.length > 0);
  if (words.length < 2) return false;
  const nonSpace = cleaned.replace(/\s/g, "").split("");
  const letterCount = nonSpace.filter((ch) =>
    /[a-zA-Zа-яА-ЯёЁ]/.test(ch),
  ).length;
  if (letterCount / nonSpace.length < 0.4) return false;
  return true;
}

export const RewriteForm = ({
  disabled = false,
  onSuccess,
}: RewriteFormProps) => {
  const [text, setText] = useState("");
  const [platform, setPlatform] = useState<PlatformId>("instagram");
  const [tone, setTone] = useState<ToneId>("casual");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleRewrite = async () => {
    setError(false);
    if (!text.trim()) {
      toast.error("Введи текст");
      return;
    }
    if (!isMeaningful(text)) {
      setError(true);
      toast.error("Ничего не понятно 😅 Введи осмысленный текст", {
        style: {
          background: "#2D1B2E",
          color: "#F9A8D4",
          border: "1px solid #EC4899",
        },
      });
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const rewritten = await fetchRewrite({ text, platform, tone });
      setResult(rewritten);
      toast.success("Готово!");
      onSuccess?.(); // увеличивает счётчик на клиенте
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast.success("Скопировано");
  };

  const selectedPlatform = platforms.find((p) => p.id === platform);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          Твой текст
        </label>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError(false);
          }}
          placeholder="Напиши что-нибудь..."
          rows={4}
          disabled={disabled}
          className={`w-full bg-brand-dark/50 border rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 resize-none transition disabled:opacity-50 disabled:cursor-not-allowed cursor-text ${
            error
              ? "border-red-500 focus:ring-red-500/50"
              : "border-white/10 focus:ring-brand-purple/50"
          }`}
        />
        {error && (
          <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
            <span>😅</span> Ничего не понятно. Введи осмысленный текст.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-3">
          Платформа
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {platforms.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setPlatform(id)}
              disabled={disabled}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                platform === id
                  ? "border-brand-purple bg-brand-purple/20 text-white shadow-lg shadow-brand-purple/20"
                  : "border-white/10 hover:border-white/30 text-white/60"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Icon
                size={18}
                style={{ color: platform === id ? color : undefined }}
              />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-3">
          Тон общения
        </label>
        <div className="flex gap-3">
          {tones.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTone(id)}
              disabled={disabled}
              className={`flex-1 py-1.5 px-2 rounded-xl border transition-all text-xs sm:text-sm font-medium ${
                tone === id
                  ? "border-brand-pink bg-brand-pink/20 text-white shadow-lg shadow-brand-pink/20"
                  : "border-white/10 hover:border-white/30 text-white/60"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleRewrite}
        loading={loading}
        disabled={disabled || !text.trim()}
        gradient
        icon={<RefreshCw size={20} />}
      >
        {loading ? "Переписываю..." : "Переписать"}
      </Button>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 pt-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/70 flex items-center gap-2">
                {selectedPlatform && <selectedPlatform.icon size={16} />}
                Результат для {selectedPlatform?.label}
              </span>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
              >
                <Copy size={14} />
                Копировать
              </button>
            </div>
            <div className="bg-brand-dark/50 border border-white/10 rounded-xl p-4 text-white whitespace-pre-wrap text-sm leading-relaxed">
              {result}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
