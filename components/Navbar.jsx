"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Chat", href: "/chat" },
    { name: "Documents", href: "/documents" },
    { name: "Hire", href: "/hire" },
  ];

  return (
    <header className="bg-gradient-to-r from-[#13233F] to-[#243A6B] text-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <span className="text-xl font-semibold">YourLawyer</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm opacity-90">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition pb-1 ${
                  pathname === link.href
                    ? "text-[#13233F] bg-white/10 rounded-sm px-2"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link href="/auth" className="flex items-center gap-2 text-sm">
              Login/Signup
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/auth">
            <button className="bg-white text-[#16243B] px-4 py-1.5 rounded-md text-sm font-medium shadow-sm">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
