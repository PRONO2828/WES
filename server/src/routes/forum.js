import { Router } from "express";
import { createForumMessage, getOnlineUsers, listForumMessages } from "../data/store.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/forum/messages", authenticate, (req, res, next) => {
  try {
    res.json(listForumMessages(req.store, req.user));
  } catch (error) {
    next(error);
  }
});

router.post("/forum/messages", authenticate, (req, res, next) => {
  try {
    const message = createForumMessage(req.store, req.user, req.body);
    res.status(201).json({
      message,
      onlineUsers: getOnlineUsers(req.store)
    });
  } catch (error) {
    next(error);
  }
});

router.get("/forum/stream", authenticate, (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const send = (eventName, payload) => {
    res.write(`event: ${eventName}\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  send("snapshot", listForumMessages(req.store, req.user));

  const handleMessage = (payload) => send("message", payload);
  const handlePresence = (payload) => send("presence", payload);

  req.store.events.on("forum:message", handleMessage);
  req.store.events.on("presence:update", handlePresence);

  req.on("close", () => {
    req.store.events.off("forum:message", handleMessage);
    req.store.events.off("presence:update", handlePresence);
  });
});

export default router;
