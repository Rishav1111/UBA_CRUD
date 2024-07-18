import { Request, Response } from "express";
import { User } from "../entity/User";
import Joi from "joi";
import { getRepository } from "typeorm";

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
export const createUser = async (req: Request, res: Response) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const userRepo = getRepository(User);
  const { fullname, age, phoneNumber, email, password }: User = req.body;

  const existingUser = await userRepo.findOne({ where: { email } });
  console.log(existingUser);

  if (existingUser !== null) {
    return res
      .status(409)
      .json({ message: "User with the same email already exists" });
  }

  const newUser = userRepo.create({
    fullname,
    age,
    phoneNumber,
    email,
    password,
  });

  await userRepo.save(newUser);

  return res.status(201).json({ "User created:": newUser });
};

//Get all users
export const getUsers = (req: Request, res: Response) => {
  const userRepo = getRepository(User);
  const users = userRepo.find();
  return res.status(200).json(users);
};

//Get user by ID

export const getUserByID = async (req: Request, res: Response) => {
  const userRepository = getRepository(User);
  const user = await userRepository.findOneById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json(user);
};

// Update the user by their ID
export const updateUser = async (req: Request, res: Response) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const userRepository = getRepository(User);
  const user = await userRepository.findOneById(req.params.id);
  if (user) {
    userRepository.merge(user, req.body);
    const result = await userRepository.save(user);
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

//delete user by their ID
export const deleteUser = async (req: Request, res: Response) => {
  const userRepository = getRepository(User);
  const user = await userRepository.findOneById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  } else {
    await userRepository.remove(user);
    return res.status(200).json({ message: "User deleted" });
  }
};
