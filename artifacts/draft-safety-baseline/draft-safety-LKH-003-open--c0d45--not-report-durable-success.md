# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: draft-safety.spec.ts >> LKH-003 open acceptance contracts >> S15 real aborted proposal transaction must not report durable success
- Location: tests/e2e/draft-safety.spec.ts:160:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByTestId('proposal-editor')
Expected pattern: /نشست|مستقل ذخیرہ|session/i
Timeout: 2500ms
Error: element(s) not found

Call log:
  - Expect "toContainText" getByTestId('proposal-editor') with timeout 2500ms
  - waiting for getByTestId('proposal-editor')
    6 × locator resolved to <div data-testid="proposal-editor" class="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl p-5 space-y-4">…</div>
      - unexpected value "تلفظ کی نظرثانی و وزن کی تجویز: آرٹماخذ کا شناختی نمبر:aruuz:mastertable:513قرنطینہ کی وجہ:پیچیدہ ساکن مجموعہ (سلسلہ حروفِ ساکنہ) — لغوی تلفظ درکارماخذی تلفظ:آرْٹ  مجوزہ وزن (Prosody Pattern):رکن: نامزد وزن- کوتاہ= بلندx لچکداراعراب والا تلفظ (اختیاری):اعراب سے وزن اخذ کریںکیفیتِ نظرثانی (Review Status):مصدقہ (Approved)خودکار تقطیع اور بحر کی اصلاحات کے لیے مکمل فعال۔زیرِ جائزہ (Unreviewed Draft)مسودہ محفوظ رہے گا؛ خودکار اصلاح روک کر رکھے گا۔اسناد و حوالہ (اختیاری):مصدقہ تلفظ محفوظ ہو گیا۔ تقطیع اور خودکار اصلاح کے لیے فعال ہے۔حذف تجویزمنسوخمحفوظ کریں"

```

```yaml
- banner:
  - text: ✒
  - heading "قلم و قافیہ" [level=1]
  - text: اسٹوڈیو برائے شعر و ادب PROSODY STUDIO محفوظ شدہ
  - button "خطاطی 22px"
  - button "موضوع"
  - button "کلاسیکی (Classic)"
  - button "غیر مقفل"
  - button "تنہائی"
  - button "نیا کلام"
  - button "برآمد"
