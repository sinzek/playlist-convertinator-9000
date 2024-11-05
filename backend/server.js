const connect = require("./connect");
const express = require("express");
const cors = require("cors");
const users = require("./userRoutes");

const whitelist = ["http://localhost:5173"]; // eventually add domain here

const app = express();
const PORT = 3000;

app.use(
	cors({
		origin: (origin, callback) => {
			if (whitelist.includes(origin) || !origin) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	})
);
app.use(express.json());
app.use(users);

app.listen(PORT, () => {
	connect.connectToServer();
	console.log(`Server is running on port ${PORT}`);
});
