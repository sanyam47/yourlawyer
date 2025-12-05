"use client";

import React, { useState } from "react";
import AnimatedWrapper from "@/components/AnimatedWrapper";
import Link from "next/link";
import { LayoutDashboard, MessageSquare, FileText, Users, LogOut } from "lucide-react";

export default function DashboardPage() {
  const [active, setActive] = useState("dashboard");

  const navItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, link: "/dashboard" },
    { id: "chat", name: "AI Chat", icon: MessageSquare, link: "/chat" },
    { id: "documents", name: "Documents", icon: FileText, link: "/documents" },
    { id: "hire", name: "Hire Lawyer", icon: Users, link: "/hire" },
  ];

  return (
    <AnimatedWrapper>
      <div className="p-6">
        <div className="min-h-screen flex bg-slate-50 font-inter">
          {/* Sidebar */}
          <aside className="w-64 bg-[#13233F] text-white flex flex-col p-6 space-y-6">
            <h1 className="text-xl font-bold mb-4">YourLawyer</h1>
            <nav className="flex-1 space-y-3">
              {navItems.map(({ id, name, icon: Icon, link }) => (
                <Link
                  key={id}
                  href={link}
                  onClick={() => setActive(id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                    active === id ? "bg-white/20" : "hover:bg-white/10"
                  }`}
                >
                  <Icon size={18} />
                  <span>{name}</span>
                </Link>
              ))}
            </nav>
            <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-white/10 hover:bg-white/20 transition">
              <LogOut size={16} /> Sign Out
            </button>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            <h2 className="text-2xl font-semibold text-[#13233F] mb-6">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card
                title="Ask AI Assistant"
                desc="Chat with the legal AI assistant for instant help."
                link="/chat"
              />
              <Card
                title="Upload Documents"
                desc="Analyze your legal contracts and get summaries."
                link="/documents"
              />
              <Card
                title="Generate Templates"
                desc="Create contracts, NDAs, or agreements instantly."
                link="/templates"
              />
              <Card
                title="Hire a Lawyer"
                desc="Find verified lawyers for complex cases."
                link="/hire"
              />
            </div>
          </main>
        </div>
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
      <h3 className="font-semibold text-lg mb-2 text-[#13233F]">{title}</h3>
      <p className="text-sm text-slate-600">{desc}</p>
    </Link>
  );
}
