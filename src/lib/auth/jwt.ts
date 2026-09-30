// Edge-safe (used by middleware): only depends on `jose`.
import { SignJWT, jwtVerify } from "jose";
export const COOKIE_NAME = "session";
export const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days (seconds)
export type Role = "CUSTOMER" | "HANDYMAN" | "ADMIN";
export type SessionPayload = { sub: string; role: Role };
const secret = () => {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) throw new Error("JWT_SECRET must be set (>= 32 chars)");
  return new TextEncoder().encode(s);
};
export const signJwt = (p: SessionPayload) =>
  new SignJWT({ role: p.role }).setProtectedHeader({ alg: "HS256" }).setSubject(p.sub).setIssuedAt().setExpirationTime(`${SESSION_TTL}s`).sign(secret());
export async function verifyJwt(token?: string): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    return payload.sub ? { sub: payload.sub, role: payload.role as Role } : null;
  } catch { return null; }
}
