const express = require("express");
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SALT_ROUNDS = 10;
require("dotenv").config({ path: "./config.env" });

let userRoutes = express.Router();

// Routes

// #1 - Retrieve all users
userRoutes.route("/allusers").get(async (request, response) => {
	let db = database.getDb();
	try {
		let data = await db.collection("Credentials").find({}).toArray();
		response.json(data);
	} catch (error) {
		console.error("Error retrieving all users:", error);
		response
			.status(500)
			.json({ error: "An error occurred while retrieving all users." });
	}
});

// #2 - Retrieve one user (query = id, username, or email ? {input})
userRoutes.route("/users").get(async (request, response) => {
	let db = database.getDb();
	const { id, username, email } = request.query;

	// Validate that only one parameter is provided
	if (!id && !username && !email) {
		return response
			.status(400)
			.send("Missing required parameter: id, username, or email.");
	} else if ((id && username) || (id && email) || (email && username)) {
		return response
			.status(400)
			.send(
				"More than one parameter provided: must be id, username, or email."
			);
	}

	// Build query based on provided parameter
	let query = {};
	if (id) {
		query._id = new ObjectId(id);
	} else if (username) {
		query.username = username;
	} else if (email) {
		query.email = email;
	}

	// Fetch user from the database
	try {
		const user = await db.collection("Credentials").findOne(query);
		if (user) {
			response.json(user);
		} else {
			response.status(404).send("User not found.");
		}
	} catch (error) {
		console.error("Error fetching user:", error);
		response.status(500).send("Unable to fetch user.");
	}
});

// #2 - Retrieve all playlists
userRoutes
	.route("/users/:username/playlists")
	.get(async (request, response) => {
		let db = database.getDb();

		try {
			// Find the user by their username
			const user = await db
				.collection("Credentials")
				.findOne({ username: request.params.username });

			// Check if the user exists
			if (!user) {
				return response.status(404).json({ message: "User not found." });
			}

			// Return the playlists array
			response.status(200).json({ playlists: user.playlists });
		} catch (error) {
			console.error("Error retrieving playlists:", error);
			response
				.status(500)
				.json({ error: "An error occurred while retrieving the playlists." });
		}
	});

// #2 - Retrieve one playlist
userRoutes
	.route("/users/:username/playlists/:playlistnum")
	.get(async (request, response) => {
		let db = database.getDb();
		let playlistNum = parseInt(request.params.playlistnum);

		// Validate playlistNum
		if (isNaN(playlistNum) || playlistNum < 0) {
			return response.status(400).json({ error: "Invalid playlist number." });
		}

		try {
			// Find the user by their ID
			const user = await db
				.collection("Credentials")
				.findOne({ username: request.params.username });

			// Check if the user exists
			if (!user) {
				return response.status(404).json({ message: "User not found." });
			}

			// Check if the specified playlistNum is within the bounds of the playlists array
			if (playlistNum >= user.playlists.length) {
				return response.status(404).json({ message: "Playlist not found." });
			}

			// Retrieve the specified playlist
			const specifiedPlaylist = user.playlists[playlistNum];

			// Return the specified playlist
			response.status(200).json({ playlist: specifiedPlaylist });
		} catch (error) {
			console.error("Error retrieving playlist:", error);
			response
				.status(500)
				.json({ error: "An error occurred while retrieving the playlist." });
		}
	});

// #3 - Create one user
userRoutes.route("/register").post(async (request, response) => {
	let db = database.getDb();
	try {
		const hashedPassword = await bcrypt.hash(
			request.body.password,
			SALT_ROUNDS
		);

		let mongoObject = {
			email: request.body.email,
			username: request.body.username,
			password: hashedPassword,
			role: request.body.role,
            refreshToken: "",
			dateJoined: request.body.date,
			playlists: [],
		};

		let data = await db.collection("Credentials").insertOne(mongoObject);
		const role = request.body.role;

		response.json({
			message: `Registration successful!\nEmail: ${request.body.email}\nUsername: ${request.body.username}`,
			role,
		});
	} catch (error) {
		if (error.code === 11000) {
			// Duplicate key error
			response.status(400).json({ error: "Email or username already exists." });
		} else {
			console.error("Error registering user:", error);
			response
				.status(500)
				.json({ error: "An error occurred while registering user." });
		}
	}
});

// #3 - Create one playlist
userRoutes
	.route("/users/:username/playlists")
	.post(async (request, response) => {
		let db = database.getDb();

		let newPlaylist = {
			playlistName: request.body.playlistName,
			songs: request.body.songs, // array of song objects
			creationDate: new Date(),
			playlistLink: request.body.playlistLink,
		};

		try {
			// Use $push to add the new playlist to the playlists array for the specified user
			let data = await db
				.collection("Credentials")
				.updateOne(
					{ username: request.params.username },
					{ $push: { playlists: newPlaylist } }
				);

			// Respond with the update result
			response.json(data);
		} catch (error) {
			console.error("Error adding playlist:", error);
			response
				.status(500)
				.json({ error: "An error occurred while adding playlist." });
		}
	});

