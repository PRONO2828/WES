import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/recurring", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.listRecurring(req.query));
  } catch (error) {
    next(error);
  }
});

router.post("/recurring", requireAuth, (req, res, next) => {
  try {
    res.status(201).json(req.store.createRecurring(req.user, req.body));
  } catch (error) {
    next(error);
  }
});

router.put("/recurring/:profileId", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.updateRecurring(req.params.profileId, req.body));
  } catch (error) {
    next(error);
  }
});

router.delete("/recurring/:profileId", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.deleteRecurring(req.params.profileId));
  } catch (error) {
    next(error);
  }
});

router.post("/recurring/:profileId/generate", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.generateRecurringInvoice(req.user, req.params.profileId));
  } catch (error) {
    next(error);
  }
});

export default router;
