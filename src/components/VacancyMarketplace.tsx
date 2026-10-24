import React, { useState } from "react";
import { VacancyItem } from "../types";
import { Search, MapPin, Award, CheckCircle, Flame, ArrowUpRight, Check, AlertCircle } from "lucide-react";

interface Props {
  vacancies: VacancyItem[];
  appliedJobIds: string[];
  onApply: (id: string) => void;
  preferredPathway?: string;
}

export default function VacancyMarketplace({ vacancies, appliedJobIds, onApply, preferredPathway }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterPathway, setFilterPathway] = useState<string>("All");

  const filtered = vacancies.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.institution.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPathway = 
      filterPathway === "All" || 
      job.pathway === filterPathway;

    return matchesSearch && matchesPathway;
  });

  const uniquePathways = ["All", "Pediatrics", "Emergency Medicine", "Anaesthesiology", "Family Medicine", "Psychiatry"];

  return (
    <div className="space-y-6" id="vacancy-marketplace">
      {/* Vacancy Search Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Award className="h-40 w-40" />
        </div>
        
        <div className="relative z-10">
          <span className="text-[10px] font-bold font-mono tracking-widest text-blue-400 uppercase bg-blue-500/10 px-2.5 py-1 rounded">
            NATIONAL MEDICAL VACANCY BOARD
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-2.5">
            Transparent Internal Openings & Incentives
          </h2>
          <p className="text-xs text-slate-300 mt-2 max-w-xl leading-relaxed">
            Review permanent posts, specialist slots, and research fellowships across KKM hospitals before contemplating private or overseas migration. High incentive allocations prioritize rural and accelerated training.
          </p>

          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search hospital, region, or job criteria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 text-white text-xs pl-9 pr-4 py-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterPathway}
                onChange={(e) => setFilterPathway(e.target.value)}
                className="bg-white/10 text-white text-xs px-3 py-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500 font-semibold"
              >
                {uniquePathways.map((path) => (
                  <option key={path} value={path} className="text-slate-900">
                    {path === "All" ? "Filter by Pathway" : path}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center md:col-span-2">
            <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <h4 className="font-bold text-gray-800">No matching openings found</h4>
            <p className="text-xs text-gray-500 mt-1">Please adjust your search filter or try another clinical pathway.</p>
          </div>
        ) : (
          filtered.map((job) => {
            const hasApplied = appliedJobIds.includes(job.id);
            const matchesUserPathway = preferredPathway && job.pathway.toLowerCase().includes(preferredPathway.toLowerCase());

            return (
              <div 
                key={job.id} 
                className={`bg-white rounded-xl border p-5 flex flex-col justify-between transition-all duration-300 ${
                  hasApplied 
                    ? "border-emerald-500 bg-emerald-50/5" 
                    : matchesUserPathway 
                    ? "border-blue-500 shadow-xs relative" 
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                {matchesUserPathway && !hasApplied && (
                  <span className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] px-2.5 py-0.5 rounded-bl font-semibold uppercase font-mono tracking-wider">
                    Targeted Specialist Match
                  </span>
                )}
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-semibold text-gray-400 uppercase tracking-widest">{job.institution}</span>
                      <h3 className="text-base font-bold text-gray-900 mt-0.5">{job.title}</h3>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">
                      {job.vacanciesAvailable} posts
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-rose-500" />
                    <span>{job.location}</span>
                  </div>

                  <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Incentives Overlay */}
                  <div className="mt-4 p-3 bg-blue-50/60 rounded-lg border border-blue-100 flex items-start gap-2">
                    <Flame className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-955 leading-normal">
                      <span className="font-bold text-blue-900 block">Workforce Incentive Benefit</span>
                      {job.incentive}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">
                    Pathway: <strong className="text-gray-800">{job.pathway}</strong>
                  </span>

                  <button
                    onClick={() => onApply(job.id)}
                    disabled={hasApplied}
                    className={`text-xs px-4 py-2 font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                      hasApplied 
                        ? "bg-emerald-100 text-emerald-800 cursor-not-allowed" 
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    {hasApplied ? (
                      <>
                        <Check className="h-4 w-4" /> Applied Successfully
                      </>
                    ) : (
                      <>
                        Apply Internally KKM <ArrowUpRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
