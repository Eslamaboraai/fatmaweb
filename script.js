const languageButton = document.querySelector('.language');
languageButton.addEventListener('click', () => {
  const language = document.documentElement.lang === 'ar' ? 'en' : 'ar';
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-ar][data-en]').forEach(element => {
    element.innerHTML = element.dataset[language];
  });
  languageButton.textContent = language === 'ar' ? 'English' : 'العربية';
  languageButton.setAttribute('aria-label', language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
  document.title = language === 'ar' ? 'فاطمة مجدي | بناء الشخصية وإرشاد الوالدين' : 'Fatma Magdy | Character & Parent Mentoring';
  document.querySelector('meta[name="description"]').content = language === 'ar' ? 'فاطمة مجدي — بناء الشخصية، إرشاد الوالدين ودعم السلوك. تواصل عبر واتساب لمعرفة المزيد.' : 'Fatma Magdy — character building, parent mentoring, and behavior support. Connect on WhatsApp to learn more.';
});
