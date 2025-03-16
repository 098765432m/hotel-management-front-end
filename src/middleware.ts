import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // const curPathName = req.nextUrl.pathname; // /api/rooms
  // console.log("pathname", curPathName);
  // const headers = new Headers(req.headers);
  // headers.set("x-current-path", req.nextUrl.pathname);
  // return NextResponse.next({ headers });
  //   if(curPathName)
}

export const config = {
  // matcher: "/login",
};
