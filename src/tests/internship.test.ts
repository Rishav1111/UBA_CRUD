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
describe("Internship API", () => {
  const newUser = {
    fullname: "John Doe",
    age: 25,
    phoneNumber: "1234567890",
    email: `john.doe.${Date.now()}@example.com`,
    password: "password123",
    role: [{ id: 1 }],
  };

  it("should create a new internship", async () => {
    const userResponse = await request(app)
      .post("/api/createUser")
      .send(newUser);
    console.log("User Creation Response:", userResponse.body);

    const login_res = await request(app).post("/api/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const newInternship = {
      joinedDate: "2024-06-03",
      completionDate: "2021-09-03",
      isCertified: true,
      mentorName: "John Doe",
      user: { id: 17 },
    };

    const response = await request(app)
      .post("/api/createInternship")
      .send(newInternship)
      .set("Authorization", `Bearer ${login_res.body.token}`);

    console.log("Create Internship Response:", response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("Internship created:");
  });

  it("should return all internships", async () => {
    const login_res = await request(app).post("/api/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const response = await request(app)
      .get("/api/getInternships")
      .set("Authorization", `Bearer ${login_res.body.token}`);

    console.log("Get Internships Response:", response.body);

    expect(response.status).toBe(200);
  });
});
