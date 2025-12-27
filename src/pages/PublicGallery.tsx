import { useEffect, useState, useMemo, useCallback } from "react";
import { useArtworks } from "../hooks/useArtworks";
import ArtworkCard from "../components/ArtworkCard";
import Masonry from "react-masonry-css";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Sparkles, Search, X, Lock, Terminal } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const PublicGallery = () => {
  const { artworks, loading, toggleLikeLocally } = useArtworks();
  const { user } = useAuth();
  const navigate = useNavigate();

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthAlert, setShowAuthAlert] = useState(false);

  /* ===============================
      PRIVACY PROTECTION
  =============================== */
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("dragstart", prevent);
    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("dragstart", prevent);
    };
  }, []);

  /* ===============================
      TAG-BASED SEARCH LOGIC
  =============================== */
  const filteredArtworks = useMemo(() => {
    if (!searchQuery) return artworks;
    const query = searchQuery.toLowerCase();
    return artworks.filter((art) => 
      art.tags?.some((tag: string) => tag.toLowerCase().includes(query)) ||
      art.title?.toLowerCase().includes(query)
    );
  }, [searchQuery, artworks]);

  // Handle Likes or Interaction attempts
  const handleInteraction = useCallback(() => {
    if (!user) {
      setShowAuthAlert(true);
      return false; // Prevent action
    }
    return true; // Allow action
  }, [user]);

  const breakpointColumnsObj = {
    default: 5,
    1536: 4,
    1280: 3,
    1024: 2,
    640: 1,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020108] flex flex-col items-center justify-center">
        <Activity className="text-indigo-500 animate-spin mb-4" size={32} />
        <span className="text-indigo-500 font-mono text-[10px] uppercase tracking-[0.6em]">
          Syncing_Global_Archive...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020108] text-white overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* ================= PREMIUM AUTH POPUP ================= */}
      <AnimatePresence>
        {showAuthAlert && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAuthAlert(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[400px] bg-[#0a0104] border border-indigo-500/30 shadow-[0_0_80px_rgba(79,70,229,0.15)] overflow-hidden"
            >
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
              <div className="p-8 md:p-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20">
                  <Lock className="text-indigo-500 animate-pulse" size={28} />
                </div>
                <h3 className="text-xl font-serif italic mb-2 tracking-tighter text-white">Action_Restricted</h3>
                <p className="text-[11px] font-mono text-white/40 leading-relaxed uppercase tracking-wider mb-8">
                  Authentication is required to log interactions and sync archival units. Please initialize your session.
                </p>
                <div className="flex flex-col w-full gap-3">
                  <button onClick={() => navigate('/login')} className="w-full py-4 bg-indigo-600 text-white font-mono text-[10px] uppercase font-bold hover:bg-indigo-500 transition-all">
                    Initialize_Terminal
                  </button>
                  <button onClick={() => setShowAuthAlert(false)} className="w-full py-4 border border-white/5 text-white/20 font-mono text-[9px] uppercase tracking-[0.4em] hover:text-white transition-all">
                    Abort_Access
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= HEADER ================= */}
      <div className="pt-40 pb-20 text-center px-6 border-b border-white/5 relative">
        <div className="flex justify-center items-center gap-3 mb-6 relative">
          <Sparkles className="text-indigo-500 animate-pulse" size={20} />
          <span className="text-indigo-500 font-mono text-[10px] uppercase tracking-[0.6em]">
            Central_Registry_Scan
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter relative">
          The <span className="text-indigo-500 not-italic uppercase font-sans font-bold tracking-[0.1em]">Archive.</span>
        </h1>

        {/* ================= SEARCH BAR ================= */}
        <div className="mt-12 max-w-xl mx-auto relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-indigo-500/50">
            <Search size={18} />
          </div>
          <input 
            type="text"
            placeholder="FILTER_BY_TAGS_OR_TITLE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 py-5 pl-14 pr-12 rounded-full font-mono text-[11px] tracking-widest text-white focus:outline-none focus:border-indigo-500/50 transition-all"
          />
          {searchQuery && (
            <X 
              size={16} 
              onClick={() => setSearchQuery("")}
              className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-white/20 hover:text-white" 
            />
          )}
        </div>
      </div>

      {/* ================= MOSAIC ================= */}
      <div className="max-w-[2000px] mx-auto px-6 md:px-12 py-20 min-h-[60vh]">
        {filteredArtworks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 opacity-20">
            <Terminal size={40} className="mb-4" />
            <p className="font-mono text-xs uppercase tracking-[0.5em]">No_Artifacts_Found</p>
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex gap-6"
            columnClassName="bg-clip-padding"
          >
            {filteredArtworks.map((artwork, idx) => (
              <motion.div
                key={artwork._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 10) * 0.05 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                <div className="relative border border-white/5 bg-white/[0.01]">
                  <ArtworkCard 
                    artwork={artwork} 
                    onLikeClick={handleInteraction}
                    toggleLikeLocally={toggleLikeLocally}
                  />
                </div>
              </motion.div>
            ))}
          </Masonry>
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="py-20 text-center border-t border-white/5">
        <span className="text-[8px] font-mono uppercase tracking-[1em] opacity-10">
          GLOBAL_VISUAL_ARCHIVE_PROTOCOL
        </span>
      </div>
    </div>
  );
};

export default PublicGallery;