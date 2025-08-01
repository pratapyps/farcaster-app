// pages/_app.tsx
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // hide Farcaster splash screen once the page is ready
    sdk.actions.ready().catch(console.error);
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;