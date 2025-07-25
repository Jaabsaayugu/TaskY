"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(
  (0, cors_1.default)({
    origin: ["http://localhost:5173", "https://blog-it-app-ruby.vercel.app"],
    methods: ["POST", "GET", "PATCH", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.get("/", (_req, res) => {
  res.send("<h1>Task-Y</h1>");
});
app.post("/auth/register", (req, res) => {
  res.send("Registering User");
});
// app.use("/api/auth", authRouter);
// app.use("/api/tasks", taskRouter);
// app.use("/api/user", userRouter);
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`TaskY app is running on ${port} `));
