import { Menu, LogOut, ArrowLeft, ShieldCheck } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Props {
  onMenuClick: () => void;
}

const DashboardNavbar = ({ onMenuClick }: Props) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      className="
        fixed top-0 left-0 w-full z-[70]
        h-[70vh] md:h-[60vh]
        bg-gradient-to-b from-black/80 via-black/60 to-black/20
        backdrop-blur-2xl
        border-b border-white/5
        flex flex-col
      "
    >
      {/* ================= TOP BAR ================= */}
      <div className="h-20 px-6 md:px-12 flex items-center justify-between">
        
        {/* LEFT */}
        <div className="flex items-center gap-6">
          <button
            onClick={onMenuClick}
            className="
              group
              w-12 h-12
              flex flex-col items-center justify-center gap-1.5
              rounded-xl
              border border-white/10
              bg-white/5
              hover:border-indigo-500/50 hover:bg-indigo-500/5
              transition-all duration-500
            "
          >
            <div className="w-5 h-[1.5px] bg-white/60 group-hover:bg-indigo-400 transition-colors" />
            <div className="w-3 h-[1.5px] bg-white/60 group-hover:bg-indigo-400 group-hover:w-5 transition-all" />
          </button>

          <div className="flex flex-col">
            <h1 className="text-[10px] font-mono font-bold tracking-[0.5em] uppercase text-white/90 leading-none">
              Control_Terminal
            </h1>
            <span className="text-[8px] font-mono text-indigo-500 tracking-[0.25em] uppercase mt-1">
              v.2.0.25 // Stable
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-white/5 border border-white/5 rounded-full">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-mono text-white/30 uppercase">
                Auth_User
              </span>
              <span className="text-xs font-bold text-white">
                {user?.username}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-black border border-indigo-500/30 flex items-center justify-center">
              <ShieldCheck size={14} className="text-indigo-400" />
            </div>
          </div>

          <button
            onClick={signOut}
            className="
              group
              px-5 py-2.5
              rounded-xl
              bg-red-500/5 border border-red-500/20
              text-red-500 text-[10px] font-mono font-bold tracking-widest uppercase
              hover:bg-red-500 hover:text-white
              transition-all duration-500
            "
          >
            <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
            Disconnect
          </button>
        </div>
      </div>

      {/* ================= HERO CONTENT ================= */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="
            text-4xl md:text-6xl lg:text-7xl
            font-serif italic
            text-white
            tracking-tight
          "
        >
          System Control Interface
        </motion.h2>

        <p className="mt-6 max-w-xl text-white/30 font-mono text-xs uppercase tracking-[0.4em]">
          Administrative environment initialized · secure channel active
        </p>

        {/* ================= BACK TO MAIN PAGE ================= */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="
            mt-12
            flex items-center gap-4
            px-8 py-4
            rounded-full
            border border-indigo-500/40
            bg-indigo-500/10
            text-indigo-400
            font-mono font-bold text-[10px]
            tracking-[0.4em] uppercase
            hover:bg-indigo-500 hover:text-white
            hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]
            transition-all duration-700
          "
        >
          <ArrowLeft size={18} />
          Return_To_Archive
        </motion.button>
      </div>
    </header>
  );
};

export default DashboardNavbar;
