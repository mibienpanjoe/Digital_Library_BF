import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookForm } from "@/components/admin/BookForm";
import { Upload } from "lucide-react";

export default function AdminUploadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ajouter un livre</h1>
        <p className="text-sm text-muted-foreground">
          Ajoutez un nouveau livre au catalogue
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Formulaire d&apos;upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BookForm />
        </CardContent>
      </Card>
    </div>
  );
}
