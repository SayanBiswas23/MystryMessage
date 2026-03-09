import { z } from "zod";

export const isAccecptingMessagesValidation = z.object({
	isAcceptingMessages: z.boolean(),
});
