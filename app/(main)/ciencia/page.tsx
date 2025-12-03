"use client";
import Link from 'next/link';
import { ArrowLeft, Scale, Activity } from 'lucide-react';
import { WeightLossChart } from '@/components/science/WeightLossChart';
import { References } from '@/components/science/References';

export default function SciencePage() {
    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-serif transition-colors duration-300">
            <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 py-10 px-4 transition-colors duration-300">
                <div className="max-w-4xl mx-auto">
                    <Link href="/" className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 no-underline font-sans transition-colors">
                        <ArrowLeft size={16} className="mr-1" /> Voltar para Calculadora
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full font-sans uppercase tracking-wider">Metodologia</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                        Fundamentação Teórica: Termodinâmica Aplicada
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed max-w-2xl">
                        Uma análise técnica sobre como o cálculo de gasto energético (TDEE) e a adaptação metabólica influenciam a perda de peso sustentável.
                    </p>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-16">

                <WeightLossChart />

                <article className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                    <h3 className="flex items-center gap-2">
                        <Scale className="text-slate-400" size={24}/>
                        O Princípio da Termodinâmica
                    </h3>
                    <p>
                        O emagrecimento humano obedece à <strong>Primeira Lei da Termodinâmica</strong>: a energia não pode ser criada nem destruída, apenas transformada. Para haver redução de massa (tecido adiposo), é mandatório haver um déficit energético.
                    </p>
                    <p>
                        O &quot;Protocolo Emagrecer&quot; utiliza a equação de <strong>Mifflin-St Jeor</strong> para estimar o gasto basal. Diferente de fórmulas antigas, esta equação considera a composição corporal moderna e possui menor margem de erro para indivíduos com sobrepeso.
                    </p>

                    <h3 className="flex items-center gap-2 mt-10">
                        <Activity className="text-slate-400" size={24}/>
                        Por que calcular déficit em porcentagem?
                    </h3>
                    <p>
                        Um erro comum é fixar um déficit calórico arbitrário (ex: &quot;cortar 1000 calorias&quot;). Para uma pessoa menor, isso pode representar um corte drástico e perigoso. A literatura científica sugere que uma perda de <strong>0.5% a 1.0% do peso corporal total por semana</strong> maximiza a retenção de massa magra enquanto oxida gordura.
                    </p>
                </article>

                <References />

            </main>
        </div>
    );
}