import { Skeleton } from "@/components/ui/skeleton";

export function BookCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Skeleton className="mb-4 aspect-[3/4] w-full rounded-xl" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-3 h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-12 rounded-lg" />
        <Skeleton className="h-5 w-16 rounded-lg" />
      </div>
    </div>
  );
}

export function BookGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full rounded-lg" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <Skeleton className="aspect-[3/4] w-full rounded-xl md:w-72" />
      <div className="flex-1 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-6 h-10 w-40 rounded-lg" />
      </div>
    </div>
  );
}
