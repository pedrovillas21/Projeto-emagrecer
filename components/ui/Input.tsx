import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    suffix?: string;
}

export const Input = ({ label, suffix, className, ...props }: InputProps) => (
    <div className={className}>
        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
            {label}
        </label>
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-200 transition-all">
            <input
                className="w-full p-3 bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                {...props}
            />
            {suffix && (
                <span className="pr-3 text-slate-400 text-sm font-bold select-none">
          {suffix}
        </span>
            )}
        </div>
    </div>
);