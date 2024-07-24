import { Router } from "express";
const router: Router = Router();

import {
  createInternship,
  getInternshipByID,
  getInternships,
  updateInternship,
} from "../controllers/internship";

router.post("/createInternship", createInternship);
router.get("/getInternships", getInternships);
router.get("/getInternship/:id", getInternshipByID);
router.put("/updateInternship/:id", updateInternship);

export default router;
