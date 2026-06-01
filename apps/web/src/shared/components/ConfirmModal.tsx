import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  danger = false,
  loading = false,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 딤 배경 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-[60]"
          />

          {/* 모달 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-8"
          >
            <div className="w-full max-w-[300px] bg-[#1A1B35] rounded-2xl border border-white/10 overflow-hidden">
              {/* 콘텐츠 */}
              <div className="px-6 pt-7 pb-5 text-center">
                <h4 className="text-lg font-semibold text-ivory mb-2">{title}</h4>
                <p className="text-sm text-lavender leading-relaxed">{description}</p>
              </div>

              {/* 버튼 */}
              <div className="flex border-t border-white/10">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-3.5 text-sm font-medium text-lavender border-r border-white/10 active:bg-white/5 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`flex-1 py-3.5 text-sm font-medium active:bg-white/5 transition-colors ${
                    danger ? 'text-red-400' : 'text-gold'
                  }`}
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
