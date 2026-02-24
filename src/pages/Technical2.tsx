import React from 'react';
import { motion } from 'motion/react';
import { Hourglass, Wind, AlertTriangle, TimerOff, Leaf, Rocket, CheckCircle, BarChart3, Zap, Gauge } from 'lucide-react';

const Technical: React.FC = () => {
  const specs = [
    {
      category: "Velocidad Impresión",
      solvente: "Máx. 20-30 m²/h",
      hp: "Máx. 36-45 m²/h (según modelo)",
      advantage: "HP 1.5x más rápido"
    },
    {
      category: "Tecnología Tinta",
      solvente: "Solvente/Eco-solvente basado químicos",
      hp: "Latex base agua, curado con calor",
      advantage: "HP más sostenible"
    },
    {
      category: "Tiempo Secado",
      solvente: "24-48 horas (desgasificación)",
      hp: "Instantáneo (0 horas)",
      advantage: "HP: producción inmediata"
    },
    {
      category: "Print & Cut",
      solvente: "No disponible / Proceso manual",
      hp: "Disponible con módulo Summa integrado",
      advantage: "HP sólo"
    },
    {
      category: "Coste Tinta/m²",
      solvente: "0.78€ aprox (60€/L × 0.012L/m²)",
      hp: "1.20€ (bajo rendimiento optimizado)",
      advantage: "Solvente 35% más barato en tinta"
    },
    {
      category: "Mantenimiento",
      solvente: "Frecuente (cabezal, limpieza)",
      hp: "Mínimo (sistema más estable)",
      advantage: "HP menor costo operativo"
    },
    {
      category: "Ventilación Requerida",
      solvente: "Sí - Sistema de extracción necesario",
      hp: "No - Apto para cualquier espacio",
      advantage: "HP más flexible"
    },
    {
      category: "Aplicaciones Permitidas",
      solvente: "Exteriores, exposiciones cortas",
      hp: "Interiores, escuelas, hospitales (UL GREENGUARD)",
      advantage: "HP acceso mayor mercado"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Especificaciones Técnicas</h1>
        <p className="text-gray-500 text-lg">Análisis detallado de tecnologías y capacidades</p>
      </header>

      {/* Quick Comparison Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Solvent Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl overflow-hidden border border-rose-100 shadow-sm"
        >
          <div className="bg-rose-50 p-4 border-b border-rose-100 flex justify-between items-center">
            <div className="flex items-center gap-2 text-rose-700 font-bold">
              <AlertTriangle size={20} />
              Solvente (Tradicional)
            </div>
            <span className="text-xs font-bold bg-rose-100 text-rose-600 px-2 py-1 rounded uppercase">Convencional</span>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500 shrink-0">
                <Hourglass size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tiempo de Espera</p>
                <p className="text-2xl font-bold text-gray-900">24-48 Horas</p>
                <p className="text-xs text-rose-500 mt-1 font-medium">Outgassing necesario antes de laminar.</p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100"></div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500 shrink-0">
                <Wind size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ventilación</p>
                <p className="text-lg font-bold text-gray-900">Requiere Extracción</p>
                <p className="text-xs text-gray-500 mt-1">Olores fuertes por VOCs nocivos.</p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100"></div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 shrink-0">
                <BarChart3 size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Productividad Real</p>
                <p className="text-lg font-bold text-gray-900">Limitada</p>
                <p className="text-xs text-gray-500 mt-1">Esperas bloquean flujo de producción.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* HP Latex Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl overflow-hidden border border-emerald-200 shadow-sm ring-1 ring-emerald-100 relative"
        >
          <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg z-10">RECOMENDADO</div>
          <div className="bg-emerald-50 p-4 border-b border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle size={20} />
              HP Latex 630 Print & Cut
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shrink-0">
                <TimerOff size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tiempo de Espera</p>
                <p className="text-2xl font-bold text-gray-900">0 Horas</p>
                <p className="text-xs text-emerald-600 mt-1 font-medium">Curado instantáneo dentro de la impresora.</p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100"></div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-sky-50 rounded-lg flex items-center justify-center text-sky-500 shrink-0">
                <Leaf size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sostenibilidad</p>
                <p className="text-lg font-bold text-gray-900">Base Agua</p>
                <p className="text-xs text-gray-500 mt-1">Sin olores, UL GREENGUARD GOLD certificado.</p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100"></div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 shrink-0">
                <Rocket size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Productividad</p>
                <p className="text-lg font-bold text-gray-900">Máxima</p>
                <p className="text-xs text-gray-500 mt-1">Print & Cut simultáneo, flujo continuo.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Specs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
      >
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900">Comparativa Especificaciones</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {specs.map((spec, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 font-bold text-gray-900 border-b border-gray-100 w-[25%]">{spec.category}</td>
                  <td className="px-6 py-4 text-gray-600 border-b border-gray-100 w-[35%]">
                    <div className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">✗</span>
                      <span>{spec.solvente}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 border-b border-gray-100 w-[35%]">
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{spec.hp}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-100 text-xs font-bold text-emerald-700 bg-emerald-50 text-center">{spec.advantage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Installation Requirements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid md:grid-cols-2 gap-6"
      >
        <div className="bg-rose-50 rounded-xl p-6 border border-rose-200">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-rose-600" />
            <h3 className="font-bold text-gray-900">Requisitos Solvente</h3>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Sistema de extracción:</strong> 6000-8000 m³/h recomendado</span>
            </li>
            <li className="flex gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Espacio:</strong> Mínimo 20m² con alturas 2.5m+</span>
            </li>
            <li className="flex gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Electricidad:</strong> Monofásico 2.2kW típico</span>
            </li>
            <li className="flex gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Refrigeración:</strong> Aire acondicionado para mantener temp. estable</span>
            </li>
            <li className="flex gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Manejo residuos:</strong> Autorización para residuos tóxicos</span>
            </li>
          </ul>
        </div>

        <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-emerald-600" />
            <h3 className="font-bold text-gray-900">Requisitos HP Latex</h3>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Extracción:</strong> Mínima (solo aire acondicionado normal)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Espacio:</strong> Flexible, desde 15m² compatible</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Electricidad:</strong> Trifásica 4.5kW (más estable)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Refrigeración:</strong> Incluida en sistema - ambiente controlado</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Residuos:</strong> Agua - reciclable, sin clasificación especial</span>
            </li>
          </ul>
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-8 border border-indigo-200"
      >
        <div className="flex items-center gap-2 mb-6">
          <Gauge className="text-indigo-600" />
          <h2 className="font-bold text-lg text-gray-900">Métricas de Rendimiento</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: "Velocidad", solvente: "20 m²/h", hp: "36 m²/h", delta: "+80%" },
            { label: "Productividad Diaria", solvente: "40 m²", hp: "250 m²", delta: "+500%" },
            { label: "Coste por m²", solvente: "2.08€", hp: "1.58€", delta: "-24%" },
            { label: "Tiempo Ciclo", solvente: "72h", hp: "3h", delta: "-96%" }
          ].map((metric, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 border border-indigo-100">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">{metric.label}</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-sm text-gray-500 line-through">{metric.solvente}</span>
                <span className="font-bold text-indigo-600 text-lg">{metric.hp}</span>
              </div>
              <p className="text-xs font-bold text-emerald-600">{metric.delta}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Technical;
