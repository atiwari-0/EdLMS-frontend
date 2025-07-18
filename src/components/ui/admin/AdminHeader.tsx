// components/layout/Header.tsx
"use client";

import { School } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-border bg-background shadow-sm">
      <div className="mx-auto max-w-screen-xl px-4 py-3 flex items-center justify-between">
        {/* Logo + Name */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <School className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold tracking-tight text-foreground">EdLMS</span>
        </Link>

        {/* Placeholder for future nav / auth actions */}
        <div className="text-sm text-muted-foreground hidden md:block">
          Knowledge is discipline.
        </div>
      </div>
    </header>
  );
}
