import jwt from "jsonwebtoken";

export function verifyToken(event) {
  const cookie = event.headers.cookie || event.headers.Cookie || "";

  console.log("Cookies received:", cookie); // debug line

  const match = cookie.match(/token=([^;]+)/);
  if (!match) return null;

  try {
    const decoded = jwt.verify(match[1], process.env.JWT_SECRET);
    return decoded.userId;
  } catch (err) {
    console.log("JWT error:", err.message);
    return null;
  }
}
