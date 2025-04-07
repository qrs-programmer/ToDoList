// routes.ts
import express from "express";
import { checkJwt } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/api/protected", checkJwt, (req, res) => {
  res.json({ message: "This is a protected route" });
});

export default router;
