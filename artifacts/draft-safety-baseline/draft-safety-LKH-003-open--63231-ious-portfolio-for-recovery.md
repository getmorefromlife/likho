# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: draft-safety.spec.ts >> LKH-003 open acceptance contracts >> S12 valid replacement preserves previous portfolio for recovery
- Location: tests/e2e/draft-safety.spec.ts:134:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: ✒
      - heading "قلم و قافیہ" [level=1] [ref=e8]
      - generic [ref=e10]: اسٹوڈیو برائے شعر و ادب
      - generic [ref=e11]: PROSODY STUDIO
      - generic [ref=e12]: محفوظ شدہ
    - generic [ref=e16]:
      - button "خطاطی 22px" [ref=e18]:
        - generic [ref=e21]: خطاطی
        - generic [ref=e22]: 22px
      - button "موضوع" [ref=e26]
      - button "کلاسیکی (Classic)" [ref=e37]
      - button "غیر مقفل" [ref=e44]
      - button "تنہائی" [ref=e49]
      - button "نیا کلام" [ref=e57]
      - button "برآمد" [ref=e61]
  - generic [ref=e66]:
    - generic [ref=e67]:
      - generic [ref=e68]:
        - generic [ref=e69]: قوافی کی تختی
        - generic [ref=e75]:
          - generic [ref=e76]: "0"
          - generic [ref=e77]: /
          - generic [ref=e78]: "0"
          - generic [ref=e79]: مستعمل
        - button "کلام کے ساتھ خودکار مطابقت کریں (Re-sync with text)" [ref=e80]
      - generic [ref=e84]:
        - textbox "تلاش کریں..." [ref=e86]
        - generic [ref=e90]:
          - textbox "نیا قافیہ..." [ref=e91]
          - button "قافیہ شامل کریں" [disabled] [ref=e92]
        - button "تختی کی ترتیبات (Zoom & Marker)" [ref=e95]
        - button "تختی بند کریں" [ref=e97]
    - generic [ref=e100]: کوئی قافیہ نہیں ملا۔ "خزانہ قوافی" سے نئے قوافی منتخب فرمائیں یا دستی شامل کریں۔
  - generic [ref=e102]:
    - generic [ref=e104]:
      - generic [ref=e106]:
        - generic [ref=e107]:
          - textbox "عنوانِ کلام یا مطلع درج فرمائیں..." [ref=e109]: عنوان ordinary-a
          - textbox "شاعر کا نام..." [ref=e114]: شاعر آزمائش
        - generic [ref=e115]:
          - button "غزل" [ref=e116]
          - button "نظم" [ref=e117]
          - button "رباعی" [ref=e118]
          - button "نثر / مضمون" [ref=e119]
      - generic [ref=e120]:
        - generic [ref=e121]:
          - generic [ref=e122]:
            - generic [ref=e123]:
              - button "دائیں صف بندی (Align Right - معیاری اردو)" [ref=e124]
              - button "درمیانی صف بندی (Couplet / Center Align)" [ref=e126]
              - button "بائیں صف بندی (Align Left - حوالہ جات/انگریزی)" [ref=e128]
              - button "دونوں طرف ہموار (Justify - کتابی و نثری صف بندی)" [ref=e130]
            - generic [ref=e133]:
              - button "جلی (Bold / Ctrl+B)" [ref=e134]
              - button "ترچھا (Italic / Ctrl+I)" [ref=e137]
              - button "خط کشیدہ (Underline / Ctrl+U)" [ref=e140]
              - button "خطِ تنسیخ (Strikethrough)" [ref=e143]
            - generic [ref=e148]:
              - button "بڑی سرخی (Heading 1)" [ref=e149]
              - button "ذیلی سرخی (Heading 2)" [ref=e152]
              - button "اقتباس / حوالہ (Blockquote)" [ref=e155]
              - button "نقاطی فہرست (Bullet List)" [ref=e159]
              - button "عددی فہرست (Numbered List)" [ref=e161]
              - button "خطِ فاصل (Divider Line)" [ref=e165]
          - generic [ref=e168]:
            - button "+ مطلع" [ref=e169]
            - button "+ شعر" [ref=e170]
            - button "+ مقطع" [ref=e171]
        - generic [ref=e172]:
          - generic [ref=e173] [cursor=pointer]:
            - checkbox "نمائشِ تقطیع و اوزان" [checked] [ref=e174]
            - generic [ref=e177]: نمائشِ تقطیع و اوزان
          - button "پچھلا عمل (Undo)" [disabled] [ref=e179]
          - button "اگلا عمل (Redo)" [disabled] [ref=e183]
          - button "اعراب تختی" [ref=e187]
          - generic [ref=e189]:
            - 'button "صوتی کی بورڈ: آف" [ref=e190]'
            - button "کی بورڈ گائیڈ (نقشہ)" [ref=e194]
      - generic [ref=e198]:
        - generic [ref=e199]: "اعراب و علامات:"
        - generic [ref=e200]:
          - button "ب بَ" [ref=e201]:
            - generic [ref=e202]:
              - text: ب
              - generic [ref=e203]: بَ
          - button "ب بِ" [ref=e204]:
            - generic [ref=e205]:
              - text: ب
              - generic [ref=e206]: بِ
          - button "ب بُ" [ref=e207]:
            - generic [ref=e208]:
              - text: ب
              - generic [ref=e209]: بُ
          - button "ب بّ" [ref=e210]:
            - generic [ref=e211]:
              - text: ب
              - generic [ref=e212]: بّ
          - button "ب بْ" [ref=e213]:
            - generic [ref=e214]:
              - text: ب
              - generic [ref=e215]: بْ
          - button "ب بً" [ref=e216]:
            - generic [ref=e217]:
              - text: ب
              - generic [ref=e218]: بً
          - button "ب بٍ" [ref=e219]:
            - generic [ref=e220]:
              - text: ب
              - generic [ref=e221]: بٍ
          - button "ب بٌ" [ref=e222]:
            - generic [ref=e223]:
              - text: ب
              - generic [ref=e224]: بٌ
          - button "ب بٰ" [ref=e225]:
            - generic [ref=e226]:
              - text: ب
              - generic [ref=e227]: بٰ
          - button "ب بٖ" [ref=e228]:
            - generic [ref=e229]:
              - text: ب
              - generic [ref=e230]: بٖ
          - button "ب بٗ" [ref=e231]:
            - generic [ref=e232]:
              - text: ب
              - generic [ref=e233]: بٗ
          - button "ب بٓ" [ref=e234]:
            - generic [ref=e235]:
              - text: ب
              - generic [ref=e236]: بٓ
          - button "ء" [ref=e237]
          - button "ۂ" [ref=e238]
          - button "ؔ" [ref=e239]
          - button "؏" [ref=e240]
      - generic [ref=e242]:
        - generic [ref=e243]:
          - generic [ref=e244]:
            - generic [ref=e245]:
              - generic [ref=e246]: "1"
              - generic [ref=e247]: پہلا مصرع
            - generic [ref=e248]: 4 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e249]: مرا دل مرا دل
          - generic [ref=e250]:
            - generic [ref=e251]:
              - generic [ref=e252]: بحرِ متقارب مثمن محذوف
              - generic [ref=e259]:
                - generic [ref=e260]: زیرِ تکمیل
                - generic [ref=e264]: 6 ہجے
            - generic [ref=e265]:
              - generic [ref=e266]:
                - generic [ref=e267]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e268]:
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
              - paragraph [ref=e269]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e270] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - generic [ref=e271]:
                - generic [ref=e272]: مرا -=
                - generic [ref=e273]: دل =
                - generic [ref=e274]: مرا -=
                - generic [ref=e275]: دل =
            - group [ref=e276]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e277] [cursor=pointer]
            - generic [ref=e278]:
              - generic [ref=e279]:
                - generic [ref=e280]:
                  - generic [ref=e281]: فَعُولُن
                  - generic [ref=e282]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e283]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e284]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e285]': =
                - generic [ref=e286]:
                  - generic [ref=e287]: فَعُولُن
                  - generic [ref=e288]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e289]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e290]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e291]': =
              - generic [ref=e292]:
                - generic [ref=e293]:
                  - generic [ref=e294]: "مجموعی آہنگ:"
                  - generic [ref=e295]:
                    - generic [ref=e296]: "- = ="
                    - generic [ref=e297]: "- = ="
                - generic [ref=e298]: مصرع جاری رکھیں...
        - generic [ref=e299]:
          - generic [ref=e300]:
            - generic [ref=e301]:
              - generic [ref=e302]: "2"
              - generic [ref=e303]: دوسرا مصرع
            - generic [ref=e304]: 4 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e305]: مرا دل مرا دل
          - generic [ref=e306]:
            - generic [ref=e307]:
              - generic [ref=e308]: بحرِ متقارب مثمن محذوف
              - generic [ref=e315]:
                - generic [ref=e316]: زیرِ تکمیل
                - generic [ref=e320]: 6 ہجے
            - generic [ref=e321]:
              - generic [ref=e322]:
                - generic [ref=e323]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e324]:
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
              - paragraph [ref=e325]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e326] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - generic [ref=e327]:
                - generic [ref=e328]: مرا -=
                - generic [ref=e329]: دل =
                - generic [ref=e330]: مرا -=
                - generic [ref=e331]: دل =
            - group [ref=e332]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e333] [cursor=pointer]
            - generic [ref=e334]:
              - generic [ref=e335]:
                - generic [ref=e336]:
                  - generic [ref=e337]: فَعُولُن
                  - generic [ref=e338]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e339]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e340]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e341]': =
                - generic [ref=e342]:
                  - generic [ref=e343]: فَعُولُن
                  - generic [ref=e344]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e345]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e346]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e347]': =
              - generic [ref=e348]:
                - generic [ref=e349]:
                  - generic [ref=e350]: "مجموعی آہنگ:"
                  - generic [ref=e351]:
                    - generic [ref=e352]: "- = ="
                    - generic [ref=e353]: "- = ="
                - generic [ref=e354]: مصرع جاری رکھیں...
        - button "نیا مصرع شامل کریں" [ref=e356]
      - generic [ref=e359]:
        - generic [ref=e360]:
          - generic [ref=e361]:
            - generic [ref=e362]: "1"
            - generic [ref=e363]: اشعار
          - generic [ref=e364]:
            - generic [ref=e365]: "2"
            - generic [ref=e366]: مصرعے
          - generic [ref=e367]:
            - generic [ref=e368]: "8"
            - generic [ref=e369]: الفاظ
          - generic [ref=e370]:
            - generic [ref=e371]: "20"
            - generic [ref=e372]: حروف
        - generic [ref=e373]: کسی بھی لفظ کو منتخب کر کے لغت و مترادفات ملاحظہ فرمائیں
    - separator "کھینچ کر چوڑائی تبدیل کریں (Drag to resize)" [ref=e378]
    - generic [ref=e382]:
      - generic [ref=e383]:
        - generic [ref=e384]:
          - generic [ref=e385]: ادبی معاون (Literary Companion)
          - button "پینل بند کریں" [ref=e389]
        - generic [ref=e393]:
          - button "خزانہ قوافی" [ref=e394]
          - button "علمِ عروض" [ref=e400]
          - button "لغت و الفاظ" [ref=e406]
          - button "صنائع بدائع" [ref=e411]
          - button "دیوانِ کلام" [active] [ref=e416]
      - generic [ref=e421]:
        - generic [ref=e422]:
          - textbox "مسودات میں تلاش کریں..." [ref=e424]
          - generic [ref=e428]:
            - generic [ref=e429]:
              - text: "کل کلام:"
              - strong [ref=e430]: "1"
            - generic [ref=e431]:
              - button "بیک اپ" [ref=e432]
              - generic "بیک اپ فائل بحال کریں" [ref=e437] [cursor=pointer]: بحالی
        - generic [ref=e443] [cursor=pointer]:
          - generic [ref=e444]:
            - generic [ref=e445]:
              - heading "عنوان restored" [level=4] [ref=e446]
              - generic [ref=e447]: "شاعر: شاعر آزمائش"
            - button "مسودہ حذف کریں" [ref=e449]
          - paragraph [ref=e453]: مرا دل مرا دل
          - generic [ref=e454]: 1 جنوری، 1970
