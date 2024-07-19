import { Router } from "express";
const mainRouter: Router = Router();

import userRoutes from "./userRoutes";
import internshipRoutes from "./internshipRoutes";

mainRouter.use(userRoutes).use(internshipRoutes);

export default mainRouter;
