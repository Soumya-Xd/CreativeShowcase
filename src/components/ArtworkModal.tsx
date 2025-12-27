import React, { useEffect } from 'react';
import { X, Heart, User, Calendar, Plus, Share2, Info, ShieldCheck, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Artwork } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useLikes } from '../hooks/useLikes';
import { useFollows } from '../hooks/useFollows';
import { motion, AnimatePresence } from 'framer-motion';

interface ArtworkModalProps {
  artwork: Artwork;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({ artwork, onClose, onNext, onPrev }) => {
  const { user } = useAuth();
  const { isLiked, toggleLike, isLiking } = useLikes(artwork._id, artwork.is_liked);
  const { isFollowing, toggleFollow, loading } = useFollows(artwork.artist.isFollowing ?? false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const imageUrl = artwork.image_url.startsWith('http') 
    ? artwork.image_url 
    : `http://localhost:5000${artwork.image_url}`;

  // ================= SHARE HANDLER =================
  const handleShare = async () => {
    const shareData = {
      title: artwork.title,
      text: `Check out "${artwork.title}" by ${artwork.artist.username} on Crimson Archive.`,
      url: window.location.href, // Or a specific link to this artwork
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Archive link copied to clipboard.');
      } catch (err) {
        console.error('Clipboard error:', err);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-0 md:p-10"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.98, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-[#030108] w-full h-full md:h-auto md:max-w-7xl border border-white/10 flex flex-col lg:flex-row shadow-[0_0_100px_rgba(0,0,0,1)] overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Buttons */}
        <button 
          onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
          className="absolute -left-16 lg:-left-24 top-1/2 -translate-y-1/2 z-[110] group hidden md:flex flex-col items-center gap-4"
        >
          <div className="w-12 h-24 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center gap-3 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/5 transition-all duration-500">
            <ChevronLeft className="text-white/40 group-hover:text-white" size={24} />
          </div>
          <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-white/20 group-hover:text-indigo-400 transition-colors rotate-180 [writing-mode:vertical-lr]">Previous</span>
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); onNext?.(); }}
          className="absolute -right-16 lg:-right-24 top-1/2 -translate-y-1/2 z-[110] group hidden md:flex flex-col items-center gap-4"
        >
          <div className="w-12 h-24 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center gap-3 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/5 transition-all duration-500">
            <ChevronRight className="text-white/40 group-hover:text-white" size={24} />
          </div>
          <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-white/20 group-hover:text-indigo-400 transition-colors [writing-mode:vertical-lr]">Next_Entry</span>
        </button>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 border border-white/10 bg-black/50 hover:bg-white hover:text-black transition-all text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Artifact View */}
        <div className="w-full lg:w-[60%] h-[40vh] lg:h-[85vh] bg-[#020106] flex items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <AnimatePresence mode='wait'>
            <motion.img
              key={artwork._id}
              src={imageUrl}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="max-w-full max-h-full object-contain z-10 shadow-[0_0_80px_rgba(79,70,229,0.1)]"
            />
          </AnimatePresence>
        </div>

        {/* Right: Specs */}
        <div className="w-full lg:w-[40%] flex flex-col h-full lg:h-[85vh] border-l border-white/10 bg-white/[0.01]">
          <div className="flex-1 overflow-y-auto p-8 md:p-10 custom-scrollbar">
            <header className="mb-12">
               <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-mono uppercase tracking-[0.4em] mb-4">
                  <ShieldCheck className="w-3 h-3" /> Authenticity_Verified
               </div>
               <h2 className="text-4xl font-bold text-white mb-6 tracking-tighter">{artwork.title}</h2>
               <div className="flex gap-6 text-slate-500 font-mono text-[10px] uppercase">
                  <div className="flex items-center gap-1.5">
                       <Calendar className="w-3 h-3 text-indigo-500/50" />
                       {new Date(artwork.createdAt).toLocaleDateString()}
                  </div>
               </div>
            </header>

            <section className="mb-12 border-l border-white/5 pl-6">
               <h3 className="text-slate-300 text-[11px] font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-2 text-indigo-400">
                  <Info className="w-3.5 h-3.5" /> Catalog_Description
               </h3>
               <p className="text-slate-500 italic text-sm">"{artwork.description || "No technical log available."}"</p>
            </section>

            {/* Artist Protocol Card */}
            {artwork.artist && (
               <div className="border border-white/5 p-6 relative bg-white/[0.02]">
                  <h3 className="text-slate-700 text-[8px] font-mono uppercase tracking-[0.4em] mb-4">Origin_Source</h3>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 border border-white/10 flex items-center justify-center bg-white/5">
                      <User className="w-5 h-5 text-white/40" />
                    </div>
                    <div>
                       <p className="text-white text-sm font-bold uppercase">{artwork.artist.username}</p>
                       <p className="text-slate-600 text-[9px] font-mono">{artwork.artist.email}</p>
                    </div>
                  </div>
                  
                  {user?.id !== artwork.artist.id && (
                    <button
                      disabled={loading}
                      onClick={() => toggleFollow(artwork.artist.id)}
                      className={`w-full py-3 border text-[10px] font-mono uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition-all ${
                        isFollowing
                          ? "bg-blue-500/20 border-blue-500 text-blue-300"
                          : "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20"
                      }`}
                    >
                      {loading ? "Processing..." : isFollowing ? <>✔ Following</> : <>＋ Follow</>}
                    </button>
                  )}
               </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-8 border-t border-white/10 flex gap-4 bg-black/40">
            <button
              onClick={toggleLike}
              disabled={isLiking}
              className={`flex-1 flex items-center justify-center gap-3 py-4 font-mono uppercase tracking-[0.2em] text-[11px] transition-all border ${
                isLiked
                  ? "bg-red-500/10 border-red-500 text-red-500"
                  : "bg-white/5 border-white/10 text-slate-400 hover:border-indigo-500/50 hover:text-white"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current scale-110" : ""}`} />
              {isLiked ? "Log_Authenticated" : "Authenticate_Entry"}
            </button>

            {/* Functional Share Button */}
            <button 
              onClick={handleShare}
              className="w-14 h-14 border border-white/10 flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 transition-all bg-white/5"
            >
               <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ArtworkModal;