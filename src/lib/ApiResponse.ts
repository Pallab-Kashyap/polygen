import { NextResponse } from "next/server";

export class APIError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }

  toResponse() {
    return NextResponse.json(
      { success: false, message: this.message },
      { status: this.statusCode }
    );
  }

  static badRequest(message: string) {
    return new APIError(message, 400);
  }

  static unauthorized(message: string) {
    return new APIError(message, 401);
  }

  static notFound(message: string) {
    return new APIError(message, 404);
  }

  static internal(message = "Something went wrong") {
    return new APIError(message, 500);
  }
}


export class APIResponse {
  static success(data: any, message = "Success") {
    return NextResponse.json({ success: true, message, data }, { status: 200 });
  }
  static created(data: any, message = "Created") {
    return NextResponse.json({ success: true, message, data }, { status: 201 });
  }
}
