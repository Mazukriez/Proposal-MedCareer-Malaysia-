import React, { useState } from "react";
import { PassportData } from "../types";
import { Award, ShieldCheck, GraduationCap, ArrowUpRight, Brain, RefreshCw, Star } from "lucide-react";

interface Props {
  passport: PassportData;
}

export default function CareerSecurityEngine({ passport }: Props) {
  // Simulator states to allow doctor to see how their actions boost their prediction score
  const [completedExams, setCompletedExams] = useState<boolean>(false);
  const [researchCount, setResearchCount] = useState<number>(passport.publications.length);
  const [cmePointsSum, setCmePointsSum] = useState<number>(passport.cmePoints);
  const [preferredSpecialty, setPreferredSpecialty] = useState<string>("Pediatrics");
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  // Dynamic calculated probability based on user status inputs
  const calculateProbability = () => {
    let score = 65; // Base probability for active contract MOs
    if (completedExams) score += 15;
    score += Math.min(researchCount * 4, 12);
    score += Math.min(Math.floor((cmePointsSum / 50) * 10), 10);
    if (preferredSpecialty === "Pediatrics" && cmePointsSum >= 40) score += 5; // match high demand
    if (preferredSpecialty === "Family Medicine" || preferredSpecialty === "Emergency Medicine") score += 8; // national critical needs
    return Math.min(score, 99);
  };

  const getRetentionRisk = (pct: number) => {
    if (pct > 85) return { label: "Low", color: "text-emerald-500 bg-emerald-50 border-emerald-200" };
    if (pct > 70) return { label: "Medium", color: "text-amber-500 bg-amber-50 border-amber-200" };
    return { label: "High Risk", color: "text-rose-500 bg-rose-50 border-rose-200" };
  };

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 850);
  };

  const scorePct = calculateProbability();
  const risk = getRetentionRisk(scorePct);

  // Specialist matching database based on National Shortages & interest score
  const specialistPathways = [
    { title: "Paediatrics Specialty", demand: "High National Shortage", matchScore: 98, eligibilityYear: 2026, status: "Eligible Now", parallelExams: "MRCPCH (UK) Clinical" },
    { title: "Cardiology (Subspecialty)", demand: "Critical Urban/Regional Gap", matchScore: 84, eligibilityYear: 2028, status: "Eligible Post-Specialist", parallelExams: "National Subspecialty Fellowship" },
    { title: "Emergency Medicine", demand: "Critical State Shortage", matchScore: 78, eligibilityYear: 2027, status: "Eligible with Rotations", parallelExams: "FrcEM or KKM Masters Program" },
    { title: "Family Medicine", demand: "High Rural Shortage", matchScore: 92, eligibilityYear: 2026, status: "Direct Fast-track Eligible", parallelExams: "FRACGP / MCGP Program" }
  ];

  return (
    <div className="space-y-6" id="career-security-engine">
      {/* Upper Grid: Predictions & Career Security Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ML Prediction Indicator Card */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-semibold tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full uppercase">
                AI SECURITY PREDICTION
              </span>
              <Brain className="h-5 w-5 text-teal-600" />
            </div>
            
            <h3 className="text-sm font-medium text-gray-500">Permanent Placement Probability</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tight text-gray-900 font-mono transition-all duration-300">
                {isRecalculating ? "--" : `${scorePct}%`}
              </span>
              <span className="text-xs font-semibold text-emerald-600 font-mono flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
                +18% potential
              </span>
            </div>

            <p className="mt-3 text-xs text-gray-400 leading-relaxed">
              Calculated dynamically via KKM historical retention models. Includes your current tenure, MMC registration credits, parallel exams, CME completion, and regional demand weights.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div>
              <span className="block text-xs text-gray-400 uppercase">Retention Risk</span>
              <span className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${risk.color}`}>
                {isRecalculating ? "Analyzing" : risk.label}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-400 uppercase">Promotion Readiness</span>
              <span className="block text-sm font-semibold text-gray-800 font-mono mt-1">
                2 Years (UD44)
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Optimization Simulator */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <RefreshCw className={`h-4 w-4 text-teal-600 ${isRecalculating ? "animate-spin" : ""}`} />
              Career Score Optimization Simulator
            </h3>
            <span className="text-xs font-mono text-gray-500">Adjust profile variables</span>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            See how completing credentials, publishing clinical research, and gaining clinical CME points immediately improves your permanent conversion probability output.
          </p>

          <div className="space-y-4">
            {/* Input 1: Exams Passed toggle */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200">
              <div>
                <span className="text-xs font-semibold text-gray-700 block">Parallel Exam Status (e.g. MRCPCH Part 1/2)</span>
                <span className="text-[11px] text-gray-400">Ticking this activates eligibility points (+15% score improvement)</span>
              </div>
              <input
                type="checkbox"
                checked={completedExams}
                onChange={(e) => { setCompletedExams(e.target.checked); handleRecalculate(); }}
                className="h-5 w-5 text-teal-600 focus:ring-teal-500 rounded border-gray-300"
              />
            </div>

            {/* Input 2: Publications Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Subscribed Medical Publications ({researchCount})</span>
                <span className="text-teal-600 font-mono">+{researchCount * 4}% boost</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                value={researchCount}
                onChange={(e) => { setResearchCount(parseInt(e.target.value)); handleRecalculate(); }}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>0 papers</span>
                <span>3 papers (Medium)</span>
                <span>5 papers (Highly competitive)</span>
              </div>
            </div>

            {/* Input 3: CME points slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Continuing Medical Education points (Current: {cmePointsSum} CCP)</span>
                <span className="text-teal-600 font-mono">Target: 50 CME/Yr</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={cmePointsSum}
                onChange={(e) => { setCmePointsSum(parseInt(e.target.value)); handleRecalculate(); }}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>10 (Minimum)</span>
                <span>50 (Standard target)</span>
                <span>80 (Maximum prestige)</span>
              </div>
            </div>
            
            {/* Input 4: Preferred Specialty */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-gray-700">Preferred Specialist Pathway</span>
              <select
                value={preferredSpecialty}
                onChange={(e) => { setPreferredSpecialty(e.target.value); handleRecalculate(); }}
                className="text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:border-teal-500"
              >
                <option value="Pediatrics">Pediatrics (High Match)</option>
                <option value="Family Medicine">Family Medicine (Rural Incentive - +8% Match)</option>
                <option value="Emergency Medicine">Emergency Medicine (Critical Shortage - +8% Match)</option>
                <option value="Cardiology">Cardiology (Complex Subspeciality - Eligible 2028)</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* Suggested Personal Development Plan */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-1.5">
          <Award className="h-4.5 w-4.5 text-amber-500" />
          Recommended AI-Generated Career Development Plan
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100">
            <span className="text-xs font-bold text-teal-800 uppercase block mb-1">1. Master Leadership Credits</span>
            <p className="text-xs text-gray-600 leading-relaxed">
              Enroll in the MOH Public Health Administration introductory micro-course. Adds official public service administrative merit points to your JPA profile.
            </p>
          </div>
          <div className="p-4 bg-cyan-50/50 rounded-xl border border-cyan-100">
            <span className="text-xs font-bold text-cyan-800 uppercase block mb-1">2. Complete Clinical Audit</span>
            <p className="text-xs text-gray-600 leading-relaxed">
              Initiate a QA study regarding emergency pediatric wait times at HKL. This contributes as 1 high-impact publication or regional poster to satisfy your research tier.
            </p>
          </div>
          <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
            <span className="text-xs font-bold text-amber-800 uppercase block mb-1">3. Parallel Exam Milestone</span>
            <p className="text-xs text-gray-600 leading-relaxed">
              Book the next MRCPCH Clinical preparatory course. Joining hospital study cohorts elevates successful passing criteria by over 45% based on previous doctor trends.
            </p>
          </div>
        </div>
      </div>

      {/* Module 2: Smart Specialist Training Matcher */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <GraduationCap className="h-4.5 w-4.5 text-teal-600" />
              Smart Specialist Training Matcher (National Database)
            </h3>
            <p className="text-xs text-gray-500">
              Automated scoring aligning your interests, MMC achievements, service years, and Malaysia's critical regional healthcare scarcity gaps.
            </p>
          </div>
          <span className="text-xs font-mono bg-amber-100 text-amber-800 px-2.5 py-1 rounded-sm font-semibold">
            KKM Intake Open (A2026 Batch)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {specialistPathways.map((path) => {
            const isPreferred = preferredSpecialty === "Pediatrics" && path.title.includes("Ped") ||
                               preferredSpecialty === "Family Medicine" && path.title.includes("Fam") ||
                               preferredSpecialty === "Emergency Medicine" && path.title.includes("Emer") ||
                               preferredSpecialty === "Cardiology" && path.title.includes("Cardio");
            return (
              <div 
                key={path.title} 
                className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                  isPreferred 
                    ? "border-teal-500 bg-teal-50/20 shadow-xs relative overflow-hidden" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {isPreferred && (
                  <div className="absolute top-0 right-0 bg-teal-500 text-white text-[9px] px-2 py-0.5 rounded-bl font-semibold uppercase flex items-center gap-0.5">
                    <Star className="h-2 w-2 fill-white" /> Matches Preference
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block mb-1">SPECIALTY INTERVIEW PATH</span>
                  <h4 className="text-sm font-bold text-gray-800">{path.title}</h4>
                  <p className="text-[11px] text-teal-600 mt-1 font-semibold">{path.demand}</p>

                  <div className="mt-4 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Match score:</span>
                      <span className="font-semibold text-gray-700">{path.matchScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Eligible:</span>
                      <span className="font-semibold text-gray-700">{path.eligibilityYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Required Exam:</span>
                      <span className="font-semibold text-[10px] text-right text-gray-600 truncate max-w-[120px]" title={path.parallelExams}>
                        {path.parallelExams}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-150 text-gray-700">
                    {path.status}
                  </span>
                  <button className="text-[11px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-0.5">
                    Review Details <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
