import jwt from "jsonwebtoken";
import { User } from "../models/registerModel.js";

export const auth = async(req, res, next) => {
    try {
        const token = req.cookies?.token;

        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized (no token)"
            });
        }

        const decoded = jwt.verify( token, process.env.JWT_TOKEN );

        const user = await User.findById(decoded.userId).select("-createPassword");

        if (!user) {
            return res.status(401).json({ 
                message: "User not found" 
            });
        }

        req.user = user;

        next();
    }
    catch(err) {
        console.log("JWT error: ", err.message);
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};
