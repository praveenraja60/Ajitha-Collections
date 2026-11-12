import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import BottomNav from "./components/BottomNav";
import DreamcatcherCharm from "./components/DreamcatcherCharm";
import AmbientGlow from "./components/AmbientGlow";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <AmbientGlow />
      <div className="relative z-[1] flex min-h-svh flex-col">
        <Navbar />
        <main className="max-w-[100vw] flex-1 overflow-x-clip pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
        <Footer />
        <DreamcatcherCharm />
        <WhatsAppButton />
        <BottomNav />
      </div>
    </MotionConfig>
  );
}
