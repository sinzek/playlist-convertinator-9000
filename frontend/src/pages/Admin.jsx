import React, { useState, useEffect } from "react";
import { FixedSizeList } from "react-window";

import { instance } from "../api/axios";

const Admin = () => {
	const [users, setUsers] = useState([]);
	const [totalPlaylists, setTotalPlaylists] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortConfig, setSortConfig] = useState({
		key: "username",
		direction: "asc",
	});
	const [selectedUser, setSelectedUser] = useState(null);
	const [showOverlay, setShowOverlay] = useState(false);
	const [email, setEmail] = useState("");
	const [role, setRole] = useState("");
    const [hasChanges, setHasChanges] = useState(false);
    const [clickedSaveChanges, setClickedSaveChanges] = useState(false);

	useEffect(() => {
		async function fetchUsers() {
			try {
				const response = await instance.get("/allusers");
				setUsers(response.data);
				setTotalPlaylists(
					response.data.reduce((sum, user) => sum + user.playlists.length, 0)
				); // iterates thru all users, change in future for optimization
				setLoading(false);
			} catch (error) {
				console.error("Error fetching users: ", error);
				setError(error.message);
				setLoading(false);
			}
		}

		fetchUsers();
	}, []);

	const filteredUsers = users.filter(
		(user) =>
			user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.role.toLowerCase().includes(searchTerm.toLowerCase())
	);

    useEffect(() => {
        // Check for changes when the component mounts or when the props change
        if(selectedUser) {
            setHasChanges((email !== selectedUser.email) || (role !== selectedUser.role));
        }
      }, [email, role, selectedUser]);

	const saveChanges = async (e) => {
        e.preventDefault();
        if(email) {
            selectedUser.email = email;
        }
        if(role) {
            selectedUser.role = role;
        }

        console.log(selectedUser.username)

        try {
            await instance.put(`/users/${selectedUser.username}`, { email, role });
            setHasChanges(false);
            setClickedSaveChanges(true);
        } catch(error) {
            console.error("Could not update user credentials", error)
        }
        
	};

	useEffect(() => {
		if (showOverlay === false) {
			setEmail("");
			setRole("");
            setSelectedUser(null);
            setClickedSaveChanges(false);
		} else {
            setEmail(selectedUser.email)
            setRole(selectedUser.role);
        }
	}, [showOverlay]);

	const sortedUsers = [...filteredUsers].sort((a, b) => {
		if (a[sortConfig.key] < b[sortConfig.key]) {
			return sortConfig.direction === "asc" ? -1 : 1;
		}
		if (a[sortConfig.key] > b[sortConfig.key]) {
			return sortConfig.direction === "asc" ? 1 : -1;
		}
		return 0;
	});

	const handleSort = (key) => {
		setSortConfig({
			key,
			direction:
				sortConfig.key === key && sortConfig.direction === "asc"
					? "desc"
					: "asc",
		});
	};

	const Row = ({ index, style }) => {
		const user = sortedUsers[index];
		return (
			<div
				style={style}
				className="flex border-b border-base-300 hover:bg-base-200 items-center text-left cursor-pointer"
				onClick={() => {
					setSelectedUser(user);
					setShowOverlay(true);
					console.log("Selected user:", user.username); // For testing
				}}
			>
				<div className="flex-1 p-4">{user.username}</div>
				<div className="flex-1 p-4">{user.email}</div>
				<div className="flex-1 p-4">{user.role}</div>
				<div className="flex-1 p-4">{user.dateJoined}</div>
			</div>
		);
	};

	if (loading) {
		return <div className="p-4 text-center">Loading users...</div>;
	}

	if (error) {
		return <div className="p-4 text-center text-red-500">Error: {error}</div>;
	}

	return (
		<>
			<div className="flex flex-col w-full">
				<div className="card card-bg rounded-box flex-grow mx-5 lg:mb-0 mb-5 p-5 justify-center items-center text-left shadow-lg">
					<h3 className="text-xl font-italic mb-5">User Management</h3>
					<div className="flex flex-col w-full lg:flex-row mb-3 items-center">
						<div className="stats shadow-md flex flex-1 bg-base-200 w-full">
							<div className="stat lg:flex-row items-center justify-items-stretch w-full">
								<div className="stat-figure text-primary ">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										className="inline-block h-8 w-8 stroke-current"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										></path>
									</svg>
								</div>
								<div className="stat-title">Total Users:</div>
								<div className="stat-value text-primary">{users.length}</div>
							</div>
							<div className="stat">
								<div className="stat-figure text-primary">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										className="inline-block h-8 w-8 stroke-current"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										></path>
									</svg>
								</div>
								<div className="stat-title">Total Playlists</div>
								<div className="stat-value text-primary">{totalPlaylists}</div>
							</div>
						</div>
						<div className="input input-bordered flex flex-1 mb-2 lg:mb-0 mx-5 lg:w-1/4 bg-base-200 shadow-md mt-5 lg:mt-0">
							<input
								type="text"
								placeholder="🔍 Search users..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="grow"
							/>
						</div>
					</div>

					<div className="card card-bg rounded-box w-full overflow-hidden shadow-md">
						<div className="flex font-semibold bg-base-200 border-b border-base-300">
							<div
								className="flex-1 p-4 cursor-pointer hover:bg-base-300"
								onClick={() => handleSort("username")}
							>
								Username
								{sortConfig.key === "username" && (
									<span className="ml-1">
										{sortConfig.direction === "asc" ? "↑" : "↓"}
									</span>
								)}
							</div>
							<div
								className="flex-1 p-4 cursor-pointer hover:bg-base-300"
								onClick={() => handleSort("email")}
							>
								Email
								{sortConfig.key === "email" && (
									<span className="ml-1">
										{sortConfig.direction === "asc" ? "↑" : "↓"}
									</span>
								)}
							</div>
							<div
								className="flex-1 p-4 cursor-pointer hover:bg-base-300"
								onClick={() => handleSort("role")}
							>
								Role
								{sortConfig.key === "role" && (
									<span className="ml-1">
										{sortConfig.direction === "asc" ? "↑" : "↓"}
									</span>
								)}
							</div>
							<div className="flex-1 p-4 cursor-pointer">Date joined</div>
						</div>

						<FixedSizeList
							height={400}
							width="100%"
							itemCount={sortedUsers.length}
							itemSize={56}
						>
							{Row}
						</FixedSizeList>
					</div>
				</div>
			</div>

			{showOverlay && (
				<Overlay onClose={() => setShowOverlay(false)}>
                    <div className="flex flex-row gap-4 w-full items-center mb-4">
                        <h2 className="text-2xl font-bold">User Details</h2>
                        <h3 className={hasChanges || !clickedSaveChanges ? "hidden" : "text-sm text-success"}>Changes saved successfully!</h3>
                    </div>
					
					<form className="w-full text-lg" onSubmit={(e) => saveChanges(e)}>
						<div className="mb-2 flex flex-row">
							<p className="font-semibold">Username: </p>
							{selectedUser.username}
						</div>
						<div className="mb-2 flex flex-row items-center">
							<p className="font-semibold">Email: </p>
							<input
								className="input input-sm text-lg w-full transition-color duration-150 bg-base-200 hover:bg-base-300"
								type="email"
								autoComplete="off"
								value={email ? email : selectedUser.email}
								onChange={(e) => setEmail(e.target.value)}
							></input>
						</div>
						<div className="mb-2 flex flex-row">
							<p className="font-semibold">Date Joined: </p>
							{selectedUser.dateJoined}
						</div>
						<div className="mt-4 mb-6 flex flex-row items-center">
							<p className="font-semibold">Role: </p>
							<div className="dropdown">
								<div tabIndex={0} role="button" className="btn btn-sm text-lg font-normal bg-base-200 hover:bg-base-300 border-0">
									{role ? role : selectedUser.role} ☰
								</div>
								<ul
									tabIndex={0}
									className="dropdown-content menu bg-base-300 rounded-box z-[1] w-40 p-2 shadow text-lg"
								>
									<li onClick={() => setRole("user")}>
										<a>user</a>
									</li>
									<li onClick={() => setRole("admin")}>
										<a>admin</a>
									</li>
								</ul>
							</div>
						</div>
						<input
							className="btn btn-success btn-sm mr-4 text-base-100"
							type="submit"
							value="Save changes"
							disabled={!hasChanges}
						></input>
						<button
							className="btn btn-error btn-sm text-base-100"
							onClick={() => setShowOverlay(false)}
						>
							Close
						</button>
					</form>
				</Overlay>
			)}
		</>
	);
};

export default Admin;

const Overlay = ({ children, onClose }) => {
	return (
		<div
			className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
			onClick={onClose}
		>
			<div
				className="bg-base-100 rounded-lg p-6 shadow-xl"
				onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
			>
				{children}
			</div>
		</div>
	);
};
