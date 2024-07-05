import { Router } from "express";
import validateRequest from "../middleware/validatereq";
import {
  createUser,
  deleteUser,
  getUserByID,
  getUsers,
  updateUser,
} from "../controllers/user";
import userSchema from "../model/userSchema";

const router: Router = Router();

//get all users endpoint
router.get("/getUsers", getUsers);

//get user by ID endpoint
router.get("/getUser/:id", getUserByID);

//create user endpoint
router.post("/createUser", createUser);

//update user by their ID endpoint
router.put("/udpateUser/:id", validateRequest(userSchema), updateUser);

//delete user by their ID endpoint
router.delete("/deleteUser/:id", deleteUser);

export default router;
