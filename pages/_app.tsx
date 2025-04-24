import ConfigurationContextProvider from '@/context/ConfigurationContextProvider';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigurationContextProvider>
      <Component {...pageProps} />
    </ConfigurationContextProvider>
  );
}
