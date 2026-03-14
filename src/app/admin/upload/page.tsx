"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Upload, Loader2, ArrowLeft, FileType, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
// import { adminService } from "@/services/admin.service";

export default function BookUploadPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
  });

  const [files, setFiles] = useState<{
    book: File | null;
    cover: File | null;
  }>({
    book: null,
    cover: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "book" | "cover") => {
    if (e.target.files?.[0]) {
      setFiles(prev => ({ ...prev, [type]: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.book) {
      toast.error("Le fichier du livre est requis");
      return;
    }

    try {
      setIsLoading(true);
      // const data = new FormData();
      // data.append("title", formData.title);
      // data.append("author", formData.author);
      // data.append("category", formData.category);
      // data.append("description", formData.description);
      // data.append("file", files.book);
      // if (files.cover) data.append("cover", files.cover);

      // await adminService.createBook(data);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Livre ajouté avec succès");
      router.push("/admin/books");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du livre");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/books">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Ajouter un nouveau livre</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <Card className="rounded-xl border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle>Informations Générales</CardTitle>
              <CardDescription>Saisissez les détails du livre pour le catalogue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du livre</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    placeholder="ex: L'histoire du Faso" 
                    required 
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Auteur</Label>
                  <Input 
                    id="author" 
                    name="author" 
                    placeholder="ex: Jean Kiéthéga" 
                    required 
                    value={formData.author}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Input 
                  id="category" 
                  name="category" 
                  placeholder="ex: Histoire, Culture, Droit..." 
                  required 
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Résumé)</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Bref résumé de l'ouvrage..." 
                  className="min-h-[120px]"
                  required 
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-xl border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileType className="mr-2 h-5 w-5 text-blue-500" /> Fichier Livre
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <Upload className="h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500 mb-4">
                    {files.book ? files.book.name : "Cliquez pour uploader (PDF, EPUB)"}
                  </p>
                  <Input 
                    type="file" 
                    accept=".pdf,.epub" 
                    className="hidden" 
                    id="book-upload"
                    onChange={(e) => handleFileChange(e, "book")}
                  />
                  <Button variant="outline" type="button" asChild size="sm">
                    <Label htmlFor="book-upload" className="cursor-pointer">Sélectionner</Label>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <ImageIcon className="mr-2 h-5 w-5 text- amber-500" /> Couverture (Optionnel)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <Upload className="h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500 mb-4">
                    {files.cover ? files.cover.name : "Image JPG, PNG"}
                  </p>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    id="cover-upload"
                    onChange={(e) => handleFileChange(e, "cover")}
                  />
                  <Button variant="outline" type="button" asChild size="sm">
                    <Label htmlFor="cover-upload" className="cursor-pointer">Sélectionner</Label>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.back()}>Annuler</Button>
            <Button type="submit" disabled={isLoading} className="px-8">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publier le livre
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
