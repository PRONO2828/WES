import { Router } from "express";
import { sendQuotePdf } from "../lib/pdf.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/quotes", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.listQuotes(req.query));
  } catch (error) {
    next(error);
  }
});

router.get("/quotes/:quoteId", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.getQuote(req.params.quoteId));
  } catch (error) {
    next(error);
  }
});

router.post("/quotes", requireAuth, (req, res, next) => {
  try {
    res.status(201).json(req.store.createQuote(req.user, req.body));
  } catch (error) {
    next(error);
  }
});

router.put("/quotes/:quoteId", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.updateQuote(req.params.quoteId, req.body));
  } catch (error) {
    next(error);
  }
});

router.delete("/quotes/:quoteId", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.deleteQuote(req.params.quoteId));
  } catch (error) {
    next(error);
  }
});

router.post("/quotes/:quoteId/convert", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.convertQuoteToInvoice(req.user, req.params.quoteId));
  } catch (error) {
    next(error);
  }
});

router.get("/quotes/:quoteId/pdf", requireAuth, (req, res, next) => {
  try {
    sendQuotePdf(res, req.store.getSettings(), req.store.getQuote(req.params.quoteId));
  } catch (error) {
    next(error);
  }
});

export default router;