// #4 - Update user credentials
userRoutes.route("/users/:username").put(async (request, response) => {
	let db = database.getDb();

	try {

		let mongoObject = {
			$set: {
				email: request.body.email,
				role: request.body.role,
			},
		};

		let data = await db
			.collection("Credentials")
			.updateOne({ username: request.params.username }, mongoObject);
		response.json({
			message: `User credentials successfully updated!\nEmail: ${request.body.email}\nRole: ${request.body.role}`
		});
	} catch (error) {
		console.error("Error updating user credentials:", error);
		response
			.status(500)
			.json({ error: "An error occurred while updating user credentials." });
	}
});

// #4 - Update playlist name
userRoutes
	.route("/users/:username/playlists/:playlistnum")
	.put(async (request, response) => {
		let db = database.getDb();
		let playlistNum = parseInt(request.params.playlistnum);
		let newPlaylistName = request.body.playlistName;

		if (isNaN(playlistNum) || playlistNum < 0) {
			return response.status(400).json({ error: "Invalid playlist number." });
		}

		try {
			let data = await db.collection("Credentials").updateOne(
				{ username: request.params.username },
				{
					$set: {
						[`playlists.${playlistNum}.playlistName`]: newPlaylistName,
					},
				}
			);

			if (data.modifiedCount === 1) {
				response
					.status(200)
					.json({ message: "Playlist name updated successfully." });
			} else {
				response.status(404).json({ message: "Playlist not found." });
			}
		} catch (error) {
			console.error("Error updating playlist:", error);
			response
				.status(500)
				.json({ error: "An error occurred while updating the playlist." });
		}
	});

// #5 - Delete one
userRoutes.route("/users/:username").delete(async (request, response) => {
	let db = database.getDb();
	try {
		let data = await db
			.collection("Credentials")
			.deleteOne({ username: request.params.username });
		response.json(data);
	} catch (error) {
		console.error("Error deleting user", error);
		response
			.status(500)
			.json({ error: "An error occurred while deleting user." });
	}
});

// #5 - Delete all playlists
userRoutes
	.route("/users/:username/playlists")
	.delete(async (request, response) => {
		let db = database.getDb();

		try {
			let data = await db
				.collection("Credentials")
				.updateOne(
					{ username: request.params.username },
					{ $pull: { playlists: { $exists: true } } }
				);

			if (data.modifiedCount === 1) {
				response
					.status(200)
					.json({ message: "All playlists deleted successfully." });
			} else {
				response.status(404).json({ message: "Playlists not found." });
			}
		} catch (error) {
			console.error("Error deleting playlists:", error);
			response
				.status(500)
				.json({ error: "An error occurred while deleting all playlists." });
		}
	});

// #5 - Delete specified playlist
userRoutes
	.route("/users/:username/playlists/:playlistnum")
	.delete(async (request, response) => {
		let db = database.getDb();
		let playlistNum = parseInt(request.params.playlistnum);

		// Validate playlistNum
		if (isNaN(playlistNum) || playlistNum < 0) {
			return response.status(400).json({ error: "Invalid playlist number." });
		}

		try {
			// Find the user and retrieve the playlists
			const user = await db
				.collection("Credentials")
				.findOne({ username: request.params.username });
			if (!user || !user.playlists || user.playlists.length <= playlistNum) {
				return response.status(404).json({ message: "Playlist not found." });
			}

			// Remove the playlist at the specified index
			user.playlists.splice(playlistNum, 1); // Remove one element at playlistNum index

			// Update the document with the new playlists array
			await db
				.collection("Credentials")
				.updateOne(
					{ username: request.params.username },
					{ $set: { playlists: user.playlists } }
				);

			response.status(200).json({ message: "Playlist deleted successfully." });
		} catch (error) {
			console.error("Error deleting playlist:", error);
			response
				.status(500)
				.json({ error: "An error occurred while deleting the playlist." });
		}
	});

// Login
userRoutes.route("/login").post(async (request, response) => {
	let db = database.getDb();
	const { username, password } = request.body;

	try {
		const user = await db.collection("Credentials").findOne({ username });
		if (!user) {
			return response
				.status(400)
				.json({ error: "Invalid username or password." });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return response
				.status(400)
				.json({ error: "Invalid username or password." });
		}

		const token = jwt.sign(user, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN,
		});
        const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        });

        await db.collection("Credentials").updateOne(
            { _id: user._id },
            { $set: { refreshToken: refreshToken } }
        );

        response.cookie('jwt', refreshToken, {
            httpOnly: true,
            // secure: true, // use in production
            sameSite: 'None',
            maxAge: 1209600000, // 14 days
        });

		response.json({
			token,
			role: user.role,
		});
	} catch (error) {
		console.error("Error logging in:", error);
		response.status(500).json({ error: "An error occurred while logging in." });
	}
});

// verifying refresh token and returning new access token
userRoutes.route("/refresh-token").post(async (request, response) => {
    const { refreshToken } = request.body;

    if (!refreshToken) {
        return response.status(401).json({ error: "Refresh token is required." });
    }

    try {
        const user = await db.collection("Credentials").findOne({ refreshToken });

        if (!user) {
            return response.status(403).json({ error: "Invalid refresh token." });
        }

        // Verify the refresh token
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) {
                return response.status(403).json({ error: "Invalid refresh token." });
            }

            // Create a new access token
            const token = jwt.sign(user, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });

            response.json({
                message: "New access token created!",
                token,
            });
        });
    } catch (error) {
        console.error("Error refreshing token:", error);
        response.status(500).json({ error: "An error occurred while refreshing the token." });
    }
});


module.exports = userRoutes;
