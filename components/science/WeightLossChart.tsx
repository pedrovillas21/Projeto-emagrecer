"use client";
import { useState, useMemo } from 'react';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { simulateWeightLoss } from '@/utils/math';
import { SimulationPoint, SimulationState } from '@/types';
import { SimulationControls } from './SimulationControls';
import { ChartViewer } from './ChartViewer';

export const WeightLossChart = () => {
    const [inputs, setInputs] = useState<SimulationState>({
        gender: 'male',
        age: 30,
        height: 170,
        // activity removido
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
            inputs.pace
        );
    }, [inputs]);

    return (
        <section className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 font-sans transition-colors duration-300">

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <Activity size={20} className="text-blue-600 dark:text-blue-400"/>
                    Simulação de Adaptação Metabólica
                </h2>
                <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 w-fit ${
                    isGain
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                }`}>
          {isGain ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                    {isGain ? 'Ganho de Massa' : 'Perda de Peso'}
        </span>
            </div>

            <SimulationControls inputs={inputs} setInputs={setInputs} />
            <ChartViewer data={data} isGain={isGain} />

        </section>
    );
};