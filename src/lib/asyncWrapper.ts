import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "./errorHandler";

export const asyncWrapper =
  (fn: (req: NextRequest) => Promise<NextResponse>) =>
  async (req: NextRequest) => {
    try {
      return await fn(req);
    } catch (err) {
      return errorHandler(err);
    }
  };
