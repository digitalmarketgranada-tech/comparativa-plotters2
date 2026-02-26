import React from 'react';
import { motion } from 'motion/react';
import { Hourglass, Wind, AlertTriangle, TimerOff, Leaf, CheckCircle, Monitor, Cloud, BarChart3, Wifi, Package, Zap } from 'lucide-react';

const Technical: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Detalle Técnico</h1>
        <p className="text-gray-500 mt-1">Tecnología, software y ventajas operativas de HP Latex vs Solvente.</p>
      </header>

      {/* Tecnología de tinta */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Solvent Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl overflow-hidden border border-rose-100 shadow-sm"
        >
          <div className="bg-rose-50 px-5 py-4 border-b border-rose-100 flex justify-between items-center">
            <div className="flex items-center gap-2 text-rose-700 font-bold">
              <AlertTriangle size={18} />
              Solvente (Tradicional)
            </div>
            <span className="text-xs font-bold bg-rose-100 text-rose-600 px-2 py-1 rounded-lg uppercase">Limitaciones</span>
          </div>

          <div className="p-5 space-y-5">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 shrink-0">
                <Hourglass size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tiempo de Espera</p>
                <p className="text-xl font-black text-gray-900">24–48 Horas</p>
                <p className="text-xs text-rose-500 mt-0.5 font-medium">Outgassing necesario antes de laminar o cortar.</p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100" />

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                <Wind size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ventilación</p>
                <p className="text-base font-bold text-gray-900">Requiere extracción forzada</p>
                <p className="text-xs text-gray-500 mt-0.5">Olores fuertes por COVs. No apto para interiores sensibles.</p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100" />

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                <Monitor size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Software de gestión</p>
                <p className="text-base font-bold text-gray-900">Software local / desktop</p>
                <p className="text-xs text-gray-500 mt-0.5">RIP instalado en local. Sin acceso remoto ni analíticas en tiempo real.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* HP Latex Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl overflow-hidden border-2 border-emerald-200 shadow-sm ring-4 ring-emerald-50"
        >
          <div className="bg-emerald-50 px-5 py-4 border-b border-emerald-100 flex justify-between items-center">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle size={18} />
              HP Latex 4ª Gen
            </div>
            <span className="text-xs font-bold bg-emerald-500 text-white px-2 py-1 rounded-lg uppercase">Recomendado</span>
          </div>

          <div className="p-5 space-y-5">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                <TimerOff size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tiempo de Espera</p>
                <p className="text-xl font-black text-gray-900">0 Horas</p>
                <p className="text-xs text-emerald-600 mt-0.5 font-medium">Curado instantáneo dentro de la impresora.</p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100" />

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500 shrink-0">
                <Leaf size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sostenibilidad</p>
                <p className="text-base font-bold text-gray-900">Base Agua — Sin olores</p>
                <p className="text-xs text-gray-500 mt-0.5">GREENGUARD Gold, UL ECOLOGO, Energy Star. Apto para interiores.</p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100" />

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 shrink-0">
                <Cloud size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Software de gestión</p>
                <p className="text-base font-bold text-gray-900">HP PrintOS — Cloud nativo</p>
                <p className="text-xs text-gray-500 mt-0.5">Gestión remota, analíticas en tiempo real, sin licencias adicionales.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ══════════ HP PrintOS ══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="bg-gray-900 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
              <Cloud size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-black text-white text-lg leading-tight">HP PrintOS</h2>
              <p className="text-gray-400 text-xs">Plataforma cloud exclusiva — sin equivalente en la competencia</p>
            </div>
          </div>
          <span className="bg-sky-500 text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">Exclusivo HP</span>
        </div>

        <div className="p-6">
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            HP PrintOS es el ecosistema de software cloud que HP ofrece <strong>gratuitamente</strong> con sus impresoras Latex. No es un RIP. Es una <strong>plataforma completa de gestión de negocio</strong> que ningún competidor (Roland, Mimaki, Epson) incluye de forma comparable.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {[
              {
                icon: Wifi,
                color: 'bg-sky-50 text-sky-600 border-sky-100',
                title: 'PrintOS Live — Monitorización Remota',
                desc: 'Controla el estado de la impresora, la cola de trabajos y el nivel de tinta en tiempo real desde cualquier dispositivo (móvil, tablet, PC). Nadie de la competencia ofrece esto de forma integrada y sin coste adicional.',
              },
              {
                icon: BarChart3,
                color: 'bg-violet-50 text-violet-600 border-violet-100',
                title: 'Print Beat — Analíticas de Producción',
                desc: 'Datos históricos y en tiempo real sobre rendimiento de la máquina, consumo de tinta, y KPIs de productividad. Permite tomar decisiones basadas en datos y benchmarking continuo.',
              },
              {
                icon: Package,
                color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                title: 'PrintOS Box — Recepción Automatizada',
                desc: 'Portal online para que tus clientes envíen archivos directamente. Validación automática de formato, preflight integrado y enrutamiento al flujo de producción sin intervención manual.',
              },
              {
                icon: Zap,
                color: 'bg-amber-50 text-amber-600 border-amber-100',
                title: 'Automatización e Integraciones',
                desc: 'API abierta para conectar con sistemas MIS, webs de impresión y ERP propios. Actualizaciones automáticas gestionadas por HP — sin mantenimiento de servidor, sin coste de actualización.',
              },
            ].map(({ icon: Icon, color, title, desc }, i) => (
              <div key={i} className={`rounded-xl p-4 border bg-white shadow-sm hover:shadow-md transition-shadow`}>
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3 ${color}`}>
                  <Icon size={18} />
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1.5">{title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Comparativa rápida */}
          <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-4 bg-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className="px-4 py-2.5">Función</div>
              <div className="px-4 py-2.5 text-center">Roland</div>
              <div className="px-4 py-2.5 text-center">Mimaki</div>
              <div className="px-4 py-2.5 text-center text-sky-600">HP Latex</div>
            </div>
            {[
              { fn: 'Monitorización remota (cloud)', roland: '⚠ Básico (local)', mimaki: '⚠ PICT (limitado)', hp: '✅ PrintOS Live' },
              { fn: 'Analíticas de producción', roland: '❌ No', mimaki: '⚠ Parcial', hp: '✅ Print Beat' },
              { fn: 'Recepción automatizada de archivos', roland: '❌ No', mimaki: '❌ No', hp: '✅ PrintOS Box' },
              { fn: 'API abierta para integraciones', roland: '❌ No', mimaki: '❌ No', hp: '✅ Incluida' },
              { fn: 'Coste de software de gestión', roland: '💰 Con licencia RIP', mimaki: '💰 RasterLink incluido', hp: '✅ Gratis (cloud)' },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-4 text-xs border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="px-4 py-3 font-medium text-gray-700">{row.fn}</div>
                <div className="px-4 py-3 text-center text-gray-500">{row.roland}</div>
                <div className="px-4 py-3 text-center text-gray-500">{row.mimaki}</div>
                <div className="px-4 py-3 text-center font-semibold text-sky-700">{row.hp}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Technical;
