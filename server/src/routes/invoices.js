import { Router } from "express";
import { sendInvoicePdf } from "../lib/pdf.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/invoices", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.listInvoices(req.query));
  } catch (error) {
    next(error);
  }
});

router.get("/invoices/:invoiceId", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.getInvoice(req.params.invoiceId));
  } catch (error) {
    next(error);
  }
});

router.post("/invoices", requireAuth, (req, res, next) => {
  try {
    res.status(201).json(req.store.createInvoice(req.user, req.body));
  } catch (error) {
    next(error);
  }
});

router.put("/invoices/:invoiceId", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.updateInvoice(req.params.invoiceId, req.body));
  } catch (error) {
    next(error);
  }
});

router.delete("/invoices/:invoiceId", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.deleteInvoice(req.params.invoiceId));
  } catch (error) {
    next(error);
  }
});

router.post("/invoices/:invoiceId/send", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.sendInvoice(req.params.invoiceId));
  } catch (error) {
    next(error);
  }
});

router.get("/invoices/:invoiceId/pdf", requireAuth, (req, res, next) => {
  try {
    sendInvoicePdf(res, req.store.getSettings(), req.store.getInvoice(req.params.invoiceId));
  } catch (error) {
    next(error);
  }
});

export default router;
