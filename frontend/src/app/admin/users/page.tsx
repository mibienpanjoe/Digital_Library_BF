"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { UserTable } from "@/components/admin/UserTable";
import { DownloadHistory } from "@/components/admin/DownloadHistory";
import { Pagination } from "@/components/shared/Pagination";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/Skeleton";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Users, Search } from "lucide-react";
import { adminService } from "@/services/admin.service";
import type { User } from "@/types/user";
import type { Download } from "@/types/download";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Download history dialog
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [downloadsLoading, setDownloadsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
  };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getUsers({ page, limit: 20, search: debouncedSearch });
      setUsers(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement"
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleViewDownloads = async (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
    setDownloadsLoading(true);
    try {
      const response = await adminService.getUserDownloads(user.id);
      setDownloads(response.data);
    } catch {
      setDownloads([]);
    } finally {
      setDownloadsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Utilisateurs</h1>
        <p className="text-sm text-muted-foreground">
          Gérez les utilisateurs de la plateforme
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Liste des utilisateurs
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchUsers} />
          ) : users.length === 0 ? (
            <EmptyState
              title="Aucun utilisateur"
              description="Aucun utilisateur trouvé."
            />
          ) : (
            <>
              <UserTable
                users={users}
                onViewDownloads={handleViewDownloads}
              />
              <div className="mt-4">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Download History Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogHeader>
          <DialogTitle>
            Historique — {selectedUser?.name}
          </DialogTitle>
          <DialogDescription>
            Téléchargements de {selectedUser?.email}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {downloadsLoading ? (
            <TableSkeleton rows={3} />
          ) : (
            <DownloadHistory downloads={downloads} />
          )}
        </div>
      </Dialog>
    </div>
  );
}
