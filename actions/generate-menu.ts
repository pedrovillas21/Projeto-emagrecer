'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

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
    useWhey: boolean
): Promise<DailyPlan[] | null> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const wheyInstruction = useWhey
            ? "O usuário USA Whey Protein. Inclua 1 dose de Whey (30g) obrigatoriamente no 'Lanche da Tarde' ou 'Café da Manhã' como fonte prática de proteína."
            : "O usuário NÃO usa suplementos. Não sugira Whey. Bata a meta de proteínas com comida sólida (ovos, frango, atum em lata, carnes magras).";

        const prompt = `
      Atue como um nutricionista focado em dietas ECONÔMICAS, mas VARIADAS para o brasileiro.
      
      METAS DIÁRIAS:
      - Calorias: ~${calories} kcal
      - Proteínas: ${macros.protein}g
      - Carboidratos: ${macros.carbs}g
      - Gorduras: ${macros.fats}g

      REGRAS DE CUSTO-BENEFÍCIO:
      1. USAR: Frango, Ovos, Carne Moída (Patinho/Acém), Porco (Lombo), Atum/Sardinha em lata.
      2. CARBOIDRATOS (VARIEDADE É OBRIGATÓRIA): 
         - Alterne entre: Arroz e Feijão (Clássico), Macarrão ao Sugo/Bolonhesa, Purê de Batata, Batata Doce Assada, Mandioca/Aipim cozido, Cuscuz.
         - REGRA IMPORTANTE: NÃO repita "Arroz e Feijão" em todos os almoços. O usuário enjoa fácil. Tente limitar arroz e feijão a 3-4x na semana no máximo.
      3. GORDURA: Sempre contemple o azeite/óleo usado no preparo (ex: "Fio de azeite para grelhar").

      ESTRUTURA (4 Refeições):
      1. Café da Manhã 
      2. Almoço 
      3. Lanche da Tarde 
      4. Jantar 

      SUPLEMENTAÇÃO:
      ${wheyInstruction}

      FORMATO JSON OBRIGATÓRIO (Siga EXATAMENTE esta estrutura de objetos dentro de foods):
      [
        {
          "day": "Segunda-feira",
          "meals": {
            "breakfast": { 
               "name": "Café da Manhã", 
               "foods": [
                  { "item": "Pão Francês", "quantity": "1 unidade" },
                  { "item": "Ovos mexidos", "quantity": "2 unidades" },
                  { "item": "Café preto", "quantity": "1 xícara" }
               ], 
               "calories": 300, 
               "macros": { "protein": 15, "carbs": 25, "fats": 10 } 
            },
            "lunch": { 
               "name": "Almoço", 
               "foods": [
                  { "item": "Arroz Branco", "quantity": "150g (cozido)" },
                  { "item": "Feijão Carioca", "quantity": "1 concha" },
                  { "item": "Peito de Frango", "quantity": "120g" },
                  { "item": "Azeite (preparo)", "quantity": "5ml" }
               ],
               "calories": 600,
               "macros": { "protein": 40, "carbs": 50, "fats": 15 }
            }, 
            "snack": { 
               "name": "Lanche da Tarde", 
               "foods": [{ "item": "Banana", "quantity": "1 média" }],
               "calories": 100, "macros": { "protein": 1, "carbs": 20, "fats": 0 }
            }, 
            "dinner": { 
               "name": "Jantar",
               "foods": [{ "item": "Omelete", "quantity": "2 ovos" }],
               "calories": 200, "macros": { "protein": 12, "carbs": 2, "fats": 15 }
            }
          }
        }
      ]
      IMPORTANTE: GERE O CARDÁPIO COMPLETO DE SEGUNDA A DOMINGO. NÃO PARE NA QUARTA-FEIRA.
    `;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                // AUMENTAMOS O LIMITE AQUI:
                maxOutputTokens: 8192, // 8k tokens é suficiente para um livro, garantindo os 7 dias
                temperature: 0.7, // Um pouco de criatividade para variar os pratos
            },
        });

        return JSON.parse(result.response.text()) as DailyPlan[];
    } catch (error) {
        console.error("Erro na IA:", error);
        return null;
    }
}