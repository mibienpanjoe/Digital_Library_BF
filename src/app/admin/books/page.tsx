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
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Book } from "@/types/book";
import { formatDate, formatFileSize } from "@/lib/format";

export default function BooksManagementPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        // const response = await adminService.getAllBooks();
        // setBooks(response.data);
        
        await new Promise(resolve => setTimeout(resolve, 800));
        setBooks([
          {
            id: "1",
            title: "Histoire du Burkina Faso",
            author: "Jean-Baptiste Kiéthéga",
            description: "Une exploration détaillée de l'histoire du pays.",
            fileFormat: "pdf",
            fileSize: 2500000,
            category: "Histoire",
            downloadCount: 154,
            createdAt: "2024-01-01T12:00:00.000Z",
            updatedAt: "2024-01-01T12:00:00.000Z",
          },
          {
            id: "2",
            title: "Faso Dan Fani",
            author: "Seydou Konaté",
            description: "Sur l'art du tissage traditionnel.",
            fileFormat: "epub",
            fileSize: 1200000,
            category: "Culture",
            downloadCount: 89,
            createdAt: "2024-01-10T09:30:00.000Z",
            updatedAt: "2024-01-10T09:30:00.000Z",
          }
        ]);
      } catch (error) {
        console.error("Failed to fetch books", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Gestion des Livres</h1>
          <p className="text-slate-500 dark:text-slate-400">Gérez le catalogue de la bibliothèque.</p>
        </div>
        <Button asChild className="rounded-lg">
          <Link href="/admin/upload">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un livre
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-2 bg-white dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
        <Search className="h-4 w-4 text-slate-400 ml-2" />
        <Input 
          placeholder="Rechercher par titre ou auteur..." 
          className="border-0 focus-visible:ring-0" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Auteur</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Taille</TableHead>
              <TableHead>Date d&apos;ajout</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">Chargement...</TableCell>
              </TableRow>
            ) : filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">Aucun livre trouvé.</TableCell>
              </TableRow>
            ) : (
              filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell className="uppercase text-xs font-bold">{book.fileFormat}</TableCell>
                  <TableCell>{formatFileSize(book.fileSize)}</TableCell>
                  <TableCell>{formatDate(book.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                       <Button variant="ghost" size="icon" asChild>
                        <Link href={`/book/${book.id}`} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
