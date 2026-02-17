import AppLayout from "@/layout/AppLayout";
import ProtectedLayout from "@/layout/ProtectedLayout";
import Denied from "@/pages/Denied";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
import { Routes, Route } from "react-router-dom";

export default function AppRoute() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/" element={<Landing />} />
        <Route element={<ProtectedLayout />}>
          <Route path="home" element={<Home />} />
        </Route>
        <Route path="/*" element={<NotFound />} />
        <Route path="/denied" element={<Denied />} />
      </Route>
    </Routes>
  );
}
