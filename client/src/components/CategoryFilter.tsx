import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  onCategoryChange?: (category: string) => void;
}

export default function CategoryFilter({ categories, onCategoryChange }: CategoryFilterProps) {
  const [selected, setSelected] = useState("All");

  const handleSelect = (category: string) => {
    setSelected(category);
    onCategoryChange?.(category);
    console.log("Category selected:", category);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
      <Button
        variant={selected === "All" ? "default" : "outline"}
        onClick={() => handleSelect("All")}
        className="rounded-full whitespace-nowrap"
        data-testid="button-category-all"
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selected === category ? "default" : "outline"}
          onClick={() => handleSelect(category)}
          className="rounded-full whitespace-nowrap"
          data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
