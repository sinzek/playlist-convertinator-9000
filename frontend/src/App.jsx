import { createBrowserRouter, Outlet, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Convert from "./pages/Convert";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import useAuth from "./context/useAuth";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <MainApp />,
		errorElement: (
			<>
				<Navbar />
				<ErrorPage />
			</>
		), // looks ugly like this but whatever
		children: [
			{
				path: "/",
				element: <Home />,
				errorElement: <ErrorPage />,
			},
			{
				element: <ProtectedRoutes allowedRoles = {["user", "admin"]}/>, // routes that require user to be logged in to access
				children: [
					{
						path: "/account",
						element: <Account />,
					},
				],
			},
			{
				path: "/convert",
				element: <Convert />,
			},
			{
				path: "/create-account",
				element: <Register />,
			},
			{
				path: "/log-in",
				element: <Login />,
			},
            {
				path: "/unauthorized",
				element: <ErrorPage />,
			},
            {
				element: <ProtectedRoutes allowedRoles = {["admin"]} />, // routes that require user to have role admin to access
				children: [
					{
						path: "/admin",
						element: <Admin />,
					},
				],
			},
		],
	},
]);

function MainApp() {
	return (
		<>
			<Navbar />
			<Outlet />
		</>
	);
}

function ProtectedRoutes({allowedRoles}) {
	const { auth } = useAuth();
    const location = useLocation();
	return (
		<>
            {allowedRoles?.includes(auth?.role) ? (
                <Outlet />
            ) : (
                auth?.isAuthenticated ? (
                    <Navigate to="/unauthorized" state={{ from: location }} replace />
                ) : (
                    <Navigate to="/log-in" state={{ from: location }} replace />
                )
            )}
		</>
	);
}