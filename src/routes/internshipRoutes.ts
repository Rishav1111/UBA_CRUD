import { Router } from "express";
const router: Router = Router();

import { createInternship } from "../controllers/internship";

router.post("/createInternship", createInternship);

export default router;
