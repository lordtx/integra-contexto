'use client';
import { useEffect } from 'react';

export default function OverlayLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.style.background = 'transparent';
    document.body.style.backgroundColor = 'transparent';
  }, []);
  return <>{children}</>;
}