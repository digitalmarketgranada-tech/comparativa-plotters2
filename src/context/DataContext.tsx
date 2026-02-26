import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CompetitorMachine {
  brand: 'Roland' | 'Mimaki' | 'Epson';
  model: string;
  printSpeed: number; // m²/h
  inkConsumption: number; // L/m²
  weeklyMaintenance: number; // hours/week
  inkPricePerLiter: number; // €/L reference price
}

export const COMPETITOR_MACHINES: CompetitorMachine[] = [
  // Roland
  { brand: 'Roland', model: 'VersaCAMM VSi-540i', printSpeed: 18.4, inkConsumption: 0.012, weeklyMaintenance: 2.0, inkPricePerLiter: 70 },
  { brand: 'Roland', model: 'VersaCAMM VSi-640i', printSpeed: 21.6, inkConsumption: 0.012, weeklyMaintenance: 2.0, inkPricePerLiter: 70 },
  { brand: 'Roland', model: 'TrueVIS VG2-540', printSpeed: 20.4, inkConsumption: 0.011, weeklyMaintenance: 1.5, inkPricePerLiter: 75 },
  { brand: 'Roland', model: 'TrueVIS VG2-640', printSpeed: 24.0, inkConsumption: 0.011, weeklyMaintenance: 1.5, inkPricePerLiter: 75 },
  { brand: 'Roland', model: 'TrueVIS SG2-540', printSpeed: 19.2, inkConsumption: 0.012, weeklyMaintenance: 2.0, inkPricePerLiter: 68 },
  { brand: 'Roland', model: 'TrueVIS SG2-640', printSpeed: 22.8, inkConsumption: 0.012, weeklyMaintenance: 2.0, inkPricePerLiter: 68 },
  // Mimaki
  { brand: 'Mimaki', model: 'CJV150-75', printSpeed: 14.5, inkConsumption: 0.013, weeklyMaintenance: 2.5, inkPricePerLiter: 65 },
  { brand: 'Mimaki', model: 'CJV150-107', printSpeed: 21.0, inkConsumption: 0.013, weeklyMaintenance: 2.5, inkPricePerLiter: 65 },
  { brand: 'Mimaki', model: 'CJV150-130', printSpeed: 26.0, inkConsumption: 0.013, weeklyMaintenance: 2.5, inkPricePerLiter: 65 },
  { brand: 'Mimaki', model: 'CJV150-160', printSpeed: 32.0, inkConsumption: 0.013, weeklyMaintenance: 2.5, inkPricePerLiter: 65 },
  { brand: 'Mimaki', model: 'CJV300-130', printSpeed: 46.0, inkConsumption: 0.012, weeklyMaintenance: 2.0, inkPricePerLiter: 72 },
  { brand: 'Mimaki', model: 'CJV300-160', printSpeed: 55.0, inkConsumption: 0.012, weeklyMaintenance: 2.0, inkPricePerLiter: 72 },
  // Epson
  { brand: 'Epson', model: 'SureColor SC-S40600', printSpeed: 18.0, inkConsumption: 0.010, weeklyMaintenance: 1.5, inkPricePerLiter: 80 },
  { brand: 'Epson', model: 'SureColor SC-S60600', printSpeed: 35.0, inkConsumption: 0.010, weeklyMaintenance: 1.5, inkPricePerLiter: 80 },
  { brand: 'Epson', model: 'SureColor SC-S80600', printSpeed: 50.0, inkConsumption: 0.010, weeklyMaintenance: 1.0, inkPricePerLiter: 85 },
  { brand: 'Epson', model: 'SureColor SC-S60610', printSpeed: 36.0, inkConsumption: 0.010, weeklyMaintenance: 1.5, inkPricePerLiter: 80 },
];

export interface HPMachine {
  model: string;
  printSpeed: number; // m²/h — modo rápido (4 pasadas), official HP spec
  hasCut: boolean;
}

export const HP_MACHINES: HPMachine[] = [
  { model: 'HP Latex 630 Print & Cut', printSpeed: 18, hasCut: true },
  { model: 'HP Latex 730', printSpeed: 31, hasCut: false },
  { model: 'HP Latex 830', printSpeed: 36, hasCut: false },
];

export interface CalculatorData {
  currentMachineModel: string;
  monthlyVolume: number; // m2
  inkPrice: number; // per Liter
  printSpeed: number; // m2/h
  maintenanceHours: number; // per week
  waitHours: number; // hours between print and cut
  hpMachineModel: string;
  hpMachinePrice: number;
  hpCartridgePrice: number; // price of cartridge
  hpCartridgeSize: number; // 400, 775, or 1000 ml
  hpPrintSpeed: number; // m2/h
  // New fields for precision
  lonaPercentage: number;
  viniloPercentage: number;
  lonaSellPrice: number;
  viniloSellPrice: number;
  // Renting fields
  rentingMonths: number;
  rentingInterest: number;
}

export interface CalculationResults {
  currentMonthlyCost: number;
  hpMonthlyCost: number;
  monthlySavings: number;
  annualSavings: number;
  roiMonths: number;
  timeSavingsPercent: number;
  productionTimeSavings: number; // hours per month
  monthlyRevenue: number;
  currentMonthlyProfit: number;
  hpMonthlyProfit: number;
  monthlyRentingQuota: number;
  hpNetMonthlyProfit: number;
}

