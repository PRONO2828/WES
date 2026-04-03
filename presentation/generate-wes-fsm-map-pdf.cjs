const fs = require("fs");
const path = require("path");
const PDFDocument = require(path.join(__dirname, "..", "server", "node_modules", "pdfkit"));

const outputPath = path.join(__dirname, "WES-FSM-Development-Map.pdf");

const colors = {
  darkBg: "#0d1823",
  darkBg2: "#102030",
  lightBg: "#f3efe7",
  text: "#edf5f9",
  ink: "#10202f",
  muted: "#9eb2c2",
  mutedInk: "#4c6071",
  line: "#314556",
  softLine: "#d4d8dc",
  amber: "#f3a33b",
  blue: "#43b1ef",
  green: "#31c48d",
  red: "#f36f6f",
  cream: "#ebe5d8"
};

const doc = new PDFDocument({
  autoFirstPage: false,
  size: "A4",
  layout: "landscape",
  margin: 0
});

doc.pipe(fs.createWriteStream(outputPath));

function addPage(paper = false) {
  doc.addPage({ size: "A4", layout: "landscape", margin: 0 });
  const { width, height } = doc.page;
  doc.save();
  doc.rect(0, 0, width, height).fill(paper ? colors.lightBg : colors.darkBg);
  doc.circle(width - 40, height + 40, 180).fillOpacity(0.08).fill(paper ? colors.amber : colors.blue);
  doc.restore();
}

function font(name, size, color) {
  doc.font(name).fontSize(size).fillColor(color);
}

function rounded(x, y, w, h, r, fill, stroke) {
  doc.save();
  doc.roundedRect(x, y, w, h, r).fillAndStroke(fill, stroke);
  doc.restore();
}

function titleBlock({ eyebrow, title, lede, paper = false, meta = [] }) {
  const { width } = doc.page;
  font("Helvetica-Bold", 10, paper ? "#b56c0f" : colors.amber);
  doc.text(eyebrow.toUpperCase(), 36, 28, { width: 380, characterSpacing: 1.6 });
  font("Helvetica-Bold", paper ? 22 : 24, paper ? colors.ink : colors.text);
  doc.text(title, 36, 46, { width: 520, lineGap: 2 });
  font("Helvetica", 11.5, paper ? colors.mutedInk : colors.muted);
  doc.text(lede, 36, 92, { width: 520, lineGap: 2 });

  let metaY = 36;
  meta.forEach((item) => {
    rounded(width - 238, metaY, 202, 54, 14, paper ? "#ffffff" : "#162433", paper ? colors.softLine : colors.line);
    font("Helvetica-Bold", 8.5, paper ? "#b56c0f" : colors.amber);
    doc.text(item.label.toUpperCase(), width - 224, metaY + 10, { width: 174 });
    font("Helvetica", 9.5, paper ? colors.mutedInk : colors.muted);
    doc.text(item.value, width - 224, metaY + 23, { width: 174, lineGap: 1.5 });
    metaY += 64;
  });
}

function chips(x, y, values, tint, paper = false) {
  let offset = 0;
  values.forEach((value) => {
    const w = Math.max(44, doc.widthOfString(value.toUpperCase(), { font: "Helvetica-Bold", size: 7.5 }) + 18);
    rounded(x + offset, y, w, 16, 8, paper ? "#ffffff" : "#152433", paper ? colors.softLine : colors.line);
    font("Helvetica-Bold", 7.5, tint);
    doc.text(value.toUpperCase(), x + offset + 9, y + 5, { width: w - 18, align: "center" });
    offset += w + 6;
  });
}

