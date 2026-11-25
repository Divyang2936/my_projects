import React, { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Link, useRouter } from "../router/RouterContext";
import { useAuth } from "../context/AuthContext";

export const CreateAccountPage: React.FC = () => {
  const { navigate } = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    updates: true,
  });

  const updateField = (field: keyof typeof formData, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    if (field === "confirmPassword") setPasswordError("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    register({ firstName: formData.firstName, lastName: formData.lastName, email: formData.email, password: formData.password })
      .then(() => navigate("/account")).catch((e: Error) => setError(e.message));
  };

  const inputClass = "w-full rounded-xl border border-outline-variant/50 bg-surface-container-low px-3.5 py-3 text-sm text-primary outline-none placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <div className="min-h-[calc(100vh-9rem)] bg-surface-container-low px-4 pb-20 pt-0 md:px-8 md:pt-36">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-[0_24px_70px_rgba(38,50,56,0.1)] sm:p-10 md:p-12">
        <div className="mx-auto mb-8 max-w-lg space-y-2 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Begin your ritual</p>
          <h1 className="font-serif text-3xl font-bold text-primary sm:text-4xl">Create your account</h1>
          <p className="text-sm leading-6 text-secondary">Save your favorites, track orders, and make every cleanse feel considered.</p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">First name</span>
              <input required type="text" value={formData.firstName} onChange={(event) => updateField("firstName", event.target.value)} placeholder="Priya" className={inputClass} />
            </label>
            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Last name</span>
              <input required type="text" value={formData.lastName} onChange={(event) => updateField("lastName", event.target.value)} placeholder="Sharma" className={inputClass} />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Email address</span>
            <span className="flex items-center rounded-xl border border-outline-variant/50 bg-surface-container-low px-3.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              <Mail size={17} className="text-secondary" />
              <input required type="email" value={formData.email} onChange={(event) => updateField("email", event.target.value)} placeholder="you@example.com" className="w-full bg-transparent px-3 py-3 text-sm text-primary outline-none placeholder:text-outline" />
            </span>
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Password</span>
              <span className="flex items-center rounded-xl border border-outline-variant/50 bg-surface-container-low px-3.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                <LockKeyhole size={17} className="text-secondary" />
                <input required minLength={6} type={showPassword ? "text" : "password"} value={formData.password} onChange={(event) => updateField("password", event.target.value)} placeholder="6+ characters" className="w-full bg-transparent px-3 py-3 text-sm text-primary outline-none placeholder:text-outline" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="rounded-full p-1.5 text-secondary hover:bg-surface-container hover:text-primary" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>
            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Confirm password</span>
              <input required minLength={6} type={showPassword ? "text" : "password"} value={formData.confirmPassword} onChange={(event) => updateField("confirmPassword", event.target.value)} placeholder="Repeat password" className={inputClass} />
            </label>
          </div>

          {passwordError && <p className="text-xs font-semibold text-red-700">{passwordError}</p>}
          {error && <p className="text-xs font-semibold text-red-700">{error}</p>}

          <label className="flex items-start gap-2 text-xs leading-5 text-secondary">
            <input type="checkbox" checked={formData.updates} onChange={(event) => updateField("updates", event.target.checked)} className="mt-1 h-4 w-4 accent-primary" />
            Send me thoughtful botanical tips, new ritual drops, and member-only offers.
          </label>

          <p className="flex items-start gap-2 text-xs leading-5 text-secondary">
            <UserRound size={16} className="mt-0.5 shrink-0 text-primary" />
            By creating an account, you agree to our <Link href="/terms" className="font-semibold text-primary hover:underline">Terms</Link> and <Link href="/privacy" className="font-semibold text-primary hover:underline">Privacy Policy</Link>.
          </p>

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-on-primary transition-transform hover:-translate-y-0.5">
            Create account <ArrowRight size={15} />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-secondary">
          Already have an account? <Link href="/login" className="font-bold text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};