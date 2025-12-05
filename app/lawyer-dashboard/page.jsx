"use client";

import { useState } from "react";
import { Briefcase, Users, FileText, Calendar, DollarSign, CheckCircle } from "lucide-react";

export default function LawyerDashboardPage() {
  const [activeTab, setActiveTab] = useState("requests");

  const mockRequests = [
    { id: 1, client: "Riya Mehta", case: "Contract Review", status: "Pending" },
    { id: 2, client: "Aditya Rao", case: "Property Dispute", status: "Accepted" },
  ];

  const mockEarnings = [
    { month: "August", amount: 8200 },
    { month: "September", amount: 9400 },
    { month: "October", amount: 11200 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      {/* Header */}
      <header className="bg-[#13233F] text-white p-4 shadow-md">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Briefcase size={20} /> Lawyer Dashboard
        </h1>
        <p className="text-sm opacity-80">Manage cases, clients, and earnings</p>
      </header>

      {/* Tabs */}
      <nav className="flex gap-4 bg-white border-b border-slate-200 px-6 py-3 text-slate-700 text-sm font-medium">
        {[
          { id: "requests", label: "Client Requests" },
          { id: "clients", label: "Active Clients" },
          { id: "cases", label: "Case Management" },
          { id: "earnings", label: "Earnings" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 border-b-2 transition ${
              activeTab === tab.id
                ? "border-[#13233F] text-[#13233F]"
                : "border-transparent hover:text-[#13233F]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {/* Client Requests */}
        {activeTab === "requests" && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users size={18} /> Incoming Client Requests
            </h2>
            <div className="space-y-3">
              {mockRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white p-4 border border-slate-200 rounded-md flex justify-between items-center"
                >
                  <div>
                    <p className="text-slate-800 font-medium">{req.client}</p>
                    <p className="text-sm text-slate-600">{req.case}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        req.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {req.status}
                    </span>
                    {req.status === "Pending" && (
                      <>
                        <button className="bg-[#13233F] text-white text-xs px-3 py-1 rounded-md hover:bg-[#1a2b55] transition">
                          Accept
                        </button>
                        <button className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-md hover:bg-red-200 transition">
                          Decline
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Clients */}
        {activeTab === "clients" && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users size={18} /> Active Clients
            </h2>
            <ul className="space-y-3">
              <li className="bg-white p-4 border border-slate-200 rounded-md">
                <p className="font-medium">Riya Mehta</p>
                <p className="text-sm text-slate-600">Case: Contract Review</p>
              </li>
              <li className="bg-white p-4 border border-slate-200 rounded-md">
                <p className="font-medium">Aditya Rao</p>
                <p className="text-sm text-slate-600">Case: Property Dispute</p>
              </li>
            </ul>
          </div>
        )}

        {/* Case Management */}
        {activeTab === "cases" && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText size={18} /> Case Management
            </h2>
            <p className="text-slate-700">
              Timeline, document uploads, and updates will be integrated here later.
            </p>
          </div>
        )}

        {/* Earnings */}
        {activeTab === "earnings" && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign size={18} /> Monthly Earnings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockEarnings.map((e, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-md p-4 text-center shadow-sm"
                >
                  <p className="text-slate-600 text-sm">{e.month}</p>
                  <p className="text-lg font-semibold text-[#13233F]">
                    ₹{e.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 text-green-700">
              <CheckCircle size={18} />
              <span className="text-sm">
                Payouts processed automatically every month.
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
