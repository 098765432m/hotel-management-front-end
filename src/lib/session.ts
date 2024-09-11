import { jwtVerify, SignJWT } from "jose";
import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

const SESSION_SECRET_KEY = process.env.SESSION_SECRET;
const encodeKey = new TextEncoder().encode(SESSION_SECRET_KEY);

interface SessionPayload extends JwtPayload {
  userId: string;
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodeKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodeKey, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
}

export async function createSession(userId: string) {
  const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({
    userId: userId,
    exp: Math.floor(expireAt.getTime()),
  });

  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expireAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession() {
  const session = cookies().get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const exportAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    expires: exportAt,
    sameSite: "lax",
    path: "/",
  });
}
