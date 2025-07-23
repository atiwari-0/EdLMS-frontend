"use client";

import LogoutButton from "@/components/Logout";
import { School } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const path = usePathname();
  return (
    <header className={`${['/admin/login', '/student/login', '/teacher/login'].includes(path) ? 'hidden' : ''} w-full border-b border-border bg-background shadow-sm`}>
      <div className="mx-auto max-w-screen-xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <School className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold tracking-tight text-foreground">EdLMS</span>
        </Link>
        <div className="text-sm text-muted-foreground hidden md:block">
          Knowledge is discipline.
          <LogoutButton/>
        </div>
      </div>
    </header>
  );
}
