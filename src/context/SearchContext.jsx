// src/context/SearchContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { searchPosts } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import React from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // Firebase search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const searchResults = await searchPosts(query.trim());
        setResults(searchResults);
        
        if (searchResults.length > 0) {
          toast.success(t('search.found', { count: searchResults.length }));
        } else {
          toast.error(t('search.noResults'));
        }
      } catch (error) {
        console.error('Search error:', error);
        toast.error(t('search.error'));
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 600); // Debounce search

    return () => clearTimeout(timer);
  }, [query, t]);

  return (
    <SearchContext.Provider value={{ query, setQuery, results, loading }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);