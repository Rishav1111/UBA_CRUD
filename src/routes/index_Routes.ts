import { Router } from "express";
const mainRouter: Router = Router();

import userRoutes from "./userRoutes";
import internshipRoutes from "./internshipRoutes";
import permissionRoutes from "./permissionRoutes";
import roleRoutes from "./roleRoutes";

mainRouter
  .use(userRoutes)
  .use(internshipRoutes)
  .use(permissionRoutes)
  .use(roleRoutes);

export default mainRouter;
