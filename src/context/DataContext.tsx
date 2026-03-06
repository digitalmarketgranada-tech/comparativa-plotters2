import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── Machine Model ────────────────────────────────────────────────────────────
export interface Machine {
  brand: string;
  model: string;
  technology: 'latex' | 'eco-solvent' | 'uv';
  printWidthMm: number;
  printSpeed: number;           // m²/h
  inkPricePerLiter: number;     // €/litro
  inkMlPerM2: number;           // ml/m² consumo medio
  inkCostPerM2: number;         // €/m² calculado = inkPricePerLiter * inkMlPerM2 / 1000
  weeklyMaintenance: number;    // h/semana
  dryTimeHours: number;         // horas secado (0 = instantáneo)
  referencePrice: number;       // € precio de compra orientativo
  lifetimeYears: number;        // vida útil en años
  residualValue: number;        // € valor residual al final de vida
  headCostAnnual: number;       // € coste anual cabezales (amortizado)
  certifications: string[];
}

// Helper para calcular inkCostPerM2
const ink = (pricePerL: number, mlPerM2: number) =>
  Math.round((pricePerL * mlPerM2 / 1000) * 100) / 100;

export const ALL_MACHINES: Machine[] = [
  // ── HP Latex ─────────────────────────────────────────────────────────────
  // Precios tinta: datos oficiales HP España (Mayo FY2025, PVR sin IVA)
  // HP 831C 775ml (series 3xx/5xx) → €177/L | HP 832 1L (630/700) → €118/L
  // HP 873 3L (800) → €91/L | HP 883 5L (FS50) → €64/L | HP 893 10L (FS60) → €52/L
  // HP 872 3L (R1000) → €84/L | HP 882 5L (R2000) → €71/L | HP 881 5L (L1500) → €86/L

  // HP Latex 335 — entrada Gen3, 1300mm, tinta HP 831C 775ml
  {
    brand: 'HP Latex', model: 'HP Latex 335', technology: 'latex',
    printWidthMm: 1300, printSpeed: 22,
    inkPricePerLiter: 177, inkMlPerM2: 12, inkCostPerM2: ink(177, 12),
    weeklyMaintenance: 0, dryTimeHours: 0,
    referencePrice: 8500, lifetimeYears: 7, residualValue: 850, headCostAnnual: 150,
    certifications: ['GREENGUARD Gold', 'UL ECOLOGO', 'ENERGY STAR'],
  },
  // HP Latex 365 — entrada Gen3, 1300mm, tinta HP 831C 775ml
  {
    brand: 'HP Latex', model: 'HP Latex 365', technology: 'latex',
    printWidthMm: 1300, printSpeed: 28,
    inkPricePerLiter: 177, inkMlPerM2: 12, inkCostPerM2: ink(177, 12),
    weeklyMaintenance: 0, dryTimeHours: 0,
    referencePrice: 12000, lifetimeYears: 7, residualValue: 1200, headCostAnnual: 150,
    certifications: ['GREENGUARD Gold', 'UL ECOLOGO', 'ENERGY STAR'],
  },
  // HP Latex 560 — media gama Gen3, 1520mm, tinta HP 831C 775ml
  {
    brand: 'HP Latex', model: 'HP Latex 560', technology: 'latex',
    printWidthMm: 1520, printSpeed: 30,
    inkPricePerLiter: 177, inkMlPerM2: 12, inkCostPerM2: ink(177, 12),
    weeklyMaintenance: 0, dryTimeHours: 0,
    referencePrice: 15000, lifetimeYears: 7, residualValue: 1500, headCostAnnual: 200,
    certifications: ['GREENGUARD Gold', 'UL ECOLOGO', 'ENERGY STAR'],
  },
  // HP Latex 570 — media gama alta Gen3, 1520mm, tinta HP 871C 3L
  {
    brand: 'HP Latex', model: 'HP Latex 570', technology: 'latex',
    printWidthMm: 1520, printSpeed: 36,
    inkPricePerLiter: 137, inkMlPerM2: 12, inkCostPerM2: ink(137, 12),
    weeklyMaintenance: 0, dryTimeHours: 0,
    referencePrice: 18000, lifetimeYears: 7, residualValue: 1800, headCostAnnual: 200,
    certifications: ['GREENGUARD Gold', 'UL ECOLOGO', 'ENERGY STAR'],
  },
  // HP Latex 630 Print & Cut — Gen4, 1300mm, tinta HP 832 1L
  // PVR oficial C!Print 2025: €21.990 sin renove. Velocidad outdoor: 18 m²/h.
  {
    brand: 'HP Latex', model: 'HP Latex 630 Print & Cut', technology: 'latex',
    printWidthMm: 1300, printSpeed: 18,
    inkPricePerLiter: 118, inkMlPerM2: 12, inkCostPerM2: ink(118, 12),
    weeklyMaintenance: 0, dryTimeHours: 0,
    referencePrice: 21990, lifetimeYears: 7, residualValue: 2200, headCostAnnual: 200,
    certifications: ['GREENGUARD Gold', 'UL ECOLOGO', 'ENERGY STAR'],
  },
  // HP Latex 630W Print & Cut — Gen4, 1616mm, tinta HP 832 1L
  // PVR oficial C!Print 2025: €23.990 sin renove. Velocidad outdoor: 18 m²/h.
  {
    brand: 'HP Latex', model: 'HP Latex 630W Print & Cut', technology: 'latex',
    printWidthMm: 1616, printSpeed: 18,
    inkPricePerLiter: 118, inkMlPerM2: 12, inkCostPerM2: ink(118, 12),
    weeklyMaintenance: 0, dryTimeHours: 0,
    referencePrice: 23990, lifetimeYears: 7, residualValue: 2400, headCostAnnual: 200,
    certifications: ['GREENGUARD Gold', 'UL ECOLOGO', 'ENERGY STAR'],
  },
  // HP Latex 700W — producción Gen4, 1625mm, tinta HP 832 1L
  // PVR oficial C!Print 2025: €28.890 sin renove. 31 m²/h outdoor.
  {
    brand: 'HP Latex', model: 'HP Latex 700W', technology: 'latex',
    printWidthMm: 1625, printSpeed: 31,
    inkPricePerLiter: 118, inkMlPerM2: 12, inkCostPerM2: ink(118, 12),
    weeklyMaintenance: 0, dryTimeHours: 0,
    referencePrice: 28890, lifetimeYears: 8, residualValue: 2900, headCostAnnual: 200,
    certifications: ['GREENGUARD Gold', 'UL ECOLOGO', 'ENERGY STAR', 'EPEAT'],
  },
  // HP Latex 730 — producción Gen5, 1625mm, tinta HP 832 1L (sustituto del 700 desde mayo 2025)
  // Portfolio activo desde mayo 2025. Precio estimado similar al 700W.
  {
    brand: 'HP Latex', model: 'HP Latex 730', technology: 'latex',
    printWidthMm: 1625, printSpeed: 31,
    inkPricePerLiter: 118, inkMlPerM2: 12, inkCostPerM2: ink(118, 12),
    weeklyMaintenance: 0, dryTimeHours: 0,
    referencePrice: 28890, lifetimeYears: 8, residualValue: 2900, headCostAnnual: 200,
    certifications: ['GREENGUARD Gold', 'UL ECOLOGO', 'ENERGY STAR'],
  },
  // HP Latex 800W — alta producción Gen4, 1625mm, tinta HP 873 3L (€91/L)
  // PVR oficial C!Print 2025: €34.490 sin renove.
  {
    brand: 'HP Latex', model: 'HP Latex 800W', technology: 'latex',
    printWidthMm: 1625, printSpeed: 36,
    inkPricePerLiter: 91, inkMlPerM2: 12, inkCostPerM2: ink(91, 12),
    weeklyMaintenance: 0, dryTimeHours: 0,
    referencePrice: 34490, lifetimeYears: 8, residualValue: 3500, headCostAnnual: 250,
    certifications: ['GREENGUARD Gold', 'UL ECOLOGO', 'ENERGY STAR', 'EPEAT'],
  },
  // HP Latex 830 — alta producción Gen5, 1625mm, tinta HP 873 3L (€91/L) (sustituto del 800 desde mayo 2025)
  // Portfolio activo desde mayo 2025. Precio estimado similar al 800W.
  {
    brand: 'HP Latex', model: 'HP Latex 830', technology: 'latex',
    printWidthMm: 1625, printSpeed: 36,
    inkPricePerLiter: 91, inkMlPerM2: 12, inkCostPerM2: ink(91, 12),
    weeklyMaintenance: 0, dryTimeHours: 0,
    referencePrice: 34490, lifetimeYears: 8, residualValue: 3500, headCostAnnual: 250,
    certifications: ['GREENGUARD Gold', 'UL ECOLOGO', 'ENERGY STAR'],
  },
  // HP Latex 800MFP — con plegado y corte integrado, tinta HP 873 3L (€91/L)
  {
    brand: 'HP Latex', model: 'HP Latex 800MFP', technology: 'latex',
    printWidthMm: 1625, printSpeed: 36,
    inkPricePerLiter: 91, inkMlPerM2: 12, inkCostPerM2: ink(91, 12),
    weeklyMaintenance: 0, dryTimeHours: 0,
    referencePrice: 40000, lifetimeYears: 8, residualValue: 4000, headCostAnnual: 250,
    certifications: ['GREENGUARD Gold', 'UL ECOLOGO', 'ENERGY STAR', 'EPEAT'],
  },
  // HP Latex R530 — rígido + rollo, HP High Control Belt System, 1616mm, tinta HP 832 1L (€118/L)
  // Modos: Borrador 31m²/h (8 planchas/h), Rápido 24m²/h (6/h), Estándar 15.5m²/h (4/h), Calidad 11.5m²/h (3/h)
  // Espacio operativo reducido: 28.5m² (sin mesas plegables). Admite rígidos hasta 50mm espesor.
  // Ahorro directo vs print+mount tradicional: ~€6-10/m² (vinilo + laminado + mano de obra montaje eliminados)
  {
    brand: 'HP Latex', model: 'HP Latex R530', technology: 'latex',
    printWidthMm: 1616, printSpeed: 24,
    inkPricePerLiter: 118, inkMlPerM2: 12, inkCostPerM2: ink(118, 12),
    weeklyMaintenance: 0, dryTimeHours: 0,
    referencePrice: 35000, lifetimeYears: 8, residualValue: 3500, headCostAnnual: 300,
    certifications: ['GREENGUARD Gold', 'UL ECOLOGO', 'ENERGY STAR'],
  },
  // HP Latex R1000 Plus — rígido + rollo, 2505mm, tinta HP 872 3L (€84/L)
  {
    brand: 'HP Latex', model: 'HP Latex R1000 Plus', technology: 'latex',
    printWidthMm: 2505, printSpeed: 27,
    inkPricePerLiter: 84, inkMlPerM2: 12, inkCostPerM2: ink(84, 12),
    weeklyMaintenance: 0, dryTimeHours: 0,
    referencePrice: 65000, lifetimeYears: 10, residualValue: 8000, headCostAnnual: 350,
    certifications: ['GREENGUARD Gold', 'UL ECOLOGO', 'ENERGY STAR', 'EPEAT'],
  },
  // HP Latex R2000 — híbrido rígido + rollo, 2490mm (98"), 86 m²/h outdoor, tinta HP 882 5L (€71/L)
  {
    brand: 'HP Latex', model: 'HP Latex R2000', technology: 'latex',
    printWidthMm: 2490, printSpeed: 50,
    inkPricePerLiter: 71, inkMlPerM2: 14, inkCostPerM2: ink(71, 14),
    weeklyMaintenance: 0.5, dryTimeHours: 0,
    referencePrice: 200000, lifetimeYears: 10, residualValue: 25000, headCostAnnual: 500,
    certifications: ['GREENGUARD Gold', 'UL ECOLOGO', 'ENERGY STAR', 'EPEAT'],
  },
  // HP Latex L1500 — superancho 3200mm (126"), HP 881 5L (€86/L GSBD Tier0), hasta 74 m²/h outdoor
  {
    brand: 'HP Latex', model: 'HP Latex L1500', technology: 'latex',
    printWidthMm: 3200, printSpeed: 74,
    inkPricePerLiter: 86, inkMlPerM2: 15, inkCostPerM2: ink(86, 15),
    weeklyMaintenance: 0.5, dryTimeHours: 0,
    referencePrice: 130000, lifetimeYears: 10, residualValue: 15000, headCostAnnual: 400,
    certifications: ['GREENGUARD Gold', 'UL ECOLOGO', 'ENERGY STAR'],
  },
  // HP Latex FS50 W — superancho 3200mm, HP 883 5L (€64/L), 89 m²/h outdoor (3-pass, datos ficha oficial)
  // 8 cabezales, cartuchos ampliables a 10L. 121 m²/h en 2 pasadas (borrador).
  {
    brand: 'HP Latex', model: 'HP Latex FS50 W', technology: 'latex',
    printWidthMm: 3200, printSpeed: 89,
    inkPricePerLiter: 64, inkMlPerM2: 14, inkCostPerM2: ink(64, 14),
    weeklyMaintenance: 0.5, dryTimeHours: 0,
    referencePrice: 85000, lifetimeYears: 10, residualValue: 10000, headCostAnnual: 400,
    certifications: ['GREENGUARD Gold', 'UL ECOLOGO', 'ENERGY STAR'],
  },
  // HP Latex FS60 W — superancho 3200mm, HP 893 10L (€52/L), mayor volumen que FS50
  // Cartuchos de 10L nativos. Siguiente nivel FS antes del FS70.
  {
    brand: 'HP Latex', model: 'HP Latex FS60 W', technology: 'latex',
    printWidthMm: 3200, printSpeed: 105,
    inkPricePerLiter: 52, inkMlPerM2: 14, inkCostPerM2: ink(52, 14),
    weeklyMaintenance: 0.5, dryTimeHours: 0,
    referencePrice: 105000, lifetimeYears: 10, residualValue: 13000, headCostAnnual: 400,
    certifications: ['GREENGUARD Gold', 'UL ECOLOGO', 'ENERGY STAR', 'EPEAT'],
  },
  // HP Latex FS70 W — superancho 3200mm, nueva generación (disp. gral. feb 2026)
  // 117 m²/h outdoor (3-pass), 162 m²/h máx. HP 893 10L (€52/L). Tinta blanca 6L incluida.
  {
    brand: 'HP Latex', model: 'HP Latex FS70 W', technology: 'latex',
    printWidthMm: 3200, printSpeed: 117,
    inkPricePerLiter: 52, inkMlPerM2: 14, inkCostPerM2: ink(52, 14),
    weeklyMaintenance: 0.5, dryTimeHours: 0,
    referencePrice: 130000, lifetimeYears: 10, residualValue: 15000, headCostAnnual: 400,
    certifications: ['GREENGUARD Gold', 'UL ECOLOGO', 'ENERGY STAR', 'EPEAT'],
  },

  // ── Roland ────────────────────────────────────────────────────────────────
  {
    brand: 'Roland', model: 'VersaCAMM VSi-540i', technology: 'eco-solvent',
    printWidthMm: 1372, printSpeed: 18.4,
    inkPricePerLiter: 72, inkMlPerM2: 11.5, inkCostPerM2: ink(72, 11.5),
    weeklyMaintenance: 2.0, dryTimeHours: 36,
    referencePrice: 14000, lifetimeYears: 6, residualValue: 1100, headCostAnnual: 900,
    certifications: [],
  },
  {
    brand: 'Roland', model: 'VersaCAMM VSi-640i', technology: 'eco-solvent',
    printWidthMm: 1625, printSpeed: 21.6,
    inkPricePerLiter: 72, inkMlPerM2: 11.5, inkCostPerM2: ink(72, 11.5),
    weeklyMaintenance: 2.0, dryTimeHours: 36,
    referencePrice: 18000, lifetimeYears: 6, residualValue: 1400, headCostAnnual: 900,
    certifications: [],
  },
  {
    brand: 'Roland', model: 'TrueVIS VG2-540', technology: 'eco-solvent',
    printWidthMm: 1372, printSpeed: 20.4,
    inkPricePerLiter: 72, inkMlPerM2: 11.5, inkCostPerM2: ink(72, 11.5),
    weeklyMaintenance: 1.5, dryTimeHours: 36,
    referencePrice: 16000, lifetimeYears: 6, residualValue: 1300, headCostAnnual: 900,
    certifications: [],
  },
  {
    brand: 'Roland', model: 'TrueVIS VG2-640', technology: 'eco-solvent',
    printWidthMm: 1625, printSpeed: 24.0,
    inkPricePerLiter: 72, inkMlPerM2: 11.5, inkCostPerM2: ink(72, 11.5),
    weeklyMaintenance: 1.5, dryTimeHours: 36,
    referencePrice: 20000, lifetimeYears: 6, residualValue: 1600, headCostAnnual: 900,
    certifications: [],
  },
  {
    brand: 'Roland', model: 'TrueVIS SG2-540', technology: 'eco-solvent',
    printWidthMm: 1372, printSpeed: 19.2,
    inkPricePerLiter: 72, inkMlPerM2: 11.5, inkCostPerM2: ink(72, 11.5),
    weeklyMaintenance: 2.0, dryTimeHours: 36,
    referencePrice: 12000, lifetimeYears: 6, residualValue: 950, headCostAnnual: 900,
    certifications: [],
  },
  {
    brand: 'Roland', model: 'TrueVIS SG2-640', technology: 'eco-solvent',
    printWidthMm: 1625, printSpeed: 22.8,
    inkPricePerLiter: 72, inkMlPerM2: 11.5, inkCostPerM2: ink(72, 11.5),
    weeklyMaintenance: 2.0, dryTimeHours: 36,
    referencePrice: 15000, lifetimeYears: 6, residualValue: 1200, headCostAnnual: 900,
    certifications: [],
  },
  // Roland TrueVIS VG3 (última generación)
  {
    brand: 'Roland', model: 'TrueVIS VG3-540', technology: 'eco-solvent',
    printWidthMm: 1372, printSpeed: 22.0,
    inkPricePerLiter: 72, inkMlPerM2: 11.5, inkCostPerM2: ink(72, 11.5),
    weeklyMaintenance: 1.5, dryTimeHours: 36,
    referencePrice: 17500, lifetimeYears: 6, residualValue: 1500, headCostAnnual: 900,
    certifications: [],
  },
  {
    brand: 'Roland', model: 'TrueVIS VG3-640', technology: 'eco-solvent',
    printWidthMm: 1625, printSpeed: 26.0,
    inkPricePerLiter: 72, inkMlPerM2: 11.5, inkCostPerM2: ink(72, 11.5),
    weeklyMaintenance: 1.5, dryTimeHours: 36,
    referencePrice: 22000, lifetimeYears: 6, residualValue: 1800, headCostAnnual: 900,
    certifications: [],
  },

  // ── Roland VersaUV (mesas planas UV) ─────────────────────────────────────
  // Tinta ECO-UV 220ml (~€480/L). Curado UV-LED instantáneo. GREENGUARD Gold.
  // LEJ-640FT — plano puro 1606×2490mm (63"×96"), hasta 12 m²/h, hasta 150mm espesor y 100kg
  {
    brand: 'Roland', model: 'VersaUV LEJ-640FT', technology: 'uv',
    printWidthMm: 1606, printSpeed: 12,
    inkPricePerLiter: 480, inkMlPerM2: 8, inkCostPerM2: ink(480, 8),
    weeklyMaintenance: 2.0, dryTimeHours: 0,
    referencePrice: 45000, lifetimeYears: 8, residualValue: 4500, headCostAnnual: 1500,
    certifications: ['GREENGUARD Gold'],
  },
  // LEJ-640 — híbrido plano+rollo 1625mm, hasta 12 m²/h, hasta 12mm espesor
  // Formato directo competidor del HP R530: imprime en rígido y en rollo, misma anchura
  {
    brand: 'Roland', model: 'VersaUV LEJ-640', technology: 'uv',
    printWidthMm: 1625, printSpeed: 12,
    inkPricePerLiter: 480, inkMlPerM2: 8, inkCostPerM2: ink(480, 8),
    weeklyMaintenance: 2.0, dryTimeHours: 0,
    referencePrice: 40000, lifetimeYears: 8, residualValue: 4000, headCostAnnual: 1500,
    certifications: ['GREENGUARD Gold'],
  },

  // ── Mimaki ────────────────────────────────────────────────────────────────
  {
    brand: 'Mimaki', model: 'CJV150-75', technology: 'eco-solvent',
    printWidthMm: 762, printSpeed: 14.5,
    inkPricePerLiter: 68, inkMlPerM2: 12.5, inkCostPerM2: ink(68, 12.5),
    weeklyMaintenance: 2.5, dryTimeHours: 48,
    referencePrice: 8000, lifetimeYears: 6, residualValue: 640, headCostAnnual: 1000,
    certifications: [],
  },
  {
    brand: 'Mimaki', model: 'CJV150-107', technology: 'eco-solvent',
    printWidthMm: 1100, printSpeed: 21.0,
    inkPricePerLiter: 68, inkMlPerM2: 12.5, inkCostPerM2: ink(68, 12.5),
    weeklyMaintenance: 2.5, dryTimeHours: 48,
    referencePrice: 11000, lifetimeYears: 6, residualValue: 880, headCostAnnual: 1000,
    certifications: [],
  },
  {
    brand: 'Mimaki', model: 'CJV150-130', technology: 'eco-solvent',
    printWidthMm: 1346, printSpeed: 26.0,
    inkPricePerLiter: 68, inkMlPerM2: 12.5, inkCostPerM2: ink(68, 12.5),
    weeklyMaintenance: 2.5, dryTimeHours: 48,
    referencePrice: 14000, lifetimeYears: 6, residualValue: 1120, headCostAnnual: 1000,
    certifications: [],
  },
  {
    brand: 'Mimaki', model: 'CJV150-160', technology: 'eco-solvent',
    printWidthMm: 1616, printSpeed: 32.0,
    inkPricePerLiter: 68, inkMlPerM2: 12.5, inkCostPerM2: ink(68, 12.5),
    weeklyMaintenance: 2.5, dryTimeHours: 48,
    referencePrice: 17000, lifetimeYears: 6, residualValue: 1360, headCostAnnual: 1000,
    certifications: [],
  },
  {
    brand: 'Mimaki', model: 'CJV300-130', technology: 'eco-solvent',
    printWidthMm: 1346, printSpeed: 46.0,
    inkPricePerLiter: 68, inkMlPerM2: 12, inkCostPerM2: ink(68, 12),
    weeklyMaintenance: 2.0, dryTimeHours: 48,
    referencePrice: 22000, lifetimeYears: 6, residualValue: 1760, headCostAnnual: 1100,
    certifications: [],
  },
  {
    brand: 'Mimaki', model: 'CJV300-160', technology: 'eco-solvent',
    printWidthMm: 1616, printSpeed: 55.0,
    inkPricePerLiter: 68, inkMlPerM2: 12, inkCostPerM2: ink(68, 12),
    weeklyMaintenance: 2.0, dryTimeHours: 48,
    referencePrice: 28000, lifetimeYears: 6, residualValue: 2240, headCostAnnual: 1100,
    certifications: [],
  },
  // Mimaki UJV55-320 — UV-LED superancho 3200mm (126"), 111 m²/h, doble rollo simultáneo
  // Tinta LUS-120 UV flexible, GREENGUARD Gold. Precio ~65.000€. Piezo Ricoh.
  {
    brand: 'Mimaki', model: 'UJV55-320', technology: 'uv',
    printWidthMm: 3200, printSpeed: 111,
    inkPricePerLiter: 65, inkMlPerM2: 8, inkCostPerM2: ink(65, 8),
    weeklyMaintenance: 1.5, dryTimeHours: 0,
    referencePrice: 65000, lifetimeYears: 8, residualValue: 7000, headCostAnnual: 700,
    certifications: ['GREENGUARD Gold'],
  },

  // ── Mimaki mesas planas UV (flatbeds) ─────────────────────────────────────
  // Tinta LUS-120 / LUS-150 / LUS-200 flexible UV. GREENGUARD Gold certificada.
  // JFX200-2513 EX — plano 2500×1300mm (4'×8'), hasta 35 m²/h, 3 cabezales escalón
  // LUS-120/150 flexible, 2.5D Texture Maker, MSRP ~70.000€. Espesor hasta 50mm.
  {
    brand: 'Mimaki', model: 'JFX200-2513 EX', technology: 'uv',
    printWidthMm: 2500, printSpeed: 35,
    inkPricePerLiter: 140, inkMlPerM2: 8, inkCostPerM2: ink(140, 8),
    weeklyMaintenance: 2.0, dryTimeHours: 0,
    referencePrice: 70000, lifetimeYears: 8, residualValue: 7000, headCostAnnual: 1200,
    certifications: ['GREENGUARD Gold'],
  },
  // JFX600-2513 — plano 2500×1300mm, 16 cabezales industriales, hasta 200 m²/h
  // El flatbed UV de mayor producción de Mimaki. LUS-200/170 flexible. ~190.000€.
  // 67 tableros/hora (4'×8'). Espesor hasta 60mm. Industry 4.0 ready.
  {
    brand: 'Mimaki', model: 'JFX600-2513', technology: 'uv',
    printWidthMm: 2500, printSpeed: 200,
    inkPricePerLiter: 160, inkMlPerM2: 8, inkCostPerM2: ink(160, 8),
    weeklyMaintenance: 2.5, dryTimeHours: 0,
    referencePrice: 190000, lifetimeYears: 8, residualValue: 25000, headCostAnnual: 3000,
    certifications: ['GREENGUARD Gold'],
  },

  // ── Epson ─────────────────────────────────────────────────────────────────
  {
    brand: 'Epson', model: 'SureColor SC-S40600', technology: 'eco-solvent',
    printWidthMm: 1625, printSpeed: 18.0,
    inkPricePerLiter: 67, inkMlPerM2: 12, inkCostPerM2: ink(67, 12),
    weeklyMaintenance: 1.5, dryTimeHours: 24,
    referencePrice: 9000, lifetimeYears: 5, residualValue: 700, headCostAnnual: 700,
    certifications: [],
  },
  {
    brand: 'Epson', model: 'SureColor SC-S60600', technology: 'eco-solvent',
    printWidthMm: 1625, printSpeed: 35.0,
    inkPricePerLiter: 67, inkMlPerM2: 12, inkCostPerM2: ink(67, 12),
    weeklyMaintenance: 1.5, dryTimeHours: 24,
    referencePrice: 14000, lifetimeYears: 5, residualValue: 1100, headCostAnnual: 700,
    certifications: [],
  },
  {
    brand: 'Epson', model: 'SureColor SC-S80600', technology: 'eco-solvent',
    printWidthMm: 1625, printSpeed: 50.0,
    inkPricePerLiter: 67, inkMlPerM2: 12, inkCostPerM2: ink(67, 12),
    weeklyMaintenance: 1.0, dryTimeHours: 24,
    referencePrice: 22000, lifetimeYears: 5, residualValue: 1700, headCostAnnual: 800,
    certifications: [],
  },
  {
    brand: 'Epson', model: 'SureColor SC-S60610', technology: 'eco-solvent',
    printWidthMm: 1625, printSpeed: 36.0,
    inkPricePerLiter: 67, inkMlPerM2: 12, inkCostPerM2: ink(67, 12),
    weeklyMaintenance: 1.5, dryTimeHours: 24,
    referencePrice: 15000, lifetimeYears: 5, residualValue: 1200, headCostAnnual: 700,
    certifications: [],
  },

  // ── Mutoh ─────────────────────────────────────────────────────────────────
  {
    brand: 'Mutoh', model: 'ValueJet 1324X', technology: 'eco-solvent',
    printWidthMm: 1320, printSpeed: 23.0,
    inkPricePerLiter: 70, inkMlPerM2: 11.5, inkCostPerM2: ink(70, 11.5),
    weeklyMaintenance: 2.0, dryTimeHours: 36,
    referencePrice: 11000, lifetimeYears: 6, residualValue: 880, headCostAnnual: 900,
    certifications: [],
  },
  {
    brand: 'Mutoh', model: 'ValueJet 1624X', technology: 'eco-solvent',
    printWidthMm: 1620, printSpeed: 34.0,
    inkPricePerLiter: 70, inkMlPerM2: 11.5, inkCostPerM2: ink(70, 11.5),
    weeklyMaintenance: 2.0, dryTimeHours: 36,
    referencePrice: 15000, lifetimeYears: 6, residualValue: 1200, headCostAnnual: 900,
    certifications: [],
  },
  {
    brand: 'Mutoh', model: 'XpertJet 1341SR Pro', technology: 'eco-solvent',
    printWidthMm: 1340, printSpeed: 24.0,
    inkPricePerLiter: 70, inkMlPerM2: 11.0, inkCostPerM2: ink(70, 11.0),
    weeklyMaintenance: 1.5, dryTimeHours: 36,
    referencePrice: 10000, lifetimeYears: 6, residualValue: 800, headCostAnnual: 800,
    certifications: [],
  },
  {
    brand: 'Mutoh', model: 'XpertJet 1642SR Pro', technology: 'eco-solvent',
    printWidthMm: 1620, printSpeed: 32.0,
    inkPricePerLiter: 70, inkMlPerM2: 11.0, inkCostPerM2: ink(70, 11.0),
    weeklyMaintenance: 1.5, dryTimeHours: 36,
    referencePrice: 14000, lifetimeYears: 6, residualValue: 1100, headCostAnnual: 800,
    certifications: [],
  },

  // ── Canon ─────────────────────────────────────────────────────────────────
  // Colorado: UV gel (curado instantáneo, tecnología diferente a eco-solvente)
  {
    brand: 'Canon', model: 'Colorado M3', technology: 'uv',
    printWidthMm: 1625, printSpeed: 45.0,
    inkPricePerLiter: 85, inkMlPerM2: 10.0, inkCostPerM2: ink(85, 10.0),
    weeklyMaintenance: 1.0, dryTimeHours: 0,
    referencePrice: 18000, lifetimeYears: 7, residualValue: 2000, headCostAnnual: 1200,
    certifications: [],
  },
  {
    brand: 'Canon', model: 'Colorado 1640', technology: 'uv',
    printWidthMm: 1625, printSpeed: 70.0,
    inkPricePerLiter: 85, inkMlPerM2: 10.0, inkCostPerM2: ink(85, 10.0),
    weeklyMaintenance: 1.0, dryTimeHours: 0,
    referencePrice: 28000, lifetimeYears: 7, residualValue: 3000, headCostAnnual: 1500,
    certifications: [],
  },

  // ── Agfa ──────────────────────────────────────────────────────────────────
  {
    brand: 'Agfa', model: 'Anapurna H2500i LED', technology: 'uv',
    printWidthMm: 2500, printSpeed: 80.0,
    inkPricePerLiter: 90, inkMlPerM2: 9.0, inkCostPerM2: ink(90, 9.0),
    weeklyMaintenance: 1.5, dryTimeHours: 0,
    referencePrice: 55000, lifetimeYears: 8, residualValue: 5500, headCostAnnual: 2000,
    certifications: [],
  },
  {
    brand: 'Agfa', model: 'Jeti Tauro H3300 LED', technology: 'uv',
    printWidthMm: 3300, printSpeed: 125.0,
    inkPricePerLiter: 90, inkMlPerM2: 9.0, inkCostPerM2: ink(90, 9.0),
    weeklyMaintenance: 2.0, dryTimeHours: 0,
    referencePrice: 120000, lifetimeYears: 10, residualValue: 15000, headCostAnnual: 3500,
    certifications: [],
  },

  // ── swissQprint (Generación 5 — 2025) ────────────────────────────────────
  // Cabezales Konica Minolta 1280i, hasta 1.350 dpi, 10 canales de color configurables
  // Tinta UV-LED de curado instantáneo. Garantía de fábrica 36 meses en todos los modelos.

  // ─ FLATBEDS ─
  // Kudu — flagship, plano 3200×2000mm, 30 cabezales (3 filas), hasta 341 m²/h
  {
    brand: 'swissQprint', model: 'swissQprint Kudu', technology: 'uv',
    printWidthMm: 3200, printSpeed: 341,
    inkPricePerLiter: 150, inkMlPerM2: 6, inkCostPerM2: ink(150, 6),
    weeklyMaintenance: 2.0, dryTimeHours: 0,
    referencePrice: 400000, lifetimeYears: 12, residualValue: 50000, headCostAnnual: 5000,
    certifications: [],
  },
  // Nyala 5 — best-seller mundial, plano 3200×2000mm, 18 cabezales (2 filas), hasta 253 m²/h
  // 23% más rápida que la Nyala 4. Mismo chasis que el Kudu.
  {
    brand: 'swissQprint', model: 'swissQprint Nyala 5', technology: 'uv',
    printWidthMm: 3200, printSpeed: 253,
    inkPricePerLiter: 150, inkMlPerM2: 6, inkCostPerM2: ink(150, 6),
    weeklyMaintenance: 2.0, dryTimeHours: 0,
    referencePrice: 280000, lifetimeYears: 12, residualValue: 35000, headCostAnnual: 3500,
    certifications: [],
  },
  // Topi 5 — entrada de gama plano, 3200×2000mm, hasta 126 m²/h (nuevo 2025)
  {
    brand: 'swissQprint', model: 'swissQprint Topi 5', technology: 'uv',
    printWidthMm: 3200, printSpeed: 126,
    inkPricePerLiter: 150, inkMlPerM2: 6, inkCostPerM2: ink(150, 6),
    weeklyMaintenance: 1.5, dryTimeHours: 0,
    referencePrice: 140000, lifetimeYears: 12, residualValue: 15000, headCostAnnual: 1500,
    certifications: [],
  },
  // Impala 5 — plano compacto 2500×2000mm, 26% más rápido, hasta 227 m²/h (nuevo 2025)
  {
    brand: 'swissQprint', model: 'swissQprint Impala 5', technology: 'uv',
    printWidthMm: 2500, printSpeed: 227,
    inkPricePerLiter: 150, inkMlPerM2: 6, inkCostPerM2: ink(150, 6),
    weeklyMaintenance: 2.0, dryTimeHours: 0,
    referencePrice: 220000, lifetimeYears: 12, residualValue: 25000, headCostAnnual: 2500,
    certifications: [],
  },
  // Oryx 5 — plano compacto 2500×2000mm, 26% más rápido, hasta 114 m²/h (nuevo 2025)
  {
    brand: 'swissQprint', model: 'swissQprint Oryx 5', technology: 'uv',
    printWidthMm: 2500, printSpeed: 114,
    inkPricePerLiter: 150, inkMlPerM2: 6, inkCostPerM2: ink(150, 6),
    weeklyMaintenance: 1.5, dryTimeHours: 0,
    referencePrice: 150000, lifetimeYears: 12, residualValue: 17000, headCostAnnual: 1500,
    certifications: [],
  },

  // ─ ROLL-TO-ROLL ─
  // Karibu 2 — rollo a rollo 3380mm, hasta 212 m²/h, UV-LED
  {
    brand: 'swissQprint', model: 'swissQprint Karibu 2', technology: 'uv',
    printWidthMm: 3380, printSpeed: 212,
    inkPricePerLiter: 150, inkMlPerM2: 6, inkCostPerM2: ink(150, 6),
    weeklyMaintenance: 1.5, dryTimeHours: 0,
    referencePrice: 250000, lifetimeYears: 12, residualValue: 30000, headCostAnnual: 2000,
    certifications: [],
  },
  // Karibu S — rollo a rollo 3380mm alta velocidad, hasta 330 m²/h, UV-LED
  {
    brand: 'swissQprint', model: 'swissQprint Karibu S', technology: 'uv',
    printWidthMm: 3380, printSpeed: 330,
    inkPricePerLiter: 150, inkMlPerM2: 6, inkCostPerM2: ink(150, 6),
    weeklyMaintenance: 1.5, dryTimeHours: 0,
    referencePrice: 350000, lifetimeYears: 12, residualValue: 45000, headCostAnnual: 3000,
    certifications: [],
  },
];

