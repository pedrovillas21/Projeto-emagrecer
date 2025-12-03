import { useState } from 'react';
import { ChevronDown, ChevronUp, TriangleAlert } from 'lucide-react';
import { formatNumber } from '@/utils/math';
import { CalculationResult, CalculatorFormState } from '@/types';

interface ResultCardProps {
    result: CalculationResult;
    form: CalculatorFormState;
}

export const ResultCard = ({ result, form }: ResultCardProps) => {
    const [showDetails, setShowDetails] = useState(false);
    const isDangerous = result.caloriesToEat < result.tmb;

    return (
        <div className="mt-6 animate-fade-in">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-6 rounded-xl text-center relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 dark:bg-emerald-600"></div>
                <p className="text-emerald-800 dark:text-emerald-300 font-medium mb-1 text-sm uppercase tracking-wide">Sua Meta Diária</p>
                <div className="flex items-end justify-center gap-1 mb-4">
                    <span className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">{formatNumber(result.caloriesToEat)}</span>
                    <span className="text-lg text-emerald-600 dark:text-emerald-400 mb-1 font-medium">kcal</span>
                </div>

                <div className="pt-4 border-t border-emerald-200 dark:border-emerald-800 grid grid-cols-3 gap-2 text-center text-sm text-emerald-800 dark:text-emerald-200">
                    <MacroBox label="Prot (1.8g)" value={result.macros.protein} />
                    <MacroBox label="Gord (0.8g)" value={result.macros.fat} />
                    <MacroBox label="Carbo" value={result.macros.carbs} />
                </div>
            </div>

            {isDangerous && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg mt-4 flex items-start gap-3 text-sm text-amber-900 dark:text-amber-200 text-left animate-pulse-slow">
                    <TriangleAlert className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" size={18} />
                    <div>
                        <strong className="block mb-1">Atenção: Déficit Agressivo</strong>
                        As calorias sugeridas estão abaixo da sua Taxa Metabólica Basal ({formatNumber(result.tmb)} kcal).
                    </div>
                </div>
            )}

            <div className="mt-4">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-3"
                >
                    {showDetails ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    {showDetails ? "Ocultar Memória de Cálculo" : "Entender a Matemática"}
                </button>

                {showDetails && <CalculationDetails result={result} form={form} />}
            </div>
        </div>
    );
};

const MacroBox = ({ label, value }: { label: string, value: number }) => (
    <div className="bg-white/60 dark:bg-slate-900/40 p-2 rounded border border-emerald-100/50 dark:border-emerald-800/30">
        <div className="font-bold text-lg">{formatNumber(value)}g</div>
        <div className="text-[10px] uppercase font-bold opacity-60">{label}</div>
    </div>
);

const CalculationDetails = ({ result, form }: any) => (
    <div className="mt-2 bg-slate-800 dark:bg-slate-950 text-slate-200 p-4 rounded-lg text-xs font-mono space-y-3 shadow-inner">
        <p className="text-slate-400 uppercase font-bold tracking-wider mb-2 border-b border-slate-700 pb-1">Memória de Cálculo</p>
        <div className="border-t border-slate-600 pt-2 mt-2">
            <span className="text-green-400">Final:</span><br/>
            {formatNumber(result.tdee)} - {formatNumber(result.dailyDeficit)} = <span className="text-white font-bold text-sm">{formatNumber(result.caloriesToEat)} kcal</span>
        </div>
    </div>
);