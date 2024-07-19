// // userController.test.ts
// import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
// const request = require("supertest");
// import express from "express";

// import fs from "fs";
// import { app } from "../../src/index";

// // Simple mock for fs
// vi.mock("fs");

// describe("Users control", () => {

//   // Test getUsers
//   it("should return all users", async () => {
//     const res = await request(app).get("/api/getUsers");
//     expect(res.status).toBe(200);
//     expect(res.body).toEqual(users);
//   });

//   // Test getUserByID
//   it("should return user by ID", async () => {
//     const res = await request(app).get("/api/getUser/1");
//     expect(res.status).toBe(200);
//     expect(res.body).toEqual(users[0]);
//   });

//   it("should return 404 for a non-existing user ID", async () => {
//     const res = await request(app).get("/api/getUser/999");
//     expect(res.status).toBe(404);
//     expect(res.body).toEqual({ message: "User not found" });
//   });

//   // Test createUser
//   it("should create a new user successfully", async () => {
//     const response = await request(app).post("/api/createUser").send({
//       fullname: "Rishav Shrestha",
//       age: 21,
//       phoneNumber: "1234567890",
//       email: "rishav@example.com",
//       password: "password123",
//     });

//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty("User created:");
//   });

//   it("should fail to create a user with invalid data", async () => {
//     const response = await request(app).post("/api/createUser").send({
//       fullname: "Jo",
//       age: 30,
//       phoneNumber: "1234567890",
//       email: "invalid-email",
//       password: "pass",
//     });

//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty("message");
//   });

//   it("should fail to update a user with invalid data", async () => {
//     const response = await request(app).put("/api/updateUser/1").send({
//       fullname: "Jo",
//       age: 30,
//       phoneNumber: "1234567890",
//       email: "invalid-email",
//       password: "pass",
//     });

//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty("message");
//   });
//   // it("should return 409 if email already exists", async () => {
//   //   const existingUser = {
//   //     id: 2,
//   //     fullname: "Alice",
//   //     age: 22,
//   //     phoneNumber: "1112223334",
//   //     email: "alice@gmail.com",
//   //     password: "password789",
//   //   };

//   //   const res = await request(app).post("/api/createUser").send(existingUser);

//   //   expect(res.status).toBe(409);
//   //   expect(res.body).toEqual({
//   //     message: "User with same email already exists",
//   //   });
//   // });

//   // Test createUser with missing required fields
//   it("should return 400 if required fields are missing", async () => {
//     const incompleteUser = {
//       fullname: "Bob",
//       age: 30,
//       phoneNumber: "1234567890",
//       email: "bob@example.com",
//     };

//     const res = await request(app).post("/api/createUser").send(incompleteUser);

//     expect(res.status).toBe(400);
//     expect(res.body).toEqual({ message: '"password" is required' });
//   });

//   it("should update user by their ID", async () => {
//     const res = await request(app).put("/api/updateUser/1").send({
//       fullname: "Alice",
//       age: 25,
//       email: "alice@gmail.com",
//       phoneNumber: "1112223334",
//       password: "password789",
//     });
//     expect(res.status).toBe(200);
//     expect(res.body).toEqual(
//       expect.objectContaining({
//         fullname: "Alice",
//         age: 25,
//         email: "alice@gmail.com",
//         phoneNumber: "1112223334",
//         password: "password789",
//       })
//     );
//   });

//   it("should return 404 for updating a non-existing user ID", async () => {
//     const res = await request(app).put("/api/updateUser/999").send({
//       fullname: "Alice",
//       age: 25,
//       email: "alice@gmail.com",
//       phoneNumber: "1112223334",
//       password: "password789",
//     });
//     expect(res.status).toBe(404);
//     expect(res.body).toEqual({ message: "User not found" });
//   });

//   //Test case for deleting users
//   it("should delete user by ID", async () => {
//     const res = await request(app).delete("/api/deleteUser/1");
//     expect(res.status).toBe(200);
//     expect(res.body).toEqual({ message: "User deleted" });
//     expect(users.length).toBe(1);
//   });

//   it("should return 404 for deleting a non-existing user ID", async () => {
//     const res = await request(app).delete("/api/deleteUser/999");
//     expect(res.status).toBe(404);
//     expect(res.body).toEqual({ message: "User not found" });
//   });
// });
