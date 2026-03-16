"use client";

import Link from "next/link";
import { BookOpen, LogIn, LogOut, Menu, User, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";
import { useAuthContext } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { APP_NAME } from "@/lib/constants";

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuthContext();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-900 dark:text-slate-50 transition-opacity duration-150 hover:opacity-80"
        >
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight">{APP_NAME}</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="sm" className="gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50">
                  <User className="h-4 w-4" />
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem
                    onClick={() => router.push("/admin/dashboard")}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Administration
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Connexion
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Inscription</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden">
          {isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              {isAdmin && (
                <Button
                  variant="ghost"
                  className="justify-start text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50"
                  onClick={() => {
                    router.push("/admin/dashboard");
                    setMobileOpen(false);
                  }}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Administration
                </Button>
              )}
              <Button
                variant="ghost"
                className="justify-start text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50"
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="justify-start text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50" asChild>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Connexion
                </Link>
              </Button>
              <Button className="justify-start" asChild>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  Inscription
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
