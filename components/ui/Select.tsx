import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { value: string | number; label: string }[];
}

export const Select = ({ label, options, ...props }: SelectProps) => (
    <div>
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            {label}
        </label>
        <div className="relative">
            <select
                className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-200 dark:focus-within:ring-blue-900 transition-all text-slate-900 dark:text-slate-100 appearance-none cursor-pointer"
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="dark:bg-slate-800">
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
    </div>
);