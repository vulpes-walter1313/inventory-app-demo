import express from "express";
import apiController from "../controllers/apiController";
const router = express.Router();

router.post("/slugify", apiController.slugifyGet);

export default router;
