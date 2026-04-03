import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";

const runtimeJwtSecret = process.env.JWT_SECRET?.trim() || randomBytes(32).toString("hex");

function authError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function getSecret() {
  return runtimeJwtSecret;
}

function extractToken(req) {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) {
    return header.slice(7).trim();
  }
  if (typeof req.query.token === "string" && req.query.token.trim()) {
    return req.query.token.trim();
  }
  return "";
}

export function createToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      specialty: user.specialty
    },
    getSecret(),
    { expiresIn: "7d" }
  );
}

export function authenticate(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      throw authError(401, "Authentication is required");
    }
    const payload = jwt.verify(token, getSecret());
    const user = req.store.getUserById(payload.sub);
    if (!user) {
      throw authError(401, "Your session is no longer valid");
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    error.message = error.message || "Authentication is required";
    next(error);
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(authError(403, "You do not have access to this action"));
      return;
    }
    next();
  };
}
