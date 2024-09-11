import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Middleware: " + 123);
}

export const config = {
  matcher: "/login",
};
