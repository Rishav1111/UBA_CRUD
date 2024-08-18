import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';

describe('Internship API', () => {
    const newUser = {
        fullname: 'John Doe',
        DOB: '2002-01-01',
        phoneNumber: '1234567890',
        email: `john.doe.${Date.now()}@example.com`,
        password: 'password123',
        role: [{ id: 1 }],
    };

    it('should create a new internship', async () => {
        const userResponse = await request(app)
            .post('/api/createUser')
            .send(newUser);
        console.log('User Creation Response:', userResponse.body);

        const login_res = await request(app).post('/api/login').send({
            email: newUser.email,
            password: newUser.password,
        });

        const newInternship = {
            joinedDate: '2024-06-03',
            completionDate: '2021-09-03',
            isCertified: true,
            mentorName: 'John Doe',
            user: { id: 301 },
        };

        const response = await request(app)
            .post('/api/createInternship')
            .send(newInternship)
            .set('Authorization', `Bearer ${login_res.body.token}`);

        console.log('Create Internship Response:', response.body);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('Internship created:');
    });

    it('should return error if user not found', async () => {
        const login_res = await request(app).post('/api/login').send({
            email: newUser.email,
            password: newUser.password,
        });

        const newInternship = {
            joinedDate: '2024-06-03',
            completionDate: '2021-09-03',
            isCertified: true,
            mentorName: 'John Doe',
            user: { id: 264 },
        };

        const response = await request(app)
            .post('/api/createInternship')
            .send(newInternship)
            .set('Authorization', `Bearer ${login_res.body.token}`);

        console.log('User Not Found Response:', response.body);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
    });

    it('should return all internships', async () => {
        const login_res = await request(app).post('/api/login').send({
            email: newUser.email,
            password: newUser.password,
        });

        const response = await request(app)
            .get('/api/getInternships')
            .set('Authorization', `Bearer ${login_res.body.token}`);

        console.log('Get Internships Response:', response.body);

        expect(response.status).toBe(200);
    });

    it('should return error if invalid date format', async () => {
        const login_res = await request(app).post('/api/login').send({
            email: newUser.email,
            password: newUser.password,
        });

        const newInternship = {
            joinedDate: '2024-06-03',
            completionDate: '2021-09-03',
            isCertified: true,
            mentorName: 'John Doe',
            user: { id: 264 },
        };

        const response = await request(app)
            .post('/api/createInternship')
            .send({ ...newInternship, joinedDate: 'invalid-date' })
            .set('Authorization', `Bearer ${login_res.body.token}`);

        console.log('Invalid Date Format Response:', response.body);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    it('should return error if no token provided while getting internships', async () => {
        const response = await request(app).get('/api/getInternships');

        console.log('No Token Provided Response:', response.body);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
    });

    it('should get an internship by id', async () => {
        const login_res = await request(app).post('/api/login').send({
            email: newUser.email,
            password: newUser.password,
        });

        const internshipId = 10;

        const response = await request(app)
            .get(`/api/getInternship/${internshipId}`)
            .set('Authorization', `Bearer ${login_res.body.token}`);

        console.log('Get Internship by ID Response:', response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
    });

    it('should update an internship by id', async () => {
        const login_res = await request(app).post('/api/login').send({
            email: newUser.email,
            password: newUser.password,
        });

        const internshipId = 10;

        const response = await request(app)
            .put(`/api/updateInternship/${internshipId}`)
            .set('Authorization', `Bearer ${login_res.body.token}`)
            .send({
                joinedDate: '2024-06-03',
                completionDate: '2021-09-03',
                isCertified: true,
                mentorName: 'John Doe',
                user: { id: 301 },
            });

        console.log('Update Internship by ID Response:', response.body);

        expect(response.status).toBe(200);
    });
});
