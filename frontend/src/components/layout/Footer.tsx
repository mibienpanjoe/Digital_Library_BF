import { BookOpen } from "lucide-react";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold">{APP_NAME}</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              Catalogue
            </Link>
            <Link
              href="/login"
              className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              Connexion
            </Link>
          </nav>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
