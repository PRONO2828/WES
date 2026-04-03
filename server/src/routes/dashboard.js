import { Router } from "express";
import { getDashboard } from "../data/store.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/dashboard", authenticate, (req, res, next) => {
  try {
    res.json(getDashboard(req.store, req.user));
  } catch (error) {
    next(error);
  }
});

export default router;
