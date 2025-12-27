import React, { useState } from "react";
import { Eye, EyeOff, Loader, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthSection: React.FC = () => {
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let result;
      if (isLogin) {
        result = await signIn(formData.email, formData.password);
      } else {
        result = await signUp(
          formData.username,
          formData.email,
          formData.password
        );
      }

      if (result?.error) {
        setMessage({ type: "error", text: result.error.message });
      } else {
        setMessage({
          type: "success",
          text: isLogin
            ? "Access granted. Redirecting…"
            : "Account created. Redirecting…",
        });
        setTimeout(() => navigate("/dashboard"), 800);
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Unexpected error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0b0f19] px-4">
      <div className="w-full max-w-md border border-white/10 bg-[#111827] shadow-2xl">

        {/* HEADER */}
        <div className="px-8 py-6 border-b border-white/10">
          <h2 className="text-lg font-semibold tracking-wide text-white">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>
          <p className="text-xs tracking-widest uppercase text-white/40 mt-2">
            {isLogin ? "Authorized Access" : "New User Registration"}
          </p>
        </div>

        {/* BODY */}
        <div className="px-8 py-6 space-y-6">

          {message && (
            <div
              className={`flex items-center gap-2 px-4 py-3 text-xs border ${
                message.type === "success"
                  ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/5"
                  : "border-red-500/40 text-red-400 bg-red-500/5"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle size={16} />
              ) : (
                <XCircle size={16} />
              )}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {!isLogin && (
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="
                    w-full bg-transparent
                    border border-white/15
                    px-4 py-3
                    text-sm text-white
                    focus:border-indigo-500
                    outline-none
                  "
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="
                  w-full bg-transparent
                  border border-white/15
                  px-4 py-3
                  text-sm text-white
                  focus:border-indigo-500
                  outline-none
                "
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  className="
                    w-full bg-transparent
                    border border-white/15
                    px-4 py-3
                    text-sm text-white
                    focus:border-indigo-500
                    outline-none pr-12
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                border border-indigo-500/40
                bg-indigo-500/10
                py-3
                text-xs font-semibold uppercase tracking-widest
                text-indigo-400
                hover:bg-indigo-500 hover:text-white
                transition-all
                flex items-center justify-center gap-2
                disabled:opacity-50
              "
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {isLogin ? "Authorize" : "Register"}
            </button>
          </form>

          {/* SWITCH MODE */}
          <div className="pt-6 border-t border-white/10 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage(null);
                setFormData({ email: "", password: "", username: "" });
              }}
              className="text-[11px] uppercase tracking-widest text-white/40 hover:text-indigo-400 transition"
            >
              {isLogin ? "Create New Account" : "Back to Login"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthSection;
