import express from "express";
import cors from "cors";
import { router } from "./routes/router.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.get("/", (req, res) => {}); // need to server static frontend asset

export default app;
