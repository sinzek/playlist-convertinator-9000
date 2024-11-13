import { useState, useEffect } from "react";
import useAuth from "../context/useAuth";
import { instance } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
	const { auth, setAuth } = useAuth();
	const [spotifyConnected, setSpotifyConnected] = useState(false);
	const [YTMusicConnected, setYTMusicConnected] = useState(false);
	const [connectedAccounts, setConnectedAccounts] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		if (!auth.isAuthenticated) {
			navigate(-1);
		}
	}, [])

	const verifySpotifyConnection = async () => {
		try {
			const response = await instance.get(`/users?username=${auth.user}`);
			console.log("SPOTIFY CONNECTION FOUND");
			if(response.data.spotifyConnected) {
				setSpotifyConnected(true);
			} else {
				setSpotifyConnected(false);
			}
		} catch(error) {
			console.error("Could not retrieve user:", error);
		}
	};

	const handleSpotifyConnect = async () => {
		try {
			const response = await instance.get("/api/spotify/connect", { params: { username: auth.user }, withCredentials: true });

			if (response.data.url) {
				window.location.href = response.data.url;
			}
		} catch (error) {
			console.log("Error connecting Spotify account:", error);
			return;
		}

	};

	const handleSpotifyDisconnect = async () => {
		try {
			const response = await instance.get("/api/spotify/disconnect", { params: { username: auth.user }, withCredentials: true });
			console.log(response.message);
			
		} catch (error) {
			console.log("Error disconnecting Spotify account:", error);
			return;
		}

	};

	



	useEffect(() => {


		const params = new Proxy(new URLSearchParams(window.location.search), {
			get: (searchParams, prop) => searchParams.get(prop)
		})
		if (params.spotify === "connected") {
			console.log("SPOTIFY CONNECTED YAY!");
		} else if (params.error === "invalid_state") {
			console.log("ERROR: INVALID STATE");
		} else if (params.error === "user_not_found") {
			console.log("ERROR: USER NOT FOUND");
		} else if (params.error === "spotify_auth_failed") {
			console.log("ERROR: SPOTIFY AUTH FAILED");
		}
	}, [window.location])

	return (
		<>
			<div className={`flex-col items-center justify-center ${connectedAccounts ? 'hidden' : 'flex'}`}>
				<div className="card p-5 bg-info gap-2 flex lg:flex-row mb-5 items-center shadow-lg mx-5 text-lg text-info-content animate-fade-down animate-once animate-ease-in-out">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						className="stroke-current h-6 w-6 shrink-0"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
					<span>
						New here? Click the buttons to connect your Spotify and
						YouTube Music accounts!
					</span>
					<div className="flex flex-col lg:flex-row mt-2 lg:mt-0 lg:ml-5 gap-5">
						<button className="btn btn-success font-bold" disabled={spotifyConnected ? true : false} onClick={handleSpotifyConnect}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={`h-6 w-6 shrink-0 stroke-current ${spotifyConnected ? '' : 'hidden'}`}
								fill="none"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							Connect to Spotify
						</button>
						<button className="btn btn-error font-bold" disabled={YTMusicConnected ? true : false}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={`h-6 w-6 shrink-0 stroke-current ${spotifyConnected ? '' : 'hidden'}`}
								fill="none"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							Connect to YouTube Music
						</button>
					</div>
				</div>

			</div>

			<div className="flex flex-col lg:flex-row">
				<div className="card card-bg mx-5 lg:w-1/2 lg:mr-2.5 lg:ml-[20%] mb-5 items-center text-left animate-fade lg:animate-fade-right animate-once">
					<h2 className="flex flex-row items-center gap-2 text-3xl font-bold text-primary mb-4">
						<svg
							viewBox="0 0 448 512"
							fill="currentColor"
							className="inline-block h-7 w-7 stroke-current"
						>
							<path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3 0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3h-91.4z" />
						</svg>
						Profile
					</h2>
					<div className="flex flex-col w-full text-lg lg:text-2xl justify-center items-left text-left text-wrap">
						<h3 className="mb-2 flex gap-4">
							Username: <b>{auth?.user}</b>
						</h3>
						<h3 className="mb-2 flex gap-4">
							Email: <b>{auth?.email}</b>
						</h3>
					</div>
				</div>
				<div className="card card-s-bg lg:w-1/2 mx-5 lg:ml-2.5 lg:mr-[20%] mb-5 items-center text-left animate-fade lg:animate-fade-left animate-once">
					<h2 className="flex flex-row items-center gap-2 text-3xl font-bold text-secondary mb-4">
						<svg
							viewBox="0 0 700 1000"
							fill="currentColor"
							className="inline-block h-8 w-8 stroke-current"
						>
							<path d="M600 50c28 0 51.667 9.667 71 29s29 43 29 71v700c0 26.667-9.667 50-29 70s-43 30-71 30H100c-26.667 0-50-10-70-30S0 876.667 0 850V150c0-28 10-51.667 30-71s43.333-29 70-29h500M490 526c21.333-29.333 29-60 23-92s-17-58.667-33-80a8672.779 8672.779 0 01-49-66c-16.667-22.667-25-40.667-25-54h-60v368c-28-10.667-58-10-90 2-28 9.333-49.333 25.333-64 48-14.667 22.667-18.667 44-12 64 8 21.333 25.667 36.333 53 45 27.333 8.667 55.667 8.333 85-1 58.667-20 88-52.667 88-98V400c24 4 42.333 14.667 55 32 12.667 17.333 18.667 34.667 18 52-.667 17.333-1.667 31.333-3 42-2.667 6.667-2 10 2 10 2.667 0 6.667-3.333 12-10" />
						</svg>
						Playlists
					</h2>
				</div>
			</div>
		</>
	);
}