- text: قوافی کی تختی 0 / 0 مستعمل
- button "کلام کے ساتھ خودکار مطابقت کریں (Re-sync with text)"
- textbox "تلاش کریں..."
- textbox "نیا قافیہ..."
- button "قافیہ شامل کریں" [disabled]
- button "تختی کی ترتیبات (Zoom & Marker)"
- button "تختی بند کریں"
- text: کوئی قافیہ نہیں ملا۔ "خزانہ قوافی" سے نئے قوافی منتخب فرمائیں یا دستی شامل کریں۔
- textbox "عنوانِ کلام یا مطلع درج فرمائیں...": عنوان ordinary-a
- textbox "شاعر کا نام...": شاعر آزمائش
- button "غزل"
- button "نظم"
- button "رباعی"
- button "نثر / مضمون"
- button "دائیں صف بندی (Align Right - معیاری اردو)"
- button "درمیانی صف بندی (Couplet / Center Align)"
- button "بائیں صف بندی (Align Left - حوالہ جات/انگریزی)"
- button "دونوں طرف ہموار (Justify - کتابی و نثری صف بندی)"
- button "جلی (Bold / Ctrl+B)"
- button "ترچھا (Italic / Ctrl+I)"
- button "خط کشیدہ (Underline / Ctrl+U)"
- button "خطِ تنسیخ (Strikethrough)"
- button "بڑی سرخی (Heading 1)"
- button "ذیلی سرخی (Heading 2)"
- button "اقتباس / حوالہ (Blockquote)"
- button "نقاطی فہرست (Bullet List)"
- button "عددی فہرست (Numbered List)"
- button "خطِ فاصل (Divider Line)"
- button "+ مطلع"
- button "+ شعر"
- button "+ مقطع"
- checkbox "نمائشِ تقطیع و اوزان" [checked]
- text: نمائشِ تقطیع و اوزان
- button "پچھلا عمل (Undo)" [disabled]
- button "اگلا عمل (Redo)" [disabled]
- button "اعراب تختی"
- 'button "صوتی کی بورڈ: آف"'
- button "کی بورڈ گائیڈ (نقشہ)"
- text: "اعراب و علامات:"
- button "ب بَ"
- button "ب بِ"
- button "ب بُ"
- button "ب بّ"
- button "ب بْ"
- button "ب بً"
- button "ب بٍ"
- button "ب بٌ"
- button "ب بٰ"
- button "ب بٖ"
- button "ب بٗ"
- button "ب بٓ"
- button "ء"
- button "ۂ"
- button "ؔ"
- button "؏"
- text: 1 پہلا مصرع 4 الفاظ
- textbox "مصرع تحریر فرمائیں...": مرا دل مرا دل
- text: "بحرِ متقارب مثمن محذوف زیرِ تکمیل 6 ہجے مطلوبہ بحر:"
- combobox "مطلوبہ بحر":
  - option "قریب ترین بحر (تجویز)" [selected]
  - option "بحرِ ہزج مسدس اخرم اشتر محذوف"
  - option "بحرِ متقارب مثمن اثرم"
  - option "بحرِ رجز مثمن سالم"
  - option "بحرِ مضارع مثمن اخرب"
  - option "بحرِ مضارع مثمن اخرب مکفوف محذوف"
  - option "بحرِ متدارک مثمن مضاعف مقطوع مخبون"
  - option "بحرِ ہزج مثمن اخرب"
  - option "بحرِ ہزج مثمن اخرب مکفوف محذوف"
  - option "بحرِ ہزج مسدس اخرب مقبوض محذوف"
  - option "بحرِ رمل مثمن محذوف"
  - option "بحرِ رمل مسدس محذوف"
  - option "بحرِ متدارک مثمن مضاعف سالم"
  - option "بحرِ متدارک مثمن مقطوع محذوف"
  - option "بحرِ خفیف مسدس مخبون محذوف مقطوع"
  - option "بحرِ خفیف مسدس مخبون محذوف"
  - option "بحرِ رمل مسدس مخبون محذوف مقطوع"
  - option "بحرِ رمل مسدس مخبون محذوف"
  - option "بحرِ رمل مثمن مخبون محذوف مقطوع"
  - option "بحرِ رمل مثمن مخبون محذوف"
  - option "بحرِ ہزج مثمن اشتر"
  - option "بحرِ ہزج مثمن اشتر مقبوض"
  - option "بحرِ منسرح مثمن مطوی مکسوف"
  - option "بحرِ منسرح مثمن مطوی منحور"
  - option "بحرِ سریع مسدس مطوی مکسوف"
  - option "بحرِ رجز مثمن مطوی مخبون"
  - option "بحرِ ہزج مثمن سالم"
  - option "بحرِ ہزج مسدس محذوف"
  - option "بحرِ متقارب مثمن سالم"
  - option "بحرِ متقارب مثمن محذوف"
  - option "بحرِ متقارب مثمن مضاعف مقبوض اثلم"
  - option "بحرِ متقارب مسدس مضاعف مقبوض اثلم"
  - option "بحرِ ہزج مثمن مقبوض"
  - option "بحرِ مجتث مثمن مخبون محذوف مقطوع"
  - option "بحرِ مجتث مثمن مخبون محذوف"
  - option "بحرِ مجتث مثمن مخبون"
  - option "بحرِ رمل مثمن مشکول"
  - option "بحرِ کامل مثمن سالم"
  - option "رباعی — ہزج مثمن اخرب مکفوف مجبوب"
  - option "رباعی — ہزج مثمن اخرب مکفوف ابتر"
  - option "رباعی — ہزج مثمن اخرب مقبوض ابتر"
  - option "رباعی — ہزج مثمن اخرب مقبوض مکفوف مجبوب"
  - option "رباعی — ہزج مثمن اخرم اشتر مکفوف مجبوب"
  - option "رباعی — ہزج مثمن اخرم اشتر ابتر"
  - option "رباعی — ہزج مثمن اخرب اخرم ابتر"
  - option "رباعی — ہزج مثمن اخرب مجبوب"
  - option "رباعی — ہزج مثمن اخرم اخرب مجبوب"
  - option "رباعی — ہزج مثمن اخرم ابتر"
  - option "رباعی — ہزج مثمن اخرم اخرب ابتر"
  - option "رباعی — ہزج مثمن اخرم اخرب مکفوف مجبوب"
  - option "بحرِ متدارک مثمن سالم"
- paragraph:
  - 'link "ماخذِ تلفظ: Aruuz"':
    - /url: /licenses/Aruuz-NOTICE.txt
  - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
