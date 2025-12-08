'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

// Interfaces mantidas conforme seu código
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
    substitutions: string;
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

        const userLikes = preferences ? `INCLUIR OBRIGATORIAMENTE (pelo menos 3x na semana): ${preferences}` : "Sem preferências específicas.";
        const userHates = restrictions ? `PROIBIDO INCLUIR (Alergia ou Gosto): ${restrictions}` : "Sem restrições alimentares.";

        // --- AQUI ESTÁ A MUDANÇA PRINCIPAL NO PROMPT ---
        const prompt = `
      Atue como um nutricionista esportivo rigoroso com a Tabela TACO.
      
      METAS DIÁRIAS:
      - Calorias: ~${calories} kcal
      - Proteínas: ${macros.protein}g
      - Carboidratos: ${macros.carbs}g
      - Gorduras: ${macros.fats}g

      PREFERÊNCIAS:
      1. ${userLikes}
      2. ${userHates}
      
      REGRAS DE OURO:
      1. PRECISÃO NUTRICIONAL: Ajuste as quantidades para bater a meta calórica real.
      2. CUSTO-BENEFÍCIO: Priorize alimentos da cesta básica brasileira.
      3. VARIAR CARDÁPIO: Não repita o mesmo almoço todo dia.
      4. GORDURA: Contabilize o azeite/óleo de preparo.
      
      5. SUBSTITUIÇÕES (CRUCIAL): 
         - O campo "substitutions" é para TROCA TOTAL do alimento principal, caso o usuário não tenha o ingrediente.
         - PROIBIDO sugerir "adições" ou "complementos" (Ex: "Adicione mais 1 ovo para bater a meta" -> ISSO É PROIBIDO).
         - OBRIGATÓRIO ser uma TROCA (Ex: "Se não tiver Frango (150g), coma 2 Ovos Cozidos + 50g de Queijo Branco").
         - VOCÊ DEVE CALCULAR A QUANTIDADE EXATA PARA A TROCA TER AS MESMAS CALORIAS.
         

      ESTRUTURA: Café, Almoço, Lanche, Jantar.

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
               "substitutions": "Opção: 2 fatias de Pão Integral (50g) + 1 fatia de Queijo Minas (30g) para manter as 150kcal."
            },
            "lunch": { 
               "name": "Almoço",
               "foods": [...],
               "calories": 600,
               "macros": {...},
               "substitutions": "Troca econômica: Substitua o Frango por 2 Ovos Cozidos + 50g de Feijão extra."
            },
            "snack": { ... }, 
            "dinner": { ... }
          }
        }
      ]
      IMPORTANTE: Gere o cardápio de SEGUNDA a DOMINGO.
    `;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                maxOutputTokens: 8192,
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