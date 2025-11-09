import Home from "@/pages/Home";
import { Routes, Route } from "react-router-dom";


export default function AppRoute() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    )
}