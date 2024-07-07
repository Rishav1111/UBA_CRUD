// userController.test.ts
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  afterAll,
} from "vitest";
const request = require("supertest");
import express from "express";
import { typeDefs } from "../graphql/schema";
import { resolvers } from "../graphql/resolvers";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import fs from "fs";
import { users } from "../controllers/user";
import {
  createUser,
  getUserByID,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/user";

const app = express();
app.use(express.json());

app.get("/api/getUsers", getUsers);
app.get("/api/getUser/:id", getUserByID);
app.post("/api/createUser", createUser);
app.put("/api/updateUser/:id", updateUser);
app.delete("/api/deleteUser/:id", deleteUser);

const createTestServer = () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  return server.start().then(() => {
    app.use("/graphql", expressMiddleware(server));
    return app;
  });
};
// Simple mock for fs
vi.mock("fs");

describe("Users control", () => {
  beforeEach(() => {
    // Reset users array and mock fs
    users.length = 0;
    users.push(
      {
        id: 1,
        fullname: "Alice",
        age: 22,
        phoneNumber: "1112223334",
        email: "alice@gmail.com",
        password: "password789",
      },
      {
        id: 2,
        fullname: "Bob",
        age: 30,
        phoneNumber: "5556667778",
        email: "bob@gmail.com",
        password: "password123",
      }
    );
    vi.clearAllMocks();
    vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Test getUsers
  it("should return all users", async () => {
    const res = await request(app).get("/api/getUsers");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(users);
  });

  // Test getUserByID
  it("should return user by ID", async () => {
    const res = await request(app).get("/api/getUser/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(users[0]);
  });

  it("should return 404 for a non-existing user ID", async () => {
    const res = await request(app).get("/api/getUser/999");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "User not found" });
  });

  // Test createUser
  it("should return 201 if a new user is created", async () => {
    const newUser = {
      id: 3,
      fullname: "rishav",
      age: 22,
      phoneNumber: "1112223334",
      email: "rishav@example.com",
      password: "password789",
    };
    const res = await request(app).post("/api/createUser").send(newUser);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ "User created:": newUser });
    expect(users.length).toBe(3);
  });
  // Test createUser with existing email
  it("should return 409 if email already exists", async () => {
    const existingUser = {
      id: 2,
      fullname: "Alice",
      age: 22,
      phoneNumber: "1112223334",
      email: "alice@gmail.com",
      password: "password789",
    };

    const res = await request(app).post("/api/createUser").send(existingUser);

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

  it("should update user by ID", async () => {
    const updatedUser = {
      fullname: "Alice Doe",
    };

    const res = await request(app).put("/api/updateUser/1").send(updatedUser);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      "User updated": { ...users[0], ...updatedUser },
    });
    expect(users[0].fullname).toBe("Alice Doe");
  });

  it("should not update a user with a duplicate email", async () => {
    const updatedUser = { email: "alice@gmail.com" };
    const res = await request(app).put("/api/updateUser/2").send(updatedUser);

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      message: "User with same email already exists",
    });
  });

  it("should return 404 for updating a non-existing user ID", async () => {
    const updatedUser = { fullname: "Alice Doe" };
    const res = await request(app).put("/api/updateUser/999").send(updatedUser);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "User not found" });
  });

  //Test case for deleting users
  it("should delete user by ID", async () => {
    const res = await request(app).delete("/api/deleteUser/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "User deleted" });
    expect(users.length).toBe(1);
  });
});

describe("GraphQL", () => {
  let app: express.Express;

  beforeEach(async () => {
    app = await createTestServer();
  });

  it("should return a user by ID", async () => {
    const query = `
      query {
        user(id: "1") {
          id
          fullname
          age
          email
        }
      }
    `;
    const res = await request(app).post("/graphql").send({ query });
    expect(res.body.data).toBeDefined();
    expect(res.body.data.user).toHaveProperty("id", "1");
  });

  it("should return all users", async () => {
    const query = `
      query {
        users {
          id
          fullname
          age
          email
        }
      }
    `;
    const res = await request(app).post("/graphql").send({ query });
    expect(res.body.data).toBeDefined();
    expect(res.body.data.users.length).toBeGreaterThan(0);
  });

  it("should return an error for a non-existing user ID", async () => {
    const query = `
      query {
        user(id: "87") {
          id
          fullname
          email
          password
        }
      }
    `;
    const res = await request(app).post("/graphql").send({ query });
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toBe("User not found");
  });
});