function stageBox(x, y, w, h, config) {
  rounded(x, y, w, h, 18, config.fill, colors.line);
  chips(x + 10, y + 10, config.roles, config.tint);
  rounded(x + w - 40, y + 10, 28, 28, 14, "#243241", colors.line);
  font("Helvetica-Bold", 11, colors.text);
  doc.text(String(config.step), x + w - 33, y + 18, { width: 14, align: "center" });
  font("Helvetica-Bold", 11.5, colors.text);
  doc.text(config.title, x + 12, y + 38, { width: w - 52 });

  let bulletY = y + 68;
  config.items.forEach((item) => {
    rounded(x + 10, bulletY, w - 20, 52, 12, "#172534", colors.line);
    font("Helvetica-Bold", 10, colors.text);
    doc.text(item.label, x + 20, bulletY + 9, { width: w - 40 });
    font("Helvetica", 9, colors.muted);
    doc.text(item.body, x + 20, bulletY + 23, { width: w - 40, lineGap: 1.2 });
    bulletY += 60;
  });
}

function arrowBetween(x, y) {
  font("Helvetica-Bold", 20, "#6f8091");
  doc.text("->", x, y, { width: 22, align: "center" });
}

function feedbackBox(x, y, w, h, fill, title, body, paper = false) {
  rounded(x, y, w, h, 14, fill, paper ? colors.softLine : colors.line);
  font("Helvetica-Bold", 10.5, paper ? colors.ink : colors.text);
  doc.text(title, x + 12, y + 10, { width: w - 24 });
  font("Helvetica", 9.2, paper ? colors.mutedInk : colors.muted);
  doc.text(body, x + 12, y + 26, { width: w - 24, lineGap: 1.4 });
}

function footer(leftText, pageNo, paper = false) {
  const { width, height } = doc.page;
  font("Helvetica", 8.5, paper ? colors.mutedInk : colors.muted);
  doc.text(leftText, 36, height - 26, { width: 620 });
  font("Helvetica-Bold", 8.5, paper ? colors.mutedInk : "#8192a2");
  doc.text(`PAGE ${pageNo}`, width - 90, height - 26, { width: 54, align: "right" });
}

function layerBox(y, title, tag, pills, body) {
  const x = 36;
  const w = doc.page.width - 72;
  rounded(x, y, w, 58, 16, "#152433", colors.line);
  font("Helvetica-Bold", 10.5, colors.text);
  doc.text(title, x + 14, y + 11, { width: 260 });
  chips(x + w - 150, y + 10, [tag], tag === "business logic" ? "#ffd08e" : tag === "knowledge layer" ? "#9be8cb" : tag === "ui orchestration" ? "#83d7ff" : "#d7e2eb");
  let px = x + 14;
  let py = y + 28;
  pills.forEach((pill) => {
    const pw = Math.max(36, doc.widthOfString(pill.toUpperCase(), { font: "Helvetica-Bold", size: 7 }) + 18);
    if (px + pw > x + w - 14) {
      px = x + 14;
      py += 16;
    }
    rounded(px, py, pw, 13, 6, "#1a2a3a", colors.line);
    font("Helvetica-Bold", 7, "#dce6ef");
    doc.text(pill.toUpperCase(), px + 8, py + 3.5, { width: pw - 16, align: "center" });
    px += pw + 5;
  });
  font("Helvetica", 8.8, colors.muted);
  doc.text(body, x + 300, y + 11, { width: 320, lineGap: 1.2 });
}

function downArrow(y) {
  font("Helvetica-Bold", 14, "#6f8091");
  doc.text("v", 410, y, { width: 20, align: "center" });
}

function statusNode(x, y, w, label, fill) {
  rounded(x, y, w, 28, 10, fill, colors.line);
  font("Helvetica-Bold", 8.5, colors.text);
  doc.text(label, x + 8, y + 10, { width: w - 16, align: "center" });
}

