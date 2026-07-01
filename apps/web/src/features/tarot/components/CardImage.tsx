import { motion } from 'framer-motion';

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
  sm: { w: 70, h: 98, hanjaSize: 12, nameSize: 9, iconSize: 18 },
  md: { w: 140, h: 196, hanjaSize: 18, nameSize: 14, iconSize: 28 },
  lg: { w: 210, h: 294, hanjaSize: 24, nameSize: 16, iconSize: 36 },
};

const CATEGORY_ICONS: Record<string, string> = {
  major: '\u2726',  // ✦
  element: '\u25CB', // ○
  zodiac: '\u2606',  // ☆
  protection: '\u5352', // 卒 (using a CJK char as visual proxy)
  luck: '\u2605',   // ★
};

// zodiac animal emojis
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
  const icon = (card as any).zodiac
    ? ZODIAC_EMOJIS[(card as any).zodiac] || CATEGORY_ICONS.zodiac
    : CATEGORY_ICONS[card.category] || '\u25CB';

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
          className="absolute -inset-[2px] rounded-[14px] opacity-70"
          style={{
            background: 'linear-gradient(135deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff, #ff0000)',
            backgroundSize: '400% 400%',
            animation: 'holoShift 3s linear infinite',
          }}
        />
      )}

      {/* Card body */}
      <div
        className="relative w-full h-full rounded-xl overflow-hidden flex flex-col items-center justify-between p-2"
        style={{
          background: `linear-gradient(135deg, ${card.color_hex} 0%, ${card.color_hex}CC 100%)`,
          boxShadow: card.category === 'major'
            ? `0 0 20px ${card.color_hex}66`
            : '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        {/* Hanja name */}
        <span
          className="font-numeric text-center leading-tight text-white/90"
          style={{ fontSize: s.hanjaSize }}
        >
          {card.name_hanja}
        </span>

        {/* Icon */}
        <span
          className="block text-center"
          style={{ fontSize: s.iconSize, lineHeight: 1.2 }}
        >
          {icon}
        </span>

        {/* Korean name */}
        <span
          className="font-display text-center leading-tight text-white"
          style={{ fontSize: s.nameSize }}
        >
          {card.name_kr}
        </span>
      </div>
    </motion.div>
  );
}

/** Card back design */
export function CardBack({ size = 'md', selected = false }: { size?: 'sm' | 'md' | 'lg'; selected?: boolean }) {
  const s = SIZES[size];

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: s.w, height: s.h }}
    >
      <div
        className={`w-full h-full rounded-xl overflow-hidden flex items-center justify-center border-2 transition-all duration-300 ${
          selected ? 'border-gold shadow-[0_0_20px_rgba(212,175,55,0.5)]' : 'border-gold/20'
        }`}
        style={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #1A1A2E 100%)',
        }}
      >
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
    </div>
  );
}
