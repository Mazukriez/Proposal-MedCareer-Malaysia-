import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database to mimic robust persistence to PostgreSQL/MongoDB
const db = {
  passport: {
    fullName: "Dr. Amanda Ariffin",
    email: "amanda.ariffin@moh.gov.my",
    registrationNo: "MMC-104829",
    currentHospital: "Hospital Kuala Lumpur (HKL)",
    department: "Pediatrics",
    onBoardDate: "2023-04-12",
    designation: "UD43 Medical Officer (Contract)",
    qualifications: [
      { degree: "Doctor of Medicine (M.D.)", institution: "Universiti Kebangsaan Malaysia (UKM)", year: 2021, verified: true },
      { degree: "Foundation in Medical Science", institution: "MARA Matriculation College", year: 2016, verified: true }
    ],
    certifications: [
      { name: "Pediatric Advanced Life Support (PALS)", body: "National Heart Association of Malaysia", year: 2024, verified: true },
      { name: "Basic Life Support (BLS)", body: "MOH Malaysia", year: 2023, verified: true }
    ],
    cmePoints: 42, // Target is 50/year
    publications: [
      { title: "Retrospective Analysis of Neonatal Sepsis in Urban Klang Valley Hospitals", journal: "Malaysian Journal of Medical Sciences", year: 2024, status: "Published" },
      { title: "Improving Triage Communication in Pediatric Emergencies", journal: "MOH Quality Assurance Conference", year: 2025, status: "Presented - Best Poster" }
    ]
  },
  voiceReports: [
    { id: "v1", date: "2026-05-28", hospital: "Hospital Kuala Lumpur", category: "Working Hours", content: "Pediatrics department ran critical staffing shortcuts last weekend. Officers did 32-hour continuous on-call with zero relief staff.", sentiment: "Negative", responses: ["Aesthetic review underway", "Supervisors notified to balance night shifts"] },
    { id: "v2", date: "2026-05-29", hospital: "Sibu Hospital", category: "Equipment Deficit", content: "Major delays in ICU monitors which creates excessive workflow friction and increases error risks. Need direct asset interventions.", sentiment: "Negative", responses: ["Relief ventilators allocated", "Interim monitors on transfer"] },
    { id: "v3", date: "2026-05-30", hospital: "Hospital Melaka", category: "Workplace Culture", content: "Bullying by senior registrars is still very prevalent. Junior MOs are threatened with bad appraisal reports if they request on-call balance.", sentiment: "Negative", responses: ["Referred to state MOH Integrity Unit Board", "Safe contact assigned"] },
    { id: "v4", date: "2026-05-31", hospital: "Hospital Tengku Ampuan Rahimah", category: "Administrative Burden", content: "We spend 3 hours writing physical log records parallel to digital EMR system inputs. Demoralizing double work.", sentiment: "Negative", responses: ["Pilot digitizing logbook project launched"] }
  ],
  innovations: [
    { id: "i1", title: "MOH Pediatrics Tele-Consult Proxy Portal", description: "A simple, low-bandwidth, web-based appointment routing and consultation tracking system for rural community clinics in Sabah sending referrals directly to regional pediatricians.", proposer: "Dr. Amanda Ariffin", date: "2026-05-15", upvotes: 128, fundingStatus: "Under Review", costEst: "RM45,000", tags: ["Digital Health", "Rural Medicine"] },
    { id: "i2", title: "On-Call Handover Digital Checklist App", description: "Replacing written ward whiteboards with a real-time, HIPAA/PDPA-safe bedside summary tablet interface for pediatric ward handovers, preventing transmission errors.", proposer: "Dr. Farhan Syah", date: "2026-05-20", upvotes: 215, fundingStatus: "Approved & Funded", costEst: "RM15,000", tags: ["Patient Safety", "Clinical Workflow"] },
    { id: "i3", title: "Doctor Burnout Self-Recovery Micro-Breaks", description: "Establishing dedicated decompression zones in major public hospitals with guided sensory focus rooms, paired with structured 15-minute scheduled relief protocols.", proposer: "Dr. Rachel Wong", date: "2026-05-22", upvotes: 342, fundingStatus: "Approved & Funded", costEst: "RM60,000", tags: ["Mental Health", "Workplace Welfare"] }
  ],
  vacancies: [
    { id: "job1", title: "Pediatrics Specialist (UD51/52)", institution: "Sarawak General Hospital", location: "Kuching, Sarawak", incentive: "Rural Specialty Allowance (RM12,000/year) + Paid relocation, Accelerated sub-specialist sponsorship.", vacanciesAvailable: 3, description: "Lead pediatrics ward consulting, support rural outreach clinics. Strong sub-specialist training opportunity in pediatric oncology.", pathway: "Pediatrics" },
    { id: "job2", title: "Emergency Medicine Specialist", institution: "Sultanah Aminah Hospital", location: "Johor Bahru, Johor", incentive: "Critical Care Bonus RM10,000 + On-call parity allowances.", vacanciesAvailable: 4, description: "Manage highly active regional trauma departments. Key leadership role with academic residency teaching hours.", pathway: "Emergency Medicine" },
    { id: "job3", title: "Anaesthesiology Registrar & MO", institution: "Hospital Queen Elizabeth II", location: "Kota Kinabalu, Sabah", incentive: "Fast-tracked permanent promotion timeline (accelerated by 12 months) + Borneo regional cost-of-living stipend.", vacanciesAvailable: 5, description: "Join anaesthesiology training team with direct links to intensive care modules.", pathway: "Anaesthesiology" },
    { id: "job4", title: "Family Medicine Specialist", institution: "Klinik Kesihatan Sg. Koyan", location: "Raub, Pahang (Semi-Rural)", incentive: "Rural Pioneer Incentive (RM15,000/year) + Government quarters provided.", vacanciesAvailable: 2, description: "Manage rural general health, chronic disease screening, maternal/infantile welfare.", pathway: "Family Medicine" },
    { id: "job5", title: "Psychiatry Medical Officer", institution: "Hospital Kuala Lumpur", location: "Kuala Lumpur", incentive: "Mental health professional development allowance + research funding opportunities.", vacanciesAvailable: 2, description: "Work under senior psychiatric consultants, support outpatient clinics, participate in active community outreach.", pathway: "Psychiatry" }
  ],
  vacancyApplications: [] as string[] // list of vacancy IDs applied to by current user
};

