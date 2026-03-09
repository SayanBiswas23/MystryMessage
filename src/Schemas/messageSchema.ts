import { z } from "zod";

export const MessageSchemaValidation = z.object({
	content: z
		.string()
		.min(1, { message: "Message must be at least 1 characters long" })
		.max(200, { message: "Message must be at most 200 characters long" }), 
});
