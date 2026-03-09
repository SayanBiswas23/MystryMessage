import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/verification";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
	email: string,
	username: string,
	verifyCode: string,
): Promise<ApiResponse> {
	try {
		await resend.emails.send({
			from: "onboarding@resend.dev",
			to: "bsayan238@gmail.com",
			subject: "Mystry Message | VerificationEmail ",
			react: VerificationEmail({ username, otp: verifyCode }),
		});
		return { sucess: true, message: "verification mail sent successfully" };
	} catch (emailError) {
		console.log("Error sending verification email", emailError);
		return { sucess: false, message: "failed to send verification email" };
	}
}
