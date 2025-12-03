import { Info, Battery, Flame, TrendingDown } from 'lucide-react';

export const Explanation = () => {
    return (
        <section className="mt-8 grid gap-4 md:grid-cols-3 text-left">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-blue-700 font-bold text-sm">
                    <Battery size={18} />
                    <span>TMB (Basal)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                    É a energia que seu corpo gasta <strong>apenas para existir</strong> (respirar, bater o coração). Mesmo se você dormir o dia todo, você gasta isso. Nunca coma menos que esse valor.
                </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-emerald-700 font-bold text-sm">
                    <Flame size={18} />
                    <span>GET (Gasto Total)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                    É sua TMB somada à sua rotina (trabalho, treino, caminhada). Esse é o seu <strong>ponto de equilíbrio</strong>. Se comer isso, seu peso não muda.
                </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-red-200 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-red-700 font-bold text-sm">
                    <TrendingDown size={18} />
                    <span>Déficit Calórico</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                    É a diferença entre o que você gasta e o que come. O protocolo sugere retirar de 500 a 1000 calorias do seu total para obrigar o corpo a <strong>queimar gordura</strong> como combustível.
                </p>
            </div>

            <div className="md:col-span-3 mt-2 flex items-start gap-2 bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
                <Info size={16} className="shrink-0 mt-0.5" />
                <p>
                    <strong>Dica Importante:</strong> Os cálculos são estimativas. Use o resultado como ponto de partida e acompanhe seu peso semanalmente. Se estagnar, refaça o cálculo com o novo peso.
                </p>
            </div>
        </section>
    );
};