import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';

describe('User API', async () => {
    const newUser = {
        fullname: 'John Doe',
        DOB: '2002-01-01',
        phoneNumber: '1234567890',
        email: `john.doe.${Date.now()}@example.com`,
        password: 'password123',
        roleId: '66c6bb73e2ce368d8d52fc9d',
    };

    it('should create a new user', async () => {
        const response = await request(app)
            .post('/api/createUser')
            .send({
                fullname: 'Rishav Shrestha',
                DOB: '2002-01-01',
                phoneNumber: '1234567890',
                email: `stharishav.${Date.now()}@gmail.com`,
                password: 'password123',
            });

        console.log('Create User Response:', response.body);

        expect(response.status).toBe(201);
    });

    it('should return error if invalid email', async () => {
        const response = await request(app)
            .post('/api/createUser')
            .send({ ...newUser, email: 'invalid-email' });

        console.log('Invalid Email Response:', response.body);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    it('should return error if email already exists', async () => {
        await request(app).post('/api/createUser').send(newUser);

        const response = await request(app)
            .post('/api/createUser')
            .send(newUser);

        console.log('Email Exists Response:', response.body);

        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('message');
    });

    it('Get Users', async () => {
        const login_res = await request(app).post('/api/login').send({
            email: newUser.email,
            password: newUser.password,
        });

        const response = await request(app)
            .get('/api/getUsers')
            .set('Authorization', `Bearer ${login_res.body.token}`);

        console.log('Get Users Response:', response.body);

        expect(response.status).toBe(200);
    });

    it('should return error if no token provided while getting users', async () => {
        const response = await request(app).get('/api/getUsers');

        console.log('No Token Provided Response:', response.body);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
    });

    it('should return error if invalid token provided while getting users', async () => {
        const response = await request(app)
            .get('/api/getUsers')
            .set('Authorization', `Bearer invalid-token`);

        console.log('Invalid Token Provided Response:', response.body);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
    });

    it('should return error if password is short', async () => {
        const response = await request(app)
            .post('/api/createUser')
            .send({
                ...newUser,
                password: 'short',
            });

        console.log('Short Password Response:', response.body);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    it('should login user', async () => {
        const response = await request(app).post('/api/login').send({
            email: newUser.email,
            password: newUser.password,
        });

        console.log('Login User Response:', response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it('should return error if user not found', async () => {
        const response = await request(app).post('/api/login').send({
            email: 'invalid-email',
            password: 'invalid-password',
        });

        console.log('User Not Found Response:', response.body);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
    });

    it('should return error if invalid password', async () => {
        const response = await request(app).post('/api/login').send({
            email: newUser.email,
            password: 'invalid-password',
        });

        console.log('Invalid Password Response:', response.body);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
    });

    it('should update user', async () => {
        const login_res = await request(app).post('/api/login').send({
            email: newUser.email,
            password: newUser.password,
        });
        const userID = 301;

        const response = await request(app)
            .put(`/api/updateUser/${userID}`)
            .send({
                fullname: 'Jane Doe',
                DOB: '2002-01-01',
                phoneNumber: '0987654321',
                email: 'janedoe@gmail.com',
                password: 'password123',
            })
            .set('Authorization', `Bearer ${login_res.body.token}`);

        console.log('Update User Response:', response.body);

        expect(response.status).toBe(200);
    });

    it('should return error if user not found when updating', async () => {
        const login_res = await request(app).post('/api/login').send({
            email: newUser.email,
            password: newUser.password,
        });

        const userID = 3011;
        const response = await request(app)
            .put(`/api/updateUser/${userID}`)
            .send({
                fullname: 'Jane Doe',
                DOB: '2002-01-01',
                phoneNumber: '0987654321',
                email: 'janedoe@gmail.com',
                password: 'password123',
            })
            .set('Authorization', `Bearer ${login_res.body.token}`);

        expect(response.status).toBe(404);
    });
    it('should return user by Id', async () => {
        const login_res = await request(app).post('/api/login').send({
            email: newUser.email,
            password: newUser.password,
        });
        const userID = 302;

        const response = await request(app)
            .get(`/api/getUser/${userID}`)
            .set('Authorization', `Bearer ${login_res.body.token}`);

        console.log('Get User by ID Response:', response.body);

        expect(response.status).toBe(200);
    });

    it('should return error if user not found by Id', async () => {
        const login_res = await request(app).post('/api/login').send({
            email: newUser.email,
            password: newUser.password,
        });
        const userID = 999;

        const response = await request(app)
            .get(`/api/getUser/${userID}`)
            .set('Authorization', `Bearer ${login_res.body.token}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
    });

    it('should delete user', async () => {
        const login_res = await request(app).post('/api/login').send({
            email: newUser.email,
            password: newUser.password,
        });

        const userID = 327;

        const response = await request(app)
            .delete(`/api/deleteUser/${userID}`)
            .set('Authorization', `Bearer ${login_res.body.token}`);

        expect(response.status).toBe(200);
    });

    // it('should return error if user not found when deleting', async () => {
    //     const login_res = await request(app).post('/api/login').send({
    //         email: newUser.email,
    //         password: newUser.password,
    //     });

    //     const userID = 999;

    //     const response = await request(app)
    //         .delete(`/api/deleteUser/${userID}`)
    //         .set('Authorization', `Bearer ${login_res.body.token}`);

    //     expect(response.status).toBe(404);
    //     expect(response.body).toHaveProperty('message');
    // });
});
