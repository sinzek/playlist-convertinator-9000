import { createBrowserRouter, Outlet, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Convert from "./pages/Convert";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";
import Account from "./pages/Account";
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
				element: <LoginProtectedRoutes />, // routes that require user to be logged in to access
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

function LoginProtectedRoutes() {
	const { auth } = useAuth();
    const location = useLocation();
	return (
		<>
			{auth?.isAuthenticated ? (
				<Outlet />
			) : (
				<Navigate to="/log-in" state={{ from: location }} replace />
			)}
		</>
	);
}
