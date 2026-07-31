/**
 * 공유 이미지 생성 유틸리티
 * Canvas API를 사용하여 타로 결과 / 오늘의 컬러를 이미지로 렌더링
 */

const SHARE_W = 720;
const SHARE_H = 1280;

// --- 공통 헬퍼 ---

function createCanvas(w = SHARE_W, h = SHARE_H): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  return [c, ctx];
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // 외부 URL만 crossOrigin 설정 — 로컬 경로(/)는 same-origin이므로 불필요
    // crossOrigin을 설정하면 서버가 CORS 헤더를 주지 않을 때 Canvas가 tainted됨
    const isExternal = /^https?:\/\//.test(src);
    if (isExternal) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Image load failed: ${src}`));
    img.src = src;
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const chars = text.split('');
  let line = '';
  let curY = y;

  for (const char of chars) {
    const testLine = line + char;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line.length > 0) {
      ctx.fillText(line, x, curY);
      line = char;
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, curY);
    curY += lineHeight;
  }
  return curY;
}

// --- 배경 그리기 ---

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // 그라데이션 배경
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#0F1028');
  grad.addColorStop(0.5, '#1A1040');
  grad.addColorStop(1, '#2A1B4A');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // 장식 별 도트
  ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
  const starPositions = [
    [80, 120], [640, 80], [200, 300], [520, 250], [100, 900],
    [620, 950], [350, 1100], [60, 600], [660, 600], [400, 150],
  ];
  for (const [sx, sy] of starPositions) {
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// --- 타로 결과 공유 이미지 ---

interface TarotShareData {
  nickname: string;
  date: string;
  cards: Array<{
    card_id: string;
    name_kr: string;
    name_hanja: string;
    orientation: 'upright' | 'reversed';
    positionLabel: string;
    keywords: string[];
    color_hex: string;
  }>;
  readingMessage: string;
  cardImageUrls: (string | null)[];
}

export async function generateTarotShareImage(data: TarotShareData): Promise<Blob> {
  const [canvas, ctx] = createCanvas();

  drawBackground(ctx, SHARE_W, SHARE_H);

  // --- 상단 브랜드 ---
  ctx.textAlign = 'center';
  ctx.fillStyle = '#D4AF37';
  ctx.font = '600 20px "Gowun Batang", serif';
  ctx.fillText('오색운 · 五色運', SHARE_W / 2, 60);

  // 날짜
  ctx.fillStyle = '#A89FB8';
  ctx.font = '16px "Cormorant Garamond", serif';
  ctx.fillText(data.date, SHARE_W / 2, 90);

  // 구분선
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(260, 110);
  ctx.lineTo(460, 110);
  ctx.stroke();

  // --- 닉네임 ---
  ctx.fillStyle = '#F5F0E1';
  ctx.font = '600 22px "Gowun Batang", serif';
  ctx.fillText(`${data.nickname}님의 오늘의 타로`, SHARE_W / 2, 150);

  // --- 카드 3장 ---
  const CARD_W = 160;
  const CARD_H = 240;
  const CARD_GAP = 24;
  const totalCardsWidth = CARD_W * 3 + CARD_GAP * 2;
  const cardsStartX = (SHARE_W - totalCardsWidth) / 2;
  const cardsY = 180;

  // 카드 이미지 로드 시도
  const cardImages: (HTMLImageElement | null)[] = [];
  for (const url of data.cardImageUrls) {
    if (url) {
      try {
        const img = await loadImage(url);
        cardImages.push(img);
      } catch {
        cardImages.push(null);
      }
    } else {
      cardImages.push(null);
    }
  }

  for (let i = 0; i < 3; i++) {
    const card = data.cards[i];
    if (!card) continue;

    const cx = cardsStartX + i * (CARD_W + CARD_GAP);
    const cy = cardsY;

    // 포지션 라벨
    ctx.textAlign = 'center';
    ctx.fillStyle = '#A89FB880';
    ctx.font = '13px "Pretendard", sans-serif';
    ctx.fillText(`[ ${card.positionLabel} ]`, cx + CARD_W / 2, cy);

    const cardTop = cy + 16;

    // 카드 배경 (둥근 사각형)
    drawRoundRect(ctx, cx, cardTop, CARD_W, CARD_H, 12);

    if (cardImages[i]) {
      // 클리핑 후 이미지
      ctx.save();
      ctx.clip();
      const img = cardImages[i]!;
      // object-cover 계산
      const imgRatio = img.width / img.height;
      const cardRatio = CARD_W / CARD_H;
      let sw: number, sh: number, sx: number, sy: number;
      if (imgRatio > cardRatio) {
        sh = img.height;
        sw = sh * cardRatio;
        sx = (img.width - sw) / 2;
        sy = 0;
      } else {
        sw = img.width;
        sh = sw / cardRatio;
        sx = 0;
        sy = (img.height - sh) / 2;
      }

      if (card.orientation === 'reversed') {
        ctx.translate(cx + CARD_W / 2, cardTop + CARD_H / 2);
        ctx.rotate(Math.PI);
        ctx.drawImage(img, sx, sy, sw, sh, -CARD_W / 2, -CARD_H / 2, CARD_W, CARD_H);
      } else {
        ctx.drawImage(img, sx, sy, sw, sh, cx, cardTop, CARD_W, CARD_H);
      }
      ctx.restore();

      // 하단 그라데이션 오버레이 (이름 가독성)
      drawRoundRect(ctx, cx, cardTop, CARD_W, CARD_H, 12);
      ctx.save();
      ctx.clip();
      const nameGrad = ctx.createLinearGradient(cx, cardTop + CARD_H - 60, cx, cardTop + CARD_H);
      nameGrad.addColorStop(0, 'rgba(0,0,0,0)');
      nameGrad.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = nameGrad;
      ctx.fillRect(cx, cardTop + CARD_H - 60, CARD_W, 60);
      ctx.restore();
    } else {
      // fallback: 색상 카드
      const grad = ctx.createLinearGradient(cx, cardTop, cx + CARD_W, cardTop + CARD_H);
      grad.addColorStop(0, card.color_hex);
      grad.addColorStop(1, card.color_hex + 'CC');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // 카드 테두리
    drawRoundRect(ctx, cx, cardTop, CARD_W, CARD_H, 12);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 카드 이름 + 정/역 (카드 아래)
    const labelY = cardTop + CARD_H + 24;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#F5F0E1';
    ctx.font = '600 15px "Gowun Batang", serif';
    ctx.fillText(card.name_kr, cx + CARD_W / 2, labelY);

    const orientBadge = card.orientation === 'upright' ? '正' : '逆';
    const badgeColor = card.orientation === 'upright' ? '#D4AF37' : '#A89FB8';
    ctx.fillStyle = badgeColor;
    ctx.font = '700 12px "Pretendard", sans-serif';
    ctx.fillText(orientBadge, cx + CARD_W / 2, labelY + 20);
  }

  // --- 리딩 메시지 ---
  const msgY = cardsY + CARD_H + 80;

  // 메시지 박스 배경
  const msgBoxX = 48;
  const msgBoxW = SHARE_W - 96;
  const msgBoxPadding = 28;

  // 먼저 텍스트 높이 계산
  ctx.font = '17px "Gowun Batang", serif';
  const testCanvas = document.createElement('canvas').getContext('2d')!;
  testCanvas.font = ctx.font;
  let testY = 0;
  const testChars = data.readingMessage.split('');
  let testLine = '';
  const testMaxW = msgBoxW - msgBoxPadding * 2;
  for (const ch of testChars) {
    const tl = testLine + ch;
    if (testCanvas.measureText(tl).width > testMaxW && testLine.length > 0) {
      testLine = ch;
      testY += 30;
    } else {
      testLine = tl;
    }
  }
  testY += 30;
  const msgBoxH = testY + msgBoxPadding * 2;

  drawRoundRect(ctx, msgBoxX, msgY, msgBoxW, msgBoxH, 16);
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 메시지 텍스트
  ctx.textAlign = 'center';
  ctx.fillStyle = '#F5F0E1E6';
  ctx.font = '17px "Gowun Batang", serif';
  wrapText(
    ctx,
    data.readingMessage,
    SHARE_W / 2,
    msgY + msgBoxPadding + 17,
    testMaxW,
    30,
  );

  // --- 키워드 태그 ---
  const kwY = msgY + msgBoxH + 32;
  const keywords = data.cards.map((c) => c.keywords[0]).filter(Boolean);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#A89FB860';
  ctx.font = '13px "Pretendard", sans-serif';
  ctx.fillText('오늘의 키워드', SHARE_W / 2, kwY);

  if (keywords.length > 0) {
    ctx.font = '14px "Pretendard", sans-serif';
    const kwTotalW = keywords.reduce((sum, kw) => {
      return sum + ctx.measureText(kw).width + 32 + 12;
    }, -12);
    let kwX = (SHARE_W - kwTotalW) / 2;

    for (const kw of keywords) {
      const kwW = ctx.measureText(kw).width + 32;
      drawRoundRect(ctx, kwX, kwY + 12, kwW, 30, 15);
      ctx.fillStyle = 'rgba(212, 175, 55, 0.08)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#D4AF37';
      ctx.font = '14px "Pretendard", sans-serif';
      ctx.fillText(kw, kwX + kwW / 2, kwY + 32);
      kwX += kwW + 12;
    }
  }

  // --- 하단 워터마크 ---
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(168, 159, 184, 0.3)';
  ctx.font = '12px "Pretendard", sans-serif';
  ctx.fillText('오색운 · 사주와 타로로 보는 오늘의 색', SHARE_W / 2, SHARE_H - 40);

  // Canvas → Blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))),
      'image/png',
      1.0,
    );
  });
}

// --- 오늘의 컬러 공유 이미지 ---

interface ColorShareData {
  nickname: string;
  date: string;
  colorName: string;
  colorHex: string;
  missionText: string;
}

export async function generateColorShareImage(data: ColorShareData): Promise<Blob> {
  const [canvas, ctx] = createCanvas();

  drawBackground(ctx, SHARE_W, SHARE_H);

  // --- 상단 브랜드 ---
  ctx.textAlign = 'center';
  ctx.fillStyle = '#D4AF37';
  ctx.font = '600 20px "Gowun Batang", serif';
  ctx.fillText('오색운 · 五色運', SHARE_W / 2, 80);

  // 날짜
  ctx.fillStyle = '#A89FB8';
  ctx.font = '16px "Cormorant Garamond", serif';
  ctx.fillText(data.date, SHARE_W / 2, 115);

  // --- 닉네임 ---
  ctx.fillStyle = '#F5F0E1';
  ctx.font = '600 22px "Gowun Batang", serif';
  ctx.fillText(`${data.nickname}님의 오늘의 색`, SHARE_W / 2, 180);

  // --- 컬러 오브 ---
  const orbCx = SHARE_W / 2;
  const orbCy = 440;
  const orbR = 140;

  // 외곽 글로우
  const glowGrad = ctx.createRadialGradient(orbCx, orbCy, orbR * 0.8, orbCx, orbCy, orbR * 1.8);
  glowGrad.addColorStop(0, data.colorHex + '40');
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(orbCx, orbCy, orbR * 1.8, 0, Math.PI * 2);
  ctx.fill();

  // 오브 본체
  const orbGrad = ctx.createRadialGradient(orbCx - 30, orbCy - 30, 10, orbCx, orbCy, orbR);
  orbGrad.addColorStop(0, data.colorHex + 'FF');
  orbGrad.addColorStop(0.7, data.colorHex + 'DD');
  orbGrad.addColorStop(1, data.colorHex + '88');
  ctx.fillStyle = orbGrad;
  ctx.beginPath();
  ctx.arc(orbCx, orbCy, orbR, 0, Math.PI * 2);
  ctx.fill();

  // 오브 테두리
  ctx.strokeStyle = data.colorHex + '60';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 하이라이트
  const hlGrad = ctx.createRadialGradient(orbCx - 40, orbCy - 50, 5, orbCx - 20, orbCy - 30, orbR * 0.6);
  hlGrad.addColorStop(0, 'rgba(255,255,255,0.3)');
  hlGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = hlGrad;
  ctx.beginPath();
  ctx.arc(orbCx, orbCy, orbR, 0, Math.PI * 2);
  ctx.fill();

  // 컬러 이름
  ctx.textAlign = 'center';
  ctx.fillStyle = '#F5F0E1';
  ctx.font = '700 32px "Gowun Batang", serif';
  ctx.fillText(data.colorName, SHARE_W / 2, orbCy + orbR + 60);

  // 컬러 헥스
  ctx.fillStyle = '#A89FB880';
  ctx.font = '16px "Cormorant Garamond", serif';
  ctx.fillText(data.colorHex.toUpperCase(), SHARE_W / 2, orbCy + orbR + 90);

  // --- 오늘의 미션 ---
  const missionY = orbCy + orbR + 140;
  const mBoxX = 64;
  const mBoxW = SHARE_W - 128;

  ctx.fillStyle = '#A89FB860';
  ctx.font = '13px "Pretendard", sans-serif';
  ctx.fillText('오늘의 미션', SHARE_W / 2, missionY);

  // 미션 박스
  ctx.font = '16px "Gowun Batang", serif';
  const testCtx2 = document.createElement('canvas').getContext('2d')!;
  testCtx2.font = ctx.font;
  let mtY = 0;
  const mChars = data.missionText.split('');
  let mLine = '';
  const mMaxW = mBoxW - 48;
  for (const ch of mChars) {
    const tl = mLine + ch;
    if (testCtx2.measureText(tl).width > mMaxW && mLine.length > 0) {
      mLine = ch;
      mtY += 28;
    } else {
      mLine = tl;
    }
  }
  mtY += 28;
  const mBoxH = mtY + 48;

  drawRoundRect(ctx, mBoxX, missionY + 16, mBoxW, mBoxH, 16);
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#F5F0E1CC';
  ctx.font = '16px "Gowun Batang", serif';
  wrapText(ctx, data.missionText, SHARE_W / 2, missionY + 44, mMaxW, 28);

  // --- 하단 워터마크 ---
  ctx.fillStyle = 'rgba(168, 159, 184, 0.3)';
  ctx.font = '12px "Pretendard", sans-serif';
  ctx.fillText('오색운 · 사주와 타로로 보는 오늘의 색', SHARE_W / 2, SHARE_H - 40);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))),
      'image/png',
      1.0,
    );
  });
}

// --- 공유/저장 함수 ---

export async function shareImage(blob: Blob, title: string): Promise<'shared' | 'copied' | 'saved'> {
  const file = new File([blob], 'osaekwoon-share.png', { type: 'image/png' });

  // Web Share API (모바일 네이티브 공유)
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title,
        text: '오색운 · 사주와 타로로 보는 오늘의 색',
        files: [file],
      });
      return 'shared';
    } catch {
      // 사용자가 취소한 경우 → fallback
    }
  }

  // Fallback: 이미지 다운로드
  return saveImage(blob);
}

export function saveImage(blob: Blob): 'saved' {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `osaekwoon-${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return 'saved';
}
