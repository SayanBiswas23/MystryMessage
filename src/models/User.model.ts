import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
	content: String;
	createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
	content: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

export interface User extends Document {
	username: String;
	email: String;
	password: String;
	verifyCode: String;
	verifyCodeExpiry: String;
	isVerified: Boolean;
	isAccecptingMessages: Boolean;
	messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Password is required"],
	},
	verifyCode: {
		type: String,
		required: [true, "Verify code is required"],
	},
	verifyCodeExpiry: {
		type: String,
		required: [true, "Verify code expiry is required"],
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	isAccecptingMessages: {
		type: Boolean,
		required: true,
	},
	messages: [MessageSchema],
});


const UserModel =( mongoose.models.User  as mongoose.Model<User>) ||mongoose.model<User>("User",UserSchema)


export default UserModel;