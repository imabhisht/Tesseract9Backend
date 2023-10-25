import { Router } from "express";
import { getEvents } from "../controllers/events.js";
const router = Router();

router.get("/", getEvents);


export default router;