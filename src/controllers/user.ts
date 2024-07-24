import { Request, Response } from "express";
import { User } from "../entity/User";
import Joi from "joi";
import { getRepository } from "typeorm";
import { AppDataSource } from "../db/data_source";
import bcrypt from "bcrypt";
import { jwtauth, generateToken } from "../middleware/auth_user";

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

  const userRepo = AppDataSource.getRepository(User);
  const { fullname, age, phoneNumber, email, password }: User = req.body;

  const existingUser = await userRepo.findOne({ where: { email } });
  console.log(existingUser);

  if (existingUser !== null) {
    return res
      .status(409)
      .json({ message: "User with the same email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = userRepo.create({
    fullname,
    age,
    phoneNumber,
    email,
    password: hashedPassword,
  });

  await userRepo.save(newUser);

  const payload = {
    id: newUser.id,
    fullname: newUser.fullname,
  };

  const token = generateToken(payload);
  console.log(token);

  return res.status(201).json({ "User created:": newUser, token: token });
};

//Login user
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userRepo = AppDataSource.getRepository(User);

  const user = await userRepo.findOne({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid Password" });
  }

  const payload = {
    id: user.id,
    fullname: user.fullname,
  };

  const token = generateToken(payload);

  return res.status(200).json({ message: "Login Successfully", token: token });
};

//Get all users
export const getUsers = (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);
  return userRepository.find().then((users) => {
    return res.status(200).json(users);
  });
};

//Get user by ID

export const getUserByID = async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);
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

  const userRepository = AppDataSource.getRepository(User);
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
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  } else {
    await userRepository.remove(user);
    return res.status(200).json({ message: "User deleted" });
  }
};
