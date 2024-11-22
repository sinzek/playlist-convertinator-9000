const connect = require("./connect");
const express = require("express");
const cors = require("cors");
const users = require("./userRoutes");
const spotify = require("./SpotifyRoutes");
const ytMusic = require("./YTMusicRoutes");
const cookieParser = require("cookie-parser");

const whitelist = ["http://localhost:5173", "http://localhost:3000", ""]; // eventually add domain here

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: function (origin, callback) {
			// Allow requests with no origin 
			if (!origin) return callback(null, true);
			
			// Allow Chrome extensions and whitelisted domains
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
	})
);
app.use(users);
app.use('/api/spotify', spotify);
app.use('/api/ytMusic', ytMusic);

app.listen(PORT, () => {
	connect.connectToServer();
	console.log(`Server is running on port ${PORT}`);
});
