import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../db/data_source";
import { User } from "../entity/User";

export const authorize = (requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Verify the JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Auth Error" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      // @ts-expect-error
      req.user = decoded;
    } catch (error) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    // Check if the user exists and has the necessary permissions
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      // @ts-expect-error
      where: { id: req.user.id },
      relations: ["role", "role.permissions"],
    });

    if (!user) {
      return res.status(401).json({ message: "Auth Error" });
    }

    // Extract permissions from the user's roles
    const userPermissions = user.role
      .flatMap((role) => role.permissions)
      .map((permission) => permission.name);

    // Check if user has all required permissions
    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({ message: "Access Denied" });
    }

    next();
  };
};
//function to generate token
export const generateToken = (user: any) => {
  return jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: "1h" });
};
