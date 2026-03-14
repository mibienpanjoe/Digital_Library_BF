"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-700">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl hidden sm:inline-block text-slate-900 dark:text-white">
            Digital Library BF
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  {user.name.charAt(0).toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === "admin" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">Dashboard Admin</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={logout}>
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Connexion</Link>
              </Button>
              <Button asChild>
                <Link href="/register">S&apos;inscrire</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
