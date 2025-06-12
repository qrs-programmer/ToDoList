import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import taskRoutes from "./routes/taskRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import "./models/Task";
import "./models/Subtask";
import subtaskRoutes from "./routes/subtaskRoutes";

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);
app.use("/api/subtasks", subtaskRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req: any, res: any) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
