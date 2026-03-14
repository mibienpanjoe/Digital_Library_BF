"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Upload, 
  Users, 
  LogOut 
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Mes Livres",
    href: "/admin/books",
    icon: BookOpen,
  },
  {
    title: "Ajouter",
    href: "/admin/upload",
    icon: Upload,
  },
  {
    title: "Utilisateurs",
    href: "/admin/users",
    icon: Users,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <nav className="flex items-start flex-col h-screen p-4 border-r max-w-[240px] w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <div className="flex items-center space-x-2 px-2 py-4 mb-6">
        <BookOpen className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg hidden md:block">
          Admin Panel
        </span>
      </div>

      <div className="flex-1 w-full space-y-1">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
              )}
            >
              <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "")} />
              <span className="hidden md:block">{item.title}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto w-full w-full">
        <button
          onClick={logout}
          className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span className="hidden md:block">Déconnexion</span>
        </button>
      </div>
    </nav>
  );
}
