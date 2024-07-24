import "reflect-metadata";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../index"; // Import the app from your index file
import { TestDataSource } from "../db/data_soruce_test"; // Corrected to data_source_test
import { User } from "../entity/User";

describe("User API", () => {
  beforeAll(async () => {
    // Initialize database
    await TestDataSource.initialize();
  });

  afterAll(async () => {});

  it("should create a new user", async () => {
    const newUser = {
      fullname: "John Doe",
      age: 25,
      phoneNumber: "1234567890",
      email: `john.doe.${Date.now()}@example.com`, // Ensure unique email
      password: "password123",
    };

    const response = await request(app)
      .post("/api/createUser") // Adjust the route as per your API
      .send(newUser);

    console.log("Create User Response:", response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("User created:");
  });

  it("should return all users", async () => {
    const response = await request(app).get("/api/getUsers");

    console.log("Get Users Response:", response.body);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  //get users by id
  // it("should return a user by id", async () => {
  //   const userRepo = TestDataSource.getRepository(User);
  //   const user = await userRepo.findOne({ where: { id: 1 } });

  //   const response = await request(app).get(`/api/getUser/1`);

  //   console.log("Get User By ID Response:", response.body);

  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty("id", 1);
  // });
});
