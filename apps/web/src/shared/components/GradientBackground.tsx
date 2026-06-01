import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  overlayColor?: string;
  overlayOpacity?: number;
}

export function GradientBackground({ children, overlayColor, overlayOpacity = 0.3 }: Props) {
  return (
    <div className="min-h-screen min-h-[100dvh] w-full gradient-bg relative overflow-hidden">
      {overlayColor && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 20%, ${overlayColor} 0%, transparent 70%)`,
            opacity: overlayOpacity,
          }}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
