import fs from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), "db");

function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

function readJSON<T>(filename: string, defaultValue: T): T {
  try {
    const fullPath = path.join(DB_DIR, filename);
    if (!fs.existsSync(fullPath)) {
      return defaultValue;
    }
    const data = fs.readFileSync(fullPath, "utf-8");
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return defaultValue;
  }
}

function writeJSON<T>(filename: string, data: T): void {
  try {
    const fullPath = path.join(DB_DIR, filename);
    ensureDirectoryExistence(fullPath);
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
  }
}

export interface RiskAssessment {
  id: string;
  hazard: string;
  category: string;
  location: string;
  description: string;
  likelihood: number; // 1-5
  impact: number;     // 1-5
  score: number;      // likelihood * impact (1-25)
  level: "Low" | "Medium" | "High" | "Very High";
  severityScore?: number; // 1-10 for FMEA
  occurrenceScore?: number; // 1-10 for FMEA
  detectionScore?: number;  // 1-10 for FMEA
  rpn?: number;            // S * O * D
  highSeverityFlag?: boolean; // S >= 8
  existingControls?: string;
  mitigations?: string;
  date: string;
  status: string;
}

export interface Inspection {
  id: string;
  type: string;
  location: string;
  date: string;
  dueDate: string;
  inspector: string;
  status: "Completed" | "In Progress" | "Overdue";
  keyFindings: string;
  defectCount?: number;
  eventCount?: number;
  score?: number;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  location: string;
  item: string;
  expectedStream: "Wet" | "Dry" | "Sanitary" | "Special Care";
  actualStream: "Wet" | "Dry" | "Sanitary" | "Special Care";
  isDefect: boolean;
  isUncertain: boolean;
  failureMode?: string;
  severity?: number;
}

export interface ActionItem {
  id: string;
  title: string;
  hazard: string;
  riskId: string;
  priority: "High" | "Medium" | "Low";
  owner: string;
  ownerRole?: string;
  dueDate: string;
  progress: number;
  status: "In Progress" | "Completed" | "Overdue";
  notes?: string;
}

export interface SettingsData {
  profile: {
    fullName: string;
    email: string;
    role: string;
    phone: string;
    campus: string;
    department: string;
    accountId: string;
    accountStatus: string;
    accountCreated: string;
    lastLogin: string;
  };
  preferences: {
    theme: string;
    language: string;
    dateFormat: string;
    timeFormat: string;
    defaultLocation: string;
    defaultDashboardView: string;
  };
  displayOptions: {
    showQuickStats: boolean;
    enableCompactView: boolean;
    showRiskHeatmap: boolean;
    showRecentActivity: boolean;
  };
  emailPreferences: {
    inspectionReminders: boolean;
    actionPlanDeadlineAlerts: boolean;
    weeklySummaryReport: boolean;
    systemUpdates: boolean;
  };
  locations: Array<{
    id: string;
    name: string;
    type: string;
    active: boolean;
  }>;
}

export const db = {
  getAssessments: () => readJSON<RiskAssessment[]>("assessments.json", []),
  saveAssessment: (item: RiskAssessment) => {
    const list = db.getAssessments();
    const index = list.findIndex((a) => a.id === item.id);
    if (index >= 0) {
      list[index] = item;
    } else {
      list.unshift(item);
    }
    writeJSON("assessments.json", list);
    return item;
  },
  deleteAssessment: (id: string) => {
    const list = db.getAssessments().filter((a) => a.id !== id);
    writeJSON("assessments.json", list);
    return true;
  },

  getInspections: () => readJSON<Inspection[]>("inspections.json", []),
  saveInspection: (item: Inspection) => {
    const list = db.getInspections();
    const index = list.findIndex((i) => i.id === item.id);
    if (index >= 0) {
      list[index] = item;
    } else {
      list.unshift(item);
    }
    writeJSON("inspections.json", list);
    return item;
  },

  getAuditEvents: () => readJSON<AuditEvent[]>("audit_events.json", []),
  saveAuditEvent: (item: AuditEvent) => {
    const list = db.getAuditEvents();
    list.unshift(item);
    writeJSON("audit_events.json", list);
    return item;
  },
  saveAuditEventsBatch: (items: AuditEvent[]) => {
    const list = db.getAuditEvents();
    const combined = [...items, ...list];
    writeJSON("audit_events.json", combined);
    return combined;
  },

  getActions: () => readJSON<ActionItem[]>("actions.json", []),
  saveAction: (item: ActionItem) => {
    const list = db.getActions();
    const index = list.findIndex((a) => a.id === item.id);
    if (index >= 0) {
      list[index] = item;
    } else {
      list.unshift(item);
    }
    writeJSON("actions.json", list);
    return item;
  },

  getScenarios: () => readJSON<any>("scenarios.json", {}),
  saveScenarios: (data: any) => {
    writeJSON("scenarios.json", data);
    return data;
  },

  getSettings: () => readJSON<SettingsData>("settings.json", {} as SettingsData),
  saveSettings: (data: SettingsData) => {
    writeJSON("settings.json", data);
    return data;
  },
};
