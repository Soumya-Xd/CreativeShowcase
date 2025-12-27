import { useState } from "react";
import { Heart, Eye, CornerRightUp } from "lucide-react";
import { Artwork } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { useLikes } from "../hooks/useLikes";
import { motion } from "framer-motion";

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
  const { user } = useAuth();
const { isLiked, toggleLike, isLiking } = useLikes(
  artwork._id,
  artwork.is_liked
);

  const [imageLoaded, setImageLoaded] = useState(false);

  const imageUrl = artwork.image_url.startsWith("http")
    ? artwork.image_url
    : `http://localhost:5000${artwork.image_url}`;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    toggleLike(artwork._id);
  };

  return (
    <div className="group relative bg-black border border-white/10 transition-all duration-500 hover:border-indigo-500/50">
      {/* CORNER ACCENTS (Premium Industrial Look) */}
      <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
      <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

      {/* TECHNICAL TOP BAR */}
      <div className="flex justify-between items-center px-4 py-2 bg-white/5 border-b border-white/5">
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          Status_Verified
        </span>
        <span className="text-[9px] font-mono text-slate-600">
          INDEX_{artwork._id.slice(-6).toUpperCase()}
        </span>
      </div>

      {/* IMAGE CONTAINER (No rounding) */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-900 border-b border-white/5">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-800 animate-pulse" />
        )}

        <motion.img
          src={imageUrl}
          alt={artwork.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          initial={{ scale: 1.1, filter: "grayscale(1) contrast(1.2)" }}
          animate={
            imageLoaded
              ? { scale: 1, filter: "grayscale(0) contrast(1)" }
              : {}
          }
          whileHover={{ scale: 1.05 }}
          transition={{
            duration: 1.5,
            ease: [0.19, 1, 0.22, 1]
          }}
          className="w-full h-full object-cover will-change-transform"
        />

        {/* HOVER OVERLAY (Sharp & Minimal) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
          <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <h3 className="text-xl text-white font-bold tracking-tight mb-2">
              {artwork.title}
            </h3>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.2em] mb-4">
              Authorized Creator: {artwork.artist?.username || "Verified User"}
            </p>
          </div>
        </div>
      </div>

      {/* ACTION BAR (Document Footer Style) */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-tighter">Access Date</span>
          <span className="text-[10px] font-mono text-slate-300">2025.12.25</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-slate-500 hover:text-white transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          
          <button
  onClick={toggleLike}
  disabled={!user || isLiking}
  className={`flex items-center gap-2 px-3 py-1 font-mono text-[10px] border transition-all ${
    isLiked
      ? "bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
      : "border-white/10 text-slate-400 hover:border-indigo-500/50 hover:text-indigo-400"
  }`}
>
  <Heart
    className={`w-3 h-3 transition-transform ${
      isLiked ? "fill-current scale-110" : ""
    }`}
  />
  {artwork.likes_count || 0}
</button>

        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;