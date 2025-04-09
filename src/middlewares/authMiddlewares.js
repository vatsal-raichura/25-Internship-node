const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const Role = require("../models/RoleModel");

const verifyBusiness = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).populate("role"); // Populate role details

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user has business role
        if (user.role.name !== "business") {
            return res.status(403).json({ message: "Access denied: Not a business account" });
        }

        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = { verifyBusiness };
