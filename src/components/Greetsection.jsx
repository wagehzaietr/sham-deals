import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

function Greetsection() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const hour = new Date().getHours();

  let greetKey = '';
  if (hour >= 5 && hour < 12) {
    greetKey = 'greeting.morning';
  } else if (hour >= 12 && hour < 18) {
    greetKey = 'greeting.afternoon';
  } else {
    greetKey = 'greeting.evening';
  }

  // Get user's display name
  const getUserName = () => {
    if (!isAuthenticated || !user) return '';
    
    const fullName = user.user_metadata?.full_name;
    const email = user.email;
    
    if (fullName) {
      return fullName;
    } else if (email) {
      return email.split('@')[0]; // Use part before @ as name
    }
    return '';
  };

  const userName = getUserName();

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
        <div className="text-center">
          <h1 className="text-[17px] sm:text-lg font-semibold text-slate-800 dark:text-white">
            {isAuthenticated && userName ? (
              <>
                {t(greetKey)}, {userName}!
              </>
            ) : (
              t(greetKey)
            )}
          </h1>
          {isAuthenticated && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('greeting.welcomeBack')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Greetsection;