function phaseBox(x, y, w, h, number, title, body, pills) {
  rounded(x, y, w, h, 16, "#ffffff", colors.softLine);
  rounded(x + 12, y + 12, 24, 24, 12, "#f9e6c7", "#e3c48a");
  font("Helvetica-Bold", 11, "#9a5600");
  doc.text(String(number), x + 20, y + 19, { width: 8, align: "center" });
  font("Helvetica-Bold", 10.5, colors.ink);
  doc.text(title, x + 46, y + 16, { width: w - 58 });
  font("Helvetica", 9.1, colors.mutedInk);
  doc.text(body, x + 14, y + 42, { width: w - 28, lineGap: 1.4 });

  let px = x + 14;
  let py = y + h - 28;
  pills.forEach((pill) => {
    const pw = Math.max(36, doc.widthOfString(pill.toUpperCase(), { font: "Helvetica-Bold", size: 7 }) + 18);
    rounded(px, py, pw, 13, 6, "#ffffff", colors.softLine);
    font("Helvetica-Bold", 7, colors.mutedInk);
    doc.text(pill.toUpperCase(), px + 8, py + 3.5, { width: pw - 16, align: "center" });
    px += pw + 5;
  });
}

addPage(false);
titleBlock({
  eyebrow: "WES FSM Visual Map",
  title: "End-to-End Workflow Map For Developing WES Field Service Management",
  lede:
    "This page shows how dispatch, field execution, workshop follow-up, review, and report release move from left to right. It is grounded in the current WES FSM workspace flow and the API rules that drive status changes.",
  meta: [
    { label: "Primary roles", value: "Admin, Technician, Workshop Technician, Review Desk" },
    { label: "Main entities", value: "Users, Jobs, Sites, Field Reports, Workshop Reports, Forum Messages" },
    { label: "Output", value: "Approved PDF report plus permanent repeat-site history" }
  ]
});

const stageY = 138;
const stageW = 136;
const arrowW = 22;
const stageH = 288;
const fills = [
  "rgba(67,177,239,0.16)",
  "rgba(243,163,59,0.16)",
  "rgba(49,196,141,0.16)",
  "rgba(255,255,255,0.08)",
  "rgba(243,163,59,0.12)"
];
const stages = [
  {
    step: 1,
    title: "Intake And Context",
    roles: ["Admin", "Dashboard"],
    tint: "#d7e2eb",
    fill: "#142636",
    items: [
      { label: "Login and role gate", body: "Admin sees metrics, technician activity, open jobs, and the review queue." },
      { label: "Search repeat-site history", body: "Office checks earlier reports and workshop records before dispatch." },
      { label: "Confirm dispatch inputs", body: "Client, service type, location, priority, technician, and repeat-site label are set." }
    ]
  },
  {
    step: 2,
    title: "Dispatch And Assignment",
    roles: ["Admin", "Jobs"],
    tint: "#ffd08e",
    fill: "#2a2419",
    items: [
      { label: "Create job", body: "POST /jobs creates a new job in Pending and assigns it to a field technician." },
      { label: "Context follows the work", body: "GET /jobs/:jobId returns job data, site detail, history, and workshop follow-up." },
      { label: "Side channel stays open", body: "Forum messages and presence updates support handoff notes." }
    ]
  },
  {
    step: 3,
    title: "Field And Workshop Execution",
    roles: ["Technician", "Workshop"],
    tint: "#9be8cb",
    fill: "#162b24",
    items: [
      { label: "Start job", body: "POST /jobs/:jobId/start moves the job from Pending to In Progress." },
      { label: "Capture field evidence", body: "Diagnosis, work done, GPS, measurements, materials, photos, and signature are captured." },
      { label: "Optional workshop branch", body: "POST /jobs/:jobId/workshop-reports logs bench repair details, parts, costs, and photos." }
    ]
  },
  {
    step: 4,
    title: "Submission And Review",
    roles: ["Technician", "Review Queue"],
    tint: "#83d7ff",
    fill: "#1b2430",
    items: [
      { label: "Submit field report", body: "POST /jobs/:jobId/reports creates the report as Pending review and moves the job to Completed." },
      { label: "Office review", body: "GET /review-queue lets admin review report detail, site history, workshop follow-up, and evidence." },
      { label: "Decision point", body: "POST /reports/:reportId/review controls the next job state." }
    ]
  },
  {
    step: 5,
    title: "Release, Feedback, And Reuse",
    roles: ["Decision", "Output"],
    tint: "#ffd08e",
    fill: "#232831",
    items: [
      { label: "Approved path", body: "Job becomes Approved and GET /reports/:reportId/export produces the PDF." },
      { label: "Rejected path", body: "Job returns to In Progress and new evidence re-enters review." },
      { label: "Knowledge retention", body: "Approved reports stay attached to the site for future repeat visits." }
    ]
  }
];

