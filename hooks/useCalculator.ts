import { useState } from 'react';
import { calculateTMB } from '@/utils/math';
import { CalculationResult, CalculatorFormState } from '@/types';
// Importamos o hook do contexto atualizado
import { useCalculatorContext } from '@/contexts/CalculatorContext';

export function useCalculator() {
    // Pegamos tudo do contexto agora
    const {
        data: form,
        updateField,
        result,
        setResult,
        dietPlan,    // Podemos precisar para verificar se já existe
        setDietPlan  // Para limpar a dieta se recalcular
    } = useCalculatorContext();

    const [error, setError] = useState('');

    const updateForm = (key: keyof CalculatorFormState, value: string | number) => {
        updateField(key, value);
    };

    const calculate = () => {
        setError('');
        const w = parseFloat(form.weight);
        const h = parseFloat(form.height);
        const a = parseFloat(form.age);
        const act = parseFloat(form.activity);

        if (!w || !h || !a) {
            setError("Por favor, preencha todos os campos.");
            return;
        }

        // ... sua lógica de validação ...

        // Cálculos Matemáticos
        const tmb = calculateTMB(w, h, a, form.gender);
        const tdee = tmb * act;
        const weeklyLossKg = w * (form.deficitPercent / 100);
        const dailyDeficit = (weeklyLossKg * 7700) / 7;
        const caloriesToEat = tdee - dailyDeficit;

        // Macros
        const protein = w * 1.8;
        const fat = w * 0.8;
        const carbs = Math.max(0, (caloriesToEat - (protein * 4) - (fat * 9)) / 4);

        // 1. Salvamos o Resultado no Contexto Global
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

        // 2. IMPORTANTE: Se recalculou, a dieta antiga (se houver) não vale mais.
        // Limpamos para obrigar o usuário a gerar uma nova compatível com os novos macros.
        if (dietPlan) {
            setDietPlan(null);
        }
    };

    // Retornamos tudo que a Home precisa
    return { form, updateForm, result, error, calculate };
}