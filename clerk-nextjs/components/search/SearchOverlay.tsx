"use client";

import React, { useState, useEffect } from 'react';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  onSearch,
  placeholder = 'ابحث عن منتجات...',
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock suggestions - in real app, this would come from API
  const mockSuggestions = [
    'فيتامين د3',
    'زيت الأرغان',
    'الكركم',
    'الزنجبيل',
    'مغنيسيوم',
    'أوميغا 3',
    'البروبايوتكس',
    'فيتامين C',
    'الشاي الأخضر',
    'زيت جوز الهند'
  ];

  useEffect(() => {
    if (query.length > 0) {
      setIsSearching(true);
      // Simulate API call delay
      const timer = setTimeout(() => {
        const filtered = mockSuggestions.filter(suggestion =>
          suggestion.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setIsSearching(false);
    }
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSuggestions([]);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      onClose();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Search Container */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center space-x-4 space-x-reverse">
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pr-10 pl-4 py-3 text-lg border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  بحث
                </button>
              </div>
            </form>
          </div>

          {/* Suggestions */}
          {(suggestions.length > 0 || isSearching) && (
            <div className="border-t border-gray-200">
              <div className="container mx-auto px-4 py-4">
                <div className="max-w-2xl mx-auto">
                  {isSearching ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent animate-spin rounded-full" />
                      <span className="mr-3 text-gray-600">جاري البحث...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500 mb-3">اقتراحات البحث</p>
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-right px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between group"
                        >
                          <span className="text-gray-700">{suggestion}</span>
                          <ChevronDown className="w-4 h-4 text-gray-400 rotate-270 group-hover:text-emerald-600 transition-colors" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {!query && !isSearching && suggestions.length === 0 && (
            <div className="border-t border-gray-200">
              <div className="container mx-auto px-4 py-4">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">عمليات البحث الأخيرة</p>
                    <button className="text-sm text-emerald-600 hover:text-emerald-700">
                      مسح الكل
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['فيتامين د3', 'زيت الأرغان', 'الكركم'].map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(item)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchOverlay;
