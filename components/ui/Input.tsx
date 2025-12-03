import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    suffix?: string;
}

export const Input = ({ label, suffix, className, ...props }: InputProps) => (
    <div className={className}>
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            {label}
        </label>
        <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-blue-900 transition-all">
            <input
                className="w-full p-3 bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                {...props}
            />
            {suffix && (
                <span className="pr-3 text-slate-400 dark:text-slate-500 text-sm font-bold select-none">
          {suffix}
        </span>
            )}
        </div>
    </div>
);