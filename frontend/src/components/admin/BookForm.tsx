"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, FileText, Image as ImageIcon } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";

export function BookForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    if (title.length < 2) {
      toast.error("Le titre doit contenir au moins 2 caractères");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("description", description);
      if (category) formData.append("category", category);
      formData.append("file", bookFile);
      if (coverFile) formData.append("cover", coverFile);

      await adminService.createBook(formData);
      toast.success("Livre ajouté avec succès !");
      router.push("/admin/books");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de l'upload"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du livre"
            required
            minLength={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Auteur *</Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Nom de l'auteur"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description du livre..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Catégorie</Label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Sélectionner une catégorie</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Book file */}
        <div className="space-y-2">
          <Label>Fichier du livre (PDF/ePub) *</Label>
          <div
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-6 transition-colors duration-150 hover:border-primary/50 hover:bg-secondary/50"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileText className="mb-2 h-8 w-8 text-muted-foreground" />
            {bookFile ? (
              <p className="text-sm font-medium">{bookFile.name}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Cliquez ou glissez un fichier
              </p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.epub"
              className="hidden"
              onChange={(e) => setBookFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        {/* Cover image */}
        <div className="space-y-2">
          <Label>Image de couverture</Label>
          <div
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-6 transition-colors duration-150 hover:border-primary/50 hover:bg-secondary/50"
            onClick={() => coverInputRef.current?.click()}
          >
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Preview"
                className="h-24 w-auto rounded-lg object-cover"
              />
            ) : (
              <>
                <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Image de couverture (optionnel)
                </p>
              </>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={handleCoverChange}
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="gap-2">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        {isLoading ? "Upload en cours..." : "Ajouter le livre"}
      </Button>
    </form>
  );
}
