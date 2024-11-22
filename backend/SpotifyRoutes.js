require("dotenv").config({ path: "./config.env" });
const express = require("express");
const database = require("./connect");
const querystring = require("querystring");
const axios = require('axios');

let spotifyRoutes = express.Router();

const SCOPES = [
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-private',
    'user-read-email'
].join(' ');

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

spotifyRoutes.route("/connect").get(async (request, response) => {
    let db = database.getDb();
    const username = request.query.username;
    // generate random state for security
    const state = Math.random().toString(36).substring(7);

    // store state in db to verify later
    try {
        let mongoObject = {
            $set: {
                spotifyAPIState: state
            },
        };
        await db
            .collection("Credentials")
            .updateOne({ username: username }, mongoObject);
    } catch (error) {
        console.error("Error updating user credentials:", error);
        response
            .status(500)
            .json({ error: "An error occurred while updating user spotifyAPIState." });
    }

    const combinedState = `${state}:${username}`;

    // build authorization URL
    const authQueryParams = querystring.stringify({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        response_type: 'code',
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        state: combinedState,
        scope: SCOPES,
        show_dialog: true
    });

    // send url for redirect
    response.json({ url: `${SPOTIFY_AUTH_URL}?${authQueryParams}` });
});

// callback route after spotify authorization
spotifyRoutes.route("/callback").get(async (request, response) => {
    let db = database.getDb();
    const { code, state, error } = request.query;

    try {
        const [originalState, username] = state.split(':');

        if (!username) {
            return response.redirect(`${process.env.FRONTEND_URL}/dashboard?error=invalid_state`);
        }

        const user = await db.collection("Credentials").findOne({ username: username });

        if (!user) {
            return response.redirect(`${process.env.FRONTEND_URL}/dashboard?error=user_not_found`);
        }

        const storedState = user.spotifyAPIState;

        // verify state to prevent CSRF attacks
        if (error || !originalState || originalState !== storedState) {
            return response.redirect(`${process.env.FRONTEND_URL}/dashboard?error=spotify_auth_failed`);
        }

        // exchange code for access token
        const tokenResponse = await axios.post(SPOTIFY_TOKEN_URL,
            querystring.stringify({
                code: code,
                redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
                grant_type: 'authorization_code'
            }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(
                    process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
                ).toString('base64')
            }
        });

        const { access_token, refresh_token, expires_in } = tokenResponse.data;

        const profileResponse = await axios.get(`${SPOTIFY_API_URL}/me`, {
            headers: { 'Authorization': `Bearer ${access_token}` }
        });

        const spotifyUserId = profileResponse.data.id;

        let mongoObject = {
            $set: {
                spotifyConnected: true,
                spotifyId: spotifyUserId,
                spotifyAccessToken: access_token,
                spotifyRefreshToken: refresh_token,
                spotifyTokenExpires: new Date(Date.now() + expires_in * 1000)
            },
        };
        await db
            .collection("Credentials")
            .updateOne({ username: username }, mongoObject);

        response.redirect(`${process.env.FRONTEND_URL}/dashboard?spotify=connected`);

    } catch (error) {
        console.error("Spotify auth error:", error);
        response.redirect(`${process.env.FRONTEND_URL}/dashboard?error=spotify_auth_failed`);
    }
});

// get user's playlists
spotifyRoutes.route("/playlists").get(async (request, response) => {
    let db = database.getDb();

    try {
        // get user spotify credentials
        const user = await db.collection("Credentials").findOne({ username: request.body.username });

        if (!user.spotifyConnected) {
            return response.status(400).json({ error: "Spotify account not connected" });
        }

        // check if token needs refresh
        if (new Date() >= new Date(user.spotifyTokenExpires)) {
            // refresh token
            const refreshResponse = await axios.post(SPOTIFY_TOKEN_URL,
                querystring.stringify({
                    grant_type: 'refresh_token',
                    refresh_token: user.spotifyRefreshToken
                }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(
                        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
                    ).toString('base64')
                }
            });

            const { access_token, expires_in } = refreshResponse.data;

            // update tokens in database
            let mongoObject = {
                $set: {
                    spotifyAccessToken: access_token,
                    spotifyTokenExpires: new Date(Date.now() + expires_in * 1000)
                },
            };
            await db.collection("Credentials").updateOne(
                { username: request.body.username }, mongoObject
            )
        }

        // fetch playlists from spotify
        const playlistResponse = await axios.get(`${SPOTIFY_API_URL}/me/playlists`, {
            headers: { 'Authorization': `Bearer ${user.spotifyAccessToken}` }
        });

        response.json(playlistResponse.data);


    } catch (error) {
        console.error("Error fetching playlists:", error);
        response.status(500).json({ error: "Failed to fetch playlists from spotify" });
    }
});

// disconnect spotify account
spotifyRoutes.route("/disconnect").post(async (request, response) => {
    let db = database.getDb();

    try {
        const username = request.body.params.username;

        await db.collection("Credentials").updateOne(
            { username: username },
            {
                $set: {
                    spotifyAccessToken: "",
                    spotifyRefreshToken: "",
                    spotifyTokenExpires: "",
                    spotifyId: "",
                    spotifyAPIState: "",
                    spotifyConnected: false
                }
            }
        );

        response.json({ message: "Spotify account disconnected successfully" });
    } catch (error) {
        console.error("Error disconnecting Spotify:", error);
        response.status(500).json({ error: "Failed to disconnect Spotify account" });
    }
});

module.exports = spotifyRoutes;
