import { useState } from 'react';
import { calculateTMB } from '@/utils/math';
import { CalculationResult, CalculatorFormState } from '@/types';

export function useCalculator() {
    const [form, setForm] = useState<CalculatorFormState>({
        gender: 'male',
        weight: '',
        height: '',
        age: '',
        activity: '1.2',
        deficitPercent: 0.7
    });
    const [result, setResult] = useState<CalculationResult | null>(null);
    const [error, setError] = useState('');

    const updateForm = (key: keyof CalculatorFormState, value: string | number) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const calculate = () => {
        setError('');
        const w = parseFloat(form.weight);
        const h = parseFloat(form.height);
        const a = parseFloat(form.age);

        if (!w || !h || !a) {
            setError("Por favor, preencha todos os campos.");
            return;
        }
        if (w <= 0 || h <= 0 || a <= 0) {
            setError("Peso, altura e idade devem ser maiores que zero.");
            return;
        }

        const tmb = calculateTMB(w, h, a, form.gender);
        const tdee = tmb * parseFloat(form.activity);
        const weeklyLossKg = w * (form.deficitPercent / 100);
        const dailyDeficit = (weeklyLossKg * 7700) / 7;

        const caloriesToEat = tdee - dailyDeficit;

        const protein = w * 1.8;
        const fat = w * 0.8;
        const carbs = Math.max(0, (caloriesToEat - (protein * 4) - (fat * 9)) / 4);

        setResult({
            tmb,
            tdee,
            dailyDeficit,
            caloriesToEat,
            weeklyLossKg,
            targetCalories: Math.round(caloriesToEat),
            macros: {
                protein: Math.round(protein),
                fats: Math.round(fat),
                carbs: Math.round(carbs)
            }
        });
    };

    return { form, updateForm, result, error, calculate };
}