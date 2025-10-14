import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import taskRoutes from "./routes/taskRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import "./models/Task";
import "./models/Subtask";
import subtaskRoutes from "./routes/subtaskRoutes";
import googleAuthRoutes from "./routes/googleAuthRoutes";
import userRoutes from "./routes/userRoutes";
import calendarRoutes from "./routes/calendarRoutes";
import calendarSyncRoutes from "./routes/calendarSyncRoutes";
import geminiRoutes from "./routes/geminiRoutes";
import path from "path";

const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

const rootDir = path.resolve();

app.use("/auth/google", googleAuthRoutes);
app.use("/api/google/events", calendarRoutes);
app.use("/api/google/sync", calendarSyncRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/subtasks", subtaskRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/gemini", geminiRoutes);

app.use(express.static(path.join(rootDir, "../frontend", "build")));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    res.status(404).send("API route not found");
    return;
  }
  res.sendFile(path.join(rootDir, "../frontend", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
