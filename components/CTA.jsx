import Link from "next/link";

export default function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="rounded-lg border border-slate-200/30 bg-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-lg font-semibold text-slate-900">
            Ready to explore?
          </h4>
          <p className="text-sm text-slate-600">
            Create an account in minutes or continue as guest to preview.
          </p>
        </div>

        <div className="flex gap-3">
          {/* ✅ FIXED LINK */}
          <Link
            href="/auth/register"
            className="bg-black text-white px-4 py-2 rounded-md shadow"
          >
            Create account
          </Link>

          {/* ✅ This is fine if /dashboard exists */}
          <Link
            href="/dashboard"
            className="border border-slate-200 px-4 py-2 rounded-md"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
