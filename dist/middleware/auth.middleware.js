import jwt from "jsonwebtoken";
import User from "../models/User.models.js";
const protectRoute = async (req, res, next) => {
    try {
        // get token
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const token = authHeader.slice(7); // remove "Bearer "
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ message: "Server misconfiguration" });
        }
        const decoded = jwt.verify(token, secret);
        if (!decoded ||
            typeof decoded === "string" ||
            typeof decoded !== "object" ||
            !("userId" in decoded)) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const payload = decoded;
        // find the user
        const user = await User.findById(payload.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // attach user to request for downstream handlers
        req.user = user;
        return next();
    }
    catch (e) {
        console.log("Error in protectedRoute:", e);
        return res.status(401).json({ message: "Unauthorized" });
    }
};
export default protectRoute;
//# sourceMappingURL=auth.middleware.js.map