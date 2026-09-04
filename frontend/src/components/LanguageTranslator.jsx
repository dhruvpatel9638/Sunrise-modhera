import React, { useEffect, useState } from 'react';
import { Languages } from 'lucide-react';

export default function LanguageTranslator({ logoStage = 'finished' }) {
  const [currentLang, setCurrentLang] = useState('en'); // 'en' or 'hi'
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // 1. Add Google Translate init function
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    // 2. Load the Google Translate script
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
    }

    // 3. Detect initial language from cookie
    const getTransCookie = () => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; googtrans=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return '';
    };

    const initialCookie = getTransCookie();
    if (initialCookie && initialCookie.includes('/hi')) {
      setCurrentLang('hi');
      document.documentElement.setAttribute('lang', 'hi');
    }
  }, []);

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'hi' : 'en';

    // Find Google Translate select element
    const selectEl = document.querySelector('select.goog-te-combo');
    if (selectEl) {
      selectEl.value = nextLang;
      selectEl.dispatchEvent(new Event('change'));
      setCurrentLang(nextLang);
      document.documentElement.setAttribute('lang', nextLang);
    } else {
      // Fallback: Set cookie and reload if select has not fully mounted yet
      const cookieValue = nextLang === 'hi' ? '/en/hi' : '/en/en';
      document.cookie = `googtrans=${cookieValue}; path=/;`;
      document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname};`;
      document.documentElement.setAttribute('lang', nextLang);
      window.location.reload();
    }
  };

  const handleButtonClick = () => {
    toggleLanguage();
    setIsExpanded(true);
    setTimeout(() => {
      setIsExpanded(false);
    }, 2500);
  };

  return (
    <>
      {/* Hidden container for Google Translate widgets (avoid display: none so select element mounts) */}
      <div 
        id="google_translate_element" 
        style={{ 
          position: 'fixed', 
          top: '-9999px', 
          left: '-9999px', 
          width: '1px', 
          height: '1px', 
          overflow: 'hidden', 
          opacity: 0, 
          pointerEvents: 'none' 
        }} 
      />

      {/* Beautiful Floating Translator Toggle Button */}
      <button
        onClick={handleButtonClick}
        className="language-toggle-btn"
        aria-label="Switch Language"
        style={{
          position: 'fixed',
          right: '24px',
          bottom: '24px',
          zIndex: 9999,
          backgroundColor: 'var(--color-primary-dark)',
          border: '2px solid var(--color-gold)',
          color: 'var(--color-gold)',
          padding: isExpanded ? '10px 18px' : '10px',
          borderRadius: '30px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: isExpanded ? 'auto' : '44px',
          height: '44px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(12, 31, 18, 0.4)',
          fontFamily: 'var(--font-body)',
          fontWeight: '600',
          fontSize: '0.85rem',
          opacity: logoStage === 'finished' ? 1 : 0,
          pointerEvents: logoStage === 'finished' ? 'auto' : 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Languages size={18} style={{ flexShrink: 0 }} />
        {isExpanded && (
          <span style={{ marginLeft: '8px', whiteSpace: 'nowrap', animation: 'fadeIn 0.3s ease-in' }}>
            {currentLang === 'en' ? 'English ➜ हिन्दी' : 'हिन्दी ➜ English'}
          </span>
        )}
      </button>
    </>
  );
}
