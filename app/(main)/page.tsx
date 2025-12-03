"use client";
import Link from 'next/link';
import { Calculator, ArrowRight, AlertCircle } from 'lucide-react';
import { useCalculator } from '@/hooks/useCalculator';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Explanation } from '@/components/calculator/Explanation';

export default function Home() {
    // Importando a lógica do nosso Hook personalizado
    const { form, updateForm, result, error, calculate } = useCalculator();

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">

                {/* Header da Marca */}
                <div className="bg-blue-600 p-6 text-white text-center">
                    <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
                        <Calculator size={24} /> Protocolo Emagrecer
                    </h1>
                    <p className="text-blue-100 text-sm mt-2">Calculadora de Termodinâmica</p>
                </div>

                <div className="p-6 md:p-8 space-y-5">
                    {/* Mensagem de Erro */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100 animate-shake">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    {/* Linha 1: Gênero e Idade */}
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Gênero"
                            value={form.gender}
                            onChange={(e) => updateForm('gender', e.target.value)}
                            options={[
                                { value: 'male', label: 'Homem' },
                                { value: 'female', label: 'Mulher' }
                            ]}
                        />
                        <Input
                            label="Idade"
                            type="number"
                            min="1"
                            value={form.age}
                            onChange={(e) => updateForm('age', e.target.value)}
                            placeholder="Anos"
                            suffix="anos"
                        />
                    </div>

                    {/* Linha 2: Peso e Altura */}
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Peso (kg)"
                            type="number"
                            min="1"
                            value={form.weight}
                            onChange={(e) => updateForm('weight', e.target.value)}
                            placeholder="Ex: 95"
                            suffix="kg"
                        />
                        <Input
                            label="Altura (cm)"
                            type="number"
                            min="1"
                            value={form.height}
                            onChange={(e) => updateForm('height', e.target.value)}
                            placeholder="Ex: 178"
                            suffix="cm"
                        />
                    </div>

                    {/* Nível de Atividade */}
                    <Select
                        label="Nível de Atividade"
                        value={form.activity}
                        onChange={(e) => updateForm('activity', e.target.value)}
                        options={[
                            { value: '1.2', label: 'Sedentário (Escritório, sem treino)' },
                            { value: '1.375', label: 'Leve (Treino 1-3x semana)' },
                            { value: '1.55', label: 'Moderado (Treino 3-5x semana)' },
                            { value: '1.725', label: 'Alto (Treino 6-7x semana)' },
                        ]}
                    />

                    {/* Slider de Déficit */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Ritmo de Perda</label>
                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {form.deficitPercent}% / semana
                </span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="1.0"
                            step="0.1"
                            value={form.deficitPercent}
                            onChange={(e) => updateForm('deficitPercent', parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                            <span>Conservador (0.5%)</span>
                            <span>Agressivo (1.0%)</span>
                        </div>
                    </div>

                    {/* Botão de Ação */}
                    <button
                        onClick={calculate}
                        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-4 rounded-lg transition-all shadow-lg shadow-blue-200"
                    >
                        Calcular Protocolo
                    </button>

                    {/* Componente de Resultado Isolado */}
                    {result && <ResultCard result={result} form={form} />}
                    <Explanation />
                    {/* Link para Ciência */}
                    <div className="pt-4 text-center border-t border-slate-100 mt-6">
                        <Link href="/ciencia" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                            Ver projeção científica <ArrowRight size={16} className="ml-1"/>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}