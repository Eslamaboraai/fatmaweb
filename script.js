const root = document.documentElement;
const languageButton = document.querySelector('.language');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const fab = document.querySelector('.fab');
const phone = '201124489149';

const whatsappMessages = {
  ar: {
    character: 'مرحبًا فاطمة، أحب أسأل عن بناء الشخصية.',
    parent: 'مرحبًا فاطمة، أحب أسأل عن إرشاد الوالدين.',
    behavior: 'مرحبًا فاطمة، أحب أسأل عن دعم السلوك.',
    camps: 'مرحبًا فاطمة، أحب أعرف تفاصيل معسكر الأطفال.',
    ei: 'مرحبًا فاطمة، أحب أعرف أكثر عن الذكاء العاطفي.'
  },
  en: {
    character: 'Hello Fatma, I would like to ask about character building.',
    parent: 'Hello Fatma, I would like to ask about parent mentoring.',
    behavior: 'Hello Fatma, I would like to ask about behavior support.',
    camps: "Hello Fatma, please share details about children's camps.",
    ei: 'Hello Fatma, please share details about emotional intelligence.'
  }
};

const meta = {
  ar: {
    title: 'فاطمة مجدي | بناء الشخصية وإرشاد الوالدين',
    description: 'فاطمة مجدي — بناء الشخصية، إرشاد الوالدين ودعم السلوك. تواصل عبر واتساب لمعرفة المزيد.',
    button: 'English', buttonLabel: 'Switch to English', buttonLang: 'en', menu: 'القائمة', photo: 'فاطمة مجدي'
  },
  en: {
    title: 'Fatma Magdy | Character & Parent Mentoring',
    description: 'Fatma Magdy — character building, parent mentoring, and behavior support. Connect on WhatsApp to learn more.',
    button: 'العربية', buttonLabel: 'التبديل إلى العربية', buttonLang: 'ar', menu: 'Menu', photo: 'Fatma Magdy'
  }
};

function setLanguage(language) {
  const strings = meta[language];
  root.lang = language;
  root.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-ar][data-en]').forEach(element => {
    element.innerHTML = element.dataset[language];
  });
  document.querySelectorAll('[data-wa]').forEach(link => {
    link.href = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessages[language][link.dataset.wa])}`;
  });
  languageButton.textContent = strings.button;
  languageButton.lang = strings.buttonLang;
  languageButton.setAttribute('aria-label', strings.buttonLabel);
  menuButton.setAttribute('aria-label', strings.menu);
  document.querySelector('.portrait img').alt = strings.photo;
  document.title = strings.title;
  document.querySelector('meta[name="description"]').content = strings.description;
  try { localStorage.setItem('language', language); } catch (error) {}
}

let initialLanguage = new URLSearchParams(location.search).get('lang');
if (!meta[initialLanguage]) {
  try { initialLanguage = localStorage.getItem('language'); } catch (error) {}
}
if (initialLanguage === 'en') setLanguage('en');

languageButton.addEventListener('click', () => {
  setLanguage(root.lang === 'ar' ? 'en' : 'ar');
});

function closeMenu() {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => {
  if (!header.contains(event.target)) closeMenu();
});

const hero = document.querySelector('.hero');
const contact = document.querySelector('#contact');
function onScroll() {
  header.classList.toggle('scrolled', scrollY > 8);
  const pastHero = hero.getBoundingClientRect().bottom < 0;
  const atContact = contact.getBoundingClientRect().top < innerHeight * 0.6;
  fab.classList.toggle('show', pastHero && !atContact);
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();