- text: مرا -= دل = مرا -= دل =
- group: تلفظ، ماخذ اور استعمال شدہ جوازات
- text: "فَعُولُن - = = فَعُولُن - = = مجموعی آہنگ: - = = - = = مصرع جاری رکھیں... 2 دوسرا مصرع 4 الفاظ"
- textbox "مصرع تحریر فرمائیں...": مرا دل مرا دل
- text: "بحرِ متقارب مثمن محذوف زیرِ تکمیل 6 ہجے مطلوبہ بحر:"
- combobox "مطلوبہ بحر":
  - option "قریب ترین بحر (تجویز)" [selected]
  - option "بحرِ ہزج مسدس اخرم اشتر محذوف"
  - option "بحرِ متقارب مثمن اثرم"
  - option "بحرِ رجز مثمن سالم"
  - option "بحرِ مضارع مثمن اخرب"
  - option "بحرِ مضارع مثمن اخرب مکفوف محذوف"
  - option "بحرِ متدارک مثمن مضاعف مقطوع مخبون"
  - option "بحرِ ہزج مثمن اخرب"
  - option "بحرِ ہزج مثمن اخرب مکفوف محذوف"
  - option "بحرِ ہزج مسدس اخرب مقبوض محذوف"
  - option "بحرِ رمل مثمن محذوف"
  - option "بحرِ رمل مسدس محذوف"
  - option "بحرِ متدارک مثمن مضاعف سالم"
  - option "بحرِ متدارک مثمن مقطوع محذوف"
  - option "بحرِ خفیف مسدس مخبون محذوف مقطوع"
  - option "بحرِ خفیف مسدس مخبون محذوف"
  - option "بحرِ رمل مسدس مخبون محذوف مقطوع"
  - option "بحرِ رمل مسدس مخبون محذوف"
  - option "بحرِ رمل مثمن مخبون محذوف مقطوع"
  - option "بحرِ رمل مثمن مخبون محذوف"
  - option "بحرِ ہزج مثمن اشتر"
  - option "بحرِ ہزج مثمن اشتر مقبوض"
  - option "بحرِ منسرح مثمن مطوی مکسوف"
  - option "بحرِ منسرح مثمن مطوی منحور"
  - option "بحرِ سریع مسدس مطوی مکسوف"
  - option "بحرِ رجز مثمن مطوی مخبون"
  - option "بحرِ ہزج مثمن سالم"
  - option "بحرِ ہزج مسدس محذوف"
  - option "بحرِ متقارب مثمن سالم"
  - option "بحرِ متقارب مثمن محذوف"
  - option "بحرِ متقارب مثمن مضاعف مقبوض اثلم"
  - option "بحرِ متقارب مسدس مضاعف مقبوض اثلم"
  - option "بحرِ ہزج مثمن مقبوض"
  - option "بحرِ مجتث مثمن مخبون محذوف مقطوع"
  - option "بحرِ مجتث مثمن مخبون محذوف"
  - option "بحرِ مجتث مثمن مخبون"
  - option "بحرِ رمل مثمن مشکول"
  - option "بحرِ کامل مثمن سالم"
  - option "رباعی — ہزج مثمن اخرب مکفوف مجبوب"
  - option "رباعی — ہزج مثمن اخرب مکفوف ابتر"
  - option "رباعی — ہزج مثمن اخرب مقبوض ابتر"
  - option "رباعی — ہزج مثمن اخرب مقبوض مکفوف مجبوب"
  - option "رباعی — ہزج مثمن اخرم اشتر مکفوف مجبوب"
  - option "رباعی — ہزج مثمن اخرم اشتر ابتر"
  - option "رباعی — ہزج مثمن اخرب اخرم ابتر"
  - option "رباعی — ہزج مثمن اخرب مجبوب"
  - option "رباعی — ہزج مثمن اخرم اخرب مجبوب"
  - option "رباعی — ہزج مثمن اخرم ابتر"
  - option "رباعی — ہزج مثمن اخرم اخرب ابتر"
  - option "رباعی — ہزج مثمن اخرم اخرب مکفوف مجبوب"
  - option "بحرِ متدارک مثمن سالم"
- paragraph:
  - 'link "ماخذِ تلفظ: Aruuz"':
    - /url: /licenses/Aruuz-NOTICE.txt
  - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
- text: مرا -= دل = مرا -= دل =
- group: تلفظ، ماخذ اور استعمال شدہ جوازات
- text: "فَعُولُن - = = فَعُولُن - = = مجموعی آہنگ: - = = - = = مصرع جاری رکھیں..."
- button "نیا مصرع شامل کریں"
- text: 1 اشعار 2 مصرعے 8 الفاظ 20 حروف کسی بھی لفظ کو منتخب کر کے لغت و مترادفات ملاحظہ فرمائیں
- separator "کھینچ کر چوڑائی تبدیل کریں (Drag to resize)"
- text: ادبی معاون (Literary Companion)
- button "پینل بند کریں"
- button "خزانہ قوافی"
- button "علمِ عروض"
- button "لغت و الفاظ"
- button "صنائع بدائع"
- button "دیوانِ کلام"
- text: "ذخیرۂ لغت: 40,435 (آف لائن)"
- button "نظمِ لغت و نظرثانی 1007 قرنطینہ"
- paragraph:
  - text: "تلفظ کا ماخذ: Aruuz —"
  - link "ماخذ و اجازت نامہ":
    - /url: /licenses/Aruuz-NOTICE.txt
