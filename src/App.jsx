import "./index.css";
import { useState } from "react";

export default function App() {
	const [convertState, setConvertState] = useState("hidden");
	const convertStateName = " ";
	// update convertState and convertStateName with setConvertState when conversion is completed or fails
	// update 'login' to 'sign out' if user is logged in
	// only show 'account' if user is logged in
	return (
		<>
			<header className="flex items-center justify-center w-full">
				<ul className="menu bg-base-200 menu-horizontal rounded-box text-white">
					<li>
						<a>🏠 Home</a>
					</li>
					<li>
						<a>
							🔄 Convert
							<span className={`badge badge-sm ${convertState}`}>
								{convertStateName}
							</span>
						</a>
					</li>
					<li>
						<a>👤 Account</a>
					</li>
					<li>
						<a>🔒 Login</a>
					</li>
				</ul>
			</header>
		</>
	);
}
