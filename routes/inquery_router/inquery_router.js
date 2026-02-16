import express from "express";
import { AddInquiry, getAllInquiry } from "../../inquery_controller/inquery_controller.js";
const router = express.Router()
router.post("/addinquery", AddInquiry)
router.get("/getAllinquery",getAllInquiry)
export default router;