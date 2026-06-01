import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // body 스크롤 잠금
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 딤 배경 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* 시트 본체 */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-app mx-auto"
          >
            <div className="bg-[#1A1B35] rounded-t-2xl border-t border-white/10 safe-bottom">
              {/* 드래그 핸들 */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* 타이틀 */}
              {title && (
                <div className="flex items-center justify-between px-5 py-3">
                  <h3 className="text-base font-semibold text-ivory">{title}</h3>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center text-lavender"
                  >
                    <i className="fas fa-times text-sm" />
                  </button>
                </div>
              )}

              {/* 콘텐츠 */}
              <div className="px-5 pb-6 pt-1">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
