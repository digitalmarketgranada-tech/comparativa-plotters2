import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { Calculator as CalcIcon, RefreshCw } from 'lucide-react';

const Calculator: React.FC = () => {
  const { data, updateData, calculate } = useData();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'currentMachineType' || name === 'hpMachineModel') {
      updateData({ [name]: value });
    } else {
      // Remove leading zeros for numbers and convert to number
      const numValue = value === '' ? 0 : Number(value);
      updateData({ [name]: numValue });
    }
  };

  const handleCalculateAndNavigate = () => {
    calculate();
    Promise.resolve().then(() => navigate('/cost-breakdown'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Calculadora ROI</h1>
          <p className="text-gray-600 mt-2">Introduce los datos actuales para generar una comparativa precisa.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Current Machine Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="bg-gray-50 px-4 lg:px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <span className="w-2 h-6 bg-rose-500 rounded-full"></span>
              <h2 className="font-bold text-gray-800 text-lg">Máquina Actual</h2>
            </div>

            <div className="p-4 lg:p-6 space-y-5">
              {/* Machine Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Máquina</label>
                <select
                  name="currentMachineType"
                  value={data.currentMachineType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 bg-white text-gray-900 font-medium transition-colors"
                >
                  <option value="Solvente Genérica">Solvente Genérica</option>
                  <option value="Eco-Solvente">Eco-Solvente</option>
                  <option value="UV">UV</option>
                </select>
              </div>

              {/* Monthly Volume */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Volumen Mensual</label>
                <div className="relative">
                  <input
                    type="number"
                    name="monthlyVolume"
                    value={data.monthlyVolume || ''}
                    onChange={handleChange}
                    min="0"
                    step="100"
                    placeholder="1500"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-gray-900 font-medium placeholder-gray-400"
                  />
                  <span className="absolute right-4 top-3 text-gray-500 font-medium text-sm pointer-events-none">m²</span>
                </div>
              </div>

              {/* Ink Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Precio Tinta</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 font-medium text-sm pointer-events-none">€</span>
                  <input
                    type="number"
                    name="inkPrice"
                    value={data.inkPrice || ''}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    placeholder="150"
                    className="w-full px-4 py-2.5 pl-8 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-gray-900 font-medium placeholder-gray-400"
                  />
                  <span className="absolute right-4 top-3 text-gray-500 font-medium text-sm pointer-events-none">/L</span>
                </div>
              </div>

              {/* Print Speed */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Velocidad de Impresión</label>
                <div className="relative">
                  <input
                    type="number"
                    name="printSpeed"
                    value={data.printSpeed || ''}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    placeholder="12"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-gray-900 font-medium placeholder-gray-400"
                  />
                  <span className="absolute right-4 top-3 text-gray-500 font-medium text-sm pointer-events-none">m²/h</span>
                </div>
              </div>

              {/* Maintenance Hours */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mantenimiento Semanal</label>
                <div className="relative">
                  <input
                    type="number"
                    name="maintenanceHours"
                    value={data.maintenanceHours || ''}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    placeholder="2"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-gray-900 font-medium placeholder-gray-400"
                  />
                  <span className="absolute right-4 top-3 text-gray-500 font-medium text-sm pointer-events-none">h</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Horas de mantenimiento por semana</p>
              </div>

              {/* Wait Hours */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tiempo Desgasificación</label>
                <div className="relative">
                  <input
                    type="number"
                    name="waitHours"
                    value={data.waitHours || ''}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    placeholder="36"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-gray-900 font-medium placeholder-gray-400"
                  />
                  <span className="absolute right-4 top-3 text-gray-500 font-medium text-sm pointer-events-none">h</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Tiempo de secado/desgasificación</p>
              </div>
            </div>
          </motion.section>

          {/* HP Machine Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-sky-200 overflow-hidden ring-1 ring-sky-100"
          >
            <div className="bg-sky-50 px-4 lg:px-6 py-4 border-b border-sky-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-6 bg-sky-500 rounded-full"></span>
                <h2 className="font-bold text-sky-900 text-lg">HP Latex (Recomendado)</h2>
              </div>
              <span className="bg-sky-200 text-sky-800 text-xs font-bold px-2 py-1 rounded-full">RECOMENDADO</span>
            </div>

            <div className="p-4 lg:p-6 space-y-5">
              {/* HP Model */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Modelo HP</label>
                <select
                  name="hpMachineModel"
                  value={data.hpMachineModel}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-white text-gray-900 font-medium transition-colors"
                >
                  <option value="HP Latex 630 Print & Cut">HP Latex 630 Print & Cut</option>
                  <option value="HP Latex 700 Print & Cut">HP Latex 700 Print & Cut</option>
                  <option value="HP Latex 800 W">HP Latex 800 W</option>
                </select>
              </div>

              {/* HP Machine Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Precio Solución</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 font-medium text-sm pointer-events-none">€</span>
                  <input
                    type="number"
                    name="hpMachinePrice"
                    value={data.hpMachinePrice || ''}
                    onChange={handleChange}
                    min="0"
                    step="100"
                    placeholder="23190"
                    className="w-full px-4 py-2.5 pl-8 rounded-lg border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-gray-900 font-medium placeholder-gray-400"
                  />
                </div>
              </div>

              {/* HP Print Speed */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Velocidad de Impresión</label>
                <div className="relative">
                  <input
                    type="number"
                    name="hpPrintSpeed"
                    value={data.hpPrintSpeed || ''}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    placeholder="18"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-gray-900 font-medium placeholder-gray-400"
                  />
                  <span className="absolute right-4 top-3 text-gray-500 font-medium text-sm pointer-events-none">m²/h</span>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-sky-50 p-4 rounded-lg border border-sky-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="text-sm font-bold text-sky-900">Coste Tinta: <span className="text-red-600">1,2 €/m²</span></p>
                    <p className="text-xs text-sky-700">Estándar HP (12,5ml/m²)</p>
                  </div>
                </div>
              </div>

              {/* Fixed Values Info */}
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 space-y-1">
                <p className="text-xs font-bold text-emerald-900">✓ Ventajas Incluidas:</p>
                <ul className="text-xs text-emerald-800 space-y-0.5">
                  <li>• 0h mantenimiento semanal</li>
                  <li>• 0h desgasificación (curado al instante)</li>
                  <li>• Impresión y corte simultáneos</li>
                </ul>
              </div>
            </div>
          </motion.section>
        </div>

        {/* New Usage Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="bg-gray-50 px-4 lg:px-6 py-4 border-b border-gray-200 flex items-center gap-3">
            <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
            <h2 className="font-bold text-gray-800 text-lg">Distribución de Trabajos y Precios de Venta</h2>
          </div>

          <div className="p-4 lg:p-6 grid gap-6 md:grid-cols-2">
            {/* Percentages */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Mezcla de Producción (%)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Lona</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="lonaPercentage"
                      value={data.lonaPercentage}
                      onChange={(e) => {
                        const val = Math.min(100, Math.max(0, Number(e.target.value)));
                        updateData({ lonaPercentage: val, viniloPercentage: 100 - val });
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900 font-medium"
                    />
                    <span className="absolute right-3 top-2 text-gray-400 font-bold">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Vinilo</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="viniloPercentage"
                      value={data.viniloPercentage}
                      onChange={(e) => {
                        const val = Math.min(100, Math.max(0, Number(e.target.value)));
                        updateData({ viniloPercentage: val, lonaPercentage: 100 - val });
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900 font-medium"
                    />
                    <span className="absolute right-3 top-2 text-gray-400 font-bold">%</span>
                  </div>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${data.lonaPercentage}%` }}
                ></div>
                <div
                  className="h-full bg-purple-300 transition-all duration-500"
                  style={{ width: `${data.viniloPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Sell Prices */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Precios de Venta (€/m²)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Venta Lona</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400 font-bold">€</span>
                    <input
                      type="number"
                      name="lonaSellPrice"
                      value={data.lonaSellPrice}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pl-7 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900 font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Venta Vinilo</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400 font-bold">€</span>
                    <input
                      type="number"
                      name="viniloSellPrice"
                      value={data.viniloSellPrice}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pl-7 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900 font-medium"
                    />
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 italic">* Precios medios de mercado para el cálculo del ROI.</p>
            </div>
          </div>
        </motion.section>

        {/* Renting Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="bg-gray-50 px-4 lg:px-6 py-4 border-b border-gray-200 flex items-center gap-3">
            <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
            <h2 className="font-bold text-gray-800 text-lg">Financiación / Renting (Opcional)</h2>
          </div>

          <div className="p-4 lg:p-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Plazo del Renting</label>
              <div className="relative">
                <select
                  name="rentingMonths"
                  value={data.rentingMonths}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white text-gray-900 font-medium transition-colors"
                >
                  <option value="12">12 Meses</option>
                  <option value="24">24 Meses</option>
                  <option value="36">36 Meses</option>
                  <option value="48">48 Meses</option>
                  <option value="60">60 Meses</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Interés Anual Estimado (%)</label>
              <div className="relative">
                <input
                  type="number"
                  name="rentingInterest"
                  value={data.rentingInterest}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-gray-900 font-medium"
                />
                <span className="absolute right-4 top-3 text-gray-400 font-bold">%</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 italic">* Media habitual: 6.0% - 7.5%</p>
            </div>
          </div>
        </motion.section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={handleCalculateAndNavigate}
            className="flex-1 bg-gradient-to-r from-sky-600 to-sky-700 text-white font-bold py-3 lg:py-4 rounded-lg hover:from-sky-700 hover:to-sky-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <CalcIcon size={20} />
            <span>Calcular Comparativa</span>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-4 lg:px-8 bg-white border-2 border-gray-300 text-gray-700 font-bold py-3 lg:py-4 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <RefreshCw size={20} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
