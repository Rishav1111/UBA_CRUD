import { Request, Response } from 'express';
import { User } from '../entity/User';
import Joi from 'joi';
import { AppDataSource } from '../db/data_source';
import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/auth_user';
import { Role } from '../entity/Role';

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
const DEFAULT_ROLE_ID = 2;

export const createUser = async (req: Request, res: Response) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }

    const userRepo = AppDataSource.getRepository(User);
    const roleRepo = AppDataSource.getRepository(Role);
    const { fullname, DOB, phoneNumber, email, password, role }: User =
        req.body;

    const existingUser = await userRepo.findOne({
        where: { email },
        relations: ['role'],
    });
    console.log(existingUser);

    if (existingUser !== null) {
        return res
            .status(409)
            .json({ message: 'User with the same email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // If no roles are provided, assign the default role
    const rolesToAssign =
        role && role.length > 0 ? role : [{ id: DEFAULT_ROLE_ID }];

    const roleEntities = await Promise.all(
        rolesToAssign.map(async (value) => {
            let roleEntity = await roleRepo.findOne({
                where: { id: value.id },
            });
            if (!roleEntity) {
                throw new Error(`Role with ID ${value.id} does not exist`);
            }
            return roleEntity;
        })
    );
    console.log(roleEntities);

    const newUser = userRepo.create({
        fullname,
        DOB,
        phoneNumber,
        email,
        password: hashedPassword,
        role: roleEntities,
    });

    await userRepo.save(newUser);

    return res.status(201).json({ message: 'User created', user: newUser });
};
//Login user
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({
        where: { email },
        relations: ['role'],
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid Password' });
    }

    const roleName = user.role.map((role) => role.name);

    const payload = {
        id: user.id,
        fullname: user.fullname,
        role: roleName,
        Permissions: user.role.flatMap((role) => role.permissions),
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
    const users = await userRepository.find({
        relations: ['role', 'role.permissions'],
    });
    return res.status(200).json(users);
};

//Get user by ID

export const getUserByID = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
        where: { id: parseInt(req.params.id) },
        relations: ['role', 'role.permissions'],
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
