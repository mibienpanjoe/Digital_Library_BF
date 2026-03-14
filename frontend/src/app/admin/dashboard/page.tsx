"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/admin/StatsCard";
import { DownloadHistory } from "@/components/admin/DownloadHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Download, TrendingUp } from "lucide-react";
import { adminService } from "@/services/admin.service";
import type { DashboardStats } from "@/types/download";
import { TableSkeleton } from "@/components/shared/Skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (error) {
    return <ErrorState message={error} onRetry={fetchStats} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Vue d&apos;ensemble de la plateforme
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </>
        ) : stats ? (
          <>
            <StatsCard
              title="Total Livres"
              value={stats.totalBooks}
              icon={BookOpen}
            />
            <StatsCard
              title="Utilisateurs"
              value={stats.totalUsers}
              icon={Users}
            />
            <StatsCard
              title="Téléchargements"
              value={stats.totalDownloads}
              icon={Download}
            />
          </>
        ) : null}
      </div>

      {/* Recent Downloads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Téléchargements récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : stats?.recentDownloads && stats.recentDownloads.length > 0 ? (
            <div className="space-y-3">
              {stats.recentDownloads.map((dl) => (
                <div
                  key={dl.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{dl.book.title}</p>
                    <p className="text-xs text-muted-foreground">
                      par {dl.user.name}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(dl.downloadedAt)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Aucun téléchargement récent
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
