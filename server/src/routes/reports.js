import { Router } from "express";
import PDFDocument from "pdfkit";
import {
  getFieldReportDetail,
  getReportForPdf,
  getReviewQueue,
  getWorkshopReports,
  listFieldReports,
  reviewFieldReport
} from "../data/store.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/reports", authenticate, (req, res, next) => {
  try {
    res.json(
      listFieldReports(req.store, req.user, {
        jobId: req.query.jobId,
        status: req.query.status,
        technicianId: req.query.technicianId,
        siteId: req.query.siteId
      })
    );
  } catch (error) {
    next(error);
  }
});

router.get("/reports/:reportId", authenticate, (req, res, next) => {
  try {
    res.json(getFieldReportDetail(req.store, req.user, req.params.reportId));
  } catch (error) {
    next(error);
  }
});

router.get("/workshop-reports", authenticate, (req, res, next) => {
  try {
    res.json(getWorkshopReports(req.store, req.user, { jobId: req.query.jobId }));
  } catch (error) {
    next(error);
  }
});

router.get("/review-queue", authenticate, authorize("admin"), (req, res, next) => {
  try {
    res.json(getReviewQueue(req.store, req.user));
  } catch (error) {
    next(error);
  }
});

router.post("/reports/:reportId/review", authenticate, authorize("admin"), (req, res, next) => {
  try {
    res.json(reviewFieldReport(req.store, req.user, req.params.reportId, req.body));
  } catch (error) {
    next(error);
  }
});

router.get("/reports/:reportId/export", authenticate, (req, res, next) => {
  try {
    const bundle = getReportForPdf(req.store, req.user, req.params.reportId);
    const { report, job, workshopReports } = bundle;
    const latestWorkshop = workshopReports[0] || null;
    const doc = new PDFDocument({ margin: 42, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${report.reportNumber}.pdf"`);
    doc.pipe(res);

    doc.fontSize(20).text("WES & GENERAL ENGINEERING LTD");
    doc.fontSize(12).fillColor("#44586B").text("Field Service Management Report");
    doc.moveDown();
    doc.fillColor("#000000").fontSize(12);
    doc.text(`Report Number: ${report.reportNumber}`);
    doc.text(`Job Number: ${job?.jobNumber || "N/A"}`);
    doc.text(`Client: ${job?.clientName || "N/A"}`);
    doc.text(`Site: ${report.site?.name || job?.manualLocation || "N/A"}`);
    doc.text(`Service Type: ${job?.serviceType || "N/A"}`);
    doc.text(`Technician: ${report.technicianName}`);
    doc.text(`Captured At: ${report.capturedAt}`);
    doc.text(`Submitted At: ${report.submittedAt}`);
    doc.text(`Review Status: ${report.reviewStatus}`);
    doc.moveDown();

    doc.fontSize(13).text("Diagnosis", { underline: true });
    doc.fontSize(11).text(report.diagnosis || "No diagnosis captured");
    doc.moveDown(0.6);
    doc.fontSize(13).text("Work Done", { underline: true });
    doc.fontSize(11).text(report.workDone || "No work summary captured");
    doc.moveDown(0.6);
    doc.fontSize(13).text("Materials Used", { underline: true });
    doc
      .fontSize(11)
      .text(
        report.materials.length
          ? report.materials.map((item) => `${item.name}: ${item.quantity} ${item.unit}`).join("\n")
          : "No materials recorded"
      );
    doc.moveDown(0.6);
    doc.fontSize(13).text("Measurements", { underline: true });
    doc
      .fontSize(11)
      .text(
        report.measurements.length
          ? report.measurements.map((item) => `${item.label}: ${item.value} ${item.unit || ""}`.trim()).join("\n")
          : "No measurements recorded"
      );
    doc.moveDown(0.6);
    doc.fontSize(13).text("Client Approval", { underline: true });
    doc.fontSize(11).text(`Client Name: ${report.clientApproval?.clientName || "N/A"}`);
    doc.text(`Signed At: ${report.clientApproval?.signedAt || "N/A"}`);
    doc.moveDown(0.6);
    doc.fontSize(13).text("Images Captured", { underline: true });
    doc.fontSize(11).text(`Before Work Images: ${report.beforeImages.length}`);
    doc.text(`After Work Images: ${report.afterImages.length}`);
    doc.moveDown(0.6);
    doc.fontSize(13).text("Review Notes", { underline: true });
    doc.fontSize(11).text(report.reviewNotes || "Approved with no additional notes.");

    if (latestWorkshop) {
      doc.moveDown();
      doc.fontSize(13).text("Latest Workshop Follow-Up", { underline: true });
      doc.fontSize(11).text(latestWorkshop.repairDetails);
      doc.text(
        latestWorkshop.partsReplaced.length
          ? `Parts Replaced: ${latestWorkshop.partsReplaced.map((item) => `${item.name} (${item.quantity} ${item.unit})`).join(", ")}`
          : "Parts Replaced: None recorded"
      );
      doc.text(`Logged By: ${latestWorkshop.technicianName}`);
    }

    doc.end();
  } catch (error) {
    next(error);
  }
});

export default router;
