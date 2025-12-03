import { BookOpen } from 'lucide-react';

type ReferenceColor = 'blue' | 'emerald' | 'purple';

const colorStyles: Record<ReferenceColor, { badge: string; border: string; link: string }> = {
    blue: {
        badge: "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300",
        border: "hover:border-blue-400 dark:hover:border-blue-500",
        link: "text-blue-600 dark:text-blue-400"
    },
    emerald: {
        badge: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-300",
        border: "hover:border-emerald-400 dark:hover:border-emerald-500",
        link: "text-emerald-600 dark:text-emerald-400"
    },
    purple: {
        badge: "text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300",
        border: "hover:border-purple-400 dark:hover:border-purple-500",
        link: "text-purple-600 dark:text-purple-400"
    }
};

interface ReferenceCardProps {
    category: string;
    color: ReferenceColor;
    title: string;
    subtitle: string;
    desc: string;
    link: string;
    fullWidth?: boolean;
}

export const References = () => {
    return (
        <section className="pt-10 border-t border-slate-300 dark:border-slate-700 font-sans transition-colors">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <BookOpen size={20} className="text-slate-700 dark:text-slate-400"/> Referências e Validação Científica
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
                <ReferenceCard
                    category="CÁLCULO BASAL"
                    color="blue"
                    title="Mifflin-St Jeor Equation (1990)"
                    subtitle="A new predictive equation for resting energy expenditure in healthy individuals."
                    desc="Estudo que validou a fórmula utilizada nesta ferramenta como padrão ouro para estimativa calórica em nutrição clínica moderna."
                    link="https://pubmed.ncbi.nlm.nih.gov/2305711/"
                />
                <ReferenceCard
                    category="PROTEÍNA"
                    color="emerald"
                    title="Helms et al. (2014)"
                    subtitle="Evidence-based recommendations for natural bodybuilding contest preparation."
                    desc="Fundamenta a necessidade de ingestão proteica elevada (1.8g a 2.7g/kg) durante déficits calóricos para evitar catabolismo muscular."
                    link="https://pubmed.ncbi.nlm.nih.gov/24092765/"
                />
                <ReferenceCard
                    category="METABOLISMO"
                    color="purple"
                    title="Kevin D. Hall (2008)"
                    subtitle="What is the required energy deficit per unit weight loss?"
                    desc="Demonstra matematicamente que a perda de peso não é linear e exige reajustes dinâmicos (como mostrado no simulador)."
                    link="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2376744/"
                    fullWidth
                />
            </div>
        </section>
    );
};

const ReferenceCard = ({ category, color, title, subtitle, desc, link, fullWidth }: ReferenceCardProps) => {
    const styles = colorStyles[color];

    return (
        <div className={`bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors ${styles.border} ${fullWidth ? 'md:col-span-2' : ''}`}>
      <span className={`text-xs font-bold px-2 py-1 rounded mb-3 inline-block ${styles.badge}`}>
        {category}
      </span>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 italic">&quot;{subtitle}&quot;</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            <a href={link} target="_blank" rel="noopener noreferrer" className={`mt-3 text-xs font-bold hover:underline flex items-center ${styles.link}`}>
                Ler estudo &rarr;
            </a>
        </div>
    );
};