import { z } from "zod";

export const eventSchema = z.object({
  id: z.number(),
  userId: z.number(),
  creatorName: z.string(),
  eventName: z.string(),
  location: z.string(),
  image: z.string().optional(),
  dateTime: z.string(),
  maxSpots: z.number(),
  contact: z.string(),
  user: z.any(),
  participants: z.any(),
});
