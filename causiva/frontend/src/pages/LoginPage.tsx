import React, { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Link, useRouter } from "../router/RouterContext";
import { useAuth } from "../context/AuthContext";

export const LoginPage: React.FC = () => {
  const { navigate } = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", remember: false });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(formData.email, formData.password).then(() => navigate("/account")).catch((e: Error) => setError(e.message));
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/auth/google`;
  };

  return (
    <div className="min-h-[calc(100vh-9rem)] bg-surface-container-low px-4 pb-20 pt-0 md:px-8 md:pt-36">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-outline-variant/30 bg-surface-container-lowest shadow-[0_24px_70px_rgba(38,50,56,0.1)] md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden overflow-hidden bg-primary p-10 text-on-primary md:flex md:flex-col md:justify-between">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border-[28px] border-white/10" />
          <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-white/5" />
          <div className="relative space-y-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10">
              <Sparkles size={19} />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-tertiary-fixed">Your botanical ritual</p>
            <h1 className="max-w-xs font-serif text-4xl font-bold leading-tight">Return to your sanctuary.</h1>
            <p className="max-w-xs text-sm leading-7 text-on-primary/75">
              Keep your favorite formulas, orders, and skin ritual recommendations together.
            </p>
          </div>
          <div className="relative flex items-center gap-2 text-xs text-on-primary/70">
            <ShieldCheck size={16} />
            <span>Your details stay private and secure.</span>
          </div>
        </div>

        <div className="p-6 sm:p-10 md:p-12">
          <div className="mb-8 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Welcome back</p>
            <h2 className="font-serif text-3xl font-bold text-primary">Log in to Causiva</h2>
            <p className="text-sm leading-6 text-secondary">Continue your clean botanical ritual.</p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-outline-variant/60 bg-surface-container-lowest px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:bg-surface-container-low"
          >
            <span className="font-sans text-base font-bold leading-none text-[#4285F4]">G</span>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-outline">
            <span className="h-px flex-1 bg-outline-variant/40" />
            <span>Or use email</span>
            <span className="h-px flex-1 bg-outline-variant/40" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <p className="text-xs font-semibold text-red-700">{error}</p>}
            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Email address</span>
              <span className="flex items-center rounded-xl border border-outline-variant/50 bg-surface-container-low px-3.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                <Mail size={17} className="text-secondary" />
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  placeholder="you@example.com"
                  className="w-full bg-transparent px-3 py-3 text-sm text-primary outline-none placeholder:text-outline"
                />
              </span>
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Password</span>
              <span className="flex items-center rounded-xl border border-outline-variant/50 bg-surface-container-low px-3.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                <LockKeyhole size={17} className="text-secondary" />
                <input
                  required
                  minLength={6}
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  placeholder="Enter your password"
                  className="w-full bg-transparent px-3 py-3 text-sm text-primary outline-none placeholder:text-outline"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="rounded-full p-1.5 text-secondary hover:bg-surface-container hover:text-primary"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>

            <div className="flex items-center justify-between gap-4 text-xs">
              <label className="flex items-center gap-2 text-secondary">
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(event) => setFormData({ ...formData, remember: event.target.checked })}
                  className="h-4 w-4 accent-primary"
                />
                Remember me
              </label>
              <Link href="/contact" className="font-semibold text-primary hover:underline">Need help signing in?</Link>
            </div>

            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-on-primary transition-transform hover:-translate-y-0.5">
              Log in <ArrowRight size={15} />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-secondary">
            New to Causiva? <Link href="/create-account" className="font-bold text-primary hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};