export const groupedMachines = ALL_MACHINES.reduce<Record<string, Machine[]>>((acc, m) => {
  if (!acc[m.brand]) acc[m.brand] = [];
  acc[m.brand].push(m);
  return acc;
}, {});

// ─── Sectores ─────────────────────────────────────────────────────────────────
export const SECTORS = [
  'Rotulación y señalización',
  'Decoración interior',
  'Publicidad exterior',
  'Textil y moda',
  'Retail y punto de venta',
  'Fotografía y arte',
  'Producción industrial',
  'Otro',
];

// ─── Escenarios de crecimiento ────────────────────────────────────────────────
export const GROWTH_SCENARIOS = [
  { label: 'Conservador (mismos m²)', value: 0 },
  { label: 'Crecimiento +20%', value: 0.2 },
  { label: 'Crecimiento +30%', value: 0.3 },
];

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CalculatorData {
  // Datos del cliente
  clientName: string;
  clientCompany: string;
  clientSector: string;
  // Selección de máquinas
  machineAModel: string;
  machineBModel: string;
  // Volumen compartido
  monthlyVolume: number;
  // Costes de material base
  lonaMaterialCost: number;
  viniloMaterialCost: number;
  // Máquina A
  machineASpeed: number;
  machineAInkPricePerLiter: number;
  machineAInkMlPerM2: number;
  machineAInkCost: number;          // calculado = A * B / 1000
  machineAMaintenance: number;
  machineADryTime: number;
  machineAPrice: number;
  machineALifetimeYears: number;
  machineAResidualValue: number;
  machineAHeadCostMonthly: number;
  // Máquina B
  machineBSpeed: number;
  machineBInkPricePerLiter: number;
  machineBInkMlPerM2: number;
  machineBInkCost: number;
  machineBMaintenance: number;
  machineBDryTime: number;
  machineBPrice: number;
  machineBLifetimeYears: number;
  machineBResidualValue: number;
  machineBHeadCostMonthly: number;
  // Revenue
  lonaPercentage: number;
  viniloPercentage: number;
  lonaSellPrice: number;
  viniloSellPrice: number;
  // Financiación
  rentingMonths: number;
  rentingInterest: number;
  // Escenario
  growthRate: number;
}

