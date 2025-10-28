"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type ToastType = "info" | "success" | "error";

interface ToastItem {
  id: string;
  message: string;
  duration: number;
  type: ToastType;
}

interface ToastContextValue {
  addToast: (message: string, opts?: { duration?: number; type?: ToastType }) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (message: string, opts: { duration?: number; type?: ToastType } = {}) => {
      const { duration = 3000, type = "info" } = opts;
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      setToasts((t) => [...t, { id, message, duration, type }]);
      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  useEffect(() => {
    const timers = toasts.map((t) => {
      const timeout = setTimeout(() => removeToast(t.id), t.duration);
      return () => clearTimeout(timeout);
    });
    return () => timers.forEach((fn) => fn());
  }, [toasts, removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      <div className="fixed right-4 bottom-4 flex flex-col items-end gap-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`max-w-xs w-full px-4 py-2 rounded-lg shadow-lg text-sm text-white flex items-center gap-3 justify-between transition-transform transform translate-y-0 ${
              t.type === "success" ? "bg-green-600" : t.type === "error" ? "bg-red-600" : "bg-gray-800"
            }`}
          >
            <div className="truncate">{t.message}</div>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-2 opacity-80 hover:opacity-100 text-xs bg-white/10 rounded px-2 py-1"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

export default ToastProvider;