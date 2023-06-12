import { forwardRef } from 'react';
import cn from '@/lib/cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
    <input
        type={type}
        className={cn(
            'bg-white delay-300 bg-opacity-20 backdrop-blur-3xl outline-offset-0 transition-all ease-elastic hover:outline-offset-8 hover:scale-100 focus:outline-offset-8 focus:scale-100 scale-[97.5%] outline-1 outline-dashed outline-slate-500 placeholder:opacity-60 placeholder:text-inherit flex h-10 w-full rounded-3xl border-0 px-3 py-2 font-mono text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 origin-left aria-invalid:outline-red-700',
            className,
        )}
        ref={ref}
        {...props}
    />
));
Input.displayName = 'Input';

export { Input };
