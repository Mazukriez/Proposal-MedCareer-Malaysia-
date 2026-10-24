import React, { useState, useEffect } from "react";
import { PassportData, VoiceReport, InnovationProject, VacancyItem, ChatMessage } from "./types";
import { 
  Award, ShieldAlert, Badge, Megaphone, Lightbulb, Users, Sliders, Menu, X, 
  Send, Sparkles, User, RefreshCw, BarChart2, ShieldCheck, HelpCircle, GraduationCap, Home
} from "lucide-react";

// Import custom submodules
import CareerSecurityEngine from "./components/CareerSecurityEngine";
import BurnoutAndWorkload from "./components/BurnoutAndWorkload";
import DigitalTwinSimulator from "./components/DigitalTwinSimulator";
import VacancyMarketplace from "./components/VacancyMarketplace";
import StaffVoicePlatform from "./components/StaffVoicePlatform";
import InnovationMarketplace from "./components/InnovationMarketplace";
import DigitalPassport from "./components/DigitalPassport";

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [userRole, setUserRole] = useState<"doctor" | "mo_hr">("doctor");

  // Chatbot Sidebar States
  const [chatOpen, setChatOpen] = useState<boolean>(true);
  const [chatMessage, setChatMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "coach",
      text: "Hello, Dr. Amanda! I am your AI Medical Career Coach. I analyze MoH/KKM workforce grids, subspecialist fellowship openings, and parallel pathways (e.g., MRCPCH Part 1 & 2) with your profile details. How can I guide you today? Try: 'How do I pursue Cardiology?'",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Core Datastorage States synced with API endpoints
  const [passport, setPassport] = useState<PassportData>({
    fullName: "Dr. Amanda Ariffin",
    email: "amanda.ariffin@moh.gov.my",
    registrationNo: "MMC-104829",
    currentHospital: "Hospital Kuala Lumpur (HKL)",
    department: "Pediatrics",
    onBoardDate: "2023-04-12",
    designation: "UD43 Medical Officer (Contract)",
    qualifications: [
      { degree: "Doctor of Medicine (M.D.)", institution: "Universiti Kebangsaan Malaysia (UKM)", year: 2021, verified: true }
    ],
    certifications: [
      { name: "Pediatric Advanced Life Support (PALS)", body: "National Heart Association of Malaysia", year: 2024, verified: true },
      { name: "Basic Life Support (BLS)", body: "MOH Malaysia", year: 2023, verified: true }
    ],
    cmePoints: 42,
    publications: [
      { title: "Retrospective Analysis of Neonatal Sepsis in Urban Klang Valley Hospitals", journal: "Malaysian Journal of Medical Sciences", year: 2024, status: "Published" }
    ]
  });

  const [vacancies, setVacancies] = useState<VacancyItem[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [voiceReports, setVoiceReports] = useState<VoiceReport[]>([]);
  const [innovations, setInnovations] = useState<InnovationProject[]>([]);

  // Fetch all initial data
  useEffect(() => {
    fetchPassport();
    fetchVacancies();
    fetchVoiceReports();
    fetchInnovations();
  }, []);

  const fetchPassport = async () => {
    try {
      const res = await fetch("/api/passport");
      if (res.ok) {
        const data = await res.json();
        setPassport(data);
      }
    } catch (e) {
      console.warn("Failed fetching passport data, falling back offline", e);
    }
  };

  const fetchVacancies = async () => {
    try {
      const res = await fetch("/api/vacancies");
      if (res.ok) {
        const data = await res.json();
        setVacancies(data);
        const applied = data.filter((j: any) => j.applied).map((j: any) => j.id);
        setAppliedJobIds(applied);
      }
    } catch (e) {
      console.warn("Failed fetching vacancies, falling back offline", e);
    }
  };

  const fetchVoiceReports = async () => {
    try {
      const res = await fetch("/api/voice-reports");
      if (res.ok) {
        const data = await res.json();
        setVoiceReports(data);
      }
    } catch (e) {
      console.warn("Failed fetching voice reports", e);
    }
  };

  const fetchInnovations = async () => {
    try {
      const res = await fetch("/api/innovations");
      if (res.ok) {
        const data = await res.json();
        setInnovations(data);
      }
    } catch (e) {
      console.warn("Failed fetching innovation database", e);
    }
  };

  // State Modification handlers
  const handleUpdatePassport = async (updated: PassportData) => {
    setPassport(updated);
    try {
      await fetch("/api/passport", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.error("Offline submission safeguard active", e);
    }
  };

  const handleApplyVacancy = async (id: string) => {
    if (appliedJobIds.includes(id)) return;
    setAppliedJobIds(prev => [...prev, id]);
    try {
      await fetch(`/api/vacancies/${id}/apply`, { method: "POST" });
    } catch (e) {
      console.error("Safeguard application registry failed to transmit", e);
    }
  };

  const handleVoiceSubmit = async (data: { category: string; hospital: string; content: string }) => {
    try {
      const res = await fetch("/api/voice-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const out = await res.json();
        if (out.success) {
          setVoiceReports(prev => [out.data, ...prev]);
        }
      }
    } catch (e) {
      // Offline fallback state update to simulate instantly
      const simulated: VoiceReport = {
        id: "v" + (voiceReports.length + 1),
        date: new Date().toISOString().split("T")[0],
        hospital: data.hospital,
        category: data.category,
        content: data.content,
        sentiment: "Analyzing - Offline Queue",
        responses: []
      };
      setVoiceReports(prev => [simulated, ...prev]);
    }
  };

  const handleInnovationSubmit = async (data: { title: string; description: string; costEst: string; tags: string[] }) => {
    try {
      const res = await fetch("/api/innovations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const out = await res.json();
        if (out.success) {
          setInnovations(prev => [out.data, ...prev]);
        }
      }
    } catch (e) {
      const simulated: InnovationProject = {
        id: "i" + (innovations.length + 1),
        title: data.title,
        description: data.description,
        proposer: passport.fullName,
        date: new Date().toISOString().split("T")[0],
        upvotes: 1,
        fundingStatus: "Pending Allocation",
        costEst: data.costEst,
        tags: data.tags
      };
      setInnovations(prev => [simulated, ...prev]);
    }
  };

  const handleInnovationUpvote = async (id: string) => {
    setInnovations(prev => 
      prev.map(i => i.id === id ? { ...i, upvotes: i.upvotes + 1 } : i)
    );
    try {
      await fetch(`/api/innovations/${id}/vote`, { method: "POST" });
    } catch (e) {
      console.warn("Offline incremental support failed", e);
    }
  };

  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: "u" + Date.now(),
      role: "user",
      text: chatMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    const input = chatMessage;
    setChatMessage("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: chatHistory })
      });
      if (res.ok) {
        const out = await res.json();
        const coachMsg: ChatMessage = {
          id: "c" + Date.now(),
          role: "coach",
          text: out.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory(prev => [...prev, coachMsg]);
      } else {
        throw new Error("Chat response status bad");
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: "error",
        role: "coach",
        text: "I was unable to establish connection to the remote advisor engine. Rest assured, Parallel Examination MRCPCH guidelines and clinical credentials are log-validated! Feel free to retry when network syncing settles.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden" id="applet-viewport">
      
      {/* 1. Left Sidebar Navigation Container */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center text-white font-bold font-mono">
              M
            </div>
            <h1 className="font-bold text-base leading-tight tracking-tight text-slate-800">
              MedCareer <br />
              <span className="text-blue-600 uppercase text-[9px] tracking-widest font-mono font-bold">Malaysia</span>
            </h1>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex-grow py-4 flex flex-col justify-between overflow-y-auto">
          <ul className="space-y-1">
            <li 
              onClick={() => setActiveTab("dashboard")}
              className={`px-6 py-2.5 flex items-center gap-3 font-semibold text-xs uppercase tracking-wide cursor-pointer transition-colors ${
                activeTab === "dashboard" 
                  ? "bg-blue-50 border-r-4 border-blue-600 text-blue-700 font-bold" 
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className={`w-4 h-4 border-2 rounded-sm shrink-0 transition-colors ${
                activeTab === "dashboard" ? "border-blue-600 bg-blue-600" : "border-slate-300"
              }`}></div> 
              Dashboard Profile
            </li>

            <li 
              onClick={() => setActiveTab("passport")}
              className={`px-6 py-2.5 flex items-center gap-3 font-semibold text-xs uppercase tracking-wide cursor-pointer transition-colors ${
                activeTab === "passport" 
                  ? "bg-blue-50 border-r-4 border-blue-600 text-blue-700 font-bold" 
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className={`w-4 h-4 border-2 rounded-sm shrink-0 transition-colors ${
                activeTab === "passport" ? "border-blue-600 bg-blue-600" : "border-slate-300"
              }`}></div> 
              Career Passport
            </li>

            <li 
              onClick={() => setActiveTab("vacancies")}
              className={`px-6 py-2.5 flex items-center gap-3 font-semibold text-xs uppercase tracking-wide cursor-pointer transition-colors ${
                activeTab === "vacancies" 
                  ? "bg-blue-50 border-r-4 border-blue-600 text-blue-700 font-bold" 
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className={`w-4 h-4 border-2 rounded-sm shrink-0 transition-colors ${
                activeTab === "vacancies" ? "border-blue-600 bg-blue-600" : "border-slate-300"
              }`}></div> 
              Vacancy Market
            </li>

            <li 
              onClick={() => setActiveTab("voice")}
              className={`px-6 py-2.5 flex items-center gap-3 font-semibold text-xs uppercase tracking-wide cursor-pointer transition-colors ${
                activeTab === "voice" 
                  ? "bg-blue-50 border-r-4 border-blue-600 text-blue-700 font-bold" 
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className={`w-4 h-4 border-2 rounded-sm shrink-0 transition-colors ${
                activeTab === "voice" ? "border-blue-600 bg-blue-600" : "border-slate-300"
              }`}></div> 
              Staff Voice Platform
            </li>

            <li 
              onClick={() => setActiveTab("innovation")}
              className={`px-6 py-2.5 flex items-center gap-3 font-semibold text-xs uppercase tracking-wide cursor-pointer transition-colors ${
                activeTab === "innovation" 
                  ? "bg-blue-50 border-r-4 border-blue-600 text-blue-700 font-bold" 
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className={`w-4 h-4 border-2 rounded-sm shrink-0 transition-colors ${
                activeTab === "innovation" ? "border-blue-600 bg-blue-600" : "border-slate-300"
              }`}></div> 
              Innovation Hub
            </li>

            {/* Admin view button directly in list */}
            <li 
              onClick={() => setActiveTab("simulator")}
              className={`px-6 py-2.5 flex items-center gap-3 font-semibold text-xs uppercase tracking-wide cursor-pointer transition-colors ${
                activeTab === "simulator" 
                  ? "bg-blue-50 border-r-4 border-blue-600 text-blue-700 font-bold" 
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className={`w-4 h-4 border-2 rounded-sm shrink-0 transition-colors ${
                activeTab === "simulator" ? "border-blue-600 bg-blue-600" : "border-slate-300"
              }`}></div> 
              Policy Digital Twin
            </li>
          </ul>

          {/* Quick AI Coaching Status panel in Sidebar (Satisfies requirement from Design HTML) */}
          <div className="px-6 pt-4 border-t border-slate-100 mt-auto">
            <div className="bg-slate-900 rounded-lg p-4 text-white">
              <p className="text-[10px] uppercase tracking-widest font-bold text-blue-400 mb-1 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> AI COACH SNIPPET
              </p>
              <p className="text-[11px] leading-relaxed opacity-90 italic">
                "Based on your custom Pediatrics publications, you are 18% closer to permanent scale eligibility."
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Frame wrapper */}
      <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
        
        {/* Top Header bar */}
        <header className="h-20 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              {passport.designation}
            </span>
            <h2 className="text-lg font-bold text-slate-800 mt-1">
              {passport.fullName}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Simulation Role Switcher inside top toolbar */}
            <div className="hidden md:flex bg-slate-100 border border-slate-200 p-1 rounded-lg items-center gap-1 text-xs font-semibold">
              <span className="px-2 text-slate-500 font-bold uppercase tracking-wider text-[9px]">Simulator View Role:</span>
              <button 
                onClick={() => { setUserRole("doctor"); setActiveTab("dashboard"); }}
                className={`px-3 py-1 rounded transition-all ${
                  userRole === "doctor" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400 hover:text-slate-700"
                }`}
              >
                Junior Doctor
              </button>
              <button 
                onClick={() => { setUserRole("mo_hr"); setActiveTab("simulator"); }}
                className={`px-3 py-1 rounded transition-all ${
                  userRole === "mo_hr" ? "bg-white text-slate-950 shadow-xs" : "text-slate-400 hover:text-slate-700"
                }`}
              >
                Ministry HR Admin
              </button>
            </div>

            <div className="flex flex-col items-end text-right">
              <span className="text-[8px] font-bold text-slate-400 uppercase leading-none">Registered Hospital</span>
              <span className="text-xs font-bold text-slate-700 mt-1">{passport.currentHospital}</span>
            </div>

            {/* Micro avatar */}
            <div className="w-10 h-10 rounded-full bg-slate-950 border-2 border-slate-300 flex items-center justify-center text-white font-bold font-mono">
              AA
            </div>
          </div>
        </header>

        {/* Tab content view container scrollable */}
        <div className="flex-grow p-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          
          {/* Active Tab render routing */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h2 className="text-xl font-bold font-sans tracking-tight text-slate-800 flex items-center gap-1.5">
                  <Home className="h-5 w-5 text-blue-600" />
                  National Healthcare Security & Retention Dashboard
                </h2>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] uppercase font-bold px-2.5 py-1 rounded font-mono">
                  State Verification: STABLE
                </span>
              </div>

              {/* Core Module 1 & 2 */}
              <CareerSecurityEngine passport={passport} />

              {/* Core Module 3 & 6 */}
              <BurnoutAndWorkload />
            </div>
          )}

          {activeTab === "passport" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-200 pb-3">
                <h2 className="text-xl font-bold font-sans tracking-tight text-slate-800 flex items-center gap-1.5">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Core Module 5: Doctor Digital Career Passport
                </h2>
                <p className="text-xs text-gray-400">Verifiably document qualifications, specialist certifications, CME values, and clinical journals.</p>
              </div>
              <DigitalPassport passport={passport} onUpdate={handleUpdatePassport} />
            </div>
          )}

          {activeTab === "vacancies" && (
            <div className="space-y-6 animate-fade-in">
              <VacancyMarketplace 
                vacancies={vacancies} 
                appliedJobIds={appliedJobIds} 
                onApply={handleApplyVacancy} 
                preferredPathway={passport.department}
              />
            </div>
          )}

          {activeTab === "voice" && (
            <div className="space-y-6 animate-fade-in">
              <StaffVoicePlatform 
                reports={voiceReports} 
                onSubmit={handleVoiceSubmit} 
              />
            </div>
          )}

          {activeTab === "innovation" && (
            <div className="space-y-6 animate-fade-in">
              <InnovationMarketplace 
                projects={innovations} 
                onUpvote={handleInnovationUpvote} 
                onSubmit={handleInnovationSubmit}
              />
            </div>
          )}

          {activeTab === "simulator" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-200 pb-3">
                <h2 className="text-xl font-bold text-slate-850 flex items-center gap-1.5 font-sans">
                  <Sliders className="h-5 w-5 text-indigo-600" />
                  Active National Medical Workforce Digital Twin & Simulator
                </h2>
                <p className="text-xs text-gray-400">Evaluate public compensation indexes, rural allowances and specialist Parallel pathway targets against national retention levels.</p>
              </div>
              <DigitalTwinSimulator />
            </div>
          )}

        </div>

      </main>

      {/* 4. Generative AI Career Coach Side Drawer (Satisfies Sidebar coach chatbot requirement!) */}
      <section className={`bg-white border-l border-slate-200 flex flex-col justify-between shrink-0 transition-all duration-300 ${
        chatOpen ? "w-80" : "w-12"
      }`}>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <Sparkles className="h-5 w-5 text-blue-400 fill-blue-400 animate-pulse" />
            <h3 className="font-bold text-sm tracking-tight">AI Career Coach</h3>
          </div>
          <button 
            onClick={() => setChatOpen(!chatOpen)}
            className="p-1 hover:bg-white/10 rounded transition-colors text-slate-300 hover:text-white"
          >
            {chatOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {chatOpen ? (
          <>
            {/* Conversation Log area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[calc(100vh-140px)]">
              {chatHistory.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div key={msg.id} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                    <span className="text-[9px] font-bold text-gray-400 mb-1 tracking-wider uppercase font-mono">
                      {isUser ? " Amanda Ariffin" : " AI Mentor Coach"} • {msg.timestamp}
                    </span>
                    <div className={`p-3 rounded-xl text-xs leading-normal font-medium max-w-[90%] break-words ${
                      isUser 
                        ? "bg-slate-900 text-white rounded-tr-none" 
                        : "bg-slate-100 border border-slate-150 text-slate-800 rounded-tl-none whitespace-pre-wrap"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              {chatLoading && (
                <div className="flex items-center gap-2 text-xs text-gray-400 italic">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Predicting career trajectory...
                </div>
              )}
            </div>

            {/* Input Send Area */}
            <form onSubmit={handleChatSend} className="p-3 border-t border-slate-200 flex gap-2">
              <input
                type="text"
                placeholder="Ask e.g. MRCPCH details..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 bg-slate-50 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:bg-white font-medium text-gray-800"
              />
              <button 
                type="submit" 
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center pt-8 bg-slate-50 justify-start">
            <Sparkles className="h-5 w-5 text-slate-400 cursor-pointer" onClick={() => setChatOpen(true)} />
          </div>
        )}
      </section>

    </div>
  );
}
