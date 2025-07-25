import { Request, Response, NextFunction } from "express";
import zxcvbn from "zxcvbn";
function verifyPasswordStrength(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { password } = req.body;
  const result = zxcvbn(password);
  if (result.score < 3) {
    res.status(400).json({ message: " Please Use a Stronger Password" });
    return;
  }
  next();
}
export default verifyPasswordStrength;
