"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Users, Download, ArrowUpRight, TrendingUp } from "lucide-react";
// import { adminService, DashboardStats } from "@/services/admin.service";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // const response = await adminService.getDashboardStats();
        // setStats(response.data);
        
        await new Promise(resolve => setTimeout(resolve, 800));
        setStats({
          totalBooks: 124,
          totalUsers: 850,
          totalDownloads: 3450,
          recentActivity: [
            { id: 1, action: "Nouveau livre ajouté", item: "L'art Burkinabè", user: "Admin", date: "Il y a 2h" },
            { id: 2, action: "Nouvel utilisateur", item: "m.traore@email.com", user: "-", date: "Il y a 5h" },
            { id: 3, action: "Téléchargement", item: "Histoire du BF", user: "Y. Diallo", date: "Il y a 6h" },
          ]
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Tableau de Bord</h1>
        <p className="text-slate-500 dark:text-slate-400">Vue d&apos;ensemble de la bibliothèque numérique.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-xl border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Livres</CardTitle>
            <Book className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +12% ce mois
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +5% ce mois
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Téléchargements</CardTitle>
            <Download className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDownloads}</div>
            <p className="text-xs text-blue-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> Record atteint
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle>Activité Récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div>
                  <p className="text-sm font-semibold">{item.action}</p>
                  <p className="text-xs text-slate-500">{item.item} • {item.user}</p>
                </div>
                <span className="text-xs text-slate-400">{item.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
