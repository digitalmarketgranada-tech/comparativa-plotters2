import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Machine {
  brand: string;
  model: string;
  technology: 'latex' | 'eco-solvent' | 'uv';
  printSpeed: number;      // m²/h
  inkCostPerM2: number;    // €/m²
  weeklyMaintenance: number; // h/week
  dryTimeHours: number;    // hours before cutting (0 = instant)
  referencePrice: number;  // € indicative
}

export const ALL_MACHINES: Machine[] = [
  // ── HP Latex ──────────────────────────────────────────
  { brand: 'HP Latex', model: 'HP Latex 335', technology: 'latex', printSpeed: 22, inkCostPerM2: 1.20, weeklyMaintenance: 0, dryTimeHours: 0, referencePrice: 8500 },
  { brand: 'HP Latex', model: 'HP Latex 365', technology: 'latex', printSpeed: 28, inkCostPerM2: 1.20, weeklyMaintenance: 0, dryTimeHours: 0, referencePrice: 12000 },
  { brand: 'HP Latex', model: 'HP Latex 560', technology: 'latex', printSpeed: 30, inkCostPerM2: 1.20, weeklyMaintenance: 0, dryTimeHours: 0, referencePrice: 15000 },
  { brand: 'HP Latex', model: 'HP Latex 570', technology: 'latex', printSpeed: 36, inkCostPerM2: 1.20, weeklyMaintenance: 0, dryTimeHours: 0, referencePrice: 18000 },
  { brand: 'HP Latex', model: 'HP Latex 630 Print & Cut', technology: 'latex', printSpeed: 18, inkCostPerM2: 1.20, weeklyMaintenance: 0, dryTimeHours: 0, referencePrice: 19900 },
  { brand: 'HP Latex', model: 'HP Latex 730', technology: 'latex', printSpeed: 31, inkCostPerM2: 1.20, weeklyMaintenance: 0, dryTimeHours: 0, referencePrice: 25000 },
  { brand: 'HP Latex', model: 'HP Latex 830', technology: 'latex', printSpeed: 36, inkCostPerM2: 1.20, weeklyMaintenance: 0, dryTimeHours: 0, referencePrice: 32000 },
  { brand: 'HP Latex', model: 'HP Latex R530', technology: 'latex', printSpeed: 20, inkCostPerM2: 1.20, weeklyMaintenance: 0, dryTimeHours: 0, referencePrice: 35000 },
  // ── Roland ────────────────────────────────────────────
  { brand: 'Roland', model: 'VersaCAMM VSi-540i', technology: 'eco-solvent', printSpeed: 18.4, inkCostPerM2: 0.84, weeklyMaintenance: 2.0, dryTimeHours: 36, referencePrice: 14000 },
  { brand: 'Roland', model: 'VersaCAMM VSi-640i', technology: 'eco-solvent', printSpeed: 21.6, inkCostPerM2: 0.84, weeklyMaintenance: 2.0, dryTimeHours: 36, referencePrice: 18000 },
  { brand: 'Roland', model: 'TrueVIS VG2-540', technology: 'eco-solvent', printSpeed: 20.4, inkCostPerM2: 0.83, weeklyMaintenance: 1.5, dryTimeHours: 36, referencePrice: 16000 },
  { brand: 'Roland', model: 'TrueVIS VG2-640', technology: 'eco-solvent', printSpeed: 24.0, inkCostPerM2: 0.83, weeklyMaintenance: 1.5, dryTimeHours: 36, referencePrice: 20000 },
  { brand: 'Roland', model: 'TrueVIS SG2-540', technology: 'eco-solvent', printSpeed: 19.2, inkCostPerM2: 0.82, weeklyMaintenance: 2.0, dryTimeHours: 36, referencePrice: 12000 },
  { brand: 'Roland', model: 'TrueVIS SG2-640', technology: 'eco-solvent', printSpeed: 22.8, inkCostPerM2: 0.82, weeklyMaintenance: 2.0, dryTimeHours: 36, referencePrice: 15000 },
  // ── Mimaki ────────────────────────────────────────────
  { brand: 'Mimaki', model: 'CJV150-75', technology: 'eco-solvent', printSpeed: 14.5, inkCostPerM2: 0.85, weeklyMaintenance: 2.5, dryTimeHours: 48, referencePrice: 8000 },
  { brand: 'Mimaki', model: 'CJV150-107', technology: 'eco-solvent', printSpeed: 21.0, inkCostPerM2: 0.85, weeklyMaintenance: 2.5, dryTimeHours: 48, referencePrice: 11000 },
  { brand: 'Mimaki', model: 'CJV150-130', technology: 'eco-solvent', printSpeed: 26.0, inkCostPerM2: 0.85, weeklyMaintenance: 2.5, dryTimeHours: 48, referencePrice: 14000 },
  { brand: 'Mimaki', model: 'CJV150-160', technology: 'eco-solvent', printSpeed: 32.0, inkCostPerM2: 0.85, weeklyMaintenance: 2.5, dryTimeHours: 48, referencePrice: 17000 },
  { brand: 'Mimaki', model: 'CJV300-130', technology: 'eco-solvent', printSpeed: 46.0, inkCostPerM2: 0.86, weeklyMaintenance: 2.0, dryTimeHours: 48, referencePrice: 22000 },
  { brand: 'Mimaki', model: 'CJV300-160', technology: 'eco-solvent', printSpeed: 55.0, inkCostPerM2: 0.86, weeklyMaintenance: 2.0, dryTimeHours: 48, referencePrice: 28000 },
  // ── Epson ─────────────────────────────────────────────
  { brand: 'Epson', model: 'SureColor SC-S40600', technology: 'eco-solvent', printSpeed: 18.0, inkCostPerM2: 0.80, weeklyMaintenance: 1.5, dryTimeHours: 24, referencePrice: 9000 },
  { brand: 'Epson', model: 'SureColor SC-S60600', technology: 'eco-solvent', printSpeed: 35.0, inkCostPerM2: 0.80, weeklyMaintenance: 1.5, dryTimeHours: 24, referencePrice: 14000 },
  { brand: 'Epson', model: 'SureColor SC-S80600', technology: 'eco-solvent', printSpeed: 50.0, inkCostPerM2: 0.85, weeklyMaintenance: 1.0, dryTimeHours: 24, referencePrice: 22000 },
  { brand: 'Epson', model: 'SureColor SC-S60610', technology: 'eco-solvent', printSpeed: 36.0, inkCostPerM2: 0.80, weeklyMaintenance: 1.5, dryTimeHours: 24, referencePrice: 15000 },
];

