import { createBrowserRouter, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Convert from "./pages/Convert";
import Login from "./pages/Login";
import ErrorPage from "./pages/ErrorPage";
import Account from "./pages/Account";

export const router = createBrowserRouter([
    {
        path: "/", 
        element: <App />,
        errorElement: <><Navbar /><ErrorPage /></>,
        children:[
             {
                path: "/",
                element: <Home />,
                errorElement: <ErrorPage />
             },
             {
                path: "/convert",
                element: <Convert />
             },
             {
                path: "/account",
                element: <Account />
            },
            {
                path: "/login",
                element: <Login />
            },
        ]
    }
]);

function App() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}