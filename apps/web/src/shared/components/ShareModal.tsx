import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { shareImage, saveImage } from '@/shared/utils/shareImage';
import { showToast } from './Toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 이미지 생성 함수 — 모달이 열릴 때 호출 */
  generateImage: () => Promise<Blob>;
  title?: string;
}

export function ShareModal({ isOpen, onClose, generateImage, title = '공유하기' }: ShareModalProps) {
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [sharing, setSharing] = useState(false);
  const prevOpenRef = useRef(false);

  // 모달 열릴 때 이미지 생성
  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      setLoading(true);
      setError(false);
      setImageBlob(null);
      setPreviewUrl(null);

      generateImage()
        .then((blob) => {
          setImageBlob(blob);
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
        })
        .catch(() => {
          setError(true);
          showToast('이미지 생성에 실패했어요', 'error');
        })
        .finally(() => setLoading(false));
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, generateImage]);

  // cleanup object URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleShare = async () => {
    if (!imageBlob) return;
    setSharing(true);
    try {
      const result = await shareImage(imageBlob, title);
      if (result === 'shared') {
        showToast('공유되었어요!', 'success');
      } else {
        showToast('이미지가 저장되었어요', 'success');
      }
      onClose();
    } catch {
      showToast('공유에 실패했어요', 'error');
    } finally {
      setSharing(false);
    }
  };

  const handleSave = () => {
    if (!imageBlob) return;
    saveImage(imageBlob);
    showToast('이미지가 저장되었어요', 'success');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-full max-w-app bg-bg-top rounded-t-3xl border-t border-white/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 핸들 */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 pb-4">
              <h3 className="font-display text-lg text-ivory">{title}</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-lavender/50"
              >
                <i className="fas fa-xmark text-lg" />
              </button>
            </div>

            {/* 미리보기 */}
            <div className="px-6 pb-4">
              <div className="relative w-full aspect-[9/16] max-h-[50vh] bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                {loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                    <p className="text-sm text-lavender">이미지 생성 중...</p>
                  </div>
                )}

                {error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <i className="fas fa-exclamation-circle text-xl text-red-400" />
                    <p className="text-sm text-lavender">이미지를 만들지 못했어요</p>
                  </div>
                )}

                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="공유 미리보기"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 px-6 pb-8">
              <button
                onClick={handleSave}
                disabled={!imageBlob || sharing}
                className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 text-ivory text-sm font-medium disabled:opacity-40 active:bg-white/10 transition-colors"
              >
                <i className="fas fa-download mr-2" />
                저장하기
              </button>
              <button
                onClick={handleShare}
                disabled={!imageBlob || sharing}
                className="flex-1 py-3.5 rounded-xl bg-gold/15 border border-gold/30 text-gold text-sm font-medium disabled:opacity-40 active:bg-gold/25 transition-colors"
              >
                {sharing ? (
                  <>
                    <div className="inline-block w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin mr-2" />
                    공유 중...
                  </>
                ) : (
                  <>
                    <i className="fas fa-share-alt mr-2" />
                    공유하기
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
