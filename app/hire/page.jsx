"use client";

import { useState } from "react";
import { Star, Briefcase, User, DollarSign, Search } from "lucide-react";

export default function HireLawyerPage() {
  const [search, setSearch] = useState("");
  const [lawyers, setLawyers] = useState([
    {
      id: 1,
      name: "Adv. Riya Sharma",
      specialization: "Corporate Law",
      rating: 4.9,
      price: 1200,
      experience: "6 years",
    },
    {
      id: 2,
      name: "Adv. Arjun Patel",
      specialization: "Criminal Law",
      rating: 4.7,
      price: 900,
      experience: "4 years",
    },
    {
      id: 3,
      name: "Adv. Meera Nair",
      specialization: "Intellectual Property",
      rating: 4.8,
      price: 1500,
      experience: "8 years",
    },
    {
      id: 4,
      name: "Adv. Rohan Desai",
      specialization: "Family Law",
      rating: 4.6,
      price: 800,
      experience: "5 years",
    },
  ]);

  const filteredLawyers = lawyers.filter(
    (lawyer) =>
      lawyer.name.toLowerCase().includes(search.toLowerCase()) ||
      lawyer.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const handleHire = (name) => {
    alert(`You have successfully requested to hire ${name}! (Mock action for now)`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      {/* Header */}
      <header className="bg-[#13233F] text-white p-4 shadow-md">
        <h1 className="text-xl font-semibold">Hire a Lawyer</h1>
        <p className="text-sm opacity-80">
          Find verified lawyers by specialization, rating, or price
        </p>
      </header>

      {/* Search Bar */}
      <div className="p-6 bg-white shadow-sm border-b border-slate-200 flex items-center gap-2">
        <Search size={20} className="text-slate-500" />
        <input
          type="text"
          placeholder="Search lawyers by name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-slate-300 rounded-md p-2 outline-none"
        />
      </div>

      {/* Lawyer Cards */}
      <main className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLawyers.length > 0 ? (
          filteredLawyers.map((lawyer) => (
            <div
              key={lawyer.id}
              className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#13233F] flex items-center gap-2">
                  <User size={18} /> {lawyer.name}
                </h2>
                <div className="flex items-center text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span className="ml-1 text-sm text-slate-700">
                    {lawyer.rating}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-700 flex items-center gap-2 mb-2">
                <Briefcase size={16} /> {lawyer.specialization}
              </p>
              <p className="text-sm text-slate-700 mb-2">
                Experience: {lawyer.experience}
              </p>
              <p className="text-sm text-slate-700 flex items-center gap-2 mb-4">
                <DollarSign size={16} /> ₹{lawyer.price} / session
              </p>

              <button
                onClick={() => handleHire(lawyer.name)}
                className="bg-[#13233F] text-white px-4 py-2 rounded-md hover:bg-[#1a2b55] transition w-full"
              >
                Hire Lawyer
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-slate-600">
            No lawyers found for “{search}”
          </p>
        )}
      </main>
    </div>
  );
}
