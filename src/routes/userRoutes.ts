import { Router } from "express";

import {
  createUser,
  deleteUser,
  getUserByID,
  getUsers,
  loginUser,
  updateUser,
} from "../controllers/user";
import { authorize } from "../middleware/auth_user";
import { createUserByAdmin, registerUser } from "../controllers/admin";

const router: Router = Router();

//create user endpoint
router.post("/createUser", createUser);

//create user by admin endpoint
router.post("/createUserByAdmin", createUserByAdmin);
router.post("/register/user", registerUser);

//login user
router.post("/login", loginUser);

// router.use(jwtauth);

//get all users endpoint
router.get("/getUsers", authorize(["get_all_users"]), getUsers);

//get user by ID endpoint
router.get("/getUser/:id", authorize(["get_user"]), getUserByID);

//update user by their ID endpoint
router.put("/updateUser/:id", authorize(["edit_user"]), updateUser);

//delete user by their ID endpoint
router.delete("/deleteUser/:id", authorize(["delete_users"]), deleteUser);

export default router;
