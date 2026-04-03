import { Router } from "express";
import { authenticate, createToken } from "../middleware/auth.js";

const router = Router();

router.get("/auth/options", (req, res) => {
  res.json(req.store.listAuthOptions());
});

router.post("/auth/login", (req, res, next) => {
  try {
    const user = req.store.authenticateWithPassword(req.body.identity || req.body.email, req.body.password);
    req.store.touchPresence(user.id, { online: true });
    res.json({
      token: createToken(user),
      user
    });
  } catch (error) {
    next(error);
  }
});

router.get("/auth/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

router.post("/auth/presence", authenticate, (req, res, next) => {
  try {
    res.json({
      user: req.store.touchPresence(req.user.id, req.body),
      onlineUsers: req.store.events ? req.store.listAuthOptions?.() : undefined
    });
  } catch (error) {
    next(error);
  }
});

router.post("/auth/logout", authenticate, (req, res, next) => {
  try {
    res.json(req.store.logout(req.user.id));
  } catch (error) {
    next(error);
  }
});

export default router;
