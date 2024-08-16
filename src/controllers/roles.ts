import { Request, Response } from "express";
import { AppDataSource } from "../db/data_source";

import { Role } from "../entity/Role";

export const createRole = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Role name is required" });
  }

  const roleRepo = AppDataSource.getRepository(Role);
  const role = roleRepo.create({ name });
  await roleRepo.save(role);

  return res.status(201).json({ message: "Role created", role });
};
