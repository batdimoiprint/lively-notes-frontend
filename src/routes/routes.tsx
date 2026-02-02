import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
import { Routes, Route } from "react-router-dom";


export default function AppRoute() {

// TODO: Add JWT token user generation to backend

    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="home" element={<Home />} />
            <Route path="/*" element={<NotFound />} />
        </Routes>
    )
}