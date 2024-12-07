const express = require("express");
const connect = require("./connect");
let muse = null;

const ytMusicRouter = express.Router();

// Load muse module dynamically
(async () => {
    muse = await import('libmuse');
    class MongoDBStore extends muse.Store {
        constructor(db, username) {
            super();
            this.db = db;
            this.username = username;
        }

        async get(key) {
            const result = await this.db.collection("Credentials").findOne({ username: this.username });
            if (key === 'token') {
                return result?.ytMusicAccessToken ? {
                    access_token: result.ytMusicAccessToken,
                    refresh_token: result.ytMusicRefreshToken,
                    expiry_date: result.ytMusicTokenExpires
                } : null;
            }
            return result?.museTokens?.[key] || null;
        }

        async set(key, value) {
            const update = key === 'token'
                ? {
                    ytMusicAccessToken: value.access_token,
                    ytMusicRefreshToken: value.refresh_token,
                    ytMusicTokenExpires: value.expiry_date
                }
                : { [`museTokens.${key}`]: value };

            await this.db.collection("Credentials").updateOne(
                { username: this.username },
                { $set: update },
                { upsert: true }
            );
        }

        async delete(key) {
            const update = key === 'token'
                ? {
                    $unset: {
                        ytMusicAccessToken: "",
                        ytMusicRefreshToken: "",
                        ytMusicTokenExpires: ""
                    }
                }
                : { $unset: { [`museTokens.${key}`]: "" } };

            await this.db.collection("Credentials").updateOne(
                { username: this.username },
                update
            );
        }
    }

    const authMiddleware = async (req, res, next) => {
        try {
            req.db = connect.getDb();
            const username = req.body.username;
    
            // Custom MongoDBStore initialization
            req.store = new MongoDBStore(req.db, username);
            
            // Initialize muse with this custom store
            muse.setup({
                store: req.store,
                debug: true,
            });
            
            req.auth = muse.get_option("auth");
            
            next();
        } catch (error) {
            console.error("Middleware setup error:", error);
            res.status(500).json({ error: "Server error setting up middleware." });
        }
    };
    
    // Add middleware and routes
    ytMusicRouter.use(authMiddleware);
    
    ytMusicRouter.post("/auth", async (req, res) => {
        const { username, userCode, deviceCode, interval } = req.body;
        const db = req.db;
        const auth = req.auth;
    
        if (!userCode) {
            // Step 1: Get the login code if `userCode` is not provided
            try {
                const loginCode = await auth.get_login_code();
    
                await db.collection("Credentials").updateOne(
                    { username },
                    { $set: { museLoginCode: loginCode.user_code } },
                    { upsert: true }
                );
    
                return res.json({
                    verification_url: loginCode.verification_url,
                    userCode: loginCode.user_code,
                    deviceCode: loginCode.device_code,
                    interval: loginCode.interval
                });
            } catch (error) {
                console.error("Error getting login code:", error);
                return res.status(500).json({ error: "Failed to get login code." });
            }
        }
    
        // Step 2: Load the token if `userCode` is provided
        try {
            const storedCredentials = await db.collection("Credentials").findOne({ username });
    
            if (!storedCredentials?.museLoginCode) {
                return res.status(400).json({ error: "No pending authentication found" });
            }

            if(!auth.has_token()) {
                console.error("Error loading token!");
                return res.status(500).json({ error: "Authentication failed", details: error.message });
            }
            
            console.log("Attempting to load yt music token with userCode", userCode, "and deviceCode", deviceCode, "with interval", interval);
            await auth.load_token_with_code(deviceCode, interval);
    
            await db.collection("Credentials").updateOne(
                { username },
                {
                    $set: {
                        ytMusicConnected: true,
                        ytMusicAccessToken: auth._token.access_token,
                        ytMusicRefreshToken: auth._token.refresh_token,
                        ytMusicTokenExpires: auth._token.expires_date,
                    },
                    $unset: { museLoginCode: "" },
                }
            );
    
            res.json({ success: true, message: "YouTube Music authentication completed successfully" });
        } catch (error) {
            console.error("Error loading token with code:", error);
            res.status(500).json({ error: "Authentication failed", details: error.message });
        }
    });

    ytMusicRouter.post("/disconnect", async (request, response) => {
        const db = request.db;
    
        try {
            const username = request.body.params.username;
    
            await db.collection("Credentials").updateOne(
                { username: username },
                {
                    $set: {
                        ytMusicConnected: false,
                        ytMusicAccessToken: "",
                        ytMusicRefreshToken: "",
                        ytMusicTokenExpires: "",
                    }
                }
            );
    
            response.json({ message: "Spotify account disconnected successfully" });
        } catch (error) {
            console.error("Error disconnecting Spotify:", error);
            response.status(500).json({ error: "Failed to disconnect Spotify account" });
        }
    });
})();

// Middleware for connecting to MongoDB and initializing auth


module.exports = ytMusicRouter;
