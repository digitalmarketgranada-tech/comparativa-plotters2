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
  hpInkPrice: number; // per Liter
  hpCartridgeSize: number; // Liters
  hpPrintSpeed: number; // m2/h
}

export interface CalculationResults {
  currentMonthlyCost: number;
  hpMonthlyCost: number;
  monthlySavings: number;
  annualSavings: number;
  roiMonths: number;
  timeSavingsPercent: number;
  productionTimeSavings: number; // hours per month
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
  hpMachinePrice: 25000,
  hpInkPrice: 95,
  hpCartridgeSize: 3,
  hpPrintSpeed: 36,
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
  });

  const updateData = (newData: Partial<CalculatorData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const calculate = useCallback(() => {
    // Basic calculation logic (simplified for demo purposes)
    // Assumptions:
    // - Ink coverage: 10ml/m2 for solvent, 12ml/m2 for latex (example)
    // - Operator cost: 20€/hour
    // - Electricity: ignored for simplicity or added as fixed cost
    
    const operatorHourlyRate = 20;
    const solventInkCoverage = 0.012; // L/m2
    const latexInkCoverage = 0.010; // L/m2 (often less due to optimizer)

    // Current Costs
    const currentInkCost = data.monthlyVolume * solventInkCoverage * data.inkPrice;
    const currentPrintHours = data.monthlyVolume / data.printSpeed;
    const currentOperatorCost = (currentPrintHours + (data.maintenanceHours * 4)) * operatorHourlyRate; // Monthly
    // Add wait time cost (opportunity cost or extra labor handling) - simplified
    const currentWaitCost = (data.monthlyVolume / 50) * 0.5 * operatorHourlyRate; // Assume handling time per roll

    const currentTotalMonthly = currentInkCost + currentOperatorCost + currentWaitCost;

    // HP Costs
    const hpInkCost = data.monthlyVolume * latexInkCoverage * data.hpInkPrice;
    const hpPrintHours = data.monthlyVolume / data.hpPrintSpeed;
    // Less maintenance for HP
    const hpMaintenanceHours = 0.5; // per week
    const hpOperatorCost = (hpPrintHours + (hpMaintenanceHours * 4)) * operatorHourlyRate;
    
    const hpTotalMonthly = hpInkCost + hpOperatorCost;

    const monthlySavings = currentTotalMonthly - hpTotalMonthly;
    const annualSavings = monthlySavings * 12;
    const roiMonths = data.hpMachinePrice / monthlySavings;

    // Time Savings
    const totalCurrentTime = currentPrintHours + (data.monthlyVolume / 50 * data.waitHours); // Wait time per roll
    const totalHpTime = hpPrintHours; // Instant dry
    const timeSavingsPercent = ((totalCurrentTime - totalHpTime) / totalCurrentTime) * 100;
    const productionTimeSavings = totalCurrentTime - totalHpTime;

    setResults({
      currentMonthlyCost: currentTotalMonthly,
      hpMonthlyCost: hpTotalMonthly,
      monthlySavings,
      annualSavings,
      roiMonths,
      timeSavingsPercent,
      productionTimeSavings,
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
