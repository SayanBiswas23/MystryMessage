import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/Helpers/sendVerificationEmail";

/**
 * !POST /api/sign-up
 *
 * Handles user registration with email verification
 *
 * Flow:
 * 1. Connect to database
 * 2. Validate request payload (username, email, password)
 * 3. Check if username is already taken
 * 4. Check if email exists and handle accordingly
 * 5. Hash password with bcrypt
 * 6. Create user or update existing unverified user
 * 7. Generate verification code and expiry
 * 8. Send verification email
 * 9. Return success/error response
 */
export async function POST(request: Request) {
	//* Step 1: Establish database connection
	await dbConnect();

	try {
		//* Step 2: Parse request body and extract credentials
		const { username, email, password } = await request.json();

		//* Step 3: Check if username is already taken (verified users only)
		const existingUserVerfiedByUsername = await UserModel.findOne({
			username,
			isVerified: true,
		});

		if (existingUserVerfiedByUsername) {
			return Response.json(
				{
					success: false,
					message: "Username is already taken",
				},
				{
					status: 400,
				},
			);
		}

		//* Step 4: Check if email already exists in database
		const existingUserbyEmail = await UserModel.findOne({
			email,
			isVerified: true,
		});

		// *Step 5: Generate 6-digit verification code
		const verifyCode = Math.floor(
			100000 + Math.random() * 900000,
		).toString();

		if (existingUserbyEmail) {
			//! User exists but is not verified - update their credentials
			if (existingUserbyEmail.isVerified) {
				return Response.json(
					{
						success: false,
						message: "User already exists with this email",
					},
					{
						status: 400,
					},
				);
			} else {
				//! Hash new password and update unverified user record
				const hashedPassword = await bcrypt.hash(password, 10);
				existingUserbyEmail.password = hashedPassword;
				existingUserbyEmail.verifyCode = verifyCode;
				existingUserbyEmail.verifyCodeExpiry = new Date(
					Date.now() + 3600000,
				).toDateString();

				await existingUserbyEmail.save();
			}
		} else {
			//! Create new user account
			const hashedPassword = await bcrypt.hash(password, 10);

			//* Set verification code expiry to 1 hour from now
			const expiryDate = new Date();
			expiryDate.setHours(expiryDate.getHours() + 1);

			const newUser = new UserModel({
				username,
				email,
				password: hashedPassword,
				verifyCode,
				verifyCodeExpiry: expiryDate,
				isVerified: false,
				isAccecptingMessages: true,
				messages: [],
			});

			await newUser.save();
		}

		//* Step 6: Send verification email with OTP code
		const emailResponse = await sendVerificationEmail(
			email,
			username,
			verifyCode,
		);

		// *Step 7: Verify email was sent successfully
		if (!emailResponse.sucess) {
			return Response.json(
				{
					success: false,
					message: emailResponse.message,
				},
				{
					status: 500,
				},
			);
		}

		// *Step 8: Return success response - user must verify email
		return Response.json(
			{
				success: true,
				message: "User register successfully,Please,verify email",
			},
			{
				status: 201,
			},
		);
	} catch (error) {
		//! Handle any errors during registration process
		console.error("Error registering User", error);
		return Response.json(
			{
				success: false,
				message: "error registering user",
			},
			{
				status: 500,
			},
		);
	}
}
