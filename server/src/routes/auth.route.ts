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

router.get("/me", verifyToken, (req, res) => {
  res.json(req.user);
});


router.post(
  "/register",
  verifyUserInformation,
  checkUsernameAndEmailReuse,
  verifyPasswordStrength,
  registerUser,
);

router.post("/login", loginUser);
router.post("/logout", verifyToken, logoutUser);

router.patch("/password", verifyToken, verifyPasswordStrength, updatePassword);

export default router;
