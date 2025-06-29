import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, saveJob, getSavedJobs, unsaveJob, updateJob, deleteJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.post("/save/:id", isAuthenticated, saveJob);
router.get("/saved", isAuthenticated, getSavedJobs);
router.post("/unsave/:id", isAuthenticated, unsaveJob);
router.put("/update/:id", isAuthenticated,updateJob);
router.route("/:id").delete(isAuthenticated, deleteJob);


export default router;