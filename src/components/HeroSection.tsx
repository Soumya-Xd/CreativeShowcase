import React, { useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const HeroSection: React.FC = () => {
  const lightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  /* ===============================
      Deeper Mouse Physics
  =============================== */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 90 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);

    /* ===============================
        GSAP CINEMATIC REVEAL
    =============================== */
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.fromTo(".bg-overlay", { opacity: 0 }, { opacity: 1, duration: 2 })
      .fromTo(titleRef.current, 
        { y: 100, opacity: 0, skewY: 7 }, 
        { y: 0, opacity: 1, skewY: 0, duration: 1.8, delay: -1.5 }
      )
      .fromTo(".hero-p", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.5, delay: -1.2, stagger: 0.1 }
      )
      .fromTo(imageRef.current, 
        { scale: 1.2, opacity: 0, filter: "blur(20px)" }, 
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 2.5, delay: -1.5 }
      )
      .fromTo(".premium-btn", 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 1.2, delay: -1 }
      );

    gsap.to(lightRef.current, {
      x: "150%",
      duration: 20,
      repeat: -1,
      ease: "none",
    });

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleExplore = () => {
    gsap.to(window, {
      scrollTo: "#gallery",
      duration: 1.5,
      ease: "expo.inOut",
    });
  };

  return (
    // Changed BG to a very deep Maroon-Black (#0a0104)
    <section ref={containerRef} className="relative w-full min-h-screen overflow-hidden bg-[#0a0104] flex items-center font-inter py-20 lg:py-0">
      
      {/* ================= DEEPER GRADIENT MOUSE LIGHTS ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-overlay">
        <motion.div 
          style={{ x: smoothX, y: smoothY }}
          className="absolute inset-0 opacity-80"
        >
          {/* Main Maroon Glow - Deep Crimson (#4c0519) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[1000px] h-[300px] md:h-[1000px] bg-rose-950/40 blur-[80px] md:blur-[200px] rounded-full" />
        </motion.div>

        <motion.div 
          style={{ 
            x: useTransform(smoothX, v => v * 1.4), 
            y: useTransform(smoothY, v => v * 1.4) 
          }}
          className="absolute inset-0 opacity-30 mix-blend-soft-light"
        >
          {/* Subtle Orange/Gold Core for Maroon richness (#92400e) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] md:w-[500px] h-[200px] md:h-[500px] bg-amber-900/30 blur-[60px] md:blur-[120px] rounded-full" />
        </motion.div>
      </div>

      {/* ================= CINEMATIC LASER ================= */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {/* Laser line changed to a soft Rose-Gold/Copper hue */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500/20 to-transparent opacity-30" />
        <div ref={lightRef} className="absolute top-0 left-[-50%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:grid lg:grid-cols-2 items-center h-full gap-12 lg:gap-0">
        
        {/* LEFT – TEXT */}
        <div className="text-center lg:text-left order-2 lg:order-1">
          <motion.div className="flex items-center justify-center lg:justify-start gap-2 mb-6 md:mb-8 opacity-0 hero-p">
            <span className="w-8 md:w-12 h-[2px] bg-gradient-to-r from-rose-500 to-rose-800" />
            <span className="text-rose-500 text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.6em] font-bold">Creative Showcase</span>
          </motion.div>

          <h1 ref={titleRef} className="text-5xl md:text-7xl lg:text-9xl font-cinematic text-white leading-[1.1] lg:leading-[0.9] tracking-tighter opacity-0">
            The <br /> <span className="bg-gradient-to-br from-white via-rose-100 to-rose-400 bg-clip-text text-transparent">Storyteller.</span>
          </h1>

          <p className="mt-6 md:mt-10 text-rose-100/30 text-base md:text-xl max-w-md mx-auto lg:mx-0 font-light leading-relaxed opacity-0 hero-p">
             A platform for artists to tell stories through visuals, motion,
            and emotion — crafted with cinematic precision and modern design.
          </p>

          <div className="mt-8 md:mt-12 opacity-0 premium-btn">
  <Link
  target="_blank"
    to="/explore"
    className="group relative flex flex-col sm:flex-row items-center gap-4 md:gap-8 bg-transparent transition-all mx-auto lg:mx-0"
  >
    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border border-rose-500/30 flex items-center justify-center overflow-hidden transition-all duration-700 group-hover:border-rose-400 group-hover:shadow-[0_0_30px_rgba(225,29,72,0.2)]">
      <div className="absolute inset-0 bg-rose-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      <ArrowRight className="relative z-10 w-6 h-6 md:w-8 md:h-8 text-rose-500 group-hover:text-white transition-colors duration-500" />
    </div>

    <div className="flex flex-col text-center sm:text-left">
      <span className="text-white text-[10px] md:text-xs uppercase tracking-[0.4em] group-hover:text-rose-400 transition-colors">
        Begin the Journey
      </span>
      <span className="text-rose-200/20 text-[8px] md:text-[10px] uppercase tracking-[0.2em] italic font-cinematic">
        Open Gallery
      </span>
    </div>
  </Link>
</div>

        </div>

        {/* RIGHT – VISUAL */}
        <div ref={imageRef} className="relative w-full flex justify-center items-center order-1 lg:order-2 opacity-0">
          {/* Visual Backglow changed to Maroon tone (#881337) */}
          <div className="absolute w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-rose-900/20 blur-[60px] md:blur-[120px] rounded-full" />
          
          <motion.div 
            style={{ 
              x: useTransform(smoothX, v => v * 0.05), 
              y: useTransform(smoothY, v => v * 0.05),
              rotateY: useTransform(smoothX, v => v * 0.01)
            }}
            className="relative z-10 w-[70%] sm:w-[50%] lg:w-full max-w-[450px]"
          >
            <img
              src="/dj.png"
              alt="Bust"
              className="w-full h-auto lg:h-[85vh] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)] mix-blend-lighten pointer-events-none"
            />
          </motion.div>
        </div>
      </div>
      
      {/* EDGE GRADIENT */}
      <div className="absolute top-0 right-0 w-1/3 h-full z-[5] pointer-events-none bg-gradient-to-l from-[#0a0104]/90 to-transparent hidden sm:block" />
    </section>
  );
};

export default HeroSection;