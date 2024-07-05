// src/index.ts
import express, { Application } from "express";
import bodyParser from "body-parser";
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
    listen: { port: 9000 },
  });
  console.log(`Apollo server running at ${url}graphql`);
}

startApolloServer();

export const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Use user routes
app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