let stageX = 36;
stages.forEach((stage, index) => {
  stageBox(stageX, stageY, stageW, stageH, stage);
  if (index < stages.length - 1) {
    arrowBetween(stageX + stageW + 1, stageY + 125);
  }
  stageX += stageW + arrowW;
});

feedbackBox(36, 438, 250, 86, "#2c2418", "Cross-cutting coordination", "Forum messages, SSE updates, and presence tracking support each stage without replacing the core job and report flow.");
feedbackBox(296, 438, 226, 86, "#332022", "Rejection loop", "Rejected report -> job goes back to In Progress -> technician revisits -> evidence is resubmitted.");
feedbackBox(532, 438, 274, 86, "#183026", "Approval loop", "Approved report -> PDF export -> site history becomes richer -> next repeat-site dispatch starts smarter.");
footer("Sources: docs/api.md, server/src/data/store.js, server/src/routes/jobs.js, server/src/routes/reports.js, script.js", 1, false);

addPage(false);
titleBlock({
  eyebrow: "WES FSM Development Map",
  title: "Architecture Flow From UI To API To Data To Output",
  lede:
    "Use this page as the developer reference. It shows which screens talk to which routes, which rules mutate state, and where reusable site knowledge is stored and returned.",
  meta: [
    { label: "Backend service", value: "Express app mounted at /api with auth, jobs, reports, search, users, and forum routes" },
    { label: "Current data engine", value: "In-memory seeded store from createStore() with EventEmitter for forum and presence" }
  ]
});

layerBox(134, "1. User-facing surfaces", "screens", ["Login", "Dashboard", "Jobs", "Field Reports", "Approvals", "Workshop", "Reports Center", "Global Search", "Forum"], "Admin gets dispatch and approval views. Technicians get assigned jobs, capture, workshop, and report-center history.");
downArrow(196);
layerBox(208, "2. Client state and workflow logic", "ui orchestration", ["Session", "Active View", "Selected Job", "Selected Report", "Uploads", "Filters", "Theme", "Navigation History"], "Client logic decides visibility, pins repeat-site history into context panels, and prepares payloads for jobs, reports, review, and workshop follow-up.");
downArrow(270);
layerBox(282, "3. API contract", "transport layer", ["/auth/login", "/dashboard", "/jobs", "/jobs/:jobId/start", "/jobs/:jobId/reports", "/jobs/:jobId/workshop-reports", "/reports", "/review-queue", "/reports/:reportId/review", "/reports/:reportId/export", "/sites", "/search", "/forum/messages", "/forum/stream", "/users"], "These routes are the stable handoff points between UI and domain logic, and they are where future mobile or React clients should connect.");
downArrow(344);
layerBox(356, "4. Domain rules and state transitions", "business logic", ["Role authorization", "Job visibility", "Repeat-site mapping", "Evidence validation", "Review decisions", "PDF export gate", "Forum events", "Presence updates"], "The store enforces the important rules: only assigned technicians can start or report on jobs, evidence is mandatory before submission, and only approved reports may export to PDF.");
downArrow(418);
layerBox(430, "5. Persistence, eventing, and outputs", "knowledge layer", ["Users", "Jobs", "Sites", "Field Reports", "Workshop Reports", "Activity Logs", "Forum Messages", "EventEmitter", "PDFKit Export"], "Approved reports become PDFs, site history becomes richer, and the same stored data feeds later job context, review context, search results, and dashboards.");

