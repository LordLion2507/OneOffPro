'use client';

import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import StartScreen from '@/components/StartScreen';

const MIN_LOADING_MS = 900;

export default function HomePage() {
  const [showStart, setShowStart] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowStart(true), MIN_LOADING_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (!showStart) {
    return <LoadingScreen />;
  }

  return <StartScreen />;
}
