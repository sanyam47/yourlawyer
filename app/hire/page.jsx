"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, DollarSign, Search, Star } from "lucide-react";

export default function HireLawyerPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [lawyers, setLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  /* =========================
     FETCH LAWYERS
  ========================= */
  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/lawyers");
        const data = await res.json();
        setLawyers(Array.isArray(data) ? data : []);
        setFilteredLawyers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch lawyers");
      }
    };

    fetchLawyers();
  }, []);

  /* =========================
     FILTER LOGIC
  ========================= */
  useEffect(() => {
    let filtered = [...lawyers];

    if (search) {
      filtered = filtered.filter(
        (lawyer) =>
          lawyer.name?.toLowerCase().includes(search.toLowerCase()) ||
          lawyer.specialization
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    if (selectedSpecialization) {
      filtered = filtered.filter(
        (lawyer) =>
          lawyer.specialization?.toLowerCase() ===
          selectedSpecialization.toLowerCase()
      );
    }

    if (maxBudget) {
      filtered = filtered.filter(
        (lawyer) =>
          Number(lawyer.consultationFee || 0) <= Number(maxBudget)
      );
    }

    setFilteredLawyers(filtered);
  }, [search, selectedSpecialization, maxBudget, lawyers]);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="bg-[#13233F] text-white p-6 shadow-md">
        <h1 className="text-2xl font-semibold">
          Hire a Lawyer
        </h1>
        <p className="text-sm opacity-80">
          Find verified lawyers by specialization, rating, or budget
        </p>
      </header>

      {/* FILTERS */}
      <div className="p-6 bg-white shadow-sm border-b flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
        </div>

        <input
          type="text"
          placeholder="Specialization"
          value={selectedSpecialization}
          onChange={(e) =>
            setSelectedSpecialization(e.target.value)
          }
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Max Budget ₹"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* LAWYER CARDS */}
      <main className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLawyers.length > 0 ? (
          filteredLawyers.map((lawyer) => (
            <div
              key={lawyer._id}
              className="bg-white border rounded-lg shadow p-6 hover:shadow-lg transition"
            >
              {/* PROFILE */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    lawyer.profileImage
                      ? `http://localhost:5000${lawyer.profileImage}`
                      : "/default-avatar.png"
                  }
                  alt="Lawyer"
                  className="w-16 h-16 rounded-full object-cover"
                />

                <div>
                  <h2 className="text-lg font-semibold">
                    {lawyer.name}
                  </h2>

                  {/* ⭐ RATING */}
                  <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
                    <Star size={16} />
                    <span>
                      {lawyer.averageRating
                        ? lawyer.averageRating.toFixed(1)
                        : "0.0"}
                    </span>
                    <span className="text-gray-500">
                      ({lawyer.totalRatings || 0})
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm flex items-center gap-2">
                <Briefcase size={16} />
                {lawyer.specialization || "Not specified"}
              </p>

              <p className="text-sm mt-2">
                Experience: {lawyer.experience || 0} years
              </p>

              <p className="text-sm mt-2 flex items-center gap-2">
                <DollarSign size={16} />
                ₹{lawyer.consultationFee || 0}
              </p>

              <button
                onClick={() =>
                  router.push(`/hire/${lawyer._id}`)
                }
                className="bg-[#13233F] text-white px-4 py-2 rounded mt-4 w-full hover:opacity-90 transition"
              >
                View & Book
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-slate-600">
            No lawyers found.
          </p>
        )}
      </main>
    </div>
  );
}
