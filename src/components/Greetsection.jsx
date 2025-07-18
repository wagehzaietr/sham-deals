import React from 'react';
import { useTranslation } from 'react-i18next';

function Greetsection() {
  const { t } = useTranslation();
  const hour = new Date().getHours();

  let greetKey = '';
  if (hour >= 5 && hour < 12) {
    greetKey = 'greeting.morning';
  } else if (hour >= 12 && hour < 18) {
    greetKey = 'greeting.afternoon';
  } else {
    greetKey = 'greeting.evening';
  }

  return (
    <div className="flex justify-center px-4 mt-6">
      <div className="bg-white mr-5 dark:bg-slate-800 shadow-lg rounded-2xl px-5 py-4 flex items-center justify-center gap-3 w-full">
        <span
          className="text-2xl animate-waving-hand origin-[70%_70%]"
          role="img"
          aria-label="waving hand"
        >
          👋
        </span>
        <h1 className="text-[17px] sm:text-lg font-semibold text-slate-800 dark:text-white">
         {t(greetKey)}
        </h1>
      </div>
    </div>
  );
}

export default Greetsection;
