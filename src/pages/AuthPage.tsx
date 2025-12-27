import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Loader,
  CheckCircle,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage: React.FC = () => {
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = isLogin
        ? await signIn(formData.email, formData.password)
        : await signUp(formData.username, formData.email, formData.password);

      if (result?.error) {
        setMessage({ type: 'error', text: result.error.message });
      } else {
        setMessage({
          type: 'success',
          text: isLogin ? 'Signed in successfully' : 'Account created successfully',
        });
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#05010a] flex items-center justify-center p-0 md:p-12">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row bg-[#0a0514] border border-white/10 shadow-2xl">

        {/* LEFT IMAGE */}
        <div className="relative w-full lg:w-1/2 h-48 lg:h-auto overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
<img 
  src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=2000&auto=format&fit=crop"
  alt="Abstract Art"
  className="w-full h-full object-cover grayscale opacity-40"
/>

          <div className="absolute inset-0 flex items-end p-8 bg-black/40">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Creative <span className="text-rose-500">Showcase</span>
            </h1>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-sm w-full mx-auto">

            <header className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? 'Sign In' : 'Sign Up'}
              </h2>
              <p className="text-white/40 text-sm">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </p>
            </header>

            <AnimatePresence mode="wait">
              {message && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex items-center gap-3 p-4 mb-8 text-sm ${
                    message.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-rose-500/10 text-rose-400'
                  }`}
                >
                  {message.type === 'success'
                    ? <CheckCircle size={18} />
                    : <XCircle size={18} />}
                  <span>{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <input
                  type="text"
                  required
                  placeholder="Username"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white outline-none"
                />
              )}

              <input
                type="email"
                required
                placeholder="Email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white outline-none"
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white outline-none pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white transition flex items-center justify-center gap-3"
              >
                {loading ? <Loader className="animate-spin" size={18} /> : (
                  <>
                    {isLogin ? 'Sign In' : 'Sign Up'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-white/40 hover:text-rose-400 transition"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
