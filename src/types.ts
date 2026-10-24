export interface Qualification {
  degree: string;
  institution: string;
  year: number;
  verified: boolean;
}

export interface Certification {
  name: string;
  body: string;
  year: number;
  verified: boolean;
}

export interface Publication {
  title: string;
  journal: string;
  year: number;
  status: string;
}

export interface PassportData {
  fullName: string;
  email: string;
  registrationNo: string;
  currentHospital: string;
  department: string;
  onBoardDate: string;
  designation: string;
  qualifications: Qualification[];
  certifications: Certification[];
  cmePoints: number;
  publications: Publication[];
}

export interface VoiceReport {
  id: string;
  date: string;
  hospital: string;
  category: string;
  content: string;
  sentiment: "Positive" | "Neutral" | "Negative" | string;
  responses: string[];
}

export interface InnovationProject {
  id: string;
  title: string;
  description: string;
  proposer: string;
  date: string;
  upvotes: number;
  fundingStatus: string;
  costEst: string;
  tags: string[];
}

export interface VacancyItem {
  id: string;
  title: string;
  institution: string;
  location: string;
  incentive: string;
  vacanciesAvailable: number;
  description: string;
  pathway: string;
  applied?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "coach";
  text: string;
  timestamp: string;
}

// Workload metrics for Doctor role
export interface ShiftLog {
  date: string;
  hours: number;
  onCall: boolean;
  patientsCheckedCount: number;
}

// Workforce Planning stats for MOH HR Role
export interface HospitalStats {
  name: string;
  region: string;
  currentStaffCount: number;
  expectedResignations6Months: number;
  expectedRetirements6Months: number;
  criticalShortageCategory: string;
  burnoutRiskIndex: number; // 0 - 100
}
