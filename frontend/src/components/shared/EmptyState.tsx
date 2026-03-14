import { BookX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "Aucun résultat",
  description = "Aucun élément trouvé. Essayez de modifier vos critères de recherche.",
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        {icon || <BookX className="h-8 w-8 text-muted-foreground" />}
      </div>
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
