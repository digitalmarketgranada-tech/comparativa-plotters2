import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CalculatorData {
  currentMachineType: string;
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
  currentMachineType: 'Solvente Genérica',
  monthlyVolume: 1500,
  inkPrice: 65,
  printSpeed: 20,
  maintenanceHours: 2,
  waitHours: 6,
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
    // Tinta: 1.2 €/m² (cartucho 1L = 118€, cobertura optimizada)
    // Velocidad: 18 m²/h (según ficha técnica HP Latex 630 - modo exterior 4 pasadas)
    // Mantenimiento: 0 horas/semana (sin mantenimiento preventivo)
    // Espera: 0 horas (secado instantáneo)

    const hpInkCostPerM2 = 1.2; // Por m² impreso
    const hpPrintHours = data.monthlyVolume / data.hpPrintSpeed; // Horas solo impresión
    const hpOperatorCost = hpPrintHours * operatorHourlyRate; // Solo tiempo impresión, SIN mantenimiento
    const hpMonthlyInkCost = data.monthlyVolume * hpInkCostPerM2;
    const hpTotalMonthly = hpMonthlyInkCost + hpOperatorCost; // Costo REAL HP

    // ===== COMPETENCIA (DATOS QUE INTRODUCE EL USUARIO) =====
    // Cobertura tinta solvente: 12ml/m² (0.012 L/m²) - estándar industria
    // Velocidad: la que introduce el usuario
    // Mantenimiento: el que introduce el usuario (horas/semana)
    // Espera: la que introduce el usuario (horas entre print y cut)

    const solventInkCoverage = 0.012; // L/m² - consumo estándar solvente
    const competitorInkCostPerM2 = solventInkCoverage * data.inkPrice; // Calcula €/m² basado en precio/L

    const currentMonthlyInkCost = data.monthlyVolume * competitorInkCostPerM2;
    const currentPrintHours = data.monthlyVolume / data.printSpeed;
    const currentOperatorCost = (currentPrintHours + (data.maintenanceHours * 4)) * operatorHourlyRate; // 4 semanas/mes
    // Coste oportunidad por espera: si esperas 6h por trabajo, hay pérdida de productividad aproximada
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
    // M = P * [r(1+r)^n] / [(1+r)^n – 1]
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
