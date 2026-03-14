import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Digital Library BF — Bibliothèque Numérique du Burkina Faso",
  description:
    "Découvrez et téléchargez des livres et documents du Burkina Faso.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-inter antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster position="bottom-right" duration={4000} richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
