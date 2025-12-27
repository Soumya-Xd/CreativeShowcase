import React, { useEffect, useRef, useState } from "react";
import ArtworkCard from "./ArtworkCard";
import ArtworkModal from "./ArtworkModal";
import { Artwork } from "../lib/api";
import { useArtworks } from "../hooks/useArtworks";
import gsap from "gsap";
import { ChevronUp, ChevronDown, Fingerprint, MousePointer2 } from "lucide-react";
import { motion } from "framer-motion";

const StackedScrollGallery: React.FC = () => {
  const { artworks, loading } = useArtworks();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  /* ===============================
      GSAP STACK ANIMATION ENGINE
  =============================== */
  const animateStack = (index: number) => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const diff = i - index;

      if (i === index) {
        // Current Active Card
        gsap.to(card, {
          opacity: 1, scale: 1, z: 0, rotateX: 0, y: 0,
          filter: "blur(0px)", duration: 0.8, ease: "expo.out", zIndex: 100,
        });
      } else if (i < index) {
        // Previous Cards (Fly out top)
        gsap.to(card, {
          opacity: 0, y: -140, scale: 1.1,
          filter: "blur(20px)", duration: 0.8, zIndex: 0,
        });
      } else {
        // Future Cards (Depth Stack)
        gsap.to(card, {
          opacity: 0.3 / diff, scale: 1 - diff * 0.05, z: -diff * 60,
          y: diff * 30, rotateX: 10, filter: `blur(${diff * 4}px)`,
          duration: 0.8, zIndex: 10 - i,
        });
      }
    });
  };

  useEffect(() => {
    if (artworks.length > 0) animateStack(activeIndex);
  }, [artworks, activeIndex]);

  const navigate = (direction: 'up' | 'down') => {
    let newIndex = activeIndex;
    if (direction === 'up' && activeIndex > 0) newIndex--;
    if (direction === 'down' && activeIndex < artworks.length - 1) newIndex++;
    if (newIndex !== activeIndex) setActiveIndex(newIndex);
  };

  if (loading) return <LoadingScreen />;

  return (
    <section className="relative w-screen h-screen bg-[#020108] overflow-hidden flex items-center justify-center">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-500/10 blur-[200px] rounded-full" />
      </div>

      {/* ================= LEFT SIDE: ARCHIVE SPECS ================= */}
      <div className="absolute left-32 md:left-60 top-1/2 -translate-y-1/2 z-40">
        <div className="flex items-center gap-3 mb-6">
           <Fingerprint className="text-indigo-500 w-6 h-6 animate-pulse" />
           <div className="h-[1px] w-12 bg-white/10" />
           <span className="text-white/40 font-mono text-[6px] uppercase tracking-[0.3em]">System_v.2025</span>
        </div>
        
        <h2 className="text-6xl md:text-8xl font-serif italic text-white leading-[0.8] tracking-tighter">
          Visual <br /> 
          <span className="text-indigo-500 not-italic uppercase font-sans text-5xl md:text-7xl tracking-[0.2em] opacity-80">Archive.</span>
        </h2>

        <div className="mt-12 flex items-center gap-6">
            <div className="flex flex-col">
                <span className="text-indigo-500 font-mono text-[10px] uppercase tracking-widest">Latent_Space</span>
                <span className="text-white/40 font-mono text-[9px] uppercase tracking-tighter">Coord: 34.90 / -112.4</span>
            </div>
            <div className="w-[1px] h-10 bg-white/5" />
            <div className="flex flex-col">
                <span className="text-indigo-500 font-mono text-[10px] uppercase tracking-widest">Status</span>
                <span className="text-emerald-500 font-mono text-[9px] uppercase tracking-tighter animate-pulse">Sync_Established</span>
            </div>
        </div>
      </div>

      {/* ================= CENTER: STACK ================= */}
      <div className="relative w-full h-full flex items-center justify-center z-10" style={{ perspective: "2000px" }}>
        {artworks.map((artwork, index) => (
          <div
            key={artwork._id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="absolute w-[85vw] max-w-[460px] cursor-pointer"
            onClick={() => setSelectedArtwork(artwork)}
          >
            <div className="relative group transition-all duration-500 border border-white/5 hover:border-indigo-500/30">
              <ArtworkCard artwork={artwork} />
              <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          </div>
        ))}
      </div>

      {/* ================= NEW: SLIDING CONTROL DECORATIVE TEXT ================= */}
      <div className="absolute right-[22%] top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden xl:block">
        <div className="flex flex-col gap-1 origin-center rotate-180" style={{ writingMode: 'vertical-rl' }}>
            <span className="text-indigo-500 font-mono text-[8px] uppercase tracking-[0.8em] opacity-40">Sliding</span>
            <span className="text-white font-mono text-[8px] uppercase tracking-[0.8em] opacity-20">Control</span>
        </div>
      </div>

      {/* ================= RIGHT SIDE: COMMAND SLIDER ================= */}
      <div className="absolute right-30 md:right-60 top-1/2 -translate-y-1/2 z-40 h-[70vh] flex flex-col items-center justify-between py-8">
        
        {/* BIG COUNTER (Top) */}
        <div className="relative flex flex-col items-center">
            <motion.span 
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-8xl md:text-9xl font-sans font-black text-white/5 tracking-tighter leading-none select-none"
            >
                {String(activeIndex + 1).padStart(2, '0')}
            </motion.span>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="text-white font-mono text-2xl tracking-tighter">NO.{activeIndex + 1}</span>
                <span className="text-indigo-500 font-mono text-[10px] uppercase tracking-widest mt-1">Artifact</span>
            </div>
        </div>

        {/* INTERACTIVE TRACK (Middle) */}
        {/* INTERACTIVE TRACK (Middle) */}
        <div className="relative flex-1 w-14 flex flex-col items-center justify-center gap-4 group">
            {/* The Back Track Line - Slightly more visible */}
            <div className="absolute h-full w-[2px] bg-white/10 left-1/2 -translate-x-1/2 rounded-full" />
            
            {/* Nav Arrows - High Visibility Styling */}
            <button
              onClick={() => navigate('up')}
              disabled={activeIndex === 0}
              className="z-10 w-12 h-12 rounded-full border border-white/20 bg-black/60 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-indigo-400 hover:border-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all disabled:opacity-0 active:scale-75 shadow-lg"
            >
              <ChevronUp size={28} strokeWidth={2} />
            </button>

            {/* Progress Dots Track */}
            <div className="flex flex-col items-center gap-2 py-4">
              {artworks.map((_, i) => (
                <div 
                    key={i} 
                    onClick={() => setActiveIndex(i)}
                    className={`relative cursor-pointer transition-all duration-700 w-8 h-4 flex items-center justify-center`} 
                >
                    <div className={`h-[2px] transition-all duration-500 rounded-full ${
                        i === activeIndex ? 'w-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)] scale-y-150' : 'w-3 bg-white/30 hover:bg-white/60'
                    }`} />
                    
                    {i === activeIndex && (
                        <motion.div 
                          layoutId="active-indicator"
                          className="absolute -right-12 text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-widest hidden lg:block"
                        >
                          Active
                        </motion.div>
                    )}
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('down')}
              disabled={activeIndex === artworks.length - 1}
              className="z-10 w-12 h-12 rounded-full border border-white/20 bg-black/60 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-indigo-400 hover:border-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all disabled:opacity-0 active:scale-75 shadow-lg"
            >
              <ChevronDown size={28} strokeWidth={2} />
            </button>
        </div>

        {/* SYSTEM DATA (Bottom) */}
        <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                <MousePointer2 size={12} className="text-indigo-500 animate-bounce" />
            </div>
            <span className="text-white/20 font-mono text-[9px] uppercase tracking-widest">Scroll_To_NextPage</span>
        </div>
      </div>

      {selectedArtwork && (
        <ArtworkModal 
          artwork={selectedArtwork} 
          onClose={() => setSelectedArtwork(null)} 
          onNext={() => {
            const nextIdx = (activeIndex + 1) % artworks.length;
            setActiveIndex(nextIdx);
            setSelectedArtwork(artworks[nextIdx]);
          }}
          onPrev={() => {
            const prevIdx = (activeIndex - 1 + artworks.length) % artworks.length;
            setActiveIndex(prevIdx);
            setSelectedArtwork(artworks[prevIdx]);
          }}
        />
      )}
    </section>
  );
};

/* ================= LOADER ================= */
const LoadingScreen = () => (
    <section className="w-screen h-screen bg-[#020108] flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
          <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-t-2 border-indigo-500 rounded-full animate-spin" />
              <div className="absolute inset-4 border-b-2 border-white/10 rounded-full animate-spin-slow" />
          </div>
          <div className="text-indigo-500 font-mono text-[10px] uppercase tracking-[1em] animate-pulse">
            Accessing_Archive
          </div>
      </div>
    </section>
);

export default StackedScrollGallery;