'use client';

import { useState, useEffect } from 'react';
import { generateWeeklyMenu, DailyPlan, Meal } from '@/actions/generate-menu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ChefHat, Download, Droplet, Milk, AlertTriangle, ThumbsUp, ThumbsDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// 1. Importar o hook do contexto
import { useCalculatorContext } from '@/contexts/CalculatorContext';

// Tipos auxiliares para o PDF e tratamento de dados
type PdfWithPlugin = jsPDF & { lastAutoTable?: { finalY: number } };
type RawFoodItem = string | { item?: string; name?: string; nome?: string; quantity?: string; qtd?: string; } | null | undefined;

interface DietGeneratorProps {
    calories: number;
    macros: { protein: number; carbs: number; fats: number };
}

export function DietGenerator({ calories, macros }: DietGeneratorProps) {
    // 2. Pegar os métodos do contexto para persistência
    const { dietPlan, setDietPlan } = useCalculatorContext();

    const [loading, setLoading] = useState(false);

    // 3. Inicializar o menu lendo do contexto (se existir) para evitar regerar
    const [menu, setMenu] = useState<DailyPlan[] | null>(() => {
        if (dietPlan) {
            try {
                return JSON.parse(dietPlan);
            } catch (e) {
                console.error("Erro ao ler dieta salva:", e);
                return null;
            }
        }
        return null;
    });

    const [useWhey, setUseWhey] = useState(false);
    const [preferences, setPreferences] = useState("");
    const [restrictions, setRestrictions] = useState("");

    const handleGenerate = async () => {
        setLoading(true);
        try {
            // Chama a Server Action que conecta com a IA
            const data = await generateWeeklyMenu(calories, macros, useWhey, preferences, restrictions);

            // 4. Atualizar o estado local e SALVAR NO CONTEXTO GLOBAL
            setMenu(data);
            setDietPlan(JSON.stringify(data));

        } catch (error) {
            console.error("Erro ao gerar:", error);
        } finally {
            setLoading(false);
        }
    };

    // Função para limpar a dieta atual e permitir gerar outra com novas preferências
    const handleReset = () => {
        setMenu(null);
        setDietPlan(null); // Limpa do contexto global também
    };

    // Helper para normalizar os dados dos alimentos (que podem vir variados da IA)
    const getSafeFoodData = (food: unknown) => {
        const rawFood = food as RawFoodItem;
        if (!rawFood) return { name: "Item não identificado", qtd: "?", isOil: false, isWhey: false };
        let name = "Item não identificado";
        let qtd = "?";
        if (typeof rawFood === 'string') {
            name = rawFood;
        } else if (typeof rawFood === 'object') {
            name = rawFood.item || rawFood.name || rawFood.nome || "Item sem nome";
            qtd = rawFood.quantity || rawFood.quantity || rawFood.qtd || "?";
        }
        const lowerName = String(name).toLowerCase();
        return { name, qtd, isOil: lowerName.includes('azeite') || lowerName.includes('óleo'), isWhey: lowerName.includes('whey') };
    };

    const downloadPDF = () => {
        if (!menu) return;
        const doc = new jsPDF();

        // Configuração do Cabeçalho do PDF
        doc.setFontSize(18);
        doc.text("Protocolo Emagrecer - Seu Cardápio", 14, 22);
        doc.setFontSize(10);
        doc.text(`Meta: ${calories} kcal | P: ${macros.protein}g | C: ${macros.carbs}g | G: ${macros.fats}g`, 14, 30);

        // Adiciona as preferências escolhidas no cabeçalho para registro
        if (preferences) doc.text(`Gosta: ${preferences}`, 14, 36);
        if (restrictions) doc.text(`Evita: ${restrictions}`, 14, 42);

        let yPos = 50;

        menu.forEach((day) => {
            // Título do Dia (Segunda, Terça...)
            doc.setFontSize(14);
            doc.setTextColor(37, 99, 235); // Azul
            doc.text(day.day, 14, yPos);
            doc.setTextColor(0); // Preto
            yPos += 5;

            // Montagem das Linhas da Tabela
            const tableBody = Object.values(day.meals).map((meal: Meal) => {
                const foodsList = Array.isArray(meal.foods) ? meal.foods : [];

                // 1. Cria a lista de alimentos padrão
                let foodsString = foodsList.map((f: unknown) => {
                    const { name, qtd } = getSafeFoodData(f);
                    return `• ${name} ${qtd}`;
                }).join('\n');

                // 2. LÓGICA DE SUBSTITUIÇÃO: Adiciona apenas no PDF se existir
                if (meal.substitutions) {
                    // Adiciona quebra de linha dupla e um separador visual
                    foodsString += `\n\n------- Opções de Troca -------\n${meal.substitutions}`;
                }

                return [
                    meal.name || "Refeição",
                    foodsString,
                    `${meal.calories || 0} kcal\nP: ${meal.macros?.protein || 0}g`
                ];
            });

            // Geração da Tabela com autoTable
            autoTable(doc, {
                startY: yPos,
                head: [['Refeição', 'Alimentos & Substituições', 'Macros']],
                body: tableBody,
                theme: 'grid',
                headStyles: { fillColor: [37, 99, 235] },
                styles: { fontSize: 9, cellPadding: 3, valign: 'middle' },
                columnStyles: {
                    0: { cellWidth: 30 }, // Coluna Refeição
                    1: { cellWidth: 'auto' }, // Coluna Alimentos (expande)
                    2: { cellWidth: 25 } // Coluna Macros
                }
            });

            // Atualiza a posição Y para o próximo dia
            const finalY = (doc as PdfWithPlugin).lastAutoTable?.finalY || yPos;
            yPos = finalY + 10;

            // Cria nova página se estiver perto do fim
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
        });

        doc.save("meu-cardapio-protocolo.pdf");
    };

    return (
        <div className="mt-10 space-y-6 border-t border-slate-200 dark:border-slate-800 pt-8">

            <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800 dark:text-amber-200">
                        <p className="font-bold">Nota sobre Precisão</p>
                        <p className="mt-1">
                            A IA tenta aproximar os valores nutricionais, mas pode haver divergências com rótulos reais. Sempre verifique a tabela nutricional dos produtos que você comprar.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-6">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
                        <ChefHat className="text-blue-600" /> Personalizar Cardápio
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Defina o que entra e o que sai do seu prato.
                    </p>
                </div>

                {/* Exibe formulário apenas se NÃO tiver menu gerado */}
                {!menu && (
                    <div className="w-full max-w-xl space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <ThumbsUp size={16} className="text-green-500" /> O que é indispensável?
                                </label>
                                <Textarea
                                    placeholder="Ex: Chocolate amargo, café, arroz branco..."
                                    value={preferences}
                                    onChange={(e) => setPreferences(e.target.value)}
                                    className="bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <ThumbsDown size={16} className="text-red-500" /> O que você não come?
                                </label>
                                <Textarea
                                    placeholder="Ex: Peixe, pimentão, leite puro..."
                                    value={restrictions}
                                    onChange={(e) => setRestrictions(e.target.value)}
                                    className="bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-900"
                                />
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-center">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div className={`p-2 rounded-lg transition-colors ${useWhey ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                                    <Milk size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-900 dark:text-slate-100">Incluir Whey Protein?</span>
                                    <span className="text-xs text-slate-500">Praticidade para bater proteína</span>
                                </div>
                                <input type="checkbox" checked={useWhey} onChange={(e) => setUseWhey(e.target.checked)} className="w-5 h-5 accent-blue-600 ml-2" />
                            </label>
                        </div>
                    </div>
                )}

                {!menu ? (
                    <Button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px] h-12 text-lg shadow-lg shadow-blue-200 dark:shadow-none transition-all"
                    >
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                        {loading ? "Processando Dieta..." : "Gerar Cardápio Personalizado"}
                    </Button>
                ) : (
                    <div className="flex gap-4">
                        {/* Ao clicar aqui, limpamos o contexto e permitimos nova geração */}
                        <Button variant="outline" onClick={handleReset}>
                            Mudar Preferências
                        </Button>
                        <Button onClick={downloadPDF} className="bg-green-600 hover:bg-green-700 text-white">
                            <Download className="mr-2 h-4 w-4" /> Baixar PDF
                        </Button>
                    </div>
                )}
            </div>

            {/* Renderização na tela: NÃO mostra as substituições aqui */}
            {menu && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {menu.map((dayPlan, idx) => (
                        <div key={idx} className="space-y-3">
                            <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400 pl-1 border-l-4 border-blue-600 flex justify-between items-center">
                                {dayPlan.day}
                            </h4>

                            {/* CORREÇÃO 1: Breakpoints ajustados para evitar vazamento em telas médias/grandes */}
                            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">

                                {Object.values(dayPlan.meals || {}).map((meal: Meal, mIdx) => (
                                    <Card key={mIdx} className="p-4 flex flex-col gap-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-2">
                                            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{meal.name || "Refeição"}</span>
                                            <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">{meal.calories || 0} kcal</span>
                                        </div>

                                        <ul className="text-sm space-y-2 flex-grow">
                                            {(Array.isArray(meal.foods) ? meal.foods : []).map((food: unknown, fIdx: number) => {
                                                const { name, qtd, isOil, isWhey } = getSafeFoodData(food);
                                                return (
                                                    <li key={fIdx} className={`flex justify-between items-start ${isOil ? 'text-amber-600 dark:text-amber-500 text-xs' : ''} ${isWhey ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                                            <span className="flex-1 mr-2 flex items-center gap-1 leading-tight">
                                              {isOil && <Droplet className="w-3 h-3 fill-current flex-shrink-0" />}
                                                {isWhey && <Milk className="w-3 h-3 flex-shrink-0" />}
                                                {name}
                                            </span>

                                                        {/* CORREÇÃO 2: Removido whitespace-nowrap e alinhado à direita */}
                                                        <span className="text-right text-slate-800 dark:text-slate-300 text-xs font-medium min-w-[30px]">{qtd}</span>
                                                    </li>
                                                )
                                            })}
                                        </ul>

                                        <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 text-center text-[10px] text-slate-500">
                                            <div><strong className="block text-slate-700 dark:text-slate-300 text-xs">{meal.macros?.protein || 0}g</strong>Prot</div>
                                            <div className="border-x border-slate-100 dark:border-slate-800"><strong className="block text-slate-700 dark:text-slate-300 text-xs">{meal.macros?.carbs || 0}g</strong>Carb</div>
                                            <div><strong className="block text-slate-700 dark:text-slate-300 text-xs">{meal.macros?.fats || 0}g</strong>Gord</div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}