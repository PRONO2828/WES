import { Router } from "express";
import { archiveUser, createTechnician, listUsers, resetUserPassword, updateUserStatus } from "../data/store.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/users", authenticate, authorize("admin"), (req, res, next) => {
  try {
    res.json(
      listUsers(req.store, req.user, {
        role: req.query.role,
        specialty: req.query.specialty,
        includeArchived: req.query.includeArchived
      })
    );
  } catch (error) {
    next(error);
  }
});

router.post("/users/technicians", authenticate, authorize("admin"), (req, res, next) => {
  try {
    res.status(201).json(createTechnician(req.store, req.user, req.body));
  } catch (error) {
    next(error);
  }
});

router.patch("/users/:userId/status", authenticate, authorize("admin"), (req, res, next) => {
  try {
    res.json(updateUserStatus(req.store, req.user, req.params.userId, req.body));
  } catch (error) {
    next(error);
  }
});

router.patch("/users/:userId/password", authenticate, authorize("admin"), (req, res, next) => {
  try {
    res.json(resetUserPassword(req.store, req.user, req.params.userId, req.body));
  } catch (error) {
    next(error);
  }
});

router.delete("/users/:userId", authenticate, authorize("admin"), (req, res, next) => {
  try {
    res.json(archiveUser(req.store, req.user, req.params.userId));
  } catch (error) {
    next(error);
  }
});

export default router;
