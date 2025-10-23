import jwt, { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import User from "../models/User.models.js";

interface TokenPayload extends JwtPayload {
  userId: string;
}

interface AuthRequest extends Request {
  user?: unknown;
}

const protectRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // get token
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.slice(7); // remove "Bearer "

    const secret = process.env.JWT_SECRET as string | undefined;
    if (!secret) {
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const decoded = jwt.verify(token, secret);

    if (
      !decoded ||
      typeof decoded === "string" ||
      typeof decoded !== "object" ||
      !("userId" in decoded)
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = decoded as TokenPayload;

    // find the user
    const user = await User.findById(payload.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // attach user to request for downstream handlers
    req.user = user;

    return next();
  } catch (e: any) {
    console.log("Error in protectedRoute:", e);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default protectRoute;