- text: میزانِ مصرع (مصرع وزن آزمائش)
- textbox "یہاں کوئی بھی مصرع لکھ کر وزن اور روانی جانچیں..."
- 'textbox "بحر یا ارکان تلاش کریں (مثلاً: رمل، مفاعیلن)..."'
- heading "بحرِ ہزج مسدس اخرم اشتر محذوف" [level=4]
- paragraph: Bahr-e-Hazaj Musaddas Akhram Ashtar Mahzoof
- button "انتخاب کریں"
- text: مَفْعُولُن فَاعِلُن فَعُولُن === / =-= / -==
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ متقارب مثمن اثرم" [level=4]
- paragraph: Bahr-e-Mutaqarib Musamman Asram
- button "انتخاب کریں"
- text: فَعْلُن فَعُولُن فَعْلُن فَعُولُن == / -== / == / -==
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ رجز مثمن سالم" [level=4]
- paragraph: Bahr-e-Rajaz Musamman Salim
- button "انتخاب کریں"
- text: مُسْتَفْعِلُن مُسْتَفْعِلُن مُسْتَفْعِلُن مُسْتَفْعِلُن ==-= / ==-= / ==-= / ==-=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ مضارع مثمن اخرب" [level=4]
- paragraph: Bahr-e-Muzara Musamman Akhrab
- button "انتخاب کریں"
- text: مَفْعُولُ فَاعِلَاتُن مَفْعُولُ فَاعِلَاتُن ==- / =-== / ==- / =-==
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ مضارع مثمن اخرب مکفوف محذوف" [level=4]
- paragraph: Bahr-e-Muzara Musamman Akhrab Makfoof Mahzoof
- button "انتخاب کریں"
- text: مَفْعُولُ فَاعِلَاتُ مَفَاعِیلُ فَاعِلُن ==- / =-=- / -==- / =-=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ متدارک مثمن مضاعف مقطوع مخبون" [level=4]
- paragraph: Bahr-e-Mutadarak Musamman Muzaaf Maqtoo Makhboon
- button "انتخاب کریں"
- text: فَعْلُن فَعِلُن فَعْلُن فَعْلُن فَعْلُن فَعِلُن فَعْلُن فَعْلُن == / --= / == / == / == / --= / == / ==
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ ہزج مثمن اخرب" [level=4]
- paragraph: Bahr-e-Hazaj Musamman Akhrab
- button "انتخاب کریں"
- text: مَفْعُولُ مَفَاعِیلُن مَفْعُولُ مَفَاعِیلُن ==- / -=== / ==- / -===
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ ہزج مثمن اخرب مکفوف محذوف" [level=4]
- paragraph: Bahr-e-Hazaj Musamman Akhrab Makfoof Mahzoof
- button "انتخاب کریں"
- text: مَفْعُولُ مَفَاعِیلُ مَفَاعِیلُ فَعُولُن ==- / -==- / -==- / -==
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ ہزج مسدس اخرب مقبوض محذوف" [level=4]
- paragraph: Bahr-e-Hazaj Musaddas Akhrab Maqbooz Mahzoof
- button "انتخاب کریں"
- text: مَفْعُولُ مَفَاعِلُن فَعُولُن ==- / -=-= / -==
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ رمل مثمن محذوف" [level=4]
- paragraph: Bahr-e-Ramal Musamman Mahzoof
- button "انتخاب کریں"
- text: فَاعِلَاتُن فَاعِلَاتُن فَاعِلَاتُن فَاعِلُن =-== / =-== / =-== / =-=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- paragraph: "\"نقش فریادی ہے کس کی شوخیِ تحریر کا کاغذی ہے پیرہن ہر پیکرِ تصویر کا\""
- text: — مرزا غالب
- heading "بحرِ رمل مسدس محذوف" [level=4]
- paragraph: Bahr-e-Ramal Musaddas Mahzoof
- button "انتخاب کریں"
- text: فَاعِلَاتُن فَاعِلَاتُن فَاعِلُن =-== / =-== / =-=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ متدارک مثمن مضاعف سالم" [level=4]
- paragraph: Bahr-e-Mutadarak Musamman Muzaaf Salim
- button "انتخاب کریں"
- text: فَاعِلُن فَاعِلُن فَاعِلُن فَاعِلُن فَاعِلُن فَاعِلُن فَاعِلُن فَاعِلُن =-= / =-= / =-= / =-= / =-= / =-= / =-= / =-=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ متدارک مثمن مقطوع محذوف" [level=4]
- paragraph: Bahr-e-Mutadarak Musamman Maqtoo Mahzoof
- button "انتخاب کریں"
- text: فَاعِلُن فَاعِلُن فَاعِلُن فَعْ =-= / =-= / =-= / =
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ خفیف مسدس مخبون محذوف مقطوع" [level=4]
- paragraph: Bahr-e-Khafeef Musaddas Makhboon Mahzoof Maqtoo
- button "انتخاب کریں"
- text: فَاعِلَاتُن مَفَاعِلُن فَعْلُن =-== / -=-= / ==
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ خفیف مسدس مخبون محذوف" [level=4]
- paragraph: Bahr-e-Khafeef Musaddas Makhboon Mahzoof
- button "انتخاب کریں"
- text: فَاعِلَاتُن مَفَاعِلُن فَعِلُن =-== / -=-= / --=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ رمل مسدس مخبون محذوف مقطوع" [level=4]
- paragraph: Bahr-e-Ramal Musaddas Makhboon Mahzoof Maqtoo
- button "انتخاب کریں"
- text: فَاعِلَاتُن فَعِلَاتُن فَعْلُن =-== / --== / ==
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ رمل مسدس مخبون محذوف" [level=4]
- paragraph: Bahr-e-Ramal Musaddas Makhboon Mahzoof
- button "انتخاب کریں"
- text: فَاعِلَاتُن فَعِلَاتُن فَعِلُن =-== / --== / --=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ رمل مثمن مخبون محذوف مقطوع" [level=4]
- paragraph: Bahr-e-Ramal Musamman Makhboon Mahzoof Maqtoo
- button "انتخاب کریں"
- text: فَاعِلَاتُن فَعِلَاتُن فَعِلَاتُن فَعْلُن =-== / --== / --== / ==
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ رمل مثمن مخبون محذوف" [level=4]
- paragraph: Bahr-e-Ramal Musamman Makhboon Mahzoof
- button "انتخاب کریں"
- text: فَاعِلَاتُن فَعِلَاتُن فَعِلَاتُن فَعِلُن =-== / --== / --== / --=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ ہزج مثمن اشتر" [level=4]
- paragraph: Bahr-e-Hazaj Musamman Ashtar
- button "انتخاب کریں"
- text: فَاعِلُن مَفَاعِیلُن فَاعِلُن مَفَاعِیلُن =-= / -=== / =-= / -===
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ ہزج مثمن اشتر مقبوض" [level=4]
- paragraph: Bahr-e-Hazaj Musamman Ashtar Maqbooz
- button "انتخاب کریں"
- text: فَاعِلُن مَفَاعِلُن فَاعِلُن مَفَاعِلُن =-= / -=-= / =-= / -=-=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ منسرح مثمن مطوی مکسوف" [level=4]
- paragraph: Bahr-e-Munsareh Musamman Matwi Maksoof
- button "انتخاب کریں"
- text: مُفْتَعِلُن فَاعِلُن مُفْتَعِلُن فَاعِلُن =--= / =-= / =--= / =-=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ منسرح مثمن مطوی منحور" [level=4]
- paragraph: Bahr-e-Munsareh Musamman Matwi Manhoor
- button "انتخاب کریں"
- text: مُفْتَعِلُن فَاعِلَاتُ مُفْتَعِلُن فَعْ =--= / =-=- / =--= / =
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ سریع مسدس مطوی مکسوف" [level=4]
- paragraph: Bahr-e-Saree Musaddas Matwi Maksoof
- button "انتخاب کریں"
- text: مُفْتَعِلُن مُفْتَعِلُن فَاعِلُن =--= / =--= / =-=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ رجز مثمن مطوی مخبون" [level=4]
- paragraph: Bahr-e-Rajaz Musamman Matwi Makhboon
- button "انتخاب کریں"
- text: مُفْتَعِلُن مَفَاعِلُن مُفْتَعِلُن مَفَاعِلُن =--= / -=-= / =--= / -=-=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ ہزج مثمن سالم" [level=4]
- paragraph: Bahr-e-Hazaj Musamman Salim
- button "انتخاب کریں"
- text: مَفَاعِیلُن مَفَاعِیلُن مَفَاعِیلُن مَفَاعِیلُن -=== / -=== / -=== / -===
- paragraph: اس وزن کے آخر میں زائد ہجائے کوتاہ جائز نہیں۔
- paragraph: "\"ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے بہت نکلے مرے ارمان لیکن پھر بھی کم نکلے\""
- text: — مرزا غالب
- heading "بحرِ ہزج مسدس محذوف" [level=4]
- paragraph: Bahr-e-Hazaj Musaddas Mahzoof
- button "انتخاب کریں"
- text: مَفَاعِیلُن مَفَاعِیلُن فَعُولُن -=== / -=== / -==
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ متقارب مثمن سالم" [level=4]
- paragraph: Bahr-e-Mutaqarib Musamman Salim
- button "انتخاب کریں"
- text: فَعُولُن فَعُولُن فَعُولُن فَعُولُن -== / -== / -== / -==
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ متقارب مثمن محذوف" [level=4]
- paragraph: Bahr-e-Mutaqarib Musamman Mahzoof
- button "انتخاب کریں"
- text: فَعُولُن فَعُولُن فَعُولُن فَعَلْ -== / -== / -== / -=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ متقارب مثمن مضاعف مقبوض اثلم" [level=4]
- paragraph: Bahr-e-Mutaqarib Musamman Muzaaf Maqbooz Aslam
- button "انتخاب کریں"
- text: فَعُولُ فَعْلُن فَعُولُ فَعْلُن فَعُولُ فَعْلُن فَعُولُ فَعْلُن -=- / == / -=- / == / -=- / == / -=- / ==
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ متقارب مسدس مضاعف مقبوض اثلم" [level=4]
- paragraph: Bahr-e-Mutaqarib Musaddas Muzaaf Maqbooz Aslam
- button "انتخاب کریں"
- text: فَعُولُ فَعْلُن فَعُولُ فَعْلُن فَعُولُ فَعْلُن -=- / == / -=- / == / -=- / ==
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ ہزج مثمن مقبوض" [level=4]
- paragraph: Bahr-e-Hazaj Musamman Maqbooz
- button "انتخاب کریں"
- text: مَفَاعِلُن مَفَاعِلُن مَفَاعِلُن مَفَاعِلُن -=-= / -=-= / -=-= / -=-=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ مجتث مثمن مخبون محذوف مقطوع" [level=4]
- paragraph: Bahr-e-Mujtas Musamman Makhboon Mahzoof Maqtoo
- button "انتخاب کریں"
- text: مَفَاعِلُن فَعِلَاتُن مَفَاعِلُن فَعْلُن -=-= / --== / -=-= / ==
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ مجتث مثمن مخبون محذوف" [level=4]
- paragraph: Bahr-e-Mujtas Musamman Makhboon Mahzoof
- button "انتخاب کریں"
- text: مَفَاعِلُن فَعِلَاتُن مَفَاعِلُن فَعِلُن -=-= / --== / -=-= / --=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ مجتث مثمن مخبون" [level=4]
- paragraph: Bahr-e-Mujtas Musamman Makhboon
- button "انتخاب کریں"
- text: مَفَاعِلُن فَعِلَاتُن مَفَاعِلُن فَعِلَاتُن -=-= / --== / -=-= / --==
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ رمل مثمن مشکول" [level=4]
- paragraph: Bahr-e-Ramal Musamman Mashkool
- button "انتخاب کریں"
- text: فَعِلَاتُ فَاعِلَاتُن فَعِلَاتُ فَاعِلَاتُن --=- / =-== / --=- / =-==
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ کامل مثمن سالم" [level=4]
- paragraph: Bahr-e-Kamil Musamman Salim
- button "انتخاب کریں"
- text: مُتَفَاعِلُن مُتَفَاعِلُن مُتَفَاعِلُن مُتَفَاعِلُن --=-= / --=-= / --=-= / --=-=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "رباعی — ہزج مثمن اخرب مکفوف مجبوب" [level=4]
- paragraph: Rubai form 1
- button "انتخاب کریں"
- text: مَفْعُولُ مَفَاعِیلُ مَفَاعِیلُ فَعَلْ ==- / -==- / -==- / -=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "رباعی — ہزج مثمن اخرب مکفوف ابتر" [level=4]
- paragraph: Rubai form 2
- button "انتخاب کریں"
- text: مَفْعُولُ مَفَاعِیلُ مَفَاعِیلُن فَعْ ==- / -==- / -=== / =
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "رباعی — ہزج مثمن اخرب مقبوض ابتر" [level=4]
- paragraph: Rubai form 3
- button "انتخاب کریں"
- text: مَفْعُولُ مَفَاعِلُن مَفَاعِیلُن فَعْ ==- / -=-= / -=== / =
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "رباعی — ہزج مثمن اخرب مقبوض مکفوف مجبوب" [level=4]
- paragraph: Rubai form 4
- button "انتخاب کریں"
- text: مَفْعُولُ مَفَاعِلُن مَفَاعِیلُ فَعَلْ ==- / -=-= / -==- / -=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "رباعی — ہزج مثمن اخرم اشتر مکفوف مجبوب" [level=4]
- paragraph: Rubai form 5
- button "انتخاب کریں"
- text: مَفْعُولُن فَاعِلُن مَفَاعِیلُ فَعَلْ === / =-= / -==- / -=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "رباعی — ہزج مثمن اخرم اشتر ابتر" [level=4]
- paragraph: Rubai form 6
- button "انتخاب کریں"
- text: مَفْعُولُن فَاعِلُن مَفَاعِیلُن فَعْ === / =-= / -=== / =
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "رباعی — ہزج مثمن اخرب اخرم ابتر" [level=4]
- paragraph: Rubai form 7
- button "انتخاب کریں"
- text: مَفْعُولُ مَفَاعِیلُن مَفْعُولُن فَعْ ==- / -=== / === / =
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "رباعی — ہزج مثمن اخرب مجبوب" [level=4]
- paragraph: Rubai form 8
- button "انتخاب کریں"
- text: مَفْعُولُ مَفَاعِیلُن مَفْعُولُ فَعَلْ ==- / -=== / ==- / -=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "رباعی — ہزج مثمن اخرم اخرب مجبوب" [level=4]
- paragraph: Rubai form 9
- button "انتخاب کریں"
- text: مَفْعُولُن مَفْعُولُن مَفْعُولُ فَعَلْ === / === / ==- / -=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "رباعی — ہزج مثمن اخرم ابتر" [level=4]
- paragraph: Rubai form 10
- button "انتخاب کریں"
- text: مَفْعُولُن مَفْعُولُن مَفْعُولُن فَعْ === / === / === / =
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "رباعی — ہزج مثمن اخرم اخرب ابتر" [level=4]
- paragraph: Rubai form 11
- button "انتخاب کریں"
- text: مَفْعُولُن مَفْعُولُ مَفَاعِیلُن فَعْ === / ==- / -=== / =
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "رباعی — ہزج مثمن اخرم اخرب مکفوف مجبوب" [level=4]
- paragraph: Rubai form 12
- button "انتخاب کریں"
- text: مَفْعُولُن مَفْعُولُ مَفَاعِیلُ فَعَلْ === / ==- / -==- / -=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- heading "بحرِ متدارک مثمن سالم" [level=4]
- paragraph: Bahr-e-Mutadarak Musamman Salim
- button "انتخاب کریں"
- text: فَاعِلُن فَاعِلُن فَاعِلُن فَاعِلُن =-= / =-= / =-= / =-=
- paragraph: اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔
- dialog "Prosody Lexicon Review":
  - heading "لغتِ عروض، قرنطینہ و نظرثانی (Prosody Lexicon Review)" [level=3]
  - text: 40,435 کل ذخیرہ • 1007 قرنطینہ • 1 مصدقہ تجاویز
  - button "بند کریں"
  - button "قرنطینہ شدہ الفاظ (1007)"
  - button "مصدقہ ذاتی اوزان (1)"
  - button "درآمد و برآمد (TSV / JSON)"
  - paragraph: غیر معتبر ماخذی اندراجات الگ رکھے گئے ہیں؛ تصدیق کے بعد ہی خودکار اصلاح ممکن ہے۔
  - textbox "تلاش بذریعہ لفظ، ماخذ شناختی نمبر (sourceId) یا وجہ...": آرٹ
  - button
  - text: "وجہ:"
  - combobox:
    - option "تمام وجوہات (All Reasons)" [selected]
    - option "پیچیدہ ساکن مجموعہ (سلسلہ حروفِ ساکنہ) — لغوی تلفظ درکار"
    - option "متضاد اعراب (ایک ہی حرف پر متضاد حرکات)"
    - option "غیر معیاری یا غیر مصدقہ حرف"
    - option "غیر درست لغوی کلید"
    - option "ہائے مخلوط بغیر ماقبل حرف"
    - option "ناجائز تشدید کا مقام"
    - option "درمیانی تنوین (غیر آخری تنوین)"
    - option "غیر ممکن صوتی استثنا"
  - combobox:
    - option "تمام کیفیت (All Status)" [selected]
    - option "قرنطینہ شدہ (بغیر تجویز)"
    - option "زیرِ جائزہ مسودہ (غیر مصدقہ)"
    - option "مصدقہ برائے تقطیع"
  - text: "آرٹ تلفظ: آرْٹ (آرْٹ) وزن: =- aruuz:mastertable:513 • پیچیدہ ساکن مجموعہ (سلسلہ حروفِ ساکنہ) — لغوی تلفظ درکار مصدقہ (فعال)"
  - button "ترمیمِ تجویز"
  - text: "آرٹ تلفظ: آرْٹ (آرْٹ) وزن: =- aruuz:plurals:513 • پیچیدہ ساکن مجموعہ (سلسلہ حروفِ ساکنہ) — لغوی تلفظ درکار مصدقہ (فعال)"
  - button "ترمیمِ تجویز"
  - button "برآمد لغت (Export JSON)"
  - button "بند کریں"
