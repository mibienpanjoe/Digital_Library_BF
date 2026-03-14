import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 rounded-full bg-muted p-4">
        <BookOpen className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight">
        Page non trouvée
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Retour au catalogue</Link>
      </Button>
    </div>
  );
}
