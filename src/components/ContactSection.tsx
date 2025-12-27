import React from 'react';
import { Mail, Phone, Globe, Fingerprint, Activity, ChevronRight, Send, ArrowUpRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactSection: React.FC = () => {
  const email = "Soumyasingharoy06@gmail.com";
  const phone = "+91 6296520890";
  const website = "soumyaroy.site";
  
  const mailSubject = encodeURIComponent("Archive System Inquiry");
  const mailBody = encodeURIComponent("Hello Soumya,\n\nI have accessed the Cabinet Archive and would like to establish a formal connection regarding...");

  return (
    <section className="relative w-screen min-h-screen bg-[#020108] overflow-x-hidden flex items-center justify-center py-20 px-6 md:px-12">
      
      {/* BACKGROUND AMBIENCE */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-500/5 blur-[200px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 w-full max-w-[1600px] flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
        
        {/* ================= LEFT SIDE: BIG CINEMATIC SPECS (UNCHANGED) ================= */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
          <div className="flex items-center gap-3 mb-6">
            <Fingerprint className="text-indigo-500 w-6 h-6 animate-pulse" />
            <div className="h-[1px] w-12 bg-white/10" />
            <span className="text-white/40 font-mono text-[9px] uppercase tracking-[0.5em]">Uplink_Module_v1.0</span>
          </div>
          
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-serif italic text-white leading-[0.8] tracking-tighter">
            Establish <br /> 
            <span className="text-indigo-500 not-italic uppercase font-sans text-5xl md:text-7xl lg:text-8xl tracking-[0.15em] opacity-80">Connection.</span>
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-4">
             {[
               { n: '24/7', l: 'AVAILABILITY' },
               { n: 'SECURE', l: 'ENCRYPTION' },
               { n: 'DIRECT', l: 'UPLINK' },
               { n: 'GLOBAL', l: 'NODE' }
             ].map((s, i) => (
              <div key={i} className="px-4 py-2 border border-white/5 bg-white/[0.02]">
                <p className="text-white font-mono text-sm font-bold">{s.n}</p>
                <p className="text-indigo-500/50 font-mono text-[8px] uppercase tracking-widest">{s.l}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-white/20 font-mono text-[10px] leading-relaxed uppercase tracking-widest max-sm border-l border-indigo-500/30 pl-6">
            Direct communication bridge for <span className="text-white/60">node collaboration</span>, system inquiries, and archival contributions.
          </p>
        </div>

        {/* ================= RIGHT SIDE: COMPACT COMMUNICATION TERMINAL ================= */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 relative max-w-xl">
          
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 mb-4 font-mono text-[10px] text-white/20 tracking-widest">
            <span>COMMUNICATION_CHANNELS</span>
            <span className="text-emerald-500 flex items-center gap-2"><Zap size={10} /> LINK_STABLE</span>
          </div>

          {/* EMAIL CHANNEL */}
          <motion.a 
            href={`mailto:${email}?subject=${mailSubject}&body=${mailBody}`}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="group relative flex flex-col p-6 border border-white/5 bg-white/[0.01] hover:bg-indigo-500/[0.04] transition-all duration-300 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2 z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center transition-all bg-black group-hover:border-indigo-500/50">
                  <Mail className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-indigo-500 uppercase tracking-widest">Neural_Mail</span>
                  <h3 className="text-sm font-bold text-white tracking-widest uppercase">{email}</h3>
                </div>
              </div>
              <Send size={14} className="text-white/10 group-hover:text-indigo-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity animate-scan-slow" />
          </motion.a>

          {/* PHONE CHANNEL */}
          <motion.a 
            href={`tel:${phone.replace(/\s/g, '')}`}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative flex flex-col p-6 border border-white/5 bg-white/[0.01] hover:bg-indigo-500/[0.04] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center transition-all bg-black group-hover:border-indigo-500/50">
                  <Phone className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-indigo-500 uppercase tracking-widest">Voice_Frequency</span>
                  <h3 className="text-sm font-bold text-white tracking-widest uppercase">{phone}</h3>
                </div>
              </div>
              <Activity size={14} className="text-white/10 group-hover:text-indigo-400 animate-pulse" />
            </div>
          </motion.a>

          {/* WEBSITE CHANNEL */}
          <motion.a 
            href={`https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative flex flex-col p-6 border border-white/5 bg-white/[0.01] hover:bg-indigo-500/[0.04] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center transition-all bg-black group-hover:border-indigo-500/50">
                  <Globe className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-indigo-500 uppercase tracking-widest">Digital_Domain</span>
                  <h3 className="text-sm font-bold text-white tracking-widest uppercase">{website}</h3>
                </div>
              </div>
              <ArrowUpRight size={14} className="text-white/10 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </div>
          </motion.a>

          {/* COMPACT FOOTER ACTION */}
          <div className="mt-6 p-4 border border-indigo-500/10 bg-indigo-500/5 flex items-center justify-between">
             <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.4em]">Response_Time: &lt; 24H</span>
             <div className="flex gap-1">
                <div className="w-1 h-1 bg-indigo-500 rounded-full animate-ping" />
                <div className="w-1 h-1 bg-indigo-500 rounded-full" />
             </div>
          </div>
        </div>

      </div>

      {/* FOOTER SYSTEM STATUS */}
      <div className="absolute bottom-10 left-10 flex items-center gap-4 opacity-20">
         <Activity className="w-4 h-4 text-indigo-500" />
         <span className="text-[8px] font-mono uppercase tracking-[1em] text-white">Transceiver_Standby</span>
      </div>

      <style>{`
        @keyframes scan-slow {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan-slow {
          animation: scan-slow 4s linear infinite;
        }
      `}</style>

    </section>
  );
};

export default ContactSection;