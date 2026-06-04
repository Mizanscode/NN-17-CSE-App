import { Outlet } from "react-router";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { useEffect } from "react";

export default function Layout() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#161930] text-white">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