export const groupedMachines = ALL_MACHINES.reduce<Record<string, Machine[]>>((acc, m) => {
  if (!acc[m.brand]) acc[m.brand] = [];
  acc[m.brand].push(m);
  return acc;
}, {});

export interface CalculatorData {
  // Machine selections
  machineAModel: string;
  machineBModel: string;
  // Shared
  monthlyVolume: number; // m²
  // Material Costs
  lonaMaterialCost: number;   // €/m²
  viniloMaterialCost: number; // €/m²
  // Machine A parameters (auto-filled, editable)
  machineASpeed: number;
  machineAInkCost: number;   // €/m²
  machineAMaintenance: number; // h/week
  machineADryTime: number;   // h
  machineAPrice: number;     // €
  // Machine B parameters
  machineBSpeed: number;
  machineBInkCost: number;
  machineBMaintenance: number;
  machineBDryTime: number;
  machineBPrice: number;
  // Revenue
  lonaPercentage: number;
  viniloPercentage: number;
  lonaSellPrice: number;
  viniloSellPrice: number;
  // Financing (for machine B)
  rentingMonths: number;
  rentingInterest: number;
}

export interface CalculationResults {
  machineACost: number;
  machineBCost: number;
  monthlySavings: number;    // machineACost - machineBCost (positive = B cheaper)
  annualSavings: number;
  roiMonths: number;
  productionTimeSavings: number; // h/month saved vs A
  monthlyRevenue: number;
  machineAProfit: number;
  machineBProfit: number;
  monthlyRentingQuota: number;
  machineBNetProfit: number;
}

interface DataContextType {
  data: CalculatorData;
  results: CalculationResults;
  updateData: (newData: Partial<CalculatorData>) => void;
  calculate: () => void;
  getMachineA: () => Machine | undefined;
  getMachineB: () => Machine | undefined;
}

