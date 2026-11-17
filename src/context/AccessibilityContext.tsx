import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  textScale: 'normal' | 'large' | 'extra-large';
  setTextScale: (scale: 'normal' | 'large' | 'extra-large') => void;
  announceToScreenReader: (message: string) => void;
  screenReaderAnnouncement: string;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('smogguard_high_contrast') === 'true';
  });

  const [textScale, setTextScale] = useState<'normal' | 'large' | 'extra-large'>(() => {
    return (localStorage.getItem('smogguard_text_scale') as 'normal' | 'large' | 'extra-large') || 'normal';
  });

  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState<string>('');

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('smogguard_high_contrast', String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-scale-lg', 'text-scale-xl');
    if (textScale === 'large') {
      root.classList.add('text-scale-lg');
    } else if (textScale === 'extra-large') {
      root.classList.add('text-scale-xl');
    }
    localStorage.setItem('smogguard_text_scale', textScale);
  }, [textScale]);

  const toggleHighContrast = () => setHighContrast(prev => !prev);

  const announceToScreenReader = (message: string) => {
    setScreenReaderAnnouncement(message);
    // Clear after 3 seconds so subsequent identical messages trigger re-announcement
    setTimeout(() => setScreenReaderAnnouncement(''), 3000);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        toggleHighContrast,
        textScale,
        setTextScale,
        announceToScreenReader,
        screenReaderAnnouncement,
      }}
    >
      {children}
      {/* Invisible live region for screen readers (WCAG 4.1.3 Status Messages) */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {screenReaderAnnouncement}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

