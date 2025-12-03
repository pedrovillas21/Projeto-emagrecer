import { useState } from 'react';
import { ChevronDown, ChevronUp, TriangleAlert } from 'lucide-react';
import { formatNumber } from '@/utils/math';
import { CalculationResult, CalculatorFormState } from '@/types'; // Importar tipos

interface ResultCardProps {
    result: CalculationResult; // Troquei 'any' por 'CalculationResult'
    form: CalculatorFormState; // Troquei 'any' por 'CalculatorFormState'
}

export const ResultCard = ({ result, form }: ResultCardProps) => {
    const [showDetails, setShowDetails] = useState(false);

    // Verifica se a dieta é perigosamente baixa (abaixo do metabolismo basal)
    const isDangerous = result.caloriesToEat < result.tmb;

    return (
        <div className="mt-6 animate-fade-in">
            {/* Card Principal */}
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl text-center relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400"></div>
                <p className="text-emerald-800 font-medium mb-1 text-sm uppercase tracking-wide">Sua Meta Diária</p>
                <div className="flex items-end justify-center gap-1 mb-4">
                    <span className="text-5xl font-bold text-emerald-600">{formatNumber(result.caloriesToEat)}</span>
                    <span className="text-lg text-emerald-600 mb-1 font-medium">kcal</span>
                </div>

                {/* Macros Grid */}
                <div className="pt-4 border-t border-emerald-200 grid grid-cols-3 gap-2 text-center text-sm text-emerald-800">
                    <MacroBox label="Prot (1.8g)" value={result.macros.protein} />
                    <MacroBox label="Gord (0.8g)" value={result.macros.fat} />
                    <MacroBox label="Carbo" value={result.macros.carbs} />
                </div>
            </div>

            {/* Alerta de Segurança */}
            {isDangerous && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mt-4 flex items-start gap-3 text-sm text-amber-900 text-left animate-pulse-slow">
                    <TriangleAlert className="shrink-0 mt-0.5 text-amber-600" size={18} />
                    <div>
                        <strong className="block mb-1">Atenção: Déficit Agressivo</strong>
                        As calorias sugeridas estão abaixo da sua Taxa Metabólica Basal ({formatNumber(result.tmb)} kcal). Isso pode desacelerar seu metabolismo. Considere aumentar a atividade física em vez de reduzir tanto a comida.
                    </div>
                </div>
            )}

            {/* Botão Detalhes */}
            <div className="mt-4">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors py-3"
                >
                    {showDetails ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    {showDetails ? "Ocultar Memória de Cálculo" : "Entender a Matemática"}
                </button>

                {showDetails && <CalculationDetails result={result} form={form} />}
            </div>
        </div>
    );
};

// Sub-componentes para manter o código limpo (Local Only)
const MacroBox = ({ label, value }: { label: string, value: number }) => (
    <div className="bg-white/60 p-2 rounded border border-emerald-100/50">
        <div className="font-bold text-lg">{formatNumber(value)}g</div>
        <div className="text-[10px] uppercase font-bold opacity-60">{label}</div>
    </div>
);

// No final do arquivo ResultCard.tsx
const CalculationDetails = ({ result, form }: ResultCardProps) => (
    <div className="mt-2 bg-slate-800 text-slate-200 p-4 rounded-lg text-xs font-mono space-y-3 shadow-inner">
        <p className="text-slate-400 uppercase font-bold tracking-wider mb-2 border-b border-slate-700 pb-1">Memória de Cálculo</p>

        <div>
            <span className="text-blue-300">1. Taxa Metabólica Basal (Mifflin-St Jeor):</span><br/>
            = <span className="text-white font-bold">{formatNumber(result.tmb)} kcal</span> (Custo para sobreviver)
        </div>

        <div>
            <span className="text-blue-300">2. Gasto Total (TDEE):</span><br/>
            {formatNumber(result.tmb)} x {form.activity} (Fator Atividade)<br/>
            = <span className="text-white font-bold">{formatNumber(result.tdee)} kcal</span>
        </div>

        <div>
            <span className="text-blue-300">3. Déficit ({form.deficitPercent}% do peso):</span><br/>
            Meta: {result.weeklyLossKg.toFixed(2)} kg/semana<br/>
            Energia: ({result.weeklyLossKg.toFixed(2)} x 7700) ÷ 7 dias<br/>
            = <span className="text-red-400 font-bold">-{formatNumber(result.dailyDeficit)} kcal/dia</span>
        </div>

        <div className="border-t border-slate-600 pt-2 mt-2">
            <span className="text-green-400">Final:</span><br/>
            {formatNumber(result.tdee)} - {formatNumber(result.dailyDeficit)} = <span className="text-white font-bold text-sm">{formatNumber(result.caloriesToEat)} kcal</span>
        </div>
    </div>
);