import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import Convert from "./pages/Convert.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "convert",
    element: <Convert />,
  }
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Navbar />
    <RouterProvider router={router} />
	</StrictMode>
);
