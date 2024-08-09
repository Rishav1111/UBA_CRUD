import { Router } from "express";
import { createRole } from "../controllers/roles";
import { addPermissionToRole } from "../controllers/permission";

const router: Router = Router();

router.post("/createRole", createRole);

router.post("/roles/:roleId/permissions", addPermissionToRole);

export default router;