const defaultMachineA = ALL_MACHINES.find(m => m.model === 'TrueVIS VG2-640')!;
const defaultMachineB = ALL_MACHINES.find(m => m.model === 'HP Latex 630 Print & Cut')!;

const defaultData: CalculatorData = {
  machineAModel: defaultMachineA.model,
  machineBModel: defaultMachineB.model,
  monthlyVolume: 1500,
  lonaMaterialCost: 1.00,
  viniloMaterialCost: 1.45,
  machineASpeed: defaultMachineA.printSpeed,
  machineAInkCost: defaultMachineA.inkCostPerM2,
  machineAMaintenance: defaultMachineA.weeklyMaintenance,
  machineADryTime: defaultMachineA.dryTimeHours,
  machineAPrice: defaultMachineA.referencePrice,
  machineBSpeed: defaultMachineB.printSpeed,
  machineBInkCost: defaultMachineB.inkCostPerM2,
  machineBMaintenance: defaultMachineB.weeklyMaintenance,
  machineBDryTime: defaultMachineB.dryTimeHours,
  machineBPrice: defaultMachineB.referencePrice,
  lonaPercentage: 50,
  viniloPercentage: 50,
  lonaSellPrice: 12,
  viniloSellPrice: 18,
  rentingMonths: 60,
  rentingInterest: 6.5,
};

const DataContext = createContext<DataContextType | undefined>(undefined);

// Symmetric cost formula: ink + material + operator (print + maintenance) + wait handling
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
    roiMonths: 0, productionTimeSavings: 0, monthlyRevenue: 0,
    machineAProfit: 0, machineBProfit: 0, monthlyRentingQuota: 0,
    machineBNetProfit: 0,
  });

  const updateData = (newData: Partial<CalculatorData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const getMachineA = useCallback(() => ALL_MACHINES.find(m => m.model === data.machineAModel), [data.machineAModel]);
  const getMachineB = useCallback(() => ALL_MACHINES.find(m => m.model === data.machineBModel), [data.machineBModel]);

  const calculate = useCallback(() => {
    const vol = data.monthlyVolume;

    const machineACost = calcMachineCost(
      vol, data.machineASpeed, data.machineAInkCost, data.machineAMaintenance, data.machineADryTime,
      data.lonaPercentage, data.viniloPercentage, data.lonaMaterialCost, data.viniloMaterialCost
    );
    const machineBCost = calcMachineCost(
      vol, data.machineBSpeed, data.machineBInkCost, data.machineBMaintenance, data.machineBDryTime,
      data.lonaPercentage, data.viniloPercentage, data.lonaMaterialCost, data.viniloMaterialCost
    );

    const monthlySavings = machineACost - machineBCost;
    const annualSavings = monthlySavings * 12;
    const roiMonths = monthlySavings > 0 ? data.machineBPrice / monthlySavings : Infinity;

    const printHoursA = vol / (data.machineASpeed || 1);
    const printHoursB = vol / (data.machineBSpeed || 1);
    const productionTimeSavings = (printHoursA + data.machineAMaintenance * 4) - (printHoursB + data.machineBMaintenance * 4);

    const m2Lona = (vol * data.lonaPercentage) / 100;
    const m2Vinilo = (vol * data.viniloPercentage) / 100;
    const monthlyRevenue = m2Lona * data.lonaSellPrice + m2Vinilo * data.viniloSellPrice;

    const machineAProfit = monthlyRevenue - machineACost;
    const machineBProfit = monthlyRevenue - machineBCost;

    // Renting EMI
    const loanAmount = data.machineBPrice;
    const monthlyRate = data.rentingInterest / 100 / 12;
    const n = data.rentingMonths;
    const monthlyRentingQuota = monthlyRate > 0
      ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
      : loanAmount / n;

    const machineBNetProfit = machineBProfit - monthlyRentingQuota;

    setResults({
      machineACost, machineBCost, monthlySavings, annualSavings, roiMonths,
      productionTimeSavings, monthlyRevenue, machineAProfit, machineBProfit,
      monthlyRentingQuota, machineBNetProfit,
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
