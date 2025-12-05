import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="rounded-2xl bg-gradient-to-b from-[#0f2a47] via-[#162d4f] to-[#203d6b] p-10 shadow-xl text-white">
        <h1 id="hero-title" className="text-4xl md:text-5xl font-extrabold leading-tight">
          YourLawyer — AI Lawyer Consultant
        </h1>

        <p className="mt-4 text-lg max-w-3xl text-slate-100/90">
          Get instant legal guidance, analyze documents, and generate attorney-grade templates.
          Hire vetted lawyers when you need real representation.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Link
            href="/signup"
            className="inline-block bg-white text-[#0f2a47] px-6 py-2 rounded-md font-medium shadow transform transition duration-200 hover:scale-105 hover:shadow-lg"
          >
            Get Started
          </Link>

          <Link href="/chat" className="inline-block border border-white/20 bg-white/5 text-white px-5 py-2 rounded-md font-medium">
            Try AI Chat
          </Link>
        </div>
      </div>
      <section
        aria-labelledby="hero-title"
        className="bg-gradient-to-b from-[#13233F] via-[#1E2D54] to-[#F7FAFC] text-white transition-all duration-500"
      >

      </section>
    </section>
  );
}
