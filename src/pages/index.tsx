import { zodResolver } from '@hookform/resolvers/zod';
import throttle from 'lodash.throttle';
import { Disc3 } from 'lucide-react';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { api } from '@/utils/api';
import signInSchema from '@/lib/schema/signIn';
import { Input } from '@/components/ui/Input';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/Form';
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

    const signInForm = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            login: '',
            password: '',
        },
    });
    const [signInFormDisabled, setSignInFormDisabled] = useState(false);
    const signInQuery = api.user.signIn.useMutation();
    useEffect(() => {
        if (signInQuery.isError) {
            const errors = signInQuery.error?.data?.zodError?.fieldErrors;
            if (errors?.login) {
                signInForm.setError('login', { message: errors.login.join(', ') });
            }
            if (errors?.password) {
                signInForm.setError('password', { message: errors.password.join(', ') });
            }
        }
    }, [
        signInForm,
        signInQuery.error?.data?.zodError?.fieldErrors,
        signInQuery.isError,
        signInQuery.status,
    ]);
    useEffect(() => {
        setSignInFormDisabled(signInQuery.isLoading);
    }, [signInQuery.isLoading]);
    const onSubmit = (data: z.infer<typeof signInSchema>) => {
        const { login, password } = data;
        signInQuery.mutate({ login, password });
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
            <main className="grid min-h-screen grid-cols-1 items-stretch bg-slate-300">
                <div className="col-span-1 col-start-1 col-end-1 row-span-1 row-start-1 row-end-1 w-screen overflow-hidden">
                    <div
                        className="w-[1000px] transition-transform will-change-transform duration-0 ease-in-out"
                        ref={cursorDiv}
                    >
                        <div className="-ml-[50%] -mt-[50%] aspect-[4/3] w-full origin-center -rotate-45 rounded-full bg-indigo-500 opacity-100" />
                    </div>
                </div>
                <div className="col-span-1 col-start-1 col-end-1 row-span-1 row-start-1 row-end-1 w-screen backdrop-blur-[300px]" />
                <div className="col-span-1 col-start-1 col-end-1 row-span-1 row-start-1 row-end-1 w-screen bg-[url('/img/fuzzy-fuzz.gif')] opacity-10" />
                <div className="col-span-1 col-start-1 col-end-1 row-span-1 row-start-1 row-end-1 w-screen overflow-hidden bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 opacity-50 backdrop-blur-xl" />
                <div className="col-span-1 col-start-1 col-end-1 row-span-1 row-start-1 row-end-1 flex items-center justify-center">
                    <div className="container relative my-10 flex flex-col items-center justify-center gap-12 rounded-lg bg-slate-400 bg-opacity-10 px-4 py-16 shadow-2xl backdrop-blur-sm">
                        <h1 className="w-full text-right text-8xl">LET&apos;S SIGN IN / SIGN UP</h1>
                        <Form {...signInForm}>
                            <form
                                onSubmit={(e) => void signInForm.handleSubmit(onSubmit)(e)}
                                className="group w-1/2 min-w-fit max-w-lg space-y-8"
                                data-loading={signInForm.formState.isSubmitting}
                            >
                                <FormField
                                    control={signInForm.control}
                                    name="login"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Login
                                                {' '}
                                                <FormMessage className="text-red-700" />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="mail@gmail.com"
                                                    autoComplete="off"
                                                    aria-disabled={signInFormDisabled}
                                                    disabled={signInFormDisabled}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs opacity-70">
                                                E-mail or username
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={signInForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Password
                                                {' '}
                                                <FormMessage className="text-red-700" />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="********"
                                                    autoComplete="off"
                                                    type="password"
                                                    aria-disabled={signInFormDisabled}
                                                    disabled={signInFormDisabled}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    aria-disabled={
                                        signInFormDisabled
                                        || !!signInForm.formState.errors.login
                                        || !!signInForm.formState.errors.password
                                    }
                                    disabled={
                                        signInFormDisabled
                                        || !!signInForm.formState.errors.login
                                        || !!signInForm.formState.errors.password
                                    }
                                >
                                    Submit
                                </Button>
                                {signInQuery.isLoading && <Disc3 className="inline align-top animate-spin ml-5" size={60} />}
                            </form>
                        </Form>
                    </div>
                </div>
            </main>
        </>
    );
};
