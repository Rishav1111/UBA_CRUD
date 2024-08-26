import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../db/data_source';
import { User } from '../entity/User';
import { getCache, setCache } from '../Utils/cacheUtils';
import { Role } from '../models/role.model';
import { getRoles } from '../controllers/roles';

interface CustomRequest extends Request {
    user?: any;
}

// interface userProps {
//     id: number;
//     fullname: string;
//     role: string;
//     permissions: string[];
// }

export const authorize = (requiredPermissions: string[]) => {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {
        // Verify the JWT token
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Auth Error!' });
        }

        const token = authHeader.split(' ')[1];
        let decoded;
        try {
            decoded = jwt.verify(
                token,
                process.env.JWT_SECRET as string
            ) as any;
            req.user = decoded;
        } catch (error) {
            return res.status(401).json({ message: `Invalid Token ${error}` });
        }

        // Fetch roles and permissions from cache or MongoDB
        let roles;
        try {
            roles = await getRoles();
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching roles' });
        }

        // Extract permissions from the roles
        const userRole = roles.find(
            (role: { name: string }) => req.user && role.name === req.user.role
        );
        if (!userRole) {
            return res.status(403).json({ message: 'Role not found' });
        }

        const userPermissions = userRole.permissions.map(
            (permission: { name: string }) => permission.name
        );

        // Check if user has all required permissions
        const hasPermission = requiredPermissions.every((permission) =>
            userPermissions.includes(permission)
        );

        if (!hasPermission) {
            return res.status(403).json({ message: 'Access Denied' });
        }

        next();
    };
};

//function to generate token
export const generateToken = (user: any) => {
    return jwt.sign(user, process.env.JWT_SECRET as string, {
        expiresIn: '1h',
    });
};
