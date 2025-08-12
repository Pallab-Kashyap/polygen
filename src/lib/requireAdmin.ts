import { parse } from "cookie";
import { verifyAdminToken } from "./auth";
import { APIError } from "./ApiResponse";

export async function requireAdminFromRequest(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const token = cookies["admin_token"];
  if (!token) throw APIError.badRequest('Unauthorized"');
  try {
    const payload = await verifyAdminToken(token);
    return payload;
  } catch (err) {
    throw APIError.badRequest('Unauthorized"');
  }
}
