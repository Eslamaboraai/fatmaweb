# موقع فاطمة مجدي — Fatma Magdy

موقع تعريفي ثابت لفاطمة مجدي في بناء الشخصية، إرشاد الوالدين، ودعم السلوك، بلغتين: العربية (افتراضيًا) والإنجليزية.

A static, bilingual (Arabic / English) website for Fatma Magdy — character building, parent mentoring, and behavior support.

---

## محتويات المستودع

| الملف | الوصف |
|---|---|
| `index.html` | الصفحة الرئيسية وكل المحتوى بالعربية والإنجليزية (عبر الخاصيتين `data-ar` و`data-en`) |
| `style.css` | التصميم والألوان والخطوط والتجاوب مع الشاشات |
| `script.js` | زر التبديل بين العربية والإنجليزية (يغيّر اللغة واتجاه الصفحة والعنوان والوصف) |
| `reference.jpg` | صورة فاطمة في قسم «تعرّفي على فاطمة» |

الموقع لا يحتاج أي build أو تثبيت مكتبات. الشيء الوحيد الذي يُحمَّل من الإنترنت هو الخطوط من Google Fonts.

## التشغيل

### الطريقة الأسرع
افتح ملف `index.html` مباشرة في أي متصفح.

### خادم محلي (مُستحسن)
من داخل مجلد المستودع:

```bash
# باستخدام Python
python3 -m http.server 8000

# أو باستخدام Node.js
npx serve .
```

ثم افتح: <http://localhost:8000> (أو العنوان الذي يظهر لك عند استخدام `serve`).

## التبديل بين اللغتين

- تفتح الصفحة بالعربية (من اليمين لليسار).
- زر **English** في أعلى الصفحة يحوّلها إلى الإنجليزية (من اليسار لليمين)، وزر **العربية** يرجعها.
- لتعديل نص: عدّل قيمتي `data-ar` و`data-en` للعنصر في `index.html`، وعدّل كذلك النص الظاهر داخل العنصر بالعربية لأنه ما يظهر قبل الضغط على الزر.

## النشر

لأنه موقع ثابت، يمكن نشره على أي استضافة للملفات الثابتة، مثل GitHub Pages أو Netlify أو Cloudflare Pages، بدون أي إعدادات build.

> ملاحظة: GitHub Pages للمستودعات الخاصة (Private) يحتاج اشتراكًا مدفوعًا في GitHub (Pro أو Team أو Enterprise).

## بيانات التواصل الموجودة في الموقع

- الهاتف وواتساب: +201124489149
- البريد: fatmamagdi123edu@gmail.com
- فيسبوك: <https://www.facebook.com/share/1EoVXsw3oD/>

---

## English quick start

No build step and no dependencies. Open `index.html` in a browser, or serve the folder locally:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

The page loads in Arabic (RTL). The **English** button in the header switches the page to English (LTR) and **العربية** switches it back. Every translatable element carries both versions in its `data-ar` and `data-en` attributes, and `script.js` swaps between them.
