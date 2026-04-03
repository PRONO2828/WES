import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/products", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.listProducts(req.query));
  } catch (error) {
    next(error);
  }
});

router.post("/products", requireAuth, (req, res, next) => {
  try {
    res.status(201).json(req.store.createProduct(req.body));
  } catch (error) {
    next(error);
  }
});

router.put("/products/:productId", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.updateProduct(req.params.productId, req.body));
  } catch (error) {
    next(error);
  }
});

router.delete("/products/:productId", requireAuth, (req, res, next) => {
  try {
    res.json(req.store.deleteProduct(req.params.productId));
  } catch (error) {
    next(error);
  }
});

export default router;
