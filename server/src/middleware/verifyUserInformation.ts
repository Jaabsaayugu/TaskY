import { Request, Response, NextFunction } from "express";
function verifyUserInformation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { firstName, lastName, email, username, password } = req.body;

  if (!firstName) {
    res.status(400).json({ message: "First Name is Required" });
    return;
  }
  if (!lastName) {
    res.status(400).json({ message: "Last Name is Required" });
    return;
  }
  if (!username) {
    res.status(400).json({ message: "Username is Required" });
    return;
  }
  if (!email) {
    res.status(400).json({ message: "Email Address is Required" });
    return;
  }
  if (!password) {
    res.status(400).json({ message: "Password is Required" });
    return;
  }
  next();
}
export default verifyUserInformation;
