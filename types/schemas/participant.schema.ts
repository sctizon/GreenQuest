import { z } from "zod";

export const participantSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  eventId: z.number(),
  userId: z.number().optional(),
  event: z.any(),
  user: z.any(),
});
