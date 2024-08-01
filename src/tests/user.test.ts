import "reflect-metadata";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../index.js";
import { TestDataSource } from "../db/data_soruce_test.js";
import { beforeEach } from "node:test";

beforeAll(async () => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
  }
  await TestDataSource.initialize();
});

afterAll(async () => {
  await TestDataSource.destroy();
});

describe("User API", () => {
  const newUser = {
    fullname: "John Doe",
    age: 25,
    phoneNumber: "1234567890",
    email: `john.doe.${Date.now()}@example.com`,
    password: "password123",
    role: [{ id: 1 }],
  };

  it("should create a new user", async () => {
    const response = await request(app).post("/api/createUser").send(newUser);

    console.log("Create User Response:", response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("User created:");
  });

  it("should return error if invalid email", async () => {
    const response = await request(app)
      .post("/api/createUser")
      .send({ ...newUser, email: "invalid-email" });

    console.log("Invalid Email Response:", response.body);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("should return error if email already exists", async () => {
    await request(app).post("/api/createUser").send(newUser);

    const response = await request(app).post("/api/createUser").send(newUser);

    console.log("Email Exists Response:", response.body);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message");
  });

  it("Get Users", async () => {
    await request(app).post("/api/createUser").send(newUser);

    const login_res = await request(app).post("/api/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const response = await request(app)
      .get("/api/getUsers")
      .set("Authorization", `Bearer ${login_res.body.token}`);

    console.log("Get Users Response:", response.body);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should return error if no token provided while getting users", async () => {
    const response = await request(app).get("/api/getUsers");

    console.log("No Token Provided Response:", response.body);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("should return error if invalid token provided while getting users", async () => {
    const response = await request(app)
      .get("/api/getUsers")
      .set("Authorization", `Bearer invalid-token`);

    console.log("Invalid Token Provided Response:", response.body);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("should return error if password is short", async () => {
    const response = await request(app)
      .post("/api/createUser")
      .send({
        ...newUser,
        password: "short",
      });

    console.log("Short Password Response:", response.body);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("should login user", async () => {
    await request(app).post("/api/createUser").send(newUser);

    const response = await request(app).post("/api/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    console.log("Login User Response:", response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should return error if user not found", async () => {
    const response = await request(app).post("/api/login").send({
      email: "invalid-email",
      password: "invalid-password",
    });

    console.log("User Not Found Response:", response.body);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
