import { Router } from "express";
import { sendReminders } from "../controllers/workflow.controller.js";

const workflowRouter = Router()

// Upstash workflows need to be handled differently
workflowRouter.post("/subscription/reminder", sendReminders);

export default workflowRouter