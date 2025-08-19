import { NextResponse, type NextRequest } from "next/server";
import { decrypt } from "./lib/session";

export async function middleware(req: NextRequest) {
  // const curPathName = req.nextUrl.pathname; // /api/rooms
  // console.log("pathname", curPathName);
  // const headers = new Headers(req.headers);
  // headers.set("x-current-path", req.nextUrl.pathname);
  // return NextResponse.next({ headers });
  //   if(curPathName)
  const token = req.cookies.get("user");

  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    const jwt = await decrypt(token?.value);
    if (jwt?.role !== "STAFF" && jwt?.role !== "MANAGER") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (req.nextUrl.pathname == "/register") {
    const token = req.cookies.get("user");
    if (token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
}

export const config = {
  // matcher: "/login",
};
