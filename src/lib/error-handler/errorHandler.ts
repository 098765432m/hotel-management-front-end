import { NextResponse } from "next/server";
import {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  InternalServerError,
} from "./errors";
import { message } from "antd";
import { Prisma } from "@prisma/client";

export function handleNextApiError(error: unknown) {
  let errorMessage = "Lỗi hệ thống";
  let errorStatus = 500;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      errorMessage = "Dữ liệu đã tồn tại";
      errorStatus = 400;
    }
  }

  if (error instanceof ValidationError) {
    (errorMessage = error.message ?? ValidationError.name),
      (errorStatus = error.statusCode);
  }

  if (error instanceof AuthenticationError) {
    errorMessage = error.message ?? AuthenticationError.name;
    errorStatus = (error as AuthenticationError).statusCode;
  }

  if (error instanceof AuthorizationError) {
    errorMessage = error.message ?? AuthorizationError.name;
    errorStatus = (error as AuthorizationError).statusCode;
  }

  if (error instanceof NotFoundError) {
    errorMessage = error.message ?? NotFoundError.name;
    errorStatus = (error as NotFoundError).statusCode;
  }

  if (error instanceof InternalServerError) {
    errorMessage = error.message ?? InternalServerError.name;
    errorStatus = (error as InternalServerError).statusCode;
  }

  return NextResponse.json(
    { success: false, message: errorMessage },
    { status: errorStatus }
  );
}
