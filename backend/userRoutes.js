const express = require("express");
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId;

let userRoutes = express.Router();

// Routes

// #1 - Retrieve all users
userRoutes.route("/allusers").get(async (request, response) => {
    let db = database.getDb();
    try {
        let data = await db.collection("Credentials").find({}).toArray();
        response.json(data);
    } catch(error) {
        console.error("Error retrieving all users:", error);
        response.status(500).json({ error: "An error occurred while retrieving all users."});
    }
});

// #2 - Retrieve one user (query = id, username, or email ? {input})
userRoutes.route("/users").get(async (request, response) => {
    let db = database.getDb();
    const { id, username, email } = request.query;

    // Validate that only one parameter is provided
    if (!id && !username && !email) {
        return response.status(400).send("Missing required parameter: id, username, or email.");
    } else if (id && username || id && email || email && username) {
        return response.status(400).send("More than one parameter provided: must be id, username, or email.");
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
userRoutes.route("/users/:username/playlists").get(async (request, response) => {
    let db = database.getDb();
    let username = request.params.username;

    try {
        // Find the user by their username
        const user = await db.collection("Credentials").findOne({ username: username });

        // Check if the user exists
        if (!user) {
            return response.status(404).json({ message: "User not found." });
        }

        // Return the playlists array
        response.status(200).json({ playlists: user.playlists });
    } catch (error) {
        console.error("Error retrieving playlists:", error);
        response.status(500).json({ error: "An error occurred while retrieving the playlists." });
    }
});

// #2 - Retrieve one playlist
userRoutes.route("/users/:username/playlists/:playlistnum").get(async (request, response) => {
    let db = database.getDb();
    let username = request.params.username;
    let playlistNum = parseInt(request.params.playlistnum);

    // Validate playlistNum
    if (isNaN(playlistNum) || playlistNum < 0) {
        return response.status(400).json({ error: "Invalid playlist number." });
    }

    try {
        // Find the user by their ID
        const user = await db.collection("Credentials").findOne({ username: username });

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
        response.status(500).json({ error: "An error occurred while retrieving the playlist." });
    }
});


// #3 - Create one user
userRoutes.route("/users").post(async (request, response) => {
    let db = database.getDb();
    let mongoObject = {
        email: request.body.email,
        username: request.body.username,
        password: request.body.password,
        dateJoined: request.body.date,
        playlists: [{}]
    };
    try {
        let data = await db.collection("Credentials").insertOne(mongoObject);
        response.json(data);
    } catch(error) {
        if (error.code === 11000) { // Duplicate key error
            response.status(400).json({ error: "Email or username already exists." });
        } else {
            console.error("Error creating user:", error);
            response.status(500).json({ error: "An error occurred while creating user." });
        }
    }
});

// #3 - Create one playlist
userRoutes.route("/users/:username/playlists").post(async (request, response) => {
    let db = database.getDb();
    let username = request.params.username;

    let newPlaylist = {
        playlistName: request.body.playlistName,
        songs: request.body.songs, // array of song objects
        creationDate: new Date(),
        playlistLink: request.body.playlistLink
    }

    try {
        // Use $push to add the new playlist to the playlists array for the specified user
        let data = await db.collection("Credentials").updateOne(
            { username: username },
            { $push: { playlists: newPlaylist } }
        );

        // Respond with the update result
        response.json(data);
    } catch(error) {
        console.error("Error adding playlist:", error);
        response.status(500).json({ error: "An error occurred while adding playlist." });
    }
});

// #4 - Update user credentials
userRoutes.route("/users/:id").put(async (request, response) => {
    let db = database.getDb();
    let mongoObject = {
        $set: {
            username: request.body.username,
            password: request.body.password,
            email: request.body.email,
            dateJoined: request.body.dateJoined
        }
    };

    try {
        let data = await db.collection("Credentials").updateOne({_id: new ObjectId(request.params.id)}, mongoObject);
        response.json(data);
    } catch(error) {
        console.error("Error updating user credentials:", error);
        response.status(500).json({ error: "An error occurred while updating user credentials." });
    }
    
});

// #4 - Update playlist name
userRoutes.route("/users/:id/playlists/:playlistnum").put(async (request, response) => {
    let db = database.getDb();
    let userId = request.params.id;
    let playlistNum = parseInt(request.params.playlistnum);
    let newPlaylistName = request.body.playlistName;

    if (isNaN(playlistNum) || playlistNum < 0) {
        return response.status(400).json({ error: "Invalid playlist number." });
    }

    try {
        let data = await db.collection("Credentials").updateOne(
            { _id: new ObjectId(userId) },
            { $set: { [`playlists.${playlistNum}.playlistName`]: newPlaylistName } }
        );

        if (data.modifiedCount === 1) {
            response.status(200).json({ message: "Playlist name updated successfully." });
        } else {
            response.status(404).json({ message: "Playlist not found." });
        }
    } catch(error) {
        console.error("Error updating playlist:", error);
        response.status(500).json({ error: "An error occurred while updating the playlist." });
    }
    
});

// #5 - Delete one
userRoutes.route("/users/:id").delete(async (request, response) => {
    let db = database.getDb();
    try {
        let data = await db.collection("Credentials").deleteOne({_id: new ObjectId(request.params.id)})
        response.json(data);
    } catch(error) {
        console.error("Error deleting user", error);
        response.status(500).json({ error: "An error occurred while deleting user." });
    }
    
});

// #5 - Delete all playlists
userRoutes.route("/users/:id/playlists").delete(async (request, response) => {
    let db = database.getDb();
    let userId = request.params.id;

    try {
        let data = await db.collection("Credentials").updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { playlists: { $exists: true } } }
        );

        if (data.modifiedCount === 1) {
            response.status(200).json({ message: "All playlists deleted successfully." });
        } else {
            response.status(404).json({ message: "Playlists not found." });
        }
    } catch(error) {
        console.error("Error deleting playlists:", error);
        response.status(500).json({ error: "An error occurred while deleting all playlists." });
    }
});

// #5 - Delete specified playlist
userRoutes.route("/users/:id/playlists/:playlistnum").delete(async (request, response) => {
    let db = database.getDb();
    let userId = request.params.id;
    let playlistNum = parseInt(request.params.playlistnum);

    // Validate playlistNum
    if (isNaN(playlistNum) || playlistNum < 0) {
        return response.status(400).json({ error: "Invalid playlist number." });
    }

    try {
        // Find the user and retrieve the playlists
        const user = await db.collection("Credentials").findOne({ _id: new ObjectId(userId) });
        if (!user || !user.playlists || user.playlists.length <= playlistNum) {
            return response.status(404).json({ message: "Playlist not found." });
        }

        // Remove the playlist at the specified index
        user.playlists.splice(playlistNum, 1); // Remove one element at playlistNum index

        // Update the document with the new playlists array
        await db.collection("Credentials").updateOne(
            { _id: new ObjectId(userId) },
            { $set: { playlists: user.playlists } }
        );

        response.status(200).json({ message: "Playlist deleted successfully." });
    } catch(error) {
        console.error("Error deleting playlist:", error);
        response.status(500).json({ error: "An error occurred while deleting the playlist." });
    }
});



module.exports = userRoutes;