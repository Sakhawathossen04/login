import { z } from "zod";
export const password = z.string()
  .min(8, "Password must be at least 8 characters").max(72, "Password too long")
  .regex(/[a-z]/, "Password needs a lowercase letter")
  .regex(/[A-Z]/, "Password needs an uppercase letter")
  .regex(/\d/, "Password needs a number");
export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(60),
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,20}$/, "Username: 3-20 chars, letters, numbers, _"),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password,
});
export const resetSchema = z.object({ token: z.string().min(20, "Invalid link"), password });
