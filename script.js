const STORAGE_KEY = "wes-fsm-demo-v5";
const ACTIVE_USER_KEY = "wes-fsm-active-user-v4";
const AUTH_SESSION_KEY = "wes-fsm-auth-session-v1";
const THEME_KEY = "wes-fsm-theme-v1";
const DEMO_REFERENCE = { latitude: -1.286389, longitude: 36.817223 };
const SERVICE_COLORS = {
  Borehole: "#44b3f0",
  Solar: "#f4a340",
  "Water Treatment": "#31c48d",
};
const TEAM_STATUSES = ["Available", "Busy", "Off Duty"];
const FORUM_CHANNELS = [
  { id: "operations", label: "Operations", description: "Office-wide dispatch and approvals" },
  { id: "field-updates", label: "Field Updates", description: "Live site updates and technician coordination" },
  { id: "workshop", label: "Workshop", description: "Bench repair notes and parts follow-up" },
  { id: "social", label: "Social", description: "Team banter and morale checks" },
];

const dom = {
  homePage: document.getElementById("homePage"),
  appShell: document.getElementById("appShell"),
  loginForm: document.getElementById("loginForm"),
  loginAccount: document.getElementById("loginAccount"),
  loginAccountButtons: document.getElementById("loginAccountButtons"),
  loginPassword: document.getElementById("loginPassword"),
  loginError: document.getElementById("loginError"),
  themeButtons: Array.from(document.querySelectorAll('[data-action="toggle-theme"]')),
  backButton: document.getElementById("backButton"),
  signedInName: document.getElementById("signedInName"),
  signedInMeta: document.getElementById("signedInMeta"),
  logoutButton: document.getElementById("logoutButton"),
  currentRoleChip: document.getElementById("currentRoleChip"),
  networkIndicator: document.getElementById("networkIndicator"),
  syncButton: document.getElementById("syncButton"),
  syncCount: document.getElementById("syncCount"),
  globalSearchSummary: document.getElementById("globalSearchSummary"),
  globalSearchTechnician: document.getElementById("globalSearchTechnician"),
  globalSearchSite: document.getElementById("globalSearchSite"),
  globalSearchClient: document.getElementById("globalSearchClient"),
  globalSearchWorkType: document.getElementById("globalSearchWorkType"),
  globalSearchDate: document.getElementById("globalSearchDate"),
  runGlobalSearchButton: document.getElementById("runGlobalSearchButton"),
  resetGlobalSearchButton: document.getElementById("resetGlobalSearchButton"),
  globalSearchResults: document.getElementById("globalSearchResults"),
  resetDemoButton: document.getElementById("resetDemoButton"),
  navButtons: Array.from(document.querySelectorAll(".nav-button")),
  views: Array.from(document.querySelectorAll(".view-panel")),
  dashboardTitle: document.getElementById("dashboardTitle"),
  dashboardSubtitle: document.getElementById("dashboardSubtitle"),
  dashboardJobsHeading: document.getElementById("dashboardJobsHeading"),
  kpiGrid: document.getElementById("kpiGrid"),
  serviceMix: document.getElementById("serviceMix"),
  dashboardJobs: document.getElementById("dashboardJobs"),
  activityFeed: document.getElementById("activityFeed"),
  jobsMap: document.getElementById("jobsMap"),
  mapMeta: document.getElementById("mapMeta"),
  dashboardServiceFilter: document.getElementById("dashboardServiceFilter"),
  dashboardStatusFilter: document.getElementById("dashboardStatusFilter"),
  dashboardLocationFilter: document.getElementById("dashboardLocationFilter"),
  dashboardRadiusFilter: document.getElementById("dashboardRadiusFilter"),
  dashboardLat: document.getElementById("dashboardLat"),
  dashboardLng: document.getElementById("dashboardLng"),
  captureFilterLocationButton: document.getElementById("captureFilterLocationButton"),
  jobRoleHint: document.getElementById("jobRoleHint"),
  teamRoleHint: document.getElementById("teamRoleHint"),
  jobsLayout: document.getElementById("jobsLayout"),
  jobFormPanel: document.getElementById("jobFormPanel"),
  jobQueuePanel: document.getElementById("jobQueuePanel"),
  teamManagementPanel: document.getElementById("teamManagementPanel"),
  engineerJobsPanel: document.getElementById("engineerJobsPanel"),
  engineerJobsHint: document.getElementById("engineerJobsHint"),
  engineerPendingJobs: document.getElementById("engineerPendingJobs"),
  engineerInProgressJobs: document.getElementById("engineerInProgressJobs"),
  engineerCompletedJobs: document.getElementById("engineerCompletedJobs"),
  engineerPendingBadge: document.getElementById("engineerPendingBadge"),
  engineerInProgressBadge: document.getElementById("engineerInProgressBadge"),
  engineerCompletedBadge: document.getElementById("engineerCompletedBadge"),
  technicianHistoryHint: document.getElementById("technicianHistoryHint"),
  technicianJobContext: document.getElementById("technicianJobContext"),
  technicianJobHistory: document.getElementById("technicianJobHistory"),
  jobForm: document.getElementById("jobForm"),
  jobId: document.getElementById("jobId"),
  jobClientName: document.getElementById("jobClientName"),
  jobContactPerson: document.getElementById("jobContactPerson"),
  jobContactPhone: document.getElementById("jobContactPhone"),
  jobServiceType: document.getElementById("jobServiceType"),
  jobManualLocation: document.getElementById("jobManualLocation"),
  jobLatitude: document.getElementById("jobLatitude"),
  jobLongitude: document.getElementById("jobLongitude"),
  jobGpsButton: document.getElementById("jobGpsButton"),
  jobPriority: document.getElementById("jobPriority"),
  jobStatus: document.getElementById("jobStatus"),
  jobAssignedEngineer: document.getElementById("jobAssignedEngineer"),
  jobDescription: document.getElementById("jobDescription"),
  jobRepeatSite: document.getElementById("jobRepeatSite"),
  jobRepeatHistory: document.getElementById("jobRepeatHistory"),
  jobFormReset: document.getElementById("jobFormReset"),
  jobsCountBadge: document.getElementById("jobsCountBadge"),
  jobsList: document.getElementById("jobsList"),
  teamManagement: document.getElementById("teamManagement"),
  reportRoleHint: document.getElementById("reportRoleHint"),
  reportJobSummary: document.getElementById("reportJobSummary"),
  reportForm: document.getElementById("reportForm"),
  reportJobSelect: document.getElementById("reportJobSelect"),
  reportCapturedAt: document.getElementById("reportCapturedAt"),
  reportLatitude: document.getElementById("reportLatitude"),
  reportLongitude: document.getElementById("reportLongitude"),
  reportGpsButton: document.getElementById("reportGpsButton"),
  openSiteLinkButton: document.getElementById("openSiteLinkButton"),
  reportDiagnosis: document.getElementById("reportDiagnosis"),
  reportWorkDone: document.getElementById("reportWorkDone"),
  reportNotes: document.getElementById("reportNotes"),
  materialsList: document.getElementById("materialsList"),
  measurementsList: document.getElementById("measurementsList"),
  addMaterialButton: document.getElementById("addMaterialButton"),
  addMeasurementButton: document.getElementById("addMeasurementButton"),
  reportBeforeInput: document.getElementById("reportBeforeInput"),
  reportAfterInput: document.getElementById("reportAfterInput"),
  reportBeforePreview: document.getElementById("reportBeforePreview"),
  reportAfterPreview: document.getElementById("reportAfterPreview"),
  reportResetButton: document.getElementById("reportResetButton"),
  repeatSiteHistory: document.getElementById("repeatSiteHistory"),
  reportsList: document.getElementById("reportsList"),
  approvalContext: document.getElementById("approvalContext"),
  approvalForm: document.getElementById("approvalForm"),
  approvalReportSelect: document.getElementById("approvalReportSelect"),
  approvalSummary: document.getElementById("approvalSummary"),
  reviewNotes: document.getElementById("reviewNotes"),
  approveReportButton: document.getElementById("approveReportButton"),
  rejectReportButton: document.getElementById("rejectReportButton"),
  reviewRoleHint: document.getElementById("reviewRoleHint"),
  approvalsList: document.getElementById("approvalsList"),
  workshopJobSummary: document.getElementById("workshopJobSummary"),
  workshopForm: document.getElementById("workshopForm"),
  workshopJobSelect: document.getElementById("workshopJobSelect"),
  openWorkshopSiteLinkButton: document.getElementById("openWorkshopSiteLinkButton"),
  workshopRepairDetails: document.getElementById("workshopRepairDetails"),
  workshopPartsList: document.getElementById("workshopPartsList"),
  addPartButton: document.getElementById("addPartButton"),
  workshopCosts: document.getElementById("workshopCosts"),
  workshopNotes: document.getElementById("workshopNotes"),
  workshopBeforeInput: document.getElementById("workshopBeforeInput"),
  workshopAfterInput: document.getElementById("workshopAfterInput"),
  workshopBeforePreview: document.getElementById("workshopBeforePreview"),
  workshopAfterPreview: document.getElementById("workshopAfterPreview"),
  workshopResetButton: document.getElementById("workshopResetButton"),
  workshopList: document.getElementById("workshopList"),
  generatedReport: document.getElementById("generatedReport"),
  reportCenterReviewBlock: document.getElementById("reportCenterReviewBlock"),
  reportCenterReviewStatus: document.getElementById("reportCenterReviewStatus"),
  reportCenterReviewHelper: document.getElementById("reportCenterReviewHelper"),
  reportCenterReviewNotes: document.getElementById("reportCenterReviewNotes"),
  reportCenterApproveButton: document.getElementById("reportCenterApproveButton"),
  reportCenterRejectButton: document.getElementById("reportCenterRejectButton"),
  downloadReportButton: document.getElementById("downloadReportButton"),
  printReportButton: document.getElementById("printReportButton"),
  shareSummaryButton: document.getElementById("shareSummaryButton"),
  sendWhatsappButton: document.getElementById("sendWhatsappButton"),
  sendEmailButton: document.getElementById("sendEmailButton"),
  reportSearchDate: document.getElementById("reportSearchDate"),
  reportSearchSite: document.getElementById("reportSearchSite"),
  reportSearchWork: document.getElementById("reportSearchWork"),
  runReportSearchButton: document.getElementById("runReportSearchButton"),
  resetReportSearchButton: document.getElementById("resetReportSearchButton"),
  reportSearchResults: document.getElementById("reportSearchResults"),
  forumRoleHint: document.getElementById("forumRoleHint"),
  forumReplyBanner: document.getElementById("forumReplyBanner"),
  forumComposer: document.getElementById("forumComposer"),
  forumChannel: document.getElementById("forumChannel"),
  forumSiteTag: document.getElementById("forumSiteTag"),
  forumMessage: document.getElementById("forumMessage"),
  postForumMessageButton: document.getElementById("postForumMessageButton"),
  cancelForumReplyButton: document.getElementById("cancelForumReplyButton"),
  forumFeed: document.getElementById("forumFeed"),
  forumOnlineUsers: document.getElementById("forumOnlineUsers"),
  forumChannels: document.getElementById("forumChannels"),
  toastStack: document.getElementById("toastStack"),
};

