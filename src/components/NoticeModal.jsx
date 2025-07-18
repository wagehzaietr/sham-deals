import { useEffect, useState } from 'react';
import React from 'react';
export default function NoticeModal() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 text-center max-w-xs">
        <h2 className="text-lg font-semibold mb-2 dark:text-white">
          🚧 Under Development
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          This app is still under development. Features might not work as expected.
        </p>
      </div>
    </div>
  );
}
