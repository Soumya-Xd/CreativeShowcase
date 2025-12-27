import React from 'react';
import { Palette, Users, Globe, Fingerprint, Activity, Terminal, ChevronRight, Cpu, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutSection: React.FC = () => {
  const features = [
    {
      id: "FEAT_01",
      title: "CORE_ENGINE",
      content: "High-performance infrastructure built for seamless artifact rendering and infinite scaling capabilities.",
      status: "STABLE"
    },
    {
      id: "FEAT_02",
      title: "RESTORE_VAULT",
      content: "Distributed ledger technology ensuring the permanence and authenticity of every digital masterpiece.",
      status: "ENCRYPTED"
    },
    {
      id: "FEAT_03",
      title: "GLOBAL_LINK",
      content: "Instant synchronization across the collective artist network with zero-latency interaction protocols.",
      status: "ONLINE"
    }
  ];

  const stats = [
    { number: '50K+', label: 'ACTIVE_NODES' },
    { number: '200K+', label: 'RECORDS' },
    { number: '1M+', label: 'UNIT_LIKES' },
    { number: '24/7', label: 'UPTIME' },
  ];

  return (
    <section className="relative w-screen min-h-screen bg-[#020108] overflow-x-hidden flex items-center justify-center py-20 px-6 md:px-12">
      
      {/* BACKGROUND AMBIENCE */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-500/5 blur-[200px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 w-full max-w-[1600px] flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
        
        {/* ================= LEFT SIDE: BIG CINEMATIC SPECS ================= */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
          <div className="flex items-center gap-3 mb-6">
            <Fingerprint className="text-indigo-500 w-6 h-6 animate-pulse" />
            <div className="h-[1px] w-12 bg-white/10" />
            <span className="text-white/40 font-mono text-[9px] uppercase tracking-[0.5em]">Project_About_v2</span>
          </div>
          
          <h2 className="text-5xl md:text-8xl lg:text-9xl font-serif italic text-white leading-[0.8] tracking-tighter">
            System <br /> 
            <span className="text-indigo-500 not-italic uppercase font-sans text-4xl md:text-7xl lg:text-8xl tracking-[0.15em] opacity-80">Manifesto.</span>
          </h2>

          <div className="mt-8 flex flex-wrap gap-4">
            {stats.map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="px-4 py-2 border border-white/5 bg-white/[0.02]"
              >
                <p className="text-white font-mono text-sm md:text-base font-bold">{s.number}</p>
                <p className="text-indigo-500/50 font-mono text-[8px] uppercase tracking-widest">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <p className="mt-12 text-white/20 font-mono text-[10px] md:text-xs leading-relaxed uppercase tracking-widest max-w-sm border-l border-indigo-500/30 pl-6">
            Establishing a decentralized archive where <span className="text-white/60">creativity is quantified</span> and visual narratives are protected under high-fidelity encryption protocols.
          </p>
        </div>

        {/* ================= RIGHT SIDE: COMPACT DATA LOG LAYOUT ================= */}
        <div className="w-full lg:w-1/2 flex flex-col gap-2 relative max-w-xl">
          
          {/* Header for the Log */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 mb-4 font-mono text-[10px] text-white/20 tracking-widest">
            <span>CORE_FEATURES_REGISTRY</span>
            <span className="flex items-center gap-2">LINK_STABLE <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" /></span>
          </div>

          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative flex flex-col p-5 border border-white/5 bg-white/[0.01] hover:bg-indigo-500/[0.03] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-indigo-500 font-mono text-[10px]">{feature.id}</span>
                  <h3 className="text-sm font-bold text-white tracking-widest uppercase transition-colors group-hover:text-indigo-400">
                    {feature.title}
                  </h3>
                </div>
                <div className="px-2 py-0.5 border border-white/10 text-[8px] font-mono text-white/40 group-hover:border-indigo-500/50 group-hover:text-indigo-400">
                   {feature.status}
                </div>
              </div>

              <p className="text-white/40 text-[11px] font-mono leading-relaxed uppercase tracking-wider pl-12 border-l border-white/5 group-hover:text-white/60 transition-colors">
                {feature.content}
              </p>

              {/* Scanning Light Effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-full h-[1px] bg-indigo-500/30 absolute top-0 animate-scan" />
              </div>
            </motion.div>
          ))}

          {/* COMPACT FOOTER ACTIONS */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
             <button 
                onClick={() => window.dispatchEvent(new CustomEvent('scrollToSection', { detail: 1 }))}
                className="w-full sm:flex-1 py-4 border border-white/5 text-white/30 font-mono text-[9px] uppercase tracking-[0.4em] hover:bg-white/5 hover:text-white transition-all text-center"
             >
                Initialize_Archive_Browse
             </button>
             <button 
                onClick={() => window.dispatchEvent(new CustomEvent('scrollToSection', { detail: 4 }))}
                className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white font-mono text-[9px] uppercase tracking-[0.4em] hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 group"
             >
                Join_Network <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>

      </div>

      {/* FOOTER SYSTEM STATUS */}
      <div className="absolute bottom-10 left-10 hidden md:flex items-center gap-4 opacity-20">
         <Activity className="w-4 h-4 text-indigo-500" />
         <span className="text-[8px] font-mono uppercase tracking-[1em] text-white">System_Stable_Pulse_Normal</span>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>

    </section>
  );
};

export default AboutSection;