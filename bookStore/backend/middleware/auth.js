import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log("token: ", token);

        if(!token) {
            return res.status(401).json({
                message: "Unauthorized, No token"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_TOKEN
        );
        console.log("decoded: ", decoded);

        req.user = decoded;

        next();
    }
    catch(err) {
        console.log("JWT error: ", err.message);
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};
