import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  createdDate: z.string(),
});

export const loginResponseSchema = z.object({
  user: userSchema.extend({ token: z.string() }),
  message: z.string(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export type User = z.infer<typeof userSchema>;
