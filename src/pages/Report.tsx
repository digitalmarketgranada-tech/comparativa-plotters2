import React, { useRef, useState } from 'react';
import { useData, ALL_MACHINES } from '../context/DataContext';
import {
  Download, TrendingUp, Euro, Clock, Leaf, Monitor, BarChart3,
  CheckCircle, AlertTriangle, Award, Users, MapPin, Phone,
  ShieldCheck, Zap, Star, Building2,
} from 'lucide-react';
import GlowButton from '../components/GlowButton';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// ─── Paleta de colores fija para el PDF ───────────────────────────────────────
const C = {
  gray:    { 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 900: '#111827' },
  emerald: { 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 500: '#10b981', 600: '#059669', 700: '#047857' },
  sky:     { 50: '#f0f9ff', 200: '#bae6fd', 600: '#0284c7', 700: '#0369a1' },
  rose:    { 50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 400: '#fb7185', 600: '#e11d48' },
  amber:   { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 600: '#d97706', 700: '#b45309' },
  violet:  { 50: '#f5f3ff', 200: '#ddd6fe', 700: '#7c3aed' },
  blue:    { 50: '#eff6ff', 200: '#bfdbfe', 700: '#1d4ed8', 900: '#1e3a8a' },
  orange:  { 50: '#fff7ed', 200: '#fed7aa', 600: '#ea580c' },
};

