import { zodResolver } from '@hookform/resolvers/zod';
import * as Tabs from '@radix-ui/react-tabs';
import throttle from 'lodash.throttle';
import { Disc3 } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import { api } from '@/utils/api';
import signUpSchema from '@/lib/schema/signUp';
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
import MainLayout from '@/components/MainLayout';

export default () => {
    const router = useRouter();
    const { slug } = router.query;
    const cursorDiv = useRef<HTMLDivElement>(null);
    const setCookie = useCookies(['x-access-token'])[1];

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
            if (signInQuery.error?.data?.code === 'UNAUTHORIZED') {
                signInForm.setError('root', { message: 'Invalid login or password' });
            }
        }
    }, [
        signInForm,
        signInQuery.error?.data?.code,
        signInQuery.error?.data?.zodError?.fieldErrors,
        signInQuery.isError,
        signInQuery.status,
    ]);
    useEffect(() => {
        setSignInFormDisabled(signInQuery.isLoading);
    }, [signInQuery.isLoading]);
    const onSingInSubmit = (data: z.infer<typeof signInSchema>) => {
        const { login, password } = data;
        signInQuery
            .mutateAsync({ login, password })
            .then((user) => {
                setCookie('x-access-token', user.token, { path: '/' });
                router.push('/protected').catch(() => {
                    // eslint-disable-next-line no-console
                    console.log('Error redirecting to /protected');
                });
            })
            .catch(() => {});
    };

    const signUpForm = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            password: '',
            passwordConfirmation: '',
            email: '',
        },
    });
    const [signUpFormDisabled, setSignUpFormDisabled] = useState(false);
    const signUpQuery = api.user.signUp.useMutation();
    useEffect(() => {
        if (signUpQuery.isError) {
            const errors = signUpQuery.error?.data?.zodError?.fieldErrors;
            if (errors?.email) {
                signUpForm.setError('email', { message: errors.email.join(', ') });
            }
            if (errors?.username) {
                signUpForm.setError('username', { message: errors.username.join(', ') });
            }
            if (errors?.password) {
                signUpForm.setError('password', { message: errors.password.join(', ') });
            }
            if (errors?.passwordConfirmation) {
                signUpForm.setError('passwordConfirmation', {
                    message: errors.passwordConfirmation.join(', '),
                });
            }
        }
    }, [
        signUpForm,
        signUpQuery.error?.data?.zodError?.fieldErrors,
        signUpQuery.isError,
        signUpQuery.status,
    ]);
    useEffect(() => {
        setSignUpFormDisabled(signUpQuery.isLoading);
    }, [signUpQuery.isLoading]);
    const onSingUpSubmit = (data: z.infer<typeof signUpSchema>) => {
        const {
            username, email, password, passwordConfirmation,
        } = data;
        signUpQuery.mutateAsync({
            username,
            email,
            password,
            passwordConfirmation,
        }).then((user) => {
            setCookie('x-access-token', user.token, { path: '/' });
            router.push('/protected').catch(() => {
                // eslint-disable-next-line no-console
                console.log('Error redirecting to /protected');
            });
        }).catch(() => {});
    };

    return (
        <MainLayout>
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
                <div className="container relative my-10 flex flex-col items-center justify-center gap-12 rounded-lg bg-slate-400 bg-opacity-10 px-4 py-16 shadow-2xl backdrop-blur-sm transition-all duration-1000">
                    <Tabs.Root value={slug?.toString() || 'sign-in'}>
                        <h1 className="mb-10 w-full text-right text-8xl">
                            LET&apos;S
                            {' '}
                            <Link
                                href="/user/sign-in"
                                aria-selected={slug === 'sign-in' || !slug}
                                className="group inline-flex flex-col opacity-50 transition-all duration-500 ease-in aria-selected:opacity-100"
                            >
                                <span>SIGN IN</span>
                                <div className="h-1 w-0 self-end bg-slate-700 transition-all duration-500 ease-in group-aria-selected:w-full" />
                            </Link>
                            {' '}
                            /
                            {' '}
                            <Link
                                href="/user/sign-up"
                                aria-selected={slug === 'sign-up'}
                                className="group inline-flex flex-col opacity-50 transition-all duration-500 ease-in aria-selected:opacity-100"
                            >
                                <span>SIGN UP</span>
                                <div className="h-1 w-0 self-start bg-slate-700 transition-all duration-500 ease-in group-aria-selected:w-full" />
                            </Link>
                        </h1>
                        <Tabs.Content
                            value="sign-in"
                            className="origin-top-left data-[state=active]:animate-tab-show data-[state=inactive]:animate-tab-hide"
                        >
                            <Form {...signInForm}>
                                <form
                                    onSubmit={
                                        (e) => void signInForm.handleSubmit(onSingInSubmit)(e)
                                    }
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
                                    {signInQuery.isLoading && (
                                        <Disc3
                                            className="ml-5 inline animate-spin align-top"
                                            size={60}
                                        />
                                    )}
                                    <span className="text-red-700 float-right">
                                        {signInForm.formState.errors.root?.message}
                                    </span>
                                </form>
                            </Form>
                        </Tabs.Content>

                        <Tabs.Content
                            value="sign-up"
                            className="origin-top-left data-[state=active]:animate-tab-show data-[state=inactive]:animate-tab-hide"
                        >
                            <Form {...signUpForm}>
                                <form
                                    onSubmit={
                                        (e) => void signUpForm.handleSubmit(onSingUpSubmit)(e)
                                    }
                                    className="group w-1/2 min-w-fit max-w-lg space-y-8"
                                    data-loading={signUpForm.formState.isSubmitting}
                                >
                                    <FormField
                                        control={signUpForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Email
                                                    {' '}
                                                    <FormMessage className="text-red-700" />
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="mail@gmail.com"
                                                        autoComplete="off"
                                                        aria-disabled={signUpFormDisabled}
                                                        disabled={signUpFormDisabled}
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={signUpForm.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Username
                                                    {' '}
                                                    <FormMessage className="text-red-700" />
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        autoComplete="off"
                                                        aria-disabled={signUpFormDisabled}
                                                        disabled={signUpFormDisabled}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs opacity-70">
                                                    1-50 characters, starts with a letter, only
                                                    letters and numbers
                                                </FormDescription>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={signUpForm.control}
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
                                                        aria-disabled={signUpFormDisabled}
                                                        disabled={signUpFormDisabled}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs opacity-70">
                                                    8-50 characters
                                                </FormDescription>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={signUpForm.control}
                                        name="passwordConfirmation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Password confirmation
                                                    {' '}
                                                    <FormMessage className="text-red-700" />
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="one more time"
                                                        autoComplete="off"
                                                        type="password"
                                                        aria-disabled={signUpFormDisabled}
                                                        disabled={signUpFormDisabled}
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        aria-disabled={
                                            signUpFormDisabled
                                            || !!signUpForm.formState.errors.email
                                            || !!signUpForm.formState.errors.password
                                            || !!signUpForm.formState.errors.passwordConfirmation
                                            || !!signUpForm.formState.errors.username
                                        }
                                        disabled={
                                            signUpFormDisabled
                                            || !!signUpForm.formState.errors.email
                                            || !!signUpForm.formState.errors.password
                                            || !!signUpForm.formState.errors.passwordConfirmation
                                            || !!signUpForm.formState.errors.username
                                        }
                                    >
                                        Submit
                                    </Button>
                                    {signUpQuery.isLoading && (
                                        <Disc3
                                            className="ml-5 inline animate-spin align-top"
                                            size={60}
                                        />
                                    )}
                                </form>
                            </Form>
                        </Tabs.Content>
                    </Tabs.Root>
                </div>
            </div>
        </MainLayout>
    );
};
