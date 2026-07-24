import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import SplashScreen from '@/components/SplashScreen';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { restoreSession } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    restoreSession();
  }, [restoreSession]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <Component {...pageProps} />
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
}
