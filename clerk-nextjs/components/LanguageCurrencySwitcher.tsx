"use client";

import React, { useState } from 'react';
import { Globe, DollarSign, ChevronDown } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export default function LanguageCurrencySwitcher() {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ar');
  const [selectedCurrency, setSelectedCurrency] = useState('MAD');

  const languages: Language[] = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  const currencies: Currency[] = [
    { code: 'MAD', symbol: 'د.م.', name: 'درهم مغربي' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'AED', symbol: 'د.إ.', name: 'درهم إماراتي' }
  ];

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage);
  const currentCurrency = currencies.find(curr => curr.code === selectedCurrency);

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Language Switcher */}
      <div className="relative">
        <button
          onMouseEnter={() => setIsLanguageOpen(true)}
          onMouseLeave={() => setIsLanguageOpen(false)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors bg-white rounded-lg border border-gray-200 hover:border-emerald-300"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLanguage?.flag}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
        
        {isLanguageOpen && (
          <div
            onMouseEnter={() => setIsLanguageOpen(true)}
            onMouseLeave={() => setIsLanguageOpen(false)}
            className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => setSelectedLanguage(language.code)}
                className={`w-full px-4 py-2 text-right flex items-center gap-3 hover:bg-emerald-50 transition-colors ${
                  selectedLanguage === language.code ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
                }`}
              >
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Currency Switcher */}
      <div className="relative">
        <button
          onMouseEnter={() => setIsCurrencyOpen(true)}
          onMouseLeave={() => setIsCurrencyOpen(false)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors bg-white rounded-lg border border-gray-200 hover:border-emerald-300"
        >
          <DollarSign className="w-4 h-4" />
          <span className="hidden sm:inline">{currentCurrency?.symbol}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
        
        {isCurrencyOpen && (
          <div
            onMouseEnter={() => setIsCurrencyOpen(true)}
            onMouseLeave={() => setIsCurrencyOpen(false)}
            className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
          >
            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => setSelectedCurrency(currency.code)}
                className={`w-full px-4 py-2 text-right flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                  selectedCurrency === currency.code ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
                }`}
              >
                <div className="text-right">
                  <div className="font-medium">{currency.name}</div>
                  <div className="text-xs text-gray-500">{currency.code}</div>
                </div>
                <span className="font-bold">{currency.symbol}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
