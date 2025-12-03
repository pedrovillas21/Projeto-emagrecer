import { Dispatch, SetStateAction } from 'react';
import { Settings2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SimulationState } from '@/types';

interface SimulationControlsProps {
    inputs: SimulationState;
    setInputs: Dispatch<SetStateAction<SimulationState>>;
}

export const SimulationControls = ({ inputs, setInputs }: SimulationControlsProps) => {

    const handleChange = (field: keyof SimulationState, value: string | number) => {
        setInputs((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700 mb-8 transition-colors">
            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <Settings2 size={14}/> Parâmetros da Simulação
            </div>

            {/* Linha 1: Dados Biológicos */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">
                <Select
                    label="Gênero"
                    value={inputs.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    options={[{ value: 'male', label: 'Homem' }, { value: 'female', label: 'Mulher' }]}
                />
                <Input
                    label="Idade" type="number" value={inputs.age}
                    onChange={(e) => handleChange('age', Number(e.target.value))} suffix="anos"
                />
                <Input
                    label="Altura" type="number" value={inputs.height}
                    onChange={(e) => handleChange('height', Number(e.target.value))} suffix="cm"
                />
            </div>

            {/* Linha 2: Dados da Dieta */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input
                    label="Peso Inicial" type="number" value={inputs.startWeight}
                    onChange={(e) => handleChange('startWeight', Number(e.target.value))} suffix="kg"
                    className="text-blue-600 dark:text-blue-400"
                />
                <Input
                    label="Meta" type="number" value={inputs.goalWeight}
                    onChange={(e) => handleChange('goalWeight', Number(e.target.value))} suffix="kg"
                />
                <div className="col-span-2">
                    <Select
                        label="Ritmo (% Peso / Semana)" value={inputs.pace}
                        onChange={(e) => handleChange('pace', Number(e.target.value))}
                        options={[
                            { value: 0.005, label: '0.5% (Lento & Sustentável)' },
                            { value: 0.006, label: '0.6%' },
                            { value: 0.007, label: '0.7%' },
                            { value: 0.008, label: '0.8%' },
                            { value: 0.009, label: '0.9%' },
                            { value: 0.010, label: '1.0% (Rápido / Agressivo)' },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};