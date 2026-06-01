import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastMessage {
  id: number;
  text: string;
  type: 'info' | 'error' | 'success';
}

let toastId = 0;
const listeners: Set<(msg: ToastMessage) => void> = new Set();

export function showToast(text: string, type: 'info' | 'error' | 'success' = 'info') {
  const msg: ToastMessage = { id: ++toastId, text, type };
  listeners.forEach((fn) => fn(msg));
}

export function Toast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addMessage = useCallback((msg: ToastMessage) => {
    setMessages((prev) => [...prev, msg]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    }, 2500);
  }, []);

  useEffect(() => {
    listeners.add(addMessage);
    return () => {
      listeners.delete(addMessage);
    };
  }, [addMessage]);

  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-[90%] max-w-[380px]">
      <AnimatePresence>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`
              px-4 py-3 rounded-xl text-sm font-medium text-center
              backdrop-blur-md border border-white/10
              ${msg.type === 'error' ? 'bg-red-500/20 text-red-200' : ''}
              ${msg.type === 'success' ? 'bg-green-500/20 text-green-200' : ''}
              ${msg.type === 'info' ? 'bg-white/10 text-ivory' : ''}
            `}
          >
            {msg.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
