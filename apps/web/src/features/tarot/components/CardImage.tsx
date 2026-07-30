import { useState } from 'react';
import { motion } from 'framer-motion';
import { getCardImageUrl, getCardBackImageUrl } from '@/data/cardImages';

interface CardData {
  card_id: string;
  name_kr: string;
  name_hanja: string;
  category: string;
  color_hex: string;
  keywords: string[];
  is_holographic: boolean;
  special_effect?: string;
}

interface Props {
  card: CardData;
  orientation?: 'upright' | 'reversed';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const SIZES = {
  sm: { w: 70, h: 98, hanjaSize: 12, nameSize: 9, iconSize: 18, radius: 10 },
  md: { w: 140, h: 196, hanjaSize: 18, nameSize: 14, iconSize: 28, radius: 14 },
  lg: { w: 210, h: 294, hanjaSize: 24, nameSize: 16, iconSize: 36, radius: 16 },
};

const CATEGORY_ICONS: Record<string, string> = {
  major: '\u2726',   // ✦
  element: '\u25CB', // ○
  zodiac: '\u2606',  // ☆
  protection: '\u5352', // 卒
  luck: '\u2605',    // ★
};

const ZODIAC_EMOJIS: Record<string, string> = {
  rat: '\uD83D\uDC2D', mouse: '\uD83D\uDC2D',
  ox: '\uD83D\uDC2E', tiger: '\uD83D\uDC2F',
  rabbit: '\uD83D\uDC30', dragon: '\uD83D\uDC09',
  snake: '\uD83D\uDC0D', horse: '\uD83D\uDC0E',
  goat: '\uD83D\uDC10', monkey: '\uD83D\uDC12',
  rooster: '\uD83D\uDC14', dog: '\uD83D\uDC36',
  pig: '\uD83D\uDC37',
};

export function CardImage({ card, orientation = 'upright', size = 'md', onClick }: Props) {
  const s = SIZES[size];
  const isReversed = orientation === 'reversed';
  const imageUrl = getCardImageUrl(card.card_id);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const showImage = imageUrl && !imgError;

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="relative cursor-pointer select-none flex-shrink-0"
      style={{
        width: s.w,
        height: s.h,
        transform: isReversed ? 'rotate(180deg)' : undefined,
        perspective: '1000px',
      }}
    >
      {/* Holographic border */}
      {card.is_holographic && (
        <div
          className="absolute -inset-[2px] opacity-70"
          style={{
            borderRadius: s.radius + 2,
            background: 'linear-gradient(135deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff, #ff0000)',
            backgroundSize: '400% 400%',
            animation: 'holoShift 3s linear infinite',
          }}
        />
      )}

      {/* Card body */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          borderRadius: s.radius,
          boxShadow: card.category === 'major'
            ? `0 0 20px ${card.color_hex}66`
            : '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        {/* === Actual Image Layer === */}
        {showImage && (
          <>
            <img
              src={imageUrl}
              alt={card.name_kr}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
              style={{ opacity: imgLoaded ? 1 : 0 }}
            />
            {/* Subtle name overlay at bottom for readability */}
            {imgLoaded && size !== 'sm' && (
              <div
                className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-1.5 pt-4"
                style={{
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
                }}
              >
                <span
                  className="font-display text-white/90 text-center leading-tight drop-shadow-md"
                  style={{ fontSize: s.nameSize - 2 }}
                >
                  {card.name_kr}
                </span>
              </div>
            )}
          </>
        )}

        {/* === Fallback Color Card (shown while loading or on error) === */}
        {(!showImage || !imgLoaded) && (
          <FallbackCard card={card} size={size} s={s} />
        )}
      </div>
    </motion.div>
  );
}

/** Fallback: the original color-based card design */
function FallbackCard({
  card,
  size,
  s,
}: {
  card: CardData;
  size: string;
  s: (typeof SIZES)['md'];
}) {
  const icon = (card as any).zodiac
    ? ZODIAC_EMOJIS[(card as any).zodiac] || CATEGORY_ICONS.zodiac
    : CATEGORY_ICONS[card.category] || '\u25CB';

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-between p-2"
      style={{
        background: `linear-gradient(135deg, ${card.color_hex} 0%, ${card.color_hex}CC 100%)`,
      }}
    >
      <span
        className="font-numeric text-center leading-tight text-white/90"
        style={{ fontSize: s.hanjaSize }}
      >
        {card.name_hanja}
      </span>
      <span
        className="block text-center"
        style={{ fontSize: s.iconSize, lineHeight: 1.2 }}
      >
        {icon}
      </span>
      <span
        className="font-display text-center leading-tight text-white"
        style={{ fontSize: s.nameSize }}
      >
        {card.name_kr}
      </span>
    </div>
  );
}

/** Card back design */
export function CardBack({ size = 'md', selected = false }: { size?: 'sm' | 'md' | 'lg'; selected?: boolean }) {
  const s = SIZES[size];
  const backUrl = getCardBackImageUrl();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: s.w, height: s.h }}
    >
      <div
        className={`w-full h-full overflow-hidden transition-all duration-300 ${
          selected ? 'border-2 border-gold shadow-[0_0_20px_rgba(212,175,55,0.5)]' : 'border border-gold/20'
        }`}
        style={{
          borderRadius: s.radius,
          background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #1A1A2E 100%)',
        }}
      >
        {/* Actual back image */}
        {!imgError && (
          <img
            src={backUrl}
            alt="오색운 카드"
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            style={{ opacity: imgLoaded ? 1 : 0 }}
          />
        )}

        {/* Fallback (shown while loading or on error) */}
        {(!imgLoaded || imgError) && (
          <div className="w-full h-full flex items-center justify-center">
            {/* Gold pattern lines */}
            <div className="absolute inset-2 border border-gold/15 rounded-lg" />
            <div className="absolute inset-4 border border-gold/10 rounded-md" />

            {/* Center character */}
            <span
              className="font-display text-gold/60 select-none"
              style={{ fontSize: s.iconSize * 1.5 }}
            >
              五
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