export interface YearlyData {
  year: number;
  costA: number;
  costB: number;
  profitA: number;
  profitB: number;
  cumProfitA: number;
  cumProfitB: number;
}

export interface CalculationResults {
  // Resultados operativos (backward compat)
  machineACost: number;
  machineBCost: number;
  monthlySavings: number;
  annualSavings: number;
  roiMonths: number;
  productionTimeSavings: number;
  monthlyRevenue: number;
  monthlyRevenueB: number;
  machineAProfit: number;
  machineBProfit: number;
  monthlyRentingQuota: number;
  machineBNetProfit: number;
  // TCO (Total Cost of Ownership)
  machineAAmortizationMonthly: number;
  machineBAmortizationMonthly: number;
  monthlyTCO_A: number;
  monthlyTCO_B: number;
  tcoSavingsMonthly: number;
  tcoSavingsAnnual: number;
  machineATCONetProfit: number;
  machineBTCONetProfit: number;
  paybackMonthsTCO: number;
  // Ink display
  inkCostPerM2A: number;
  inkCostPerM2B: number;
  // 5-year projection
  yearlyData: YearlyData[];
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface DataContextType {
  data: CalculatorData;
  results: CalculationResults;
  updateData: (newData: Partial<CalculatorData>) => void;
  calculate: () => void;
  getMachineA: () => Machine | undefined;
  getMachineB: () => Machine | undefined;
}

const defaultMachineA = ALL_MACHINES.find(m => m.model === 'TrueVIS VG2-640')!;
const defaultMachineB = ALL_MACHINES.find(m => m.model === 'HP Latex 700W')!;

const defaultData: CalculatorData = {
  clientName: '',
  clientCompany: '',
  clientSector: '',
  machineAModel: defaultMachineA.model,
  machineBModel: defaultMachineB.model,
  monthlyVolume: 1500,
  lonaMaterialCost: 1.00,
  viniloMaterialCost: 1.45,
  machineASpeed: defaultMachineA.printSpeed,
  machineAInkPricePerLiter: defaultMachineA.inkPricePerLiter,
  machineAInkMlPerM2: defaultMachineA.inkMlPerM2,
  machineAInkCost: defaultMachineA.inkCostPerM2,
  machineAMaintenance: defaultMachineA.weeklyMaintenance,
  machineADryTime: defaultMachineA.dryTimeHours,
  machineAPrice: defaultMachineA.referencePrice,
  machineALifetimeYears: defaultMachineA.lifetimeYears,
  machineAResidualValue: defaultMachineA.residualValue,
  machineAHeadCostMonthly: Math.round(defaultMachineA.headCostAnnual / 12),
  machineBSpeed: defaultMachineB.printSpeed,
  machineBInkPricePerLiter: defaultMachineB.inkPricePerLiter,
  machineBInkMlPerM2: defaultMachineB.inkMlPerM2,
  machineBInkCost: defaultMachineB.inkCostPerM2,
  machineBMaintenance: defaultMachineB.weeklyMaintenance,
  machineBDryTime: defaultMachineB.dryTimeHours,
  machineBPrice: defaultMachineB.referencePrice,
  machineBLifetimeYears: defaultMachineB.lifetimeYears,
  machineBResidualValue: defaultMachineB.residualValue,
  machineBHeadCostMonthly: Math.round(defaultMachineB.headCostAnnual / 12),
  lonaPercentage: 50,
  viniloPercentage: 50,
  lonaSellPrice: 12,
  viniloSellPrice: 18,
  rentingMonths: 60,
  rentingInterest: 6.5,
  growthRate: 0,
};

const DataContext = createContext<DataContextType | undefined>(undefined);

// Fórmula simétrica de coste operativo: tinta + material + operario (impresión + mantenimiento) + esperas
const calcMachineCost = (
  volume: number,
  speed: number,
  inkCostPerM2: number,
  maintenance: number,
  dryTime: number,
  lonaPerc: number,
  viniloPerc: number,
  lonaMatCost: number,
  viniloMatCost: number,
  operatorRate = 20
): number => {
  const inkTotal = volume * inkCostPerM2;
  const materialTotal = (volume * (lonaPerc / 100) * lonaMatCost) + (volume * (viniloPerc / 100) * viniloMatCost);
  const printHours = volume / (speed || 1);
  const operatorCost = (printHours + maintenance * 4) * operatorRate;
  const waitCost = dryTime > 0 ? (volume / 50) * 0.5 * operatorRate : 0;
  return inkTotal + materialTotal + operatorCost + waitCost;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<CalculatorData>(defaultData);
  const [results, setResults] = useState<CalculationResults>({
    machineACost: 0, machineBCost: 0, monthlySavings: 0, annualSavings: 0,
    roiMonths: 0, productionTimeSavings: 0, monthlyRevenue: 0, monthlyRevenueB: 0,
    machineAProfit: 0, machineBProfit: 0, monthlyRentingQuota: 0, machineBNetProfit: 0,
    machineAAmortizationMonthly: 0, machineBAmortizationMonthly: 0,
    monthlyTCO_A: 0, monthlyTCO_B: 0, tcoSavingsMonthly: 0, tcoSavingsAnnual: 0,
    machineATCONetProfit: 0, machineBTCONetProfit: 0, paybackMonthsTCO: 0,
    inkCostPerM2A: 0, inkCostPerM2B: 0,
    yearlyData: [],
  });

  const updateData = (newData: Partial<CalculatorData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const getMachineA = useCallback(() => ALL_MACHINES.find(m => m.model === data.machineAModel), [data.machineAModel]);
  const getMachineB = useCallback(() => ALL_MACHINES.find(m => m.model === data.machineBModel), [data.machineBModel]);

  const calculate = useCallback(() => {
    // Costes de tinta calculados
    const inkCostPerM2A = data.machineAInkPricePerLiter * data.machineAInkMlPerM2 / 1000;
    const inkCostPerM2B = data.machineBInkPricePerLiter * data.machineBInkMlPerM2 / 1000;

    // Volumen (el escenario de crecimiento aplica a máquina B)
    const volA = data.monthlyVolume;
    const volB = data.monthlyVolume * (1 + data.growthRate);

    // Costes operativos mensuales
    const machineACost = calcMachineCost(
      volA, data.machineASpeed, inkCostPerM2A, data.machineAMaintenance, data.machineADryTime,
      data.lonaPercentage, data.viniloPercentage, data.lonaMaterialCost, data.viniloMaterialCost
    );
    const machineBCost = calcMachineCost(
      volB, data.machineBSpeed, inkCostPerM2B, data.machineBMaintenance, data.machineBDryTime,
      data.lonaPercentage, data.viniloPercentage, data.lonaMaterialCost, data.viniloMaterialCost
    );

    // Amortización mensual
    const machineAAmortizationMonthly = data.machineAPrice > 0 && data.machineALifetimeYears > 0
      ? (data.machineAPrice - data.machineAResidualValue) / (data.machineALifetimeYears * 12)
      : 0;
    const machineBAmortizationMonthly = data.machineBPrice > 0 && data.machineBLifetimeYears > 0
      ? (data.machineBPrice - data.machineBResidualValue) / (data.machineBLifetimeYears * 12)
      : 0;

    // TCO mensual completo (operativo + amortización + cabezales)
    const monthlyTCO_A = machineACost + machineAAmortizationMonthly + data.machineAHeadCostMonthly;
    const monthlyTCO_B = machineBCost + machineBAmortizationMonthly + data.machineBHeadCostMonthly;

    const tcoSavingsMonthly = monthlyTCO_A - monthlyTCO_B;
    const tcoSavingsAnnual = tcoSavingsMonthly * 12;

    // Ingresos
    const avgSellPricePerM2 = (data.lonaPercentage / 100 * data.lonaSellPrice) + (data.viniloPercentage / 100 * data.viniloSellPrice);
    const m2Lona = (volA * data.lonaPercentage) / 100;
    const m2Vinilo = (volA * data.viniloPercentage) / 100;
    const monthlyRevenue = m2Lona * data.lonaSellPrice + m2Vinilo * data.viniloSellPrice;
    const monthlyRevenueB = volB * avgSellPricePerM2;

    // Beneficios operativos (backward compat)
    const monthlySavings = machineACost - machineBCost;
    const annualSavings = monthlySavings * 12;
    const roiMonths = monthlySavings > 0 ? data.machineBPrice / monthlySavings : Infinity;

    const printHoursA = volA / (data.machineASpeed || 1);
    const printHoursB = volB / (data.machineBSpeed || 1);
    const productionTimeSavings = (printHoursA + data.machineAMaintenance * 4) - (printHoursB + data.machineBMaintenance * 4);

    const machineAProfit = monthlyRevenue - machineACost;
    const machineBProfit = monthlyRevenueB - machineBCost;

    // Renting
    const loanAmount = data.machineBPrice;
    const monthlyRate = data.rentingInterest / 100 / 12;
    const n = data.rentingMonths;
    const monthlyRentingQuota = monthlyRate > 0
      ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
      : loanAmount / n;
    const machineBNetProfit = machineBProfit - monthlyRentingQuota;

    // TCO profits y payback
    const machineATCONetProfit = monthlyRevenue - monthlyTCO_A;
    const machineBTCONetProfit = monthlyRevenueB - monthlyTCO_B;
    const paybackMonthsTCO = tcoSavingsMonthly > 0 ? data.machineBPrice / tcoSavingsMonthly : Infinity;

    // Proyección 5 años
    const yearlyData: YearlyData[] = [];
    let cumProfitA = 0, cumProfitB = 0;
    for (let year = 1; year <= 5; year++) {
      const costA = monthlyTCO_A * 12;
      const costB = monthlyTCO_B * 12;
      const profitA = monthlyRevenue * 12 - costA;
      const profitB = monthlyRevenueB * 12 - costB;
      cumProfitA += profitA;
      cumProfitB += profitB;
      yearlyData.push({ year, costA, costB, profitA, profitB, cumProfitA, cumProfitB });
    }

    setResults({
      machineACost, machineBCost, monthlySavings, annualSavings, roiMonths,
      productionTimeSavings, monthlyRevenue, monthlyRevenueB,
      machineAProfit, machineBProfit, monthlyRentingQuota, machineBNetProfit,
      machineAAmortizationMonthly, machineBAmortizationMonthly,
      monthlyTCO_A, monthlyTCO_B, tcoSavingsMonthly, tcoSavingsAnnual,
      machineATCONetProfit, machineBTCONetProfit, paybackMonthsTCO,
      inkCostPerM2A, inkCostPerM2B,
      yearlyData,
    });
  }, [data]);

  useEffect(() => { calculate(); }, [calculate]);

  return (
    <DataContext.Provider value={{ data, results, updateData, calculate, getMachineA, getMachineB }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
};
