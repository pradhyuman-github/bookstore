export const admin = (req, res, next) => {
    try {
        if(req.user.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required"
            });
        }
        next();
    }
    catch(err) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};