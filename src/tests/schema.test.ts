// import { typeDefs } from "../graphql/schema";
// import { resolvers } from "../graphql/resolvers";
// import { ApolloServer } from "@apollo/server";
// import { expressMiddleware } from "@apollo/server/express4";
// import bodyParser from "body-parser";
// import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";

// const request = require("supertest");
// import express from "express";
// let app: express.Application;
// let server: ApolloServer;

// beforeAll(async () => {
//   app = express();
//   app.use(bodyParser.json());

//   server = new ApolloServer({
//     typeDefs,
//     resolvers,
//   });

//   await server.start();

//   app.use("/graphql", expressMiddleware(server)); //apollo-server-testing: Provides utilities like createTestClient to test your Apollo Server without needing an HTTP server.
//   // This allows you to simulate queries and mutations directly.
// });

// afterAll(async () => {
//   await server.stop();
// });

// describe("GraphQL", () => {
//   it("should return a user by ID", async () => {
//     const query = `
//         query {
//           user(id: "1") {
//             id
//             fullname
//             age
//             email
//           }
//         }
//       `;
//     const res = await request(app).post("/graphql").send({ query });
//     expect(res.body.data).toBeDefined();
//     expect(res.body.data.user).toHaveProperty("id", "1");
//   });

//   it("should return all users", async () => {
//     const query = `
//         query {
//           users {
//             id
//             fullname
//             age
//             email
//           }
//         }
//       `;
//     const res = await request(app).post("/graphql").send({ query });

//     expect(res.body.data).toBeDefined();
//     expect(res.body.data.users.length).toBeGreaterThan(0);
//   });

//   it("should return an error for a non-existing user ID", async () => {
//     const query = `
//         query {
//           user(id: "87") {
//             id
//             fullname
//             email
//             password
//           }
//         }
//       `;
//     const res = await request(app).post("/graphql").send({ query });
//     expect(res.body.errors).toBeDefined();
//     expect(res.body.errors[0].message).toBe("User not found");
//   });

//   // it("should sort users by fullname in ascending order by default", async () => {
//   //   const query = `
//   //     query {
//   //       userSort {
//   //         fullname
//   //         age
//   //         email
//   //       }
//   //     }
//   //   `;
//   //   const res = await request(app).post("/graphql").send({ query });
//   //   expect(res.body.data).toBeDefined();
//   //   expect(res.body.data.userSort).toEqual([
//   //     { fullname: "Alice", age: 22, email: "alice@gamil.com" },
//   //     { fullname: "Bob", age: 30, email: "bob@gamil.com" },
//   //   ]);
//   // });
//   it("should sort users by fullname in ascending order by default", async () => {
//     const query = `
//       query {
//         userSort {
//           fullname
//           age
//           email
//         }
//       }
//     `;
//     const res = await request(app).post("/graphql").send({ query });
//     expect(res.body.data).toBeDefined();
//     const sortedUsers = res.body.data.userSort;
//     expect(sortedUsers).toBeInstanceOf(Array);
//     for (let i = 0; i < sortedUsers.length - 1; i++) {
//       expect(
//         sortedUsers[i].fullname.toLowerCase() <=
//           sortedUsers[i + 1].fullname.toLowerCase()
//       ).toBe(true);
//     }
//   });
//   it("should sort users by email in ascending order", async () => {
//     const query = `
//       query {
//         userSort(sortField: "email", sortOrder: "asc") {
//           fullname
//           age
//           email
//         }
//       }
//     `;
//     const res = await request(app).post("/graphql").send({ query });
//     expect(res.body.data).toBeDefined();
//     const sortedUsers = res.body.data.userSort;
//     expect(sortedUsers).toBeInstanceOf(Array);
//     for (let i = 0; i < sortedUsers.length - 1; i++) {
//       expect(
//         sortedUsers[i].email.toLowerCase() <=
//           sortedUsers[i + 1].email.toLowerCase()
//       ).toBe(true);
//     }
//   });

//   it("should paginate users correctly", async () => {
//     const query = `
//       query {
//         userSort(sortField: "fullname", sortOrder: "asc", offset: 1, limit: 3) {
//           fullname
//           email
//         }
//       }
//     `;
//     const res = await request(app).post("/graphql").send({ query });
//     expect(res.body.data).toBeDefined();
//     const paginatedUsers = res.body.data.userSort;
//     expect(paginatedUsers).toHaveLength(3);
//   });

//   it("should create a new user", async () => {
//     const mutation = `
//       mutation {
//         addUser(user: {fullname: "Alice", age: 22, email: "alice@gmail.com", phoneNumber: "1112223334", password: "password789"}) {
//           id
//           fullname
//           age
//           email
//           phoneNumber
//           password
//         }
//       }
//     `;

//     const res = await request(app).post("/graphql").send({ query: mutation });

//     expect(res.status).toBe(200);
//     expect(res.body.data).toBeDefined();
//     expect(res.body.data.addUser).toEqual(
//       expect.arrayContaining([
//         expect.objectContaining({
//           fullname: "Alice",
//           age: 22,
//           email: "alice@gmail.com",
//           phoneNumber: "1112223334",
//           password: "password789",
//         }),
//       ])
//     );
//   });

//   it("should update an existing user", async () => {
//     const mutation = `
//         mutation {
//             updateUser(id: "1", edits: {fullname: "Alice", age: 25, email: "alice@gmail.com", phoneNumber: "1112223334", password: "password789"}) {
//             id
//             fullname
//             age
//             email
//             phoneNumber
//             password
//             }
//         }
//         `;
//     const res = await request(app).post("/graphql").send({ query: mutation });
//     expect(res.status).toBe(200);
//     expect(res.body.data).toBeDefined();
//     expect(res.body.data.updateUser).toEqual(
//       expect.objectContaining({
//         fullname: "Alice",
//         age: 25,
//         email: "alice@gmail.com",
//         phoneNumber: "1112223334",
//         password: "password789",
//       })
//     );
//   });

//   it("should return an error for updating a non-existing user ID", async () => {
//     const mutation = `
//         mutation {
//             updateUser(id: "87", edits: {fullname: "Alice", age: 25, email: "alice@gmail.com", phoneNumber: "1112223334", password: "password789"}) {
//             id
//             fullname
//             age
//             email
//             phoneNumber
//             password
//             }
//         }
//         `;
//     const res = await request(app).post("/graphql").send({ query: mutation });
//     expect(res.body.errors).toBeDefined();
//     expect(res.body.errors[0].message).toBe("User not found");
//   });

//   it("should delete a user by ID", async () => {
//     const mutation = `
//         mutation {
//             deleteUser(id: "1") {
//             id
//             fullname
//             age
//             email

//             }
//         }
//         `;
//     const res = await request(app).post("/graphql").send({ query: mutation });
//     expect(res.status).toBe(200);
//     expect(res.body.data).toBeDefined();
//     expect(res.body.data).toHaveProperty("deleteUser");
//   });
// });
