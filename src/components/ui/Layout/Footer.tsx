'use client';
import { School } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const path = usePathname();
  return (
    <footer className={`${['/admin/login', '/student/login', '/teacher/login'].includes(path) ? 'hidden' : ''} w-full border-t border-border bg-muted/50 text-muted-foreground text-sm`}>
      <div className="mx-auto max-w-screen-xl px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <School className="h-4 w-4" />
          <span>EdLMS © {new Date().getFullYear()}</span>
        </div>

        <div className="italic text-xs text-center md:text-right">
          Built with Bun, Next.js, GraphQL, and TypeScript — by fire and force.
        </div>
      </div>
    </footer>
  );
}
