import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log(req.nextUrl.pathname);
  // const curPathName = req.nextUrl.pathname; // /api/rooms
  //   if(curPathName)
}

export const config = {
  // matcher: "/login",
};
