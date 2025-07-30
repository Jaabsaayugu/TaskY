// import { JwtPayload } from "jsonwebtoken";

export interface UserPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  isDeleted: Boolean;
}

declare global {
  namespace Express {
    interface Request {
      user: UserPayload;
    }
  }
}
