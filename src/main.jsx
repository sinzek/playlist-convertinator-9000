import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter
} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import Convert from "./pages/Convert.jsx";
import Account from "./pages/Account.jsx";
import Login from "./pages/Login.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "convert",
    element: <Convert />,
  },
  {
    path: "account",
    element: <Account />,
  },
  {
    path: "login",
    element: <Login />,
  },
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
    <RouterProvider router={router} />
	</StrictMode>
);
