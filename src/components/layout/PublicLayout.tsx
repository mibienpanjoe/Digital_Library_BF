import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