const state = {
  activeUserId: localStorage.getItem(ACTIVE_USER_KEY) || "usr-admin-kirui",
  isAuthenticated: localStorage.getItem(AUTH_SESSION_KEY) === "true",
  activeView: "dashboard",
  theme: localStorage.getItem(THEME_KEY) || "dark",
  data: null,
  selectedJobId: null,
  selectedReportId: null,
  navigationHistory: [],
  forumReplyToId: null,
  uploads: {
    reportBefore: [],
    reportAfter: [],
    workshopBefore: [],
    workshopAfter: [],
  },
};

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createSeedData() {
  return {
    users: [
      { id: "usr-admin-kirui", name: "Kirui Isaiah", role: "admin", email: "kirui@wes-engineering.co.ke", phone: "+254 700 000 101", online: true, presenceNote: "Review desk" },
      { id: "usr-admin-judy", name: "Judy", role: "admin", email: "judy@wes-engineering.co.ke", phone: "+254 700 000 102", online: true, presenceNote: "Dispatch desk" },
      { id: "usr-supervisor-sang", name: "Sang Nicholas", role: "supervisor", email: "sang@wes-engineering.co.ke", phone: "+254 700 000 103", online: true, presenceNote: "Approvals" },
      { id: "usr-eng-lewis", name: "Lewis", role: "engineer", email: "lewis@wes-engineering.co.ke", phone: "+254 700 000 201", base: "Nairobi", teamStatus: "Available", online: true, presenceNote: "Karen route" },
      { id: "usr-eng-kiptoo", name: "Kiptoo", role: "engineer", email: "kiptoo@wes-engineering.co.ke", phone: "+254 700 000 202", base: "Nakuru", teamStatus: "Busy", online: true, presenceNote: "Solar checks" },
      { id: "usr-eng-ndeda", name: "Ndeda", role: "engineer", email: "ndeda@wes-engineering.co.ke", phone: "+254 700 000 203", base: "Mombasa", teamStatus: "Available", online: false, presenceNote: "Travelling" },
      { id: "usr-eng-mutuse", name: "Mutuse", role: "engineer", email: "mutuse@wes-engineering.co.ke", phone: "+254 700 000 204", base: "Machakos", teamStatus: "Available", online: true, presenceNote: "Athi River" },
      { id: "usr-eng-korir", name: "Korir", role: "engineer", email: "korir@wes-engineering.co.ke", phone: "+254 700 000 205", base: "Eldoret", teamStatus: "Busy", online: false, presenceNote: "Awaiting retest" },
      { id: "usr-eng-richard", name: "Richard", role: "engineer", email: "richard@wes-engineering.co.ke", phone: "+254 700 000 206", base: "Kisumu", teamStatus: "Available", online: true, presenceNote: "Water treatment run" },
      { id: "usr-workshop-victor", name: "Victor", role: "workshop", email: "victor@wes-engineering.co.ke", phone: "+254 700 000 301", base: "Workshop", teamStatus: "Available", online: true, presenceNote: "Bench testing" },
    ],
    jobs: [
      {
        id: "JOB-260390",
        clientName: "Ruiru Springs Estate",
        contactPerson: "Moses Kariuki",
        contactPhone: "+254 712 300 110",
        serviceType: "Borehole",
        manualLocation: "Ruiru Springs Estate",
        latitude: -1.1452,
        longitude: 36.9645,
        description: "Routine borehole servicing and cable inspection completed successfully on the previous visit.",
        assignedEngineerId: "usr-eng-lewis",
        repeatSiteName: "",
        priority: "Medium",
        status: "Approved",
        createdAt: "2026-03-11T08:10:00+03:00",
        updatedAt: "2026-03-12T14:00:00+03:00",
      },
      {
        id: "JOB-260398",
        clientName: "Karen Ridge Villas",
        contactPerson: "Janet Kilonzo",
        contactPhone: "+254 733 117 818",
        serviceType: "Borehole",
        manualLocation: "Karen Ridge Villas",
        latitude: -1.3182,
        longitude: 36.7063,
        description: "Previous preventive maintenance for pump lifting, flushing, and water level verification.",
        assignedEngineerId: "usr-eng-mutuse",
        repeatSiteName: "",
        priority: "Low",
        status: "Approved",
        createdAt: "2026-03-08T09:15:00+03:00",
        updatedAt: "2026-03-09T13:20:00+03:00",
      },
      {
        id: "JOB-260401",
        clientName: "Karen Ridge Villas",
        contactPerson: "Janet Kilonzo",
        contactPhone: "+254 733 117 818",
        serviceType: "Borehole",
        manualLocation: "Karen Ridge Villas",
        latitude: -1.3181,
        longitude: 36.7064,
        description: "Repeat call after client reported low discharge and intermittent motor tripping.",
        assignedEngineerId: "usr-eng-lewis",
        repeatSiteName: "Karen Ridge Villas",
        priority: "High",
        status: "Pending",
        createdAt: "2026-03-27T07:20:00+03:00",
        updatedAt: "2026-03-27T07:20:00+03:00",
      },
      {
        id: "JOB-260402",
        clientName: "Nakuru Green Estate",
        contactPerson: "Peter Mwangi",
        contactPhone: "+254 701 556 122",
        serviceType: "Solar",
        manualLocation: "Nakuru Town East",
        latitude: -0.3031,
        longitude: 36.08,
        description: "Hybrid inverter shows low battery alarm and daytime transfer to grid.",
        assignedEngineerId: "usr-eng-kiptoo",
        repeatSiteName: "",
        priority: "Critical",
        status: "In Progress",
        createdAt: "2026-03-26T10:00:00+03:00",
        updatedAt: "2026-03-27T08:30:00+03:00",
      },
      {
        id: "JOB-260403",
        clientName: "Kisumu Water Point",
        contactPerson: "David Ochieng",
        contactPhone: "+254 728 445 903",
        serviceType: "Water Treatment",
        manualLocation: "Kisumu Water Point",
        latitude: -0.1022,
        longitude: 34.7617,
        description: "High turbidity complaints and reduced chlorine dosing performance at treatment skid.",
        assignedEngineerId: "usr-eng-richard",
        repeatSiteName: "",
        priority: "Medium",
        status: "Completed",
        createdAt: "2026-03-25T09:15:00+03:00",
        updatedAt: "2026-03-27T07:45:00+03:00",
      },
      {
        id: "JOB-260404",
        clientName: "Athi River Packers",
        contactPerson: "Esther Muasya",
        contactPhone: "+254 722 318 410",
        serviceType: "Borehole",
        manualLocation: "Athi River Packers",
        latitude: -1.4561,
        longitude: 36.9787,
        description: "Pump overload traced to damaged cable joint and low insulation resistance.",
        assignedEngineerId: "usr-eng-ndeda",
        repeatSiteName: "",
        priority: "High",
        status: "Approved",
        createdAt: "2026-03-22T08:30:00+03:00",
        updatedAt: "2026-03-24T15:10:00+03:00",
      },
      {
        id: "JOB-260405",
        clientName: "Mombasa Port Utility Yard",
        contactPerson: "Amina Noor",
        contactPhone: "+254 720 501 411",
        serviceType: "Solar",
        manualLocation: "Mombasa Port Utility Yard",
        latitude: -4.0447,
        longitude: 39.6589,
        description: "Array output is unstable and last report was rejected pending retest and clearer photo evidence.",
        assignedEngineerId: "usr-eng-korir",
        repeatSiteName: "",
        priority: "High",
        status: "In Progress",
        createdAt: "2026-03-21T11:40:00+03:00",
        updatedAt: "2026-03-27T08:15:00+03:00",
      },
    ],
    fieldReports: [
      {
        id: "RPT-260390",
        jobId: "JOB-260390",
        engineerId: "usr-eng-lewis",
        capturedAt: "2026-03-12T11:30:00+03:00",
        gps: { latitude: -1.1451, longitude: 36.9646 },
        diagnosis: "Service inspection found minor sediment buildup but no electrical fault.",
        workDone: "Lifted the pump, cleaned debris, tested amperage, and recommissioned the system.",
        materials: [
          { name: "Cable ties", quantity: "20", unit: "pcs" },
          { name: "Insulation tape", quantity: "2", unit: "rolls" },
        ],
        measurements: [
          { label: "Pump level", value: "39.5", unit: "m" },
          { label: "Current draw", value: "7.8", unit: "A" },
        ],
        notes: "Client advised to schedule the next preventive service after six months.",
        beforeImages: [],
        afterImages: [],
        reviewStatus: "Approved",
        reviewNotes: "Good documentation and clear restoration photos.",
        reviewedById: "usr-supervisor-sang",
        reviewedAt: "2026-03-12T14:00:00+03:00",
        synced: true,
      },
      {
        id: "RPT-260398",
        jobId: "JOB-260398",
        engineerId: "usr-eng-mutuse",
        capturedAt: "2026-03-09T10:10:00+03:00",
        gps: { latitude: -1.3184, longitude: 36.7061 },
        diagnosis: "Routine maintenance found early-stage screen fouling and reduced discharge.",
        workDone: "Flushed line, cleaned pump housing, and verified static water level.",
        materials: [
          { name: "Thread seal tape", quantity: "1", unit: "roll" },
        ],
        measurements: [
          { label: "Static water level", value: "19.5", unit: "m" },
          { label: "Flow rate", value: "13", unit: "m3/hr" },
        ],
        notes: "This history should appear when the site repeats.",
        beforeImages: [],
        afterImages: [],
        reviewStatus: "Approved",
        reviewNotes: "Preventive maintenance report approved.",
        reviewedById: "usr-admin-kirui",
        reviewedAt: "2026-03-09T13:20:00+03:00",
        synced: true,
      },
      {
        id: "RPT-260403",
        jobId: "JOB-260403",
        engineerId: "usr-eng-richard",
        capturedAt: "2026-03-27T07:10:00+03:00",
        gps: { latitude: -0.1021, longitude: 34.7615 },
        diagnosis: "Dosing line crystallization and elevated multimedia filter differential pressure.",
        workDone: "Backwashed the filter, cleaned the dosing line, and recalibrated the metering pump.",
        materials: [
          { name: "Dosing line", quantity: "3", unit: "m" },
          { name: "Non-return valve", quantity: "1", unit: "pc" },
        ],
        measurements: [
          { label: "Turbidity", value: "1.8", unit: "NTU" },
          { label: "Residual chlorine", value: "0.7", unit: "mg/L" },
        ],
        notes: "Waiting for manager review.",
        beforeImages: [],
        afterImages: [],
        reviewStatus: "Pending",
        reviewNotes: "",
        reviewedById: null,
        reviewedAt: null,
        synced: true,
      },
      {
        id: "RPT-260404",
        jobId: "JOB-260404",
        engineerId: "usr-eng-ndeda",
        capturedAt: "2026-03-24T12:05:00+03:00",
        gps: { latitude: -1.4561, longitude: 36.9787 },
        diagnosis: "Cable joint insulation breakdown caused overload trips under load.",
        workDone: "Raised the cable section, reterminated the damaged joint, and tested pump stability.",
        materials: [
          { name: "Heat shrink sleeve", quantity: "4", unit: "pcs" },
          { name: "Waterproof connector", quantity: "1", unit: "pc" },
        ],
        measurements: [
          { label: "Insulation resistance", value: "5.2", unit: "MOhm" },
          { label: "Current draw", value: "8.4", unit: "A" },
        ],
        notes: "Pump restored to stable duty.",
        beforeImages: [],
        afterImages: [],
        reviewStatus: "Approved",
        reviewNotes: "Approved after photo evidence and stable test values.",
        reviewedById: "usr-admin-judy",
        reviewedAt: "2026-03-24T15:10:00+03:00",
        synced: true,
      },
      {
        id: "RPT-260405",
        jobId: "JOB-260405",
        engineerId: "usr-eng-korir",
        capturedAt: "2026-03-26T16:20:00+03:00",
        gps: { latitude: -4.0448, longitude: 39.6588 },
        diagnosis: "Array output fluctuated during cloudy intervals but root cause evidence was incomplete.",
        workDone: "Reset controller and tightened junction points for temporary stabilization.",
        materials: [
          { name: "MC4 connector", quantity: "2", unit: "pcs" },
        ],
        measurements: [
          { label: "Array voltage", value: "312", unit: "V" },
          { label: "Battery voltage", value: "50.6", unit: "V" },
        ],
        notes: "Manager requested clearer before and after photo proof and follow-up test results.",
        beforeImages: [],
        afterImages: [],
        reviewStatus: "Rejected",
        reviewNotes: "Rejected. Return with clearer photo sequence and post-repair load test values.",
        reviewedById: "usr-supervisor-sang",
        reviewedAt: "2026-03-26T18:00:00+03:00",
        synced: true,
      },
    ],
    workshopReports: [
      {
        id: "WRK-260405",
        jobId: "JOB-260405",
        engineerId: "usr-workshop-victor",
        repairDetails: "Bench-tested the inverter cooling path and replaced a failing fan assembly.",
        partsReplaced: [
          { name: "Cooling fan", quantity: "1", unitCost: "6500" },
          { name: "Auxiliary capacitor", quantity: "2", unitCost: "1800" },
        ],
        costs: 10100,
        notes: "Waiting for field reinstall and confirmation test.",
        beforeImages: [],
        afterImages: [],
        createdAt: "2026-03-27T09:05:00+03:00",
        synced: true,
      },
    ],
    activityLogs: [
      {
        id: "ACT-1",
        actorName: "Sang Nicholas",
        message: "Rejected Korir's first Mombasa Port report and requested clearer before and after photos.",
        createdAt: "2026-03-26T18:00:00+03:00",
      },
      {
        id: "ACT-2",
        actorName: "Kirui Isaiah",
        message: "Approved the previous Karen Ridge Villas maintenance report for repeat-site reference.",
        createdAt: "2026-03-09T13:20:00+03:00",
      },
      {
        id: "ACT-3",
        actorName: "Victor",
        message: "Logged workshop repair notes for the Mombasa Port inverter assembly.",
        createdAt: "2026-03-27T09:05:00+03:00",
      },
    ],
    forumMessages: [
      {
        id: "MSG-2601",
        authorId: "usr-supervisor-sang",
        channel: "operations",
        siteTag: "Karen Ridge Villas",
        message: "Lewis, this is a repeat visit. Please compare with the previous Karen Ridge maintenance report before lifting the pump.",
        createdAt: "2026-03-27T07:32:00+03:00",
        replyToId: null,
        reactions: [
          { emoji: "Like", userIds: ["usr-eng-lewis", "usr-admin-kirui"] },
          { emoji: "Done", userIds: ["usr-admin-judy"] },
        ],
      },
      {
        id: "MSG-2602",
        authorId: "usr-eng-lewis",
        channel: "field-updates",
        siteTag: "Karen Ridge Villas",
        message: "Copy that. I have reviewed the earlier static water level and discharge values. I will post fresh readings once the site inspection starts.",
        createdAt: "2026-03-27T07:41:00+03:00",
        replyToId: "MSG-2601",
        reactions: [{ emoji: "Like", userIds: ["usr-supervisor-sang", "usr-admin-judy"] }],
      },
      {
        id: "MSG-2603",
        authorId: "usr-workshop-victor",
        channel: "workshop",
        siteTag: "Mombasa Port Utility Yard",
        message: "Cooling fan assembly is ready for reinstall. Korir, I have attached the bench notes in the workshop report.",
        createdAt: "2026-03-27T09:09:00+03:00",
        replyToId: null,
        reactions: [{ emoji: "Done", userIds: ["usr-eng-korir", "usr-supervisor-sang"] }],
      },
      {
        id: "MSG-2604",
        authorId: "usr-admin-judy",
        channel: "social",
        siteTag: "",
        message: "Friday check-in: whoever closes the cleanest field report today gets first tea break on Monday.",
        createdAt: "2026-03-27T10:16:00+03:00",
        replyToId: null,
        reactions: [{ emoji: "Like", userIds: ["usr-eng-richard", "usr-eng-mutuse", "usr-admin-kirui"] }],
      },
    ],
    syncQueue: [],
  };
}

function loadData() {
  const fallback = createSeedData();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw);
    const repaired = repairStoredData(parsed, fallback);
    if (!Array.isArray(parsed?.users) || !parsed.users.length || !Array.isArray(parsed?.syncQueue)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(repaired));
    }
    return repaired;
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

function repairStoredData(value, fallback = createSeedData()) {
  if (!value || typeof value !== "object") {
    return fallback;
  }

  return {
    ...value,
    users: repairUsers(value.users, fallback.users),
    syncQueue: Array.isArray(value.syncQueue) ? value.syncQueue : [],
  };
}

function repairUsers(users, fallbackUsers = createSeedData().users) {
  if (!Array.isArray(users)) {
    return clone(fallbackUsers);
  }

  const validUsers = users.filter((user) => user && typeof user.id === "string" && typeof user.name === "string");
  if (!validUsers.length) {
    return clone(fallbackUsers);
  }

  const fallbackById = new Map(fallbackUsers.map((user) => [user.id, user]));
  return validUsers.map((user) => ({
    ...(fallbackById.get(user.id) || {}),
    ...user,
  }));
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
}

function applyTheme() {
  document.body.dataset.theme = state.theme;
  localStorage.setItem(THEME_KEY, state.theme);
  dom.themeButtons.forEach((button) => {
    button.textContent = state.theme === "dark" ? "Bright Mode" : "Dark Mode";
  });
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", state.theme === "dark" ? "#16202b" : "#edf3f7");
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  applyTheme();
}

function renderShell() {
  dom.homePage.classList.toggle("hidden-shell", state.isAuthenticated);
  dom.appShell.classList.toggle("hidden-shell", !state.isAuthenticated);
}

function renderHome() {
  const users = repairUsers(state.data?.users);
  if (!state.data?.users?.length) {
    state.data.users = users;
  }
  if (!users.some((user) => user.id === state.activeUserId)) {
    state.activeUserId = users[0]?.id || "";
    localStorage.setItem(ACTIVE_USER_KEY, state.activeUserId);
  }

  dom.loginAccount.innerHTML = users
    .map((user) => `<option value="${escapeHtml(user.id)}">${escapeHtml(`${user.name} (${getAccessLevelLabel(user)})`)}</option>`)
    .join("");
  dom.loginAccount.value = state.activeUserId;

  if (dom.loginAccountButtons) {
    dom.loginAccountButtons.innerHTML = users
      .map((user) => {
        const activeClass = user.id === state.activeUserId ? " active" : "";
        return `<button type="button" class="ghost small login-account-button${activeClass}" data-action="pick-login-account" data-user-id="${escapeHtml(user.id)}">${escapeHtml(user.name)}</button>`;
      })
      .join("");
  }
}

function getCurrentUser() {
  return state.data.users.find((user) => user.id === state.activeUserId) || state.data.users[0];
}

function getCurrentRole() {
  return getCurrentUser().role;
}

function getRoleLabel(user = getCurrentUser()) {
  return getAccessLevelLabel(user);
}

function getAccessLevelLabel(user = getCurrentUser()) {
  return ["admin", "supervisor"].includes(user.role) ? "Admin" : "Technician";
}

function isOfficeRole() {
  return ["admin", "supervisor"].includes(getCurrentRole());
}

function isEngineerRole() {
  return getCurrentRole() === "engineer";
}

function isWorkshopRole() {
  return getCurrentRole() === "workshop";
}

function canCreateJobs() {
  return isOfficeRole();
}

function canReviewReports() {
  return isOfficeRole();
}

function canManageEngineers() {
  return isOfficeRole();
}

function canSubmitFieldReports() {
  return isEngineerRole();
}

function canSubmitWorkshopReports() {
  return isWorkshopRole();
}

function getEngineers() {
  return state.data.users.filter((user) => user.role === "engineer");
}

function getUserName(userId) {
  return state.data.users.find((candidate) => candidate.id === userId)?.name || "Unassigned";
}

function getReviewStatus(report) {
  return report.reviewStatus || "Pending";
}

