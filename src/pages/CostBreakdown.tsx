import React from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const CostBreakdown: React.FC = () => {
  const { results } = useData();

  const chartData = [
    {
      name: 'Actual',
      cost: results.currentMonthlyCost,
      color: '#F43F5E' // Rose-500
    },
    {
      name: 'HP Latex',
      cost: results.hpMonthlyCost,
      color: '#0EA5E9' // Sky-500
    }
  ];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Desglose de Costes</h1>
        <p className="text-gray-500 mt-2">Análisis detallado de costes operativos mensuales.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Chart Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <h3 className="font-bold text-gray-800 mb-6">Coste Total Mensual</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(val) => `€${val}`} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [formatCurrency(value), 'Coste']}
                />
                <Bar dataKey="cost" radius={[6, 6, 0, 0]} barSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Details List */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-sky-100 ring-1 ring-sky-50"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">HP Latex</span>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">-28% vs Comp</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">{formatCurrency(results.hpMonthlyCost)}</span>
              <span className="text-gray-400 text-sm">/ mes</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">Eficiencia optimizada por alta velocidad de secado y menor mantenimiento.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Competencia</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">{formatCurrency(results.currentMonthlyCost)}</span>
              <span className="text-gray-400 text-sm">/ mes</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">Costes elevados por tiempos de espera, limpieza manual y mayor consumo energético.</p>
          </motion.div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
          <div className="col-span-6">Concepto</div>
          <div className="col-span-3 text-right text-sky-600">HP</div>
          <div className="col-span-3 text-right text-gray-600">Solvente</div>
        </div>
        
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
            <div className="col-span-6">
              <p className="font-bold text-gray-900">Tinta</p>
              <p className="text-xs text-gray-500">Consumo optimizado</p>
            </div>
            <div className="col-span-3 text-right font-medium text-gray-900">0,45 € / m²</div>
            <div className="col-span-3 text-right text-gray-500">0,60 € / m²</div>
          </div>

          <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
            <div className="col-span-6">
              <p className="font-bold text-gray-900">Operador</p>
              <p className="text-xs text-gray-500">Tiempo de atención</p>
            </div>
            <div className="col-span-3 text-right font-medium text-gray-900">0,80 € / m²</div>
            <div className="col-span-3 text-right text-gray-500">1,10 € / m²</div>
          </div>

          <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
            <div className="col-span-6">
              <p className="font-bold text-gray-900">Mantenimiento</p>
              <p className="text-xs text-gray-500">Piezas y servicio</p>
            </div>
            <div className="col-span-3 text-right font-medium text-gray-900">0,25 € / m²</div>
            <div className="col-span-3 text-right text-gray-500">0,40 € / m²</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostBreakdown;
