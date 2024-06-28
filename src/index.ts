// src/index.ts
import express, { Application } from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Use user routes
app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
