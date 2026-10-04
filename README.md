# موقع فاطمة مجدي — Fatma Magdy

موقع تعريفي ثابت لفاطمة مجدي في بناء الشخصية، إرشاد الوالدين، ودعم السلوك، بلغتين: العربية (افتراضيًا) والإنجليزية.

A static, bilingual (Arabic / English) website for Fatma Magdy — character building, parent mentoring, and behavior support.

---

## محتويات المستودع

| الملف | الوصف |
|---|---|
| `index.html` | الصفحة الرئيسية وكل المحتوى بالعربية والإنجليزية (عبر الخاصيتين `data-ar` و`data-en`) |
| `style.css` | التصميم والألوان والخطوط والتجاوب مع الشاشات |
| `script.js` | التبديل بين العربية والإنجليزية (ويتذكّر اختيار الزائر)، وقائمة الموبايل، وتمييز رابط القسم الظاهر، وزر واتساب العائم، ورسائل واتساب الجاهزة بلغة الصفحة |
| `portrait-hero.jpg` | صورة فاطمة في أعلى الصفحة (قص من الصورة الأصلية بدون أي تعديل في الألوان أو الملامح) |
| `portrait.jpg` | صورة مربعة تظهر عند مشاركة رابط الموقع (og:image) |
| `.github/workflows/` | نشر تلقائي على Azure Static Web Apps عند كل push على فرع `Main` |

الموقع لا يحتاج أي build أو تثبيت مكتبات. الشيء الوحيد الذي يُحمَّل من الإنترنت هو خط IBM Plex Sans Arabic من Google Fonts.

كل الألوان والمقاسات والمسافات معرّفة كمتغيرات في أول `style.css` (`:root`)، فتعديل الهوية يتم من مكان واحد.

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
- الموقع يتذكّر اللغة اللي اختارها الزائر. ويمكن فتحه بالإنجليزية مباشرة بالرابط `?lang=en` (مثلًا `/index.html?lang=en`).
- لتعديل نص: عدّل قيمتي `data-ar` و`data-en` للعنصر في `index.html`، وعدّل كذلك النص الظاهر داخل العنصر بالعربية لأنه ما يظهر قبل الضغط على الزر.
- رسائل واتساب الجاهزة لكل مجال موجودة في `script.js` (الكائن `whatsappMessages`) بالعربية والإنجليزية.

## النشر

الموقع منشور على **Azure Static Web Apps**: <https://wonderful-pebble-048e87f10.5.azurestaticapps.net/>

أي تعديل يتم دمجه في فرع `Main` يتنشر تلقائيًا خلال دقيقة تقريبًا عبر GitHub Actions (الملف داخل `.github/workflows/`). مفتاح النشر محفوظ في **GitHub Secrets** وليس داخل الملفات.

> لو تغيّر رابط الموقع (مثلًا بإضافة دومين خاص)، حدّث رابط `og:image` في `index.html`. هذا الرابط هو اللي بيحدد الصورة اللي بتظهر لما حد يشارك رابط الموقع على واتساب أو فيسبوك.

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
