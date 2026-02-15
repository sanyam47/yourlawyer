"use client"

import Link from "next/link"
import HeroJustice from "../components/hero/HeroJustice"




export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen relative overflow-x-hidden">
      
      <HeroJustice />

      {/* HERO SECTION */}
      <section className="relative z-10 min-h-[90vh] flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-[#E5E0D5]">
            YourLawyer — AI Legal Intelligence
          </h1>

          <p className="mt-6 text-lg text-zinc-300">
            Instant legal guidance. AI document analysis.
            Professional template generation.
          </p>

          <div className="mt-10 flex justify-center gap-6">
            <Link
              href="/auth"
              className="px-8 py-3 bg-[#E5E0D5] text-black rounded-md hover:opacity-90 transition"
            >
              Get Started
            </Link>

            <Link
              href="/chat"
              className="px-8 py-3 border border-[#C6A85C] text-[#C6A85C] rounded-md hover:bg-[#C6A85C]/10 transition"
            >
              Try AI Chat
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-semibold text-[#E5E0D5]">
            How It Works
          </h2>
          <p className="mt-6 text-zinc-400">
            Simple. Intelligent. Secure.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="feature-card">
            <div className="feature-glow" />
            <h3 className="feature-title">Upload or Ask</h3>
            <p className="feature-text">
              Submit legal documents or describe your concern.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-glow" />
            <h3 className="feature-title">AI Legal Analysis</h3>
            <p className="feature-text">
              AI processes clauses and risks instantly.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-glow" />
            <h3 className="feature-title">Structured Insights</h3>
            <p className="feature-text">
              Receive summaries and ready-to-use templates.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
