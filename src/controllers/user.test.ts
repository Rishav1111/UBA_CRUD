// userController.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
const request = require("supertest");
import { app } from "../index";
import fs from "fs";
import { User } from "../model/userModel";
import { users } from "../controllers/user";
// Simple mock for fs
vi.mock("fs");

const newUser: User = {
  id: 1,
  fullname: "Alice",
  age: 22,
  phoneNumber: "1112223334",
  email: "alice@example.com",
  password: "password789",
};
describe("Create Users", () => {
  // Test createUser
  it("should return 201 if a new user is created", async () => {
    const res = await request(app).post("/api/createUser").send(newUser);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ "User created:": newUser });
  });
  // Test createUser with existing email
  it("should return 409 if email already exists", async () => {
    const existingUser: User = {
      id: 2,
      fullname: "Jane Doe",
      age: 25,
      phoneNumber: "0987654321",
      email: "jane@example.com",
      password: "securepassword",
    };

    users.push(existingUser);
    const newUserWithSameEmail = {
      fullname: "John Doe",
      age: 30,
      phoneNumber: "1234567890",
      email: "jane@example.com",
      password: "password123",
    };

    const res = await request(app)
      .post("/api/createUser")
      .send(newUserWithSameEmail);

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      message: "User with same email already exists",
    });
  });
  // Test createUser with missing required fields
  it("should return 400 if required fields are missing", async () => {
    const incompleteUser = {
      fullname: "Bob",
      age: 30,
      phoneNumber: "1234567890",
      email: "bob@example.com",
    };

    const res = await request(app).post("/api/createUser").send(incompleteUser);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "All fields are required" });
  });
});

describe("Get Users", () => {
  // Test getUsers
  it("should return all users", async () => {
    const res = await request(app).get("/api/getUsers");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ Users: users });
  });
  // Test getUserByID
  it("should return user by ID", async () => {
    const res = await request(app).get("/api/getUser/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(newUser);
  });

  // Test getUserByID with invalid ID
  it("should return 404 if user not found", async () => {
    const res = await request(app).get("/api/getUser/100");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "User not found" });
  });
});

// describe("Update Users", () => {
//   it("should update user by ID", async () => {
//     const existingUser: User = {
//       id: 1,
//       fullname: "Alice",
//       age: 22,
//       phoneNumber: "1112223334",
//       email: "alice@gmail.com",
//       password: "password789",
//     };

//     const updatedUser: User = {
//       id: 1,
//       fullname: "Alice Doe",
//       age: 25,
//       phoneNumber: "1234567890",
//       email: "alice@gmail.com",
//       password: "password123",
//     };

//     const res = await request(app).put("/api/updateUser/1").send(updatedUser);
//     expect(res.status).toBe(200);
//     expect(res.body).toEqual({ "User updated:": updatedUser });
//   });
// });
