import { Router } from "express";
import {
  createJob,
  getJobDetail,
  getSiteHistoryBySiteId,
  listJobs,
  listSites,
  startJob,
  submitFieldReport,
  submitWorkshopReport,
  updateJob
} from "../data/store.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/jobs", authenticate, (req, res, next) => {
  try {
    res.json(
      listJobs(req.store, req.user, {
        serviceType: req.query.serviceType,
        status: req.query.status,
        technicianId: req.query.technicianId,
        search: req.query.search
      })
    );
  } catch (error) {
    next(error);
  }
});

router.get("/jobs/:jobId", authenticate, (req, res, next) => {
  try {
    res.json(getJobDetail(req.store, req.user, req.params.jobId));
  } catch (error) {
    next(error);
  }
});

router.post("/jobs", authenticate, authorize("admin"), (req, res, next) => {
  try {
    res.status(201).json(createJob(req.store, req.user, req.body));
  } catch (error) {
    next(error);
  }
});

router.patch("/jobs/:jobId", authenticate, authorize("admin"), (req, res, next) => {
  try {
    res.json(updateJob(req.store, req.user, req.params.jobId, req.body));
  } catch (error) {
    next(error);
  }
});

router.post("/jobs/:jobId/start", authenticate, authorize("technician"), (req, res, next) => {
  try {
    res.json(startJob(req.store, req.user, req.params.jobId));
  } catch (error) {
    next(error);
  }
});

router.post("/jobs/:jobId/reports", authenticate, authorize("technician"), (req, res, next) => {
  try {
    res.status(201).json(submitFieldReport(req.store, req.user, req.params.jobId, req.body));
  } catch (error) {
    next(error);
  }
});

router.post("/jobs/:jobId/workshop-reports", authenticate, authorize("technician"), (req, res, next) => {
  try {
    res.status(201).json(submitWorkshopReport(req.store, req.user, req.params.jobId, req.body));
  } catch (error) {
    next(error);
  }
});

router.get("/sites", authenticate, authorize("admin"), (req, res, next) => {
  try {
    res.json(listSites(req.store, req.user, req.query.search));
  } catch (error) {
    next(error);
  }
});

router.get("/sites/:siteId/history", authenticate, authorize("admin"), (req, res, next) => {
  try {
    res.json(getSiteHistoryBySiteId(req.store, req.user, req.params.siteId));
  } catch (error) {
    next(error);
  }
});

export default router;
