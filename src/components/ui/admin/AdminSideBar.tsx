"use client";

import Link from "next/link";
import { School, Users } from "lucide-react";
import { usePathname } from "next/navigation";
const navItems = [
  { name: "Dashboard", icon: <School className="h-5 w-5" />, href: "/admin/dashboard" },
  { name: "Manage Accounts", icon: <Users className="h-5 w-5" />, href: "/admin/manage" },
];

export default function AdminSidebar() {
  const path = usePathname();
  return (
    <aside className={`${['/admin/login', '/student/login', '/teacher/login'].includes(path) ? 'hidden' : ''} w-64 min-h-screen border-r bg-white p-4 space-y-2`}>
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="flex items-center space-x-2 p-2 rounded hover:bg-muted transition"
        >
          {item.icon}
          <span>{item.name}</span>
        </Link>
      ))}
    </aside>
  );
}
