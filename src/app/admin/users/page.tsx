"use client";

import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, Shield, Trash2, Loader2 } from "lucide-react";
import { User, UserRole } from "@/types/user";
import { formatDate } from "@/lib/format";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // const response = await adminService.getUsers();
        // setUsers(response.data);
        
        await new Promise(resolve => setTimeout(resolve, 800));
        setUsers([
          { id: "1", name: "Admin Principal", email: "admin@digitallibrary.bf", role: "admin", createdAt: "2023-01-01T09:00:00.000Z" },
          { id: "2", name: "Moussa Traoré", email: "m.traore@email.com", role: "user", createdAt: "2024-02-15T14:20:00.000Z" },
          { id: "3", name: "Alice Ouédraogo", email: "alice.o@email.com", role: "user", createdAt: "2024-03-10T11:45:00.000Z" },
        ]);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const getRoleBadge = (role: UserRole) => {
    if (role === "admin") {
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">
          <Shield className="mr-1 h-3 w-3" /> Admin
        </Badge>
      );
    }
    return <Badge variant="outline">Utilisateur</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Utilisateurs</h1>
        <p className="text-slate-500 dark:text-slate-400">Gérez les comptes utilisateurs de la plateforme.</p>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Date d&apos;inscription</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3">
                        <UserIcon className="h-4 w-4 text-slate-500" />
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
