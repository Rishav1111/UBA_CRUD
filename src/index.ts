import 'reflect-metadata';
import express, { Application } from 'express';
import { AppDataSource } from './db/data_source';
import Routes from './routes/index_Routes';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

// Initialize Apollo Server
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// async function startApolloServer() {
//   const { url } = await startStandaloneServer(server, {
//     listen: { port: 9000 },
//   });
//   console.log(`Apollo server running at ${url}graphql`);
// }
// startApolloServer();

export const app: Application = express();

// Use CORS middleware before defining routes
app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
);

app.use(express.json());

// Use user routes
app.use('/api', Routes);
app.use(cookieParser());

const PORT = process.env.PORT ?? 3000;

AppDataSource.initialize().then(() => {
    console.log('Data Source has been initialized!');

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
