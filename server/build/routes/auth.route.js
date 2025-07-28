"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyPassStrength_1 = __importDefault(require("../middleware/verifyPassStrength"));
const verifyUserInformation_1 = __importDefault(require("../middleware/verifyUserInformation"));
const checkEmailAndUsernameReuse_1 = __importDefault(require("../middleware/checkEmailAndUsernameReuse"));
const verifyToken_1 = require("../middleware/verifyToken");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.get("/me", verifyToken_1.verifyToken, (req, res) => {
    res.json(req.user);
});
router.post("/register", verifyUserInformation_1.default, checkEmailAndUsernameReuse_1.default, verifyPassStrength_1.default, auth_controller_1.registerUser);
router.post("/login", auth_controller_1.loginUser);
router.post("/logout", verifyToken_1.verifyToken, auth_controller_1.logoutUser);
router.patch("/password", verifyToken_1.verifyToken, verifyPassStrength_1.default, auth_controller_1.updatePassword);
exports.default = router;
