/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unknown-property */
import { AppProps } from 'next/app';
import { Big_Shoulders_Text, Inconsolata } from 'next/font/google';
import { api } from '@/utils/api';
import '@/styles/globals.css';

const sans = Big_Shoulders_Text({
    weight: ['400'],
    style: ['normal'],
    subsets: ['latin'],
    variable: '--font-sans',
});

const mono = Inconsolata({
    weight: ['400'],
    style: ['normal'],
    subsets: ['latin'],
    variable: '--font-mono',
});

const App = ({ Component, pageProps }: AppProps) => (
    <>
        <style jsx global>
            {`
                :root {
                    --font-sans: ${sans.style.fontFamily};
                    --font-mono: ${mono.style.fontFamily};
                }
                `}
        </style>
        <Component {...pageProps} />
    </>
);

export default api.withTRPC(App);
