"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
  className?: string;
}

interface Suggestion {
  id: number;
  text: string;
  type: "product" | "category" | "brand";
  url: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "ابحث عن منتجات، علامات تجارية، أو فئات...",
  onSearch,
  showSuggestions = true,
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // بيانات تجريبية للاقتراحات
  const mockSuggestions: Suggestion[] = [
    { id: 1, text: "زيت الأركان", type: "product", url: "/products?search=زيت الأركان" },
    { id: 2, text: "عشبة الخزامى", type: "product", url: "/products?search=عشبة الخزامى" },
    { id: 3, text: "العناية بالبشرة", type: "category", url: "/category/visage" },
    { id: 4, text: "العناية بالشعر", type: "category", url: "/category/cheveux" },
    { id: 5, text: "الأعشاب الطبية", type: "category", url: "/products?category=الأعشاب الطبية" },
    { id: 6, text: "Parapharmacie", type: "category", url: "/products?category=Parapharmacie" },
    { id: 7, text: "سيروم فيتامين C", type: "product", url: "/products?search=سيروم فيتامين C" },
    { id: 8, text: "واقي شمس", type: "product", url: "/products?search=واقي شمس" },
  ];

  // تصفية الاقتراحات بناءً على البحث
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    
    // محاكاة تأخير البحث
    const timer = setTimeout(() => {
      const filtered = mockSuggestions.filter((suggestion) =>
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // عرض 5 اقتراحات كحد أقصى
      setIsLoading(false);
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      setIsOpen(false);
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.text);
    setIsOpen(false);
    router.push(suggestion.url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const getTypeIcon = (type: Suggestion["type"]) => {
    switch (type) {
      case "product":
        return "🛍️";
      case "category":
        return "📂";
      case "brand":
        return "🏷️";
      default:
        return "🔍";
    }
  };

  const getTypeLabel = (type: Suggestion["type"]) => {
    switch (type) {
      case "product":
        return "منتج";
      case "category":
        return "فئة";
      case "brand":
        return "علامة تجارية";
      default:
        return "";
    }
  };

  return (
    <div className={`relative w-full max-w-2xl ${className}`} dir="rtl">
      {/* شريط البحث الرئيسي */}
      <div className="relative">
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pr-12 pl-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white shadow-sm"
          dir="rtl"
        />

        {/* زر مسح البحث */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* قائمة الاقتراحات */}
      {showSuggestions && isOpen && (
        <>
          {/* خلفية شبه شفافة */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* قائمة الاقتراحات */}
          <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
            {/* حالة التحميل */}
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                <span className="mr-2">جاري البحث...</span>
              </div>
            ) : suggestions.length > 0 ? (
              <>
                {/* رأس القائمة */}
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4 ml-2" />
                    <span>اقتراحات شائعة</span>
                  </div>
                </div>

                {/* قائمة الاقتراحات */}
                <ul className="max-h-64 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion.id}>
                      <button
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center">
                          <span className="ml-3 text-lg">{getTypeIcon(suggestion.type)}</span>
                          <div className="text-right">
                            <div className="font-medium text-gray-900 group-hover:text-emerald-600">
                              {suggestion.text}
                            </div>
                            <div className="text-xs text-gray-500">
                              {getTypeLabel(suggestion.type)}
                            </div>
                          </div>
                        </div>
                        <Search className="h-4 w-4 text-gray-400 group-hover:text-emerald-600" />
                      </button>
                    </li>
                  ))}
                </ul>

                {/* رأس القائمة للبحث الكامل */}
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={() => handleSearch()}
                    className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    عرض جميع نتائج البحث لـ "{query}"
                  </button>
                </div>
              </>
            ) : query ? (
              <div className="p-4 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>لم يتم العثور على نتائج لـ "{query}"</p>
                <p className="text-sm mt-1">جرب كلمات مفتاحية مختلفة</p>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchBar;
