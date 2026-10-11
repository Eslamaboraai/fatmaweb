'use strict';
/* Shared drawing kit for the ListGo ads: palette, SVG helpers, phone and product art. */
const W = 1080, H = 1920, NS = 'http://www.w3.org/2000/svg';
const C = { ink: '#23272F', teal: '#05737D', tealL: '#D3ECEE', amber: '#E9B640', amberL: '#FCEFC9', red: '#D9534F',
            green: '#25D366', greenL: '#DCF8C6', skin: '#F3C9A2', gray: '#9AA3AD', grayL: '#EEF1F4', pants: '#3B4A5A' };
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, p) => a + (b - a) * p;
const ease = {
  inOut: p => p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2,
  out: p => 1 - Math.pow(1 - p, 3),
  back: p => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
};
const defs = document.querySelector('#board defs');
let uid = 0;

function E(tag, attrs = {}, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function G(markup, parent, attrs = {}) { const g = E('g', attrs, parent); g.innerHTML = markup; return g; }
function rootPoint(el, x, y) { return new DOMPoint(x, y).matrixTransform(el.getCTM()); }

function phone(x, y, w, h, screen = '#F4F7F8') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w * .12}" fill="#fff"/>
    <rect x="${x + 14}" y="${y + 60}" width="${w - 28}" height="${h - 120}" rx="12" fill="${screen}" stroke-width="3"/>
    <line x1="${x + w / 2 - 34}" y1="${y + 32}" x2="${x + w / 2 + 34}" y2="${y + 32}"/>
    <circle cx="${x + w / 2}" cy="${y + h - 31}" r="15" stroke-width="4"/>`;
}

function pictureIcon(x, y, w, h, fill = C.tealL) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke-width="4"/>
    <circle cx="${x + w * .72}" cy="${y + h * .32}" r="${h * .12}" fill="${C.amber}" stroke-width="3"/>
    <path d="M${x + w * .1},${y + h * .85} L${x + w * .38},${y + h * .45} L${x + w * .58},${y + h * .7} L${x + w * .7},${y + h * .58} L${x + w * .9},${y + h * .85} Z" fill="${C.teal}" stroke-width="3"/>`;
}

/* product art for a mobile-accessories shop: screen protector, charger cable, power bank */
function product(kind, x, y, w, h, fill = C.tealL) {
  const X = f => x + w * f, Y = f => y + h * f, sw = Math.max(3, w / 30);
  const bg = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke-width="4"/>`;
  if (kind === 'screen') return bg +
    `<rect x="${X(.28)}" y="${Y(.1)}" width="${w * .36}" height="${h * .8}" rx="${w * .05}" fill="${C.ink}" stroke-width="${sw}"/>
     <rect x="${X(.38)}" y="${Y(.06)}" width="${w * .36}" height="${h * .8}" rx="${w * .05}" fill="#CFEFF7" fill-opacity=".85" stroke="${C.teal}" stroke-width="${sw}"/>
     <path d="M${X(.45)},${Y(.36)} L${X(.6)},${Y(.18)} M${X(.47)},${Y(.52)} L${X(.68)},${Y(.27)}" stroke="#fff" stroke-width="${sw * 1.6}"/>`;
  if (kind === 'cable') return bg +
    `<path d="M${X(.2)},${Y(.7)} C${X(.2)},${Y(.15)} ${X(.75)},${Y(.95)} ${X(.72)},${Y(.32)}" stroke-width="${sw * 1.4}"/>
     <rect x="${X(.13)}" y="${Y(.66)}" width="${w * .14}" height="${h * .24}" rx="4" fill="#fff" stroke-width="${sw}"/>
     <rect x="${X(.16)}" y="${Y(.86)}" width="${w * .08}" height="${h * .08}" fill="${C.gray}" stroke-width="${sw * .7}"/>
     <rect x="${X(.65)}" y="${Y(.1)}" width="${w * .14}" height="${h * .24}" rx="4" fill="#fff" stroke-width="${sw}"/>
     <rect x="${X(.68)}" y="${Y(.04)}" width="${w * .08}" height="${h * .08}" fill="${C.gray}" stroke-width="${sw * .7}"/>`;
  return bg +
    `<rect x="${X(.14)}" y="${Y(.26)}" width="${w * .64}" height="${h * .48}" rx="${w * .07}" fill="#fff" stroke-width="${sw}"/>
     <rect x="${X(.78)}" y="${Y(.4)}" width="${w * .06}" height="${h * .2}" rx="3" fill="${C.ink}" stroke-width="${sw * .7}"/>
     <rect x="${X(.2)}" y="${Y(.35)}" width="${w * .12}" height="${h * .3}" fill="${C.green}" stroke-width="${sw * .7}"/>
     <rect x="${X(.35)}" y="${Y(.35)}" width="${w * .12}" height="${h * .3}" fill="${C.green}" stroke-width="${sw * .7}"/>
     <path d="M${X(.6)},${Y(.3)} L${X(.52)},${Y(.52)} L${X(.6)},${Y(.52)} L${X(.55)},${Y(.7)} L${X(.7)},${Y(.45)} L${X(.62)},${Y(.45)} Z" fill="${C.amber}" stroke-width="${sw * .7}"/>`;
}

function heart(x, y, k = 1, fill = C.red) {
  return `<path transform="translate(${x} ${y}) scale(${k})" d="M0,12 C-10,-2 -26,4 -22,18 C-18,30 0,40 0,40 C0,40 18,30 22,18 C26,4 10,-2 0,12 Z" fill="${fill}" stroke-width="4"/>`;
}

