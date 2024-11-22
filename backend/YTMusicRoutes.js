require("dotenv").config({ path: "./config.env" });
const express = require("express");
const database = require("./connect");

let muse = null;
let museRoutes = express.Router();

// Dynamically import libmuse
(async () => {
    muse = await import('libmuse');

    // Define MongoDBStore class and routes inside the IIFE after muse has been loaded
    class MongoDBStore extends muse.Store {
        constructor(db, username) {
            super();
            this.db = db;
            this.username = username;
        }

        async get(key) {
            const result = await this.db
                .collection("Credentials")
                .findOne({ username: this.username });

            if (key === 'token') {
                return result?.ytMusicAccessToken ? {
                    access_token: result.ytMusicAccessToken,
                    refresh_token: result.ytMusicRefreshToken,
                    expiry_date: result.ytMusicTokenExpiryDate
                } : null;
            }

            return result?.museTokens?.[key] || null;
        }

        async set(key, value) {
            if (key === 'token') {
                const update = {
                    $set: {
                        ytMusicAccessToken: value.access_token,
                        ytMusicRefreshToken: value.refresh_token,
                        ytMusicTokenExpiryDate: value.expiry_date
                    }
                };
                await this.db
                    .collection("Credentials")
                    .updateOne({ username: this.username }, update);
                return;
            }

            const update = {
                $set: {
                    [`museTokens.${key}`]: value
                }
            };
            await this.db
                .collection("Credentials")
                .updateOne({ username: this.username }, update);
        }

        async delete(key) {
            if (key === 'token') {
                const update = {
                    $unset: {
                        ytMusicAccessToken: "",
                        ytMusicRefreshToken: "",
                        ytMusicTokenExpiryDate: ""
                    }
                };
                await this.db
                    .collection("Credentials")
                    .updateOne({ username: this.username }, update);
                return;
            }

            const update = {
                $unset: {
                    [`museTokens.${key}`]: ""
                }
            };
            await this.db
                .collection("Credentials")
                .updateOne({ username: this.username }, update);
        }
    }

    museRoutes.route("/connect").get(async (request, response) => {
        try {
            const db = database.getDb();
            const username = request.query.username;

            const store = new MongoDBStore(db, username);

            muse.setup({
                store: store,
                debug: true
            });

            const auth = muse.get_option("auth");

            auth.addEventListener("requires-login", (event) => {
                const resolve = event.detail;
                resolve(async () => {
                    if (auth.has_token()) return;
                    const loginCode = await auth.get_login_code();

                    return loginCode;
                });
            });

            const loginCode = await auth.get_login_code();

            response.json({
                verification_url: loginCode.verification_url,
                user_code: loginCode.device_code
            });

        } catch (error) {
            console.error("Error initiating YT Music auth:", error);
            response.status(500).json({ 
                error: "Failed to initiate YT Music authentication" 
            });
        }
    });

    museRoutes.route("/callback").post(async (request, response) => {
        try {
            const db = database.getDb();
            const { username, loginCode } = request.body;

            const store = new MongoDBStore(db, username);
            muse.setup({
                store: store,
                debug: true
            });

            const auth = muse.get_option("auth");

            await auth.load_token_with_code(loginCode);
            
            console.log("MADE IT HERE 2");

            await db.collection("Credentials").updateOne(
                { username: username },
                {
                    $set: {
                        ytMusicConnected: true,
                        ytMusicAccessToken: auth._token.access_token,
                        ytMusicRefreshToken: auth._token.refresh_token,
                        ytMusicTokenExpires: auth._token.expires_date
                    }
                },
                {
                    $unset: {
                        museLoginCode: ""
                    }
                }
            );

            response.json({ success: true });

        } catch (error) {
            console.error("Error completing YT Music auth:", error);
            response.status(500).json({ 
                error: "Failed to complete YT Music authentication" 
            });
        }
    });

})();

module.exports = museRoutes;
