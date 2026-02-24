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
  Cell,
  LineChart,
  Line
} from 'recharts';
import { TrendingDown, AlertCircle } from 'lucide-react';

const CostBreakdown: React.FC = () => {
  const { data, results } = useData();

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(val);

  // Calcular desglose de costos COMPETENCIA
  const solventInkCoverage = 0.012; // L/m²
  const competitorInkCostPerM2 = solventInkCoverage * data.inkPrice; // €/m²
  const solventTintaCost = data.monthlyVolume * competitorInkCostPerM2;
  const solventPrintHours = data.monthlyVolume / data.printSpeed;
  const solventOperarioCost = (solventPrintHours + (data.maintenanceHours * 4)) * 20;
  const solventEsperaCost = (data.monthlyVolume / 50) * 0.5 * 20;

  // Calcular desglose de costos HP
  const hpInkCostPerM2 = 1.2;
  const hpTintaCost = data.monthlyVolume * hpInkCostPerM2;
  const hpPrintHours = data.monthlyVolume / data.hpPrintSpeed;
  const hpOperarioCost = hpPrintHours * 20;

  const chartData = [
    {
      name: 'Tinta',
      Solvente: competitorInkCostPerM2,
      HP: hpInkCostPerM2,
    },
  ];

  const monthlyComparison = [
    { name: 'Tinta', Solvente: solventTintaCost, HP: hpTintaCost },
    { name: 'Operario', Solvente: solventOperarioCost, HP: hpOperarioCost },
    { name: 'Espera', Solvente: solventEsperaCost, HP: 0 },
  ];

  const monthlySavings = results.currentMonthlyCost - results.hpMonthlyCost;
  const annualSavings = monthlySavings * 12;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Desglose de Costes</h1>
        <p className="text-gray-500 text-lg">Análisis transparente de costes operativos mensuales</p>
      </header>

      {/* Nueva Comparativa de Margen Lado a Lado */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Lado Izquierdo: SITUACIÓN ACTUAL */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden"
        >
          <div className="bg-rose-50 px-6 py-4 border-b border-rose-100 flex items-center justify-between">
            <h3 className="font-bold text-rose-900 text-lg uppercase tracking-tight">Tu Situación Actual</h3>
            <span className="text-rose-600 font-mono text-xs font-bold px-2 py-1 bg-rose-100 rounded">SOLVENTE</span>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-end border-b border-gray-100 pb-4">
              <span className="text-gray-500 font-medium">Ventas Mensuales</span>
              <span className="text-2xl font-bold text-gray-900">{formatCurrency(results.monthlyRevenue)}</span>
            </div>
            <div className="flex justify-between items-end border-b border-gray-100 pb-4">
              <div>
                <span className="text-gray-500 font-medium">Costes Operativos</span>
                <p className="text-[10px] text-rose-500 font-bold uppercase">Tinta + Mano de Obra + Esperas</p>
              </div>
              <span className="text-xl font-bold text-rose-600">-{formatCurrency(results.currentMonthlyCost)}</span>
            </div>
            <div className="pt-2">
              <div className="bg-gradient-to-br from-rose-50 to-white p-6 rounded-xl border border-rose-200 shadow-inner">
                <p className="text-rose-800 text-xs font-bold uppercase mb-1 tracking-wider">Beneficio Bruto Mensual</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-black text-rose-600">{formatCurrency(results.currentMonthlyProfit)}</h2>
                  <span className="text-rose-400 font-bold text-sm">Limpio</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lado Derecho: SOLUCIÓN HP LATEX */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border-2 border-sky-500 shadow-xl overflow-hidden relative"
        >
          <div className="bg-sky-600 px-6 py-4 border-b border-sky-700 flex items-center justify-between text-white">
            <h3 className="font-bold text-lg uppercase tracking-tight">Solución HP Latex</h3>
            <span className="bg-emerald-400 text-sky-900 font-black text-[10px] px-3 py-1 rounded-full shadow-sm">RECOMENDADO</span>
          </div>
          <div className="p-8 space-y-4">
            <div className="flex justify-between items-end border-b border-gray-100 pb-3">
              <span className="text-gray-500 font-medium">Ventas Mensuales</span>
              <span className="text-2xl font-bold text-gray-900">{formatCurrency(results.monthlyRevenue)}</span>
            </div>
            <div className="flex justify-between items-end border-b border-gray-100 pb-3">
              <div>
                <span className="text-gray-500 font-medium">Nuevos Costes Operativos</span>
                <p className="text-[10px] text-emerald-600 font-bold uppercase">Ahorro en Operario y Esperas</p>
              </div>
              <span className="text-xl font-bold text-emerald-600">-{formatCurrency(results.hpMonthlyCost)}</span>
            </div>
            <div className="flex justify-between items-end border-b border-gray-100 pb-3 bg-gray-50 -mx-8 px-8 py-3">
              <div>
                <span className="text-gray-600 font-bold text-sm">Cuota Renting (Pago Inversión)</span>
                <p className="text-[10px] text-gray-400">{data.rentingMonths} meses al {data.rentingInterest}%</p>
              </div>
              <span className="text-xl font-bold text-amber-600">-{formatCurrency(results.monthlyRentingQuota)}</span>
            </div>

            <div className="pt-2">
              <div className="bg-gradient-to-br from-emerald-600 to-sky-700 p-6 rounded-xl border-t border-white/20 shadow-lg text-white relative">
                <div className="absolute top-4 right-4 bg-white/20 text-[10px] font-bold px-2 py-1 rounded">LIMPIO EN CAJA</div>
                <p className="text-sky-100 text-xs font-bold uppercase mb-1 tracking-wider">Beneficio Neto Final</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-black">{formatCurrency(results.hpNetMonthlyProfit)}</h2>
                  <span className="text-emerald-300 font-bold text-sm">Excedente</span>
                </div>
              </div>
            </div>

            {/* Mensaje de Valor */}
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl leading-none">✓</div>
              <p className="text-emerald-800 text-xs leading-tight">
                <strong>La máquina se paga sola:</strong> El ahorro en costes operativos cubre la cuota del renting y aún deja <strong>{formatCurrency(results.hpNetMonthlyProfit - results.currentMonthlyProfit)}</strong> de beneficio extra al mes.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-8 border border-emerald-200"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
            <TrendingDown size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ROI en solo {results.roiMonths.toFixed(1)} meses</h2>
            <p className="text-emerald-700 font-medium italic">Amortización acelerada gracias al ahorro en costes de producción.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/50 p-3 rounded-lg border border-emerald-100">
                <p className="text-xs text-gray-500 uppercase">Ahorro Mensual</p>
                <p className="text-lg font-bold text-emerald-600">{formatCurrency(monthlySavings)}</p>
              </div>
              <div className="bg-white/50 p-3 rounded-lg border border-emerald-100">
                <p className="text-xs text-gray-500 uppercase">Ahorro Anual</p>
                <p className="text-lg font-bold text-emerald-600">{formatCurrency(annualSavings)}</p>
              </div>
              <div className="bg-white/50 p-3 rounded-lg border border-emerald-100">
                <p className="text-xs text-gray-500 uppercase">Margen Extra</p>
                <p className="text-lg font-bold text-emerald-600">{((results.monthlySavings / results.monthlyRevenue) * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-white/50 p-3 rounded-lg border border-emerald-100">
                <p className="text-xs text-gray-500 uppercase">Retorno Anual</p>
                <p className="text-lg font-bold text-emerald-600">{((annualSavings / data.hpMachinePrice) * 100).toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Comparativa Gráfica por Componente €/m² */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <h3 className="font-bold text-lg text-gray-900 mb-2">Coste de Producción por m² (Tinta)</h3>
        <p className="text-sm text-gray-500 mb-6">Comparativa de gasto directo en consumibles</p>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `€${val.toFixed(2)}`} />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(2)}€`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="Solvente" fill="#F43F5E" radius={[6, 6, 0, 0]} />
              <Bar dataKey="HP" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Desglose Detallado */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* SOLVENTE */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-rose-200 overflow-hidden"
        >
          <div className="bg-rose-50 px-6 py-4 border-b border-rose-200">
            <h3 className="font-bold text-rose-900 text-lg">Tu Coste Actual (Estimado)</h3>
            <p className="text-rose-700 text-sm mt-1">Gasto mensual oculto por ineficiencias</p>
          </div>

          <div className="p-6 space-y-4">
            {/* Tinta */}
            <div className="bg-rose-50 rounded-lg p-4 border border-rose-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-gray-900">Consumo de Tinta</p>
                  <p className="text-xs text-gray-500 mt-1">0.012 L/m² × {data.inkPrice}€/L</p>
                </div>
                <span className="font-bold text-lg text-gray-900">{formatCurrency(solventTintaCost)}</span>
              </div>
              <p className="text-xs text-gray-600">= {competitorInkCostPerM2.toFixed(2)}€/m² × {data.monthlyVolume} m²</p>
            </div>

            {/* Operario */}
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-gray-900">Tiempo de Mano de Obra</p>
                  <p className="text-xs text-gray-500 mt-1">Producción + Mantenimiento</p>
                </div>
                <span className="font-bold text-lg text-gray-900">{formatCurrency(solventOperarioCost)}</span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Impresión: {solventPrintHours.toFixed(1)}h ÷ {data.printSpeed}m²/h = {solventPrintHours.toFixed(1)}h</p>
                <p>Mantenimiento: {data.maintenanceHours}h/sem × 4 sem = {data.maintenanceHours * 4}h</p>
                <p>Total: ({solventPrintHours.toFixed(1)} + {data.maintenanceHours * 4})h × 20€/h</p>
              </div>
            </div>

            {/* Espera */}
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-gray-900">Tiempo de Inactividad (Espera)</p>
                  <p className="text-xs text-gray-500 mt-1">Secado + Manipulación</p>
                </div>
                <span className="font-bold text-lg text-gray-900">{formatCurrency(solventEsperaCost)}</span>
              </div>
              <p className="text-xs text-gray-600">({data.monthlyVolume}/50 rolls) × 0.5h × 20€/h por esperas de secado</p>
            </div>

            {/* TOTAL */}
            <div className="bg-rose-600 rounded-lg p-4 text-white shadow-inner">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm uppercase">Coste Operativo Total</span>
                <span className="text-3xl font-bold">{formatCurrency(results.currentMonthlyCost)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* HP LATEX */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-sky-200 overflow-hidden"
        >
          <div className="bg-sky-50 px-6 py-4 border-b border-sky-200 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-sky-900 text-lg">Tu Coste con HP Latex</h3>
              <p className="text-sky-700 text-sm mt-1">Máxima eficiencia y ahorro directo</p>
            </div>
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">AHORRO GARANTIZADO</span>
          </div>

          <div className="p-6 space-y-4">
            {/* Tinta */}
            <div className="bg-sky-50 rounded-lg p-4 border border-sky-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-gray-900">Consumo de Tinta HP</p>
                  <p className="text-xs text-gray-500 mt-1">Optimización por micro-gotas</p>
                </div>
                <span className="font-bold text-lg text-gray-900">{formatCurrency(hpTintaCost)}</span>
              </div>
              <p className="text-xs text-gray-600">1.2€/m² × {data.monthlyVolume} m²</p>
            </div>

            {/* Operario */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-gray-900">Tiempo de Operario</p>
                  <p className="text-xs text-gray-500 mt-1">Solo tiempo de impresión real</p>
                </div>
                <span className="font-bold text-lg text-gray-900">{formatCurrency(hpOperarioCost)}</span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Impresión: {data.monthlyVolume}m² ÷ {data.hpPrintSpeed}m²/h = {hpPrintHours.toFixed(1)}h</p>
                <p>{hpPrintHours.toFixed(1)}h × 20€/h</p>
                <p className="text-emerald-600 font-bold uppercase text-[10px]">✓ Sin pérdida de tiempo en labores manuales</p>
              </div>
            </div>

            {/* Mantenimiento */}
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-gray-900">Mantenimiento Preventivo</p>
                  <p className="text-xs text-gray-500 mt-1">Tecnología auto-limpiable</p>
                </div>
                <span className="font-bold text-lg text-emerald-600">0 €</span>
              </div>
              <p className="text-xs text-emerald-700 font-medium">✓ Ahorras más de {data.maintenanceHours * 4}h de limpieza mensual</p>
            </div>

            {/* Espera */}
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-gray-900">Tiempo de Secado</p>
                  <p className="text-xs text-gray-500 mt-1">Tecnología de curado instantáneo</p>
                </div>
                <span className="font-bold text-lg text-emerald-600">0 €</span>
              </div>
              <p className="text-xs text-emerald-700 font-medium">✓ Acabado seco al salir. Gana {solventEsperaCost / 20}h mensuales de producción</p>
            </div>

            {/* TOTAL */}
            <div className="bg-sky-600 rounded-lg p-4 text-white shadow-inner">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm uppercase">Coste Operativo HP</span>
                <span className="text-3xl font-bold">{formatCurrency(results.hpMonthlyCost)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Comparativa Mensual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-lg text-gray-900">Desglose Mensual por Componente</h3>
        </div>

        <div className="h-[300px] w-full p-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `€${val}`} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="Solvente" fill="#F43F5E" radius={[6, 6, 0, 0]} />
              <Bar dataKey="HP" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Tabla de Fórmulas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <AlertCircle size={20} className="text-blue-600" />
          <h3 className="font-bold text-lg text-gray-900">Fórmulas Utilizadas</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Competencia (Solvente)</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-mono bg-gray-100 px-2 py-1 rounded">Tinta/m² = 0.012 L/m² × Precio/L</span></p>
                <p><span className="font-mono bg-gray-100 px-2 py-1 rounded">Horas = Volumen ÷ Velocidad</span></p>
                <p><span className="font-mono bg-gray-100 px-2 py-1 rounded">Operario = (Horas + Mantenimiento) × 20€/h</span></p>
                <p><span className="font-mono bg-gray-100 px-2 py-1 rounded">Espera = (Volumen÷50) × 0.5h × 20€/h</span></p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-3">HP Latex (Fijo)</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-mono bg-sky-100 px-2 py-1 rounded">Tinta/m² = 1.2€/m² (Cartucho 118€/L)</span></p>
                <p><span className="font-mono bg-sky-100 px-2 py-1 rounded">Velocidad = 18 m²/h (PDF Promoción)</span></p>
                <p><span className="font-mono bg-sky-100 px-2 py-1 rounded">Operario = Horas × 20€/h</span></p>
                <p><span className="font-mono bg-emerald-100 px-2 py-1 rounded">Mantenimiento = 0€ | Espera = 0€</span></p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CostBreakdown;
