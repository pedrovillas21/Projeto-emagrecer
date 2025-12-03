// src/types/index.ts

export interface Macros {
    protein: number;
    fat: number;
    carbs: number;
}

export interface CalculationResult {
    tmb: number;
    tdee: number;
    dailyDeficit: number;
    caloriesToEat: number;
    weeklyLossKg: number;
    macros: Macros;
}

export interface SimulationPoint {
    week: number;
    peso: number;
    metabolismo: number;
}

export interface CalculatorFormState {
    gender: 'male' | 'female' | string; // string adicionado para compatibilidade com select html
    weight: string;
    height: string;
    age: string;
    activity: string;
    deficitPercent: number;
}

export interface SimulationState {
    gender: string;
    age: number;
    height: number;
    activity: number;
    startWeight: number;
    goalWeight: number;
    pace: number;
}