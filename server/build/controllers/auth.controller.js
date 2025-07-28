"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword =
  exports.logoutUser =
  exports.loginUser =
  exports.registerUser =
    void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
const registerUser = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { firstName, lastName, email, username, password } = req.body;
      const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
      const newUser = yield client.user.create({
        data: {
          firstName,
          lastName,
          email,
          username,
          password: hashedPassword,
          // avatar: null,
          dateJoined: new Date(),
          lastUpdate: new Date(),
          isDeleted: false,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          username: true,
          // avatar: true,
          dateJoined: true,
          lastUpdate: true,
          isDeleted: true,
        },
      });
      res.status(201).json({
        message: "User Created Successfully",
        user: newUser,
      });
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ message: "Something Went Wrong! Try again Later!" });
    }
  });
exports.registerUser = registerUser;
const loginUser = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { identifier, password } = req.body;
      if (!identifier || !password) {
        res
          .status(400)
          .json({ message: "You Entered Wrong Login Credentials" });
        return;
      }
      const user = yield client.user.findFirst({
        where: {
          AND: [
            { isDeleted: false },
            {
              OR: [{ username: identifier }, { email: identifier }],
            },
          ],
        },
        select: {
          id: true,
          email: true,
          username: true,
          password: true,
          firstName: true,
          lastName: true,
          dateJoined: true,
          lastUpdate: true,
          isDeleted: true,
        },
      });
      if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
      }
      const passAuth = yield bcryptjs_1.default.compare(
        password,
        user.password,
      );
      if (!passAuth) {
        res
          .status(400)
          .json({ message: "You Entered Wrong Login Credentials" });
        return;
      }
      const { password: loginPassword } = user,
        userDetails = __rest(user, ["password"]);
      const token = jsonwebtoken_1.default.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );
      res
        .cookie("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({
          message: "Login successful",
          user: userDetails,
          token,
        });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Bad request" });
    }
  });
exports.loginUser = loginUser;
const logoutUser = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.json({ message: "Logged out successfully" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Something went wrong during logout" });
    }
  });
exports.logoutUser = logoutUser;
const updatePassword = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    try {
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        res.status(400).json({
          message:
            "Current password, new password, and confirm password are required",
        });
        return;
      }
      if (newPassword !== confirmNewPassword) {
        res.status(400).json({ message: "New passwords do not match" });
        return;
      }
      const user = yield client.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, password: true, isDeleted: true },
      });
      if (!user || user.isDeleted) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const validCurrentPassword = yield bcryptjs_1.default.compare(
        currentPassword,
        user.password,
      );
      if (!validCurrentPassword) {
        res.status(400).json({ message: "Incorrect current password" });
        return;
      }
      const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, 10);
      yield client.user.update({
        where: { id: req.user.id },
        data: {
          password: hashedNewPassword,
          lastUpdate: new Date(),
        },
      });
      res.json({ message: "Password updated successfully" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Failed to update password" });
    }
  });
exports.updatePassword = updatePassword;
