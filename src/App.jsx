import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Convert from "./pages/Convert";
import Login from "./pages/Login";
import ErrorPage from "./pages/ErrorPage";
import Account from "./pages/Account";

export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} errorElement={<ErrorPage />}/>
                <Route path="convert" element={<Convert />} />
                <Route path="account" element={<Account />} />
                <Route path="login" element={<Login />} />
            </Routes>
        </>
    );
}