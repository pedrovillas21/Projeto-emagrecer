"use client";
import { useState, useMemo } from 'react';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { simulateWeightLoss } from '@/utils/math';
// Importando as partes menores
import { SimulationControls } from './SimulationControls';
import { ChartViewer } from './ChartViewer';
import { SimulationPoint, SimulationState } from '@/types';

export const WeightLossChart = () => {
    const [inputs, setInputs] = useState<SimulationState>({
        gender: 'male',
        age: 30,
        height: 170,
        activity: 1.375,
        startWeight: 90,
        goalWeight: 75,
        pace: 0.01
    });

    const isGain = inputs.goalWeight > inputs.startWeight;

    const data: SimulationPoint[] = useMemo(() => {
        return simulateWeightLoss(
            inputs.startWeight,
            inputs.goalWeight,
            inputs.height,
            inputs.age,
            inputs.gender,
            inputs.activity,
            inputs.pace
        );
    }, [inputs]);

    return (
        <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                    <Activity size={20} className="text-blue-600"/>
                    Simulação de Adaptação Metabólica
                </h2>
                <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 w-fit ${
                    isGain ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
          {isGain ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                    {isGain ? 'Ganho de Massa' : 'Perda de Peso'}
        </span>
            </div>

            {/* Formulário Isolado */}
            <SimulationControls inputs={inputs} setInputs={setInputs} />

            {/* Gráfico Isolado */}
            <ChartViewer data={data} isGain={isGain} />

        </section>
    );
};