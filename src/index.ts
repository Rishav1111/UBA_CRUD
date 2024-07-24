// src/index.t
import "reflect-metadata";
import express, { Application } from "express";
import { AppDataSource } from "./db/data_source";
import Routes from "./routes/index_Routes";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { createConnection } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

//Graphql server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startApolloServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 9000 },
  });
  console.log(`Apollo server running at ${url}graphql`);
}

startApolloServer();

export const app: Application = express();
app.use(express.json());

// Use user routes
app.use("/api", Routes);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