function normalizeSite(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function getForumChannelMeta(channelId) {
  return FORUM_CHANNELS.find((channel) => channel.id === channelId) || FORUM_CHANNELS[0];
}

function getPresenceState(user) {
  return user.id === state.activeUserId || user.online ? "Online" : "Away";
}

function getSiteTokensForJob(job) {
  return Array.from(
    new Set([job?.repeatSiteName, job?.manualLocation, job?.clientName].map((value) => normalizeSite(value)).filter(Boolean))
  );
}

function getSiteTokens(target) {
  const job = typeof target === "string" ? findJob(target) : target;
  if (job) {
    return getSiteTokensForJob(job);
  }
  return normalizeSite(target) ? [normalizeSite(target)] : [];
}

function getSiteLabel(target) {
  const job = typeof target === "string" ? findJob(target) : target;
  if (job) {
    return job.repeatSiteName || job.manualLocation || job.clientName || "Selected Site";
  }
  return String(target || "").trim() || "Selected Site";
}

function sortJobsByExecution(left, right) {
  const order = { "In Progress": 0, Pending: 1, Completed: 2, Approved: 3, Rejected: 4 };
  return order[left.status] - order[right.status] || new Date(right.updatedAt) - new Date(left.updatedAt);
}

function getReviewQueueReports() {
  return [...state.data.fieldReports]
    .filter((report) => getReviewStatus(report) === "Pending")
    .sort((left, right) => new Date(right.capturedAt) - new Date(left.capturedAt));
}

function getReviewedReports() {
  const order = { Pending: 0, Rejected: 1, Approved: 2 };
  return [...state.data.fieldReports].sort((left, right) => {
    return order[getReviewStatus(left)] - order[getReviewStatus(right)] || new Date(right.capturedAt) - new Date(left.capturedAt);
  });
}

function getNextReviewReport(currentReportId = "") {
  const queue = getReviewQueueReports();
  const pending = queue.filter((report) => getReviewStatus(report) === "Pending" && report.id !== currentReportId);
  if (pending.length) {
    return pending[0];
  }
  return queue.find((report) => report.id !== currentReportId) || queue[0] || null;
}

function getNextReportableJobForCurrentUser(currentJobId = "") {
  const jobs = getReportableFieldJobs().sort(sortJobsByExecution);
  if (!jobs.length) {
    return null;
  }
  return jobs.find((job) => job.id !== currentJobId) || jobs[0];
}

function getDistinctSites() {
  const sites = new Map();
  state.data.jobs.forEach((job) => {
    const label = job.manualLocation || job.clientName;
    const key = normalizeSite(label);
    if (!key) {
      return;
    }
    const existing = sites.get(key);
    const reportCount = getSiteHistory(job).length;
    if (!reportCount) {
      return;
    }
    if (!existing || new Date(job.updatedAt) > new Date(existing.updatedAt)) {
      sites.set(key, {
        key,
        label,
        clientName: job.clientName,
        serviceType: job.serviceType,
        updatedAt: job.updatedAt,
        reportCount,
      });
      return;
    }
    existing.reportCount = Math.max(existing.reportCount, reportCount);
  });
  return Array.from(sites.values()).sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));
}

function getLatestJobForSite(siteName) {
  const tokens = new Set(getSiteTokens(siteName));
  if (!tokens.size) {
    return null;
  }
  return state.data.jobs
    .filter((job) => getSiteTokensForJob(job).some((token) => tokens.has(token)))
    .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt))[0] || null;
}

function getVisibleJobs() {
  if (isOfficeRole() || isWorkshopRole()) {
    return [...state.data.jobs];
  }
  return state.data.jobs.filter((job) => job.assignedEngineerId === getCurrentUser().id);
}

function getReportableFieldJobs() {
  if (!canSubmitFieldReports()) {
    return [];
  }
  return getVisibleJobs().filter((job) => ["Pending", "In Progress"].includes(job.status));
}

function findJob(jobId) {
  return state.data.jobs.find((job) => job.id === jobId) || null;
}

function findReport(reportId) {
  return state.data.fieldReports.find((report) => report.id === reportId) || null;
}

function getAccessibleReports() {
  if (isOfficeRole() || isWorkshopRole()) {
    return [...state.data.fieldReports];
  }
  return state.data.fieldReports.filter((report) => report.engineerId === getCurrentUser().id);
}

function getVisibleWorkshopReports() {
  if (isWorkshopRole() || isOfficeRole()) {
    return [...state.data.workshopReports];
  }
  return state.data.workshopReports.filter((report) => {
    const job = findJob(report.jobId);
    return job && job.assignedEngineerId === getCurrentUser().id;
  });
}

function getLatestReportForJob(jobId) {
  return state.data.fieldReports
    .filter((report) => report.jobId === jobId)
    .sort((left, right) => new Date(right.capturedAt) - new Date(left.capturedAt))[0] || null;
}

function getLatestWorkshopReportForJob(jobId) {
  return state.data.workshopReports
    .filter((report) => report.jobId === jobId)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))[0] || null;
}

function getSiteHistory(target) {
  const tokens = new Set(getSiteTokens(target));
  if (!tokens.size) {
    return [];
  }
  const relatedJobIds = new Set(
    state.data.jobs
      .filter((candidate) => getSiteTokensForJob(candidate).some((token) => tokens.has(token)))
      .map((candidate) => candidate.id)
  );
  return state.data.fieldReports
    .filter((report) => relatedJobIds.has(report.jobId))
    .sort((left, right) => new Date(right.capturedAt) - new Date(left.capturedAt));
}

