"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";

interface BookSearchProps {
  onSearch: (search: string) => void;
  onCategoryChange: (category: string) => void;
  currentSearch?: string;
  currentCategory?: string;
}

export function BookSearch({
  onSearch,
  onCategoryChange,
  currentSearch = "",
  currentCategory = "",
}: BookSearchProps) {
  const [search, setSearch] = useState(currentSearch);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search);
  };

  const handleClear = () => {
    setSearch("");
    onSearch("");
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre ou auteur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          {search && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit">Rechercher</Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={currentCategory === "" ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange("")}
        >
          Tous
        </Button>
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={currentCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>
  );
}
