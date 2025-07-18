import { useState, useEffect } from 'react';
import React from 'react';
export function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed right-0 mr-2 bottom-30 z-50 bg-white/70 text-black border px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
    >
      ↑
    </button>
  );
}
