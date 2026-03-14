import { BookGridSkeleton } from "@/components/shared/Skeleton";
import { Navbar } from "@/components/layout/Navbar";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <BookGridSkeleton />
      </div>
    </div>
  );
}