const Report: React.FC = () => {
  const { data, results } = useData();
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const fc = (val: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  const fc2 = (val: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

  const machineA = ALL_MACHINES.find(m => m.model === data.machineAModel);
  const machineB = ALL_MACHINES.find(m => m.model === data.machineBModel);

  const inkA = results.inkCostPerM2A || data.machineAInkCost;
  const inkB = results.inkCostPerM2B || data.machineBInkCost;
  const tcoSaving = results.tcoSavingsMonthly || 0;
  const payback = results.paybackMonthsTCO;
  const roiOk = (results.machineBNetProfit || 0) >= (results.machineAProfit || 0);
  const rentingCoversRatio = results.monthlyRentingQuota > 0 ? tcoSaving / results.monthlyRentingQuota : 0;
  const volB = data.monthlyVolume * (1 + (data.growthRate || 0));

  // Argumentario comercial según sector
  const sectorApplications: Record<string, string[]> = {
    'Decoración interior':    ['Papel pintado digital', 'Vinilo decorativo sin olor', 'Paneles acústicos', 'Murales y fotomurales', 'Proyectos hospitales y colegios (GREENGUARD Gold)'],
    'Retail y punto de venta': ['PLV y displays sin emisiones', 'Señalética interior premium', 'Proyectos para grandes superficies', 'Fondos y ambientación de escaparates'],
    'Rotulación y señalización': ['Señalética exterior duradera', 'Vinilos de vehículos', 'Banners y lonas sin desgasificación', 'Señalización hospitalaria certificada'],
    'Publicidad exterior':    ['Lonas gran formato', 'Banners UV estables', 'Cartelería sin tiempos de espera', 'Producción de alta velocidad'],
    'Textil y moda':          ['Textil sin olor para moda', 'Transfer y sublimación', 'Accesorios y bolsería', 'Pop-up y stands ecológicos'],
    'Fotografía y arte':       ['Impresión fine-art', 'Reproducciones fotográficas', 'Tirajes limitados', 'Canvas y papel fotográfico'],
  };

  const applications = data.clientSector
    ? (sectorApplications[data.clientSector] || sectorApplications['Rotulación y señalización'])
    : sectorApplications['Rotulación y señalización'];

  const handleDownloadPdf = async () => {
    setDownloading(true);
    if (!reportRef.current) { setDownloading(false); return; }
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, useCORS: true, backgroundColor: '#ffffff',
        windowWidth: reportRef.current.scrollWidth,
        windowHeight: reportRef.current.scrollHeight,
      });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/png', 1.0);
      let yPos = 0;
      const pageHeight = 297;
      while (yPos < imgHeight) {
        if (yPos > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -yPos, imgWidth, imgHeight, undefined, 'FAST');
        yPos += pageHeight;
      }
      const clientSlug = data.clientCompany ? `_${data.clientCompany.replace(/\s+/g, '_')}` : '';
      pdf.save(`Informe_ROI_DM${clientSlug}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Error generando PDF:', err);
      alert('Error al generar el PDF.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Informe Final</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Generado el {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
            {data.clientCompany && <span className="ml-2 text-blue-600 font-semibold">· {data.clientCompany}</span>}
          </p>
        </div>
        <GlowButton onClick={handleDownloadPdf} disabled={downloading} size="md" variant="cyan-indigo">
          <Download size={15} />
          {downloading ? 'Generando PDF…' : 'Descargar PDF'}
        </GlowButton>
      </div>

      {/* ══════════════ CONTENIDO DEL INFORME ══════════════ */}
      <div
        ref={reportRef}
        className="space-y-6 bg-white p-8 rounded-2xl border shadow-sm"
        style={{ backgroundColor: '#ffffff', borderColor: C.gray[100] }}
      >

        {/* ── CABECERA ── */}
        <div className="flex items-start justify-between pb-5 border-b-2" style={{ borderBottomColor: C.blue[900] }}>
          <div className="flex items-center gap-4">
            <img src="/assets/logo-dm.png" alt="Digital Market" className="h-12 w-auto" onError={e => (e.currentTarget.style.display = 'none')} />
            <div>
              <h2 className="text-xl font-black leading-tight" style={{ color: C.gray[900] }}>Informe de Viabilidad — Cambio a HP Latex</h2>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.gray[500] }}>Análisis TCO personalizado · Digital Market</p>
            </div>
          </div>
          <div className="text-right text-xs" style={{ color: C.gray[400] }}>
            <p className="font-black text-sm mb-0.5" style={{ color: C.blue[900] }}>Digital Market</p>
            <p>Líderes en HP Latex en España</p>
            <p>8 años de experiencia · Servicio técnico propio</p>
            <p className="mt-1 font-semibold">digital-market.es</p>
            <p>{new Date().toLocaleDateString('es-ES')}</p>
          </div>
        </div>

        {/* ── DATOS DEL CLIENTE ── */}
        {(data.clientCompany || data.clientName || data.clientSector) && (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: C.blue[200], backgroundColor: C.blue[50] }}>
            <div className="px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white" style={{ backgroundColor: C.blue[700] }}>
              Preparado para
            </div>
            <div className="p-4 flex flex-wrap gap-6">
              {data.clientCompany && (
                <div className="flex items-center gap-2">
                  <Building2 size={15} style={{ color: C.blue[700] }} />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Empresa</p>
                    <p className="font-black text-gray-900">{data.clientCompany}</p>
                  </div>
                </div>
              )}
              {data.clientName && (
                <div className="flex items-center gap-2">
                  <Users size={15} style={{ color: C.blue[700] }} />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Contacto</p>
                    <p className="font-bold text-gray-800">{data.clientName}</p>
                  </div>
                </div>
              )}
              {data.clientSector && (
                <div className="flex items-center gap-2">
                  <Star size={15} style={{ color: C.blue[700] }} />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Sector</p>
                    <p className="font-bold text-gray-800">{data.clientSector}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SECCIÓN 1: RESUMEN EJECUTIVO ── */}
        <div style={{ backgroundColor: C.blue[900], borderRadius: 12, padding: '20px 24px' }}>
          <h3 className="text-white font-black text-base mb-3">Resumen Ejecutivo</h3>
          <p className="text-sm leading-relaxed" style={{ color: '#bfdbfe' }}>
            {data.clientCompany ? `${data.clientCompany} trabaja` : 'El cliente trabaja'} actualmente con una{' '}
            <strong className="text-white">{data.machineAModel}</strong>{' '}
            ({machineA?.technology === 'latex' ? 'látex' : 'eco-solvente'}) que implica un coste de tinta de{' '}
            <strong className="text-white">{fc2(inkA)}/m²</strong>{' '}
            y un coste operativo mensual de <strong className="text-white">{fc(results.machineACost)}</strong>.
          </p>
          <p className="text-sm leading-relaxed mt-2" style={{ color: '#bfdbfe' }}>
            La solución propuesta{' '}
            <strong className="text-white">{data.machineBModel}</strong>{' '}
            de Digital Market reduce el coste de tinta a <strong className="text-white">{fc2(inkB)}/m²</strong>{' '}
            y el TCO mensual total (operativo + amortización + cabezales) en{' '}
            <strong className="text-white">{fc(tcoSaving)}/mes</strong>{' '}
            ({fc(tcoSaving * 12)}/año).
            {isFinite(payback) && payback > 0 && (
              <> La inversión se recupera en aproximadamente <strong className="text-white">{payback.toFixed(1)} meses</strong>.</>
            )}
            {(data.growthRate || 0) > 0 && (
              <> En el escenario de crecimiento, HP Latex puede producir hasta un <strong className="text-white">{((data.growthRate || 0) * 100).toFixed(0)}% más</strong> de m² gracias a su mayor velocidad y secado instantáneo.</>
            )}
          </p>
        </div>

        {/* ── SECCIÓN 2: KPIs CLAVE ── */}
        <div>
          <SectionTitle icon={TrendingUp} label="Resultados Clave" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <KpiCard label="Ahorro TCO Anual" value={fc(results.tcoSavingsAnnual || 0)} sub="incl. amortiz. + cabezales" color="emerald" />
            <KpiCard label="Ahorro Operativo" value={fc(results.annualSavings)} sub="costes de producción" color="sky" />
            <KpiCard label="Payback Real" value={isFinite(payback) ? `${payback.toFixed(1)} m.` : '—'} sub="amortización inversión TCO" color="violet" />
            <KpiCard label="Tiempo Liberado" value={`${Math.round(results.productionTimeSavings * 12)}h/año`} sub="sin esperas de secado" color="amber" />
          </div>
        </div>

        {/* ── SECCIÓN 3: DATOS DEL ANÁLISIS ── */}
        <div>
          <SectionTitle icon={Monitor} label="Datos Introducidos en el Análisis" />
          <div className="grid md:grid-cols-2 gap-4 mt-3">
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: C.gray[50], borderColor: C.gray[200] }}>
              <div className="text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider" style={{ backgroundColor: C.rose[600] }}>
                Máquina A — {machineA?.brand ?? ''} (Actual)
              </div>
              <div className="p-4 space-y-2">
                <DataRow label="Modelo" value={data.machineAModel} />
                <DataRow label="Volumen mensual" value={`${data.monthlyVolume} m²/mes`} />
                <DataRow label="Velocidad" value={`${data.machineASpeed} m²/h`} />
                <DataRow label="Tinta €/litro" value={`${data.machineAInkPricePerLiter || '—'}€/l`} />
                <DataRow label="Consumo tinta" value={`${data.machineAInkMlPerM2 || '—'} ml/m²`} />
                <DataRow label="Coste tinta" value={`${fc2(inkA)}/m²`} highlight="rose" />
                <DataRow label="Mantenimiento" value={`${data.machineAMaintenance}h/semana`} />
                <DataRow label="Secado" value={data.machineADryTime === 0 ? '0h — instantáneo' : `${data.machineADryTime}h`} highlight={data.machineADryTime === 0 ? 'emerald' : 'rose'} />
                <DataRow label="Cabezales/mes" value={`${fc(data.machineAHeadCostMonthly || 0)}`} highlight={((data.machineAHeadCostMonthly || 0) > 50) ? 'rose' : 'emerald'} />
                <DataRow label="Precio compra" value={fc(data.machineAPrice)} />
                <DataRow label="Vida útil" value={`${data.machineALifetimeYears || '—'} años`} />
              </div>
            </div>
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: C.gray[50], borderColor: C.gray[200] }}>
              <div className="text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider" style={{ backgroundColor: C.sky[600] }}>
                Máquina B — {machineB?.brand ?? ''} (Propuesta Digital Market)
              </div>
              <div className="p-4 space-y-2">
                <DataRow label="Modelo" value={data.machineBModel} />
                <DataRow label="Volumen con crecimiento" value={`${volB} m²/mes${(data.growthRate || 0) > 0 ? ` (+${((data.growthRate || 0) * 100).toFixed(0)}%)` : ''}`} highlight={(data.growthRate || 0) > 0 ? 'emerald' : undefined} />
                <DataRow label="Velocidad" value={`${data.machineBSpeed} m²/h`} highlight="sky" />
                <DataRow label="Tinta €/litro" value={`${data.machineBInkPricePerLiter || '—'}€/l`} />
                <DataRow label="Consumo tinta" value={`${data.machineBInkMlPerM2 || '—'} ml/m²`} />
                <DataRow label="Coste tinta" value={`${fc2(inkB)}/m²`} highlight="emerald" />
                <DataRow label="Mantenimiento" value={`${data.machineBMaintenance}h/semana`} highlight={data.machineBMaintenance === 0 ? 'emerald' : undefined} />
                <DataRow label="Secado" value={data.machineBDryTime === 0 ? '0h — instantáneo' : `${data.machineBDryTime}h`} highlight={data.machineBDryTime === 0 ? 'emerald' : 'rose'} />
                <DataRow label="Cabezales/mes" value={`${fc(data.machineBHeadCostMonthly || 0)}`} highlight={((data.machineBHeadCostMonthly || 0) <= 25) ? 'emerald' : 'rose'} />
                <DataRow label="Precio compra" value={fc(data.machineBPrice)} />
                <DataRow label="Vida útil" value={`${data.machineBLifetimeYears || '—'} años`} />
              </div>
            </div>
          </div>

          {/* Mix de producción */}
          <div className="mt-3 rounded-xl border overflow-hidden" style={{ backgroundColor: C.gray[50], borderColor: C.gray[200] }}>
            <div className="text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider" style={{ backgroundColor: C.gray[700] }}>
              Mix de Producción y Precios de Venta
            </div>
            <div className="p-4 grid md:grid-cols-4 gap-4">
              <DataRow label="Lona %" value={`${data.lonaPercentage}%`} />
              <DataRow label="PVP Lona" value={`${fc2(data.lonaSellPrice)}/m²`} />
              <DataRow label="Vinilo %" value={`${data.viniloPercentage}%`} />
              <DataRow label="PVP Vinilo" value={`${fc2(data.viniloSellPrice)}/m²`} />
            </div>
          </div>
        </div>

        {/* ── SECCIÓN 4: TCO COMPARATIVA ── */}
        <div>
          <SectionTitle icon={Euro} label="Comparativa TCO Mensual Completa" />
          <div className="mt-3 rounded-xl border overflow-hidden" style={{ borderColor: C.gray[200] }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ backgroundColor: C.gray[100], borderBottomColor: C.gray[200] }}>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase w-1/2">Concepto</th>
                  <th className="text-right px-4 py-3 text-xs font-bold uppercase" style={{ color: C.rose[400] }}>Máquina A</th>
                  <th className="text-right px-4 py-3 text-xs font-bold uppercase" style={{ color: C.sky[600] }}>Máquina B (HP)</th>
                  <th className="text-right px-4 py-3 text-xs font-bold uppercase" style={{ color: C.emerald[600] }}>Ahorro</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="bg-white">
                  <td className="px-4 py-3 text-gray-700">Ventas estimadas</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">{fc(results.monthlyRevenue)}</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">{fc(results.monthlyRevenueB || results.monthlyRevenue)}</td>
                  <td className="px-4 py-3 text-right" style={{ color: (data.growthRate || 0) > 0 ? C.emerald[600] : C.gray[400] }}>
                    {(data.growthRate || 0) > 0 ? `+${fc((results.monthlyRevenueB || 0) - results.monthlyRevenue)}` : '—'}
                  </td>
                </tr>
                <tr style={{ backgroundColor: C.gray[50] }}>
                  <td className="px-4 py-3 text-gray-700">Costes operativos (tinta + operario + esperas)</td>
                  <td className="px-4 py-3 text-right font-bold" style={{ color: C.rose[600] }}>−{fc(results.machineACost)}</td>
                  <td className="px-4 py-3 text-right font-bold" style={{ color: C.emerald[600] }}>−{fc(results.machineBCost)}</td>
                  <td className="px-4 py-3 text-right font-bold" style={{ color: results.monthlySavings > 0 ? C.emerald[600] : C.rose[600] }}>
                    {results.monthlySavings > 0 ? '+' : ''}{fc(results.monthlySavings)}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 text-gray-700">Coste cabezales/mes</td>
                  <td className="px-4 py-3 text-right font-bold" style={{ color: C.orange[600] }}>−{fc(data.machineAHeadCostMonthly || 0)}</td>
                  <td className="px-4 py-3 text-right font-bold" style={{ color: C.emerald[600] }}>−{fc(data.machineBHeadCostMonthly || 0)}</td>
                  <td className="px-4 py-3 text-right font-bold" style={{ color: (data.machineAHeadCostMonthly || 0) > (data.machineBHeadCostMonthly || 0) ? C.emerald[600] : C.rose[600] }}>
                    +{fc((data.machineAHeadCostMonthly || 0) - (data.machineBHeadCostMonthly || 0))}
                  </td>
                </tr>
                <tr style={{ backgroundColor: C.gray[50] }}>
                  <td className="px-4 py-3 text-gray-700">Amortización mensual</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-600">−{fc(results.machineAAmortizationMonthly || 0)}</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-600">−{fc(results.machineBAmortizationMonthly || 0)}</td>
                  <td className="px-4 py-3 text-right font-bold" style={{ color: (results.machineAAmortizationMonthly || 0) > (results.machineBAmortizationMonthly || 0) ? C.emerald[600] : C.gray[500] }}>
                    {((results.machineAAmortizationMonthly || 0) - (results.machineBAmortizationMonthly || 0)) >= 0 ? '+' : ''}{fc((results.machineAAmortizationMonthly || 0) - (results.machineBAmortizationMonthly || 0))}
                  </td>
                </tr>
                <tr className="border-t-2" style={{ backgroundColor: tcoSaving > 0 ? C.emerald[50] : C.sky[50], borderTopColor: C.gray[200] }}>
                  <td className="px-4 py-3 font-black text-gray-900">AHORRO TCO TOTAL MENSUAL</td>
                  <td className="px-4 py-3 text-right font-black" style={{ color: C.rose[600] }}>{fc(results.monthlyTCO_A || 0)}</td>
                  <td className="px-4 py-3 text-right font-black text-xl" style={{ color: C.sky[600] }}>{fc(results.monthlyTCO_B || 0)}</td>
                  <td className="px-4 py-3 text-right font-black text-xl" style={{ color: tcoSaving > 0 ? C.emerald[600] : C.rose[600] }}>
                    {tcoSaving > 0 ? '+' : ''}{fc(tcoSaving)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financiación */}
          <div className="mt-3 rounded-xl border overflow-hidden" style={{ backgroundColor: C.amber[50], borderColor: C.amber[200] }}>
            <div className="px-4 py-2 text-xs font-black uppercase tracking-wider" style={{ color: C.amber[700] }}>
              Condiciones de Financiación (Renting Máquina B)
            </div>
            <div className="p-4 grid md:grid-cols-4 gap-4">
              <DataRow label="Precio" value={fc(data.machineBPrice)} />
              <DataRow label="Plazo" value={`${data.rentingMonths} meses`} />
              <DataRow label="Interés" value={`${data.rentingInterest}%`} />
              <DataRow label="Cuota mensual" value={fc(results.monthlyRentingQuota)} highlight="amber" />
            </div>
          </div>

          {/* Nota ROI */}
          <div className="mt-3 rounded-xl p-4 flex gap-3 border"
            style={{ backgroundColor: roiOk ? C.emerald[50] : C.sky[50], borderColor: roiOk ? C.emerald[200] : C.sky[200] }}>
            {roiOk
              ? <CheckCircle style={{ color: C.emerald[600] }} className="flex-shrink-0 mt-0.5" size={18} />
              : <AlertTriangle style={{ color: C.sky[600] }} className="flex-shrink-0 mt-0.5" size={18} />}
            <p className="text-sm text-gray-700 leading-relaxed">
              {roiOk
                ? <><strong>La máquina se paga sola:</strong> El ahorro TCO ({fc(tcoSaving)}/mes) cubre la cuota de financiación ({fc(results.monthlyRentingQuota)}/mes) con un excedente de <strong style={{ color: C.emerald[600] }}>{fc(tcoSaving - results.monthlyRentingQuota)}/mes</strong>.</>
                : <><strong>El ahorro operativo ({fc(results.monthlySavings)}/mes)</strong> no cubre íntegramente la cuota ({fc(results.monthlyRentingQuota)}/mes). La diferencia de {fc(results.monthlyRentingQuota - results.monthlySavings)}/mes se recupera con <strong>mayor capacidad productiva</strong> (secado instantáneo, más trabajos posibles) y nuevas aplicaciones de mercado.</>}
            </p>
          </div>
        </div>

        {/* ── SECCIÓN 5: PROYECCIÓN 5 AÑOS ── */}
        {results.yearlyData && results.yearlyData.length > 0 && (
          <div>
            <SectionTitle icon={BarChart3} label="Proyección de Beneficio — 5 Años" />
            <div className="mt-3 rounded-xl border overflow-hidden" style={{ borderColor: C.gray[200] }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: C.gray[100] }}>
                    <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Año</th>
                    <th className="text-right px-4 py-2.5 text-xs font-bold uppercase" style={{ color: C.rose[400] }}>Benef. A</th>
                    <th className="text-right px-4 py-2.5 text-xs font-bold uppercase" style={{ color: C.sky[600] }}>Benef. B</th>
                    <th className="text-right px-4 py-2.5 text-xs font-bold uppercase" style={{ color: C.gray[500] }}>Acum. A</th>
                    <th className="text-right px-4 py-2.5 text-xs font-bold uppercase" style={{ color: C.sky[600] }}>Acum. B</th>
                    <th className="text-right px-4 py-2.5 text-xs font-bold uppercase" style={{ color: C.emerald[600] }}>Ventaja B</th>
                  </tr>
                </thead>
                <tbody>
                  {results.yearlyData.map((d, i) => {
                    const adv = d.cumProfitB - d.cumProfitA;
                    return (
                      <tr key={d.year} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : C.gray[50] }}>
                        <td className="px-4 py-2.5 font-bold text-gray-700">Año {d.year}</td>
                        <td className="px-4 py-2.5 text-right text-gray-700">{fc(d.profitA)}</td>
                        <td className="px-4 py-2.5 text-right text-gray-700">{fc(d.profitB)}</td>
                        <td className="px-4 py-2.5 text-right font-semibold" style={{ color: d.cumProfitA >= 0 ? C.gray[700] : C.rose[600] }}>{fc(d.cumProfitA)}</td>
                        <td className="px-4 py-2.5 text-right font-bold" style={{ color: d.cumProfitB >= 0 ? C.sky[700] : C.rose[600] }}>{fc(d.cumProfitB)}</td>
                        <td className="px-4 py-2.5 text-right font-black" style={{ color: adv >= 0 ? C.emerald[600] : C.rose[600] }}>
                          {adv >= 0 ? '+' : ''}{fc(adv)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {(() => {
              const lastYear = results.yearlyData[results.yearlyData.length - 1];
              const totalAdv = lastYear.cumProfitB - lastYear.cumProfitA;
              return (
                <div className="mt-3 rounded-xl p-4 border" style={{ backgroundColor: totalAdv > 0 ? C.emerald[50] : C.gray[50], borderColor: totalAdv > 0 ? C.emerald[200] : C.gray[200] }}>
                  <p className="text-sm text-gray-700">
                    <strong>En 5 años</strong>, {data.clientCompany ? data.clientCompany : 'el cliente'} obtiene{' '}
                    <strong style={{ color: totalAdv > 0 ? C.emerald[600] : C.rose[600] }}>{totalAdv >= 0 ? '+' : ''}{fc(totalAdv)}</strong>{' '}
                    {totalAdv > 0 ? 'más de beneficio acumulado' : 'menos de beneficio acumulado'} con HP Latex frente a mantener la máquina actual.
                  </p>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── SECCIÓN 6: FLUJO DE TRABAJO ── */}
        <div>
          <SectionTitle icon={Clock} label="Ventaja en Flujo de Trabajo" />
          <div className="mt-3 grid md:grid-cols-2 gap-4">
            <div className="border rounded-xl overflow-hidden" style={{ borderColor: C.rose[100] }}>
              <div className="px-4 py-2.5 text-xs font-black uppercase" style={{ backgroundColor: C.rose[50], color: C.rose[600] }}>
                Proceso Actual — {machineA?.brand}
              </div>
              <div className="p-4 space-y-2 text-sm">
                <FlowStep num={1} label="Impresión" detail={`${data.machineASpeed} m²/h`} bad={data.machineADryTime > 0} />
                <FlowStep num={2} label={data.machineADryTime > 0 ? `Espera de secado — ${data.machineADryTime}h` : 'Secado instantáneo'} detail={data.machineADryTime > 0 ? 'Flujo bloqueado — no se puede cortar ni laminar' : 'Sin esperas'} bad={data.machineADryTime > 0} />
                <FlowStep num={3} label="Laminado / Acabado" detail={data.machineADryTime > 0 ? 'Solo posible tras secado completo' : 'Posible inmediatamente'} bad={data.machineADryTime > 0} />
                <FlowStep num={4} label="Entrega" detail={data.machineADryTime > 0 ? 'Mínimo 26-52h desde inicio' : '2-5h desde inicio'} bad={data.machineADryTime > 0} />
                {data.machineAMaintenance > 0 && (
                  <div className="mt-2 rounded-lg p-2 border" style={{ backgroundColor: C.orange[50], borderColor: C.orange[200] }}>
                    <p className="text-xs font-bold" style={{ color: C.orange[600] }}>+{data.machineAMaintenance}h/semana de mantenimiento manual</p>
                  </div>
                )}
              </div>
            </div>
            <div className="border-2 rounded-xl overflow-hidden" style={{ borderColor: C.emerald[200] }}>
              <div className="text-white px-4 py-2.5 text-xs font-black uppercase" style={{ backgroundColor: C.emerald[600] }}>
                Proceso HP Latex — Secado Instantáneo
              </div>
              <div className="p-4 space-y-2 text-sm">
                <FlowStep num={1} label={`Impresión ${data.machineBSpeed} m²/h`} detail="Sin emisiones. Sin olor. Listo al salir." ok />
                <FlowStep num={2} label="Acabado inmediato" detail="Corte, laminado o instalación sin espera" ok />
                <FlowStep num={3} label="Laminado directo" detail="Posible nada más terminar la impresión" ok />
                <FlowStep num={4} label="Entrega en el día" detail="Flujo optimizado para urgencias y calidad premium" ok />
                {data.machineBMaintenance === 0 && (
                  <div className="mt-2 rounded-lg p-2 border" style={{ backgroundColor: C.emerald[50], borderColor: C.emerald[200] }}>
                    <p className="text-xs font-bold" style={{ color: C.emerald[600] }}>0h/semana de mantenimiento manual — sistema automático HP</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECCIÓN 7: NUEVAS OPORTUNIDADES ── */}
        <div>
          <SectionTitle icon={Zap} label={`Nuevas Oportunidades de Negocio${data.clientSector ? ` para ${data.clientSector}` : ''}`} />
          <div className="mt-3 grid md:grid-cols-3 gap-3">
            {applications.map((app, i) => (
              <div key={i} className="rounded-xl border p-3 flex items-start gap-2" style={{ backgroundColor: C.emerald[50], borderColor: C.emerald[200] }}>
                <CheckCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color: C.emerald[600] }} />
                <p className="text-xs font-semibold text-gray-700">{app}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl border p-4" style={{ backgroundColor: C.violet[50], borderColor: C.violet[200] }}>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong style={{ color: C.violet[700] }}>Con HP Latex, {data.clientCompany ? data.clientCompany : 'tu empresa'} puede acceder a mercados que la máquina actual no puede servir.</strong>{' '}
              Gracias a la tecnología de base agua y sus certificaciones ambientales (GREENGUARD Gold, UL ECOLOGO),
              es posible trabajar en espacios con requisitos estrictos: hospitales, colegios, retail premium y cualquier
              proyecto que exija bajas emisiones. Esto abre contratos nuevos sin inversión adicional.
            </p>
          </div>
        </div>

        {/* ── SECCIÓN 8: SOSTENIBILIDAD Y CERTIFICACIONES ── */}
        {machineB?.technology === 'latex' && (
          <div>
            <SectionTitle icon={Leaf} label="Sostenibilidad y Certificaciones HP Latex" />
            <div className="mt-3 grid md:grid-cols-3 gap-3">
              {[
                { badge: 'GREENGUARD Gold', desc: 'Apto para instalación en escuelas, hospitales e interiores sensibles. Certificado UL.' },
                { badge: 'UL ECOLOGO', desc: 'Tinta base agua. Sin COVs, sin olores. No requiere ventilación forzada.' },
                { badge: 'ENERGY STAR / EPEAT', desc: 'Menor consumo energético certificado. Cartuchos reciclables HP.' },
              ].map(({ badge, desc }) => (
                <div key={badge} className="rounded-xl border p-4" style={{ backgroundColor: C.emerald[50], borderColor: C.emerald[200] }}>
                  <span className="inline-block text-[10px] font-black text-white px-2 py-0.5 rounded mb-2 uppercase" style={{ backgroundColor: C.emerald[600] }}>{badge}</span>
                  <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2 italic">* Las funciones de certificación dependen del modelo específico contratado.</p>
          </div>
        )}

        {/* ── SECCIÓN 9: POR QUÉ DIGITAL MARKET ── */}
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: C.blue[200] }}>
          <div className="text-white px-5 py-4" style={{ backgroundColor: C.blue[900] }}>
            <div className="flex items-center gap-3 mb-1">
              <Award size={20} className="text-amber-400" />
              <h3 className="font-black text-lg">Por qué Digital Market</h3>
            </div>
            <p className="text-blue-200 text-sm">No solo cambia de máquina — cambia de socio tecnológico</p>
          </div>
          <div className="p-5 grid md:grid-cols-2 gap-4" style={{ backgroundColor: C.blue[50] }}>
            {[
              { icon: Star, title: '8 años líderes en España', desc: 'El distribuidor nº 1 de HP Latex en España durante 8 años consecutivos. Experiencia real en el terreno, no solo en el papel.' },
              { icon: ShieldCheck, title: 'Servicio técnico propio', desc: 'Técnicos especializados en HP Latex en territorio. Tiempos de respuesta cortos. Stock de recambios. Sin esperas de semanas.' },
              { icon: MapPin, title: 'Presencia local', desc: 'No somos un canal de venta remoto. Estamos aquí, acompañamos cada instalación y formamos al equipo en las instalaciones del cliente.' },
              { icon: Phone, title: 'Acompañamiento comercial', desc: 'Te ayudamos a definir tu estrategia de producto, precios y mercados. Somos socios de negocio, no solo proveedores de equipos.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-4 border border-blue-100 flex gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: C.blue[700] }}>
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm mb-1">{title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONCLUSIÓN / LLAMADA A LA ACCIÓN ── */}
        <div className="rounded-xl p-5 border" style={{ backgroundColor: C.emerald[50], borderColor: C.emerald[200] }}>
          <h3 className="font-black text-gray-900 mb-2">Recomendación Digital Market</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {data.clientCompany ? `Recomendamos a ${data.clientCompany}` : 'Recomendamos al cliente'} la renovación de su equipo actual{' '}
            por <strong>{data.machineBModel}</strong>. Con un ahorro TCO de <strong style={{ color: C.emerald[700] }}>{fc(tcoSaving)}/mes</strong>{' '}
            ({fc(tcoSaving * 12)}/año),
            {isFinite(payback) && payback > 0 ? ` payback real de ${payback.toFixed(1)} meses, ` : ' '}
            y la apertura de nuevos mercados certificados, esta inversión genera valor desde el primer año.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mt-2">
            <strong>Digital Market estará encantado de visitar las instalaciones</strong> para ajustar este estudio a la realidad de la producción y presentar una propuesta de financiación personalizada.
          </p>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t flex justify-between items-center text-xs text-gray-400" style={{ borderTopColor: C.gray[200] }}>
          <p>Digital Market · Líderes en HP Latex en España desde 2017 · <span className="font-bold">digital-market.es</span></p>
          <p>Informe generado automáticamente · Comparador ROI DM</p>
        </div>

      </div>
    </div>
  );
};

// ─── Componentes auxiliares ───────────────────────────────────────────────────

const SectionTitle: React.FC<{ icon: React.ElementType; label: string }> = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 mb-1">
    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#111827' }}>
      <Icon size={13} className="text-white" />
    </div>
    <h3 className="font-black text-gray-900 text-base">{label}</h3>
  </div>
);

const KpiCard: React.FC<{ label: string; value: string; sub: string; color: string }> = ({ label, value, sub, color }) => {
  const map: Record<string, { bg: string; border: string; text: string }> = {
    emerald: { bg: C.emerald[50], border: C.emerald[200], text: C.emerald[700] },
    sky:     { bg: C.sky[50],     border: C.sky[200],     text: C.sky[700] },
    amber:   { bg: C.amber[50],   border: C.amber[200],   text: C.amber[700] },
    violet:  { bg: C.violet[50],  border: C.violet[200],  text: C.violet[700] },
    rose:    { bg: C.rose[50],    border: C.rose[200],    text: C.rose[600] },
  };
  const s = map[color] || map.emerald;
  return (
    <div className="rounded-xl border p-4" style={{ backgroundColor: s.bg, borderColor: s.border }}>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black leading-tight" style={{ color: s.text }}>{value}</p>
      <p className="text-[10px] text-gray-400 mt-1">{sub}</p>
    </div>
  );
};

const DataRow: React.FC<{ label: string; value: string; highlight?: string }> = ({ label, value, highlight }) => {
  const color = highlight === 'rose' ? C.rose[600] : highlight === 'emerald' ? C.emerald[600] : highlight === 'sky' ? C.sky[600] : highlight === 'amber' ? C.amber[600] : undefined;
  return (
    <div className="flex justify-between items-baseline gap-2">
      <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-xs text-right font-semibold" style={color ? { color, fontWeight: 700 } : {}}>{value}</span>
    </div>
  );
};

const FlowStep: React.FC<{ num: number; label: string; detail: string; ok?: boolean; bad?: boolean }> = ({ num, label, detail, ok, bad }) => {
  const circleBg = ok ? C.emerald[500] : bad ? C.rose[400] : C.gray[200];
  const textColor = ok ? C.emerald[700] : bad ? C.rose[700] : C.gray[700];
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5"
        style={{ backgroundColor: circleBg, color: ok || bad ? '#ffffff' : C.gray[500] }}>
        {num}
      </div>
      <div>
        <p className="text-xs font-bold leading-tight" style={{ color: textColor }}>{label}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{detail}</p>
      </div>
    </div>
  );
};

export default Report;
