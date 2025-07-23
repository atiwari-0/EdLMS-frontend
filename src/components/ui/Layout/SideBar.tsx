"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Calendar, FileText, HelpCircle, School, Users } from "lucide-react";
import React from "react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  href: string;
};

const navs: Record<string, NavItem[]> = {
  admin: [
      { name: "Dashboard", icon: <School className="h-5 w-5" />, href: "/admin/dashboard" },
      { name: "Manage Accounts", icon: <Users className="h-5 w-5" />, href: "/admin/manage" },
    ],
  teacher: [
      { name: "Dashboard", icon: <School className="h-5 w-5" />, href: "/teacher/dashboard" },
      { name: "My Courses", icon: <BookOpen className="h-5 w-5" />, href: "/teacher/courses" },
      { name: "Upload Notes", icon: <FileText className="h-5 w-5" />, href: "/teacher/notes" },
      { name: "Sessions", icon: <Calendar className="h-5 w-5" />, href: "/teacher/sessions" },
      { name: "Doubts", icon: <HelpCircle className="h-5 w-5" />, href: "/teacher/doubts" },
    ],
      student: [
      { name: "Dashboard", icon: <School className="h-5 w-5" />, href: "/student/dashboard" },
      { name: "My Courses", icon: <BookOpen className="h-5 w-5" />, href: "/student/courses" },
      { name: "Doubts", icon: <HelpCircle className="h-5 w-5" />, href: "/student/doubts" },
    ],
};

export default function Sidebar() {
  const path = usePathname();

  if (["/admin/login", "/student/login", "/teacher/login"].includes(path)) return null;

  const role = Object.keys(navs).find((prefix) => path.startsWith(`/${prefix}`));
  const navItems = role ? navs[role] : [];

  return (
    <aside className="w-64 min-h-screen border-r bg-white p-4 space-y-2">
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
