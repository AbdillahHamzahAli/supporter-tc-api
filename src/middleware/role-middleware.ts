import { UserRequest } from "../type/user-request";
import { Response, NextFunction } from "express";

export const RoleMiddleware = (roles: String[]) => {
  return (req: UserRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };
};
