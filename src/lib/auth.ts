"use server";

import bcrypt from "bcrypt";
import { cookies } from "next/headers";

// Chuyển mật khẩu bằng hash Bcrypt
export const hashedPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

export default async function isAuthenticated() {
  const session = cookies().get("login")?.value;
  console.log("session: " + session);

  return session != null ? session : null;
}

export async function logOut() {
  if (cookies().has("login")) cookies().delete("login");
}
// bcrypt.compare('113446', '$2a$10$fUor9jOu5QrGL195fKp2Tesu8R0NZslAOobnA1VvtpVqmIvZk1W4m').then(value => console.log("brypt compare: " + value));
