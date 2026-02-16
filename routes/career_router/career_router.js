import express from "express";
import { AddJob, Delete, getAllJobs, getJobbyId, UpdateJob } from "../../job_controller/job_controller.js";
import auth from "../../middleware/auth.js";

const router = express.Router()
router.post('/addJob',auth, AddJob)
router.get('/getAlljobs', getAllJobs)
router.get('/getjobById/:id',getJobbyId)
router.put('/updateJob/:id', UpdateJob)
router.delete('/deleteJob/:id',Delete)

// module.exports=router
export default router;