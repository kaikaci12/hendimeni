import bcrypt from "bcryptjs";
export const hashPassword = (pw: string) => bcrypt.hash(pw, 12);
export const verifyPassword = (pw: string, hash: string) => bcrypt.compare(pw, hash);
// Compared against when the user doesn't exist, so response time doesn't reveal valid accounts.
export const DUMMY_HASH = "$2a$12$C6UzMDM.H6dfI/f/IKcEeO5uV4x1sZ7q9zq1p5e0jX9wq0m0m0m0m";
