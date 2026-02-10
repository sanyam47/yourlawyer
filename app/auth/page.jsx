"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("client");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const endpoint = isLogin ? "login" : "register";

    try {
      const bodyData = isLogin
        ? { email, password }
        : { name, email, password, role };

      const res = await fetch(
        `http://localhost:5000/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        }
      );

      const data = await res.json();
      console.log("AUTH RESPONSE:", data);

      if (!res.ok) {
        alert(data.message || "Authentication failed");
        setLoading(false);
        return;
      }

      // 🔥 Always clear old token first
      localStorage.removeItem("token");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));


      const userRole = data.user?.role?.trim();

      if (userRole === "lawyer") {
        router.replace("/lawyer-dashboard");
      } else {
        router.replace("/dashboard");
      }

    } catch (error) {
      console.error("Auth error:", error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96 space-y-4">

        <h2 className="text-xl font-bold text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        {/* Name (Register only) */}
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />
        )}

        {/* Role (Register only) */}
        {!isLogin && (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="client">Client</option>
            <option value="lawyer">Lawyer</option>
          </select>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          {loading
            ? "Please wait..."
            : isLogin
            ? "Login"
            : "Register"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-center cursor-pointer text-blue-600"
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>

      </div>
    </div>
  );
}