```

# Test source

```ts
  40  |     await boot(page);
  41  |     await page.locator('#misra-input-0').fill('میرا محفوظ پہلا مصرع S1');
  42  |     await page.locator('#poem-title-input').fill('میرا عنوان S1');
  43  |     await page.getByPlaceholder('شاعر کا نام...').fill('میرا نام S1');
  44  |     await settle(page);
  45  |     await portfolio(page); // A real additional storage read, without changing the fixture.
  46  |     await expect.poll(() => rawStore(page)).toContain('میرا محفوظ پہلا مصرع S1');
  47  |     await page.reload();
  48  |     await expect(page.locator('#misra-input-0')).toHaveValue('میرا محفوظ پہلا مصرع S1');
  49  |     await expect(page.locator('#poem-title-input')).toHaveValue('میرا عنوان S1');
  50  |     await expect(page.getByPlaceholder('شاعر کا نام...')).toHaveValue('میرا نام S1');
  51  |   });
  52  |   test('S2 sample later-line edit survives reload', async ({ page }) => {
  53  |     await boot(page);
  54  |     await page.locator('#misra-input-1').fill('میرا محفوظ دوسرا مصرع S2');
  55  |     await settle(page);
  56  |     await expect.poll(() => rawStore(page)).toContain('میرا محفوظ دوسرا مصرع S2');
  57  |     await page.reload();
  58  |     await expect(page.locator('#misra-input-1')).toHaveValue('میرا محفوظ دوسرا مصرع S2');
  59  |   });
  60  |   test('S3 ordinary draft text survives reload', async ({ page }) => {
  61  |     await boot(page, JSON.stringify([draft()]));
  62  |     await page.locator('#misra-input-0').fill('میرا عام مسودہ S3');
  63  |     await settle(page);
  64  |     await expect.poll(() => rawStore(page)).toContain('میرا عام مسودہ S3');
  65  |     await page.reload();
  66  |     await expect(page.locator('#misra-input-0')).toHaveValue('میرا عام مسودہ S3');
  67  |   });
  68  |   test('S4 empty portfolio is not silently reseeded or autosaved', async ({ page }) => {
  69  |     await boot(page, '[]');
  70  |     await settle(page);
  71  |     expect(await rawStore(page)).toBe('[]');
  72  |     await page.reload();
  73  |     await settle(page);
  74  |     expect(await rawStore(page)).toBe('[]');
  75  |   });
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
> 140 |     expect(recovery).toBe(true);
      |                      ^ Error: expect(received).toBe(expected) // Object.is equality
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
  176 |     await expect(page.getByTestId('proposal-editor')).toContainText(/نشست|مستقل ذخیرہ|session/i, { timeout: 2500 });
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