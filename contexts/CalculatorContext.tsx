"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
// Importamos CalculationResult também
import { CalculatorFormState, CalculationResult } from "@/types";

interface CalculatorContextType {
    // 1. Dados do Formulário
    data: CalculatorFormState;
    updateField: (field: keyof CalculatorFormState, value: string | number) => void;

    // 2. Resultado do Cálculo (Números)
    result: CalculationResult | null;
    setResult: (result: CalculationResult | null) => void;

    // 3. Cardápio Gerado pela IA (Texto/Markdown)
    dietPlan: string | null;
    setDietPlan: (plan: string | null) => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export function CalculatorProvider({ children }: { children: ReactNode }) {
    // Estado do Formulário
    const [data, setData] = useState<CalculatorFormState>({
        gender: "male",
        weight: "",
        height: "",
        age: "",
        activity: "1.2",
        deficitPercent: 0.7,
    });

    // Novos Estados Globais
    const [result, setResult] = useState<CalculationResult | null>(null);
    const [dietPlan, setDietPlan] = useState<string | null>(null);

    const updateField = (field: keyof CalculatorFormState, value: string | number) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <CalculatorContext.Provider value={{
            data, updateField,
            result, setResult,
            dietPlan, setDietPlan
        }}>
            {children}
        </CalculatorContext.Provider>
    );
}

// Renomeei para 'useCalculatorContext' para ficar claro que é o acesso cru ao contexto
export function useCalculatorContext() {
    const context = useContext(CalculatorContext);
    if (!context) {
        throw new Error("useCalculatorContext deve ser usado dentro de um CalculatorProvider");
    }
    return context;
}