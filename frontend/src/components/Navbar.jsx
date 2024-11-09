import { useState, useEffect } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import "../index.css";
import useAuth from "../context/useAuth";

export default function Navbar() {
	const { auth, logout } = useAuth();
	const [convertState, setConvertState] = useState("hidden");
	const [convertStateName, setConvertStateName] = useState("");
	const [drawerOpen, setDrawerOpen] = useState(false);
	// update convertState and convertStateName with setConvertState when conversion is completed or fails
	// update 'login' to 'sign out' if user is logged in
	// only show 'account' if user is logged in
	const [islight, setIslight] = useState(
		JSON.parse(localStorage.getItem("islight"))
	);

	const [isLoggedIn, setLoginStatus] = useState(false); // change later
	const [wantsCreateAcc, setWantsCreateAcc] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		setLoginStatus(false);
		setWantsCreateAcc(false);
		navigate("/");
	};

	useEffect(() => {
		if (auth?.isAuthenticated) {
			setLoginStatus(true);
		} else {
			setLoginStatus(false);
		}
	}, [auth?.isAuthenticated]);

	useEffect(() => {
		if (location.pathname === "/create-account") {
			setWantsCreateAcc(true);
		} else if (location.pathname === "/log-in") {
			setWantsCreateAcc(false);
		}
		setDrawerOpen(false);
		// const toggle = document.getElementById("mobile-drawer");
	}, [location.pathname]);

	useEffect(() => {
		localStorage.setItem("islight", JSON.stringify(islight));
		const background = document.getElementById("background");
		if (background) {
			background.style.setProperty(
				"--background-brightness",
				islight ? "100%" : "15%"
			);
		}
	}, [islight]);

	return (
		<div className="drawer w-full top-0 sticky z-[999]">
			<input
				id="mobile-drawer"
				type="checkbox"
				checked={drawerOpen}
				className="drawer-toggle w-full"
				onChange={() => setDrawerOpen(!drawerOpen)}
			/>
			<header className="flex drawer-content items-stretch justify-start lg:justify-center w-full pt-2 pb-5 z-[999]">
				<div className="flex lg:hidden header-bg rounded-box w-[3.5rem] mr-0 lg:mr-2 ml-2 lg:ml-0 justify-center shadow-lg">
					<div className="flex-none lg:hidden">
						<label
							htmlFor="mobile-drawer"
							aria-label="open sidebar"
							className="btn btn-square btn-ghost"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								className="inline-block h-6 w-6 stroke-current"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 6h16M4 12h16M4 18h16"
								></path>
							</svg>
						</label>
					</div>
				</div>

				<ul
					className="menu header-bg menu-horizontal rounded-box shadow-lg hidden lg:flex text-xl"
					id="navbar-links"
				>
					<li>
						<NavLink to="/" className="px-2 lg:px-4" tabIndex="0">
							<svg
								viewBox="0 0 1024 1024"
								fill="currentColor"
								className="inline-block h-6 w-6 stroke-current"
							>
								<path d="M946.5 505L534.6 93.4a31.93 31.93 0 00-45.2 0L77.5 505c-12 12-18.8 28.3-18.8 45.3 0 35.3 28.7 64 64 64h43.4V908c0 17.7 14.3 32 32 32H448V716h112v224h265.9c17.7 0 32-14.3 32-32V614.3h43.4c17 0 33.3-6.7 45.3-18.8 24.9-25 24.9-65.5-.1-90.5z" />
							</svg>
							Home
						</NavLink>
					</li>
					<li className={auth?.role === "admin" ? "" : "hidden"}>
						<NavLink to="admin" className="px-2 lg:px-4" tabIndex="0">
							<svg
								viewBox="0 0 512 512"
								fill="currentColor"
								className="inline-block h-5 w-5 stroke-current"
							>
								<path d="M495.9 166.6c3.2 8.7.5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4l-55.6 17.8c-8.8 2.8-18.6.3-24.5-6.8-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4c-1.1-8.4-1.7-16.9-1.7-25.5s.6-17.1 1.7-25.4l-43.3-39.4c-6.9-6.2-9.6-15.9-6.4-24.6 4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2 5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8 8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336c44.2 0 80-35.8 80-80s-35.8-80-80-80-80 35.8-80 80 35.8 80 80 80z" />
							</svg>
							Admin
						</NavLink>
					</li>
					<li>
						<NavLink to="convert" className="px-2 lg:px-4" tabIndex="0">
							<svg
								viewBox="0 0 512 512"
								fill="currentColor"
								className="inline-block h-5 w-5 stroke-current"
							>
								<path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2S334.3 224 344 224h128c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2S461.9 48.1 455 55l-41.6 41.6c-87.6-86.5-228.7-86.2-315.8 1-24.4 24.4-42 53.1-52.8 83.8-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v128c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1 24.4-24.4 42.1-53.1 52.9-83.7 5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2S177.7 288 168 288H40c-13.3 0-24 10.7-24 24z" />
							</svg>
							Convert
							<span className={`badge badge-sm ${convertState}`}>
								{convertStateName}
							</span>
						</NavLink>
					</li>
					<li className={isLoggedIn ? "" : "hidden"}>
						<NavLink to="dashboard" className="px-2 lg:px-4" tabIndex="0">
							<svg
								viewBox="0 0 24 24"
								fill="currentColor"
								className="inline-block h-6 w-6 stroke-current"
							>
								<path d="M4 13h6a1 1 0 001-1V4a1 1 0 00-1-1H4a1 1 0 00-1 1v8a1 1 0 001 1zm-1 7a1 1 0 001 1h6a1 1 0 001-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1v4zm10 0a1 1 0 001 1h6a1 1 0 001-1v-7a1 1 0 00-1-1h-6a1 1 0 00-1 1v7zm1-10h6a1 1 0 001-1V4a1 1 0 00-1-1h-6a1 1 0 00-1 1v5a1 1 0 001 1z" />
							</svg>
							Dashboard
						</NavLink>
					</li>
					<li className={isLoggedIn ? "hidden" : ""}>
						<NavLink
							to={wantsCreateAcc ? "create-account" : "log-in"}
							className={`px-2 lg:px-4`}
							tabIndex="0"
						>
							<svg
								viewBox="0 0 448 512"
								fill="currentColor"
								className="inline-block h-5 w-5 stroke-current"
							>
								<path d="M144 144v48h160v-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zm-64 48v-48C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64v192c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64h16z" />
							</svg>
							{wantsCreateAcc ? "Create account" : "Log in"}
						</NavLink>
					</li>
					<li className={isLoggedIn ? "" : "hidden"} onClick={handleLogout}>
						<a className="px-2 lg:px-4" tabIndex="0">
							<svg
								viewBox="0 0 448 512"
								fill="currentColor"
								className="inline-block h-5 w-5 stroke-current"
							>
								<path d="M144 144c0-44.2 35.8-80 80-80 31.9 0 59.4 18.6 72.3 45.7 7.6 16 26.7 22.8 42.6 15.2s22.8-26.7 15.2-42.6C331 33.7 281.5 0 224 0 144.5 0 80 64.5 80 144v48H64c-35.3 0-64 28.7-64 64v192c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H144v-48z" />
							</svg>
							Log out
						</a>
					</li>
				</ul>

				<div className="flex header-bg rounded-box w-[3.5rem] lg:w-[4rem] ml-2 items-center justify-center shadow-lg">
					{/* on larger screns */}
					<label className="swap swap-rotate">
						{/* this hidden checkbox controls the state */}
						<input
							id="darkmode-toggle"
							type="checkbox"
							className="theme-controller"
							value="fantasy"
							checked={islight}
							onChange={() => setIslight(!islight)}
						/>

						{/* sun icon */}
						<svg
							className="swap-off h-5 w-5 fill-current"
							viewBox="0 0 512 512"
							fill="currentColor"
						>
							<path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391l-19.9 107.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121l19.9-107.9c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1l90.3-62.3c4.5-3.1 10.2-3.7 15.2-1.6zM352 256c0 53-43 96-96 96s-96-43-96-96 43-96 96-96 96 43 96 96zm32 0c0-70.7-57.3-128-128-128s-128 57.3-128 128 57.3 128 128 128 128-57.3 128-128z" />
						</svg>

						{/* moon icon */}
						<svg
							className="swap-on h-5 w-5 fill-current"
							fill="currentColor"
							viewBox="0 0 16 16"
						>
							<path d="M6 .278a.768.768 0 01.08.858 7.208 7.208 0 00-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 01.81.316.733.733 0 01-.031.893A8.349 8.349 0 018.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 016 .278z" />
							<path d="M10.794 3.148a.217.217 0 01.412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 010 .412l-1.162.387a1.734 1.734 0 00-1.097 1.097l-.387 1.162a.217.217 0 01-.412 0l-.387-1.162A1.734 1.734 0 009.31 6.593l-1.162-.387a.217.217 0 010-.412l1.162-.387a1.734 1.734 0 001.097-1.097l.387-1.162zM13.863.099a.145.145 0 01.274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 010 .274l-.774.258a1.156 1.156 0 00-.732.732l-.258.774a.145.145 0 01-.274 0l-.258-.774a1.156 1.156 0 00-.732-.732l-.774-.258a.145.145 0 010-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />{" "}
						</svg>
					</label>
				</div>
				<div className="flex flex-1 lg:hidden header-bg rounded-box items-center justify-center mr-2 lg:mr-2 ml-2  px-4 shadow-lg">
					<NavLink
						to="/"
						className="btn btn-ghost text-primary text-xl text-center"
					>
						Playlist Convertinator
					</NavLink>
				</div>
			</header>
			<div className="drawer-side z-[49]">
				<label
					htmlFor="mobile-drawer"
					aria-label="close sidebar"
					className="drawer-overlay z-[48]"
				></label>
				<ul
					className="menu header-bg text-xl p-5 my-[4rem] rounded-r-xl z-[49]"
					id="navbar-links"
				>
					{/* Sidebar content here */}
					<li>
						<NavLink to="/" className="px-2 lg:px-4" tabIndex="0">
							<svg
								viewBox="0 0 1024 1024"
								fill="currentColor"
								className="inline-block h-6 w-6 stroke-current"
							>
								<path d="M946.5 505L534.6 93.4a31.93 31.93 0 00-45.2 0L77.5 505c-12 12-18.8 28.3-18.8 45.3 0 35.3 28.7 64 64 64h43.4V908c0 17.7 14.3 32 32 32H448V716h112v224h265.9c17.7 0 32-14.3 32-32V614.3h43.4c17 0 33.3-6.7 45.3-18.8 24.9-25 24.9-65.5-.1-90.5z" />
							</svg>
							Home
						</NavLink>
					</li>
					<li className={auth?.role === "admin" ? "" : "hidden"}>
						<NavLink to="admin" className="px-2 lg:px-4" tabIndex="0">
							<svg
								viewBox="0 0 512 512"
								fill="currentColor"
								className="inline-block h-5 w-5 stroke-current"
							>
								<path d="M495.9 166.6c3.2 8.7.5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4l-55.6 17.8c-8.8 2.8-18.6.3-24.5-6.8-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4c-1.1-8.4-1.7-16.9-1.7-25.5s.6-17.1 1.7-25.4l-43.3-39.4c-6.9-6.2-9.6-15.9-6.4-24.6 4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2 5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8 8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336c44.2 0 80-35.8 80-80s-35.8-80-80-80-80 35.8-80 80 35.8 80 80 80z" />
							</svg>
							Admin
						</NavLink>
					</li>
					<li>
						<NavLink to="convert" className="px-2 lg:px-4" tabIndex="0">
							<svg
								viewBox="0 0 512 512"
								fill="currentColor"
								className="inline-block h-5 w-5 stroke-current"
							>
								<path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2S334.3 224 344 224h128c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2S461.9 48.1 455 55l-41.6 41.6c-87.6-86.5-228.7-86.2-315.8 1-24.4 24.4-42 53.1-52.8 83.8-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v128c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1 24.4-24.4 42.1-53.1 52.9-83.7 5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2S177.7 288 168 288H40c-13.3 0-24 10.7-24 24z" />
							</svg>
							Convert
							<span className={`badge badge-sm ${convertState}`}>
								{convertStateName}
							</span>
						</NavLink>
					</li>
					<li className={isLoggedIn ? "" : "hidden"}>
						<NavLink to="dashboard" className="px-2 lg:px-4" tabIndex="0">
							<svg
								viewBox="0 0 24 24"
								fill="currentColor"
								className="inline-block h-6 w-6 stroke-current"
							>
								<path d="M4 13h6a1 1 0 001-1V4a1 1 0 00-1-1H4a1 1 0 00-1 1v8a1 1 0 001 1zm-1 7a1 1 0 001 1h6a1 1 0 001-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1v4zm10 0a1 1 0 001 1h6a1 1 0 001-1v-7a1 1 0 00-1-1h-6a1 1 0 00-1 1v7zm1-10h6a1 1 0 001-1V4a1 1 0 00-1-1h-6a1 1 0 00-1 1v5a1 1 0 001 1z" />
							</svg>
							Dashboard
						</NavLink>
					</li>
					<li className={isLoggedIn ? "hidden" : ""}>
						<NavLink
							to={wantsCreateAcc ? "create-account" : "log-in"}
							className={`px-2 lg:px-4`}
							tabIndex="0"
						>
							<svg
								viewBox="0 0 448 512"
								fill="currentColor"
								className="inline-block h-5 w-5 stroke-current"
							>
								<path d="M144 144v48h160v-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zm-64 48v-48C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64v192c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64h16z" />
							</svg>
							{wantsCreateAcc ? "Create account" : "Log in"}
						</NavLink>
					</li>
					<li className={isLoggedIn ? "" : "hidden"} onClick={handleLogout}>
						<a className="px-2 lg:px-4" tabIndex="0">
							<svg
								viewBox="0 0 448 512"
								fill="currentColor"
								className="inline-block h-5 w-5 stroke-current"
							>
								<path d="M144 144c0-44.2 35.8-80 80-80 31.9 0 59.4 18.6 72.3 45.7 7.6 16 26.7 22.8 42.6 15.2s22.8-26.7 15.2-42.6C331 33.7 281.5 0 224 0 144.5 0 80 64.5 80 144v48H64c-35.3 0-64 28.7-64 64v192c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H144v-48z" />
							</svg>
							Log out
						</a>
					</li>
				</ul>
			</div>
		</div>
	);
}
