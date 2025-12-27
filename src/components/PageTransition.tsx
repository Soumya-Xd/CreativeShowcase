import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const container = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // 1. 🛑 CHECK IF HOME OR FIRST LOAD
    const isHomePage = location.pathname === "/";

    if (isFirstLoad.current || isHomePage) {
      isFirstLoad.current = false;
      
      // Force everything to be visible immediately without animation
      gsap.set(container.current, { 
        opacity: 1, 
        scale: 1, 
        filter: "blur(0px) brightness(1)",
        x: 0 
      });

      // Still handle scroll reset for non-horizontal parts if necessary
      if (!isHomePage) window.scrollTo(0, 0);
      return;
    }

    // ✅ ONLY FOR OTHER ROUTES (Explore, Profile, etc.)
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        container.current,
        {
          opacity: 0,
          scale: 1.05,
          filter: "blur(15px) brightness(0.3)",
        },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px) brightness(1)",
          duration: 1.4,
          ease: "power4.out",
        }
      );

      // Micro-glitch on entry
      tl.fromTo(
        container.current,
        { x: -10 },
        { x: 0, duration: 0.15, ease: "rough" },
        0.1
      );
    });

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div
      ref={container}
      className="w-full will-change-[transform,opacity,filter]"
    >
      {children}
    </div>
  );
};

export default PageTransition;