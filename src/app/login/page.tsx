"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmail, signInWithToken } from "@/lib/auth";

type UserType = "client" | "broker";
type Step = "credentials" | "verify";

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<UserType>("client");
  const [step, setStep] = useState<Step>("credentials");

  // Client state
  const [clientEmail, setClientEmail] = useState("");
  const [clientCode, setClientCode] = useState("");

  // Pre-fill email from invite link (?email=...)
  useEffect(() => {
    const invited = searchParams.get("email");
    if (invited) {
      setClientEmail(invited);
      setUserType("client");
    }
  }, [searchParams]);

  // Broker state
  const [brokerEmail, setBrokerEmail] = useState("");
  const [brokerPassword, setBrokerPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchUserType = (type: UserType) => {
    setUserType(type);
    setStep("credentials");
    setError("");
    setClientEmail("");
    setClientCode("");
    setBrokerEmail("");
    setBrokerPassword("");
  };

  // ── Client handlers ────────────────────────────────────────────────────────

  const handleClientEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!clientEmail.trim() || !clientEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clientEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send code.");
      setStep("verify");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send code.");
    } finally {
      setLoading(false);
    }
  };

  const handleClientVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (clientCode.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clientEmail, code: clientCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed.");
      await signInWithToken(data.customToken);
      document.cookie = "session=client; path=/; SameSite=Lax";
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // ── Broker handler ─────────────────────────────────────────────────────────

  const handleBrokerSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!brokerEmail.trim() || !brokerPassword.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmail(brokerEmail, brokerPassword);
      document.cookie = "session=broker; path=/; SameSite=Lax";
      router.push("/broker");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign-in failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      {/* Header */}
      <header className="h-[73px] shrink-0 border-b border-primary/10 bg-white dark:bg-background-dark flex items-center px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold select-none">
            u
          </div>
          <span className="text-lg font-bold text-primary dark:text-slate-100 tracking-tight">
            uBroker
          </span>
        </div>
      </header>

      {/* Body */}
      <main className="flex flex-1 items-center justify-center p-4 py-6 sm:py-12">
        <div className="w-full max-w-md">

          <div className="mb-6 text-center sm:mb-8">
            <h1 className="text-xl font-bold text-primary dark:text-slate-100 sm:text-2xl">
              Digital Fact Find
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Sign in to access your mortgage fact-find form.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm dark:bg-slate-800/50">

            {/* User-type tabs */}
            <div className="grid grid-cols-2 border-b border-primary/10">
              {(["client", "broker"] as UserType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => switchUserType(type)}
                  className={[
                    "cursor-pointer py-4 text-sm font-semibold transition-colors",
                    userType === type
                      ? "bg-white text-primary font-bold dark:bg-slate-800 dark:text-slate-100"
                      : "bg-slate-100 text-slate-500 hover:text-slate-700 dark:bg-slate-700/50 dark:hover:text-slate-300",
                  ].join(" ")}
                >
                  {type === "client" ? "I'm a Client" : "I'm a Broker"}
                </button>
              ))}
            </div>

            <div className="p-5 sm:p-8">

              {/* ── CLIENT — step 1: email ─────────────────────────────────── */}
              {userType === "client" && step === "credentials" && (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-primary dark:text-slate-100">
                      Welcome back
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Enter the email address your broker has on file for you.
                    </p>
                  </div>

                  <form onSubmit={handleClientEmail} className="flex flex-col gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Email address
                      </label>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-base text-slate-900 placeholder:text-slate-400 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 sm:py-2.5 sm:text-sm"
                      />
                    </div>

                    {error && (
                      <p className="flex items-center gap-1.5 text-sm text-red-600">
                        <span className="material-symbols-outlined text-[16px]">error</span>
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-primary py-3.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60 sm:py-2.5"
                    >
                      {loading ? "Sending code…" : "Send verification code"}
                    </button>
                  </form>
                </>
              )}

              {/* ── CLIENT — step 2: OTP ──────────────────────────────────── */}
              {userType === "client" && step === "verify" && (
                <>
                  <button
                    type="button"
                    onClick={() => { setStep("credentials"); setError(""); setClientCode(""); }}
                    className="mb-6 -mt-1 flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Back
                  </button>

                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-primary dark:text-slate-100">
                      Check your email
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      We sent a 6-digit code to{" "}
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {maskEmail(clientEmail)}
                      </span>
                      . Enter it below to sign in.
                    </p>
                  </div>

                  <form onSubmit={handleClientVerify} className="flex flex-col gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Verification code
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={clientCode}
                        onChange={(e) =>
                          setClientCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        placeholder="000000"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 font-mono text-base tracking-[0.4em] text-slate-900 placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-400 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 sm:py-2.5 sm:text-sm"
                      />
                    </div>

                    {error && (
                      <p className="flex items-center gap-1.5 text-sm text-red-600">
                        <span className="material-symbols-outlined text-[16px]">error</span>
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-primary py-3.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60 sm:py-2.5"
                    >
                      {loading ? "Verifying…" : "Verify & sign in"}
                    </button>

                    <p className="text-center text-sm text-slate-500">
                      Didn&apos;t receive a code?{" "}
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => { setClientCode(""); setError(""); handleClientEmail({ preventDefault: () => {} } as React.FormEvent); }}
                        className="font-medium text-primary hover:underline disabled:opacity-60"
                      >
                        Resend
                      </button>
                    </p>
                  </form>
                </>
              )}

              {/* ── BROKER ────────────────────────────────────────────────── */}
              {userType === "broker" && (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-primary dark:text-slate-100">
                      Broker sign in
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Enter your credentials to continue.
                    </p>
                  </div>

                  <form onSubmit={handleBrokerSignIn} className="flex flex-col gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Email address
                      </label>
                      <input
                        type="email"
                        value={brokerEmail}
                        onChange={(e) => setBrokerEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-base text-slate-900 placeholder:text-slate-400 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 sm:py-2.5 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={brokerPassword}
                          onChange={(e) => setBrokerPassword(e.target.value)}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 pr-11 text-base text-slate-900 placeholder:text-slate-400 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 sm:py-2.5 sm:text-sm"
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showPassword ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>
                    </div>

                    {error && (
                      <p className="flex items-center gap-1.5 text-sm text-red-600">
                        <span className="material-symbols-outlined text-[16px]">error</span>
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-primary py-3.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60 sm:py-2.5"
                    >
                      {loading ? "Signing in…" : "Sign in"}
                    </button>

                    <div className="text-center">
                      <button type="button" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </button>
                    </div>
                  </form>
                </>
              )}

            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} uBroker. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
