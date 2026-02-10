"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, TrendingUp, Clock } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
}

interface Suggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'brand';
  url: string;
}

const mockSuggestions: Suggestion[] = [
  { id: '1', text: 'زيت الأرغان النقي', type: 'product', url: '/products/1' },
  { id: '2', text: 'إكليل الجبل', type: 'product', url: '/products/1001' },
  { id: '3', text: 'الأعشاب الطبية', type: 'category', url: '/products?category=الأعشاب الطبية' },
  { id: '4', text: 'La Roche-Posay', type: 'brand', url: '/brands/la-roche-posay' },
  { id: '5', text: 'كريم فيتامين C', type: 'product', url: '/products/2' },
  { id: '6', text: 'Parapharmacie', type: 'category', url: '/products?category=Parapharmacie' }
];

const trendingSearches = [
  'زيت الأرغان',
  'إكليل الجبل',
  'كريم فيتامين C',
  'الخزامى',
  'كريم مرطب'
];

export default function SearchBar({
  onSearch,
  placeholder = 'ابحث عن منتجات، ماركات، أو أعشاب...',
  className = '',
  showSuggestions = true
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim() && showSuggestions) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query, showSuggestions]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      setIsOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.text);
    setIsOpen(false);
    // Navigate to suggestion URL
    window.location.href = suggestion.url;
  };

  const getSuggestionIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'product':
        return '🛍️';
      case 'category':
        return '📂';
      case 'brand':
        return '🏷️';
      default:
        return '🔍';
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`} dir="rtl">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setIsOpen(true)}
            placeholder={placeholder}
            className="w-full pr-12 pl-12 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-400 bg-white"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="max-h-80 overflow-y-auto">
            {/* Suggestions */}
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-2 px-3">اقتراحات البحث</div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-right px-3 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 group"
                >
                  <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                  <div className="flex-1">
                    <div className="text-gray-800 group-hover:text-emerald-600 transition-colors">
                      {suggestion.text}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">{suggestion.type}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Trending Searches */}
            <div className="border-t border-gray-100 p-2">
              <div className="text-xs font-medium text-gray-500 mb-2 px-3 flex items-center gap-2">
                <TrendingUp className="w-3 h-3" />
                الأكثر بحثاً
              </div>
              {trendingSearches.slice(0, 3).map((trending, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(trending)}
                  className="w-full text-right px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-3 group"
                >
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-sm text-gray-600 group-hover:text-emerald-600 transition-colors">
                    {trending}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
