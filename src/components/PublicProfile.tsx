import { useParams, useNavigate } from 'react-router-dom';
import { usersAPI, artworksAPI, Artwork } from '../lib/api';
import { useEffect, useState, useCallback } from 'react';
import ArtworkCard from '../components/ArtworkCard';
import ArtworkModal from '../components/ArtworkModal';
import Masonry from 'react-masonry-css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Fingerprint, 
  Activity, 
  Box, 
  Heart, 
  Users, 
  Zap, 
  ShieldAlert, 
  X, 
  Lock, 
  ChevronRight,
  Terminal
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PublicProfile = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthAlert, setShowAuthAlert] = useState(false);

  /* ===============================
      PRIVACY PROTECTION
  =============================== */
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', prevent);
    document.addEventListener('dragstart', prevent);
    return () => {
      document.removeEventListener('contextmenu', prevent);
      document.removeEventListener('dragstart', prevent);
    };
  }, []);

  /* ===============================
      FETCH DATA
  =============================== */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await usersAPI.getProfile(username!);
        setProfile(profileRes.user);
        const artworksRes = await artworksAPI.getUserArtworks(profileRes.user.id);
        setArtworks(artworksRes.artworks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  // Auth check for Like action (Used by card buttons)
  const handleLikeAttempt = useCallback(() => {
    if (!user) {
      setShowAuthAlert(true);
    }
  }, [user]);

  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    1024: 2,
    640: 1
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05010a] flex flex-col items-center justify-center">
        <Activity className="text-rose-500 animate-spin mb-4" size={32} />
        <span className="font-mono text-[10px] text-rose-500 tracking-[0.5em] uppercase">Accessing_Node...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020106] text-white overflow-x-hidden selection:bg-rose-500/30">
      
      {/* ================= PREMIUM AUTH POPUP ================= */}
      <AnimatePresence>
        {showAuthAlert && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthAlert(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[400px] bg-[#0a0104] border border-rose-500/30 shadow-[0_0_80px_rgba(225,29,72,0.15)] overflow-hidden"
            >
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
              <div className="p-8 md:p-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-6 border border-rose-500/20">
                  <Lock className="text-rose-500 animate-pulse" size={28} />
                </div>
                <h3 className="text-xl font-serif italic mb-2 tracking-tighter text-white">Interaction_Blocked</h3>
                <span className="text-[8px] font-mono text-rose-500/60 uppercase tracking-[0.4em] mb-6">Error: 401_Auth_Required</span>
                <p className="text-[11px] font-mono text-white/40 leading-relaxed uppercase tracking-wider mb-8">
                  Logging unit likes and neural bookmarks requires an established session. Please initialize your link.
                </p>
                <div className="flex flex-col w-full gap-3">
                  <button onClick={() => navigate('/login')} className="w-full py-4 bg-rose-600 text-white font-mono text-[10px] uppercase font-bold tracking-widest hover:bg-rose-500 transition-all">Initialize_Terminal</button>
                  <button onClick={() => setShowAuthAlert(false)} className="w-full py-4 border border-white/5 text-white/20 font-mono text-[9px] uppercase tracking-[0.4em] hover:text-white transition-all">Abort_Access</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= HEADER ================= */}
      <div className="relative pt-32 pb-20 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 flex items-center justify-center gap-3">
              <Fingerprint className="text-rose-500 animate-pulse" size={24} />
              <div className="h-[1px] w-12 bg-rose-900/50" />
              <span className="text-rose-500 font-mono text-[10px] uppercase tracking-[0.6em]">Node_Data_Report</span>
            </motion.div>
            <h1 className="text-6xl md:text-9xl font-serif italic tracking-tighter mb-4 uppercase">
              {profile.username}<span className="text-rose-600 opacity-50">.vault</span>
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-12 mx-auto">
              {[
                { label: 'Artifacts', val: profile.artworkCount, icon: Box },
                { label: 'Links', val: profile.followersCount, icon: Users },
                { label: 'Likes', val: profile.totalLikes, icon: Heart },
                { label: 'Node_Security', val: 'Level_4', icon: Zap }
              ].map((stat, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 p-4 flex flex-col items-center">
                  <stat.icon size={14} className="text-rose-500 mb-2 opacity-40" />
                  <span className="text-xl font-bold font-mono tracking-tighter">{stat.val}</span>
                  <span className="text-[7px] font-mono uppercase tracking-[0.3em] mt-1 text-white/20">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
        </div>
      </div>

      {/* ================= MOSAIC GALLERY ================= */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-20">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto gap-6"
          columnClassName="bg-clip-padding"
        >
          {artworks.map((artwork, idx) => (
            <motion.div
              key={artwork._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="mb-6 group"
            >
              <div className="border border-white/5 bg-white/[0.01]">
                {/* Passing handleLikeAttempt to the card. 
                   Ensure your ArtworkCard component uses this prop for the Like button.
                */}
                <ArtworkCard 
                  artwork={artwork} 
                  onImageClick={setSelectedArtwork} 
                  onLikeClick={handleLikeAttempt} 
                />
              </div>
            </motion.div>
          ))}
        </Masonry>
      </div>

      {/* ================= STICKY FOOTER BRANDING ================= */}
      <div className="py-20 text-center border-t border-white/5">
         {user ? (
           <span className="text-[8px] font-mono uppercase tracking-[1em] opacity-20">
             Crimson_Archive_Vault_Sync_Established
           </span>
         ) : (
           <div 
             onClick={() => navigate('/login')}
             className="flex flex-col items-center gap-3 cursor-pointer group"
           >
              <Terminal size={16} className="text-rose-500 animate-pulse group-hover:scale-125 transition-transform" />
              <span className="text-[9px] font-mono uppercase tracking-[0.5em] text-rose-500 font-bold group-hover:text-white transition-colors">
                Initialize_Link_To_Sync_Units_
              </span>
           </div>
         )}
      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {selectedArtwork && (
          <ArtworkModal
            artwork={selectedArtwork}
            onClose={() => setSelectedArtwork(null)}
            onNext={() => {
              const currentIdx = artworks.findIndex(a => a._id === selectedArtwork._id);
              if (currentIdx < artworks.length - 1) setSelectedArtwork(artworks[currentIdx + 1]);
            }}
            onPrev={() => {
              const currentIdx = artworks.findIndex(a => a._id === selectedArtwork._id);
              if (currentIdx > 0) setSelectedArtwork(artworks[currentIdx - 1]);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublicProfile;