import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "fallback-secret-key";

export const signJwt = (userId: string): string => {
  return jwt.sign({ userId }, SECRET_KEY, {
    expiresIn: "30m",
    algorithm: "HS256",
  });
};

export const verifyJwt = (token: string): JwtPayload | string => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
