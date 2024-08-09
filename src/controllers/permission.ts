import { Request, Response } from "express";
import { AppDataSource } from "../db/data_source";

import { Permission } from "../entity/Permission";
import { Role } from "../entity/Role";

export const createPermission = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Permission name is required" });
  }

  const permissionRepo = AppDataSource.getRepository(Permission);
  const permission = permissionRepo.create({ name });
  await permissionRepo.save(permission);

  return res.status(201).json({ message: "Permission created", permission });
};

export const addPermissionToRole = async (req: Request, res: Response) => {
  const roleId = parseInt(req.params.roleId, 10);
  const { permissionIds }: { permissionIds: number[] } = req.body;

  if (isNaN(roleId)) {
    return res.status(400).json({ message: "Invalid role ID" });
  }

  if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
    return res.status(400).json({ message: "Invalid permissions list" });
  }

  const roleRepo = AppDataSource.getRepository(Role);
  const permissionRepo = AppDataSource.getRepository(Permission);

  const role = await roleRepo.findOneBy({ id: roleId });

  if (!role) {
    return res.status(404).json({ message: "Role not found" });
  }

  const permission = await permissionRepo.findByIds(permissionIds);
  if (!permission) {
    return res.status(404).json({ message: "Permission not found" });
  }

  role.permissions = permission;

  await roleRepo.save(role);

  return res.status(200).json({ message: "Permission added to role", role });
};
