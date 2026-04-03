import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/clients", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.listClients(req.query));
  } catch (error) {
    next(error);
  }
});

router.post("/clients", requireAuth, (req, res, next) => {
  try {
    res.status(201).json(req.store.createClient(req.body));
  } catch (error) {
    next(error);
  }
});

router.put("/clients/:clientId", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.updateClient(req.params.clientId, req.body));
  } catch (error) {
    next(error);
  }
});

router.delete("/clients/:clientId", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.deleteClient(req.params.clientId));
  } catch (error) {
    next(error);
  }
});

export default router;
