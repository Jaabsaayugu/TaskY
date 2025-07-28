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
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const task_route_1 = __importDefault(require("./routes/task.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(
  (0, cors_1.default)({
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
app.use("/api/auth", auth_route_1.default);
app.use("/api/tasks", task_route_1.default);
app.use("/api/user", user_route_1.default);
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`TaskY app is running on ${port} `));
