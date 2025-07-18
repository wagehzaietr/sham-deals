// src/context/SearchContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import React from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // mock search effect – replace with real API call
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      const mock = query === '404' ? [] : ['item1', 'item2']; // fake
      setResults(mock);
      if (mock.length) {
        toast.success(`Found ${mock.length} result(s)`);
      } else {
        toast.error('No items found');
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <SearchContext.Provider value={{ query, setQuery, results }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);