"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { User } from "@/types/user";

interface UserTableProps {
  users: User[];
  onViewDownloads?: (user: User) => void;
}

export function UserTable({ users, onViewDownloads }: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead>Téléchargements</TableHead>
          <TableHead>Inscrit le</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell className="text-muted-foreground">{user.email}</TableCell>
            <TableCell>
              <Badge
                variant={user.role === "admin" ? "default" : "secondary"}
                className="text-xs"
              >
                {user.role === "admin" ? "Admin" : "Utilisateur"}
              </Badge>
            </TableCell>
            <TableCell>{user.downloadCount || 0}</TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(user.createdAt)}
            </TableCell>
            <TableCell className="text-right">
              {onViewDownloads && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => onViewDownloads(user)}
                >
                  <Eye className="h-4 w-4" />
                  Historique
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
