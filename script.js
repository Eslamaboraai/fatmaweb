const root = document.documentElement;
const languageButton = document.querySelector('.lang-switch');
const menuButton = document.querySelector('.menu-btn');
const nav = document.querySelector('#site-nav');
const header = document.querySelector('.site-header');
const fab = document.querySelector('.wa-float');
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
    description: 'فاطمة مجدي، معلمة ومرشدة — بناء الشخصية، إرشاد الوالدين ودعم السلوك. تواصل مع فاطمة عبر واتساب.',
    button: 'English', buttonLabel: 'Switch to English', buttonLang: 'en', menu: 'القائمة', photo: 'فاطمة مجدي'
  },
  en: {
    title: 'Fatma Magdy | Character & Parent Mentoring',
    description: 'Fatma Magdy, teacher and mentor — character building, parent mentoring, and behavior support. Message Fatma on WhatsApp.',
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
  document.querySelector('.hero-photo img').alt = strings.photo;
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
  nav.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => {
  if (!header.contains(event.target)) closeMenu();
});

const hero = document.querySelector('.hero');
const contact = document.querySelector('#contact');
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

// The active link is the last section whose top has passed the line just under the sticky header
// A clicked link stays active until the visitor scrolls on their own
let pinned = null;
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
  const target = document.querySelector(link.getAttribute('href'));
  pinned = sections.includes(target) ? target : null;
  updateActiveLink();
}));
['wheel', 'touchstart'].forEach(type => addEventListener(type, () => { pinned = null; }, { passive: true }));
addEventListener('keydown', event => {
  if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) pinned = null;
});

function updateActiveLink() {
  const line = header.offsetHeight + innerHeight * 0.25;
  let current = null;
  sections.forEach(section => {
    if (section.getBoundingClientRect().top <= line) current = section;
  });
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) current = sections[sections.length - 1];
  if (pinned) current = pinned;
  else if (scrollY < 8) current = null;
  navLinks.forEach(link => {
    const active = current && link.getAttribute('href') === `#${current.id}`;
    if (active) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    header.classList.toggle('is-scrolled', scrollY > 8);
    const pastHero = hero.getBoundingClientRect().bottom < 0;
    const atContact = contact.getBoundingClientRect().top < innerHeight * 0.6;
    fab.classList.toggle('is-visible', pastHero && !atContact);
    updateActiveLink();
    ticking = false;
  });
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
onScroll();
