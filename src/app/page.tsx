"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

const RewriterWidget = dynamic(
  () =>
    import("@/widgets/rewriter/RewriterWidget").then(
      (mod) => mod.RewriterWidget,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="glass-card w-full max-w-2xl p-6 sm:p-8 rounded-3xl animate-pulse text-center text-white/50">
        Загрузка...
      </div>
    ),
  },
);

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY;

function checkIsAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("admin_key") === ADMIN_KEY;
}

export default function Home() {
  const [isAdmin, setIsAdmin] = useState<boolean>(checkIsAdmin);

  const activateAdmin = () => {
    const key = prompt("Введите ключ администратора:");
    if (key === ADMIN_KEY) {
      localStorage.setItem("admin_key", key);
      setIsAdmin(true);
      toast.success("Админ-режим активирован!");
    } else {
      toast.error("Неверный ключ");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--color-brand-card)",
            color: "#fff",
            border: "1px solid rgb(255 255 255 / 0.1)",
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-3">
          AI <span className="text-gradient">Рерайтер</span> для соцсетей
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">
          Введи текст, выбери площадку и получи идеальный пост за секунды
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <RewriterWidget isAdmin={isAdmin} />
      </motion.div>

      <div className="text-white/30 text-xs mt-8 flex flex-wrap items-center justify-center gap-4">
        <span>AI Rewriter</span>
        <button
          onClick={activateAdmin}
          className="text-white/20 hover:text-white/40"
          title="Вход для админа"
        >
          🔑
        </button>
      </div>
    </div>
  );
}
