import { Request, Response } from 'express';
import { getCache, setCache } from '../Utils/cacheUtils';

import { Role } from '../models/role.model';

export const createRole = async (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Role name is required' });
    }

    const role = new Role({ name });
    await role.save();

    return res.status(201).json({ message: 'Role created', role });
};

export const getRoles = async () => {
    try {
        // Try to get roles from cache
        const cachedRoles = await getCache('roles');
        if (cachedRoles) {
            console.log('Fetched roles from cache');
            return cachedRoles;
        }

        // If roles are not in cache, fetch from MongoDB
        const roles = await Role.find().populate('permissions');
        if (!roles || roles.length === 0) {
            throw new Error('No roles found');
        }

        // Store the fetched roles in cache
        await setCache('roles', roles);
        console.log('Fetched roles from MongoDB and updated cache');
        return roles;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw new Error('Internal server error');
    }
};

