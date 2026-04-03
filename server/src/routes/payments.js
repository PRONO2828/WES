import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/payments", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.listPayments(req.query));
  } catch (error) {
    next(error);
  }
});

router.post("/payments", requireAuth, (req, res, next) => {
  try {
    res.status(201).json(req.store.createPayment(req.user, req.body));
  } catch (error) {
    next(error);
  }
});

router.put("/payments/:paymentId", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.updatePayment(req.params.paymentId, req.body));
  } catch (error) {
    next(error);
  }
});

router.delete("/payments/:paymentId", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.deletePayment(req.params.paymentId));
  } catch (error) {
    next(error);
  }
});

export default router;
