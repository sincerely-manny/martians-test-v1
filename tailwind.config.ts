import { type Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            transitionTimingFunction: {
                elastic: 'cubic-bezier(.75,-0.5,0,1.75)',
            },
            fontFamily: {
                mono: ['var(--font-mono)', ...fontFamily.mono],
                sans: ['var(--font-sans)', ...fontFamily.sans],
                sansAlt: ['var(--font-sans-alt)', ...fontFamily.serif],
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
    // eslint-disable-next-line global-require
    plugins: [require('tailwindcss-animate')],
} satisfies Config;
