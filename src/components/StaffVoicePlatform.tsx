import React, { useState } from "react";
import { VoiceReport } from "../types";
import { Megaphone, ShieldAlert, CheckCircle, RefreshCw, Send, Lock, HelpCircle } from "lucide-react";

interface Props {
  reports: VoiceReport[];
  onSubmit: (data: { category: string; hospital: string; content: string }) => void;
  isSubmitting?: boolean;
}

export default function StaffVoicePlatform({ reports, onSubmit, isSubmitting }: Props) {
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string>("Working Hours");
  const [hospital, setHospital] = useState<string>("Hospital Kuala Lumpur (HKL)");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit({
      category,
      hospital: isAnonymous ? "Anonymous Hospital" : hospital,
      content
    });
    setContent("");
  };

  const categories = ["Working Hours", "Bullying", "Staffing Shortages", "Equipment Deficit", "Administrative Burden", "Workplace Culture"];

  return (
    <div className="space-y-6" id="staff-voice-platform">
      
      {/* Platform Description Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Megaphone className="h-4.5 w-4.5 text-rose-500" />
              Core Module 8: Medical Staff Voice & Advocacy Platform
            </h3>
            <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded font-black uppercase">
              ENCRYPTED
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-normal">
            A state-monitored portal to safely report workplace toxicity, bullying, or safety concerns without appraisal repercussions. MoH State Directors review weekly aggregated analytics for targeted leadership adjustments.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl flex items-start gap-2 text-xs text-gray-500">
          <Lock className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-gray-800 block">End-to-End Privacy</span>
            No personal MMC credentials or device identifiers are recorded on submissions. Identifications remain completely decoupled.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Report Submission Form */}
        <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-xs lg:col-span-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 text-left">
              File Anonymous Advocate Report
            </h4>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Issue Classification</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs bg-white text-gray-800 p-2 border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none font-semibold"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <span className="block text-[11px] font-semibold text-gray-700 mb-1">Identity Encryption Setting</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(true)}
                    className={`flex-1 text-xs py-2 rounded border font-semibold transition-all ${
                      isAnonymous 
                        ? "bg-slate-900 text-white border-slate-900" 
                        : "bg-white text-gray-600 border-gray-200"
                    }`}
                  >
                    Anonymous
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(false)}
                    className={`flex-1 text-xs py-2 rounded border font-semibold transition-all ${
                      !isAnonymous 
                        ? "bg-slate-900 text-white border-slate-900" 
                        : "bg-white text-gray-600 border-gray-200"
                    }`}
                  >
                    Disclosed Profile
                  </button>
                </div>
              </div>

              {!isAnonymous && (
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Affiliated Hospital Name</label>
                  <input
                    type="text"
                    required
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    className="w-full text-xs bg-white text-gray-800 p-2 border border-gray-250 rounded-md focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Incident / Concern Description</label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Precisely describe dates, patterns, staffing levels, or toxic environments. Keep records factual."
                  className="w-full text-xs bg-white text-gray-800 p-2.5 border border-gray-250 rounded-md focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Send className="h-4 w-4" /> 
                {isSubmitting ? "Encrypting Posting..." : "Submit to MOH Ethics Unit"}
              </button>
            </form>
          </div>
        </div>

        {/* Live Advocacy Timeline Feed */}
        <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-xs lg:col-span-8">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              Advocacy Board feed & active resolution timeline
            </h4>
            <span className="text-xs font-mono text-gray-400">Total: {reports.length} reports</span>
          </div>

          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
            {reports.map((rep) => {
              const isNeg = rep.sentiment?.toLowerCase() === "negative";
              const isPos = rep.sentiment?.toLowerCase() === "positive";

              return (
                <div key={rep.id} className="p-4 bg-slate-50 border border-slate-150 rounded-xl relative">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-white text-gray-600 border border-gray-200 px-2 py-0.5 rounded">
                        ID: {rep.id}
                      </span>
                      <span className="text-xs font-bold text-gray-900">{rep.hospital}</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[10px]">
                      <span className="text-gray-400">{rep.date}</span>
                      <span>•</span>
                      <span className={`px-1.5 py-0.5 font-bold rounded ${
                        isNeg ? "bg-rose-50 text-rose-600" : isPos ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-600"
                      }`}>
                        {rep.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mt-2.5 leading-relaxed font-medium">
                    {rep.content}
                  </p>

                  {/* MoH administrative follow-up response list */}
                  <div className="mt-4 pt-3.5 border-t border-dashed border-gray-200 space-y-2">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">State Director Action log</span>
                    
                    {rep.responses && rep.responses.length > 0 ? (
                      rep.responses.map((resp, sIdx) => (
                        <div key={sIdx} className="flex gap-2 items-start bg-white p-2 border border-slate-100 rounded text-xs text-slate-700 leading-normal">
                          <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Resolution Step:</strong> {resp}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex gap-2 items-start bg-white p-2 border border-amber-100 rounded text-xs text-amber-700 leading-normal">
                        <RefreshCw className="h-4.5 w-4.5 text-amber-500 animate-spin shrink-0 mt-0.5" />
                        <div>
                          <strong>Queued Status:</strong> Transmitting credentials bypass to state inspection board. Review slated within 48 hour frame.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
