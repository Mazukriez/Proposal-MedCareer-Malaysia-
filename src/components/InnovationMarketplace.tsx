import React, { useState } from "react";
import { InnovationProject } from "../types";
import { Lightbulb, Award, Heart, PlusCircle, Share2, DollarSign, Search, Plus } from "lucide-react";

interface Props {
  projects: InnovationProject[];
  onUpvote: (id: string) => void;
  onSubmit: (data: { title: string; description: string; costEst: string; tags: string[] }) => void;
}

export default function InnovationMarketplace({ projects, onUpvote, onSubmit }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [costEst, setCostEst] = useState<string>("RM20,000");
  const [selectedTag, setSelectedTag] = useState<string>("Digital Health");
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    onSubmit({
      title,
      description,
      costEst,
      tags: [selectedTag]
    });

    setTitle("");
    setDescription("");
    setCostEst("RM20,000");
    setIsAdding(false);
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.proposer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="innovation-marketplace">
      
      {/* Description Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2">
          <div className="flex items-center gap-1.5 mb-2">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Lightbulb className="h-4.5 w-4.5 text-yellow-500" />
              Core Module 10: KKM Medical Innovation Marketplace
            </h3>
            <span className="text-[10px] font-mono bg-yellow-50 text-yellow-700 px-2.5 py-0.5 rounded font-black uppercase">
              FUNDING PORTAL
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-normal">
            Malaysian doctors write and propose digital health applications, clinical workspace automation tools, or research pathways. Community upvotes and administrative board panels review concepts monthly for direct government seed grants.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between text-xs font-semibold text-gray-700">
          <div>
            <span className="block text-slate-400 font-bold text-[10px] uppercase">Next Review Panel</span>
            <span className="text-indigo-650 font-mono">June 15, 2026</span>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-3.5 py-2 text-xs font-bold transition-all"
          >
            {isAdding ? "Close Form" : "Propose Idea"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Propose Idea Form */}
        {isAdding && (
          <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-xs lg:col-span-12">
            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4">
              Submit Innovator Grant Proposal
            </h4>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Project Concept Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bedside Pediatrics Vitals Log Tablet"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-200 bg-white rounded focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Estimated Seed Budget</label>
                <input
                  type="text"
                  required
                  placeholder="RM25,000"
                  value={costEst}
                  onChange={(e) => setCostEst(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-200 bg-white rounded focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Invention Category</label>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-200 bg-white rounded focus:outline-none focus:border-indigo-500 font-semibold"
                >
                  <option value="Digital Health">Digital Health App</option>
                  <option value="Patient Safety">Patient Safety Tool</option>
                  <option value="Mental Health">Welfare & Decompression</option>
                  <option value="Clinical Workflow">Workflow Optimization</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Comprehensive Implementation Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain exactly how this project will improve local clinical capacity, solve overwork hurdles, or speed up diagnosis times."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 bg-white rounded focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-3 text-right">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Proposals Marketplace */}
        <div className="lg:col-span-12 space-y-4">
          <div className="flex justify-between items-center bg-white p-3 border border-gray-100 rounded-xl">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search ideas, key concepts or clinical proposers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 text-xs pl-9 pr-4 py-1.5 rounded-lg border border-gray-150 focus:outline-none"
              />
            </div>
            <span className="text-xs font-mono text-gray-400 ml-2">Displaying {filtered.length} matches</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((proj) => {
              const isApproved = proj.fundingStatus.includes("Approved");
              return (
                <div 
                  key={proj.id} 
                  className="bg-white rounded-xl border border-gray-150 p-5 flex flex-col justify-between hover:shadow-xs transition-shadow duration-300"
                >
                  <div>
                    <div className="flex justify-between items-start gap-1.5">
                      <span className="text-[10px] font-mono text-gray-400">By {proj.proposer}</span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                        isApproved 
                          ? "bg-emerald-50 text-emerald-800 border-emerald-250" 
                          : "bg-amber-50 text-amber-800 border-amber-250"
                      }`}>
                        {proj.fundingStatus}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-gray-950 mt-2">{proj.title}</h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {proj.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-650 flex items-center gap-1">
                      <DollarSign className="h-4 w-4" /> Cost: {proj.costEst}
                    </span>

                    <button
                      onClick={() => onUpvote(proj.id)}
                      className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 px-2.5 py-1.5 rounded-md font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                      <span>Upvote ({proj.upvotes})</span>
                    </button>
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
