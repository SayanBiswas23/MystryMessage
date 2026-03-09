import mongoose from "mongoose"; 

type ConnectionObject = {
	isConnected?: Number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
	if (connection.isConnected) {
		console.log(`db is already connected`);
		return;
	}

	try {
		const db = await mongoose.connect(process.env.MONGOURI || "");
		console.log("db connected");

		connection.isConnected = db.connections[0].readyState;
		console.log(connection.isConnected);
	} catch (error) {
		console.log("Database connection failed", error);
		process.exit(1);
	}
}

export default dbConnect;
