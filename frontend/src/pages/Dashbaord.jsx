import { useState, useEffect } from 'react';

export default function Dashboard() {
    const [connectedAccounts, setConnectedAccounts] = useState(false);

	return (
        <>  
        <div className="flex w-full items-center justify-center">
            <div className="card p-5 bg-info gap-2 flex flex-row lg:mx-5 mb-5 justify-center shadow-lg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-current h-6 w-6 shrink-0">
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>New here? Click the buttons below to connect your Apple Music and YT Music accounts!</span>
                </div>
        </div>
            
            <div className="flex flex-col lg:flex-row">
				<div className="card card-bg rounded-box flex-grow lg:mr-2.5 lg:ml-5 mb-5 p-5 justify-center items-center text-left shadow-lg">
                    <h2 className="text-2xl font-bold text-primary">Profile</h2>
                </div>
                <div className="card card-bg rounded-box flex-grow lg:ml-2.5 lg:mr-5 mb-5 p-5 justify-center items-center text-left shadow-lg">
                    <h2 className="text-2xl font-bold text-info">Playlists</h2>
                </div>
			</div>
        </>
    );
}
