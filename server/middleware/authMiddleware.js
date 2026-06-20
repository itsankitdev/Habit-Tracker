import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  // 1. Check if the token is present in the request authorization headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Tokens are sent as: "Bearer eyJhbGciOi..." -> split by space and grab index 1
      token = req.headers.authorization.split(" ")[1];

      // 2. Decode and verify the token signature using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the user attached to this token and add their profile data to the request object
      // We explicitly exclude the password string from the query result for safety
      req.user = await User.findById(decoded.id).select("-password");

      // 4. Move to the next route controller function seamlessly
      return next();
    } catch (error) {
      console.error(`🔒 Auth middleware error: ${error.message}`);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token validation failed",
      });
    }
  }

  // 5. If no token was found in the headers at all
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }
};