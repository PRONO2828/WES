import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/settings", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.getSettings());
  } catch (error) {
    next(error);
  }
});

router.put("/settings", requireAuth, requireRole("admin"), (req, res, next) => {
  try {
    res.json(req.store.updateSettings(req.body));
  } catch (error) {
    next(error);
  }
});

export default router;
