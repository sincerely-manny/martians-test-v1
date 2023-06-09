import throttle from "lodash.throttle";
import Head from "next/head";
import { useEffect, useRef } from "react";

export default () => {
    const cursorDiv = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const cursor = cursorDiv.current;
        const mouseMoveHandler = throttle((e: MouseEvent) => {
            window.requestAnimationFrame(() => {
                if (cursor) {
                    cursor.style.transform = `translate(${e.pageX}px, ${e.pageY}px)`;
                }
            });
        }, 10);
        window.addEventListener("mousemove", mouseMoveHandler);
        return () => window.removeEventListener("mousemove", mouseMoveHandler);
    });
    return (
        <>
            <Head>
                <title>Test item for martians</title>
                <meta name="description" content="Test sing-in form" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-slate-300">
                <div
                    className="absolute left-0 top-0 box-content w-1/3 transition-transform duration-0 ease-in-out will-change-transform"
                    ref={cursorDiv}
                >
                    <div className="-ml-[50%] -mt-[50%] aspect-[4/3] w-full origin-center -rotate-45 rounded-full bg-indigo-500 opacity-100" />
                </div>
                <div className="absolute left-0 top-0 h-screen w-screen backdrop-blur-[300px]" />
                <div className="absolute left-0 top-0 h-screen w-screen bg-[url('/img/fuzzy-fuzz.gif')] opacity-10" />
                <div className="absolute left-0 top-0 h-screen w-screen overflow-hidden bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 opacity-50 backdrop-blur-xl" />
                <div className="container relative flex flex-col items-center justify-center gap-12 rounded-lg bg-slate-400 bg-opacity-10 px-4 py-16 shadow-2xl backdrop-blur-sm">
                    <h1 className="text-8xl text-right w-full">LET&apos;S SIGN IN</h1>
                    
                </div>
            </main>
        </>
    );
};
