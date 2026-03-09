import { z } from "zod";

export const usernameValidation = z
	.string()
	.min(3, { message: "Username must be at least 3 characters long" })
	.max(20, { message: "Username must be at most 20 characters long" });

export const signupValidation = z.object({
	username: usernameValidation,
	email: z.email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" })
		.max(20, { message: "Password must be at most 20 characters long" }),
});
