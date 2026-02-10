"use client";

import React, { useEffect, useState } from "react";
import AnimatedWrapper from "@/components/AnimatedWrapper";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Users,
  LogOut,
} from "lucide-react";

export default function DashboardPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, link: "/dashboard" },
    { name: "AI Chat", icon: MessageSquare, link: "/chat" },
    { name: "Documents", icon: FileText, link: "/documents" },
    { name: "Templates", icon: FileText, link: "/templates" },
    { name: "Hire Lawyer", icon: Users, link: "/hire" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth");
  };

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          "http://localhost:5000/api/bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching bookings");
      }
    };

    fetchBookings();
  }, []);

  return (
    <AnimatedWrapper>
      <div className="min-h-screen flex bg-slate-50 font-inter">

        {/* Sidebar */}
        <aside className="w-64 bg-[#13233F] text-white flex flex-col p-6 space-y-6">
          <h1 className="text-xl font-bold mb-4">YourLawyer</h1>

          <nav className="flex-1 space-y-3">
            {navItems.map(({ name, icon: Icon, link }) => (
              <Link
                key={name}
                href={link}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                  pathname === link
                    ? "bg-white/20"
                    : "hover:bg-white/10"
                }`}
              >
                <Icon size={18} />
                <span>{name}</span>
              </Link>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-white/10 hover:bg-white/20 transition"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h2 className="text-2xl font-semibold text-[#13233F] mb-6">
            Dashboard
          </h2>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <Card title="Ask AI Assistant" desc="Chat with AI assistant." link="/chat" />
            <Card title="Upload Documents" desc="Analyze contracts." link="/documents" />
            <Card title="Generate Templates" desc="Create contracts instantly." link="/templates" />
            <Card title="Hire a Lawyer" desc="Find verified lawyers." link="/hire" />
          </div>

          {/* BOOKINGS */}
          <h3 className="text-xl font-semibold mb-4">
            My Bookings
          </h3>

          {bookings.length === 0 ? (
            <p className="text-slate-600">No bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white p-6 rounded-lg shadow border"
                >
                  <h4 className="font-semibold text-lg">
                    {booking.lawyer?.name}
                  </h4>

                  <p className="text-sm text-gray-600 mt-1">
                    {booking.date
                      ? new Date(booking.date).toDateString()
                      : "Date not set"}{" "}
                    | {booking.timeSlot || "Time not set"}
                  </p>

                  <span
                    className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : booking.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {booking.status}
                  </span>

                  {/* ✅ CHAT BUTTON (FIXED) */}
                  {booking.status === "confirmed" && (
                    <button
                      onClick={() =>
                        router.push(`/chat/${booking._id}`)
                      }
                      className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                    >
                      Open Chat
                    </button>
                  )}

                  {/* 💳 DEMO PAYMENT BUTTON */}
                  {booking.status === "confirmed" && (
                    <button
                      onClick={() =>
                        alert("Demo Payment Successful ✅")
                      }
                      className="mt-3 ml-3 bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </AnimatedWrapper>
  );
}

function Card({ title, desc, link }) {
  return (
    <Link
      href={link}
      className="bg-white p-6 rounded-lg shadow hover:shadow-md border border-slate-200 transition"
    >
      <h3 className="font-semibold text-lg mb-2 text-[#13233F]">
        {title}
      </h3>
      <p className="text-sm text-slate-600">{desc}</p>
    </Link>
  );
}
