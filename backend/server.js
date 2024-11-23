const connect = require("./connect");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
const whitelist = ["http://localhost:5173", "http://localhost:3000", ""];
app.use(cors({
	origin: function (origin, callback) {
		if (!origin) return callback(null, true);
		if (origin.startsWith('chrome-extension://') || whitelist.includes(origin)) {
			callback(null, true);
		} else {
			console.log('Origin blocked:', origin);
			callback(new Error('Not allowed by CORS'));
		}
	},
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	credentials: true,
	allowedHeaders: ['Content-Type', 'Authorization'],
	exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Database connection and server start
(async () => {
	try {
		await connect.connectToServer();

		// Load routes after DB connection is established
		const users = require("./userRoutes");
		const spotify = require("./SpotifyRoutes");
		const ytMusic = require("./YTMusicRoutes");

		// Routes
		app.use(users);
		app.use('/api/spotify', spotify);
		app.use('/api/ytMusic', ytMusic);

		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Failed to connect to MongoDB:", error);
		process.exit(1); // Exit if the connection fails
	}
})();
