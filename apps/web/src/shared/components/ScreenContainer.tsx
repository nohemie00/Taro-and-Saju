import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export function ScreenContainer({ children, className = '' }: Props) {
  return (
    <div className={`min-h-screen min-h-[100dvh] w-full flex flex-col ${className}`}>
      {children}
    </div>
  );
}
