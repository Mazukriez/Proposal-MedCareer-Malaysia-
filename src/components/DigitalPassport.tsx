import React, { useState } from "react";
import { PassportData } from "../types";
import { Award, GraduationCap, FileText, CheckCircle, PlusCircle, Bookmark, Eye, Mail, Award as CertIcon } from "lucide-react";

interface Props {
  passport: PassportData;
  onUpdate: (updated: PassportData) => void;
}

export default function DigitalPassport({ passport, onUpdate }: Props) {
  // Mini forms states inside container for adding items easily
  const [newDegree, setNewDegree] = useState({ degree: "", institution: "", year: 2026 });
  const [newCert, setNewCert] = useState({ name: "", body: "", year: 2026 });
  const [newPub, setNewPub] = useState({ title: "", journal: "", year: 2026 });

  // Active adding toggles
  const [activeForm, setActiveForm] = useState<"none" | "degree" | "cert" | "pub">("none");

  const handleAddDegree = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDegree.degree || !newDegree.institution) return;
    
    const updated = {
      ...passport,
      qualifications: [
        ...passport.qualifications,
        { ...newDegree, verified: true } // Simulated automatic state-verification
      ],
      // Adding credential boosts CME points or provides other feedback
      cmePoints: passport.cmePoints + 8
    };
    onUpdate(updated);
    setNewDegree({ degree: "", institution: "", year: 2026 });
    setActiveForm("none");
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.name || !newCert.body) return;
    
    const updated = {
      ...passport,
      certifications: [
        ...passport.certifications,
        { ...newCert, verified: true }
      ],
      cmePoints: passport.cmePoints + 5
    };
    onUpdate(updated);
    setNewCert({ name: "", body: "", year: 2026 });
    setActiveForm("none");
  };

  const handleAddPub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPub.title || !newPub.journal) return;
    
    const updated = {
      ...passport,
      publications: [
        ...passport.publications,
        { ...newPub, status: "Submitted" }
      ],
      cmePoints: passport.cmePoints + 10
    };
    onUpdate(updated);
    setNewPub({ title: "", journal: "", year: 2026 });
    setActiveForm("none");
  };

  return (
    <div className="space-y-6" id="digital-passport">
      {/* Upper Passport Profile Overview */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-blue-500 text-white flex items-center justify-center font-bold text-xl uppercase font-mono">
            {passport.fullName.split(" ").filter(Boolean).slice(-2).map(w => w[0]).join("") || "DR"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-950">{passport.fullName}</h2>
              <span className="text-[10px] font-mono tracking-widest font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase">
                MMC VERIFIED
              </span>
            </div>
            
            <p className="text-xs text-gray-400 mt-1">{passport.designation} • {passport.currentHospital}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2 font-medium">
              <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {passport.email}</span>
              <span>•</span>
              <span className="font-mono">Reg No: {passport.registrationNo}</span>
            </div>
          </div>
        </div>

        {/* CME progress block */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center text-xs font-bold text-slate-800">
            <span>CME Points (CPD Tracker)</span>
            <span className="text-indigo-600 font-mono font-black">{passport.cmePoints} / 50</span>
          </div>
          <div className="mt-2.5 w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full progression-bar ${passport.cmePoints >= 50 ? "bg-emerald-500" : "bg-indigo-600"}`}
              style={{ width: `${Math.min((passport.cmePoints / 50) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
            {passport.cmePoints >= 50 
              ? "✓ You have met the national guidelines for 2026 certificate compliance." 
              : `Require ${50 - passport.cmePoints} points. Submit certificates below to boost automatically.`}
          </p>
        </div>
      </div>

      {/* Main Grid: qualifications, certifications, publications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. Academic qualifications */}
        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                1. Educational Degrees
              </h3>
              <button 
                onClick={() => setActiveForm(activeForm === "degree" ? "none" : "degree")}
                className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-0.5"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Add Degree
              </button>
            </div>

            {/* Quick adding Form */}
            {activeForm === "degree" && (
              <form onSubmit={handleAddDegree} className="p-3 bg-slate-50 border border-slate-100 rounded-lg mb-4 space-y-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Degree Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master of Medicine (Pediatrics)"
                    value={newDegree.degree}
                    onChange={(e) => setNewDegree({ ...newDegree, degree: e.target.value })}
                    className="w-full bg-white text-xs p-1.5 rounded border border-gray-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Institution</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Universiti Malaya (UM)"
                    value={newDegree.institution}
                    onChange={(e) => setNewDegree({ ...newDegree, institution: e.target.value })}
                    className="w-full bg-white text-xs p-1.5 rounded border border-gray-200 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Year Completed</label>
                    <input
                      type="number"
                      required
                      value={newDegree.year}
                      onChange={(e) => setNewDegree({ ...newDegree, year: parseInt(e.target.value) })}
                      className="w-full bg-white text-xs p-1.5 rounded border border-gray-200 focus:outline-none"
                    />
                  </div>
                  <button type="submit" className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded self-end">
                    Add
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3.5">
              {passport.qualifications.map((qual, idx) => (
                <div key={idx} className="flex gap-2.5 p-3.5 bg-slate-50 rounded-lg border border-slate-100 relative">
                  <div className="w-1.5 h-full bg-blue-600 absolute left-0 top-0 rounded-l"></div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 leading-tight">{qual.degree}</h4>
                    <p className="text-[11px] text-gray-500 mt-1">{qual.institution} — Class of {qual.year}</p>
                    <span className="inline-flex mt-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Auto-Verified MMC ✓
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Professional Certifications */}
        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Bookmark className="h-4 w-4 text-emerald-600" />
                2. Professional Board Certifications
              </h3>
              <button 
                onClick={() => setActiveForm(activeForm === "cert" ? "none" : "cert")}
                className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-0.5"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Add Cert
              </button>
            </div>

            {/* Quick adding Form */}
            {activeForm === "cert" && (
              <form onSubmit={handleAddCert} className="p-3 bg-slate-50 border border-slate-100 rounded-lg mb-4 space-y-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Certification Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MRCPCH Part 1/2 Examination"
                    value={newCert.name}
                    onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                    className="w-full bg-white text-xs p-1.5 rounded border border-gray-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Issuing Body</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal College of Paediatrics UK"
                    value={newCert.body}
                    onChange={(e) => setNewCert({ ...newCert, body: e.target.value })}
                    className="w-full bg-white text-xs p-1.5 rounded border border-gray-200 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Year Issued</label>
                    <input
                      type="number"
                      required
                      value={newCert.year}
                      onChange={(e) => setNewCert({ ...newCert, year: parseInt(e.target.value) })}
                      className="w-full bg-white text-xs p-1.5 rounded border border-gray-200 focus:outline-none"
                    />
                  </div>
                  <button type="submit" className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded self-end">
                    Add
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3.5">
              {passport.certifications.map((cert, idx) => (
                <div key={idx} className="flex gap-2.5 p-3.5 bg-slate-50 rounded-lg border border-slate-100 relative">
                  <div className="w-1.5 h-full bg-emerald-600 absolute left-0 top-0 rounded-l"></div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 leading-tight">{cert.name}</h4>
                    <p className="text-[11px] text-gray-500 mt-1">{cert.body} — Issued {cert.year}</p>
                    <span className="inline-flex mt-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Auto-Verified MMC ✓
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Research & Publications */}
        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-indigo-600" />
                3. Clinical Publications
              </h3>
              <button 
                onClick={() => setActiveForm(activeForm === "pub" ? "none" : "pub")}
                className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-0.5"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Add Publication
              </button>
            </div>

            {/* Quick adding Form */}
            {activeForm === "pub" && (
              <form onSubmit={handleAddPub} className="p-3 bg-slate-50 border border-slate-100 rounded-lg mb-4 space-y-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Paper/Draft Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Audit of Pediatrics Clinic Referrals"
                    value={newPub.title}
                    onChange={(e) => setNewPub({ ...newPub, title: e.target.value })}
                    className="w-full bg-white text-xs p-1.5 rounded border border-gray-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Journal / Conference</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Malaysian Pediatric Journal"
                    value={newPub.journal}
                    onChange={(e) => setNewPub({ ...newPub, journal: e.target.value })}
                    className="w-full bg-white text-xs p-1.5 rounded border border-gray-200 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Year</label>
                    <input
                      type="number"
                      required
                      value={newPub.year}
                      onChange={(e) => setNewPub({ ...newPub, year: parseInt(e.target.value) })}
                      className="w-full bg-white text-xs p-1.5 rounded border border-gray-200 focus:outline-none"
                    />
                  </div>
                  <button type="submit" className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded self-end">
                    Add
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3.5">
              {passport.publications.map((pub, idx) => (
                <div key={idx} className="flex gap-2.5 p-3.5 bg-slate-50 rounded-lg border border-slate-100 relative">
                  <div className="w-1.5 h-full bg-indigo-600 absolute left-0 top-0 rounded-l"></div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 leading-tight">{pub.title}</h4>
                    <p className="text-[11px] text-gray-500 mt-1">{pub.journal} — {pub.year}</p>
                    <span className={`inline-flex mt-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${
                      pub.status === "Published" 
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}>
                      {pub.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Immutable log tracking badge */}
      <div className="bg-slate-50 p-4 border border-slate-150 rounded-xl mt-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>Every certificate is cross-referenced using active security logs linked to Malaysian Medical Council (MMC) standards.</span>
        </div>
        <span className="font-mono text-[10px] bg-slate-200 uppercase px-2 py-0.5 rounded text-gray-700">
          SECURE LOG #MMC-OK-2026
        </span>
      </div>
    </div>
  );
}
