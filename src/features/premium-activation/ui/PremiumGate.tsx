"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Lock, Key } from "@/shared/ui/Icons";
import toast from "react-hot-toast";

interface PremiumGateProps {
  canGenerate: boolean;
  remaining: number | string;
  premiumActive: boolean;
  isAdmin: boolean;
  onPay: () => void;
  onActivateKey: (key: string) => boolean;
  onGenerateKey: () => string;
}

export const PremiumGate = ({
  canGenerate,
  remaining,
  premiumActive,
  isAdmin,
  onPay,
  onActivateKey,
  onGenerateKey,
}: PremiumGateProps) => {
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const handleActivate = () => {
    if (onActivateKey(keyInput)) {
      toast.success("Премиум активирован на 30 дней!");
      setKeyInput("");
      setShowKeyInput(false);
    } else {
      toast.error("Неверный ключ");
    }
  };

  const handleGenerate = () => {
    const key = onGenerateKey();
    setGeneratedKey(key);
    navigator.clipboard.writeText(key);
    toast.success("Ключ скопирован");
  };

  return (
    <div className="space-y-4">
      {/* Статус и кнопки — улучшенная адаптивность */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
        <span className="text-white/70 flex items-center gap-1 whitespace-nowrap">
          <Zap size={16} className="text-yellow-400 shrink-0" />
          <span className="hidden sm:inline">Бесплатно сегодня: </span>
          <span className="sm:hidden">Бесплатно: </span>
          <strong className="text-white">{remaining}</strong>
        </span>

        <div className="flex items-center gap-2">
          {!canGenerate && !premiumActive && (
            <button
              onClick={onPay}
              className="bg-brand-pink hover:bg-brand-pink/80 text-white font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors text-xs sm:text-sm"
            >
              <Lock size={14} />
              Оплатить 299₽
            </button>
          )}
          {!premiumActive && (
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="text-white/50 hover:text-white/80 text-xs flex items-center gap-1 whitespace-nowrap"
            >
              <Key size={14} />
              <span className="hidden sm:inline">Уже оплатил? Ввести ключ</span>
              <span className="sm:hidden">Ввести ключ</span>
            </button>
          )}
          {premiumActive && !isAdmin && (
            <span className="text-brand-pink text-xs bg-brand-pink/20 px-2 py-1 rounded-full whitespace-nowrap">
              Premium
            </span>
          )}
          {isAdmin && (
            <span className="text-brand-purple text-xs bg-brand-purple/20 px-2 py-1 rounded-full whitespace-nowrap">
              Админ
            </span>
          )}
        </div>
      </div>

      {/* Поле ввода ключа */}
      {showKeyInput && !premiumActive && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="PREMIUM-XXXXXX"
            className="flex-1 bg-brand-dark/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
          />
          <button
            onClick={handleActivate}
            className="bg-brand-purple hover:bg-brand-purple/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            Активировать
          </button>
        </motion.div>
      )}

      {/* Админ-панель */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-brand-purple/30 rounded-xl p-4 bg-brand-purple/5 space-y-3"
        >
          <h3 className="text-sm font-semibold text-brand-purple flex items-center gap-2">
            <Key size={16} /> Админ-панель
          </h3>
          <button
            onClick={handleGenerate}
            className="w-full bg-brand-purple/20 hover:bg-brand-purple/30 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Key size={16} />
            Сгенерировать премиум-ключ
          </button>
          {generatedKey && (
            <div className="bg-black/30 p-2 rounded text-center text-xs font-mono text-brand-purple break-all">
              {generatedKey}
            </div>
          )}
          <p className="text-white/40 text-xs">
            Отправь этот ключ пользователю после оплаты.
          </p>
        </motion.div>
      )}
    </div>
  );
};
