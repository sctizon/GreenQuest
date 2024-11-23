import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  email: z.string().email(),
  password: z.string(),
  participants: z.array(z.any()),
  createdEvents: z.array(z.any()),
  createdAt: z.string(),
});
