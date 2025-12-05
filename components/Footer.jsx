import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-6 py-8 text-sm text-slate-600">
      <div className="border-t border-slate-200/30 pt-6 flex flex-col md:flex-row items-center justify-between">
        <p>© {new Date().getFullYear()} YourLawyer. All rights reserved.</p>
        <nav className="flex gap-4 mt-3 md:mt-0">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
