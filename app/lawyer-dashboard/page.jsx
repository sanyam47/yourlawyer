"use client";

import React, { useState } from "react";
import AnimatedWrapper from "@/components/AnimatedWrapper";
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  LogOut,
} from "lucide-react";

export default function LawyerDashboardPage() {
  const [activeTab, setActiveTab] = useState("requests");

  const navItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "requests", name: "Requests", icon: Users },
    { id: "cases", name: "Cases", icon: FileText },
    { id: "earnings", name: "Earnings", icon: DollarSign },
  ];

  const mockRequests = [
    { id: 1, client: "Riya Mehta", case: "Contract Review", status: "Pending" },
    { id: 2, client: "Aditya Rao", case: "Property Dispute", status: "Accepted" },
  ];

  return (
    <AnimatedWrapper>
      <div className="p-6">
        <div className="min-h-screen flex bg-slate-50 font-inter">
          
          {/* SIDEBAR (SAME AS CLIENT DASHBOARD) */}
          <aside className="w-64 bg-[#13233F] text-white flex flex-col p-6 space-y-6">
            <h1 className="text-xl font-bold mb-4">YourLawyer</h1>

            <nav className="flex-1 space-y-3">
              {navItems.map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition ${
                    activeTab === id ? "bg-white/20" : "hover:bg-white/10"
                  }`}
                >
                  <Icon size={18} />
                  <span>{name}</span>
                </button>
              ))}
            </nav>

            <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-white/10 hover:bg-white/20 transition">
              <LogOut size={16} /> Sign Out
            </button>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 p-8">
            <h2 className="text-2xl font-semibold text-[#13233F] mb-6">
              Lawyer Dashboard
            </h2>

            {/* REQUESTS */}
            {activeTab === "requests" && (
              <div className="space-y-4">
                {mockRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white p-4 border border-slate-200 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{req.client}</p>
                      <p className="text-sm text-slate-600">{req.case}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded ${
                        req.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* CASES */}
            {activeTab === "cases" && (
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <p className="text-slate-700">
                  Case timelines, documents, and updates will appear here.
                </p>
              </div>
            )}

            {/* EARNINGS */}
            {activeTab === "earnings" && (
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-500 mb-2">
                  Monthly Earnings
                </p>
                <p className="text-2xl font-semibold text-[#13233F]">
                  ₹11,200
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </AnimatedWrapper>
  );
}

