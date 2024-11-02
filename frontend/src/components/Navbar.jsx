import { useState, useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import "../index.css"

export default function Navbar() {
	const [convertState, setConvertState] = useState("hidden");
	const convertStateName = " ";
	// update convertState and convertStateName with setConvertState when conversion is completed or fails
	// update 'login' to 'sign out' if user is logged in
	// only show 'account' if user is logged in
	const [islight, setIslight] = useState(
		JSON.parse(localStorage.getItem("islight"))
	);



	const [isLoggedIn, setLoginStatus] = useState(false); // change later
	const [wantsCreateAcc, setWantsCreateAcc] = useState(false); 
	const [curTooltip, setCurTooltip] = useState("");

	const location = useLocation();
	useEffect(() => {
		
		if(location.pathname === "/create-account") {
			setWantsCreateAcc(true);
			setCurTooltip("Already have an account? Log in ↘");
		} else if(location.pathname === "/log-in") {
			setWantsCreateAcc(false);
			setCurTooltip("Don't have an account just yet? Create one ↘");
		} else if(location.pathname === "/") {
			setCurTooltip("Boo!");
		} else if(location.pathname ==="/convert") {
			setCurTooltip("YAY!!!!!!!!");
		} else {
			setCurTooltip("Uh oh, this page doesn't exist!");
		}
	}, [location])

	const background = document.getElementById("background");
	function setBackgroundLighting(islight) {
		if(!islight) {
			background.style.setProperty('--background-brightness', '15%');
		} else {
			background.style.setProperty('--background-brightness', '100%');
		}
	}

	useEffect(() => {
		localStorage.setItem("islight", JSON.stringify(islight));
		setBackgroundLighting(islight);
	}, [islight]);

	

	return (
		<>
			<header className="flex items-stretch items-center justify-center w-full pt-2 pb-5 sticky top-0 z-[999]">

				<div className="hidden sm:flex header-bg rounded-box w-[3.5rem] mr-2 items-center justify-center tooltip tooltip-bottom shadow-lg" data-tip={curTooltip}>
					<NavLink to="/">
						<img width={30} height={30} src="/icon.png" id="icon" />
					</NavLink>
				</div>
				
				<ul className="menu header-bg menu-horizontal rounded-box shadow-lg" id="navbar-links">
					<li>
						<NavLink to="/" className="px-2 lg:px-4">
							🏠 Home
						</NavLink>
					</li>
					<li>
						<NavLink
							to="convert"
							className="px-2 lg:px-4"
						>
							🔄 Convert
							<span className={`badge badge-sm ${convertState}`}>
								{convertStateName}
							</span>
						</NavLink>
					</li>
					<li className={`${isLoggedIn ? null : 'hidden'}`}>
						<NavLink
							to="account"
							className="px-2 lg:px-4"
						>
							👤 Account
						</NavLink>
					</li>
					<li>
						<NavLink
							to={wantsCreateAcc ? "create-account" : "log-in"}
							className="px-2 lg:px-4"
						>
							{wantsCreateAcc ? "👤 Create account" : "🔒 Log in"}
						</NavLink>
					</li>
					
				</ul>

				<div className="flex header-bg rounded-box w-[3.5rem] ml-2 items-center justify-center shadow-lg">
					{" "}
					{/* on larger screns */}
					<label className="swap swap-rotate">
						{/* this hidden checkbox controls the state */}
						<input
							id="darkmode-toggle"
							type="checkbox"
							className="theme-controller"
							value="light"
							checked={islight}
							onChange={() => setIslight(!islight)}
						/>

						{/* sun icon */}
						<svg
							className="swap-off h-5 w-5 fill-current"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
						</svg>

						{/* moon icon */}
						<svg
							className="swap-on h-5 w-5 fill-current"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
						</svg>
					</label>
				</div>

				
			</header>
		</>
	);
}