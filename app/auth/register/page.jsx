"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // ✅ DEFAULT ROLE
  });

  const handleRegister = async () => {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    // ✅ SAVE TOKEN & USER
    localStorage.setItem("yl_token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // ✅ ROLE‑BASED REDIRECT
    if (data.user.role === "lawyer") {
      router.push("/lawyer-dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Create Account</h1>

        <input
          placeholder="Name"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* ✅ LAWYER CHECKBOX */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.checked ? "lawyer" : "user",
              })
            }
          />
          Register as Lawyer
        </label>

        <button
          onClick={handleRegister}
          className="w-full bg-black text-white py-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
}
