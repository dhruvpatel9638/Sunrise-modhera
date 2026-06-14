import React, { useEffect, useState } from 'react';
import { Languages } from 'lucide-react';

export default function LanguageTranslator({ logoStage = 'finished' }) {
  const [currentLang, setCurrentLang] = useState('en'); // 'en' or 'hi'

  useEffect(() => {
    // 1. Add Google Translate init function
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
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
    if (initialCookie.includes('/hi')) {
      setCurrentLang('hi');
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
    } else {
      // Fallback: Set cookie and refresh page if select has not rendered yet
      const cookieValue = nextLang === 'hi' ? '/en/hi' : '/en/en';
      document.cookie = `googtrans=${cookieValue}; path=/;`;
      // Also set for localhost subdomains if testing locally
      document.cookie = `googtrans=${cookieValue}; path=/; domain=localhost;`;
      window.location.reload();
    }
  };

  return (
    <>
      {/* Hidden container for Google Translate default widgets */}
      <div id="google_translate_element" style={{ display: 'none', position: 'absolute', top: '-9999px' }} />

      {/* Beautiful Floating Translator Toggle Button */}
      <button
        onClick={toggleLanguage}
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
          padding: '10px 18px',
          borderRadius: '30px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 20px rgba(12, 31, 18, 0.4)',
          fontFamily: 'var(--font-body)',
          fontWeight: '600',
          fontSize: '0.85rem',
          opacity: logoStage === 'finished' ? 1 : 0,
          pointerEvents: logoStage === 'finished' ? 'auto' : 'none',
          transition: 'opacity 0.8s ease-in-out, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s',
        }}
      >
        <Languages size={16} />
        <span>{currentLang === 'en' ? 'English ➜ हिन्दी' : 'हिन्दी ➜ English'}</span>
      </button>
    </>
  );
}