// Lazy initialization of GoogleGenAI to ensure the server starts even without the key
let genAI: GoogleGenAI | null = null;
function getGenAI() {
  if (!genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      genAI = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    }
  }
  return genAI;
}

// REST API DEFINITIONS

// 1. Digital Passport endpoints
app.get("/api/passport", (req, res) => {
  res.json(db.passport);
});

app.put("/api/passport", (req, res) => {
  db.passport = { ...db.passport, ...req.body };
  res.json({ message: "Passport successfully updated", data: db.passport });
});

// 2. National Vacancies
app.get("/api/vacancies", (req, res) => {
  const data = db.vacancies.map(job => ({
    ...job,
    applied: db.vacancyApplications.includes(job.id)
  }));
  res.json(data);
});

app.post("/api/vacancies/:id/apply", (req, res) => {
  const jobId = req.params.id;
  if (!db.vacancyApplications.includes(jobId)) {
    db.vacancyApplications.push(jobId);
  }
  res.json({ success: true, appliedJobs: db.vacancyApplications });
});

// 3. Voice Reporting Platform (Anonymous)
app.get("/api/voice-reports", (req, res) => {
  res.json(db.voiceReports);
});

app.post("/api/voice-reports", (req, res) => {
  const { category, hospital, content } = req.body;
  if (!category || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Simplified simulated AI Sentiment Analysis via Rule-based fallback
  let sentiment = "Neutral";
  const lowercaseContent = content.toLowerCase();
  const negativeWords = ["bully", "exhausted", "toxic", "burnout", "overwork", "angry", "worst", "threaten", "unfair", "shortage", "delayed", "stress"];
  const positiveWords = ["glad", "resolved", "improved", "helpful", "good", "happy", "fair", "safe"];
  
  let negCount = negativeWords.filter(word => lowercaseContent.includes(word)).length;
  let posCount = positiveWords.filter(word => lowercaseContent.includes(word)).length;

  if (negCount > posCount) {
    sentiment = "Negative";
  } else if (posCount > negCount) {
    sentiment = "Positive";
  }

  const newReport = {
    id: "v" + (db.voiceReports.length + 1),
    date: new Date().toISOString().split("T")[0],
    hospital: hospital || "Anonymous General Hospital",
    category,
    content,
    sentiment,
    responses: []
  };

  db.voiceReports.unshift(newReport);
  res.json({ success: true, data: newReport });
});

// 4. Medical Innovation Marketplace
app.get("/api/innovations", (req, res) => {
  res.json(db.innovations);
});

app.post("/api/innovations", (req, res) => {
  const { title, description, costEst, tags } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: "Title and description required." });
  }

  const newIdea = {
    id: "i" + (db.innovations.length + 1),
    title,
    description,
    proposer: db.passport.fullName,
    date: new Date().toISOString().split("T")[0],
    upvotes: 1,
    fundingStatus: "Pending Assessment",
    costEst: costEst || "RM20,000",
    tags: tags && Array.isArray(tags) ? tags : ["Operational"]
  };

  db.innovations.unshift(newIdea);
  res.json({ success: true, data: newIdea });
});

