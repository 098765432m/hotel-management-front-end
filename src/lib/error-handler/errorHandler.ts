import { NextResponse } from "next/server";
import CustomError from "./errors";
import { Prisma } from "@prisma/client";

// Trả về thông báo lỗi và status cho NextResponse
export function handleNextApiError(error: unknown) {
  // Default status và thông báo
  let errorMessage = "Lỗi hệ thống";
  let errorStatus = 500;

  // Bắt lỗi Dữ liệu đã tồn tại của Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      errorMessage = "Dữ liệu đã tồn tại";
      errorStatus = 400;
    }
  }

  // Lỗi input người dùng
  if (error instanceof CustomError.ValidationError) {
    (errorMessage = error.message ?? CustomError.ValidationError.name),
      (errorStatus = error.statusCode);
  }

  if (error instanceof CustomError.AuthenticationError) {
    errorMessage = error.message ?? CustomError.AuthenticationError.name;
    errorStatus = (error as CustomError.AuthenticationError).statusCode;
  }

  if (error instanceof CustomError.AuthorizationError) {
    errorMessage = error.message ?? CustomError.AuthorizationError.name;
    errorStatus = (error as CustomError.AuthorizationError).statusCode;
  }

  // Lỗi không tìm tháy tài nguyên
  if (error instanceof CustomError.NotFoundError) {
    errorMessage = error.message ?? CustomError.NotFoundError.name;
    errorStatus = (error as CustomError.NotFoundError).statusCode;
  }

  // Lỗi hệ thống
  if (error instanceof CustomError.InternalServerError) {
    errorMessage = error.message ?? CustomError.InternalServerError.name;
    errorStatus = (error as CustomError.InternalServerError).statusCode;
  }

  return NextResponse.json(
    { success: false, message: errorMessage },
    { status: errorStatus }
  );
}
