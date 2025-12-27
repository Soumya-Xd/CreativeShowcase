import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Shield,
  Aperture,
  Globe,
  Info,
  Activity,
  Menu,
  ArrowRight,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
  }, [open]);

  const handleNavClick = (sectionIndex: number) => {
    setOpen(false);
    setIsHovering(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("scrollToSection", { detail: sectionIndex })
        );
      }, 150);
    } else {
      window.dispatchEvent(
        new CustomEvent("scrollToSection", { detail: sectionIndex })
      );
    }
  };

  const desktopNavLink =
    "group relative flex items-center gap-2 py-1 text-[9px] tracking-[0.5em] uppercase font-bold text-white/30 hover:text-rose-500 transition-all duration-500 cursor-pointer";

  return (
    <>
      {/* Background Dimmer */}
      <div
        className={`fixed inset-0 z-[90] pointer-events-none transition-all duration-1000 ${
          isHovering
            ? "bg-black/60 backdrop-blur-md"
            : "bg-transparent opacity-0"
        }`}
      />
      <header
        className={`fixed top-0 w-full z-[100] transition-all duration-700 border-b ${
          scrolled
            ? "py-4 bg-[#050102]/95 border-rose-900/20 backdrop-blur-xl"
            : "py-8 bg-transparent border-transparent"
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group z-10">
            <div className="relative w-7 h-7 border border-rose-500/40 flex items-center justify-center rotate-45 group-hover:rotate-180 transition-transform duration-1000">
              <div className="w-1 h-1 bg-rose-500 shadow-[0_0_10px_#f43f5e]" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[11px] font-black tracking-[0.3em] uppercase text-white">
                Creative
              </span>
              <span className="text-[7px] font-mono tracking-[0.4em] uppercase text-rose-500/60">
                Showcase
              </span>
            </div>
          </Link>
          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-10">
            {[
              { label: "Home", idx: 0, icon: Aperture },
              { label: "Gallery", idx: 1, icon: Activity },
              { label: "About", idx: 2, icon: Info },
              { label: "Explore", idx: 3, icon: Globe },
              { label: "Contact", idx: 4, icon: Shield },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.idx)}
                className={desktopNavLink}
              >
                <item.icon
                  size={10}
                  className="opacity-20 group-hover:opacity-100 transition-all"
                />
                <span>{item.label}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-rose-600 group-hover:w-full transition-all" />
              </button>
            ))}
          </nav>
          {/* USER ACTIONS */}
          <div className="hidden lg:flex items-center gap-8">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-5 py-2 bg-rose-600/5 border border-rose-500/20 text-rose-500 text-[9px] tracking-[0.3em] uppercase font-bold hover:bg-rose-600 hover:text-white transition-all"
                >
                  <LayoutDashboard size={12} />
                  Dashboard
                </Link>

                {/* SIGN OUT BUTTON */}
                <button
                  onClick={() => {
                    signOut();
                    navigate("/");
                  }}
                  className="text-[9px] tracking-[0.4em] uppercase font-bold text-white/20 hover:text-rose-500 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="relative group overflow-hidden border border-white/10 px-8 py-2.5"
              >
                <span className="relative z-10 text-white text-[9px] tracking-[0.5em] uppercase font-bold group-hover:text-black transition-colors">
                  Login
                </span>
                <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform" />
              </Link>
            )}
          </div>
        {/* ================= MOBILE TOGGLE (FIXED – TOUCH SAFE) ================= */}
<button
  onMouseEnter={() => setIsHovering(true)}
  onMouseLeave={() => setIsHovering(false)}
  onPointerDown={() => setOpen(true)}
  className="lg:hidden flex flex-col items-center justify-center gap-1.5 w-10 h-10 border border-white/10 bg-white/5 text-white rounded-lg transition-all active:scale-90"
>
  <div className="w-5 h-[1.5px] bg-rose-500" />
  <div className="w-3 h-[1.5px] bg-white self-end mr-2" />
</button>
</div>
</header>

{/* ================= MOBILE MENU OVERLAY ================= */}
<AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 bg-[#0a0104] z-[200] flex flex-col p-8 md:p-16 overflow-hidden lg:hidden"
    >
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="flex justify-between items-center mb-12 md:mb-20 z-10">
        <div className="flex flex-col">
          <span className="text-rose-500 font-mono text-[9px] tracking-[0.6em] uppercase">
            System_Access
          </span>
          <span className="text-white/20 font-mono text-[7px] tracking-[0.4em] uppercase">
            v4.0.12_Node_Active
          </span>
        </div>

        <button
          onClick={() => setOpen(false)}
          className="w-12 h-12 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors rounded-full bg-white/5"
        >
          <X size={24} strokeWidth={1} />
        </button>
      </div>

      <nav className="flex flex-col gap-2 md:gap-4 z-10">
        {[
          { label: "Manifest", idx: 0 },
          { label: "Archive", idx: 1 },
          { label: "Manifesto", idx: 2 },
          { label: "Protocols", idx: 3 },
          { label: "Uplink", idx: 4 },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => handleNavClick(item.idx)}
            className="text-left group flex items-center gap-6 border-b border-white/5 py-4 md:py-6"
          >
            <span className="text-rose-900 font-mono text-sm md:text-lg group-hover:text-rose-500 transition-colors">
              0{item.idx + 1}
            </span>
            <span className="text-4xl md:text-7xl font-serif italic text-white/20 group-hover:text-white transition-all duration-500 group-hover:translate-x-4">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-8 flex flex-col md:flex-row justify-between items-start md:items-end z-10 gap-8 md:gap-0">
        <div className="flex flex-col gap-4">
          {!user ? (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="text-2xl md:text-3xl text-rose-500 uppercase tracking-widest font-black flex items-center gap-3 group"
            >
              Initialize_
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="text-2xl text-white font-serif italic"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
                className="text-rose-900 text-left hover:text-rose-500 uppercase tracking-widest transition-colors font-mono text-xs"
              >
                Terminate_Session
              </button>
            </div>
          )}
        </div>

        <span className="text-white/5 text-[8px] font-mono uppercase tracking-[0.5em]">
          System_EOD_Transmission
        </span>
      </div>
    </motion.div>
  )}
</AnimatePresence>

    </>
  );
}