app.post("/api/innovations/:id/vote", (req, res) => {
  const ideaId = req.params.id;
  const idea = db.innovations.find(i => i.id === ideaId);
  if (idea) {
    idea.upvotes += 1;
    res.json({ success: true, upvotes: idea.upvotes });
  } else {
    res.status(404).json({ error: "Idea not found" });
  }
});

// 5. Generative AI Career Coach
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  const aiClient = getGenAI();
  if (!aiClient) {
    // Elegant fallback simulator of Doctor Career Mentor when GEMINI_API_KEY is not configured.
    console.log("GEMINI_API_KEY is not configured. Simulating medical career advisor...");
    
    // Quick keyword matchmaking for excellent simulated interactions
    let reply = "";
    const msgLower = message.toLowerCase();
    
    if (msgLower.includes("cardiology") || msgLower.includes("heart")) {
      reply = `Hello, Dr. Amanda. As a Pediatric Medical Officer, a pathway toward **Paediatric Cardiology** is highly demanded and rewarding! 
\nTo achieve this in Malaysia, your roadmap consists of:
\n1. **Complete Pediatrics Training**: Pass your Parallel Pathway exams (e.g., MRCPCH UK) or Master of Paediatrics (M.Med) program (Eligibility roughly in 1.5–2 years).
\n2. **National Subspecialty Board Registration**: Enroll as a Paediatric specialist.
\n3. **Cardiology Fellowship**: Apply to the National Heart Institute (IJN) or Serdang Hospital for a 3-year subspecialist fellowship.
\n*Pro-tip*: You already have a research poster on "Neonatal Sepsis". Writing a short case report on neonatal murmurs of congenital structural heart disease would massively boost your clinical profile for the cardiology committee!`;
    } else if (msgLower.includes("parallel") || msgLower.includes("mrcpch") || msgLower.includes("uk")) {
      reply = `Excellent choice. The **MRCPCH (UK) Parallel Pathway** is an outstanding route for Malaysian Doctors seeking career certainty in Pediatrics.
\n- **Current Status**: As a 3rd year Medical Officer (UD43), you have already completed key core pediatric postings.
\n- **Timeline**: 
  - MRCPCH Part 1 & Part 2: Focus on passing these written papers this year. 
  - MRCPCH Clinical: Prepare via prep cohorts in Hospital Kuala Lumpur, which has excellent training hubs.
\n- **MOH Security**: The Ministry of Health officially recognizes the Parallel Pathway. Once you complete the Clinical exam and register under NSR (National Specialist Register), you will immediately be promoted to specialist grade (UD51/UD52) and enjoy permanent retention stability!`;
    } else if (msgLower.includes("burnout") || msgLower.includes("tired") || msgLower.includes("exhausted") || msgLower.includes("on-call")) {
      reply = `Thank you for sharing, Dr. Amanda. Pediatric shifts at HKL are notoriously high-intensity, and your current burnout metrics are showing elevated levels (especially on overtime hours).
\nPlease do not carry this physical burden alone:
\n1. **Duty Hour Offload**: Talk to your Head of Department about splitting that consecutive 32-hour on-call window. Under MOH's new retainment welfare scheme, you are eligible to request rest relief coverage as your burnout indicator exceeds 75%.
\n2. **Support Forums**: Consider submitting an anonymous report to our *Medical Staff Voice Platform*. The Ministry's Ethics Unit trends these reports to rebalance regional staffing shortages.
\n3. **Stay Guided**: Focus on core health metrics. You are a brilliant doctor; protecting your mental stamina is critical for Malaysia's healthcare security. How can I help write a rotation relief proposal to your clinical supervisor?`;
    } else {
      reply = `Hello, Dr. Amanda. I am your **MedCareer Malaysia AI Career Coach**. 
\nI analyze your profile (3rd year Pediatrics MO, UD43 at Hospital Kuala Lumpur) and national healthcare statistics.
\nHow can I support your medical career security today? Here are some options:
\n- **\"How do I pursue Paediatric Cardiology?\"** (Detailed timeline, exams, fellowship requirements)
\n- **\"Explain the MRCPCH Parallel Pathway details in MOH.\"** (Understanding specialized credits)
\n- **\"I feel exhausted and burnt out from HKL night shifts. What should I do?\"** (Strategic advice on welfare policies, workload balance, and support channels)
\n*(Note: I am running in fully authorized local advisory simulation mode because the server is utilizing adaptive failover. Once your GEMINI_API_KEY is registered, I will unlock state-level custom LLM predictions!)*`;
    }

    return res.json({ reply });
  }

  try {
    // Strict compliance with @google/genai guidelines
    const promptContext = `
You are the "MedCareer Malaysia AI Career Coach", a premium national advisor built for doctors and specialists in Malaysia under the Ministry of Health (MOH).
You are talking to Dr. Amanda Ariffin, a 3rd year contract Medical Officer (UD43) currently in the Pediatrics Department at Hospital Kuala Lumpur.
Use precise, respectful, and culturally appropriate clinical career coaching tone. Refer to standard Malaysian pathways (e.g. Master of Medicine (M.Med), MRCPCH, NSR (National Specialist Register), UD43/UD44/UD51/UD52 grades, Public Service Department (JPA), and Ministry of Health (KKM)).

Current Doctor Profile:
- Name: Dr. Amanda Ariffin
- Designation: UD43 contract Medical Officer
- Hospital: Hospital Kuala Lumpur (Pediatrics Department)
- Academic Degrees: MD (UKM)
- CME Points: 42 (target is 50)
- Retention Risk: Low-Medium (due to unresolved contract transition timeline)
- Burnout risk: High (6 on-calls, 95+ hours overtime/month)

Answer professionally, structured in elegant Markdown. Keep your recommendations action-oriented, giving realistic advice to prevent brain drain and secure high career confidence in public services.
    `;

    // Construct history parts if available
    let contents: any[] = [
      { text: promptContext }
    ];

    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({ text: `${h.role === "user" ? "User" : "Coach"}: ${h.text}` });
      });
    }

    contents.push({ text: `User message: ${message}` });

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: "You are an expert medical career mentor, specializing in KKM/MOH medical systems in Malaysia. Guide doctors securely on pathways, Parallel exam structures, research publication optimization, and burnout self-care."
      }
    });

    const reply = response.text || "I was unable to formulate a response. Please try again.";
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini API Error in /api/chat:", error);
    res.status(500).json({ error: "Failed to connect to the AI Career Coach: " + error.message });
  }
});

// Configure Vite integration for SPA development or serve static build
const startViteServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite dev middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production build from dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MedCareer Malaysia server started on http://0.0.0.0:${PORT}`);
  });
};

startViteServer();
