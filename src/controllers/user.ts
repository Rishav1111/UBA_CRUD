import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { User } from "../model/userModel";
import Joi from "joi";

const filePath = path.join(__dirname, "../userData.json");

//initailize users array from file
export let users: User[] = [];

if (fs.existsSync(filePath)) {
  const data = fs.readFileSync(filePath, "utf-8");
  users = JSON.parse(data);
} else {
  fs.writeFileSync(filePath, JSON.stringify(users));
}

//Save users to file
const saveUsers = () => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};

const userSchema = Joi.object({
  fullname: Joi.string().min(3).max(30).required(),
  age: Joi.number().integer().required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .required(),
  email: Joi.string()
    .email()
    .pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
    .required(),
  password: Joi.string().min(8).required(),
});

//Create new user
export const createUser = (req: Request, res: Response) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const { fullname, age, phoneNumber, email, password }: User = req.body;

  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res
      .status(409)
      .json({ message: "User with same email already exists" });
  }
  const newid = users.length + 1;
  const newUser: User = {
    id: newid,
    fullname,
    age,
    phoneNumber,
    email,
    password,
  };

  users.push(newUser);

  return res.status(201).json({ "User created:": newUser });
};

//Get all users
export const getUsers = (req: Request, res: Response) => {
  return res.status(200).json(users);
};

//Get user by ID

export const getUserByID = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
  } else {
    res.status(200).json(user);
  }
};

// Update the user by their ID
export const updateUser = (req: Request, res: Response) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const userIndex = users.findIndex(
    (user) => user.id === Number(req.params.id)
  );
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...req.body };
    res.status(200).json(users[userIndex]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

//delete user by their ID
export const deleteUser = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    saveUsers();
    return res.status(200).json({ message: "User deleted" });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};
