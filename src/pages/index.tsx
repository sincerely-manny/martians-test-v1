import throttle from 'lodash.throttle';
import Head from 'next/head';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import signInSchema from '@/lib/schema/signIn';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

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
        window.addEventListener('mousemove', mouseMoveHandler);
        return () => window.removeEventListener('mousemove', mouseMoveHandler);
    });

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            login: '',
            password: '',
        },
    });
    const onSubmit = (data: z.infer<typeof signInSchema>) => {
        console.log(data);
    };
    return (
        <>
            <Head>
                <title>Test item for martians</title>
                <meta name="description" content="Test sing-in form" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="rgb(100 116 139)" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-slate-300">
                <div className="absolute left-0 top-0 w-screen h-screen overflow-hidden">
                    <div
                        className="w-[1000px] transition-transform will-change-transform duration-0 ease-in-out"
                        ref={cursorDiv}
                    >
                        <div className="-ml-[50%] -mt-[50%] aspect-[4/3] w-full origin-center -rotate-45 rounded-full bg-indigo-500 opacity-100" />
                    </div>
                </div>
                <div className="absolute left-0 top-0 h-screen w-screen backdrop-blur-[300px]" />
                <div className="absolute left-0 top-0 h-screen w-screen bg-[url('/img/fuzzy-fuzz.gif')] opacity-10" />
                <div className="absolute left-0 top-0 h-screen w-screen overflow-hidden bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 opacity-50 backdrop-blur-xl" />
                <div className="container relative flex flex-col items-center justify-center gap-12 rounded-lg bg-slate-400 bg-opacity-10 px-4 py-16 shadow-2xl backdrop-blur-sm">
                    <h1 className="w-full text-right text-8xl">LET&apos;S SIGN IN</h1>
                    <Form {...form}>
                        <form
                            onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
                            className="space-y-8 w-1/2 min-w-fit max-w-lg"
                        >
                            <FormField
                                control={form.control}
                                name="login"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Login
                                            {' '}
                                            <FormMessage className="text-red-700" />
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="mail@gmail.com" autoComplete="off" {...field} />
                                        </FormControl>
                                        <FormDescription className="text-xs opacity-70">
                                            E-mail or username
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Password
                                            {' '}
                                            <FormMessage className="text-red-700" />
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="********" autoComplete="off" type="password" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" tabIndex={0}>Submit</Button>
                        </form>
                    </Form>
                </div>
            </main>
        </>
    );
};
