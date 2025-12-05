function FeatureCard({ title, desc }) {
  return (
    <div className="rounded-lg border border-slate-200/30 bg-white shadow-sm p-6">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-md bg-[#e8f1ff] flex items-center justify-center text-[#16407b] font-semibold">
          💬
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600 mt-2">{desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          title="AI Legal Assistant"
          desc="Chat in plain English. Get educational guidance, summaries, and next steps."
        />
        <FeatureCard
          title="Document Analysis"
          desc="Drop your files for quick, high-level analysis and extractions."
        />
        <FeatureCard
          title="Template Generator"
          desc="Generate quality drafts like NDAs, leases, or demand letters."
        />
      </div>
    </section>
  );
}
