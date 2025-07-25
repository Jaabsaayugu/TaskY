import { Router } from "express";
import verifyPasswordStrength from "../middleware/verifyPassStrength";
import verifyUserInformation from "../middleware/verifyUserInformation";
import checkUsernameAndEmailReuse from "../middleware/checkEmailAndUsernameReuse";
import { verifyToken } from "../middleware/verifyToken";
import {
  registerUser,
  loginUser,
  logoutUser,
  updatePassword,
} from "../controllers/auth.controller";

const router: Router = Router();

// POST /api/auth/register - Register a new user
router.post(
  "/register",
  verifyUserInformation,
  checkUsernameAndEmailReuse,
  verifyPasswordStrength,
  registerUser,
);

// POST /api/auth/login - Login a user
router.post("/login", loginUser);

// POST /api/auth/logout - Logout a user
router.post("/logout", verifyToken, logoutUser);

// PATCH /api/auth/password - Update a specific user's password
router.patch("/password", verifyToken, verifyPasswordStrength, updatePassword);

export default router;
