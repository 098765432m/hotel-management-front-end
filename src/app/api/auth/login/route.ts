import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";

interface loginForm {
  username: string;
  password: string;
}

export async function POST(request: Request) {
  const body: loginForm = await request.json();

  // Find user with username
  const user = await prisma.user.findUnique({
    where: {
      username: body.username,
    },
  });

  console.log("Username: " + body.username);
  console.log("Input password: " + body.password);
  console.log("Stored password: " + user?.password);
  

  // Check if password is valid
  const result =
    user != undefined && (await verifyPassword(body.password, user.password));

    if(user != undefined){
      console.log("result: " + await verifyPassword(body.password, user.password));
    }
    
  //Create jwt session
  if (result) {
    await createSession(user.id);
  }
  return NextResponse.json(result);
}
