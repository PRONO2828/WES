import { EventEmitter } from "events";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
const SIGNATURE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";
const JOB_STATUSES = ["Pending", "In Progress", "Completed", "Approved"];
const REVIEW_STATUSES = ["Pending", "Approved", "Rejected"];
const TEAM_STATUSES = ["Available", "Busy", "Off Duty"];
const SERVICE_TYPES = ["Borehole", "Solar", "Water Treatment"];
const DATA_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../../../database");
const DATA_FILE = join(DATA_DIR, "wes-fsm-store.json");

const clone = (value) => JSON.parse(JSON.stringify(value));
const nowIso = () => new Date().toISOString();
const text = (value) => String(value ?? "").trim();
const email = (value) => text(value).toLowerCase();
const num = (value, fallback = null) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

function error(statusCode, message) {
  const result = new Error(message);
  result.statusCode = statusCode;
  return result;
}

function slug(value) {
  return text(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toIso(value, label) {
  const raw = text(value);
  if (!raw) {
    throw error(400, `${label} is required`);
  }
  const parsed = new Date(raw.includes("T") ? raw : `${raw}T00:00:00`);
  if (Number.isNaN(parsed.valueOf())) {
    throw error(400, `${label} must be a valid date/time`);
  }
  return parsed.toISOString();
}

function matchesSearch(search, values) {
  const query = text(search).toLowerCase();
  if (!query) {
    return true;
  }
  const haystack = values.filter(Boolean).join(" ").toLowerCase();
  return query
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
}

function configuredLoginPassword() {
  return text(process.env.WES_FSM_LOGIN_PASSWORD || process.env.WES_LOGIN_PASSWORD);
}

function sanitizeUserRecord(record) {
  if (!record || typeof record !== "object") {
    return record;
  }
  const safeRecord = { ...record };
  for (const key of Object.keys(safeRecord)) {
    if (key.toLowerCase().includes("password")) {
      delete safeRecord[key];
    }
  }
  return safeRecord;
}

function sanitizeDatabase(db) {
  if (!db || typeof db !== "object") {
    return seed();
  }
  if (Array.isArray(db.users)) {
    db.users = db.users.map((entry) => sanitizeUserRecord(entry));
  }
  return db;
}

function seed() {
  return {
    counters: { job: 260406, report: 260406, workshop: 260406, forum: 2605, user: 10 },
    users: [
      { id: "usr-admin-kirui", fullName: "Kirui Isaiah", role: "admin", specialty: "office", email: "kirui@wes-engineering.co.ke", phone: "+254 700 000 101", baseLocation: "Nairobi", teamStatus: "Available", online: true, presenceNote: "Review desk", archived: false },
      { id: "usr-admin-judy", fullName: "Judy", role: "admin", specialty: "office", email: "judy@wes-engineering.co.ke", phone: "+254 700 000 102", baseLocation: "Nairobi", teamStatus: "Available", online: true, presenceNote: "Dispatch desk", archived: false },
      { id: "usr-admin-sang", fullName: "Sang Nicholas", role: "admin", specialty: "office", email: "sang@wes-engineering.co.ke", phone: "+254 700 000 103", baseLocation: "Nairobi", teamStatus: "Available", online: true, presenceNote: "Approvals", archived: false },
      { id: "usr-tech-lewis", fullName: "Lewis", role: "technician", specialty: "field", email: "lewis@wes-engineering.co.ke", phone: "+254 700 000 201", baseLocation: "Nairobi", teamStatus: "Available", online: true, presenceNote: "Karen route", archived: false },
      { id: "usr-tech-kiptoo", fullName: "Kiptoo", role: "technician", specialty: "field", email: "kiptoo@wes-engineering.co.ke", phone: "+254 700 000 202", baseLocation: "Nakuru", teamStatus: "Busy", online: true, presenceNote: "Solar checks", archived: false },
      { id: "usr-tech-ndeda", fullName: "Ndeda", role: "technician", specialty: "field", email: "ndeda@wes-engineering.co.ke", phone: "+254 700 000 203", baseLocation: "Mombasa", teamStatus: "Available", online: false, presenceNote: "Travelling", archived: false },
      { id: "usr-tech-mutuse", fullName: "Mutuse", role: "technician", specialty: "field", email: "mutuse@wes-engineering.co.ke", phone: "+254 700 000 204", baseLocation: "Machakos", teamStatus: "Available", online: true, presenceNote: "Athi River", archived: false },
      { id: "usr-tech-korir", fullName: "Korir", role: "technician", specialty: "field", email: "korir@wes-engineering.co.ke", phone: "+254 700 000 205", baseLocation: "Eldoret", teamStatus: "Busy", online: false, presenceNote: "Awaiting retest", archived: false },
      { id: "usr-tech-richard", fullName: "Richard", role: "technician", specialty: "field", email: "richard@wes-engineering.co.ke", phone: "+254 700 000 206", baseLocation: "Kisumu", teamStatus: "Available", online: true, presenceNote: "Water treatment run", archived: false },
      { id: "usr-tech-victor", fullName: "Victor", role: "technician", specialty: "workshop", email: "victor@wes-engineering.co.ke", phone: "+254 700 000 301", baseLocation: "Workshop", teamStatus: "Available", online: true, presenceNote: "Bench testing", archived: false }
    ],
    jobs: [
      { id: "JOB-260390", jobNumber: "JOB-260390", clientName: "Ruiru Springs Estate", contactName: "Moses Kariuki", contactPhone: "+254 712 300 110", serviceType: "Borehole", manualLocation: "Ruiru Springs Estate", latitude: -1.1452, longitude: 36.9645, description: "Routine borehole servicing and cable inspection completed successfully on the previous visit.", assignedTechnicianId: "usr-tech-lewis", repeatSiteName: "", priority: "Medium", status: "Approved", createdAt: "2026-03-11T05:10:00.000Z", updatedAt: "2026-03-12T11:00:00.000Z" },
      { id: "JOB-260398", jobNumber: "JOB-260398", clientName: "Karen Ridge Villas", contactName: "Janet Kilonzo", contactPhone: "+254 733 117 818", serviceType: "Borehole", manualLocation: "Karen Ridge Villas", latitude: -1.3182, longitude: 36.7063, description: "Previous preventive maintenance for pump lifting, flushing, and water level verification.", assignedTechnicianId: "usr-tech-mutuse", repeatSiteName: "", priority: "Low", status: "Approved", createdAt: "2026-03-08T06:15:00.000Z", updatedAt: "2026-03-09T10:20:00.000Z" },
      { id: "JOB-260401", jobNumber: "JOB-260401", clientName: "Karen Ridge Villas", contactName: "Janet Kilonzo", contactPhone: "+254 733 117 818", serviceType: "Borehole", manualLocation: "Karen Ridge Villas", latitude: -1.3181, longitude: 36.7064, description: "Repeat call after client reported low discharge and intermittent motor tripping.", assignedTechnicianId: "usr-tech-lewis", repeatSiteName: "Karen Ridge Villas", priority: "High", status: "In Progress", createdAt: "2026-03-27T04:20:00.000Z", updatedAt: "2026-03-30T08:29:36.000Z" },
      { id: "JOB-260402", jobNumber: "JOB-260402", clientName: "Nakuru Green Estate", contactName: "Peter Mwangi", contactPhone: "+254 701 556 122", serviceType: "Solar", manualLocation: "Nakuru Town East", latitude: -0.3031, longitude: 36.08, description: "Hybrid inverter shows low battery alarm and daytime transfer to grid.", assignedTechnicianId: "usr-tech-kiptoo", repeatSiteName: "", priority: "Critical", status: "In Progress", createdAt: "2026-03-26T07:00:00.000Z", updatedAt: "2026-03-27T05:30:00.000Z" },
      { id: "JOB-260403", jobNumber: "JOB-260403", clientName: "Kisumu Water Point", contactName: "David Ochieng", contactPhone: "+254 728 445 903", serviceType: "Water Treatment", manualLocation: "Kisumu Water Point", latitude: -0.1022, longitude: 34.7617, description: "High turbidity complaints and reduced chlorine dosing performance at treatment skid.", assignedTechnicianId: "usr-tech-richard", repeatSiteName: "", priority: "Medium", status: "Approved", createdAt: "2026-03-25T06:15:00.000Z", updatedAt: "2026-03-27T04:45:00.000Z" },
      { id: "JOB-260404", jobNumber: "JOB-260404", clientName: "Athi River Packers", contactName: "Esther Muasya", contactPhone: "+254 722 318 410", serviceType: "Borehole", manualLocation: "Athi River Packers", latitude: -1.4561, longitude: 36.9787, description: "Pump overload traced to damaged cable joint and low insulation resistance.", assignedTechnicianId: "usr-tech-ndeda", repeatSiteName: "", priority: "High", status: "Approved", createdAt: "2026-03-22T05:30:00.000Z", updatedAt: "2026-03-24T12:10:00.000Z" },
      { id: "JOB-260405", jobNumber: "JOB-260405", clientName: "Mombasa Port Utility Yard", contactName: "Amina Noor", contactPhone: "+254 720 501 411", serviceType: "Solar", manualLocation: "Mombasa Port Utility Yard", latitude: -4.0447, longitude: 39.6589, description: "Array output is unstable and last report was rejected pending retest and clearer photo evidence.", assignedTechnicianId: "usr-tech-korir", repeatSiteName: "", priority: "High", status: "Approved", createdAt: "2026-03-21T08:40:00.000Z", updatedAt: "2026-03-30T14:28:36.000Z" },
      { id: "JOB-2603300709-7468", jobNumber: "JOB-2603300709-7468", clientName: "Kisumu Water Point", contactName: "David Ochieng", contactPhone: "+254 728 445 903", serviceType: "Water Treatment", manualLocation: "Kisumu Water Point", latitude: -0.1022, longitude: 34.7617, description: "Recovered dispatch record for the March 30 Kisumu Water Point follow-up visit from capture logs.", assignedTechnicianId: "usr-tech-lewis", repeatSiteName: "Kisumu Water Point", priority: "Medium", status: "Approved", createdAt: "2026-03-30T07:10:45.000Z", updatedAt: "2026-03-30T14:28:20.000Z" },
      { id: "JOB-2603301424-F050", jobNumber: "JOB-2603301424-F050", clientName: "Kisumu Water Point", contactName: "David Ochieng", contactPhone: "+254 728 445 903", serviceType: "Water Treatment", manualLocation: "Kisumu Water Point", latitude: -0.1022, longitude: 34.7617, description: "Recovered same-day repeat dispatch for Kisumu Water Point created from the March 30 activity log.", assignedTechnicianId: "usr-tech-lewis", repeatSiteName: "Kisumu Water Point", priority: "High", status: "Approved", createdAt: "2026-03-30T14:24:55.000Z", updatedAt: "2026-03-30T14:28:39.000Z" },
      { id: "JOB-2603301432-E9F7", jobNumber: "JOB-2603301432-E9F7", clientName: "Mombasa Port Utility Yard", contactName: "Amina Noor", contactPhone: "+254 720 501 411", serviceType: "Solar", manualLocation: "Mombasa Port Utility Yard", latitude: -4.0447, longitude: 39.6589, description: "Recovered dispatch record for the later March 30 Mombasa Port Utility Yard visit from the activity log.", assignedTechnicianId: "usr-tech-korir", repeatSiteName: "Mombasa Port Utility Yard", priority: "High", status: "Pending", createdAt: "2026-03-30T14:32:54.000Z", updatedAt: "2026-03-30T14:32:54.000Z" }
    ],
    fieldReports: [
      { id: "RPT-260390", reportNumber: "RPT-260390", jobId: "JOB-260390", technicianId: "usr-tech-lewis", capturedAt: "2026-03-12T08:30:00.000Z", submittedAt: "2026-03-12T08:40:00.000Z", gps: { latitude: -1.1451, longitude: 36.9646 }, diagnosis: "Service inspection found minor sediment buildup but no electrical fault.", workDone: "Lifted the pump, cleaned debris, tested amperage, and recommissioned the system.", materials: [{ id: "mat-260390-1", name: "Cable ties", quantity: "20", unit: "pcs" }, { id: "mat-260390-2", name: "Insulation tape", quantity: "2", unit: "rolls" }], measurements: [{ id: "mea-260390-1", label: "Pump level", value: "39.5", unit: "m" }, { id: "mea-260390-2", label: "Current draw", value: "7.8", unit: "A" }], notes: "Client advised to schedule the next preventive service after six months.", beforeImages: [], afterImages: [], clientApproval: { clientName: "Moses Kariuki", signatureDataUrl: SIGNATURE, signedAt: "2026-03-12T08:38:00.000Z" }, reviewStatus: "Approved", reviewNotes: "Good documentation and clear restoration photos.", reviewedById: "usr-admin-sang", reviewedAt: "2026-03-12T11:00:00.000Z" },
      { id: "RPT-260398", reportNumber: "RPT-260398", jobId: "JOB-260398", technicianId: "usr-tech-mutuse", capturedAt: "2026-03-09T07:10:00.000Z", submittedAt: "2026-03-09T07:25:00.000Z", gps: { latitude: -1.3184, longitude: 36.7061 }, diagnosis: "Routine maintenance found early-stage screen fouling and reduced discharge.", workDone: "Flushed line, cleaned pump housing, and verified static water level.", materials: [{ id: "mat-260398-1", name: "Thread seal tape", quantity: "1", unit: "roll" }], measurements: [{ id: "mea-260398-1", label: "Static water level", value: "19.5", unit: "m" }, { id: "mea-260398-2", label: "Flow rate", value: "13", unit: "m3/hr" }], notes: "This history should appear when the site repeats.", beforeImages: [], afterImages: [], clientApproval: { clientName: "Janet Kilonzo", signatureDataUrl: SIGNATURE, signedAt: "2026-03-09T07:22:00.000Z" }, reviewStatus: "Approved", reviewNotes: "Preventive maintenance report approved.", reviewedById: "usr-admin-kirui", reviewedAt: "2026-03-09T10:20:00.000Z" },
      { id: "RPT-260403", reportNumber: "RPT-260403", jobId: "JOB-260403", technicianId: "usr-tech-richard", capturedAt: "2026-03-27T04:10:00.000Z", submittedAt: "2026-03-27T04:25:00.000Z", gps: { latitude: -0.1021, longitude: 34.7615 }, diagnosis: "Dosing line crystallization and elevated multimedia filter differential pressure.", workDone: "Backwashed the filter, cleaned the dosing line, and recalibrated the metering pump.", materials: [{ id: "mat-260403-1", name: "Dosing line", quantity: "3", unit: "m" }, { id: "mat-260403-2", name: "Non-return valve", quantity: "1", unit: "pc" }], measurements: [{ id: "mea-260403-1", label: "Turbidity", value: "1.8", unit: "NTU" }, { id: "mea-260403-2", label: "Residual chlorine", value: "0.7", unit: "mg/L" }], notes: "Waiting for manager review.", beforeImages: [], afterImages: [], clientApproval: { clientName: "David Ochieng", signatureDataUrl: SIGNATURE, signedAt: "2026-03-27T04:24:00.000Z" }, reviewStatus: "Approved", reviewNotes: "", reviewedById: "usr-admin-sang", reviewedAt: "2026-03-27T04:45:00.000Z" },
      { id: "RPT-260404", reportNumber: "RPT-260404", jobId: "JOB-260404", technicianId: "usr-tech-ndeda", capturedAt: "2026-03-24T09:05:00.000Z", submittedAt: "2026-03-24T09:15:00.000Z", gps: { latitude: -1.4561, longitude: 36.9787 }, diagnosis: "Cable joint insulation breakdown caused overload trips under load.", workDone: "Raised the cable section, reterminated the damaged joint, and tested pump stability.", materials: [{ id: "mat-260404-1", name: "Heat shrink sleeve", quantity: "4", unit: "pcs" }, { id: "mat-260404-2", name: "Waterproof connector", quantity: "1", unit: "pc" }], measurements: [{ id: "mea-260404-1", label: "Insulation resistance", value: "5.2", unit: "MOhm" }, { id: "mea-260404-2", label: "Current draw", value: "8.4", unit: "A" }], notes: "Pump restored to stable duty.", beforeImages: [], afterImages: [], clientApproval: { clientName: "Esther Muasya", signatureDataUrl: SIGNATURE, signedAt: "2026-03-24T09:12:00.000Z" }, reviewStatus: "Approved", reviewNotes: "Approved after photo evidence and stable test values.", reviewedById: "usr-admin-judy", reviewedAt: "2026-03-24T12:10:00.000Z" },
      { id: "RPT-260405", reportNumber: "RPT-260405", jobId: "JOB-260405", technicianId: "usr-tech-korir", capturedAt: "2026-03-26T13:20:00.000Z", submittedAt: "2026-03-26T13:35:00.000Z", gps: { latitude: -4.0448, longitude: 39.6588 }, diagnosis: "Array output fluctuated during cloudy intervals but root cause evidence was incomplete.", workDone: "Reset controller and tightened junction points for temporary stabilization.", materials: [{ id: "mat-260405-1", name: "MC4 connector", quantity: "2", unit: "pcs" }], measurements: [{ id: "mea-260405-1", label: "Array voltage", value: "312", unit: "V" }], notes: "Manager requested clearer before and after photo proof and follow-up test results.", beforeImages: [], afterImages: [], clientApproval: { clientName: "Amina Noor", signatureDataUrl: SIGNATURE, signedAt: "2026-03-26T13:32:00.000Z" }, reviewStatus: "Rejected", reviewNotes: "Rejected. Return with clearer photo sequence and post-repair load test values.", reviewedById: "usr-admin-sang", reviewedAt: "2026-03-26T15:00:00.000Z" }
      ,{ id: "RPT-2603300713-1487", reportNumber: "RPT-2603300713-1487", jobId: "JOB-2603300709-7468", technicianId: "usr-tech-lewis", capturedAt: "2026-03-30T07:12:30.000Z", submittedAt: "2026-03-30T07:13:23.000Z", gps: { latitude: -0.1022, longitude: 34.7617 }, diagnosis: "Recovered report metadata from the March 30 activity log after the API reset.", workDone: "Original field notes were not preserved on disk, so this report was reconstructed from timestamps and site history artifacts.", materials: [], measurements: [], notes: "Recovered from capture log and screenshot history.", beforeImages: [], afterImages: [], clientApproval: { clientName: "David Ochieng", signatureDataUrl: SIGNATURE, signedAt: "2026-03-30T07:13:00.000Z" }, reviewStatus: "Approved", reviewNotes: "", reviewedById: "usr-admin-sang", reviewedAt: "2026-03-30T14:28:20.000Z" }
      ,{ id: "RPT-2603300715-663B", reportNumber: "RPT-2603300715-663B", jobId: "JOB-260405", technicianId: "usr-tech-korir", capturedAt: "2026-03-30T07:14:40.000Z", submittedAt: "2026-03-30T07:15:05.000Z", gps: { latitude: -4.0448, longitude: 39.6588 }, diagnosis: "Recovered report metadata from the March 30 capture history after the API reset.", workDone: "Follow-up completion record restored from dashboard screenshots and activity timestamps.", materials: [], measurements: [], notes: "Recovered from capture log and report list screenshot.", beforeImages: [], afterImages: [], clientApproval: { clientName: "Amina Noor", signatureDataUrl: SIGNATURE, signedAt: "2026-03-30T07:15:00.000Z" }, reviewStatus: "Approved", reviewNotes: "", reviewedById: "usr-admin-sang", reviewedAt: "2026-03-30T14:28:36.000Z" }
      ,{ id: "RPT-2603301426-91C0", reportNumber: "RPT-2603301426-91C0", jobId: "JOB-2603301424-F050", technicianId: "usr-tech-lewis", capturedAt: "2026-03-30T14:26:50.000Z", submittedAt: "2026-03-30T14:26:52.000Z", gps: { latitude: -0.1024, longitude: 34.7617 }, diagnosis: "LONGJVL", workDone: "DYNMNL", materials: [], measurements: [], notes: "FGHFJK", beforeImages: [], afterImages: [], clientApproval: { clientName: "David Ochieng", signatureDataUrl: SIGNATURE, signedAt: "2026-03-30T14:26:52.000Z" }, reviewStatus: "Approved", reviewNotes: "", reviewedById: "usr-admin-sang", reviewedAt: "2026-03-30T14:28:39.000Z" }
    ],
    workshopReports: [
      { id: "WRK-260405", reportNumber: "WRK-260405", jobId: "JOB-260405", technicianId: "usr-tech-victor", repairDetails: "Bench-tested the inverter cooling path and replaced a failing fan assembly.", partsReplaced: [{ id: "wrk-part-1", name: "Cooling fan", quantity: "1", unit: "pc", unitCost: "6500" }, { id: "wrk-part-2", name: "Auxiliary capacitor", quantity: "2", unit: "pc", unitCost: "1800" }], costs: 10100, notes: "Waiting for field reinstall and confirmation test.", beforeImages: [], afterImages: [], createdAt: "2026-03-27T06:05:00.000Z" }
    ],
    activityLogs: [
      { id: "ACT-260330-01", actorName: "Sang Nicholas", message: "Created JOB-2603301432-E9F7 for Mombasa Port Utility Yard and assigned Korir.", createdAt: "2026-03-30T14:32:54.000Z" },
      { id: "ACT-260330-02", actorName: "Sang Nicholas", message: "Approved RPT-2603301426-91C0 for Kisumu Water Point.", createdAt: "2026-03-30T14:28:39.000Z" },
      { id: "ACT-260330-03", actorName: "Sang Nicholas", message: "Approved RPT-2603300715-663B for Mombasa Port Utility Yard.", createdAt: "2026-03-30T14:28:36.000Z" },
      { id: "ACT-260330-04", actorName: "Sang Nicholas", message: "Approved RPT-2603300713-1487 for Kisumu Water Point.", createdAt: "2026-03-30T14:28:20.000Z" },
      { id: "ACT-260330-05", actorName: "Lewis", message: "Submitted RPT-2603301426-91C0 for Kisumu Water Point.", createdAt: "2026-03-30T14:26:52.000Z" },
      { id: "ACT-260330-06", actorName: "Lewis", message: "Started JOB-2603301424-F050 at Kisumu Water Point.", createdAt: "2026-03-30T14:26:08.000Z" },
      { id: "ACT-260330-07", actorName: "Sang Nicholas", message: "Created JOB-2603301424-F050 for Kisumu Water Point and assigned Lewis.", createdAt: "2026-03-30T14:24:55.000Z" },
      { id: "ACT-260330-08", actorName: "Lewis", message: "Started JOB-260401 at Karen Ridge Villas.", createdAt: "2026-03-30T08:29:36.000Z" },
      { id: "ACT-260330-09", actorName: "Lewis", message: "Submitted RPT-2603300713-1487 for Kisumu Water Point.", createdAt: "2026-03-30T07:13:23.000Z" },
      { id: "ACT-260330-10", actorName: "Lewis", message: "Started JOB-2603300709-7468 at Kisumu Water Point.", createdAt: "2026-03-30T07:12:06.000Z" },
      { id: "ACT-260330-11", actorName: "Sang Nicholas", message: "Created JOB-2603300709-7468 for Kisumu Water Point and assigned Lewis.", createdAt: "2026-03-30T07:10:45.000Z" },
      { id: "ACT-3", actorName: "Victor", message: "Logged workshop repair notes for the Mombasa Port inverter assembly.", createdAt: "2026-03-27T06:05:00.000Z" },
      { id: "ACT-1", actorName: "Sang Nicholas", message: "Rejected Korir's first Mombasa Port report and requested clearer before and after photos.", createdAt: "2026-03-26T15:00:00.000Z" },
      { id: "ACT-2", actorName: "Kirui Isaiah", message: "Approved the previous Karen Ridge Villas maintenance report for repeat-site reference.", createdAt: "2026-03-09T10:20:00.000Z" }
    ],
    forumMessages: [
      { id: "MSG-2601", authorId: "usr-admin-sang", channel: "operations", siteTag: "Karen Ridge Villas", body: "Lewis, this is a repeat visit. Please compare with the previous Karen Ridge maintenance report before lifting the pump.", createdAt: "2026-03-27T04:32:00.000Z", replyToId: null, attachments: [] },
      { id: "MSG-2602", authorId: "usr-tech-lewis", channel: "field-updates", siteTag: "Karen Ridge Villas", body: "Copy that. I have reviewed the earlier static water level and discharge values. I will post fresh readings once the site inspection starts.", createdAt: "2026-03-27T04:41:00.000Z", replyToId: "MSG-2601", attachments: [] },
      { id: "MSG-2603", authorId: "usr-tech-victor", channel: "workshop", siteTag: "Mombasa Port Utility Yard", body: "Cooling fan assembly is ready for reinstall. Korir, I have attached the bench notes in the workshop report.", createdAt: "2026-03-27T06:09:00.000Z", replyToId: null, attachments: [] },
      { id: "MSG-2604", authorId: "usr-admin-judy", channel: "social", siteTag: "", body: "Friday check-in: whoever closes the cleanest field report today gets first tea break on Monday.", createdAt: "2026-03-27T07:16:00.000Z", replyToId: null, attachments: [] }
    ]
  };
}

function saveDatabase(db) {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

function loadDatabase() {
  const fallback = sanitizeDatabase(seed());
  if (!existsSync(DATA_FILE)) {
    saveDatabase(fallback);
    return fallback;
  }

  try {
    const parsed = JSON.parse(readFileSync(DATA_FILE, "utf8"));
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Database payload is invalid");
    }
    const sanitized = sanitizeDatabase(parsed);
    if (JSON.stringify(sanitized) !== JSON.stringify(parsed)) {
      saveDatabase(sanitized);
    }
    return sanitized;
  } catch {
    saveDatabase(fallback);
    return fallback;
  }
}

function siteIdFor(job) {
  return `site-${slug(job.repeatSiteName || job.manualLocation || job.clientName || job.id)}`;
}

function userView(record) {
  return record && !record.archived
    ? { id: record.id, fullName: record.fullName, role: record.role, specialty: record.specialty, email: record.email, phone: record.phone, baseLocation: record.baseLocation, teamStatus: record.teamStatus, online: !!record.online, presenceNote: record.presenceNote || "" }
    : null;
}

function ensureUser(store, userId) {
  const record = store.db.users.find((entry) => entry.id === userId && !entry.archived);
  if (!record) throw error(404, "User was not found");
  return record;
}

function ensureJob(store, jobId) {
  const record = store.db.jobs.find((entry) => entry.id === jobId);
  if (!record) throw error(404, "Job was not found");
  return record;
}

function ensureReport(store, reportId) {
  const record = store.db.fieldReports.find((entry) => entry.id === reportId);
  if (!record) throw error(404, "Field report was not found");
  return record;
}

function requireAdmin(user) {
  if (!user || user.role !== "admin") throw error(403, "You do not have access to this action");
}

function requireTechnician(user) {
  if (!user || user.role !== "technician") throw error(403, "You do not have access to this action");
}

function canSeeJob(user, job) {
  return user && (user.role === "admin" || job.assignedTechnicianId === user.id);
}

function canSeeReport(user, report) {
  return user && (user.role === "admin" || report.technicianId === user.id);
}

function canWorkshop(user, job) {
  return user && user.role === "technician" && (job.assignedTechnicianId === user.id || user.specialty === "workshop");
}

function nextId(store, key, prefix) {
  const current = Number(store.db.counters[key] || 1);
  store.db.counters[key] = current + 1;
  return `${prefix}-${current}`;
}

function addActivity(store, actorName, message) {
  store.db.activityLogs.unshift({ id: `ACT-${Date.now()}`, actorName, message, createdAt: nowIso() });
}

function persistStore(store) {
  saveDatabase(store.db);
}

function sortByNewest(entries, field) {
  return [...entries].sort((left, right) => {
    const leftValue = new Date(left?.[field] || 0).valueOf();
    const rightValue = new Date(right?.[field] || 0).valueOf();
    return rightValue - leftValue;
  });
}

function matchesDate(value, expectedDate) {
  const query = text(expectedDate);
  if (!query) {
    return true;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) {
    return false;
  }
  return parsed.toISOString().slice(0, 10) === query;
}

function buildSiteMap(store) {
  const sites = new Map();
  for (const job of sortByNewest(store.db.jobs, "updatedAt")) {
    const id = siteIdFor(job);
    const site =
      sites.get(id) ||
      {
        id,
        name: job.repeatSiteName || job.manualLocation || job.clientName,
        clientName: job.clientName,
        contactName: job.contactName,
        contactPhone: job.contactPhone,
        serviceType: job.serviceType,
        manualLocation: job.manualLocation,
        latitude: job.latitude,
        longitude: job.longitude,
        locationLink: buildLocationLink(job),
        historyCount: 0
      };
    sites.set(id, site);
  }
  for (const report of store.db.fieldReports) {
    const job = store.db.jobs.find((entry) => entry.id === report.jobId);
    if (!job) continue;
    const site = sites.get(siteIdFor(job));
    if (site) site.historyCount += 1;
  }
  return sites;
}

function buildLocationLink(job) {
  if (job.latitude !== null && job.latitude !== undefined && job.longitude !== null && job.longitude !== undefined) {
    return `https://www.google.com/maps?q=${job.latitude},${job.longitude}`;
  }
  const query = encodeURIComponent(job.manualLocation || job.clientName || job.jobNumber || "");
  return query ? `https://www.google.com/maps/search/?api=1&query=${query}` : "#";
}

function buildJob(store, job) {
  const site = buildSiteMap(store).get(siteIdFor(job)) || null;
  return {
    id: job.id,
    jobNumber: job.jobNumber,
    clientName: job.clientName,
    contactName: job.contactName,
    contactPhone: job.contactPhone,
    serviceType: job.serviceType,
    manualLocation: job.manualLocation,
    latitude: job.latitude,
    longitude: job.longitude,
    description: job.description,
    assignedTechnicianId: job.assignedTechnicianId,
    assignedTechnician: userView(store.db.users.find((entry) => entry.id === job.assignedTechnicianId)),
    repeatSiteName: job.repeatSiteName || "",
    priority: job.priority,
    status: job.status,
    site: site ? clone(site) : null,
    locationLink: buildLocationLink(job),
    createdAt: job.createdAt,
    updatedAt: job.updatedAt
  };
}

function buildReport(store, report) {
  const job = ensureJob(store, report.jobId);
  return {
    id: report.id,
    reportNumber: report.reportNumber,
    jobId: report.jobId,
    technicianId: report.technicianId,
    technicianName: ensureUser(store, report.technicianId).fullName,
    capturedAt: report.capturedAt,
    submittedAt: report.submittedAt,
    gps: clone(report.gps || { latitude: null, longitude: null }),
    diagnosis: report.diagnosis,
    workDone: report.workDone,
    materials: clone(report.materials || []),
    measurements: clone(report.measurements || []),
    notes: report.notes || "",
    beforeImages: clone(report.beforeImages || []),
    afterImages: clone(report.afterImages || []),
    clientApproval: clone(report.clientApproval || {}),
    reviewStatus: report.reviewStatus,
    reviewNotes: report.reviewNotes || "",
    reviewedById: report.reviewedById || null,
    reviewedAt: report.reviewedAt || null,
    job: buildJob(store, job),
    site: buildSiteMap(store).get(siteIdFor(job)) || null
  };
}

function buildWorkshop(store, report) {
  return {
    id: report.id,
    reportNumber: report.reportNumber,
    jobId: report.jobId,
    technicianId: report.technicianId,
    technicianName: ensureUser(store, report.technicianId).fullName,
    repairDetails: report.repairDetails,
    partsReplaced: clone(report.partsReplaced || []),
    costs: Number(report.costs || 0),
    notes: report.notes || "",
    beforeImages: clone(report.beforeImages || []),
    afterImages: clone(report.afterImages || []),
    createdAt: report.createdAt
  };
}

function buildMessage(store, message) {
  const author = userView(store.db.users.find((entry) => entry.id === message.authorId));
  const reply = message.replyToId ? store.db.forumMessages.find((entry) => entry.id === message.replyToId) : null;
  const replyAuthor = reply ? userView(store.db.users.find((entry) => entry.id === reply.authorId)) : null;
  return {
    id: message.id,
    channel: message.channel,
    siteTag: message.siteTag || "",
    body: message.body,
    createdAt: message.createdAt,
    authorId: message.authorId,
    authorName: author?.fullName || "Unknown User",
    attachments: clone(message.attachments || []),
    replyToId: message.replyToId || null,
    replyTo: reply ? { id: reply.id, body: reply.body, authorName: replyAuthor?.fullName || "Unknown User" } : null
  };
}

export function createStore() {
  const store = {
    db: loadDatabase(),
    events: new EventEmitter(),
    getUserById(userId) {
      return userView(this.db.users.find((entry) => entry.id === userId));
    },
    listAuthOptions() {
      return this.db.users.filter((entry) => !entry.archived).map(userView).filter(Boolean);
    },
    authenticateWithPassword(identity, password) {
      const expectedPassword = configuredLoginPassword();
      if (!expectedPassword) {
        throw error(503, "Login password is not configured on this server");
      }
      const lookup = text(identity).toLowerCase();
      const user = this.db.users.find((entry) => !entry.archived && [entry.id.toLowerCase(), entry.fullName.toLowerCase(), entry.email.toLowerCase()].includes(lookup));
      if (!user || text(password) !== expectedPassword) throw error(401, "Invalid email/name or password");
      return userView(user);
    },
    touchPresence(userId, payload = {}) {
      const user = ensureUser(this, userId);
      user.online = payload.online !== false;
      user.presenceNote = text(payload.presenceNote) || user.presenceNote;
      if (TEAM_STATUSES.includes(text(payload.teamStatus))) user.teamStatus = text(payload.teamStatus);
      if (text(payload.baseLocation)) user.baseLocation = text(payload.baseLocation);
      persistStore(this);
      this.events.emit("presence:update", { onlineUsers: getOnlineUsers(this) });
      return userView(user);
    },
    logout(userId) {
      const user = ensureUser(this, userId);
      user.online = false;
      persistStore(this);
      this.events.emit("presence:update", { onlineUsers: getOnlineUsers(this) });
      return { success: true };
    }
  };
  persistStore(store);
  return store;
}

export function getDashboard(store, user) {
  const jobs = listJobs(store, user);
  const reports = listFieldReports(store, user);
  if (user.role === "admin") {
    const reviewQueue = getReviewQueue(store, user);
    const technicianActivity = store.db.users
      .filter((entry) => entry.role === "technician" && !entry.archived)
      .map((entry) => {
        const assigned = store.db.jobs.filter((job) => job.assignedTechnicianId === entry.id);
        const reportsSubmitted = store.db.fieldReports.filter((report) => report.technicianId === entry.id);
        return {
          technician: userView(entry),
          assignedJobs: assigned.length,
          pendingJobs: assigned.filter((job) => job.status === "Pending").length,
          inProgressJobs: assigned.filter((job) => job.status === "In Progress").length,
          completedJobs: assigned.filter((job) => ["Completed", "Approved"].includes(job.status)).length,
          reportsSubmitted: reportsSubmitted.length
        };
      });
    return {
      metrics: {
        activeJobs: store.db.jobs.filter((entry) => ["Pending", "In Progress", "Completed"].includes(entry.status)).length,
        completedJobs: store.db.jobs.filter((entry) => entry.status === "Approved").length,
        pendingReports: store.db.fieldReports.filter((entry) => entry.reviewStatus === "Pending").length,
        approvedReports: store.db.fieldReports.filter((entry) => entry.reviewStatus === "Approved").length,
        rejectedReports: store.db.fieldReports.filter((entry) => entry.reviewStatus === "Rejected").length,
        reviewQueueCount: reviewQueue.count
      },
      technicianActivity,
      reviewQueue,
      recentJobs: jobs.slice(0, 6),
      recentReports: reports.slice(0, 6),
      activityFeed: sortByNewest(store.db.activityLogs, "createdAt").slice(0, 8)
    };
  }
  return {
    metrics: {
      assignedJobs: jobs.length,
      pendingJobs: jobs.filter((entry) => entry.status === "Pending").length,
      inProgressJobs: jobs.filter((entry) => entry.status === "In Progress").length,
      completedJobs: jobs.filter((entry) => ["Completed", "Approved"].includes(entry.status)).length,
      submittedReports: reports.length
    },
    jobsByStatus: {
      pending: jobs.filter((entry) => entry.status === "Pending"),
      inProgress: jobs.filter((entry) => entry.status === "In Progress"),
      completed: jobs.filter((entry) => ["Completed", "Approved"].includes(entry.status))
    },
    recentReports: reports.slice(0, 6),
    activityFeed: sortByNewest(store.db.activityLogs, "createdAt").slice(0, 6)
  };
}

export function listUsers(store, user, filters = {}) {
  requireAdmin(user);
  return store.db.users
    .filter((entry) => {
      if (!filters.includeArchived && entry.archived) return false;
      if (filters.role && text(filters.role) !== entry.role) return false;
      if (filters.specialty && text(filters.specialty) !== entry.specialty) return false;
      return true;
    })
    .map(userView)
    .filter(Boolean);
}

export function createTechnician(store, user, payload) {
  requireAdmin(user);
  const fullName = text(payload.fullName || payload.name);
  const specialty = ["field", "workshop"].includes(text(payload.specialty)) ? text(payload.specialty) : "field";
  const record = { id: `usr-tech-${slug(fullName) || store.db.counters.user++}`, fullName, role: "technician", specialty, email: email(payload.email), phone: text(payload.phone), baseLocation: text(payload.baseLocation), teamStatus: TEAM_STATUSES.includes(text(payload.teamStatus)) ? text(payload.teamStatus) : "Available", online: false, presenceNote: text(payload.presenceNote), archived: false };
  if (!record.fullName || !record.email) throw error(400, "Full name and email are required");
  if (store.db.users.some((entry) => !entry.archived && entry.email === record.email)) throw error(409, "A user with that email already exists");
  store.db.users.push(record);
  addActivity(store, user.fullName, `Added ${record.fullName} to the technician roster.`);
  persistStore(store);
  return userView(record);
}

export function updateUserStatus(store, user, userId, payload) {
  requireAdmin(user);
  const record = ensureUser(store, userId);
  if (payload.teamStatus && !TEAM_STATUSES.includes(text(payload.teamStatus))) throw error(400, "Team status is invalid");
  record.teamStatus = text(payload.teamStatus) || record.teamStatus;
  record.baseLocation = text(payload.baseLocation) || record.baseLocation;
  record.phone = text(payload.phone) || record.phone;
  record.presenceNote = text(payload.presenceNote) || record.presenceNote;
  persistStore(store);
  return userView(record);
}

export function resetUserPassword(store, user, userId, payload) {
  requireAdmin(user);
  ensureUser(store, userId);
  if (!configuredLoginPassword()) {
    throw error(400, "Set WES_FSM_LOGIN_PASSWORD on the server to manage workspace logins");
  }
  return { success: true, message: "Workspace logins are managed through WES_FSM_LOGIN_PASSWORD." };
}

export function archiveUser(store, user, userId) {
  requireAdmin(user);
  const record = ensureUser(store, userId);
  record.archived = true;
  record.online = false;
  persistStore(store);
  return { success: true };
}

export function listSites(store, user, search) {
  requireAdmin(user);
  return [...buildSiteMap(store).values()].filter((site) => matchesSearch(search, [site.name, site.clientName]));
}

export function getSiteHistoryBySiteId(store, user, siteId) {
  requireAdmin(user);
  const site = buildSiteMap(store).get(siteId);
  if (!site) throw error(404, "Site was not found");
  const reports = sortByNewest(store.db.fieldReports.filter((entry) => siteIdFor(ensureJob(store, entry.jobId)) === siteId), "submittedAt").map((entry) => buildReport(store, entry));
  return { site: clone(site), reports };
}

export function listJobs(store, user, filters = {}) {
  return sortByNewest(
    store.db.jobs.filter((entry) => canSeeJob(user, entry) && (!filters.serviceType || text(filters.serviceType) === entry.serviceType) && (!filters.status || text(filters.status) === entry.status) && (!filters.technicianId || text(filters.technicianId) === entry.assignedTechnicianId) && matchesSearch(filters.search, [entry.jobNumber, entry.clientName, entry.contactName, entry.contactPhone, entry.manualLocation, entry.description, entry.serviceType])),
    "updatedAt"
  ).map((entry) => buildJob(store, entry));
}

export function getJobDetail(store, user, jobId) {
  const job = ensureJob(store, jobId);
  if (!canSeeJob(user, job)) throw error(403, "You do not have access to this job");
  const siteId = siteIdFor(job);
  return {
    job: buildJob(store, job),
    site: buildSiteMap(store).get(siteId) || null,
    reports: sortByNewest(store.db.fieldReports.filter((entry) => entry.jobId === job.id), "submittedAt").map((entry) => buildReport(store, entry)),
    siteHistory: sortByNewest(store.db.fieldReports.filter((entry) => siteIdFor(ensureJob(store, entry.jobId)) === siteId), "submittedAt").map((entry) => buildReport(store, entry)),
    workshopReports: sortByNewest(store.db.workshopReports.filter((entry) => entry.jobId === job.id), "createdAt").map((entry) => buildWorkshop(store, entry))
  };
}

export function createJob(store, user, payload) {
  requireAdmin(user);
  const technician = ensureUser(store, payload.assignedTechnicianId || payload.assignedEngineerId);
  if (technician.role !== "technician" || technician.specialty !== "field") throw error(400, "Assigned technician is invalid");
  const serviceType = text(payload.serviceType);
  if (!SERVICE_TYPES.includes(serviceType)) throw error(400, "Service type is invalid");
  const id = nextId(store, "job", "JOB");
  const job = { id, jobNumber: id, clientName: text(payload.clientName), contactName: text(payload.contactName || payload.contactPerson), contactPhone: text(payload.contactPhone), serviceType, manualLocation: text(payload.manualLocation || payload.siteName), latitude: num(payload.latitude, null), longitude: num(payload.longitude, null), description: text(payload.description), assignedTechnicianId: technician.id, repeatSiteName: text(payload.repeatSiteName), priority: text(payload.priority) || "Medium", status: "Pending", createdAt: nowIso(), updatedAt: nowIso() };
  if (!job.clientName || !job.contactName || !job.contactPhone || !job.manualLocation) throw error(400, "Client, contact, phone, and location are required");
  store.db.jobs.unshift(job);
  addActivity(store, user.fullName, `Created ${job.jobNumber} and assigned it to ${technician.fullName}.`);
  persistStore(store);
  return getJobDetail(store, user, job.id);
}

export function updateJob(store, user, jobId, payload) {
  requireAdmin(user);
  const job = ensureJob(store, jobId);
  if (payload.assignedTechnicianId || payload.assignedEngineerId) {
    const technician = ensureUser(store, payload.assignedTechnicianId || payload.assignedEngineerId);
    if (technician.role !== "technician" || technician.specialty !== "field") throw error(400, "Assigned technician is invalid");
    job.assignedTechnicianId = technician.id;
  }
  if (payload.status && !JOB_STATUSES.includes(text(payload.status))) throw error(400, "Job status is invalid");
  job.clientName = text(payload.clientName) || job.clientName;
  job.contactName = text(payload.contactName || payload.contactPerson) || job.contactName;
  job.contactPhone = text(payload.contactPhone) || job.contactPhone;
  job.serviceType = text(payload.serviceType) || job.serviceType;
  job.manualLocation = text(payload.manualLocation) || job.manualLocation;
  job.description = text(payload.description) || job.description;
  job.priority = text(payload.priority) || job.priority;
  job.repeatSiteName = text(payload.repeatSiteName) || job.repeatSiteName;
  job.status = text(payload.status) || job.status;
  if (payload.latitude !== undefined) job.latitude = num(payload.latitude, null);
  if (payload.longitude !== undefined) job.longitude = num(payload.longitude, null);
  job.updatedAt = nowIso();
  persistStore(store);
  return buildJob(store, job);
}

export function startJob(store, user, jobId) {
  requireTechnician(user);
  const job = ensureJob(store, jobId);
  if (!canSeeJob(user, job)) throw error(403, "You are not assigned to this job");
  if (job.status === "Pending") {
    job.status = "In Progress";
    job.updatedAt = nowIso();
    addActivity(store, user.fullName, `Started ${job.jobNumber}.`);
    persistStore(store);
  }
  return getJobDetail(store, user, job.id);
}

export function submitFieldReport(store, user, jobId, payload) {
  requireTechnician(user);
  const job = ensureJob(store, jobId);
  if (!canSeeJob(user, job)) throw error(403, "You are not assigned to this job");
  const beforeImages = Array.isArray(payload.beforeImages) ? payload.beforeImages.filter((entry) => text(entry?.dataUrl)) : [];
  const afterImages = Array.isArray(payload.afterImages) ? payload.afterImages.filter((entry) => text(entry?.dataUrl)) : [];
  const approval = { clientName: text(payload.clientApproval?.clientName), signatureDataUrl: text(payload.clientApproval?.signatureDataUrl), signedAt: text(payload.clientApproval?.signedAt) ? toIso(payload.clientApproval.signedAt, "Signed at") : nowIso() };
  if (!text(payload.diagnosis) || !text(payload.workDone)) throw error(400, "Diagnosis and work done are required");
  if (!beforeImages.length || !afterImages.length) throw error(400, "At least one before image and one after image are required");
  if (!approval.clientName || !approval.signatureDataUrl) throw error(400, "Client approval name and signature are required");
  const id = nextId(store, "report", "RPT");
  const report = { id, reportNumber: id, jobId: job.id, technicianId: user.id, capturedAt: text(payload.capturedAt) ? toIso(payload.capturedAt, "Captured at") : nowIso(), submittedAt: nowIso(), gps: { latitude: num(payload.gps?.latitude, null), longitude: num(payload.gps?.longitude, null) }, diagnosis: text(payload.diagnosis), workDone: text(payload.workDone), materials: Array.isArray(payload.materials) ? payload.materials.map((entry, index) => ({ id: `${id}-mat-${index + 1}`, name: text(entry?.name), quantity: text(entry?.quantity), unit: text(entry?.unit) })).filter((entry) => entry.name || entry.quantity || entry.unit) : [], measurements: Array.isArray(payload.measurements) ? payload.measurements.map((entry, index) => ({ id: `${id}-mea-${index + 1}`, label: text(entry?.label), value: text(entry?.value), unit: text(entry?.unit) })).filter((entry) => entry.label || entry.value || entry.unit) : [], notes: text(payload.notes), beforeImages: clone(beforeImages), afterImages: clone(afterImages), clientApproval: approval, reviewStatus: "Pending", reviewNotes: "", reviewedById: null, reviewedAt: null };
  store.db.fieldReports.unshift(report);
  job.status = "Completed";
  job.updatedAt = nowIso();
  addActivity(store, user.fullName, `Submitted ${report.reportNumber} for ${job.jobNumber}.`);
  persistStore(store);
  return getFieldReportDetail(store, user, report.id);
}

export function listFieldReports(store, user, filters = {}) {
  return sortByNewest(
    store.db.fieldReports.filter((entry) => {
      const job = ensureJob(store, entry.jobId);
      return (
        canSeeReport(user, entry) &&
        (!filters.jobId || text(filters.jobId) === entry.jobId) &&
        (!filters.status || text(filters.status) === entry.reviewStatus) &&
        (!filters.technicianId || text(filters.technicianId) === entry.technicianId) &&
        (!filters.siteId || text(filters.siteId) === siteIdFor(job))
      );
    }),
    "submittedAt"
  ).map((entry) => buildReport(store, entry));
}

export function getFieldReportDetail(store, user, reportId) {
  const report = ensureReport(store, reportId);
  if (!canSeeReport(user, report)) throw error(403, "You do not have access to this report");
  const job = ensureJob(store, report.jobId);
  const siteId = siteIdFor(job);
  return {
    report: buildReport(store, report),
    job: buildJob(store, job),
    siteHistory: sortByNewest(store.db.fieldReports.filter((entry) => siteIdFor(ensureJob(store, entry.jobId)) === siteId), "submittedAt").map((entry) => buildReport(store, entry)),
    workshopReports: sortByNewest(store.db.workshopReports.filter((entry) => entry.jobId === job.id), "createdAt").map((entry) => buildWorkshop(store, entry))
  };
}

export function getReviewQueue(store, user) {
  requireAdmin(user);
  const items = sortByNewest(store.db.fieldReports.filter((entry) => entry.reviewStatus === "Pending"), "submittedAt").map((entry) => buildReport(store, entry));
  return { count: items.length, current: items[0] || null, items };
}

export function reviewFieldReport(store, user, reportId, payload) {
  requireAdmin(user);
  const report = ensureReport(store, reportId);
  const job = ensureJob(store, report.jobId);
  const status = text(payload.status);
  if (!["Approved", "Rejected"].includes(status)) throw error(400, "Review status is invalid");
  report.reviewStatus = status;
  report.reviewNotes = text(payload.reviewNotes);
  report.reviewedById = user.id;
  report.reviewedAt = nowIso();
  job.status = status === "Approved" ? "Approved" : "In Progress";
  job.updatedAt = nowIso();
  addActivity(store, user.fullName, `${status} ${report.reportNumber} for ${job.jobNumber}.`);
  persistStore(store);
  return {
    ...getFieldReportDetail(store, user, report.id),
    reviewQueue: getReviewQueue(store, user)
  };
}

export function getReportForPdf(store, user, reportId) {
  const report = ensureReport(store, reportId);
  if (!canSeeReport(user, report)) throw error(403, "You do not have access to this report");
  if (report.reviewStatus !== "Approved") throw error(409, "Only approved reports can be exported");
  const job = ensureJob(store, report.jobId);
  return {
    report: buildReport(store, report),
    job: buildJob(store, job),
    workshopReports: sortByNewest(store.db.workshopReports.filter((entry) => entry.jobId === job.id), "createdAt").map((entry) => buildWorkshop(store, entry))
  };
}

export function getWorkshopReports(store, user, filters = {}) {
  return sortByNewest(
    store.db.workshopReports.filter((entry) => {
      const job = ensureJob(store, entry.jobId);
      return (user.role === "admin" || canWorkshop(user, job) || entry.technicianId === user.id) && (!filters.jobId || text(filters.jobId) === entry.jobId);
    }),
    "createdAt"
  ).map((entry) => buildWorkshop(store, entry));
}

export function submitWorkshopReport(store, user, jobId, payload) {
  requireTechnician(user);
  const job = ensureJob(store, jobId);
  if (!canWorkshop(user, job)) throw error(403, "You do not have access to log workshop work for this job");
  const id = nextId(store, "workshop", "WRK");
  const report = { id, reportNumber: id, jobId: job.id, technicianId: user.id, repairDetails: text(payload.repairDetails), partsReplaced: Array.isArray(payload.partsReplaced) ? payload.partsReplaced.map((entry, index) => ({ id: `${id}-part-${index + 1}`, name: text(entry?.name), quantity: text(entry?.quantity), unit: text(entry?.unit), unitCost: text(entry?.unitCost) })) : [], costs: num(payload.costs, 0) || 0, notes: text(payload.notes), beforeImages: Array.isArray(payload.beforeImages) ? clone(payload.beforeImages) : [], afterImages: Array.isArray(payload.afterImages) ? clone(payload.afterImages) : [], createdAt: nowIso() };
  if (!report.repairDetails) throw error(400, "Repair details are required");
  store.db.workshopReports.unshift(report);
  addActivity(store, user.fullName, `Logged workshop report ${report.reportNumber} for ${job.jobNumber}.`);
  persistStore(store);
  return buildWorkshop(store, report);
}

export function searchWorkspace(store, user, filters = {}) {
  const jobs = listJobs(store, user, { serviceType: filters.serviceType, status: filters.status, technicianId: filters.technicianId, search: [filters.technicianName, filters.siteName, filters.clientName, filters.workType].filter(Boolean).join(" ") }).filter((entry) => matchesDate(entry.createdAt, filters.date));
  const reports = listFieldReports(store, user, { status: filters.status, technicianId: filters.technicianId }).filter((entry) => matchesSearch(filters.technicianName, [entry.technicianName]) && matchesSearch(filters.siteName, [entry.site?.name, entry.job?.manualLocation]) && matchesSearch(filters.clientName, [entry.job?.clientName]) && matchesSearch(filters.workType, [entry.diagnosis, entry.workDone, entry.job?.serviceType]) && matchesDate(entry.submittedAt, filters.date));
  return { jobs, reports, total: jobs.length + reports.length };
}

export function listForumMessages(store) {
  return { messages: sortByNewest(store.db.forumMessages, "createdAt").map((entry) => buildMessage(store, entry)), onlineUsers: getOnlineUsers(store) };
}

export function getOnlineUsers(store) {
  return store.db.users.filter((entry) => !entry.archived && entry.online).map(userView).filter(Boolean);
}

export function createForumMessage(store, user, payload) {
  const body = text(payload.body || payload.message);
  if (!body) throw error(400, "Message body is required");
  const id = nextId(store, "forum", "MSG");
  const message = { id, authorId: user.id, channel: text(payload.channel) || "operations", siteTag: text(payload.siteTag), body, createdAt: nowIso(), replyToId: text(payload.replyToId) || null, attachments: Array.isArray(payload.attachments) ? clone(payload.attachments) : [] };
  store.db.forumMessages.unshift(message);
  const built = buildMessage(store, message);
  persistStore(store);
  store.events.emit("forum:message", { message: built, onlineUsers: getOnlineUsers(store) });
  return built;
}
