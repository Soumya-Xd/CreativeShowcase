import jwt from "jsonwebtoken";

/* ===========================
   OPTIONAL AUTH (SAFE)
   For public routes
=========================== */
export const optionalAuth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    req.userId = null;
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    req.userId = decoded.userId;
    next();
  } catch {
    req.userId = null;
    next();
  }
};

/* ===========================
   REQUIRED AUTH (STRICT)
   For protected routes
=========================== */
export const requireAuth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token." });
  }
};
