'use client';

import { useState } from 'react';
import { generateWeeklyMenu, DailyPlan, Meal } from '@/actions/generate-menu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, ChefHat, Download, Droplet, Milk, AlertTriangle } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type PdfWithPlugin = jsPDF & {
    lastAutoTable?: {
        finalY: number;
    };
};

interface DietGeneratorProps {
    calories: number;
    macros: { protein: number; carbs: number; fats: number };
}

export function DietGenerator({ calories, macros }: DietGeneratorProps) {
    const [loading, setLoading] = useState(false);
    const [menu, setMenu] = useState<DailyPlan[] | null>(null);
    // Estado para controlar o uso de Whey
    const [useWhey, setUseWhey] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        // Passamos o estado useWhey para a Server Action
        const data = await generateWeeklyMenu(calories, macros, useWhey);
        setMenu(data);
        setLoading(false);
    };

    const downloadPDF = () => {
        if (!menu) return;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Protocolo Emagrecer - Cardápio Econômico", 14, 22);
        doc.setFontSize(12);
        doc.text(`Meta: ${calories} kcal | P: ${macros.protein}g | C: ${macros.carbs}g | G: ${macros.fats}g`, 14, 30);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(useWhey ? "Inclui Whey Protein" : "Sem suplementação (Comida Sólida)", 14, 36);
        doc.setTextColor(0);

        let yPos = 45;

        menu.forEach((day) => {
            doc.setFontSize(14);
            doc.text(day.day, 14, yPos);
            yPos += 5;

            const tableBody = Object.values(day.meals).map((meal: Meal) => {
                const foodsString = meal.foods
                    .map((f) => `• ${f.item}: ${f.quantity}`)
                    .join('\n');

                return [
                    meal.name,
                    foodsString,
                    `${meal.calories} kcal\nP: ${meal.macros.protein}g\nC: ${meal.macros.carbs}g\nG: ${meal.macros.fats}g`
                ];
            });

            autoTable(doc, {
                startY: yPos,
                head: [['Refeição', 'Alimentos & Quantidades', 'Macros']],
                body: tableBody,
                theme: 'grid',
                headStyles: { fillColor: [37, 99, 235] },
                styles: { fontSize: 10, cellPadding: 3 },
                columnStyles: {
                    0: { cellWidth: 30, fontStyle: 'bold' },
                    1: { cellWidth: 'auto' },
                    2: { cellWidth: 35 }
                },
            });

            const finalY = (doc as PdfWithPlugin).lastAutoTable?.finalY || yPos;
            yPos = finalY + 15;

            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
        });

        doc.save("cardapio-economico.pdf");
    };

    return (
        <div className="mt-10 space-y-6 border-t border-slate-200 dark:border-slate-800 pt-8">
            <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800 dark:text-amber-200">
                        <p className="font-bold">Nota Importante</p>
                        <p className="mt-1">
                            Este cardápio é uma <strong>sugestão gerada por Inteligência Artificial</strong> baseada apenas nos seus cálculos matemáticos.
                            Ele serve como referência prática, mas não substitui a avaliação clínica de um Nutricionista, que considera exames, alergias e rotina individual.
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center gap-6">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
                        <ChefHat className="text-blue-600" /> Gerador de Cardápio
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Dieta flexível focada em alimentos do dia a dia.
                    </p>
                </div>

                {!menu && (
                    <div className="w-full max-w-sm bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        <label className="flex items-center justify-between cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg transition-colors ${useWhey ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                                    <Milk size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-900 dark:text-slate-100">Incluir Whey Protein?</span>
                                    <span className="text-xs text-slate-500">Ajuda a bater a meta de proteínas</span>
                                </div>
                            </div>

                            {/* Custom Switch / Checkbox */}
                            <input
                                type="checkbox"
                                checked={useWhey}
                                onChange={(e) => setUseWhey(e.target.checked)}
                                className="w-5 h-5 accent-blue-600 cursor-pointer"
                            />
                        </label>
                    </div>
                )}

                {!menu ? (
                    <Button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px] h-12 text-lg shadow-lg shadow-blue-200 dark:shadow-none transition-all"
                    >
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                        {loading ? "Criando Dieta..." : "Gerar Cardápio Econômico"}
                    </Button>
                ) : (
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={() => setMenu(null)}>
                            Refazer Opções
                        </Button>
                        <Button onClick={downloadPDF} className="bg-green-600 hover:bg-green-700 text-white">
                            <Download className="mr-2 h-4 w-4" /> Baixar PDF
                        </Button>
                    </div>
                )}
            </div>

            {menu && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {menu.map((dayPlan, idx) => (
                        <div key={idx} className="space-y-3">
                            <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400 pl-1 border-l-4 border-blue-600 flex justify-between items-center">
                                {dayPlan.day}
                                <span className="text-xs font-normal text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                  4 Refeições
                </span>
                            </h4>

                            {/* Grid ajustado para 4 colunas (uma para cada refeição) */}
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                {Object.values(dayPlan.meals).map((meal: Meal, mIdx) => (
                                    <Card key={mIdx} className="p-4 flex flex-col gap-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">

                                        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-2">
                                            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{meal.name}</span>
                                            <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                                            {meal.calories} kcal
                                            </span>
                                        </div>

                                        <ul className="text-sm space-y-2 flex-grow">
                                            {meal.foods.map((food, fIdx) => {
                                                // --- CORREÇÃO DE SEGURANÇA ---
                                                // Garantimos que 'food' e 'food.item' existam. Se não, usa string vazia.
                                                const safeItemName = food.item || "Item não identificado";
                                                const safeQuantity = food.quantity || "?";

                                                const nameLower = safeItemName.toLowerCase();
                                                const isOil = nameLower.includes('azeite') || nameLower.includes('óleo');
                                                const isWhey = nameLower.includes('whey');

                                                return (
                                                    <li key={fIdx} className={`flex justify-between items-start 
                                                    ${isOil ? 'text-amber-600 dark:text-amber-500 text-xs' : ''}
                                                    ${isWhey ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-600 dark:text-slate-400'}
                                                    `}>
                                                    <span className="flex-1 mr-2 flex items-center gap-1 leading-tight">
                                                      {isOil && <Droplet className="w-3 h-3 fill-current flex-shrink-0" />}
                                                        {isWhey && <Milk className="w-3 h-3 flex-shrink-0" />}
                                                        {/* Usamos a variável segura aqui */}
                                                        {safeItemName}
                                                    </span>
                                                        <span className="whitespace-nowrap text-slate-800 dark:text-slate-300 text-xs font-medium">
                                                            {safeQuantity}
                                                        </span>
                                                    </li>
                                                )
                                            })}
                                        </ul>

                                        <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 text-center text-[10px] text-slate-500">
                                            <div><strong className="block text-slate-700 dark:text-slate-300 text-xs">{meal.macros.protein}g</strong>Prot</div>
                                            <div className="border-x border-slate-100 dark:border-slate-800"><strong className="block text-slate-700 dark:text-slate-300 text-xs">{meal.macros.carbs}g</strong>Carb</div>
                                            <div><strong className="block text-slate-700 dark:text-slate-300 text-xs">{meal.macros.fats}g</strong>Gord</div>
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