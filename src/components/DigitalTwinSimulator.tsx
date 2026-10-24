import React, { useState } from "react";
import { BarChart, Users, AlertTriangle, TrendingDown, Sliders, Shield, Layers, HelpCircle, Activity } from "lucide-react";

export default function DigitalTwinSimulator() {
  // Policy Sliders State
  const [salaryIncrease, setSalaryIncrease] = useState<number>(0); // 0% to 30%
  const [trainingIntake, setTrainingIntake] = useState<number>(0); // -20% to +40%
  const [ruralIncentiveMultiplier, setRuralIncentiveMultiplier] = useState<number>(1); // 1x to 2x
  
  // Dynamic Outputs computed based on sliders to simulate "What if..." digital twin projections
  const calculateOutputs = () => {
    // defaults
    let resignationRisk = 74; // %
    let specialistShortage = 345; // doctors
    let retentionStability = 58; // %
    let stateGapsFilled = 62; // %

    // Adjust based on salary increase
    resignationRisk -= salaryIncrease * 1.2;
    retentionStability += salaryIncrease * 0.9;
    
    // Adjust based on training intake
    specialistShortage -= trainingIntake * 3.5;
    stateGapsFilled += trainingIntake * 0.4;
    
    // Adjust based on Rural incentives
    stateGapsFilled += (ruralIncentiveMultiplier - 1) * 22;
    resignationRisk -= (ruralIncentiveMultiplier - 1) * 8;
    retentionStability += (ruralIncentiveMultiplier - 1) * 6;

    return {
      resignationRisk: Math.max(Math.round(resignationRisk), 15),
      specialistShortage: Math.max(Math.round(specialistShortage), 45),
      retentionStability: Math.min(Math.round(retentionStability), 99),
      stateGapsFilled: Math.min(Math.round(stateGapsFilled), 99)
    };
  };

  const projections = calculateOutputs();

  // Hospital Workforce Data & Prediction status (Core Module 4)
  const hospitalShortageProjections = [
    { hospital: "Hospital Kuala Lumpur (HKL)", resignations: 18, retirements: 6, gapClass: "Emergency & Pediatrics", riskIndex: 88, status: "Critical Shortage" },
    { hospital: "Sarawak General Hospital", resignations: 12, retirements: 2, gapClass: "Anaesthesiology", riskIndex: 72, status: "High Risk" },
    { hospital: "Sultanah Aminah Hospital", resignations: 14, retirements: 4, gapClass: "Internal Medicine", riskIndex: 82, status: "Critical Shortage" },
    { hospital: "Hospital Queen Elizabeth", resignations: 9, retirements: 1, gapClass: "Family Medicine / Rural Outreach", riskIndex: 65, status: "Moderate Gap" },
    { hospital: "Hospital Melaka", resignations: 5, retirements: 3, gapClass: "General Outpatient", riskIndex: 48, status: "Stable" }
  ];

  return (
    <div className="space-y-6" id="digital-twin-simulator">
      {/* Simulation Policy Controls Widget */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Sliders className="h-4.5 w-4.5 text-indigo-600" />
              National Medical Workforce Digital Twin & Simulation Engine
            </h3>
            <p className="text-xs text-gray-500">
              MOH policy forecasting chamber. Play with sliders to evaluate state-level doctor retention indices, retirement gaps, and brain-drain scenarios.
            </p>
          </div>
          <span className="text-[10px] font-mono tracking-wider font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded">
            SIMULATION MODEL ACTIVE (v2.8)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Policy Slider 1: Salary Compensation */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
            <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
              <span>MOH Public Compensation Scale</span>
              <span className="text-indigo-600">+{salaryIncrease}% Increment</span>
            </label>
            <input 
              type="range"
              min="0"
              max="30"
              step="5"
              value={salaryIncrease}
              onChange={(e) => setSalaryIncrease(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="text-[10px] text-gray-400 mt-1 block">Adjusts retention parity compared to Singapore/Australia market standards.</span>
          </div>

          {/* Policy Slider 2: Specialist Training Intake */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
            <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
              <span>Specialist Intake Enrollment</span>
              <span className="text-indigo-600">
                {trainingIntake >= 0 ? `+${trainingIntake}%` : `${trainingIntake}%`}
              </span>
            </label>
            <input 
              type="range"
              min="-20"
              max="40"
              step="10"
              value={trainingIntake}
              onChange={(e) => setTrainingIntake(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="text-[10px] text-gray-400 mt-1 block">Ramps up Parallel Pathway slots and KKM specialist postgraduate funding.</span>
          </div>

          {/* Policy Slider 3: Rural Incentive multiplier */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
            <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
              <span>East Malaysia & Rural Allowance</span>
              <span className="text-indigo-600">{ruralIncentiveMultiplier.toFixed(1)}x Multiplier</span>
            </label>
            <input 
              type="range"
              min="1.0"
              max="2.0"
              step="0.2"
              value={ruralIncentiveMultiplier}
              onChange={(e) => setRuralIncentiveMultiplier(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="text-[10px] text-gray-400 mt-1 block">Augments onboarding speeds and rural vacancy filling ratios.</span>
          </div>
        </div>

        {/* Dynamic Projections Outputs Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-indigo-900 rounded-xl text-white">
          <div>
            <span className="text-[10px] text-indigo-300 block font-mono uppercase tracking-widest">Resignation Risk</span>
            <div className="text-3xl font-bold font-mono tracking-tight mt-1">{projections.resignationRisk}%</div>
            <p className="text-[11px] text-indigo-200 mt-1">Average state flight risk</p>
          </div>
          <div>
            <span className="text-[10px] text-indigo-300 block font-mono uppercase tracking-widest">Active Specialist Deficit</span>
            <div className="text-3xl font-bold font-mono tracking-tight mt-1">{-projections.specialistShortage + 480} staff</div>
            <p className="text-[11px] text-indigo-200 mt-1">Projected national gap</p>
          </div>
          <div>
            <span className="text-[10px] text-indigo-300 block font-mono uppercase tracking-widest">Retention Index</span>
            <div className="text-3xl font-bold font-mono tracking-tight mt-1">{projections.retentionStability}%</div>
            <p className="text-[11px] text-indigo-200 mt-1">National workforce security</p>
          </div>
          <div>
            <span className="text-[10px] text-indigo-300 block font-mono uppercase tracking-widest font-bold">Rural Gaps Met</span>
            <div className="text-3xl font-bold font-mono tracking-tight mt-1 text-emerald-300">{projections.stateGapsFilled}%</div>
            <p className="text-[11px] text-indigo-200 mt-1">Sabah, Sarawak & Pahang coverage</p>
          </div>
        </div>
      </div>

      {/* Core Module 4: Hospital Shortage Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Shortage Checklist Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs lg:col-span-12">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
            <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
            Core Module 4 & 9: Real-time MoH Hospital Workforce Planning & Shortage Forecast
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Predictive machine learning models alerting state directors of anticipated doctor resignations or retirement spikes within the next 6 months. Action panels allow automated reallocations and targeted retention incentives.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-mono text-[10px] uppercase">
                  <th className="py-2.5 px-3">State Hospital Name</th>
                  <th className="py-2.5 px-3">Expected Resignations (6M)</th>
                  <th className="py-2.5 px-3">Expected Retirements (6M)</th>
                  <th className="py-2.5 px-3">Predicted Critical Shortage Unit</th>
                  <th className="py-2.5 px-3">Aggregated Burnout Risk</th>
                  <th className="py-2.5 px-3 text-right">Instant Action Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                {hospitalShortageProjections.map((proj, idx) => {
                  const compensatedResignations = Math.max(Math.round(proj.resignations * (1 - salaryIncrease / 50)), 1);
                  const isCritical = proj.riskIndex > 75;

                  return (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-gray-900">{proj.hospital}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className={`${compensatedResignations < proj.resignations ? "text-emerald-600 line-through text-xs font-mono" : "text-gray-800"}`}>
                            {proj.resignations}
                          </span>
                          {compensatedResignations < proj.resignations && (
                            <span className="text-emerald-600 font-bold">{compensatedResignations}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono">{proj.retirements}</td>
                      <td className="py-3 px-3">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                          {proj.gapClass}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${isCritical ? "bg-rose-500" : "bg-teal-500"}`}
                              style={{ width: `${proj.riskIndex}%` }}
                            ></div>
                          </div>
                          <span className="font-mono text-gray-500">{proj.riskIndex}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex gap-1.5 justify-end">
                          <button 
                            onClick={() => alert(`Initiating direct recruitment budget reallocation to target high risk levels in ${proj.hospital}`)}
                            className="text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-white px-2 py-1.5 rounded"
                          >
                            Reallocate MOs
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