interface DataContextType {
  data: CalculatorData;
  results: CalculationResults;
  updateData: (newData: Partial<CalculatorData>) => void;
  calculate: () => void;
}

const defaultData: CalculatorData = {
  currentMachineModel: 'Roland TrueVIS VG2-640',
  monthlyVolume: 1500,
  inkPrice: 75,
  printSpeed: 24,
  maintenanceHours: 1.5,
  waitHours: 36,
  hpMachineModel: 'HP Latex 630 Print & Cut',
  hpMachinePrice: 19900,
  hpCartridgePrice: 118,
  hpCartridgeSize: 1000,
  hpPrintSpeed: 18,
  lonaPercentage: 50,
  viniloPercentage: 50,
  lonaSellPrice: 12,
  viniloSellPrice: 18,
  rentingMonths: 60,
  rentingInterest: 6.5,
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<CalculatorData>(defaultData);
  const [results, setResults] = useState<CalculationResults>({
    currentMonthlyCost: 0,
    hpMonthlyCost: 0,
    monthlySavings: 0,
    annualSavings: 0,
    roiMonths: 0,
    timeSavingsPercent: 0,
    productionTimeSavings: 0,
    monthlyRevenue: 0,
    currentMonthlyProfit: 0,
    hpMonthlyProfit: 0,
    monthlyRentingQuota: 0,
    hpNetMonthlyProfit: 0,
  });

  const updateData = (newData: Partial<CalculatorData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const calculate = useCallback(() => {
    // FÓRMULAS TRANSPARENTES
    // =====================
    // Basadas en datos reales y verificables

    const operatorHourlyRate = 20; // €/hora estándar industria

    // ===== HP LATEX (DATOS FIJOS SEGÚN PDF PROMOCIÓN) =====
    const hpInkCostPerM2 = 1.2; // Por m² impreso
    const hpPrintHours = data.monthlyVolume / data.hpPrintSpeed; // Horas solo impresión
    const hpOperatorCost = hpPrintHours * operatorHourlyRate; // Solo tiempo impresión, SIN mantenimiento
    const hpMonthlyInkCost = data.monthlyVolume * hpInkCostPerM2;
    const hpTotalMonthly = hpMonthlyInkCost + hpOperatorCost; // Costo REAL HP

    // ===== COMPETENCIA (DATOS QUE INTRODUCE EL USUARIO) =====
    const solventInkCoverage = 0.012; // L/m² - consumo estándar solvente
    const competitorInkCostPerM2 = solventInkCoverage * data.inkPrice; // Calcula €/m² basado en precio/L

    const currentMonthlyInkCost = data.monthlyVolume * competitorInkCostPerM2;
    const currentPrintHours = data.monthlyVolume / data.printSpeed;
    const currentOperatorCost = (currentPrintHours + (data.maintenanceHours * 4)) * operatorHourlyRate; // 4 semanas/mes
    const currentWaitCost = (data.monthlyVolume / 50) * 0.5 * operatorHourlyRate; // Manejos de rollo

    const currentTotalMonthly = currentMonthlyInkCost + currentOperatorCost + currentWaitCost;

    const monthlySavings = currentTotalMonthly - hpTotalMonthly;
    const annualSavings = monthlySavings * 12;
    const roiMonths = data.hpMachinePrice / monthlySavings;

    // Time Savings
    const totalCurrentTime = currentPrintHours + (data.monthlyVolume / 50 * data.waitHours); // Wait time per roll
    const totalHpTime = hpPrintHours; // Instant dry
    const timeSavingsPercent = ((totalCurrentTime - totalHpTime) / totalCurrentTime) * 100;
    const productionTimeSavings = totalCurrentTime - totalHpTime;

    // Revenue and Profit Calculations
    const m2Lona = (data.monthlyVolume * data.lonaPercentage) / 100;
    const m2Vinilo = (data.monthlyVolume * data.viniloPercentage) / 100;
    const monthlyRevenue = (m2Lona * data.lonaSellPrice) + (m2Vinilo * data.viniloSellPrice);

    const currentMonthlyProfit = monthlyRevenue - currentTotalMonthly;
    const hpMonthlyProfit = monthlyRevenue - hpTotalMonthly;

    // Renting Calculation (EMI Formula)
    const loanAmount = data.hpMachinePrice;
    const monthlyInterestRate = (data.rentingInterest / 100) / 12;
    const numberOfPayments = data.rentingMonths;

    let monthlyRentingQuota = 0;
    if (monthlyInterestRate > 0) {
      monthlyRentingQuota = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    } else {
      monthlyRentingQuota = loanAmount / numberOfPayments;
    }

    const hpNetMonthlyProfit = hpMonthlyProfit - monthlyRentingQuota;

    setResults({
      currentMonthlyCost: currentTotalMonthly,
      hpMonthlyCost: hpTotalMonthly,
      monthlySavings,
      annualSavings,
      roiMonths,
      timeSavingsPercent,
      productionTimeSavings,
      monthlyRevenue,
      currentMonthlyProfit,
      hpMonthlyProfit,
      monthlyRentingQuota,
      hpNetMonthlyProfit,
    });
  }, [data]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <DataContext.Provider value={{ data, results, updateData, calculate }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
