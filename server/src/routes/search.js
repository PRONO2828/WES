import { Router } from "express";
import { searchWorkspace } from "../data/store.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/search", authenticate, (req, res, next) => {
  try {
    res.json(
      searchWorkspace(req.store, req.user, {
        technicianName: req.query.technicianName,
        siteName: req.query.siteName,
        clientName: req.query.clientName,
        workType: req.query.workType,
        date: req.query.date,
        serviceType: req.query.serviceType,
        status: req.query.status,
        technicianId: req.query.technicianId
      })
    );
  } catch (error) {
    next(error);
  }
});

export default router;
