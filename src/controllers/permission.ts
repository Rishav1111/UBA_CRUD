import { Request, Response } from 'express';
import { AppDataSource } from '../db/data_source';

import { Permission } from '../models/permission.model';
import { Role } from '../models/role.model';
import { In } from 'typeorm';

export interface Permission {
    _id: string;
    name: string;
}

export const createPermission = async (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Permission name is required' });
    }

    const permission = new Permission({ name });
    await permission.save();

    return res.status(201).json({ message: 'Permission created', permission });
};

export const addPermissionToRole = async (req: Request, res: Response) => {
    const roleId = req.params._id;
    const { permissionIds }: { permissionIds: string[] } = req.body;

    if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
        return res.status(400).json({ message: 'Invalid permissions list' });
    }

    const role = await Role.findById(roleId).populate('permissions');
    if (!role) {
        return res.status(404).json({ message: 'Role not found' });
    }

    const permissions = await Permission.find({ _id: { $in: permissionIds } });
    if (permissions.length === 0) {
        return res.status(404).json({ message: 'Permissions not found' });
    }

    const newPermissionIds = permissions
        .filter(
            (perm) =>
                !role.permissions.some((existingPerm) =>
                    existingPerm._id.equals(perm._id)
                )
        )
        .map((perm) => perm._id);

    role.permissions = [
        ...role.permissions.map((perm) => perm._id),
        ...newPermissionIds,
    ];

    await role.save();

    return res.status(200).json({ message: 'Permissions added to role', role });
};

// const fetchPermissions = async (permissionIds: string[]): Promise<Permission[]> => {
//     return await Permission.find({ _id: { $in: permissionIds } });
// };

// export const getPermissions = async (permissionIds: string[]) => {
//     // Step 1: Generate a cache key based on the permission IDs
//     const cacheKey = `permissions:${permissionIds.join(',')}`;

//     // Step 2: Check if the permissions are in the cache
//     let permissions = await cacheGet(cacheKey);

//     if (!permissions) {
//         // Step 3: If not in cache, fetch from MongoDB
//         permissions = await Permission.find({ _id: { $in: permissionIds } });

//         if (permissions.length === 0) {
//             throw new Error('Permissions not found');
//         }

//         // Step 4: Store the permissions in the cache
//         await cacheSet(cacheKey, permissions);
//     }

//     return permissions;
// };
// function cacheGet(cacheKey: string) {
//     throw new Error('Function not implemented.');
// }