function ensureSelections() {
  const jobs = getVisibleJobs().sort(sortJobsByExecution);
  if (!jobs.length) {
    state.selectedJobId = null;
    if (!getAccessibleReports().length) {
      state.selectedReportId = null;
    }
    return;
  }

  if (!jobs.some((job) => job.id === state.selectedJobId)) {
    state.selectedJobId = (isEngineerRole() ? getNextReportableJobForCurrentUser() : jobs[0])?.id || jobs[0].id;
  }

  const reports = getAccessibleReports().sort((left, right) => new Date(right.capturedAt) - new Date(left.capturedAt));
  if (state.selectedReportId && reports.some((report) => report.id === state.selectedReportId)) {
    return;
  }

  state.selectedReportId = (isOfficeRole() ? getNextReviewReport()?.id : getLatestReportForJob(state.selectedJobId)?.id) || reports[0]?.id || null;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatNumber(value, digits = 2) {
  const numeric = Number(value);
  return Number.isNaN(numeric) ? "-" : numeric.toFixed(digits);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatStatusClass(value) {
  return String(value).toLowerCase().replaceAll(" ", "-");
}

function distanceKm(latOne, lonOne, latTwo, lonTwo) {
  const toRad = (degrees) => (degrees * Math.PI) / 180;
  const earthRadius = 6371;
  const deltaLat = toRad(latTwo - latOne);
  const deltaLon = toRad(lonTwo - lonOne);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRad(latOne)) * Math.cos(toRad(latTwo)) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

function getNavigationUrl(job) {
  if (Number.isFinite(job?.latitude) && Number.isFinite(job?.longitude) && (job.latitude !== 0 || job.longitude !== 0)) {
    return `https://www.google.com/maps/search/?api=1&query=${job.latitude},${job.longitude}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${job?.clientName || ""} ${job?.manualLocation || ""}`.trim())}`;
}

function notify(message, tone = "info") {
  const element = document.createElement("div");
  element.className = `toast ${tone}`;
  element.textContent = message;
  dom.toastStack.appendChild(element);
  window.setTimeout(() => element.remove(), 4200);
}

function addActivity(message) {
  state.data.activityLogs.unshift({
    id: uid("ACT"),
    actorName: getCurrentUser().name,
    message,
    createdAt: new Date().toISOString(),
  });
  state.data.activityLogs = state.data.activityLogs.slice(0, 20);
}

function enqueueSync(type, entityId) {
  state.data.syncQueue.unshift({
    id: uid("SYNC"),
    type,
    entityId,
    createdAt: new Date().toISOString(),
  });
}

function syncQueue() {
  if (!navigator.onLine) {
    notify("Offline mode detected. Changes remain stored locally until connectivity returns.", "warn");
    return;
  }

  const queueLength = state.data.syncQueue.length;
  if (!queueLength) {
    notify("No pending sync items. Local data is already up to date.", "success");
    return;
  }

  state.data.fieldReports.forEach((report) => {
    report.synced = true;
  });
  state.data.workshopReports.forEach((report) => {
    report.synced = true;
  });
  state.data.syncQueue = [];
  addActivity(`Synchronized ${queueLength} queued updates for office review.`);
  saveData();
  renderAll();
  notify(`Synchronized ${queueLength} queued update${queueLength === 1 ? "" : "s"}.`, "success");
}

function captureCoordinates(onSuccess) {
  if (!navigator.geolocation) {
    notify("This browser does not expose GPS services.", "error");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      onSuccess({
        latitude: Number(position.coords.latitude.toFixed(6)),
        longitude: Number(position.coords.longitude.toFixed(6)),
      });
      notify("GPS coordinates captured successfully.", "success");
    },
    () => {
      notify("Unable to capture GPS coordinates. Manual entry is still available.", "warn");
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
  );
}

function getDashboardFilters() {
  return {
    serviceType: dom.dashboardServiceFilter.value,
    status: dom.dashboardStatusFilter.value,
    location: dom.dashboardLocationFilter.value.trim().toLowerCase(),
    radiusKm: Number(dom.dashboardRadiusFilter.value || 0),
    latitude: Number(dom.dashboardLat.value || DEMO_REFERENCE.latitude),
    longitude: Number(dom.dashboardLng.value || DEMO_REFERENCE.longitude),
  };
}

function getFilteredJobs() {
  const filters = getDashboardFilters();
  return getVisibleJobs().filter((job) => {
    const latestReport = getLatestReportForJob(job.id);
    const matchesService = filters.serviceType === "All" || job.serviceType === filters.serviceType;
    const matchesStatus =
      filters.status === "All" ||
      job.status === filters.status ||
      (filters.status === "Rejected" && latestReport && getReviewStatus(latestReport) === "Rejected");
    const matchesLocation =
      !filters.location ||
      job.manualLocation.toLowerCase().includes(filters.location) ||
      job.clientName.toLowerCase().includes(filters.location);
    const hasCoordinates = Number.isFinite(job.latitude) && Number.isFinite(job.longitude);
    const matchesRadius =
      !filters.radiusKm ||
      !hasCoordinates ||
      distanceKm(filters.latitude, filters.longitude, job.latitude, job.longitude) <= filters.radiusKm;
    return matchesService && matchesStatus && matchesLocation && matchesRadius;
  });
}

function setActiveView(viewId, options = {}) {
  const { recordHistory = true } = options;
  if (viewId === state.activeView) {
    renderNavigation();
    return;
  }
  if (recordHistory && state.activeView) {
    state.navigationHistory.push(state.activeView);
    state.navigationHistory = state.navigationHistory.slice(-24);
  }
  state.activeView = viewId;
  renderNavigation();
}

function handleBackNavigation() {
  const allowedViews = new Set(getAllowedViews());
  while (state.navigationHistory.length) {
    const previousView = state.navigationHistory.pop();
    if (!allowedViews.has(previousView)) {
      continue;
    }
    state.activeView = previousView;
    renderNavigation();
    renderAll();
    return;
  }
}

function getFieldDashboardMetrics(jobs) {
  const user = getCurrentUser();
  if (isWorkshopRole()) {
    return [
      {
        label: "Workshop reports by you",
        value: state.data.workshopReports.filter((report) => report.engineerId === user.id).length,
        note: "Victor can submit unlimited before and after workshop photos",
      },
      {
        label: "Open jobs",
        value: jobs.filter((job) => ["Pending", "In Progress"].includes(job.status)).length,
        note: "Jobs available for workshop reference and site navigation",
      },
      {
        label: "Pending jobs",
        value: jobs.filter((job) => job.status === "Pending").length,
        note: "Jobs not started yet",
      },
      {
        label: "In progress jobs",
        value: jobs.filter((job) => job.status === "In Progress").length,
        note: "Jobs currently active in the field or workshop chain",
      },
    ];
  }

  return [
    {
      label: "Completed jobs",
      value: jobs.filter((job) => ["Completed", "Approved"].includes(job.status) && getLatestReportForJob(job.id)?.engineerId === user.id).length,
      note: "Finished jobs you have already reported on",
    },
    {
      label: "Active jobs",
      value: jobs.filter((job) => ["Pending", "In Progress"].includes(job.status)).length,
      note: "Assignments still requiring field action",
    },
    {
      label: "Pending jobs",
      value: jobs.filter((job) => job.status === "Pending").length,
      note: "These are your pending assignments",
    },
    {
      label: "In progress jobs",
      value: jobs.filter((job) => job.status === "In Progress").length,
      note: "Jobs you have already started in the field",
    },
  ];
}

function getOfficeDashboardMetrics(jobs) {
  const reports = state.data.fieldReports;
  return [
    {
      label: "Open jobs",
      value: jobs.filter((job) => ["Pending", "In Progress", "Completed"].includes(job.status)).length,
      note: "Jobs still moving through dispatch or review",
    },
    {
      label: "Pending reports",
      value: reports.filter((report) => getReviewStatus(report) === "Pending").length,
      note: "Ready for the office managers to review",
    },
    {
      label: "Approved reports",
      value: reports.filter((report) => getReviewStatus(report) === "Approved").length,
      note: "Reports cleared and closed out",
    },
    {
      label: "Rejected reports",
      value: reports.filter((report) => getReviewStatus(report) === "Rejected").length,
      note: "Reports sent back for a revised field visit",
    },
  ];
}

function getAllowedViews() {
  if (isOfficeRole()) {
    return ["dashboard", "jobs", "reports", "approvals", "workshop", "forum", "reports-center"];
  }
  if (isWorkshopRole()) {
    return ["dashboard", "jobs", "workshop", "forum", "reports-center"];
  }
  return ["dashboard", "jobs", "reports", "forum", "reports-center"];
}

function getTechnicianJobsBadgeCount() {
  if (!isEngineerRole()) {
    return 0;
  }
  return getVisibleJobs().filter((job) => job.status === "Pending").length;
}

function renderNavigation() {
  const allowedViews = getAllowedViews();
  const pendingReviewCount = getReviewQueueReports().length;
  const technicianJobsCount = getTechnicianJobsBadgeCount();
  if (!allowedViews.includes(state.activeView)) {
    state.activeView = allowedViews[0];
  }
  dom.navButtons.forEach((button) => {
    button.dataset.label ||= button.textContent.trim();
    button.hidden = !allowedViews.includes(button.dataset.view);
    button.classList.toggle("active", button.dataset.view === state.activeView);
    if (button.dataset.view === "approvals") {
      button.innerHTML = `${escapeHtml(button.dataset.label)}${pendingReviewCount ? ` <span class="nav-badge">${escapeHtml(pendingReviewCount)}</span>` : ""}`;
      return;
    }
    if (button.dataset.view === "jobs" && technicianJobsCount) {
      button.innerHTML = `${escapeHtml(button.dataset.label)} <span class="nav-badge">${escapeHtml(technicianJobsCount)}</span>`;
      return;
    }
    button.textContent = button.dataset.label;
  });
  dom.views.forEach((view) => {
    view.classList.toggle("active", view.id === `view-${state.activeView}`);
  });
}

function renderTopbar() {
  dom.signedInName.textContent = getCurrentUser().name;
  dom.signedInMeta.textContent = getCurrentUser().email;
  dom.currentRoleChip.hidden = true;
  dom.syncCount.textContent = String(state.data.syncQueue.length);
  dom.backButton.disabled = !state.navigationHistory.length;
  dom.networkIndicator.textContent = navigator.onLine ? "Online" : "Offline";
  dom.networkIndicator.classList.toggle("online", navigator.onLine);
  dom.networkIndicator.classList.toggle("offline", !navigator.onLine);
}

function getGlobalSearchFilters() {
  return {
    technician: normalizeSite(dom.globalSearchTechnician.value),
    site: normalizeSite(dom.globalSearchSite.value),
    client: normalizeSite(dom.globalSearchClient.value),
    workType: normalizeSite(dom.globalSearchWorkType.value),
    date: dom.globalSearchDate.value,
  };
}

function buildGlobalSearchResultCard(item) {
  if (item.kind === "job") {
    return `
      <div class="list-card">
        <div class="card-title-row">
          <h3>${escapeHtml(item.job.id)}</h3>
          <span class="pill">Job</span>
        </div>
        <p class="list-copy">${escapeHtml(item.job.clientName)} | ${escapeHtml(item.job.manualLocation)}</p>
        <p class="job-description">${escapeHtml(item.job.description)}</p>
        <div class="card-meta-row">
          <span>Technician: ${escapeHtml(getUserName(item.job.assignedEngineerId))}</span>
          <span>${escapeHtml(item.job.serviceType)}</span>
        </div>
        <div class="list-actions">
          <button type="button" class="secondary" data-action="open-report-job" data-job-id="${escapeHtml(item.job.id)}">Open Job</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="list-card">
      <div class="card-title-row">
        <h3>${escapeHtml(item.report.id)}</h3>
        <span class="pill">Report</span>
      </div>
      <p class="list-copy">${escapeHtml(item.job?.clientName || item.report.jobId)} | ${escapeHtml(item.job?.manualLocation || "Unknown site")}</p>
      <p class="job-description">${escapeHtml(item.report.workDone)}</p>
      <div class="card-meta-row">
        <span>Technician: ${escapeHtml(getUserName(item.report.engineerId))}</span>
        <span>${escapeHtml(item.job?.serviceType || "Field report")}</span>
      </div>
      <div class="list-actions">
        <button type="button" class="secondary" data-action="preview-report" data-report-id="${escapeHtml(item.report.id)}">View Report</button>
        <button type="button" class="ghost" data-action="open-report-job" data-job-id="${escapeHtml(item.report.jobId)}">Open Job</button>
      </div>
    </div>
  `;
}

function renderGlobalSearchResults() {
  const filters = getGlobalSearchFilters();
  const hasFilters = Boolean(filters.technician || filters.site || filters.client || filters.workType || filters.date);
  if (!hasFilters) {
    dom.globalSearchSummary.textContent = "Search jobs and reports by technician, site, client, or type of work.";
    dom.globalSearchResults.hidden = true;
    dom.globalSearchResults.innerHTML = "";
    return;
  }

  const jobMatches = state.data.jobs
    .filter((job) => {
      const technician = normalizeSite(getUserName(job.assignedEngineerId));
      const site = normalizeSite(`${job.manualLocation} ${job.repeatSiteName || ""}`);
      const client = normalizeSite(`${job.clientName} ${job.contactPerson || ""}`);
      const work = normalizeSite(`${job.serviceType} ${job.description}`);
      const jobDate = String(job.updatedAt).slice(0, 10);
      return (
        (!filters.technician || technician.includes(filters.technician)) &&
        (!filters.site || site.includes(filters.site)) &&
        (!filters.client || client.includes(filters.client)) &&
        (!filters.workType || work.includes(filters.workType)) &&
        (!filters.date || jobDate === filters.date)
      );
    })
    .map((job) => ({ kind: "job", job }));

  const reportMatches = state.data.fieldReports
    .filter((report) => {
      const job = findJob(report.jobId);
      const technician = normalizeSite(getUserName(report.engineerId));
      const site = normalizeSite(`${job?.manualLocation || ""} ${job?.repeatSiteName || ""}`);
      const client = normalizeSite(`${job?.clientName || ""} ${job?.contactPerson || ""}`);
      const work = normalizeSite(`${job?.serviceType || ""} ${report.workDone} ${report.diagnosis}`);
      const reportDate = String(report.capturedAt).slice(0, 10);
      return (
        (!filters.technician || technician.includes(filters.technician)) &&
        (!filters.site || site.includes(filters.site)) &&
        (!filters.client || client.includes(filters.client)) &&
        (!filters.workType || work.includes(filters.workType)) &&
        (!filters.date || reportDate === filters.date)
      );
    })
    .map((report) => ({ kind: "report", report, job: findJob(report.jobId) }));

  const results = [...jobMatches, ...reportMatches].slice(0, 12);
  dom.globalSearchSummary.textContent = `${results.length} result${results.length === 1 ? "" : "s"} found across jobs and reports.`;
  dom.globalSearchResults.hidden = false;
  dom.globalSearchResults.innerHTML = results.length
    ? results.map((item) => buildGlobalSearchResultCard(item)).join("")
    : `<div class="list-card"><p class="list-copy">No jobs or reports matched the current search filters.</p></div>`;
}

function renderKpis(jobs) {
  const metrics = isOfficeRole() ? getOfficeDashboardMetrics(jobs) : getFieldDashboardMetrics(jobs);
  dom.kpiGrid.innerHTML = metrics
    .map(
      (metric) => `
        <div class="kpi-card">
          <span class="meta-copy">${escapeHtml(metric.label)}</span>
          <strong>${escapeHtml(metric.value)}</strong>
          <p class="list-copy">${escapeHtml(metric.note)}</p>
        </div>
      `
    )
    .join("");
}

function renderServiceMix(jobs) {
  const total = jobs.length || 1;
  dom.serviceMix.innerHTML = ["Borehole", "Solar", "Water Treatment"]
    .map((service) => {
      const serviceJobs = jobs.filter((job) => job.serviceType === service);
      return {
        service,
        count: serviceJobs.length,
        share: (serviceJobs.length / total) * 100,
      };
    })
    .map(
      (item) => `
        <div class="bar-row">
          <div class="bar-topline">
            <span>${escapeHtml(item.service)}: ${item.count} jobs</span>
            <span>${escapeHtml(`${Math.round(item.share)}%`)}</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width:${item.share}%"></div>
          </div>
        </div>
      `
    )
    .join("");
}

function renderActivityFeed() {
  dom.activityFeed.innerHTML = state.data.activityLogs
    .slice(0, 10)
    .map(
      (log) => `
        <div class="timeline-item">
          <strong>${escapeHtml(log.actorName)}: ${escapeHtml(log.message)}</strong>
          <span>${escapeHtml(formatDateTime(log.createdAt))}</span>
        </div>
      `
    )
    .join("");
}

function renderJobsMap(jobs) {
  const filters = getDashboardFilters();
  dom.mapMeta.textContent = `Ref ${formatNumber(filters.latitude, 4)}, ${formatNumber(filters.longitude, 4)} | Radius ${filters.radiusKm || 0} km`;

  const coordinates = jobs.filter((job) => Number.isFinite(job.latitude) && Number.isFinite(job.longitude));
  if (!coordinates.length) {
    dom.jobsMap.innerHTML = `<text x="50" y="50" text-anchor="middle" fill="#93a7b8" font-size="5">No plotted jobs for the current filters</text>`;
    return;
  }

  const latitudes = coordinates.map((job) => job.latitude);
  const longitudes = coordinates.map((job) => job.longitude);
  const latMin = Math.min(...latitudes) - 0.2;
  const latMax = Math.max(...latitudes) + 0.2;
  const lngMin = Math.min(...longitudes) - 0.2;
  const lngMax = Math.max(...longitudes) + 0.2;

  dom.jobsMap.innerHTML = `
    <rect x="4" y="4" width="92" height="92" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)"></rect>
    ${coordinates
      .map((job) => {
        const x = ((job.longitude - lngMin) / (lngMax - lngMin || 1)) * 84 + 8;
        const y = 92 - ((job.latitude - latMin) / (latMax - latMin || 1)) * 84;
        return `
          <g>
            <circle cx="${x}" cy="${y}" r="${job.id === state.selectedJobId ? 4.6 : 3.4}" fill="${SERVICE_COLORS[job.serviceType]}" stroke="rgba(255,255,255,0.85)" stroke-width="0.8"></circle>
            <text x="${x + 2}" y="${y - 3}" fill="#edf3f7" font-size="3.2">${escapeHtml(job.clientName)}</text>
          </g>
        `;
      })
      .join("")}
    <text x="8" y="96" fill="#93a7b8" font-size="3">West</text>
    <text x="88" y="96" fill="#93a7b8" font-size="3" text-anchor="end">East</text>
  `;
}

function buildStatusBadge(status) {
  return `<span class="badge status-${escapeHtml(formatStatusClass(status))}">${escapeHtml(status)}</span>`;
}

function buildTechnicianRepeatHistory(job) {
  const history = getSiteHistory(job).filter((report) => report.jobId !== job.id).slice(0, 4);
  if (!isEngineerRole() || !["Pending", "In Progress"].includes(job.status) || !history.length) {
    return "";
  }

  return `
    <div class="job-history-embed">
      <div class="card-title-row">
        <strong>Past site reports</strong>
        <span class="pill">${escapeHtml(`${history.length} visible`)}</span>
      </div>
      <p class="list-copy">This repeat-site history stays attached to this job even after earlier reports were approved.</p>
      <div class="card-list compact-list">
        ${history
          .map(
            (report) => `
              <div class="list-card compact-card ${report.id === state.selectedReportId ? "selected" : ""}">
                <div class="card-title-row">
                  <h3>${escapeHtml(report.id)}</h3>
                  ${buildStatusBadge(getReviewStatus(report))}
                </div>
                <p class="list-copy">${escapeHtml(getUserName(report.engineerId))} | ${escapeHtml(formatDateTime(report.capturedAt))}</p>
                <p class="job-description">${escapeHtml(report.workDone)}</p>
                <div class="list-actions">
                  <button type="button" class="secondary" data-action="preview-report" data-report-id="${escapeHtml(report.id)}">View Full Report</button>
                  <button type="button" class="ghost" data-action="open-report-job" data-job-id="${escapeHtml(report.jobId)}">Open Source Job</button>
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function buildJobCard(job, compact = false) {
  const latestReport = getLatestReportForJob(job.id);
  const reviewStatus = latestReport ? getReviewStatus(latestReport) : "No report";
  const actions = [];

  if (!compact) {
    actions.push(`<button type="button" class="secondary" data-action="select-job" data-job-id="${escapeHtml(job.id)}">Select</button>`);
    actions.push(`<button type="button" class="secondary" data-action="open-map" data-job-id="${escapeHtml(job.id)}">Open Site Link</button>`);

    if (canCreateJobs()) {
      actions.push(`<button type="button" class="secondary" data-action="edit-job" data-job-id="${escapeHtml(job.id)}">Edit Job</button>`);
      if (latestReport) {
        actions.push(`<button type="button" class="ghost" data-action="preview-job-report" data-job-id="${escapeHtml(job.id)}">Preview Report</button>`);
        actions.push(`<button type="button" class="primary" data-action="review-job-report" data-job-id="${escapeHtml(job.id)}">Review Report</button>`);
      }
    }

    if (isEngineerRole() && job.assignedEngineerId === getCurrentUser().id) {
      if (job.status === "Pending") {
        actions.push(`<button type="button" class="primary" data-action="start-job" data-job-id="${escapeHtml(job.id)}">Start Job</button>`);
      }
      if (["Pending", "In Progress"].includes(job.status)) {
        actions.push(`<button type="button" class="secondary" data-action="open-report-form" data-job-id="${escapeHtml(job.id)}">Open Report</button>`);
      } else if (latestReport) {
        actions.push(`<button type="button" class="ghost" data-action="preview-job-report" data-job-id="${escapeHtml(job.id)}">Preview Report</button>`);
      }
    }

    if (isWorkshopRole()) {
      actions.push(`<button type="button" class="secondary" data-action="open-workshop-form" data-job-id="${escapeHtml(job.id)}">Workshop Report</button>`);
    }
  }

  return `
    <div class="job-card ${job.id === state.selectedJobId ? "selected" : ""}" data-job-id="${escapeHtml(job.id)}">
      <div class="card-title-row">
        <h3>${escapeHtml(job.clientName)}</h3>
        <div class="card-meta-row">
          ${buildStatusBadge(job.status)}
          <span class="badge service-${escapeHtml(formatStatusClass(job.serviceType))}">${escapeHtml(job.serviceType)}</span>
          <span class="badge priority-${escapeHtml(formatStatusClass(job.priority))}">${escapeHtml(job.priority)}</span>
          ${job.repeatSiteName ? `<span class="pill">Repeat Site</span>` : ""}
        </div>
      </div>
      <p class="list-copy">${escapeHtml(job.id)} | ${escapeHtml(job.manualLocation)}</p>
      <p class="job-description">${escapeHtml(job.description)}</p>
      <div class="card-meta-row">
        <span>Technician: ${escapeHtml(getUserName(job.assignedEngineerId))}</span>
        <span>Review: ${escapeHtml(reviewStatus)}</span>
      </div>
      ${buildTechnicianRepeatHistory(job)}
      ${actions.length ? `<div class="list-actions">${actions.join("")}</div>` : ""}
    </div>
  `;
}

function renderDashboard() {
  const filteredJobs = getFilteredJobs();
  if (isOfficeRole()) {
    dom.dashboardTitle.textContent = "Dispatch, people management, and report review stay in one queue.";
    dom.dashboardSubtitle.textContent = "Kirui Isaiah, Judy, and Sang Nicholas share the same manager permissions for jobs, technicians, and report decisions.";
    dom.dashboardJobsHeading.textContent = "Filtered Jobs";
  } else if (isWorkshopRole()) {
    dom.dashboardTitle.textContent = "Workshop visibility for Victor and linked site follow-up.";
    dom.dashboardSubtitle.textContent = "Victor can open the site link, review job context, and submit workshop reports with unlimited before and after photos.";
    dom.dashboardJobsHeading.textContent = "Workshop Queue";
  } else {
    dom.dashboardTitle.textContent = `Assignments and personal report history for ${getCurrentUser().name}.`;
    dom.dashboardSubtitle.textContent = "Technicians focus on their own assigned jobs and reports, while repeat-site history still surfaces the full site story when needed.";
    dom.dashboardJobsHeading.textContent = "My Jobs";
  }

  renderKpis(filteredJobs);
  renderServiceMix(filteredJobs);
  renderActivityFeed();
  renderJobsMap(filteredJobs);
  dom.dashboardJobs.innerHTML = filteredJobs.length
    ? filteredJobs
        .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt))
        .slice(0, 6)
        .map((job) => buildJobCard(job, false))
        .join("")
    : `<div class="list-card"><p class="list-copy">No jobs match the selected service, location, or radius filters.</p></div>`;
}

function fillEngineerOptions(selectElement, selectedId) {
  selectElement.innerHTML = getEngineers()
    .map((engineer) => `<option value="${escapeHtml(engineer.id)}">${escapeHtml(`${engineer.name} (${engineer.teamStatus})`)}</option>`)
    .join("");
  selectElement.value = selectedId || getEngineers()[0]?.id || "";
}

function fillJobSelect(selectElement, selectedValue, jobs = getVisibleJobs()) {
  const sortedJobs = [...jobs].sort(sortJobsByExecution);
  selectElement.innerHTML = sortedJobs.length
    ? sortedJobs
        .map((job) => `<option value="${escapeHtml(job.id)}">${escapeHtml(`${job.id} | ${job.clientName} | ${job.manualLocation}`)}</option>`)
        .join("")
    : `<option value="">No jobs available</option>`;
  selectElement.value = selectedValue && sortedJobs.some((job) => job.id === selectedValue) ? selectedValue : sortedJobs[0]?.id || "";
}

function setFormValue(element, value) {
  element.value = value ?? "";
}

function populateJobForm(job) {
  setFormValue(dom.jobId, job?.id || "");
  setFormValue(dom.jobClientName, job?.clientName || "");
  setFormValue(dom.jobContactPerson, job?.contactPerson || "");
  setFormValue(dom.jobContactPhone, job?.contactPhone || "");
  setFormValue(dom.jobServiceType, job?.serviceType || "Borehole");
  setFormValue(dom.jobManualLocation, job?.manualLocation || "");
  setFormValue(dom.jobLatitude, job?.latitude ?? "");
  setFormValue(dom.jobLongitude, job?.longitude ?? "");
  setFormValue(dom.jobPriority, job?.priority || "Medium");
  setFormValue(dom.jobStatus, job?.status || "Pending");
  fillEngineerOptions(dom.jobAssignedEngineer, job?.assignedEngineerId || getEngineers()[0]?.id);
  setFormValue(dom.jobDescription, job?.description || "");
  fillRepeatSiteOptions(job?.repeatSiteName || "");
  dom.jobRepeatSite.value = job?.repeatSiteName || "";
  renderRepeatJobHistory(job?.repeatSiteName || "");
}

function fillRepeatSiteOptions(selectedSite = "") {
  const sites = getDistinctSites();
  dom.jobRepeatSite.innerHTML = [
    `<option value="">New site / first-time visit</option>`,
    ...sites.map((site) => `<option value="${escapeHtml(site.label)}">${escapeHtml(`${site.label} | ${site.clientName} | ${site.reportCount} reports`)}</option>`),
  ].join("");
  dom.jobRepeatSite.value = sites.some((site) => site.label === selectedSite) ? selectedSite : "";
}

function buildHistoryCard(report) {
  const job = findJob(report.jobId);
  return `
    <div class="list-card ${report.id === state.selectedReportId ? "selected" : ""}">
      <div class="card-title-row">
        <h3>${escapeHtml(report.id)}</h3>
        ${buildStatusBadge(getReviewStatus(report))}
      </div>
      <p class="list-copy">${escapeHtml(job?.clientName || report.jobId)} | ${escapeHtml(formatDateTime(report.capturedAt))}</p>
      <p class="job-description">${escapeHtml(report.workDone)}</p>
      <div class="card-meta-row">
        <span>Technician: ${escapeHtml(getUserName(report.engineerId))}</span>
        <span>Site: ${escapeHtml(job?.manualLocation || getSiteLabel(job))}</span>
      </div>
      <div class="list-actions">
        <button type="button" class="secondary" data-action="preview-report" data-report-id="${escapeHtml(report.id)}">Preview</button>
        <button type="button" class="ghost" data-action="open-report-job" data-job-id="${escapeHtml(report.jobId)}">Open Job</button>
      </div>
    </div>
  `;
}

function renderRepeatJobHistory(siteName) {
  const history = getSiteHistory(siteName);
  dom.jobRepeatHistory.innerHTML = history.length
    ? `
        <div class="list-card">
          <div class="card-title-row">
            <h3>${escapeHtml(getSiteLabel(siteName))}</h3>
            <span class="pill">${escapeHtml(`${history.length} reports on file`)}</span>
          </div>
          <p class="list-copy">Managers can review the full site record here before dispatching a repeat visit.</p>
        </div>
        ${history.map((report) => buildHistoryCard(report)).join("")}
      `
    : `<div class="list-card"><p class="list-copy">Choose a repeat site to load the full report history for that location.</p></div>`;
}

function applyRepeatSiteSelection(siteName, shouldAutofill = true) {
  renderRepeatJobHistory(siteName);
  if (!siteName || !shouldAutofill) {
    return;
  }

  const latestJob = getLatestJobForSite(siteName);
  if (!latestJob) {
    return;
  }

  dom.jobClientName.value = latestJob.clientName;
  dom.jobContactPerson.value = latestJob.contactPerson;
  dom.jobContactPhone.value = latestJob.contactPhone;
  dom.jobManualLocation.value = latestJob.manualLocation;
  dom.jobLatitude.value = latestJob.latitude;
  dom.jobLongitude.value = latestJob.longitude;
  dom.jobDescription.value = dom.jobDescription.value.trim() || `Repeat visit for ${latestJob.manualLocation}. Review the earlier reports before attending site.`;
}

function createMaterialRow(material = {}) {
  const row = document.createElement("div");
  row.className = "entry-row";
  row.innerHTML = `
    <label class="field">
      <span>Name</span>
      <input type="text" data-key="name" value="${escapeHtml(material.name || "")}" placeholder="Pipe fitting">
    </label>
    <label class="field">
      <span>Qty</span>
      <input type="text" data-key="quantity" value="${escapeHtml(material.quantity || "")}" placeholder="2">
    </label>
    <label class="field">
      <span>Unit</span>
      <input type="text" data-key="unit" value="${escapeHtml(material.unit || "")}" placeholder="pcs">
    </label>
    <button type="button" class="ghost" data-action="remove-entry">Remove</button>
  `;
  return row;
}

function createMeasurementRow(measurement = {}) {
  const row = document.createElement("div");
  row.className = "entry-row";
  row.innerHTML = `
    <label class="field">
      <span>Measurement</span>
      <input type="text" data-key="label" value="${escapeHtml(measurement.label || "")}" placeholder="Depth">
    </label>
    <label class="field">
      <span>Value</span>
      <input type="text" data-key="value" value="${escapeHtml(measurement.value || "")}" placeholder="128">
    </label>
    <label class="field">
      <span>Unit</span>
      <input type="text" data-key="unit" value="${escapeHtml(measurement.unit || "")}" placeholder="m">
    </label>
    <button type="button" class="ghost" data-action="remove-entry">Remove</button>
  `;
  return row;
}

function createPartRow(part = {}) {
  const row = document.createElement("div");
  row.className = "entry-row parts";
  row.innerHTML = `
    <label class="field">
      <span>Part</span>
      <input type="text" data-key="name" value="${escapeHtml(part.name || "")}" placeholder="Bearing set">
    </label>
    <label class="field">
      <span>Qty</span>
      <input type="text" data-key="quantity" value="${escapeHtml(part.quantity || "")}" placeholder="1">
    </label>
    <label class="field">
      <span>Unit cost</span>
      <input type="text" data-key="unitCost" value="${escapeHtml(part.unitCost || "")}" placeholder="1500">
    </label>
    <button type="button" class="ghost" data-action="remove-entry">Remove</button>
  `;
  return row;
}

function readEntryList(container) {
  return Array.from(container.querySelectorAll(".entry-row"))
    .map((row) => {
      const values = {};
      row.querySelectorAll("[data-key]").forEach((input) => {
        values[input.dataset.key] = input.value.trim();
      });
      return values;
    })
    .filter((item) => Object.values(item).some((value) => value !== ""));
}

function renderImagePreviews(container, images, bucketName) {
  container.innerHTML = images.length
    ? images
        .map(
          (image, index) => `
            <figure class="image-thumb">
              <button type="button" class="image-delete" data-action="remove-image" data-bucket="${escapeHtml(bucketName)}" data-index="${index}">x</button>
              <img src="${image.dataUrl}" alt="${escapeHtml(image.name)}">
              <figcaption>${escapeHtml(image.name)}</figcaption>
            </figure>
          `
        )
        .join("")
    : `<div class="list-card"><p class="list-copy">No photos added yet.</p></div>`;
}

function resetReportForm() {
  const reportableJobs = canSubmitFieldReports() ? getReportableFieldJobs() : getVisibleJobs();
  fillJobSelect(dom.reportJobSelect, state.selectedJobId, reportableJobs);
  dom.reportCapturedAt.value = formatDateTime(new Date().toISOString());
  dom.reportLatitude.value = "";
  dom.reportLongitude.value = "";
  dom.reportDiagnosis.value = "";
  dom.reportWorkDone.value = "";
  dom.reportNotes.value = "";
  dom.materialsList.innerHTML = "";
  dom.measurementsList.innerHTML = "";
  dom.materialsList.appendChild(createMaterialRow());
  dom.measurementsList.appendChild(createMeasurementRow());
  state.uploads.reportBefore = [];
  state.uploads.reportAfter = [];
  dom.reportBeforeInput.value = "";
  dom.reportAfterInput.value = "";
  renderImagePreviews(dom.reportBeforePreview, state.uploads.reportBefore, "reportBefore");
  renderImagePreviews(dom.reportAfterPreview, state.uploads.reportAfter, "reportAfter");
}

function resetWorkshopForm() {
  fillJobSelect(dom.workshopJobSelect, state.selectedJobId, state.data.jobs);
  dom.workshopRepairDetails.value = "";
  dom.workshopCosts.value = "";
  dom.workshopNotes.value = "";
  dom.workshopPartsList.innerHTML = "";
  dom.workshopPartsList.appendChild(createPartRow());
  state.uploads.workshopBefore = [];
  state.uploads.workshopAfter = [];
  dom.workshopBeforeInput.value = "";
  dom.workshopAfterInput.value = "";
  renderImagePreviews(dom.workshopBeforePreview, state.uploads.workshopBefore, "workshopBefore");
  renderImagePreviews(dom.workshopAfterPreview, state.uploads.workshopAfter, "workshopAfter");
}

function resetReviewForm() {
  dom.reviewNotes.value = "";
}

function resetAllForms() {
  populateJobForm(null);
  resetReportForm();
  resetWorkshopForm();
  resetReviewForm();
  state.forumReplyToId = null;
}

function appendFilesToBucket(files, bucketName, previewTarget, inputElement) {
  Array.from(files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      state.uploads[bucketName].push({ name: file.name, dataUrl: reader.result });
      renderImagePreviews(previewTarget, state.uploads[bucketName], bucketName);
    };
    reader.readAsDataURL(file);
  });
  if (inputElement) {
    inputElement.value = "";
  }
}

function setFormDisabled(formElement, disabled) {
  Array.from(formElement.elements).forEach((element) => {
    if (!(element instanceof HTMLElement)) {
      return;
    }
    element.disabled = disabled;
  });
}

function renderTeamManagement() {
  if (!canManageEngineers()) {
    dom.teamRoleHint.textContent = "Only managers can manage technician availability.";
    dom.teamManagement.innerHTML = `<div class="list-card"><p class="list-copy">This panel is read-only for the current user.</p></div>`;
    return;
  }

  dom.teamRoleHint.textContent = "Update technician availability and monitor current assignment load.";
  dom.teamManagement.innerHTML = getEngineers()
    .map((engineer) => {
      const activeCount = state.data.jobs.filter((job) => job.assignedEngineerId === engineer.id && ["Pending", "In Progress"].includes(job.status)).length;
      return `
        <div class="list-card">
          <div class="card-title-row">
            <h3>${escapeHtml(engineer.name)}</h3>
            <span class="pill">${escapeHtml(engineer.teamStatus)}</span>
          </div>
          <p class="list-copy">Base: ${escapeHtml(engineer.base)} | Phone: ${escapeHtml(engineer.phone)}</p>
          <p class="list-copy">Active jobs: ${activeCount}</p>
          <label class="field">
            <span>Availability</span>
            <select data-action="team-status" data-user-id="${escapeHtml(engineer.id)}">
              ${TEAM_STATUSES.map((status) => `<option value="${escapeHtml(status)}" ${status === engineer.teamStatus ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}
            </select>
          </label>
        </div>
      `;
    })
    .join("");
}

function renderJobLane(target, jobs, emptyMessage) {
  target.innerHTML = jobs.length
    ? jobs.map((job) => buildJobCard(job, false)).join("")
    : `<div class="list-card"><p class="list-copy">${escapeHtml(emptyMessage)}</p></div>`;
}

function renderEngineerJobsBoard(jobs) {
  const pendingJobs = jobs.filter((job) => job.status === "Pending");
  const inProgressJobs = jobs.filter((job) => job.status === "In Progress");
  const completedJobs = jobs.filter((job) => ["Completed", "Approved"].includes(job.status));

  dom.engineerJobsHint.textContent = "Start a pending assignment to move it live, then submit the site report to clear space for the next job on your board.";
  dom.engineerPendingBadge.textContent = String(pendingJobs.length);
  dom.engineerInProgressBadge.textContent = String(inProgressJobs.length);
  dom.engineerCompletedBadge.textContent = String(completedJobs.length);

  renderJobLane(dom.engineerPendingJobs, pendingJobs, "No pending jobs are assigned to you.");
  renderJobLane(dom.engineerInProgressJobs, inProgressJobs, "No jobs are currently in progress.");
  renderJobLane(dom.engineerCompletedJobs, completedJobs, "No completed jobs are available yet.");
}

function renderTechnicianSiteHistory(job) {
  if (!job) {
    dom.technicianHistoryHint.textContent = "Select one of your jobs to see the site trail.";
    dom.technicianJobContext.innerHTML = `<p class="list-copy">Choose a job card to load the site history and repeat-work context.</p>`;
    dom.technicianJobHistory.innerHTML = `<div class="list-card"><p class="list-copy">No site history is loaded yet.</p></div>`;
    return;
  }

  const history = getSiteHistory(job);
  dom.technicianHistoryHint.textContent = job.repeatSiteName
    ? "Repeat-site history is pinned inside the pending job card and remains visible here for deeper review."
    : "Site history appears here whenever previous reports exist for the same location.";
  renderJobContext(
    dom.technicianJobContext,
    job,
    `<p class="helper-text">Past site reports stay attached to the selected job so you can review earlier findings before starting or reporting.</p>`
  );
  dom.technicianJobHistory.innerHTML = history.length
    ? history.map((report) => buildHistoryCard(report)).join("")
    : `<div class="list-card"><p class="list-copy">No earlier reports are stored for this site yet.</p></div>`;
}

function renderJobs() {
  const jobs = getVisibleJobs().sort(sortJobsByExecution);
  dom.jobsCountBadge.textContent = `${jobs.length} job${jobs.length === 1 ? "" : "s"}`;
  dom.jobsList.innerHTML = jobs.length
    ? jobs.map((job) => buildJobCard(job, false)).join("")
    : `<div class="list-card"><p class="list-copy">No jobs are visible for the current user.</p></div>`;

  fillEngineerOptions(dom.jobAssignedEngineer, findJob(state.selectedJobId)?.assignedEngineerId || getEngineers()[0]?.id);
  fillRepeatSiteOptions(dom.jobRepeatSite.value || findJob(dom.jobId.value)?.repeatSiteName || "");
  dom.jobFormPanel.hidden = !canCreateJobs();
  dom.teamManagementPanel.hidden = !canManageEngineers();
  dom.engineerJobsPanel.hidden = !isEngineerRole();
  dom.jobQueuePanel.hidden = isEngineerRole() ? true : false;

  if (canCreateJobs()) {
    dom.jobRoleHint.textContent = "Kirui Isaiah, Judy, and Sang Nicholas work with the same manager permissions across dispatch and approvals.";
    setFormDisabled(dom.jobForm, false);
    dom.jobFormReset.disabled = false;
    renderRepeatJobHistory(dom.jobRepeatSite.value || findJob(dom.jobId.value)?.repeatSiteName || "");
    renderTeamManagement();
    return;
  }

  setFormDisabled(dom.jobForm, true);
  dom.jobFormReset.disabled = false;

  if (isEngineerRole()) {
    renderEngineerJobsBoard(jobs);
    renderTechnicianSiteHistory(findJob(state.selectedJobId) || getNextReportableJobForCurrentUser() || jobs[0]);
    return;
  }

  dom.jobRoleHint.textContent = "Victor can review job context and open site links here, but cannot create or dispatch jobs.";
  dom.teamManagement.innerHTML = "";
}

function renderJobContext(target, job, extra = "") {
  if (!job) {
    target.innerHTML = `<p class="list-copy">Select a job to view site context.</p>`;
    return;
  }

  const latestReport = getLatestReportForJob(job.id);
  const historyCount = getSiteHistory(job.id).length;
  target.innerHTML = `
    <h3>${escapeHtml(job.clientName)}</h3>
    <p>${escapeHtml(job.id)} | ${escapeHtml(job.serviceType)} | ${escapeHtml(job.manualLocation)}</p>
    <div class="context-meta">
      ${buildStatusBadge(job.status)}
      <span class="pill">Technician: ${escapeHtml(getUserName(job.assignedEngineerId))}</span>
      <span class="pill">Phone: ${escapeHtml(job.contactPhone)}</span>
      <span class="pill">Past reports on site: ${historyCount}</span>
      <span class="pill">Latest review: ${escapeHtml(latestReport ? getReviewStatus(latestReport) : "No report yet")}</span>
      ${job.repeatSiteName ? `<span class="pill">Repeat site: ${escapeHtml(job.repeatSiteName)}</span>` : ""}
    </div>
    ${extra}
  `;
}

function buildReportCard(report) {
  const job = findJob(report.jobId);
  const reviewer = report.reviewedById ? getUserName(report.reviewedById) : "Pending review";
  const previewLabel = canReviewReports() ? "Preview & Review" : "Preview";
  const previewClass = canReviewReports() ? "primary" : "secondary";
  const actions = [
    `<button type="button" class="${previewClass}" data-action="preview-report" data-report-id="${escapeHtml(report.id)}">${previewLabel}</button>`,
    `<button type="button" class="secondary" data-action="open-report-job" data-job-id="${escapeHtml(report.jobId)}">Open Job</button>`,
  ];

  if (canReviewReports()) {
    actions.push(`<button type="button" class="ghost" data-action="review-report" data-report-id="${escapeHtml(report.id)}">Review Queue</button>`);
    if (getReviewStatus(report) === "Approved") {
      actions.push(`<button type="button" class="secondary" data-action="download-report" data-report-id="${escapeHtml(report.id)}">Download</button>`);
    }
  }

  return `
    <div class="list-card ${report.id === state.selectedReportId ? "selected" : ""}">
      <div class="card-title-row">
        <h3>${escapeHtml(report.id)}</h3>
        ${buildStatusBadge(getReviewStatus(report))}
      </div>
      <p class="list-copy">${escapeHtml(job?.clientName || report.jobId)} | ${escapeHtml(formatDateTime(report.capturedAt))}</p>
      <p class="job-description">${escapeHtml(report.diagnosis)}</p>
      <p class="list-copy">Technician: ${escapeHtml(getUserName(report.engineerId))} | Reviewer: ${escapeHtml(reviewer)}</p>
      ${report.reviewNotes ? `<p class="list-copy">Review notes: ${escapeHtml(report.reviewNotes)}</p>` : ""}
      <div class="list-actions">${actions.join("")}</div>
    </div>
  `;
}

function renderSiteHistory() {
  const history = getSiteHistory(state.selectedJobId);
  const siteLabel = getSiteLabel(state.selectedJobId);
  dom.repeatSiteHistory.innerHTML = history.length
    ? `
        <div class="list-card">
          <div class="card-title-row">
            <h3>${escapeHtml(siteLabel)}</h3>
            <span class="pill">${escapeHtml(`${history.length} reports found`)}</span>
          </div>
          <p class="list-copy">This history follows the site, not just the current technician, so repeat visits start with full context.</p>
        </div>
        ${history.map((report) => buildHistoryCard(report)).join("")}
      `
    : `<div class="list-card"><p class="list-copy">No previous reports found on this site yet.</p></div>`;
}

function renderReports() {
  const reportableJobs = canSubmitFieldReports() ? getReportableFieldJobs() : getVisibleJobs();
  fillJobSelect(dom.reportJobSelect, state.selectedJobId, reportableJobs);
  const job = findJob(dom.reportJobSelect.value) || findJob(state.selectedJobId);
  if (job) {
    state.selectedJobId = job.id;
  }
  renderJobContext(dom.reportJobSummary, job);
  renderSiteHistory();

  if (canSubmitFieldReports()) {
    dom.reportRoleHint.textContent = "Technicians must attach before-work and after-work photos with no upload limit, and repeat-site history stays visible beside the form.";
  } else if (isWorkshopRole()) {
    dom.reportRoleHint.textContent = "Victor uses the workshop tab for workshop reporting. Field report capture is view-only here.";
  } else {
    dom.reportRoleHint.textContent = "Managers review field evidence here and can move straight into approval from report preview.";
  }

  const canEditReportForm =
    canSubmitFieldReports() &&
    job &&
    job.assignedEngineerId === getCurrentUser().id &&
    reportableJobs.some((candidate) => candidate.id === job.id);
  setFormDisabled(dom.reportForm, !canEditReportForm);
  dom.reportResetButton.disabled = false;
  dom.openSiteLinkButton.disabled = !job;
  dom.reportGpsButton.disabled = !canEditReportForm;
  dom.addMaterialButton.disabled = !canEditReportForm;
  dom.addMeasurementButton.disabled = !canEditReportForm;

  const reports = getAccessibleReports().sort((left, right) => new Date(right.capturedAt) - new Date(left.capturedAt));
  dom.reportsList.innerHTML = reports.length
    ? reports.map((report) => buildReportCard(report)).join("")
    : `<div class="list-card"><p class="list-copy">No field reports are available yet.</p></div>`;
}

function fillReviewReportOptions() {
  const reports = getReviewQueueReports();
  dom.approvalReportSelect.innerHTML = reports.length
    ? reports
        .map((report) => {
          const job = findJob(report.jobId);
          return `<option value="${escapeHtml(report.id)}">${escapeHtml(`${report.id} | ${job?.clientName || report.jobId} | ${getReviewStatus(report)}`)}</option>`;
        })
        .join("")
    : `<option value="">No pending reports</option>`;
  dom.approvalReportSelect.value = state.selectedReportId && reports.some((report) => report.id === state.selectedReportId) ? state.selectedReportId : getNextReviewReport()?.id || reports[0]?.id || "";
}

function renderApprovalContext() {
  const report = findReport(dom.approvalReportSelect.value);
  if (!report) {
    dom.approvalContext.innerHTML = `<p class="list-copy">No pending reports are waiting for approval right now.</p>`;
    dom.approvalSummary.value = "";
    dom.reviewNotes.value = "";
    return;
  }

  const job = findJob(report.jobId);
  const reviewer = report.reviewedById ? getUserName(report.reviewedById) : "Not reviewed yet";
  dom.approvalContext.innerHTML = `
    <h3>${escapeHtml(job?.clientName || report.jobId)}</h3>
    <p>${escapeHtml(report.id)} | ${escapeHtml(formatDateTime(report.capturedAt))}</p>
    <div class="context-meta">
      ${buildStatusBadge(getReviewStatus(report))}
      <span class="pill">Technician: ${escapeHtml(getUserName(report.engineerId))}</span>
      <span class="pill">Reviewer: ${escapeHtml(reviewer)}</span>
      <span class="pill">Location: ${escapeHtml(job?.manualLocation || "Unknown")}</span>
    </div>
  `;
  dom.approvalSummary.value = buildSummaryText(report);
  dom.reviewNotes.value = report.reviewNotes || "";
}

function renderApprovals() {
  fillReviewReportOptions();
  renderApprovalContext();
  const hasPendingReports = getReviewQueueReports().length > 0;
  dom.reviewRoleHint.textContent = canReviewReports()
    ? "Kirui Isaiah, Judy, and Sang Nicholas can all approve or reject pending reports with the same manager permissions."
    : "This queue is managed by the office managers only.";

  setFormDisabled(dom.approvalForm, !canReviewReports() || !hasPendingReports);
  dom.approvalSummary.disabled = true;
  dom.approveReportButton.disabled = !canReviewReports() || !hasPendingReports;
  dom.rejectReportButton.disabled = !canReviewReports() || !hasPendingReports;

  const reports = getReviewedReports();
  dom.approvalsList.innerHTML = reports.length
    ? reports.map((report) => buildReportCard(report)).join("")
    : `<div class="list-card"><p class="list-copy">No reports are waiting for review.</p></div>`;
}

function renderWorkshop() {
  const job = findJob(state.selectedJobId);
  renderJobContext(dom.workshopJobSummary, job);
  fillJobSelect(dom.workshopJobSelect, state.selectedJobId, state.data.jobs);

  setFormDisabled(dom.workshopForm, !canSubmitWorkshopReports());
  dom.workshopResetButton.disabled = false;
  dom.openWorkshopSiteLinkButton.disabled = !job;
  dom.addPartButton.disabled = !canSubmitWorkshopReports();

  const workshopReports = getVisibleWorkshopReports().sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  dom.workshopList.innerHTML = workshopReports.length
    ? workshopReports
        .map((report) => {
          const reportJob = findJob(report.jobId);
          return `
            <div class="list-card">
              <div class="card-title-row">
                <h3>${escapeHtml(report.id)}</h3>
                <span class="pill">${escapeHtml(formatCurrency(report.costs || 0))}</span>
              </div>
              <p class="list-copy">${escapeHtml(reportJob?.clientName || report.jobId)} | ${escapeHtml(formatDateTime(report.createdAt))}</p>
              <p class="job-description">${escapeHtml(report.repairDetails)}</p>
              <p class="list-copy">Logged by ${escapeHtml(getUserName(report.engineerId))}</p>
            </div>
          `;
        })
        .join("")
    : `<div class="list-card"><p class="list-copy">No workshop reports have been captured yet.</p></div>`;
}

function buildSummaryText(report) {
  const job = findJob(report.jobId);
  return [
    `Client: ${job?.clientName || "Unknown"}`,
    `Job: ${job?.id || report.jobId}`,
    `Service: ${job?.serviceType || "Unknown"}`,
    `Location: ${job?.manualLocation || "Unknown"}`,
    `Technician: ${getUserName(report.engineerId)}`,
    `Review status: ${getReviewStatus(report)}`,
    `Diagnosis: ${report.diagnosis}`,
    `Work done: ${report.workDone}`,
    `Measurements: ${report.measurements.map((item) => `${item.label} ${item.value} ${item.unit}`).join(", ") || "None recorded"}`,
    `Materials: ${report.materials.map((item) => `${item.name} ${item.quantity} ${item.unit}`).join(", ") || "None recorded"}`,
    `Before work photos: ${report.beforeImages.length}`,
    `After work photos: ${report.afterImages.length}`,
    `Review notes: ${report.reviewNotes || "None"}`,
  ].join("\n");
}

function buildImageGallery(images) {
  if (!images.length) {
    return "<p>No images attached.</p>";
  }
  return `<div class="report-gallery">${images
    .map(
      (image) => `
        <figure>
          <img src="${image.dataUrl}" alt="${escapeHtml(image.name)}">
          <figcaption>${escapeHtml(image.name)}</figcaption>
        </figure>
      `
    )
    .join("")}</div>`;
}

function buildReportMarkup(report) {
  const job = findJob(report.jobId);
  const workshop = getLatestWorkshopReportForJob(report.jobId);
  return `
    <div>
      <h3>${escapeHtml(job?.clientName || report.jobId)} - Service Report</h3>
      <div class="report-grid">
        <div>
          <p><strong>Job ID:</strong> ${escapeHtml(job?.id || report.jobId)}</p>
          <p><strong>Service:</strong> ${escapeHtml(job?.serviceType || "Unknown")}</p>
          <p><strong>Location:</strong> ${escapeHtml(job?.manualLocation || "Unknown")}</p>
          <p><strong>Technician:</strong> ${escapeHtml(getUserName(report.engineerId))}</p>
        </div>
        <div>
          <p><strong>Captured:</strong> ${escapeHtml(formatDateTime(report.capturedAt))}</p>
          <p><strong>GPS:</strong> ${escapeHtml(formatNumber(report.gps.latitude, 6))}, ${escapeHtml(formatNumber(report.gps.longitude, 6))}</p>
          <p><strong>Job status:</strong> ${escapeHtml(job?.status || "Completed")}</p>
          <p><strong>Review status:</strong> ${escapeHtml(getReviewStatus(report))}</p>
        </div>
      </div>
      <section class="report-section">
        <h4>Engineering Diagnosis</h4>
        <p>${escapeHtml(report.diagnosis)}</p>
      </section>
      <section class="report-section">
        <h4>Work Done</h4>
        <p>${escapeHtml(report.workDone)}</p>
        <p><strong>Notes:</strong> ${escapeHtml(report.notes || "No extra notes recorded.")}</p>
      </section>
      <section class="report-section">
        <h4>Materials Used</h4>
        <table class="report-table">
          <thead><tr><th>Material</th><th>Quantity</th><th>Unit</th></tr></thead>
          <tbody>
            ${
              report.materials.length
                ? report.materials
                    .map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.quantity)}</td><td>${escapeHtml(item.unit)}</td></tr>`)
                    .join("")
                : `<tr><td colspan="3">No materials recorded.</td></tr>`
            }
          </tbody>
        </table>
      </section>
      <section class="report-section">
        <h4>Measurements</h4>
        <table class="report-table">
          <thead><tr><th>Measurement</th><th>Value</th><th>Unit</th></tr></thead>
          <tbody>
            ${
              report.measurements.length
                ? report.measurements
                    .map((item) => `<tr><td>${escapeHtml(item.label)}</td><td>${escapeHtml(item.value)}</td><td>${escapeHtml(item.unit)}</td></tr>`)
                    .join("")
                : `<tr><td colspan="3">No measurements recorded.</td></tr>`
            }
          </tbody>
        </table>
      </section>
      <section class="report-section">
        <h4>Before Work Photos</h4>
        ${buildImageGallery(report.beforeImages)}
      </section>
      <section class="report-section">
        <h4>After Work Photos</h4>
        ${buildImageGallery(report.afterImages)}
      </section>
      <section class="report-section">
        <h4>Manager Review</h4>
        <p><strong>Status:</strong> ${escapeHtml(getReviewStatus(report))}</p>
        <p><strong>Reviewed by:</strong> ${escapeHtml(report.reviewedById ? getUserName(report.reviewedById) : "Pending")}</p>
        <p><strong>Notes:</strong> ${escapeHtml(report.reviewNotes || "No review notes")}</p>
      </section>
      ${
        workshop
          ? `
            <section class="report-section">
              <h4>Latest Workshop Report</h4>
              <p>${escapeHtml(workshop.repairDetails)}</p>
              <p><strong>Logged by:</strong> ${escapeHtml(getUserName(workshop.engineerId))}</p>
              <p><strong>Workshop cost:</strong> ${escapeHtml(formatCurrency(workshop.costs || 0))}</p>
            </section>
          `
          : ""
      }
    </div>
  `;
}

function renderReportCenterReview(report) {
  const isPending = getReviewStatus(report) === "Pending";
  const canReview = canReviewReports() && Boolean(report);
  dom.reportCenterReviewBlock.hidden = !canReview;
  if (!canReview) {
    return;
  }

  dom.reportCenterReviewStatus.textContent = getReviewStatus(report);
  dom.reportCenterReviewStatus.className = `badge status-${formatStatusClass(getReviewStatus(report))}`;
  dom.reportCenterReviewHelper.textContent = isPending
    ? "Managers can approve or reject the selected report directly from this preview panel."
    : "This report has already been reviewed and will stay available for reference, but it is no longer in the pending approval queue.";
  dom.reportCenterReviewNotes.value = report.reviewNotes || "";
  dom.reportCenterApproveButton.disabled = !isPending;
  dom.reportCenterRejectButton.disabled = !isPending;
}

function getReportSearchFilters() {
  return {
    date: dom.reportSearchDate.value,
    site: normalizeSite(dom.reportSearchSite.value),
    work: normalizeSite(dom.reportSearchWork.value),
  };
}

function getSearchableReports() {
  return [...state.data.fieldReports].sort((left, right) => new Date(right.capturedAt) - new Date(left.capturedAt));
}

function buildSearchResultCard(report) {
  const job = findJob(report.jobId);
  return `
    <div class="list-card ${report.id === state.selectedReportId ? "selected" : ""}">
      <div class="card-title-row">
        <h3>${escapeHtml(report.id)}</h3>
        ${buildStatusBadge(getReviewStatus(report))}
      </div>
      <p class="list-copy">${escapeHtml(formatDateTime(report.capturedAt))} | ${escapeHtml(job?.manualLocation || "Unknown site")}</p>
      <p class="job-description">${escapeHtml(report.workDone)}</p>
      <p class="list-copy">Technician: ${escapeHtml(getUserName(report.engineerId))}</p>
      <div class="list-actions">
        <button type="button" class="secondary" data-action="preview-report" data-report-id="${escapeHtml(report.id)}">Preview</button>
        <button type="button" class="ghost" data-action="open-report-job" data-job-id="${escapeHtml(report.jobId)}">Open Job</button>
      </div>
    </div>
  `;
}

function renderReportSearchResults() {
  const filters = getReportSearchFilters();
  const hasFilters = Boolean(filters.date || filters.site || filters.work);
  const results = getSearchableReports()
    .filter((report) => {
      const job = findJob(report.jobId);
      const siteText = normalizeSite(`${job?.clientName || ""} ${job?.manualLocation || ""} ${job?.repeatSiteName || ""}`);
      const workText = normalizeSite(`${report.workDone} ${report.diagnosis} ${job?.description || ""}`);
      const matchesDate = !filters.date || String(report.capturedAt).slice(0, 10) === filters.date;
      const matchesSite = !filters.site || siteText.includes(filters.site);
      const matchesWork = !filters.work || workText.includes(filters.work);
      return matchesDate && matchesSite && matchesWork;
    })
    .slice(0, hasFilters ? 20 : 8);

  dom.reportSearchResults.innerHTML = results.length
    ? results.map((report) => buildSearchResultCard(report)).join("")
    : `<div class="list-card"><p class="list-copy">${hasFilters ? "No reports matched the selected date, site, or work terms." : "Use the search fields to find reports by date, site, or job done."}</p></div>`;
}

function findForumMessage(messageId) {
  return (state.data.forumMessages || []).find((message) => message.id === messageId) || null;
}

function setForumReply(messageId = null) {
  state.forumReplyToId = messageId;
}

function toggleForumReaction(messageId, reactionLabel) {
  const message = findForumMessage(messageId);
  if (!message) {
    return;
  }

  message.reactions ||= [];
  const reaction = message.reactions.find((item) => item.emoji === reactionLabel);
  if (!reaction) {
    message.reactions.push({ emoji: reactionLabel, userIds: [getCurrentUser().id] });
  } else if (reaction.userIds.includes(getCurrentUser().id)) {
    reaction.userIds = reaction.userIds.filter((userId) => userId !== getCurrentUser().id);
    if (!reaction.userIds.length) {
      message.reactions = message.reactions.filter((item) => item !== reaction);
    }
  } else {
    reaction.userIds.push(getCurrentUser().id);
  }

  saveData();
  renderForum();
}

function buildForumMessageCard(message) {
  const author = state.data.users.find((user) => user.id === message.authorId);
  const replyTarget = message.replyToId ? findForumMessage(message.replyToId) : null;
  const reactionMap = new Map((message.reactions || []).map((reaction) => [reaction.emoji, reaction.userIds]));
  const quickReactions = ["Like", "Done", "Need Help"];
  return `
    <article class="forum-message ${message.authorId === getCurrentUser().id ? "mine" : ""}">
      <div class="card-title-row">
        <div>
          <h3>${escapeHtml(author?.name || "Unknown user")}</h3>
          <p class="list-copy">${escapeHtml(getForumChannelMeta(message.channel).label)} | ${escapeHtml(formatDateTime(message.createdAt))}</p>
        </div>
        <span class="status-chip ${getPresenceState(author || {}) === "Online" ? "online" : "neutral"}">${escapeHtml(getPresenceState(author || {}))}</span>
      </div>
      ${message.siteTag ? `<p class="forum-tag">${escapeHtml(message.siteTag)}</p>` : ""}
      ${
        replyTarget
          ? `<div class="forum-reply-preview"><strong>Replying to ${escapeHtml(getUserName(replyTarget.authorId))}</strong><span>${escapeHtml(replyTarget.message)}</span></div>`
          : ""
      }
      <p class="job-description">${escapeHtml(message.message)}</p>
      <div class="forum-actions">
        <button type="button" class="ghost small" data-action="forum-reply" data-message-id="${escapeHtml(message.id)}">Reply</button>
        ${quickReactions
          .map((label) => {
            const count = reactionMap.get(label)?.length || 0;
            const active = reactionMap.get(label)?.includes(getCurrentUser().id) ? "active" : "";
            return `<button type="button" class="ghost small forum-reaction ${active}" data-action="forum-react" data-message-id="${escapeHtml(message.id)}" data-reaction="${escapeHtml(label)}">${escapeHtml(label)} ${count || ""}</button>`;
          })
          .join("")}
      </div>
    </article>
  `;
}

function renderForum() {
  const messages = [...(state.data.forumMessages || [])].sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt));
  const currentChannel = dom.forumChannel.value || FORUM_CHANNELS[0].id;
  dom.forumChannel.innerHTML = FORUM_CHANNELS.map((channel) => `<option value="${escapeHtml(channel.id)}">${escapeHtml(channel.label)}</option>`).join("");
  dom.forumChannel.value = FORUM_CHANNELS.some((channel) => channel.id === currentChannel) ? currentChannel : FORUM_CHANNELS[0].id;

  const filteredMessages = messages.filter((message) => message.channel === dom.forumChannel.value);
  const replyTarget = state.forumReplyToId ? findForumMessage(state.forumReplyToId) : null;

  dom.forumRoleHint.textContent = isOfficeRole()
    ? "Managers, technicians, and workshop users share the same live discussion space."
    : "Use this space for site updates, replies, workshop follow-up, and lighter team conversation.";
  dom.forumReplyBanner.hidden = !replyTarget;
  dom.forumReplyBanner.innerHTML = replyTarget
    ? `<strong>Replying to ${escapeHtml(getUserName(replyTarget.authorId))}</strong><p>${escapeHtml(replyTarget.message)}</p>`
    : "";
  dom.cancelForumReplyButton.hidden = !replyTarget;

  dom.forumFeed.innerHTML = filteredMessages.length
    ? filteredMessages.map((message) => buildForumMessageCard(message)).join("")
    : `<div class="list-card"><p class="list-copy">No posts are in this channel yet. Start the conversation.</p></div>`;

  dom.forumOnlineUsers.innerHTML = [...state.data.users]
    .sort((left, right) => Number(getPresenceState(right) === "Online") - Number(getPresenceState(left) === "Online") || left.name.localeCompare(right.name))
    .map((user) => {
      const presence = getPresenceState(user);
      return `
        <div class="list-card">
          <div class="card-title-row">
            <h3>${escapeHtml(user.name)}</h3>
            <span class="status-chip ${presence === "Online" ? "online" : "neutral"}">${escapeHtml(presence)}</span>
          </div>
          <p class="list-copy">${escapeHtml(user.email)} | ${escapeHtml(user.presenceNote || user.base || "")}</p>
        </div>
      `;
    })
    .join("");

  dom.forumChannels.innerHTML = FORUM_CHANNELS.map((channel) => {
    const channelCount = messages.filter((message) => message.channel === channel.id).length;
    return `
      <button type="button" class="nav-button ${channel.id === dom.forumChannel.value ? "active" : ""}" data-action="forum-channel" data-channel-id="${escapeHtml(channel.id)}">
        ${escapeHtml(channel.label)} (${channelCount})
      </button>
    `;
  }).join("");
}

function renderReportCenter() {
  renderReportSearchResults();
  const report = findReport(state.selectedReportId);
  if (!report) {
    dom.generatedReport.className = "report-preview empty-state";
    dom.generatedReport.innerHTML = "Select a field report to generate a printable job summary.";
    dom.reportCenterReviewBlock.hidden = true;
    dom.downloadReportButton.disabled = true;
    return;
  }

  dom.generatedReport.className = "report-preview";
  dom.generatedReport.innerHTML = buildReportMarkup(report);
  dom.downloadReportButton.disabled = !(isOfficeRole() && getReviewStatus(report) === "Approved");
  renderReportCenterReview(report);
}

function renderAll() {
  applyTheme();
  renderShell();
  if (!state.isAuthenticated) {
    renderHome();
    return;
  }

  ensureSelections();
  renderTopbar();
  renderNavigation();
  renderGlobalSearchResults();
  renderDashboard();
  renderJobs();
  renderReports();
  renderApprovals();
  renderWorkshop();
  renderForum();
  renderReportCenter();
}

function handleLogin(event) {
  event.preventDefault();
  const userId = dom.loginAccount.value || state.activeUserId;
  if (!userId) {
    dom.loginError.textContent = "Choose an account to continue.";
    return;
  }

  state.activeUserId = userId;
  state.isAuthenticated = true;
  state.activeView = "dashboard";
  state.navigationHistory = [];
  const user = getCurrentUser();
  if (user) {
    user.online = true;
  }
  localStorage.setItem(ACTIVE_USER_KEY, state.activeUserId);
  localStorage.setItem(AUTH_SESSION_KEY, "true");
  saveData();
  dom.loginError.textContent = "";
  dom.loginPassword.value = "";
  ensureSelections();
  resetAllForms();
  renderAll();
  notify(`Signed in as ${getCurrentUser().name}.`, "success");
}

function handleLogout() {
  const user = getCurrentUser();
  if (user) {
    user.online = false;
  }
  state.isAuthenticated = false;
  state.navigationHistory = [];
  localStorage.removeItem(AUTH_SESSION_KEY);
  dom.loginPassword.value = "";
  dom.loginError.textContent = "";
  saveData();
  renderAll();
}

function handleJobSubmit(event) {
  event.preventDefault();
  if (!canCreateJobs()) {
    notify("Only managers can create jobs.", "warn");
    return;
  }

  const existingJob = findJob(dom.jobId.value.trim());
  const payload = {
    id: dom.jobId.value.trim() || `JOB-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}${String(Math.floor(Math.random() * 90) + 10)}`,
    clientName: dom.jobClientName.value.trim(),
    contactPerson: dom.jobContactPerson.value.trim(),
    contactPhone: dom.jobContactPhone.value.trim(),
    serviceType: dom.jobServiceType.value,
    manualLocation: dom.jobManualLocation.value.trim(),
    latitude: Number(dom.jobLatitude.value || 0),
    longitude: Number(dom.jobLongitude.value || 0),
    description: dom.jobDescription.value.trim(),
    repeatSiteName: dom.jobRepeatSite.value.trim(),
    assignedEngineerId: dom.jobAssignedEngineer.value,
    priority: dom.jobPriority.value,
    status: dom.jobStatus.value,
    createdAt: existingJob?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!payload.clientName || !payload.contactPerson || !payload.contactPhone || !payload.manualLocation || !payload.description) {
    notify("Fill in the required job fields before saving.", "warn");
    return;
  }

  if (existingJob) {
    Object.assign(existingJob, payload);
    addActivity(`Updated ${existingJob.id} for ${existingJob.clientName}.`);
    notify("Job updated successfully.", "success");
  } else {
    state.data.jobs.unshift(payload);
    addActivity(`Created ${payload.id} and assigned ${getUserName(payload.assignedEngineerId)}${payload.repeatSiteName ? ` for repeat work at ${payload.repeatSiteName}` : ""}.`);
    notify("New job created successfully.", "success");
  }

  state.selectedJobId = payload.id;
  enqueueSync("job", payload.id);
  saveData();
  populateJobForm(null);
  renderAll();
}

function handleStartJob(jobId) {
  const job = findJob(jobId);
  if (!job || job.assignedEngineerId !== getCurrentUser().id) {
    notify("You can only start jobs assigned to you.", "warn");
    return;
  }
  if (job.status !== "Pending") {
    notify("This job is not pending anymore.", "warn");
    return;
  }

  job.status = "In Progress";
  job.updatedAt = new Date().toISOString();
  state.selectedJobId = job.id;
  addActivity(`Started job ${job.id} at ${job.clientName}.`);
  enqueueSync("job-status", job.id);
  saveData();
  renderAll();
  notify("Job moved from pending to in progress.", "success");
}

function handleReportSubmit(event) {
  event.preventDefault();
  const job = findJob(dom.reportJobSelect.value);
  if (!canSubmitFieldReports() || !job || job.assignedEngineerId !== getCurrentUser().id) {
    notify("Only the assigned technician can submit this field report.", "warn");
    return;
  }
  if (!["Pending", "In Progress"].includes(job.status)) {
    notify("Only active jobs can receive a new field report.", "warn");
    return;
  }

  const report = {
    id: `RPT-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}${String(Math.floor(Math.random() * 90) + 10)}`,
    jobId: job.id,
    engineerId: getCurrentUser().id,
    capturedAt: new Date().toISOString(),
    gps: {
      latitude: Number(dom.reportLatitude.value || job.latitude || DEMO_REFERENCE.latitude),
      longitude: Number(dom.reportLongitude.value || job.longitude || DEMO_REFERENCE.longitude),
    },
    diagnosis: dom.reportDiagnosis.value.trim(),
    workDone: dom.reportWorkDone.value.trim(),
    materials: readEntryList(dom.materialsList),
    measurements: readEntryList(dom.measurementsList),
    notes: dom.reportNotes.value.trim(),
    beforeImages: clone(state.uploads.reportBefore),
    afterImages: clone(state.uploads.reportAfter),
    reviewStatus: "Pending",
    reviewNotes: "",
    reviewedById: null,
    reviewedAt: null,
    synced: false,
  };

  if (!report.diagnosis || !report.workDone) {
    notify("Diagnosis and work done are required for a field report.", "warn");
    return;
  }
  if (!report.beforeImages.length || !report.afterImages.length) {
    notify("Add at least one before-work photo and one after-work photo before submitting.", "warn");
    return;
  }

  state.data.fieldReports.unshift(report);
  job.status = "Completed";
  job.updatedAt = new Date().toISOString();
  const nextJob = getNextReportableJobForCurrentUser(job.id);
  state.selectedJobId = nextJob?.id || job.id;
  state.selectedReportId = report.id;
  addActivity(`Submitted report ${report.id} for ${job.clientName}.`);
  enqueueSync("field-report", report.id);
  saveData();
  resetReportForm();
  renderAll();
  notify(nextJob ? `Report submitted. ${nextJob.clientName} is now the next job ready for your update.` : "Report submitted. Job moved to completed and is now waiting for review.", "success");
}

function handleReportReview(status, options = {}) {
  if (!canReviewReports()) {
    notify("Only managers can review reports.", "warn");
    return;
  }

  const reportId = options.reportId || dom.approvalReportSelect.value;
  const notes = options.reviewNotes ?? dom.reviewNotes.value.trim();
  const report = findReport(reportId);
  if (!report) {
    notify("Select a report to review.", "warn");
    return;
  }
  if (getReviewStatus(report) !== "Pending") {
    notify("This report has already been reviewed and will not return to the pending approval queue.", "warn");
    return;
  }

  if (status === "Rejected" && !notes.trim()) {
    notify("Add a rejection reason before rejecting the report.", "warn");
    return;
  }

  report.reviewStatus = status;
  report.reviewNotes = notes.trim();
  report.reviewedById = getCurrentUser().id;
  report.reviewedAt = new Date().toISOString();

  const job = findJob(report.jobId);
  if (job) {
    job.status = status === "Approved" ? "Approved" : "In Progress";
    job.updatedAt = report.reviewedAt;
  }

  const nextReport = getNextReviewReport(report.id);
  state.selectedReportId = nextReport?.id || report.id;
  state.selectedJobId = nextReport?.jobId || job?.id || state.selectedJobId;
  addActivity(`${status === "Approved" ? "Approved" : "Rejected"} report ${report.id} for ${job?.clientName || report.jobId}.`);
  enqueueSync("report-review", report.id);
  saveData();
  renderAll();
  notify(`Report ${status.toLowerCase()} successfully.`, "success");
}

function handleForumSubmit(event) {
  event.preventDefault();
  const message = dom.forumMessage.value.trim();
  if (!message) {
    notify("Write a message before posting to the forum.", "warn");
    return;
  }

  state.data.forumMessages ||= [];
  state.data.forumMessages.push({
    id: uid("MSG"),
    authorId: getCurrentUser().id,
    channel: dom.forumChannel.value || FORUM_CHANNELS[0].id,
    siteTag: dom.forumSiteTag.value.trim(),
    message,
    createdAt: new Date().toISOString(),
    replyToId: state.forumReplyToId,
    reactions: [],
  });
  addActivity(`Posted an update in the ${getForumChannelMeta(dom.forumChannel.value || FORUM_CHANNELS[0].id).label} forum channel.`);
  saveData();
  dom.forumMessage.value = "";
  dom.forumSiteTag.value = "";
  state.forumReplyToId = null;
  renderForum();
  notify("Forum message posted.", "success");
}

function handleWorkshopSubmit(event) {
  event.preventDefault();
  const job = findJob(dom.workshopJobSelect.value);
  if (!canSubmitWorkshopReports() || !job) {
    notify("Only Victor can submit workshop reports in this prototype.", "warn");
    return;
  }

  const report = {
    id: `WRK-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}${String(Math.floor(Math.random() * 90) + 10)}`,
    jobId: job.id,
    engineerId: getCurrentUser().id,
    repairDetails: dom.workshopRepairDetails.value.trim(),
    partsReplaced: readEntryList(dom.workshopPartsList),
    costs: Number(dom.workshopCosts.value || 0),
    notes: dom.workshopNotes.value.trim(),
    beforeImages: clone(state.uploads.workshopBefore),
    afterImages: clone(state.uploads.workshopAfter),
    createdAt: new Date().toISOString(),
    synced: false,
  };

  if (!report.repairDetails) {
    notify("Enter repair details before submitting the workshop report.", "warn");
    return;
  }

  state.data.workshopReports.unshift(report);
  addActivity(`Victor logged workshop report ${report.id} for ${job.clientName}.`);
  enqueueSync("workshop-report", report.id);
  saveData();
  resetWorkshopForm();
  renderAll();
  notify("Workshop report saved successfully.", "success");
}

function printSelectedReport() {
  const report = findReport(state.selectedReportId);
  if (!report) {
    notify("Select a report before printing or saving a PDF.", "warn");
    return;
  }

  const printWindow = window.open("", "_blank", "width=1200,height=900");
  if (!printWindow) {
    notify("Pop-up blocked. Allow pop-ups to print the report.", "error");
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>${escapeHtml(report.id)} - WES Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #182430; }
          h3, h4 { margin-bottom: 8px; }
          p { line-height: 1.6; }
          .report-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
          .report-section { margin-top: 18px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid rgba(24,36,48,0.2); padding: 8px 10px; text-align: left; }
          img { max-width: 240px; border-radius: 12px; }
        </style>
      </head>
      <body>${buildReportMarkup(report)}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function downloadApprovedReport(reportId = state.selectedReportId) {
  const report = findReport(reportId);
  if (!report) {
    notify("Select a report before downloading.", "warn");
    return;
  }
  if (!isOfficeRole() || getReviewStatus(report) !== "Approved") {
    notify("Only approved reports can be downloaded from the admin workspace.", "warn");
    return;
  }

  const job = findJob(report.jobId);
  const documentMarkup = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(report.id)} - WES Approved Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 28px; color: #182430; }
    h3, h4 { margin-bottom: 8px; }
    p { line-height: 1.6; }
    .report-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    .report-section { margin-top: 18px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid rgba(24,36,48,0.2); padding: 8px 10px; text-align: left; }
    img { max-width: 240px; border-radius: 12px; }
  </style>
</head>
<body>${buildReportMarkup(report)}</body>
</html>`;
  const blob = new Blob([documentMarkup], { type: "text/html" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = `${job?.id || report.jobId}-${report.id}-approved-report.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  notify("Approved report download started.", "success");
}

function copySummary() {
  const report = findReport(state.selectedReportId);
  if (!report) {
    notify("Select a report before copying the summary.", "warn");
    return;
  }

  navigator.clipboard
    .writeText(buildSummaryText(report))
    .then(() => notify("Work summary copied to clipboard.", "success"))
    .catch(() => notify("Clipboard access failed in this browser.", "error"));
}

function openShareLink(type) {
  const report = findReport(state.selectedReportId);
  if (!report) {
    notify("Select a report before preparing a share message.", "warn");
    return;
  }

  const summary = encodeURIComponent(buildSummaryText(report));
  const job = findJob(report.jobId);
  if (type === "whatsapp") {
    window.open(`https://wa.me/?text=${summary}`, "_blank", "noopener");
    return;
  }

  const subject = encodeURIComponent(`WES Service Report - ${job?.clientName || report.jobId}`);
  window.location.href = `mailto:?subject=${subject}&body=${summary}`;
}

