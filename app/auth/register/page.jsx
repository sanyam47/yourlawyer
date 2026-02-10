"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "lawyer") {
        router.push("/lawyer-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm space-y-5">

        <h1 className="text-2xl font-bold text-center">
          Create Account
        </h1>

        {/* 🔥 ROLE SELECTION */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setForm({ ...form, role: "user" })}
            className={`flex-1 border py-2 rounded ${
              form.role === "user"
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            👤 Register as Client
          </button>

          <button
            type="button"
            onClick={() => setForm({ ...form, role: "lawyer" })}
            className={`flex-1 border py-2 rounded ${
              form.role === "lawyer"
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            ⚖️ Register as Lawyer
          </button>
        </div>

        {/* FORM FIELDS */}
        <input
          placeholder="Name"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </div>
    </div>
  );
}
