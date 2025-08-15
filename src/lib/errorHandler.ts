import { NextResponse } from "next/server";
import { APIError } from "./ApiResponse";

export function errorHandler(err: unknown): NextResponse {
  console.log(err)
  if (err instanceof APIError) {
    return err.toResponse();
  }

  console.error("Unexpected error:", err);
  return NextResponse.json(
    { success: false, message: "Internal Server Error" },
    { status: 500 }
  );
}