```

# Test source

```ts
  76  |   test('S5 exact title spelling is authoritative', async ({ page }) => {
  77  |     const item = { ...draft(), title: 'نازہ کی اصل عبارت S5' };
  78  |     await boot(page, JSON.stringify([item]));
  79  |     await expect(page.locator('#poem-title-input')).toHaveValue(item.title);
  80  |     await page.locator('#misra-input-0').fill('میرا عام مسودہ S5');
  81  |     await settle(page);
  82  |     await page.reload();
  83  |     await expect(page.locator('#poem-title-input')).toHaveValue(item.title);
  84  |   });
  85  |   for (const [id, raw] of [['S8', '{unreadable-original-S8'], ['S9', JSON.stringify([{ ...draft(), content: 42 }])]] as const) {
  86  |     test(`${id} unreadable/invalid storage remains byte-for-byte intact after an edit`, async ({ page }) => {
  87  |       await boot(page, raw);
  88  |       await page.locator('#poem-title-input').fill(`جلسے کا عنوان ${id}`);
  89  |       await settle(page);
  90  |       expect(await rawStore(page)).toBe(raw);
  91  |       await page.reload();
  92  |       expect(await rawStore(page)).toBe(raw);
  93  |     });
  94  |   }
  95  | });
  96  | 
  97  | test.describe('LKH-003 open acceptance contracts', () => {
  98  |   test.describe.configure({ timeout: 20000 });
  99  |   test.afterEach(async ({ page }, info) => {
  100 |     if (!page.isClosed()) await info.attach('draft-storage.json', { body: JSON.stringify({ raw: await rawStore(page).catch(() => null) }, null, 2), contentType: 'application/json' });
  101 |   });
  102 |   test('S6 failed draft write retains text and must not claim saved', async ({ page }) => {
  103 |     await boot(page, JSON.stringify([draft()]));
  104 |     await failDraftWrites(page);
  105 |     await page.locator('#misra-input-0').fill('نہ محفوظ مگر دستیاب S6');
  106 |     await settle(page);
  107 |     await expect(page.locator('#misra-input-0')).toHaveValue('نہ محفوظ مگر دستیاب S6');
  108 |     expect(await rawStore(page)).not.toContain('نہ محفوظ مگر دستیاب S6');
  109 |     await expect(page.getByText('محفوظ شدہ', { exact: true })).toHaveCount(0);
  110 |   });
  111 |   test('S7 failed draft save offers explicit retry', async ({ page }) => {
  112 |     await boot(page, JSON.stringify([draft()]));
  113 |     await failDraftWrites(page);
  114 |     await page.locator('#misra-input-0').fill('دوبارہ محفوظ S7');
  115 |     await settle(page);
  116 |     await page.evaluate(() => (window as any).__restoreWrites());
  117 |     await page.getByRole('button', { name: /دوبارہ کوشش|Retry/i }).click({ timeout: 2500 });
  118 |     await expect.poll(() => rawStore(page)).toContain('دوبارہ محفوظ S7');
  119 |   });
  120 |   test('S10 corrupt originals have a visible recovery route even if recovery writes fail', async ({ page }) => {
  121 |     const original = '{recovery-original-S10';
  122 |     await boot(page, original);
  123 |     await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('blocked', 'QuotaExceededError'); }; });
  124 |     await settle(page);
  125 |     expect(await rawStore(page)).toBe(original);
  126 |     await expect(page.getByRole('button', { name: /بازیابی|Recovery|خراب ذخیرہ/i })).toBeVisible({ timeout: 2500 });
  127 |   });
  128 |   test('S11 malformed backup is rejected without changing drafts', async ({ page }) => {
  129 |     const before = JSON.stringify([draft()]);
  130 |     await boot(page, before);
  131 |     await restoreBackup(page, { version: '1.0', drafts: [{ ...draft('bad'), content: 42 }] });
  132 |     expect(await rawStore(page)).toBe(before);
  133 |   });
  134 |   test('S12 valid replacement preserves previous portfolio for recovery', async ({ page }) => {
  135 |     const before = JSON.stringify([draft()]);
  136 |     await boot(page, before);
  137 |     await restoreBackup(page, { version: '1.0', drafts: [draft('restored')], prefs: {} });
  138 |     await expect.poll(() => rawStore(page)).toContain('restored');
  139 |     const recovery = await page.evaluate(({ key, before }) => Object.keys(localStorage).some(k => k !== key && localStorage.getItem(k)?.includes(before)), { key, before });
  140 |     expect(recovery).toBe(true);
  141 |   });
  142 |   test('S13 dirty navigation warns before leaving', async ({ page }) => {
  143 |     await boot(page, JSON.stringify([draft()]));
  144 |     let warned = false;
  145 |     page.on('dialog', async dialog => { if (dialog.type() === 'beforeunload') warned = true; await dialog.dismiss(); });
  146 |     await page.locator('#misra-input-0').fill('لمحاتی تبدیلی S13');
  147 |     await page.reload({ timeout: 3000 }).catch(() => {});
  148 |     expect(warned).toBe(true);
  149 |   });
  150 |   test('S14 a newer edit is never labelled saved before its debounce commits', async ({ page }) => {
  151 |     await boot(page, JSON.stringify([draft()]));
  152 |     await page.locator('#misra-input-0').fill('پہلی تبدیلی S14');
  153 |     await settle(page);
  154 |     await expect.poll(() => rawStore(page)).toContain('پہلی تبدیلی S14');
  155 |     await page.locator('#misra-input-0').fill('دوسری تبدیلی S14');
  156 |     await expect(page.getByText('محفوظ شدہ', { exact: true })).toHaveCount(0);
  157 |     await settle(page);
  158 |     await expect.poll(() => rawStore(page)).toContain('دوسری تبدیلی S14');
  159 |   });
  160 |   test('S15 real aborted proposal transaction must not report durable success', async ({ page }) => {
  161 |     await boot(page, JSON.stringify([draft()]));
  162 |     await page.getByRole('button', { name: 'علمِ عروض', exact: true }).click();
  163 |     await page.getByRole('button', { name: /نظمِ لغت و نظرثانی/ }).click();
  164 |     await page.getByTestId('lexicon-search').fill('آرٹ');
  165 |     await page.getByTestId('lexicon-row').filter({ hasText: 'aruuz:mastertable:513' }).getByRole('button').click();
  166 |     await page.getByTestId('proposal-pattern').fill('=-');
  167 |     await page.evaluate(() => {
  168 |       const original = IDBDatabase.prototype.transaction;
  169 |       IDBDatabase.prototype.transaction = function(...args: any[]) {
  170 |         const tx = original.apply(this, args as any);
  171 |         if (this.name === 'QalamAroozDB' && args[1] === 'readwrite') queueMicrotask(() => { try { tx.abort(); } catch {} });
  172 |         return tx;
  173 |       } as typeof original;
  174 |     });
  175 |     await page.getByTestId('proposal-save').click();
> 176 |     await expect(page.getByTestId('proposal-editor')).toContainText(/نشست|مستقل ذخیرہ|session/i, { timeout: 2500 });
      |                                                       ^ Error: expect(locator).toContainText(expected) failed
  177 |   });
  178 |   test('S16 deleting the active dirty draft does not resurrect it on autosave', async ({ page }) => {
  179 |     await boot(page, JSON.stringify([draft()]));
  180 |     await page.locator('#misra-input-0').fill('حذف ہونے والا S16');
  181 |     await portfolio(page);
  182 |     page.once('dialog', dialog => dialog.accept());
  183 |     await page.getByTitle('مسودہ حذف کریں').click();
  184 |     await settle(page);
  185 |     expect(JSON.parse((await rawStore(page))!)).toEqual([]);
  186 |   });
  187 |   test('S17 reload reopens the selected draft rather than drafts[0]', async ({ page }) => {
  188 |     const items = [draft('ordinary-a'), { ...draft('ordinary-b'), content: 'منتخب مسودہ S17' }];
  189 |     await boot(page, JSON.stringify(items));
  190 |     await portfolio(page);
  191 |     await page.getByRole('heading', { name: items[1].title, exact: true }).click();
  192 |     await expect(page.locator('#misra-input-0')).toHaveValue(items[1].content);
  193 |     await settle(page);
  194 |     await page.reload();
  195 |     await expect(page.locator('#misra-input-0')).toHaveValue(items[1].content);
  196 |   });
  197 | });
  198 | 
```