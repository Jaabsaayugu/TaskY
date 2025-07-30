// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import authRouter from "./routes/auth.route";
// import userRouter from "./routes/user.route";
// import taskRouter from "./routes/task.route";

// dotenv.config();

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// const allowedOrigins = [
//   // "http://localhost:5173",
//   "https://task-y-nine.vercel.app",
// ];

// app.use(
//   cors({
//     // origin: `https://task-y-nine.vercel.app/`,
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: ["POST", "GET", "PATCH", "PUT", "DELETE"],
//     credentials: true,
//   }),
// );

// app.get("/", (_req, res) => {
//   res.send("<h1>Task-Y</h1>");
// });

// app.get("/api/health", (_req, res) => {
//   res.json({ status: "OK", message: "API is running" });
// });

// // app.post("/auth/register", (_req, res)=> {
// //     res.send("Registering User");
// // })
// app.use("/api/auth", authRouter);
// app.use("/api/tasks", taskRouter);
// app.use("/api/user", userRouter);

// const port = process.env.PORT || 4000;
// app.listen(port, () => console.log(`TaskY app is running on ${port} `));
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import taskRouter from "./routes/task.route";

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://task-y-nine.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    optionsSuccessStatus: 200, 
  }),
);

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

app.get("/", (_req, res) => {
  res.json({ 
    message: "Task-Y API Server",
    status: "running",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ 
    status: "OK", 
    message: "API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/user", userRouter);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ 
      error: "CORS Error", 
      message: "Origin not allowed" 
    });
  }
  
  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === 'development' ? err.message : "Something went wrong",
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Task-Y API server is running on port ${port}`);
  console.log(`📱 Allowed origins: ${allowedOrigins.join(', ')}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});