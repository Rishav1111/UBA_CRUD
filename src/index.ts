// src/index.t
import "reflect-metadata";
import express, { Application } from "express";
import { AppDataSource } from "./db/data_source";
import Routes from "./routes/index_Routes";
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { typeDefs } = require("./graphql/schema");
const { resolvers } = require("./graphql/resolvers");
const { createConnection } = require("typeorm");

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

const app: Application = express();
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
