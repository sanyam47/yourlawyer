"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CasesPage() {
  const router = useRouter();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    fetch("http://localhost:5000/api/cases", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCases(data);
        setLoading(false);
      })
      .catch(() => alert("Failed to load cases"));
  }, [router]);

  if (loading) return <p style={{ padding: 40 }}>Loading cases...</p>;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <h2>📁 My Cases</h2>

      {cases.length === 0 && <p>No cases yet.</p>}

      <div style={{ display: "grid", gap: 16 }}>
        {cases.map((item) => (
          <div
            key={item._id}
            onClick={() => router.push(`/cases/${item._id}`)}
            style={{
              border: "1px solid #ddd",
              padding: 16,
              borderRadius: 8,
              cursor: "pointer",
              background: "#fafafa",
            }}
          >
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <small>Status: {item.status}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
