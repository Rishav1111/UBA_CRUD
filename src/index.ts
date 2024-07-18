import "reflect-metadata";
// src/index.ts
import { createConnection } from "typeorm";
import express, { Application } from "express";
import userRoutes from "./routes/userRoutes";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";

//Graphql server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startApolloServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 8000 },
  });
  console.log(`Apollo server running at ${url}graphql`);
}

startApolloServer();

export const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Use user routes

createConnection()
  .then(() => {
    app.use("/api", userRoutes);
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
