import { parse } from "cookie";
import { verifyAdminToken } from "./auth";

export function requireAdminFromRequest(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const token = cookies["admin_token"];
  if (!token) throw new Error("Unauthorized");
  try {
    const payload = verifyAdminToken(token);
    return payload;
  } catch (err) {
    throw new Error("Unauthorized");
  }
}