statusNode(36, 510, 120, "Job Pending", "#2c2418");
arrowBetween(160, 515);
statusNode(184, 510, 120, "In Progress", "#152c36");
arrowBetween(308, 515);
statusNode(332, 510, 168, "Completed + Report Pending", "#1f2731");
arrowBetween(504, 515);
statusNode(528, 510, 144, "Approved + Exportable", "#183026");
arrowBetween(676, 515);
statusNode(700, 510, 106, "Back To In Progress", "#332022");
footer("Architecture intent: keep the job object as the operational anchor, and let reports, workshop work, review, search, and export all hang off that anchor.", 2, false);

addPage(true);
titleBlock({
  eyebrow: "Build Sequence",
  title: "Recommended Development Order",
  lede:
    "If the team is actively building or refactoring WES FSM, this order reduces rework by establishing the job and site model first, then layering capture, review, collaboration, and hardening on top.",
  paper: true,
  meta: [
    { label: "Team use", value: "Product planning, sprint kickoffs, onboarding, technical reviews, and management explanations" },
    { label: "Print note", value: "Designed for A4 landscape PDF printing; it also scales well for A3 wall printing" }
  ]
});

const boxW = 248;
const boxH = 122;
phaseBox(36, 142, boxW, boxH, 1, "Foundation", "Lock the shared entities first: users, jobs, sites, field reports, workshop reports, review statuses, and role permissions.", ["Auth", "Roles", "Seed data", "Status enums"]);
phaseBox(296, 142, boxW, boxH, 2, "Dispatch Core", "Build dashboard metrics, technician visibility, job creation, job updates, repeat-site lookup, and job detail context.", ["Dashboard", "Jobs CRUD", "Sites", "Assignments"]);
phaseBox(556, 142, boxW, boxH, 3, "Field Capture", "Implement start-job flow, GPS capture, image uploads, measurements, materials, and client signature requirements.", ["Start job", "Before/after images", "Measurements", "Signature"]);
phaseBox(36, 276, boxW, boxH, 4, "Workshop Branch", "Add workshop notes and parts flow without breaking the main field-report path. Keep it additive and linked to the same job.", ["Workshop reports", "Parts", "Costs", "Bench photos"]);
phaseBox(296, 276, boxW, boxH, 5, "Review And Release", "Ship the review queue, review notes, reject or approve decisions, report center, and PDF export once evidence capture is stable.", ["Review queue", "Approval rules", "Report center", "PDF export"]);
phaseBox(556, 276, boxW, boxH, 6, "Search And Collaboration", "Layer in search, forum messaging, presence, and live updates after the core job and report lifecycle is reliable.", ["Search", "Forum", "SSE stream", "Presence"]);

rounded(36, 418, 768, 96, 16, colors.cream, colors.softLine);
font("Helvetica-Bold", 10.5, colors.ink);
doc.text("Dependency path:", 50, 432, { width: 120 });
font("Helvetica", 9.2, colors.mutedInk);
doc.text("Foundation -> Dispatch Core -> Field Capture -> Review And Release.", 138, 432, { width: 636 });
doc.text("Workshop Branch can grow alongside Field Capture because it still hangs off the job object.", 50, 452, { width: 724, lineGap: 1.2 });
doc.text("Search And Collaboration should read from the existing job and report models instead of inventing parallel data paths.", 50, 470, { width: 724, lineGap: 1.2 });
doc.text("Final hardening after these stages: persistent database, object storage for images, JWT secret management, audit logging, mobile packaging, and deployment.", 50, 488, { width: 724, lineGap: 1.2 });
footer("Prepared as a printable development artifact for WES FSM.", 3, true);

doc.end();
console.log(outputPath);
