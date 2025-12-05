'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

// Definição das interfaces (Mantidas iguais para garantir tipagem)
export interface FoodItem {
    item: string;
    quantity: string;
}

export interface Meal {
    name: string;
    foods: FoodItem[];
    calories: number;
    macros: {
        protein: number;
        carbs: number;
        fats: number;
    };
    substitutions: string; // Campo obrigatório agora
}

export interface DailyPlan {
    day: string;
    meals: {
        breakfast: Meal;
        lunch: Meal;
        snack: Meal;
        dinner: Meal;
    };
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function generateWeeklyMenu(
    calories: number,
    macros: { protein: number; carbs: number; fats: number },
    useWhey: boolean,
    preferences: string,
    restrictions: string
): Promise<DailyPlan[] | null> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const wheyInstruction = useWhey
            ? "O usuário USA Whey Protein. Inclua 1 dose (25g) no Lanche ou Café."
            : "O usuário NÃO usa suplementos. Bata a proteína com comida sólida.";

        // Lógica para preferências vazias
        const userLikes = preferences ? `INCLUIR OBRIGATORIAMENTE (pelo menos 3x na semana): ${preferences}` : "Sem preferências específicas.";
        const userHates = restrictions ? `PROIBIDO INCLUIR (Alergia ou Gosto): ${restrictions}` : "Sem restrições alimentares.";

        const prompt = `
      Atue como um nutricionista esportivo rigoroso com a Tabela TACO (Tabela Brasileira de Composição de Alimentos).
      
      METAS DIÁRIAS (Seja preciso na matemática):
      - Calorias: ~${calories} kcal
      - Proteínas: ${macros.protein}g
      - Carboidratos: ${macros.carbs}g
      - Gorduras: ${macros.fats}g

      PREFERÊNCIAS DO PACIENTE:
      1. ${userLikes}
      2. ${userHates}
      
      REGRAS DE OURO:
      1. PRECISÃO NUTRICIONAL: Não chute valores. Ex: 2 Pães Franceses (100g) têm ~58g de Carbo, não 20g. Ajuste as quantidades para bater a meta calórica real.
      2. CUSTO-BENEFÍCIO: Priorize alimentos da cesta básica brasileira (Arroz, Feijão, Ovo, Frango, Banana), salvo se o usuário pediu algo diferente nas preferências.
      3. VARIAR CARDÁPIO: Não repita o mesmo almoço todo dia.
      4. GORDURA: Contabilize o azeite/óleo de preparo.
      5. SUBSTITUIÇÕES: É OBRIGATÓRIO preencher o campo "substitutions" para TODAS as refeições com uma opção de troca equivalente.

      ESTRUTURA (4 Refeições): Café, Almoço, Lanche, Jantar.

      SUPLEMENTAÇÃO:
      ${wheyInstruction}

      FORMATO JSON OBRIGATÓRIO:
      [
        {
          "day": "Segunda-feira",
          "meals": {
            "breakfast": { 
               "name": "Café da Manhã", 
               "foods": [
                  { "item": "Pão Francês", "quantity": "1 unidade (50g)" }
               ], 
               "calories": 150, 
               "macros": { "protein": 4, "carbs": 29, "fats": 1 },
               "substitutions": "Opção de troca: 2 fatias de Pão Integral ou 3 torradas + 1 colher de requeijão light."
            },
            "lunch": { 
               "name": "Almoço",
               "foods": [...],
               "calories": 600,
               "macros": {...},
               "substitutions": "Troque o frango por 120g de Patinho Moído ou Tilápia."
            },
            "snack": { ... }, 
            "dinner": { ... }
          }
        }
      ]
      IMPORTANTE: Gere o cardápio completo de SEGUNDA a DOMINGO.
    `;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                maxOutputTokens: 8192, // Aumentei o limite pois cardápios de 7 dias são longos
                temperature: 0.7,
            },
        });

        const textResponse = result.response.text();
        return JSON.parse(textResponse) as DailyPlan[];

    } catch (error) {
        console.error("Erro na IA:", error);
        return null;
    }
}