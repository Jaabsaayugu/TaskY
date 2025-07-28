import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import taskRouter from "./routes/task.route";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "*****frontend deployed****"],
    methods: ["POST", "GET", "PATCH", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.get("/", (_req, res) => {
  res.send("<h1>Task-Y</h1>");
});

// app.post("/auth/register", (_req, res)=> {
//     res.send("Registering User");
// })
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/user", userRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`TaskY app is running on ${port} `));
