import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { User } from "../model/userModel";

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

//Create new user
export const createUser = (req: Request, res: Response) => {
  try {
    const { fullname, age, phoneNumber, email, password }: User = req.body;

    if (!fullname || !age || !phoneNumber || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

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
  } catch (error) {
    return res.status(500).json({ status: "Failed to create user." });
  }
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

//update the user by their ID
// Update the user by their ID
export const updateUser = (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { fullname, age, phoneNumber, email, password }: Partial<User> =
      req.body;

    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
      // Check if the new email belongs to another user
      if (
        email &&
        users.some((user) => user.email === email && user.id !== id)
      ) {
        return res
          .status(409)
          .json({ message: "User with same email already exists" });
      }

      // Update only the provided fields
      if (fullname) users[index].fullname = fullname;
      if (age) users[index].age = age;
      if (phoneNumber) users[index].phoneNumber = phoneNumber;
      if (email) users[index].email = email;
      if (password) users[index].password = password;

      saveUsers();

      return res.status(200).json({ "User updated": users[index] });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({ status: "Failed to update user." });
  }
};

//delete user by their ID
export const deleteUser = (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
      users.splice(index, 1);
      saveUsers();
      return res.status(200).json({ message: "User deleted" });
    } else {
      return res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).json({ status: "Failed to delete user." });
  }
};
