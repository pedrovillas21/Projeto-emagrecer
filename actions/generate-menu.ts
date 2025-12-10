'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

// --- INTERFACES FINAIS (O que seu site usa) ---
export interface FoodItem { item: string; quantity: string; }
export interface Meal { name: string; foods: FoodItem[]; calories: number; macros: { protein: number; carbs: number; fats: number; }; substitutions: string; }
export interface DailyPlan { day: string; meals: { breakfast: Meal; lunch: Meal; snack: Meal; dinner: Meal; }; }

interface AiSubstitutionOption { food?: string; }
interface AiSubstitutionItem { item?: string; options?: AiSubstitutionOption[]; }
interface RawMealData {
    name?: string;
    foods?: FoodItem[] | { description?: string };
    calories?: number;
    macros?: { protein?: number; carbs?: number; fats?: number };
    protein?: number;
    carbohydrates?: number;
    fat?: number;
    substitutions?: string | AiSubstitutionItem[];
}

interface RawDayResponse {
    day: string;
    meals: Record<string, RawMealData>;
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
            ? "REGRAS DE SUPLEMENTO: O usuário USA WHEY PROTEIN. Você É OBRIGADO a incluir 1 dose (30g) de Whey Protein no 'Lanche' (snack) todos os dias."
            : "REGRAS DE SUPLEMENTO: O usuário NÃO usa suplementos. Não inclua Whey.";

        const targets = {bk: { k: Math.round(calories * 0.20), p: Math.round(macros.protein * 0.20), c: Math.round(macros.carbs * 0.20), f: Math.round(macros.fats * 0.20) },
                        ln: { k: Math.round(calories * 0.35), p: Math.round(macros.protein * 0.35), c: Math.round(macros.carbs * 0.35), f: Math.round(macros.fats * 0.35) },
                        sn: { k: Math.round(calories * 0.15), p: Math.round(macros.protein * 0.15), c: Math.round(macros.carbs * 0.15), f: Math.round(macros.fats * 0.15) },
                        dn: { k: Math.round(calories * 0.30), p: Math.round(macros.protein * 0.30), c: Math.round(macros.carbs * 0.30), f: Math.round(macros.fats * 0.30) },};
        const prompt = `
              Atue como Nutricionista Matemático (Tabela TACO).
              Gere um cardápio semanal (Segunda a Domingo).
              
              PREFERÊNCIAS: ${preferences || "Nenhuma"}
              RESTRIÇÕES: ${restrictions || "Nenhuma"}
              ${wheyInstruction}
        
              ORDENS ESTRITAS DE MACROS (Siga estes números com margem de erro de 10%):
              1. Café da Manhã (breakfast): ~${targets.bk.k}kcal | P:${targets.bk.p}g | C:${targets.bk.c}g | G:${targets.bk.f}g
              2. Almoço (lunch):            ~${targets.ln.k}kcal | P:${targets.ln.p}g | C:${targets.ln.c}g | G:${targets.ln.f}g
              3. Lanche (snack):            ~${targets.sn.k}kcal | P:${targets.sn.p}g | C:${targets.sn.c}g | G:${targets.sn.f}g
              4. Jantar (dinner):           ~${targets.dn.k}kcal | P:${targets.dn.p}g | C:${targets.dn.c}g | G:${targets.dn.f}g
        
              REGRAS DE CONTEÚDO:
              - Use quantidades REAIS (ex: "150g de arroz", não "2 colheres").
              - Custo-benefício (Cesta básica BR).
              - SUBSTITUIÇÕES: Deve ser uma STRING ÚNICA e SIMPLES (ex: "Troque Frango por 3 Ovos").
              - NÃO INVENTE MACROS: 100g de Frango Grelhado tem ~30g de proteína. Não diga que tem 10g.
        
              FORMATO JSON OBRIGATÓRIO (Use as chaves exatas em inglês):
              [
                {
                  "day": "Segunda-feira",
                  "meals": {
                    "breakfast": { 
                       "name": "Café da Manhã", 
                       "foods": [{ "item": "Pão", "quantity": "1 un" }], 
                       "calories": ${targets.bk.k}, 
                       "macros": { "protein": ${targets.bk.p}, "carbs": ${targets.bk.c}, "fats": ${targets.bk.f} },
                       "substitutions": "Troque pão por tapioca."
                    },
                    "lunch": { ... },
                    "snack": { ... },
                    "dinner": { ... }
                  }
                }
              ]
            `;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json", maxOutputTokens: 8192, temperature: 0.5 },
        });

        const textResponse = result.response.text();
        if (!textResponse) return null;


        const rawData = JSON.parse(textResponse) as RawDayResponse[];

        const sanitizedData: DailyPlan[] = rawData.map((day) => {
            const m = day.meals || {};

            const findMeal = (keys: string[], defaultName: string): Meal => {
                const key = keys.find(k => m[k]);
                const data = key ? m[key] : {};

                let subText = "Sem trocas.";

                if (typeof data.substitutions === 'string') {
                    subText = data.substitutions;
                }
                else if (Array.isArray(data.substitutions)) {
                    subText = data.substitutions.map((s) =>
                        `Troque ${s.item || 'item'} por ${s.options?.[0]?.food || 'equivalente'}`
                    ).join(". ");
                }

                let foodList: FoodItem[] = [];
                if (Array.isArray(data.foods)) {
                    foodList = data.foods;
                } else if (data.foods && 'description' in data.foods) {
                    // O TS reclama se acessar direto, então validamos antes
                    const desc = data.foods.description || "Refeição padrão";
                    foodList = [{ item: desc, quantity: "1 porção" }];
                }

                const p = data.macros?.protein || data.protein || 0;
                const c = data.macros?.carbs || data.carbohydrates || 0;
                const f = data.macros?.fats || data.fat || 0;

                return {
                    name: data.name || defaultName,
                    foods: foodList,
                    calories: data.calories || 0,
                    macros: { protein: p, carbs: c, fats: f },
                    substitutions: subText
                };
            };

            return {
                day: day.day,
                meals: {
                    breakfast: findMeal(['breakfast', 'Café', 'Café da Manhã'], 'Café da Manhã'),
                    lunch:     findMeal(['lunch', 'Almoço'], 'Almoço'),
                    snack:     findMeal(['snack', 'Lanche', 'Lanche da Tarde'], 'Lanche'),
                    dinner:    findMeal(['dinner', 'Jantar'], 'Jantar')
                }
            };
        });

        return sanitizedData;

    } catch (error) {
        console.error("Erro na IA:", error);
        return null;
    }
}