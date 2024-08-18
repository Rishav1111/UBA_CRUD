import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';

describe('Roles API', async () => {
    it('should create a new role', async () => {
        const login_res = await request(app).post('/api/login').send({
            email: 'admin@example.com',
            password: 'admin1234',
        });

        console.log('Login Response:', login_res.body);

        const response = await request(app)
            .post('/api/createRole')
            .set('Authorization', `Bearer ${login_res.body.token}`)
            .send({
                name: 'user',
            });

        expect(response.status).toBe(201);
    });

    it('should return error if role name is not provided', async () => {
        const login_res = await request(app).post('/api/login').send({
            email: 'admin@example.com',
            password: 'admin1234',
        });

        const response = await request(app)
            .post('/api/createRole')
            .set('Authorization', `Bearer ${login_res.body.token}`)
            .send({});
        expect(response.status).toBe(400);
    });
});
