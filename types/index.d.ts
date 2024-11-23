import { eventSchema } from "./schemas/event.schema";
import { participantSchema } from "./schemas/participant.schema";
import { userSchema } from "./schemas/user.schema";

export type Event = z.infer<typeof eventSchema>;
export type Participant = z.infer<typeof participantSchema>;
export type User = z.infer<typeof userSchema>;
