"use client";

import { useState } from "react";
import { NewsCategory } from "@/services/newsService";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface NewsFiltersClientProps {
  initialCategories: NewsCategory[];
}

export default function NewsFiltersClient({
  initialCategories,
}: NewsFiltersClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Получение текущей категории из URL
  const [activeCategory, setActiveCategory] = useState<string>(
    searchParams.get("category") || "all"
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("search") || ""
  );

  // Обновление URL при смене категории
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);

    // Создаем новые параметры URL
    const params = new URLSearchParams(searchParams);
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    // Обновляем URL без перезагрузки страницы
    router.push(`${pathname}?${params.toString()}`);
  };

  // Обновление URL при вводе поискового запроса
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Создаем новые параметры URL
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim() === "") {
      params.delete("search");
    } else {
      params.set("search", searchQuery);
    }

    // Обновляем URL без перезагрузки страницы
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
      {/* <div className="w-full md:w-1/3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zone-dark-brown/20 border border-zone-dark-brown/40 rounded-lg px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-zone-gold transition-all"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <button type="submit" className="hidden">
            Search
          </button>
        </form>
      </div> */}

      <div className="w-full md:w-auto overflow-x-auto no-scrollbar">
        <div className="flex space-x-2 py-2">
          <CategoryButton
            category={{ id: "all", name: "All" }}
            onClick={() => handleCategoryChange("all")}
            isActive={activeCategory === "all"}
          />

          {initialCategories.map((category) => (
            <CategoryButton
              key={category.id}
              category={category}
              onClick={() => handleCategoryChange(category.id)}
              isActive={activeCategory === category.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryButton({
  category,
  onClick,
  isActive,
}: {
  category: NewsCategory;
  onClick: () => any;
  isActive: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all cursor-pointer ${
        isActive
          ? "bg-zone-gold text-zone-dark-brown font-medium"
          : "bg-zone-dark-brown/20 text-gray-300 hover:bg-zone-dark-brown/40"
      }`}
    >
      {category.name}
    </button>
  );
}
