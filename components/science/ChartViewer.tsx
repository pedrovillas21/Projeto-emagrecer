import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { SimulationPoint } from '@/types';

interface ChartViewerProps {
    data: SimulationPoint[];
    isGain: boolean;
}

export const ChartViewer = ({ data, isGain }: ChartViewerProps) => {
    return (
        <>
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                        <XAxis
                            dataKey="week"
                            axisLine={false}
                            tickLine={false}
                            tick={{fill: '#94a3b8', fontSize: 12}}
                            dy={10}
                            label={{ value: 'Semanas', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 10 }}
                        />
                        <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} domain={['auto', 'auto']} />
                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} domain={['auto', 'auto']} />

                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            formatter={(value: number, name: string) => {
                                if (String(name).includes('Peso')) return [`${value} kg`, 'Peso Corporal'];
                                return [`${value} kcal`, 'Metabolismo Basal'];
                            }}
                            labelFormatter={(label) => `Semana ${label}`}
                        />
                        <Legend wrapperStyle={{paddingTop: '20px'}}/>

                        <Line yAxisId="left" type="monotone" dataKey="peso" stroke="#3b82f6" strokeWidth={3} name="Peso (kg)" dot={false} activeDot={{r: 6}} />
                        <Line yAxisId="right" type="monotone" dataKey="metabolismo" stroke={isGain ? "#8b5cf6" : "#ef4444"} strokeWidth={2} name="Metabolismo (kcal)" strokeDasharray="4 4" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Insight Box */}
            <div className={`mt-6 text-sm p-4 rounded border ${isGain ? 'bg-purple-50 border-purple-100' : 'bg-slate-50 border-slate-100'}`}>
                <p className={isGain ? 'text-purple-800' : 'text-slate-600'}>
                    <strong>Análise Científica:</strong>
                    {isGain
                        ? " O ganho de massa exige superávit calórico progressivo. Note que o metabolismo (linha tracejada) sobe junto com o peso, pois tecidos maiores gastam mais energia para manutenção."
                        : " A perda de peso gera adaptação metabólica. Conforme o peso cai (linha azul), o corpo reduz o gasto energético (linha tracejada) em cerca de 10-20 kcal por kg perdido, exigindo ajustes constantes na dieta."
                    }
                </p>
            </div>
        </>
    );
};