function openSiteLink(jobId) {
  const job = findJob(jobId);
  if (!job) {
    notify("No site details were found for that job.", "warn");
    return;
  }
  window.open(getNavigationUrl(job), "_blank", "noopener");
}

function updateUserStatus(userId, teamStatus) {
  if (!canManageEngineers()) {
    notify("Only managers can manage technician availability.", "warn");
    return;
  }
  const user = state.data.users.find((candidate) => candidate.id === userId && candidate.role === "engineer");
  if (!user) {
    return;
  }
  user.teamStatus = teamStatus;
  addActivity(`Set ${user.name}'s availability to ${teamStatus}.`);
  enqueueSync("user-status", user.id);
  saveData();
  renderAll();
}

function handleJobListAction(button) {
  const action = button.dataset.action;
  const jobId = button.dataset.jobId;
  const job = findJob(jobId);
  if (!job) {
    return;
  }

  if (action === "select-job") {
    state.selectedJobId = job.id;
    renderAll();
    return;
  }
  if (action === "edit-job") {
    state.selectedJobId = job.id;
    populateJobForm(job);
    setActiveView("jobs");
    renderAll();
    return;
  }
  if (action === "start-job") {
    handleStartJob(job.id);
    return;
  }
  if (action === "open-report-form") {
    state.selectedJobId = job.id;
    setActiveView("reports");
    resetReportForm();
    renderAll();
    return;
  }
  if (action === "open-workshop-form") {
    state.selectedJobId = job.id;
    setActiveView("workshop");
    resetWorkshopForm();
    renderAll();
    return;
  }
  if (action === "preview-job-report") {
    const latestReport = getLatestReportForJob(job.id);
    if (!latestReport) {
      notify("This job does not have a report yet.", "warn");
      return;
    }
    state.selectedJobId = job.id;
    state.selectedReportId = latestReport.id;
    setActiveView("reports-center");
    renderAll();
    return;
  }
  if (action === "review-job-report") {
    const latestReport = getLatestReportForJob(job.id);
    if (!latestReport) {
      notify("This job does not have a report ready for review yet.", "warn");
      return;
    }
    state.selectedJobId = job.id;
    state.selectedReportId = latestReport.id;
    setActiveView("approvals");
    renderAll();
    return;
  }
  if (action === "open-map") {
    openSiteLink(job.id);
  }
}

