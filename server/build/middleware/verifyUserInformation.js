"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function verifyUserInformation(req, res, next) {
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
exports.default = verifyUserInformation;
