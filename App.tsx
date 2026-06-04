import { Routes, Route } from "react-router";
import { Suspense, lazy } from "react";
import Layout from "./components/Layout";
import LoadingScreen from "./components/LoadingScreen";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const StudentDirectory = lazy(() => import("./pages/StudentDirectory"));
const StudentProfile = lazy(() => import("./pages/StudentProfile"));
const Notices = lazy(() => import("./pages/Notices"));
const Events = lazy(() => import("./pages/Events"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Resources = lazy(() => import("./pages/Resources"));
const TechNews = lazy(() => import("./pages/TechNews"));
const Alumni = lazy(() => import("./pages/Alumni"));
const Community = lazy(() => import("./pages/Community"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/directory" element={<StudentDirectory />} />
          <Route path="/directory/:id" element={<StudentProfile />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/news" element={<TechNews />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/community" element={<Community />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
