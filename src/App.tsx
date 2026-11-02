import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import BottomNav from "./components/BottomNav";
import DreamcatcherCharm from "./components/DreamcatcherCharm";
import AmbientGlow from "./components/AmbientGlow";
import Maintenance from "./pages/Maintenance";

const LIVE_KEY = "ajitha-live";
/** Visiting this path unlocks the real site for the browser session. */
const LIVE_PATH = "/home";

export default function App() {
  const location = useLocation();
  const commanded = location.pathname === LIVE_PATH;
  const [live, setLive] = useState(
    () => sessionStorage.getItem(LIVE_KEY) === "1",
  );

  useEffect(() => {
    if (!commanded) return;
    sessionStorage.setItem(LIVE_KEY, "1");
    setLive(true);
  }, [commanded]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  if (!live && !commanded) {
    return <Maintenance />;
  }

  return (
    <MotionConfig reducedMotion="user">
      <AmbientGlow />
      <div className="relative z-[1] flex min-h-svh flex-col">
        <Navbar />
        <main className="max-w-[100vw] flex-1 overflow-x-clip pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
          <Outlet />
        </main>
        <Footer />
        <DreamcatcherCharm />
        <WhatsAppButton />
        <BottomNav />
      </div>
    </MotionConfig>
  );
}