function handleReportAction(button) {
  const action = button.dataset.action;
  if (action === "preview-report") {
    state.selectedReportId = button.dataset.reportId;
    state.selectedJobId = findReport(button.dataset.reportId)?.jobId || state.selectedJobId;
    setActiveView("reports-center");
    renderAll();
    return;
  }
  if (action === "review-report") {
    state.selectedReportId = button.dataset.reportId;
    state.selectedJobId = findReport(button.dataset.reportId)?.jobId || state.selectedJobId;
    setActiveView(canReviewReports() ? "approvals" : "reports");
    renderAll();
    return;
  }
  if (action === "download-report") {
    downloadApprovedReport(button.dataset.reportId);
    return;
  }
  if (action === "open-report-job") {
    state.selectedJobId = button.dataset.jobId;
    setActiveView("jobs");
    if (canCreateJobs()) {
      populateJobForm(findJob(button.dataset.jobId));
    }
    renderAll();
  }
}

function routeActionButton(button) {
  const reportActions = new Set(["preview-report", "review-report", "open-report-job", "download-report"]);
  if (reportActions.has(button.dataset.action)) {
    handleReportAction(button);
    return;
  }
  handleJobListAction(button);
}

function bindEvents() {
  dom.loginForm.addEventListener("submit", handleLogin);
  dom.loginAccount.addEventListener("change", () => {
    state.activeUserId = dom.loginAccount.value;
    localStorage.setItem(ACTIVE_USER_KEY, state.activeUserId);
    renderHome();
  });
  dom.loginAccountButtons?.addEventListener("click", (event) => {
    const button = event.target.closest('button[data-action="pick-login-account"]');
    if (!button) {
      return;
    }
    state.activeUserId = button.dataset.userId;
    dom.loginAccount.value = state.activeUserId;
    localStorage.setItem(ACTIVE_USER_KEY, state.activeUserId);
    dom.loginError.textContent = "";
    renderHome();
    dom.loginPassword.focus();
  });
  dom.logoutButton.addEventListener("click", handleLogout);
  dom.themeButtons.forEach((button) => {
    button.addEventListener("click", toggleTheme);
  });

  dom.navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveView(button.dataset.view);
    });
  });
  [dom.globalSearchTechnician, dom.globalSearchSite, dom.globalSearchClient, dom.globalSearchWorkType, dom.globalSearchDate].forEach((element) => {
    element.addEventListener("input", renderGlobalSearchResults);
    element.addEventListener("change", renderGlobalSearchResults);
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        renderGlobalSearchResults();
      }
    });
  });
  dom.runGlobalSearchButton.addEventListener("click", renderGlobalSearchResults);
  dom.resetGlobalSearchButton.addEventListener("click", () => {
    dom.globalSearchTechnician.value = "";
    dom.globalSearchSite.value = "";
    dom.globalSearchClient.value = "";
    dom.globalSearchWorkType.value = "";
    dom.globalSearchDate.value = "";
    renderGlobalSearchResults();
  });
  dom.globalSearchResults.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (button) {
      routeActionButton(button);
    }
  });
  dom.backButton.addEventListener("click", handleBackNavigation);

  dom.syncButton.addEventListener("click", syncQueue);
  dom.resetDemoButton.addEventListener("click", () => {
    state.data = createSeedData();
    state.selectedJobId = null;
    state.selectedReportId = null;
    state.navigationHistory = [];
    state.uploads = { reportBefore: [], reportAfter: [], workshopBefore: [], workshopAfter: [] };
    saveData();
    ensureSelections();
    resetAllForms();
    renderAll();
    notify("Demo data reset to the original seeded state.", "success");
  });

  [dom.dashboardServiceFilter, dom.dashboardStatusFilter, dom.dashboardLocationFilter, dom.dashboardRadiusFilter, dom.dashboardLat, dom.dashboardLng].forEach((element) => {
    element.addEventListener("input", renderDashboard);
    element.addEventListener("change", renderDashboard);
  });

  dom.captureFilterLocationButton.addEventListener("click", () => {
    captureCoordinates((coordinates) => {
      dom.dashboardLat.value = coordinates.latitude;
      dom.dashboardLng.value = coordinates.longitude;
      renderDashboard();
    });
  });

  dom.jobForm.addEventListener("submit", handleJobSubmit);
  dom.jobFormReset.addEventListener("click", () => {
    populateJobForm(null);
    renderAll();
  });
  dom.jobGpsButton.addEventListener("click", () => {
    captureCoordinates((coordinates) => {
      dom.jobLatitude.value = coordinates.latitude;
      dom.jobLongitude.value = coordinates.longitude;
    });
  });
  dom.jobRepeatSite.addEventListener("change", () => {
    applyRepeatSiteSelection(dom.jobRepeatSite.value, true);
  });

  dom.jobsList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (button) {
      routeActionButton(button);
      return;
    }
    const card = event.target.closest(".job-card");
    if (card?.dataset.jobId) {
      state.selectedJobId = card.dataset.jobId;
      if (canCreateJobs()) {
        populateJobForm(findJob(card.dataset.jobId));
      }
      renderAll();
    }
  });

  dom.dashboardJobs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (button) {
      routeActionButton(button);
      return;
    }
    const card = event.target.closest(".job-card");
    if (card?.dataset.jobId) {
      state.selectedJobId = card.dataset.jobId;
      setActiveView("jobs");
      if (canCreateJobs()) {
        populateJobForm(findJob(card.dataset.jobId));
      }
      renderAll();
    }
  });
  dom.jobRepeatHistory.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (button) {
      handleReportAction(button);
    }
  });

  dom.teamManagement.addEventListener("change", (event) => {
    const select = event.target.closest('select[data-action="team-status"]');
    if (!select) {
      return;
    }
    updateUserStatus(select.dataset.userId, select.value);
  });
  [dom.engineerPendingJobs, dom.engineerInProgressJobs, dom.engineerCompletedJobs].forEach((container) => {
    container.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (button) {
        routeActionButton(button);
        return;
      }
      const card = event.target.closest(".job-card");
      if (card?.dataset.jobId) {
        state.selectedJobId = card.dataset.jobId;
        renderAll();
      }
    });
  });
  dom.technicianJobHistory.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (button) {
      handleReportAction(button);
    }
  });

  dom.reportJobSelect.addEventListener("change", () => {
    state.selectedJobId = dom.reportJobSelect.value;
    renderAll();
  });
  dom.reportGpsButton.addEventListener("click", () => {
    captureCoordinates((coordinates) => {
      dom.reportLatitude.value = coordinates.latitude;
      dom.reportLongitude.value = coordinates.longitude;
    });
  });
  dom.openSiteLinkButton.addEventListener("click", () => openSiteLink(dom.reportJobSelect.value));
  dom.addMaterialButton.addEventListener("click", () => dom.materialsList.appendChild(createMaterialRow()));
  dom.addMeasurementButton.addEventListener("click", () => dom.measurementsList.appendChild(createMeasurementRow()));
  dom.reportForm.addEventListener("submit", handleReportSubmit);
  dom.reportResetButton.addEventListener("click", resetReportForm);
  dom.reportBeforeInput.addEventListener("change", () => appendFilesToBucket(dom.reportBeforeInput.files, "reportBefore", dom.reportBeforePreview, dom.reportBeforeInput));
  dom.reportAfterInput.addEventListener("change", () => appendFilesToBucket(dom.reportAfterInput.files, "reportAfter", dom.reportAfterPreview, dom.reportAfterInput));
  dom.reportsList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (button) {
      handleReportAction(button);
    }
  });
  dom.repeatSiteHistory.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (button) {
      handleReportAction(button);
    }
  });
  [dom.reportSearchDate, dom.reportSearchSite, dom.reportSearchWork].forEach((element) => {
    element.addEventListener("input", renderReportSearchResults);
    element.addEventListener("change", renderReportSearchResults);
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        renderReportSearchResults();
      }
    });
  });
  dom.runReportSearchButton.addEventListener("click", renderReportSearchResults);
  dom.resetReportSearchButton.addEventListener("click", () => {
    dom.reportSearchDate.value = "";
    dom.reportSearchSite.value = "";
    dom.reportSearchWork.value = "";
    renderReportSearchResults();
  });
  dom.reportSearchResults.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (button) {
      handleReportAction(button);
    }
  });

  dom.approvalReportSelect.addEventListener("change", () => {
    state.selectedReportId = dom.approvalReportSelect.value;
    renderAll();
  });
  dom.approvalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleReportReview("Approved");
  });
  dom.rejectReportButton.addEventListener("click", () => handleReportReview("Rejected"));
  dom.reportCenterApproveButton.addEventListener("click", () => {
    handleReportReview("Approved", {
      reportId: state.selectedReportId,
      reviewNotes: dom.reportCenterReviewNotes.value.trim(),
    });
  });
  dom.reportCenterRejectButton.addEventListener("click", () => {
    handleReportReview("Rejected", {
      reportId: state.selectedReportId,
      reviewNotes: dom.reportCenterReviewNotes.value.trim(),
    });
  });
  dom.approvalsList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (button) {
      handleReportAction(button);
    }
  });

  dom.workshopJobSelect.addEventListener("change", () => {
    state.selectedJobId = dom.workshopJobSelect.value;
    renderAll();
  });
  dom.openWorkshopSiteLinkButton.addEventListener("click", () => openSiteLink(dom.workshopJobSelect.value));
  dom.addPartButton.addEventListener("click", () => dom.workshopPartsList.appendChild(createPartRow()));
  dom.workshopForm.addEventListener("submit", handleWorkshopSubmit);
  dom.workshopResetButton.addEventListener("click", resetWorkshopForm);
  dom.workshopBeforeInput.addEventListener("change", () => appendFilesToBucket(dom.workshopBeforeInput.files, "workshopBefore", dom.workshopBeforePreview, dom.workshopBeforeInput));
  dom.workshopAfterInput.addEventListener("change", () => appendFilesToBucket(dom.workshopAfterInput.files, "workshopAfter", dom.workshopAfterPreview, dom.workshopAfterInput));
  dom.forumComposer.addEventListener("submit", handleForumSubmit);
  dom.forumChannel.addEventListener("change", renderForum);
  dom.cancelForumReplyButton.addEventListener("click", () => {
    state.forumReplyToId = null;
    renderForum();
  });
  dom.forumFeed.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }
    if (button.dataset.action === "forum-reply") {
      state.forumReplyToId = button.dataset.messageId;
      renderForum();
      dom.forumMessage.focus();
      return;
    }
    if (button.dataset.action === "forum-react") {
      toggleForumReaction(button.dataset.messageId, button.dataset.reaction);
    }
  });
  dom.forumChannels.addEventListener("click", (event) => {
    const button = event.target.closest('button[data-action="forum-channel"]');
    if (!button) {
      return;
    }
    dom.forumChannel.value = button.dataset.channelId;
    renderForum();
  });

  document.body.addEventListener("click", (event) => {
    const removeEntryButton = event.target.closest('button[data-action="remove-entry"]');
    if (removeEntryButton) {
      removeEntryButton.closest(".entry-row")?.remove();
      return;
    }

    const removeImageButton = event.target.closest('button[data-action="remove-image"]');
    if (!removeImageButton) {
      return;
    }
    const bucket = removeImageButton.dataset.bucket;
    const index = Number(removeImageButton.dataset.index);
    if (!Array.isArray(state.uploads[bucket])) {
      return;
    }
    state.uploads[bucket].splice(index, 1);
    const previewMap = {
      reportBefore: dom.reportBeforePreview,
      reportAfter: dom.reportAfterPreview,
      workshopBefore: dom.workshopBeforePreview,
      workshopAfter: dom.workshopAfterPreview,
    };
    renderImagePreviews(previewMap[bucket], state.uploads[bucket], bucket);
  });

  dom.downloadReportButton.addEventListener("click", () => downloadApprovedReport());
  dom.printReportButton.addEventListener("click", printSelectedReport);
  dom.shareSummaryButton.addEventListener("click", copySummary);
  dom.sendWhatsappButton.addEventListener("click", () => openShareLink("whatsapp"));
  dom.sendEmailButton.addEventListener("click", () => openShareLink("email"));

  window.addEventListener("online", renderAll);
  window.addEventListener("offline", renderAll);
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      notify("Service worker registration failed. The app still works without offline caching.", "warn");
    });
  }
}

state.data = loadData();
ensureSelections();
bindEvents();
resetAllForms();
renderAll();
registerServiceWorker();
