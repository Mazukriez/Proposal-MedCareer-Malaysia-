import React, { useState } from "react";
import { ShieldAlert, Sparkles, Smile, RefreshCw, Calendar, Users, Activity, BarChart2, CheckCircle } from "lucide-react";

export default function BurnoutAndWorkload() {
  // Wellness Survey States
  const [sleepHrs, setSleepHrs] = useState<number>(5);
  const [fatigueLevel, setFatigueLevel] = useState<number>(8); // 1-10
  const [consecutiveOnCalls, setConsecutiveOnCalls] = useState<number>(6);
  const [overtimeHours, setOvertimeHours] = useState<number>(110);
  const [surveySubmitted, setSurveySubmitted] = useState<boolean>(false);

  // Balanced state for Department heatmap workload simulation
  const [isBalanced, setIsBalanced] = useState<boolean>(false);
  const [balancingProgress, setBalancingProgress] = useState<boolean>(false);

  // Dynamic Burnout risk calculator based on doctor inputs
  const calculateBurnoutRisk = () => {
    let score = 40; // baseline
    if (fatigueLevel > 5) score += (fatigueLevel - 5) * 6;
    if (sleepHrs < 6) score += (6 - sleepHrs) * 8;
    score += consecutiveOnCalls * 5;
    score += Math.min(Math.floor(overtimeHours / 3), 30);
    return Math.min(score, 100);
  };

  const riskPct = calculateBurnoutRisk();

  const handleRunBalancer = () => {
    setBalancingProgress(true);
    setTimeout(() => {
      setBalancingProgress(false);
      setIsBalanced(true);
    }, 1200);
  };

  // Mock department dataset before/after automatic rebalancing
  const deptsWorkload = [
    { name: "Pediatrics (Ward 4C)", patients: 145, doctors: 3, beforeRatio: "48:1", afterRatio: "29:1", statusBefore: "Severe Overload", statusAfter: "Balanced", level: "critical" },
    { name: "Emergency Trauma Red Zone", patients: 220, doctors: 4, beforeRatio: "55:1", afterRatio: "36:1", statusBefore: "Severe Overload", statusAfter: "Moderate", level: "critical" },
    { name: "Anaesthesiology & ICU", patients: 85, doctors: 3, beforeRatio: "28:1", afterRatio: "28:1", statusBefore: "Moderate", statusAfter: "Moderate", level: "warning" },
    { name: "Orthopedic Clinic", patients: 90, doctors: 4, beforeRatio: "22:1", afterRatio: "22:1", statusBefore: "Normal", statusAfter: "Normal", level: "success" },
    { name: "General Outpatient Clinic", patients: 310, doctors: 12, beforeRatio: "25:1", afterRatio: "25:1", statusBefore: "Normal", statusAfter: "Normal", level: "success" },
  ];

  return (
    <div className="space-y-6" id="burnout-workload-module">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Burnout Detection & Wellness Survey Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <ShieldAlert className="h-4.5 w-4.5 text-rose-500" />
                Core Module 3 & 9: Burnout & Resignation Risk Engine
              </h3>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                riskPct > 75 ? "bg-rose-50 text-rose-600" : "bg-teal-50 text-teal-600"
              }`}>
                Auto-Alert Status: {riskPct > 75 ? "ACTIVE WARNING" : "OPTIMAL"}
              </span>
            </div>

            {/* Dynamic visual indicator for risk */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6 text-center">
              <span className="text-[10px] uppercase tracking-wider font-mono text-gray-500 block mb-1">
                Synthesized Burnout Metrics Score
              </span>
              <div className="text-4xl font-extrabold font-mono text-slate-800 transition-all duration-300">
                {riskPct}%
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    riskPct > 80 ? "bg-rose-500" : riskPct > 60 ? "bg-amber-500" : "bg-teal-500"
                  }`} 
                  style={{ width: `${riskPct}%` }}
                ></div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {riskPct > 80 ? (
                  <span className="text-rose-600 font-semibold">• 6 consecutive on-calls + {overtimeHours} overtime hrs detected. Triggering priority clinical respite intervention.</span>
                ) : riskPct > 60 ? (
                  <span className="text-amber-600 font-semibold">• Elevating on-call triggers. Recommend requesting CME leave credits.</span>
                ) : (
                  <span className="text-teal-600 font-semibold">• Fatigue and workload constraints are currently in balanced state.</span>
                )}
              </div>
            </div>

            <h4 className="text-xs font-bold text-gray-700 uppercase mb-3">
              Doctor Daily Wellness Check-In (Monthly Assessment)
            </h4>

            <div className="space-y-4">
              {/* Slider 1: Sleep Hours */}
              <div>
                <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                  <span>Average daily sleep (this week):</span>
                  <span className="font-mono text-teal-600 font-semibold">{sleepHrs} hours</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="9"
                  value={sleepHrs}
                  onChange={(e) => setSleepHrs(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>

              {/* Slider 2: Fatigue Rating */}
              <div>
                <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                  <span>Self-recorded fatigue index (1 - 10):</span>
                  <span className="font-mono text-teal-600 font-semibold">{fatigueLevel} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={fatigueLevel}
                  onChange={(e) => setFatigueLevel(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>

              {/* Slider 3: On Calls */}
              <div>
                <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                  <span>Consecutive 24-hr on-call sessions (last 30 days):</span>
                  <span className="font-mono text-teal-600 font-semibold">{consecutiveOnCalls} sessions</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={consecutiveOnCalls}
                  onChange={(e) => setConsecutiveOnCalls(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>

              {/* Slider 4: Overtime hours */}
              <div>
                <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                  <span>Total monthly overtime logged:</span>
                  <span className="font-mono text-teal-600 font-semibold">{overtimeHours} hours</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="160"
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => { setSurveySubmitted(true); setTimeout(() => setSurveySubmitted(false), 2000); }}
              className="text-xs bg-slate-900 text-white rounded-lg px-4 py-2 font-semibold hover:bg-slate-800 transition-colors"
            >
              Submit Daily Wellness Log
            </button>
            {surveySubmitted && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> Logged securely to KKM
              </span>
            )}
          </div>
        </div>

        {/* Workload Distribution Engine */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Activity className="h-4.5 w-4.5 text-teal-600" />
                Core Module 6: Fair Workload Distribution Engine
              </h3>
              <span className="text-xs font-mono text-gray-400">Hospital Kuala Lumpur (HKL)</span>
            </div>
            
            <p className="text-xs text-gray-500 mb-4">
              Real-time regional patient volume statistics pooled from Hospital EMR and Clinical Rosters. Disproportionate patient-to-doctor ratios trigger warnings urging shift reallocation overlays.
            </p>

            {/* Balancer triggers */}
            <div className="mb-4 flex items-center gap-2 justify-between bg-teal-50 px-3.5 py-2.5 rounded-xl border border-teal-100">
              <div className="text-xs text-teal-800 leading-normal">
                <span className="font-bold block">Smart Patient Reroute System</span>
                {isBalanced ? "AI Balancer has reallocated clinical nurse-triage limits. Red-zone ratios optimized!" : "Tension detected. Pediatrics ward MO is seeing 145 patients/day compared to normal outpatient tiers."}
              </div>
              <button 
                onClick={handleRunBalancer}
                disabled={isBalanced || balancingProgress}
                className="text-xs bg-teal-600 text-white rounded px-3 py-1.5 hover:bg-teal-700 transition-colors font-bold shrink-0 disabled:opacity-50"
              >
                {balancingProgress ? "Balancing..." : isBalanced ? "Balanced" : "Run AI Balancer"}
              </button>
            </div>

            {/* Table/Heatmap with before and after ratio updates */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase">
                Clinical Unit Ratio Map
              </h4>

              {deptsWorkload.map((dept) => {
                const ratio = isBalanced ? dept.afterRatio : dept.beforeRatio;
                const status = isBalanced ? dept.statusAfter : dept.statusBefore;
                const isCritical = !isBalanced && dept.level === "critical";

                return (
                  <div 
                    key={dept.name} 
                    className={`flex items-center justify-between p-2.5 rounded-lg border transition-all duration-300 ${
                      isCritical ? "bg-rose-50 border-rose-200" : "bg-white border-gray-100"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-gray-800">{dept.name}</span>
                      <div className="flex gap-2 items-center text-[11px] text-gray-500 mt-0.5">
                        <span>Patients: {dept.patients}</span>
                        <span>•</span>
                        <span>Active Staff: {dept.doctors} MOs</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold font-mono text-gray-700 block">{ratio} ratio</span>
                      <span className={`text-[10px] font-semibold uppercase ${
                        status === "Severe Overload" ? "text-rose-600" : status === "Moderate" ? "text-amber-600" : "text-emerald-600"
                      }`}>
                        {status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mt-5 text-[11px] text-gray-500 leading-normal flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
            <span>
              <strong>Welfare Rule Triggered</strong>: Outpatient clinics automatically take over general triage reviews when emergency wards hit a 45:1 MO-patient caseload limit.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
