"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const name = e.target.name?.value || "";
    const email = e.target.email.value;
    const password = e.target.password.value;

    const endpoint = isSignup ? "register" : "login";
    const payload = isSignup
      ? { name, email, password, role }
      : { email, password };

    try {
      const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Auth failed");
        setLoading(false);
        return;
      }

      // Save JWT token + user
      if (data.token) localStorage.setItem("yl_token", data.token);
      if (data.user) localStorage.setItem("yl_user", JSON.stringify(data.user));

      alert(isSignup ? "Account created!" : "Logged in successfully!");
      router.push("/dashboard"); // redirect
    } catch (err) {
      console.error("Auth error:", err);
      alert("Server error — check backend console");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13233F] to-[#243A6B] flex items-center justify-center font-inter">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8 mx-4">
        <h1 className="text-2xl font-semibold text-center text-[#13233F]">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-center text-slate-500 mb-6">
          {isSignup ? "Join YourLawyer as a Client or Lawyer" : "Sign in to continue"}
        </p>

        {/* Login / Signup toggle */}
        <div className="flex mb-6">
          <button
            onClick={() => setIsSignup(false)}
            className={`flex-1 py-2 rounded-l-md font-medium ${
              !isSignup ? "bg-[#13233F] text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsSignup(true)}
            className={`flex-1 py-2 rounded-r-md font-medium ${
              isSignup ? "bg-[#13233F] text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            Signup
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="Your name"
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#243A6B] outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email or Phone
            </label>
            <input
              name="email"
              type="text"
              placeholder="you@example.com"
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#243A6B] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {isSignup ? "Create Password" : "Password or OTP"}
            </label>
            <input
              name="password"
              type="password"
              placeholder={isSignup ? "********" : "Enter your password or OTP"}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#243A6B] outline-none"
              required
            />
          </div>

          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Choose Role
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-slate-700">
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={role === "client"}
                    onChange={() => setRole("client")}
                  />
                  Client
                </label>

                <label className="flex items-center gap-2 text-slate-700">
                  <input
                    type="radio"
                    name="role"
                    value="lawyer"
                    checked={role === "lawyer"}
                    onChange={() => setRole("lawyer")}
                  />
                  Lawyer
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#13233F] text-white py-2 rounded-md hover:bg-[#1b2d55] transition"
          >
            {loading ? "Please wait..." : isSignup ? "Create Account" : "Login"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 mt-6">
          By continuing, you agree to our{" "}
          <span className="underline cursor-pointer">Terms</span> and{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
