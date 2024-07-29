import { Router } from "express";

import {
  createUser,
  deleteUser,
  getUserByID,
  getUsers,
  loginUser,
  updateUser,
} from "../controllers/user";
import { authorizeRoles, jwtauth } from "../middleware/auth_user";

const router: Router = Router();

//create user endpoint
router.post("/createUser", createUser);

//login user
router.post("/login", loginUser);

// router.use(jwtauth);

//get all users endpoint
router.get("/getUsers", jwtauth, authorizeRoles("Admin"), getUsers);

//get user by ID endpoint
router.get("/getUser/:id", jwtauth, getUserByID);

//update user by their ID endpoint
router.put("/updateUser/:id", jwtauth, updateUser);

//delete user by their ID endpoint
router.delete("/deleteUser/:id", jwtauth, authorizeRoles("Admin"), deleteUser);

export default router;
