import { Request, Response } from 'express';
import { User } from '../entity/User';
import Joi from 'joi';
import { AppDataSource } from '../db/data_source';
import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/auth_user';
import { Role } from '../models/role.model';
import { client } from '../elasticsearchClient';
import { getCache, setCache } from '../Utils/cacheUtils';

interface UserSearchResult {
    _id: string;
    _source: {
        fullname: string;
        email: string;
        phoneNumber: string;
    };
}

const userSchema = Joi.object({
    fullname: Joi.string().min(3).max(30).required(),
    DOB: Joi.date().required(),
    phoneNumber: Joi.string().pattern(/^\d+$/).min(10).required(),
    email: Joi.string()
        .email()
        .pattern(/^[a-z\d._%+-]+@[a-z\d.-]+\.[a-z]{2,4}$/)
        .required(),
    password: Joi.string().min(8).required(),
    role: Joi.array()
        .items(Joi.object({ id: Joi.number().required() }))
        .optional(),
});

//Create new user
const DEFAULT_ROLE_ID = '66c6bb69e2ce368d8d52fc9b';

export const createUser = async (req: Request, res: Response) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }

    const userRepo = AppDataSource.getRepository(User);
    const { fullname, DOB, phoneNumber, email, password, roleId }: User =
        req.body;

    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser) {
        return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepo.create({
        fullname,
        DOB,
        phoneNumber,
        email,
        password: hashedPassword,
        roleId: Array.isArray(roleId) ? roleId[0] : roleId || DEFAULT_ROLE_ID,
    });

    await userRepo.save(newUser);
    // Index the user in Elasticsearch after saving to MySQL
    try {
        await client.index({
            index: 'users_list',
            id: newUser.id.toString(),
            body: {
                id: newUser.id,
                fullname: newUser.fullname,
                phoneNumber: newUser.phoneNumber,
                DOB: newUser.DOB,
                email: newUser.email,
            },
        });
        console.log('User indexed successfully in Elasticsearch');
    } catch (indexingError) {
        console.error('Error indexing user in Elasticsearch:', indexingError);
    }

    return res.status(201).json({ message: 'User created', user: newUser });
};
//Login user
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({
        where: { email },
        select: ['id', 'fullname', 'password', 'roleId'],
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid Password' });
    }

    // Fetch role details from Redis cache or MongoDB
    let roleData = await getCache(`role_${user.id}`);
    if (!roleData) {
        const role = await Role.findById(user.roleId).populate('permissions');
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        roleData = role.toObject();
        await setCache(`role_${user.roleId}`, roleData); // Store role in cache
    }

    const payload = {
        id: user.id,
        fullname: user.fullname,
        role: roleData.name,
        Permissions: roleData.permissions.map((perm: any) => perm.name),
    };

    const token = generateToken(payload);

    res.cookie('token', token, {
        httpOnly: false,

        maxAge: 1000 * 60 * 60 * 24,
    });

    return res
        .status(200)
        .json({ message: 'Login Successfully', token: token });
};

//Get all users
export const getUsers = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    return res.status(200).json(users);
};

export const getUsersFromDatabase = async () => {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    return users;
};
//elastic search

// Elasticsearch search
export const searchUsers = async (req: Request, res: Response) => {
    const query = req.query.q as string;

    try {
        const body = await client.search<UserSearchResult>({
            index: 'users_list',
            body: {
                query: {
                    multi_match: {
                        query,
                        fields: ['fullname', 'email', 'phoneNumber'],
                    },
                },
            },
        });

        return res.status(200).json(body.hits.hits);
    } catch (error) {
        console.error('Error searching users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

//Get user by ID

export const getUserByID = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
        where: { id: parseInt(req.params.id) },
    });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
};

// Update the user by their ID
export const updateUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id });
    if (user) {
        userRepository.merge(user, req.body);
        const result = await userRepository.save(user);
        console.log(result);

        return res.status(200).json('User updated');
    } else {
        return res.status(404).json({ message: 'User not found' });
    }
};

//delete user by their ID
export const deleteUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findBy({ id });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    } else {
        await userRepository.remove(user);

        await client.delete({
            index: 'users_list',
            id: id.toString(),
        });
        return res.status(200).json({ message: 'User deleted' });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { oldpassword, newpassword, confirmpassword } = req.body;

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ id });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldpassword, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid Password' });
    }
    if (newpassword !== confirmpassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const hashedPassword = await bcrypt.hash(newpassword, 10);

        user.password = hashedPassword;
        await userRepository.save(user);

        return res
            .status(200)
            .json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const userInjection = async (req: Request, res: Response) => {
    const { email } = req.params;

    const userRepository = AppDataSource.getRepository(User);

    try {
        const query = `SELECT * FROM user WHERE email = '${email}'`;

        const user = await userRepository.query(query);
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
