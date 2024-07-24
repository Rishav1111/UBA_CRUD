import { Router } from "express";

import {
  createUser,
  deleteUser,
  getUserByID,
  getUsers,
  loginUser,
  updateUser,
} from "../controllers/user";
import { jwtauth } from "../middleware/auth_user";

const router: Router = Router();

//get all users endpoint
router.get("/getUsers", getUsers);

//get user by ID endpoint
router.get("/getUser/:id", getUserByID);

//create user endpoint
router.post("/createUser", createUser);

//login user
router.post("/login", loginUser);

//update user by their ID endpoint
router.put("/updateUser/:id", updateUser);

//delete user by their ID endpoint
router.delete("/deleteUser/:id", deleteUser);

export default router;
