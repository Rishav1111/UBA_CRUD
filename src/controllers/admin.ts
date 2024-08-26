import { Request, Response } from 'express';
import { AppDataSource } from '../db/data_source';
import { User } from '../entity/User';

// import { Role } from '../entity/Role';
import { generateToken } from '../middleware/auth_user';
import { sentInvitationEmail } from '../Utils/sent_mail';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getRoles } from './roles';

interface CustomRequest extends Request {
    user?: UserProps;
}

interface UserProps {
    id: number;
}
const userRepo = AppDataSource.getRepository(User);

export const createUserByAdmin = async (req: Request, res: Response) => {
    const {
        fullname,
        DOB,
        phoneNumber,
        email,
        roleId: requestedRoleName,
    } = req.body;

    try {
        // Fetch roles from NoSQL database
        const roles = await getRoles();
        const userRole = roles.find(
            (role: { name: string; _id: string }) =>
                role.name === requestedRoleName
        );

        if (!userRole) {
            return res.status(404).json({ message: 'Role not found!!' });
        }

        const existingUser = await userRepo.findOne({
            where: { email },
            // relations: ['role'],
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'User with the same email already exists!!!',
            });
        }

        // Create a new user with the role ID
        const newUser = userRepo.create({
            fullname,
            DOB,
            phoneNumber,
            email,
            roleId: userRole._id,
        });

        await userRepo.save(newUser);
        const payload = {
            id: newUser.id,
        };

        const token = generateToken(payload);

        await sentInvitationEmail(newUser.email, token);

        return res
            .status(201)
            .json({ message: 'User created and invitation sent', token });
    } catch (error) {
        console.error('Error creating user', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const registerUser = async (req: CustomRequest, res: Response) => {
    const { token, password, confirmPassword } = req.body;

    try {
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as UserProps;

        const userId = decoded.id;

        const user = await userRepo.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = await bcrypt.hash(password, 10);

        await userRepo.save(user);

        res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
