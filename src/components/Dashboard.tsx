import { useEffect, useState } from "react";
import {
  Trash2,
  Upload,
  Image as ImageIcon,
  User,
  Menu,
  X,
  Moon,
  Sun,
  LayoutGrid,
  Zap,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { artworksAPI, Artwork } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const { user } = useAuth();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(localStorage.getItem("theme") !== "light");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    image: null as File | null,
  });

  // Preview URL state to prevent UI reset flickers
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!user) return null;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const fetchUserArtworks = async () => {
    try {
      const res = await artworksAPI.getUserArtworks(user.id);
      setArtworks(res.artworks);
    } catch (error) {
      console.error("Failed to fetch archive:", error);
    }
  };

  useEffect(() => {
    fetchUserArtworks();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image || !formData.title) {
        alert("Validation Error: Title and Image are required.");
        return;
    }

    const data = new FormData();
    data.append("image", formData.image);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("tags", formData.tags);

    setLoading(true);
    try {
      await artworksAPI.create(data);
      // Only reset AFTER successful backend authorization
      setFormData({ title: "", description: "", tags: "", image: null });
      setPreviewUrl(null);
      await fetchUserArtworks();
    } catch (error) {
      console.error("Upload failure:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("De-authorize this artifact?")) return;
    try {
      await artworksAPI.delete(id);
      fetchUserArtworks();
    } catch (error) {
      console.error("Deletion failed:", error);
    }
  };

  const CanvasCard = ({
    art,
    onDelete,
  }: {
    art: Artwork;
    onDelete: (id: string) => void;
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="break-inside-avoid group relative mb-8"
      >
        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            bg-[#0a051a]
            border border-white/10
            hover:border-indigo-500/50
            transition-all duration-700
          "
        >
          <img
            src={`http://localhost:5000${art.image_url}`}
            alt={art.title}
            className="
              w-full
              object-cover
              transition-all duration-700
              grayscale-[0.4]
              group-hover:grayscale-0
              group-hover:scale-105
            "
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h4 className="text-white font-bold tracking-tight text-lg mb-2">
              {art.title}
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400">
                {art.likes_count} ENDORSEMENTS
              </span>
              <button
                onClick={() => onDelete(art._id)}
                className="
                  p-2
                  rounded-lg
                  bg-red-500/10
                  border border-red-500/20
                  text-red-500
                  hover:bg-red-500 hover:text-white
                  transition-all
                "
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen flex font-sans ${dark ? "bg-[#030108] text-slate-200" : "bg-slate-50 text-slate-900"}`}>
      
      {/* ================= SIDEBAR ================= */}
      <AnimatePresence>
        {(sidebarOpen || (typeof window !== 'undefined' && window.innerWidth > 1024)) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`fixed lg:static z-[60] top-0 left-0 h-full w-80 
            ${dark ? "bg-[#05020d]/80" : "bg-white/80"} 
            backdrop-blur-2xl border-r border-white/5 shadow-2xl`}
          >
            <div className="p-8 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                  <Zap size={18} className="text-white fill-current" />
                </div>
                <h1 className="font-bold tracking-tighter text-lg uppercase italic">Terminal_v1</h1>
              </div>
              <button className="lg:hidden p-2 hover:bg-white/5 rounded-full" onClick={() => setSidebarOpen(false)}><X /></button>
            </div>

            <div className="p-8 space-y-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-[#0a051a] p-6 rounded-xl border border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                       <User className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-bold tracking-tight">{user.username}</p>
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">Authorized_User</p>
                    </div>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <StatRow label="Artifacts" value={user.artworkCount} icon={<ImageIcon size={12}/>} />
                    <StatRow label="Network" value={user.followersCount} icon={<TrendingUp size={12}/>} />
                    <StatRow label="Endorsements" value={user.totalLikes} icon={<ShieldCheck size={12}/>} />
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-6 lg:p-12 space-y-12 overflow-y-auto custom-scrollbar">
        
        {/* HEADER BAR */}
        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
          <button className="lg:hidden text-slate-200 p-2" onClick={() => setSidebarOpen(true)}><Menu /></button>
          <div className="hidden md:block">
            <h2 className="text-[10px] font-mono uppercase tracking-[0.5em] text-slate-500">System_Status: <span className="text-emerald-500">Online</span></h2>
          </div>
          <button onClick={() => setDark(!dark)} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all active:scale-95 shadow-xl">
            {dark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-600" />}
          </button>
        </div>

        {/* UPLOAD TERMINAL */}
        <section className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 z-0 opacity-10 group-hover:opacity-20 transition-opacity">
            <Upload size={120} />
          </div>
          <div className="relative z-10 bg-gradient-to-br from-indigo-900/20 to-transparent p-8 rounded-3xl border border-white/10 backdrop-blur-sm shadow-inner">
            <header className="mb-8">
              <h2 className="text-2xl font-bold tracking-tighter flex items-center gap-3">
                <Upload className="text-indigo-500" /> NEW_ENTRY_INITIATION
              </h2>
              <div className="h-px w-24 bg-indigo-500 mt-2" />
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4 md:col-span-2">
                <div className="grid md:grid-cols-2 gap-4">
                  <TechnicalInput label="TITLE" value={formData.title} placeholder="Protocol Name..." onChange={(v: string) => setFormData({...formData, title: v})} />
                  <TechnicalInput label="TAGS" value={formData.tags} placeholder="AI, Abstract, Cyber..." onChange={(v: string) => setFormData({...formData, tags: v})} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono tracking-widest text-slate-500">DESCRIPTION_LOG</label>
                  <textarea
                    className="w-full bg-[#0a051a]/50 border border-white/10 rounded-xl p-4 text-slate-200 focus:border-indigo-500 transition-all outline-none h-32 resize-none"
                    placeholder="Input artifact narrative..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <label className="flex-1 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer relative overflow-hidden group/file">
                  {previewUrl ? (
                    <div className="relative w-full h-full flex items-center justify-center p-2">
                        <img src={previewUrl} className="max-h-full rounded-lg object-contain" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/file:opacity-100 transition-opacity">
                            <span className="text-[8px] font-mono text-white tracking-[0.2em]">REPLACE_ARTIFACT</span>
                        </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-indigo-500/10 rounded-full text-indigo-500 group-hover/file:scale-110 transition-transform"><ImageIcon size={32}/></div>
                      <p className="text-[10px] font-mono tracking-widest text-slate-500 text-center px-4">DRAG_ARTIFACT_OR_CLICK</p>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold uppercase tracking-[0.3em] text-xs shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "PROCESSING_ENCRYPTION..." : "AUTHORIZE_UPLOAD"}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* ================= ARCHIVE CANVAS ================= */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold tracking-tighter uppercase italic flex items-center gap-2">
              <LayoutGrid className="text-indigo-500" size={20} />
              ARCHIVE_CANVAS
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/50 to-transparent" />
          </div>

          <div
            className="
              relative
              h-[75vh]
              rounded-3xl
              border border-white/10
              bg-[#05020d]
              shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]
              overflow-hidden
            "
          >
            <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div
              className="
                relative
                h-full
                overflow-y-auto
                px-6 py-10
                custom-scrollbar
              "
            >
              {artworks.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 font-mono tracking-widest">
                  NO_ARTIFACTS_RENDERED
                </div>
              ) : (
                <div className="columns-1 sm:columns-2 xl:columns-3 gap-8 space-y-8">
                  {artworks.map((art) => (
                    <CanvasCard
                      key={art._id}
                      art={art}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

/* ================= REUSABLE STYLIZED COMPONENTS ================= */

const StatRow = ({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) => (
  <div className="flex items-center justify-between group/stat">
    <div className="flex items-center gap-2 text-slate-500 group-hover/stat:text-indigo-400 transition-colors">
      {icon}
      <span className="text-[10px] font-mono tracking-widest uppercase">{label}</span>
    </div>
    <span className="font-bold text-slate-200">{value}</span>
  </div>
);

const TechnicalInput = ({ label, value, placeholder, onChange }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-mono tracking-widest text-slate-500">{label}_LOG</label>
    <input
      className="bg-[#0a051a]/50 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:border-indigo-500 transition-all outline-none font-mono text-xs"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default Dashboard;