import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import taskRouter from "./routes/task.route";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  // "http://localhost:5173",
  "https://task-y-nine.vercel.app",
];

app.use(
  cors({
    // origin: `https://task-y-nine.vercel.app/`,
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["POST", "GET", "PATCH", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.get("/", (_req, res) => {
  res.send("<h1>Task-Y</h1>");
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", message: "API is running" });
});

// app.post("/auth/register", (_req, res)=> {
//     res.send("Registering User");
// })
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/user", userRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`TaskY app is running on ${port} `));
