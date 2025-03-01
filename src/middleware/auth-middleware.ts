import jwt, { Secret } from "jsonwebtoken";
import { MYENV } from "../config/environment";
import { NextFunction, Request, Response } from "express";

export const SECRET_KEY: Secret = MYENV.JWT_SCRET;

export interface CustomRequest extends Request {
  authorId: number;
}

interface JwtPayload {
  role: string;
  id: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("invalid token");
    }

    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    if (decoded.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }
    req.body.authorId = decoded.id;

    next();
  } catch (err) {
    res.status(401).json({ errors: (err as Error).message });
  }
};
