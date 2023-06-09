import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { Big_Shoulders_Text, Inconsolata } from 'next/font/google';

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


const MyApp: AppType = ({ Component, pageProps }) => (
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

export default api.withTRPC(MyApp);
