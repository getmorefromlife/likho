# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: draft-safety.spec.ts >> LKH-003 open acceptance contracts >> S13 dirty navigation warns before leaving
- Location: tests/e2e/draft-safety.spec.ts:142:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - banner [ref=f1e4]:
    - generic [ref=f1e5]:
      - generic [ref=f1e6]: ✒
      - heading "قلم و قافیہ" [level=1] [ref=f1e8]
      - generic [ref=f1e10]: اسٹوڈیو برائے شعر و ادب
      - generic [ref=f1e11]: PROSODY STUDIO
      - generic [ref=f1e12]: محفوظ شدہ
    - generic [ref=f1e16]:
      - button "خطاطی 22px" [ref=f1e18]:
        - generic [ref=f1e21]: خطاطی
        - generic [ref=f1e22]: 22px
      - button "موضوع" [ref=f1e26]
      - button "کلاسیکی (Classic)" [ref=f1e37]
      - button "غیر مقفل" [ref=f1e44]
      - button "تنہائی" [ref=f1e49]
      - button "نیا کلام" [ref=f1e57]
      - button "برآمد" [ref=f1e61]
  - generic [ref=f1e66]:
    - generic [ref=f1e67]:
      - generic [ref=f1e68]:
        - generic [ref=f1e69]: قوافی کی تختی
        - generic [ref=f1e75]:
          - generic [ref=f1e76]: "0"
          - generic [ref=f1e77]: /
          - generic [ref=f1e78]: "0"
          - generic [ref=f1e79]: مستعمل
        - button "کلام کے ساتھ خودکار مطابقت کریں (Re-sync with text)" [ref=f1e80]
      - generic [ref=f1e84]:
        - textbox "تلاش کریں..." [ref=f1e86]
        - generic [ref=f1e90]:
          - textbox "نیا قافیہ..." [ref=f1e91]
          - button "قافیہ شامل کریں" [disabled] [ref=f1e92]
        - button "تختی کی ترتیبات (Zoom & Marker)" [ref=f1e95]
        - button "تختی بند کریں" [ref=f1e97]
    - generic [ref=f1e100]: کوئی قافیہ نہیں ملا۔ "خزانہ قوافی" سے نئے قوافی منتخب فرمائیں یا دستی شامل کریں۔
  - generic [ref=f1e102]:
    - generic [ref=f1e104]:
      - generic [ref=f1e106]:
        - generic [ref=f1e107]:
          - textbox "عنوانِ کلام یا مطلع درج فرمائیں..." [ref=f1e109]: عنوان ordinary-a
          - textbox "شاعر کا نام..." [ref=f1e114]: شاعر آزمائش
        - generic [ref=f1e115]:
          - button "غزل" [ref=f1e116]
          - button "نظم" [ref=f1e117]
          - button "رباعی" [ref=f1e118]
          - button "نثر / مضمون" [ref=f1e119]
      - generic [ref=f1e120]:
        - generic [ref=f1e121]:
          - generic [ref=f1e122]:
            - generic [ref=f1e123]:
              - button "دائیں صف بندی (Align Right - معیاری اردو)" [ref=f1e124]
              - button "درمیانی صف بندی (Couplet / Center Align)" [ref=f1e126]
              - button "بائیں صف بندی (Align Left - حوالہ جات/انگریزی)" [ref=f1e128]
              - button "دونوں طرف ہموار (Justify - کتابی و نثری صف بندی)" [ref=f1e130]
            - generic [ref=f1e133]:
              - button "جلی (Bold / Ctrl+B)" [ref=f1e134]
              - button "ترچھا (Italic / Ctrl+I)" [ref=f1e137]
              - button "خط کشیدہ (Underline / Ctrl+U)" [ref=f1e140]
              - button "خطِ تنسیخ (Strikethrough)" [ref=f1e143]
            - generic [ref=f1e148]:
              - button "بڑی سرخی (Heading 1)" [ref=f1e149]
              - button "ذیلی سرخی (Heading 2)" [ref=f1e152]
              - button "اقتباس / حوالہ (Blockquote)" [ref=f1e155]
              - button "نقاطی فہرست (Bullet List)" [ref=f1e159]
              - button "عددی فہرست (Numbered List)" [ref=f1e161]
              - button "خطِ فاصل (Divider Line)" [ref=f1e165]
          - generic [ref=f1e168]:
            - button "+ مطلع" [ref=f1e169]
            - button "+ شعر" [ref=f1e170]
            - button "+ مقطع" [ref=f1e171]
        - generic [ref=f1e172]:
          - generic [ref=f1e173] [cursor=pointer]:
            - checkbox "نمائشِ تقطیع و اوزان" [checked] [ref=f1e174]
            - generic [ref=f1e177]: نمائشِ تقطیع و اوزان
          - button "پچھلا عمل (Undo)" [disabled] [ref=f1e179]
          - button "اگلا عمل (Redo)" [disabled] [ref=f1e183]
          - button "اعراب تختی" [ref=f1e187]
          - generic [ref=f1e189]:
            - 'button "صوتی کی بورڈ: آف" [ref=f1e190]'
            - button "کی بورڈ گائیڈ (نقشہ)" [ref=f1e194]
      - generic [ref=f1e198]:
        - generic [ref=f1e199]: "اعراب و علامات:"
        - generic [ref=f1e200]:
          - button "ب بَ" [ref=f1e201]:
            - generic [ref=f1e202]:
              - text: ب
              - generic [ref=f1e203]: بَ
          - button "ب بِ" [ref=f1e204]:
            - generic [ref=f1e205]:
              - text: ب
              - generic [ref=f1e206]: بِ
          - button "ب بُ" [ref=f1e207]:
            - generic [ref=f1e208]:
              - text: ب
              - generic [ref=f1e209]: بُ
          - button "ب بّ" [ref=f1e210]:
            - generic [ref=f1e211]:
              - text: ب
              - generic [ref=f1e212]: بّ
          - button "ب بْ" [ref=f1e213]:
            - generic [ref=f1e214]:
              - text: ب
              - generic [ref=f1e215]: بْ
          - button "ب بً" [ref=f1e216]:
            - generic [ref=f1e217]:
              - text: ب
              - generic [ref=f1e218]: بً
          - button "ب بٍ" [ref=f1e219]:
            - generic [ref=f1e220]:
              - text: ب
              - generic [ref=f1e221]: بٍ
          - button "ب بٌ" [ref=f1e222]:
            - generic [ref=f1e223]:
              - text: ب
              - generic [ref=f1e224]: بٌ
          - button "ب بٰ" [ref=f1e225]:
            - generic [ref=f1e226]:
              - text: ب
              - generic [ref=f1e227]: بٰ
          - button "ب بٖ" [ref=f1e228]:
            - generic [ref=f1e229]:
              - text: ب
              - generic [ref=f1e230]: بٖ
          - button "ب بٗ" [ref=f1e231]:
            - generic [ref=f1e232]:
              - text: ب
              - generic [ref=f1e233]: بٗ
          - button "ب بٓ" [ref=f1e234]:
            - generic [ref=f1e235]:
              - text: ب
              - generic [ref=f1e236]: بٓ
          - button "ء" [ref=f1e237]
          - button "ۂ" [ref=f1e238]
          - button "ؔ" [ref=f1e239]
          - button "؏" [ref=f1e240]
      - generic [ref=f1e242]:
        - generic [ref=f1e243]:
          - generic [ref=f1e244]:
            - generic [ref=f1e245]:
              - generic [ref=f1e246]: "1"
              - generic [ref=f1e247]: پہلا مصرع
            - generic [ref=f1e248]: 4 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=f1e249]: مرا دل مرا دل
          - generic [ref=f1e250]:
            - generic [ref=f1e251]:
              - generic [ref=f1e252]: بحرِ متقارب مثمن محذوف
              - generic [ref=f1e259]:
                - generic [ref=f1e260]: زیرِ تکمیل
                - generic [ref=f1e264]: 6 ہجے
            - generic [ref=f1e265]:
              - generic [ref=f1e266]:
                - generic [ref=f1e267]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=f1e268]:
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
              - paragraph [ref=f1e269]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=f1e270] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - generic [ref=f1e271]:
                - generic [ref=f1e272]: مرا -=
                - generic [ref=f1e273]: دل =
                - generic [ref=f1e274]: مرا -=
                - generic [ref=f1e275]: دل =
            - group [ref=f1e276]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=f1e277] [cursor=pointer]
            - generic [ref=f1e278]:
              - generic [ref=f1e279]:
                - generic [ref=f1e280]:
                  - generic [ref=f1e281]: فَعُولُن
                  - generic [ref=f1e282]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=f1e283]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=f1e284]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=f1e285]': =
                - generic [ref=f1e286]:
                  - generic [ref=f1e287]: فَعُولُن
                  - generic [ref=f1e288]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=f1e289]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=f1e290]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=f1e291]': =
              - generic [ref=f1e292]:
                - generic [ref=f1e293]:
                  - generic [ref=f1e294]: "مجموعی آہنگ:"
                  - generic [ref=f1e295]:
                    - generic [ref=f1e296]: "- = ="
                    - generic [ref=f1e297]: "- = ="
                - generic [ref=f1e298]: مصرع جاری رکھیں...
        - generic [ref=f1e299]:
          - generic [ref=f1e300]:
            - generic [ref=f1e301]:
              - generic [ref=f1e302]: "2"
              - generic [ref=f1e303]: دوسرا مصرع
            - generic [ref=f1e304]: 4 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=f1e305]: مرا دل مرا دل
          - generic [ref=f1e306]:
            - generic [ref=f1e307]:
              - generic [ref=f1e308]: بحرِ متقارب مثمن محذوف
              - generic [ref=f1e315]:
                - generic [ref=f1e316]: زیرِ تکمیل
                - generic [ref=f1e320]: 6 ہجے
            - generic [ref=f1e321]:
              - generic [ref=f1e322]:
                - generic [ref=f1e323]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=f1e324]:
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
              - paragraph [ref=f1e325]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=f1e326] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - generic [ref=f1e327]:
                - generic [ref=f1e328]: مرا -=
                - generic [ref=f1e329]: دل =
                - generic [ref=f1e330]: مرا -=
                - generic [ref=f1e331]: دل =
            - group [ref=f1e332]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=f1e333] [cursor=pointer]
            - generic [ref=f1e334]:
              - generic [ref=f1e335]:
                - generic [ref=f1e336]:
                  - generic [ref=f1e337]: فَعُولُن
                  - generic [ref=f1e338]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=f1e339]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=f1e340]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=f1e341]': =
                - generic [ref=f1e342]:
                  - generic [ref=f1e343]: فَعُولُن
                  - generic [ref=f1e344]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=f1e345]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=f1e346]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=f1e347]': =
              - generic [ref=f1e348]:
                - generic [ref=f1e349]:
                  - generic [ref=f1e350]: "مجموعی آہنگ:"
                  - generic [ref=f1e351]:
                    - generic [ref=f1e352]: "- = ="
                    - generic [ref=f1e353]: "- = ="
                - generic [ref=f1e354]: مصرع جاری رکھیں...
        - button "نیا مصرع شامل کریں" [ref=f1e356]
      - generic [ref=f1e359]:
        - generic [ref=f1e360]:
          - generic [ref=f1e361]:
            - generic [ref=f1e362]: "1"
            - generic [ref=f1e363]: اشعار
          - generic [ref=f1e364]:
            - generic [ref=f1e365]: "2"
            - generic [ref=f1e366]: مصرعے
          - generic [ref=f1e367]:
            - generic [ref=f1e368]: "8"
            - generic [ref=f1e369]: الفاظ
          - generic [ref=f1e370]:
            - generic [ref=f1e371]: "20"
            - generic [ref=f1e372]: حروف
        - generic [ref=f1e373]: کسی بھی لفظ کو منتخب کر کے لغت و مترادفات ملاحظہ فرمائیں
    - separator "کھینچ کر چوڑائی تبدیل کریں (Drag to resize)" [ref=f1e378]
    - generic [ref=f1e382]:
      - generic [ref=f1e383]:
        - generic [ref=f1e384]:
          - generic [ref=f1e385]: ادبی معاون (Literary Companion)
          - button "پینل بند کریں" [ref=f1e389]
        - generic [ref=f1e393]:
          - button "خزانہ قوافی" [ref=f1e394]
          - button "علمِ عروض" [ref=f1e400]
          - button "لغت و الفاظ" [ref=f1e406]
          - button "صنائع بدائع" [ref=f1e411]
          - button "دیوانِ کلام" [ref=f1e416]
      - generic [ref=f1e421]:
        - generic [ref=f1e423]:
          - button "معجمِ قوافی" [ref=f1e424]
          - button "قالب ساز (Slots)" [ref=f1e429]
          - button "درآمد فائل 📥" [ref=f1e432]
          - button "موضوعاتی اوزان" [ref=f1e437]
        - generic [ref=f1e441]:
          - 'textbox "قافیہ، حرفِ روی یا کوئی بھی لفظ درج فرمائیں (مثلاً: کلام، بہار، ایمان)..." [ref=f1e443]'
          - generic [ref=f1e444]:
            - button "عام کلاسک قوافی" [ref=f1e445]
            - 'button "قافیہ: ام" [ref=f1e446]'
            - 'button "قافیہ: ار" [ref=f1e447]'
            - 'button "قافیہ: ان" [ref=f1e448]'
            - 'button "قافیہ: ت (حقیقت، بصیرت)" [ref=f1e449]'
            - 'button "قافیہ: یت" [ref=f1e450]'
            - 'button "قافیہ: ال" [ref=f1e451]'
            - 'button "قافیہ: اب" [ref=f1e452]'
            - 'button "قافیہ: ور" [ref=f1e453]'
            - 'button "قافیہ: یر" [ref=f1e454]'
            - 'button "قافیہ: ات" [ref=f1e455]'
            - 'button "قافیہ: از" [ref=f1e456]'
            - 'button "قافیہ: اس" [ref=f1e457]'
            - 'button "قافیہ: نگ" [ref=f1e458]'
            - 'button "قافیہ: وش" [ref=f1e459]'
            - 'button "قافیہ: وا/دا/صدا" [ref=f1e460]'
            - 'button "قافیہ: یں" [ref=f1e461]'
        - generic [ref=f1e462]:
          - generic [ref=f1e467]:
            - text: "کلام سے دریافت شدہ قافیہ:"
            - strong [ref=f1e468]: مرا
            - generic [ref=f1e469]: "(ردیف: دل)"
          - button "اس کے تمام قافیے دیکھیں" [ref=f1e470]
        - generic [ref=f1e471]:
          - generic [ref=f1e472]:
            - generic [ref=f1e473]:
              - generic [ref=f1e474]:
                - generic [ref=f1e475]: فَعْلُن
                - generic [ref=f1e476]: ==
                - generic [ref=f1e477]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=f1e478]
            - button "توام" [ref=f1e484] [cursor=pointer]
          - generic [ref=f1e485]:
            - generic [ref=f1e486]:
              - generic [ref=f1e487]:
                - generic [ref=f1e488]: مَفْعُولُ
                - generic [ref=f1e489]: ==-
                - generic [ref=f1e490]: (78 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=f1e491]
            - generic [ref=f1e496]:
              - button "ایام" [ref=f1e497] [cursor=pointer]
              - button "آرام" [ref=f1e498] [cursor=pointer]
              - button "آشام" [ref=f1e499] [cursor=pointer]
              - button "حجام" [ref=f1e500] [cursor=pointer]
              - button "حطام" [ref=f1e501] [cursor=pointer]
              - button "حمام" [ref=f1e502] [cursor=pointer]
              - button "خدام" [ref=f1e503] [cursor=pointer]
              - button "رسام" [ref=f1e504] [cursor=pointer]
              - button "صیام" [ref=f1e505] [cursor=pointer]
              - button "علام" [ref=f1e506] [cursor=pointer]
              - button "فہام" [ref=f1e507] [cursor=pointer]
              - button "قدام" [ref=f1e508] [cursor=pointer]
              - button "نمام" [ref=f1e509] [cursor=pointer]
              - button "ابرام" [ref=f1e510] [cursor=pointer]
              - button "اتمام" [ref=f1e511] [cursor=pointer]
              - button "اجرام" [ref=f1e512] [cursor=pointer]
              - button "اجسام" [ref=f1e513] [cursor=pointer]
              - button "احکام" [ref=f1e514] [cursor=pointer]
              - button "ادغام" [ref=f1e515] [cursor=pointer]
              - button "ازلام" [ref=f1e516] [cursor=pointer]
              - button "اسٹام" [ref=f1e517] [cursor=pointer]
              - button "اسلام" [ref=f1e518] [cursor=pointer]
              - button "اسہام" [ref=f1e519] [cursor=pointer]
              - button "اصنام" [ref=f1e520] [cursor=pointer]
              - button "اعجام" [ref=f1e521] [cursor=pointer]
              - button "اعلام" [ref=f1e522] [cursor=pointer]
              - button "اعمام" [ref=f1e523] [cursor=pointer]
              - button "اغلام" [ref=f1e524] [cursor=pointer]
              - button "اغنام" [ref=f1e525] [cursor=pointer]
              - button "افہام" [ref=f1e526] [cursor=pointer]
              - button "اقدام" [ref=f1e527] [cursor=pointer]
              - button "اقسام" [ref=f1e528] [cursor=pointer]
              - button "اقلام" [ref=f1e529] [cursor=pointer]
              - button "اقوام" [ref=f1e530] [cursor=pointer]
              - button "الزام" [ref=f1e531] [cursor=pointer]
              - button "الہام" [ref=f1e532] [cursor=pointer]
              - button "انجام" [ref=f1e533] [cursor=pointer]
              - button "اندام" [ref=f1e534] [cursor=pointer]
              - button "انعام" [ref=f1e535] [cursor=pointer]
              - button "اوہام" [ref=f1e536] [cursor=pointer]
              - button "اہرام" [ref=f1e537] [cursor=pointer]
              - button "ایتام" [ref=f1e538] [cursor=pointer]
              - button "ایلام" [ref=f1e539] [cursor=pointer]
              - button "ائلام" [ref=f1e540] [cursor=pointer]
              - button "ایہام" [ref=f1e541] [cursor=pointer]
              - button "بادام" [ref=f1e542] [cursor=pointer]
              - button "بدنام" [ref=f1e543] [cursor=pointer]
              - button "برسام" [ref=f1e544] [cursor=pointer]
              - button "بہرام" [ref=f1e545] [cursor=pointer]
              - button "پاتام" [ref=f1e546] [cursor=pointer]
              - button "پادام" [ref=f1e547] [cursor=pointer]
              - button "پانام" [ref=f1e548] [cursor=pointer]
              - button "پرنام" [ref=f1e549] [cursor=pointer]
              - button "پہنام" [ref=f1e550] [cursor=pointer]
              - button "پیتام" [ref=f1e551] [cursor=pointer]
              - button "پیغام" [ref=f1e552] [cursor=pointer]
              - button "پیلام" [ref=f1e553] [cursor=pointer]
              - button "تمتام" [ref=f1e554] [cursor=pointer]
              - button "حاخام" [ref=f1e555] [cursor=pointer]
              - button "دشنام" [ref=f1e556] [cursor=pointer]
              - button "سرسام" [ref=f1e557] [cursor=pointer]
              - button "ضرغام" [ref=f1e558] [cursor=pointer]
              - button "کہرام" [ref=f1e559] [cursor=pointer]
              - button "گمنام" [ref=f1e560] [cursor=pointer]
              - button "گودام" [ref=f1e561] [cursor=pointer]
              - button "مادام" [ref=f1e562] [cursor=pointer]
              - button "مطعام" [ref=f1e563] [cursor=pointer]
              - button "ملحام" [ref=f1e564] [cursor=pointer]
              - button "منعام" [ref=f1e565] [cursor=pointer]
              - button "موٹام" [ref=f1e566] [cursor=pointer]
              - button "ناکام" [ref=f1e567] [cursor=pointer]
              - button "نشکام" [ref=f1e568] [cursor=pointer]
              - button "نفرام" [ref=f1e569] [cursor=pointer]
              - button "نیپام" [ref=f1e570] [cursor=pointer]
              - button "نیلام" [ref=f1e571] [cursor=pointer]
              - button "ہنگام" [ref=f1e572] [cursor=pointer]
              - button "افہمام" [ref=f1e573] [cursor=pointer]
              - button "پھولام" [ref=f1e574] [cursor=pointer]
          - generic [ref=f1e575]:
            - generic [ref=f1e576]:
              - generic [ref=f1e577]:
                - generic [ref=f1e578]: فَعُولُ
                - generic [ref=f1e579]: "-=-"
                - generic [ref=f1e580]: (55 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=f1e581]
            - generic [ref=f1e586]:
              - button "اتام" [ref=f1e587] [cursor=pointer]
              - button "اکام" [ref=f1e588] [cursor=pointer]
              - button "امام" [ref=f1e589] [cursor=pointer]
              - button "انام" [ref=f1e590] [cursor=pointer]
              - button "بتام" [ref=f1e591] [cursor=pointer]
              - button "بدام" [ref=f1e592] [cursor=pointer]
              - button "برام" [ref=f1e593] [cursor=pointer]
              - button "بنام" [ref=f1e594] [cursor=pointer]
              - button "پیام" [ref=f1e595] [cursor=pointer]
              - button "تلام" [ref=f1e596] [cursor=pointer]
              - button "تمام" [ref=f1e597] [cursor=pointer]
              - button "ٹرام" [ref=f1e598] [cursor=pointer]
              - button "جذام" [ref=f1e599] [cursor=pointer]
              - button "جسام" [ref=f1e600] [cursor=pointer]
              - button "حرام" [ref=f1e601] [cursor=pointer]
              - button "حسام" [ref=f1e602] [cursor=pointer]
              - button "ختام" [ref=f1e603] [cursor=pointer]
              - button "خرام" [ref=f1e604] [cursor=pointer]
              - button "خصام" [ref=f1e605] [cursor=pointer]
              - button "خنام" [ref=f1e606] [cursor=pointer]
              - button "خیام" [ref=f1e607] [cursor=pointer]
              - button "دوام" [ref=f1e608] [cursor=pointer]
              - button "رخام" [ref=f1e609] [cursor=pointer]
              - button "رہام" [ref=f1e610] [cursor=pointer]
              - button "زحام" [ref=f1e611] [cursor=pointer]
              - button "زکام" [ref=f1e612] [cursor=pointer]
              - button "زمام" [ref=f1e613] [cursor=pointer]
              - button "سلام" [ref=f1e614] [cursor=pointer]
              - button "سنام" [ref=f1e615] [cursor=pointer]
              - button "سیام" [ref=f1e616] [cursor=pointer]
              - button "طعام" [ref=f1e617] [cursor=pointer]
              - button "ظلام" [ref=f1e618] [cursor=pointer]
              - button "عوام" [ref=f1e619] [cursor=pointer]
              - button "غلام" [ref=f1e620] [cursor=pointer]
              - button "قوام" [ref=f1e621] [cursor=pointer]
              - button "قیام" [ref=f1e622] [cursor=pointer]
              - button "کرام" [ref=f1e623] [cursor=pointer]
              - button "کلام" [ref=f1e624] [cursor=pointer]
              - button "گرام" [ref=f1e625] [cursor=pointer]
              - button "لگام" [ref=f1e626] [cursor=pointer]
              - button "مٹام" [ref=f1e627] [cursor=pointer]
              - button "مدام" [ref=f1e628] [cursor=pointer]
              - button "مسام" [ref=f1e629] [cursor=pointer]
              - button "مشام" [ref=f1e630] [cursor=pointer]
              - button "مقام" [ref=f1e631] [cursor=pointer]
              - button "ملام" [ref=f1e632] [cursor=pointer]
              - button "منام" [ref=f1e633] [cursor=pointer]
              - button "مہام" [ref=f1e634] [cursor=pointer]
              - button "نحام" [ref=f1e635] [cursor=pointer]
              - button "نظام" [ref=f1e636] [cursor=pointer]
              - button "نعام" [ref=f1e637] [cursor=pointer]
              - button "نکام" [ref=f1e638] [cursor=pointer]
              - button "نیام" [ref=f1e639] [cursor=pointer]
              - button "چھدام" [ref=f1e640] [cursor=pointer]
              - button "دھڑام" [ref=f1e641] [cursor=pointer]
          - generic [ref=f1e642]:
            - generic [ref=f1e643]:
              - generic [ref=f1e644]:
                - generic [ref=f1e645]: فَاعِلَاتُ
                - generic [ref=f1e646]: =-=-
                - generic [ref=f1e647]: (44 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=f1e648]
            - generic [ref=f1e653]:
              - button "اتہام" [ref=f1e654] [cursor=pointer]
              - button "ابتسام" [ref=f1e655] [cursor=pointer]
              - button "احترام" [ref=f1e656] [cursor=pointer]
              - button "احتشام" [ref=f1e657] [cursor=pointer]
              - button "احتمام" [ref=f1e658] [cursor=pointer]
              - button "اختتام" [ref=f1e659] [cursor=pointer]
              - button "اختصام" [ref=f1e660] [cursor=pointer]
              - button "ارتسام" [ref=f1e661] [cursor=pointer]
              - button "ازدحام" [ref=f1e662] [cursor=pointer]
              - button "ازدہام" [ref=f1e663] [cursor=pointer]
              - button "اژدحام" [ref=f1e664] [cursor=pointer]
              - button "اژدہام" [ref=f1e665] [cursor=pointer]
              - button "استدام" [ref=f1e666] [cursor=pointer]
              - button "استلام" [ref=f1e667] [cursor=pointer]
              - button "اشتمام" [ref=f1e668] [cursor=pointer]
              - button "اضطرام" [ref=f1e669] [cursor=pointer]
              - button "اعتصام" [ref=f1e670] [cursor=pointer]
              - button "اقتدام" [ref=f1e671] [cursor=pointer]
              - button "اقتسام" [ref=f1e672] [cursor=pointer]
              - button "اکتتام" [ref=f1e673] [cursor=pointer]
              - button "التزام" [ref=f1e674] [cursor=pointer]
              - button "التیام" [ref=f1e675] [cursor=pointer]
              - button "السلام" [ref=f1e676] [cursor=pointer]
              - button "انتسام" [ref=f1e677] [cursor=pointer]
              - button "انتظام" [ref=f1e678] [cursor=pointer]
              - button "انتقام" [ref=f1e679] [cursor=pointer]
              - button "انسجام" [ref=f1e680] [cursor=pointer]
              - button "انصرام" [ref=f1e681] [cursor=pointer]
              - button "انضمام" [ref=f1e682] [cursor=pointer]
              - button "انظلام" [ref=f1e683] [cursor=pointer]
              - button "انعدام" [ref=f1e684] [cursor=pointer]
              - button "انفصام" [ref=f1e685] [cursor=pointer]
              - button "انقسام" [ref=f1e686] [cursor=pointer]
              - button "انہدام" [ref=f1e687] [cursor=pointer]
              - button "انہزام" [ref=f1e688] [cursor=pointer]
              - button "انہضام" [ref=f1e689] [cursor=pointer]
              - button "اہتمام" [ref=f1e690] [cursor=pointer]
              - button "بدلگام" [ref=f1e691] [cursor=pointer]
              - button "تیزگام" [ref=f1e692] [cursor=pointer]
              - button "شاہگام" [ref=f1e693] [cursor=pointer]
              - button "مستہام" [ref=f1e694] [cursor=pointer]
              - button "ناتمام" [ref=f1e695] [cursor=pointer]
              - button "پیرتھام" [ref=f1e696] [cursor=pointer]
              - button "ذوالکرام" [ref=f1e697] [cursor=pointer]
          - generic [ref=f1e698]:
            - generic [ref=f1e699]:
              - generic [ref=f1e700]:
                - generic [ref=f1e701]: بر وزنِ معین
                - generic [ref=f1e702]: =-
                - generic [ref=f1e703]: (26 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=f1e704]
            - generic [ref=f1e709]:
              - button "بام" [ref=f1e710] [cursor=pointer]
              - button "پام" [ref=f1e711] [cursor=pointer]
              - button "تام" [ref=f1e712] [cursor=pointer]
              - button "جام" [ref=f1e713] [cursor=pointer]
              - button "چام" [ref=f1e714] [cursor=pointer]
              - button "حام" [ref=f1e715] [cursor=pointer]
              - button "خام" [ref=f1e716] [cursor=pointer]
              - button "دام" [ref=f1e717] [cursor=pointer]
              - button "ڈام" [ref=f1e718] [cursor=pointer]
              - button "رام" [ref=f1e719] [cursor=pointer]
              - button "سام" [ref=f1e720] [cursor=pointer]
              - button "شام" [ref=f1e721] [cursor=pointer]
              - button "عام" [ref=f1e722] [cursor=pointer]
              - button "فام" [ref=f1e723] [cursor=pointer]
              - button "قام" [ref=f1e724] [cursor=pointer]
              - button "کام" [ref=f1e725] [cursor=pointer]
              - button "گام" [ref=f1e726] [cursor=pointer]
              - button "لام" [ref=f1e727] [cursor=pointer]
              - button "نام" [ref=f1e728] [cursor=pointer]
              - button "وام" [ref=f1e729] [cursor=pointer]
              - button "یام" [ref=f1e730] [cursor=pointer]
              - button "تھام" [ref=f1e731] [cursor=pointer]
              - button "ٹھام" [ref=f1e732] [cursor=pointer]
              - button "جھام" [ref=f1e733] [cursor=pointer]
              - button "دھام" [ref=f1e734] [cursor=pointer]
              - button "گھام" [ref=f1e735] [cursor=pointer]
          - generic [ref=f1e736]:
            - generic [ref=f1e737]:
              - generic [ref=f1e738]:
                - generic [ref=f1e739]: بر وزنِ معین
                - generic [ref=f1e740]: ===-
                - generic [ref=f1e741]: (13 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=f1e742]
            - generic [ref=f1e747]:
              - button "حدتام" [ref=f1e748] [cursor=pointer]
              - button "بارعام" [ref=f1e749] [cursor=pointer]
              - button "استحکام" [ref=f1e750] [cursor=pointer]
              - button "استخدام" [ref=f1e751] [cursor=pointer]
              - button "استرحام" [ref=f1e752] [cursor=pointer]
              - button "استشمام" [ref=f1e753] [cursor=pointer]
              - button "استفہام" [ref=f1e754] [cursor=pointer]
              - button "استلزام" [ref=f1e755] [cursor=pointer]
              - button "بدانجام" [ref=f1e756] [cursor=pointer]
              - button "بداندام" [ref=f1e757] [cursor=pointer]
              - button "پراندام" [ref=f1e758] [cursor=pointer]
              - button "سرانجام" [ref=f1e759] [cursor=pointer]
              - button "نافرجام" [ref=f1e760] [cursor=pointer]
          - generic [ref=f1e761]:
            - generic [ref=f1e762]:
              - generic [ref=f1e763]:
                - generic [ref=f1e764]: مرکب وزن
                - generic [ref=f1e765]: ==-=-
                - generic [ref=f1e766]: (7 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=f1e767]
            - generic [ref=f1e772]:
              - button "بدانتظام" [ref=f1e773] [cursor=pointer]
              - button "داراسلام" [ref=f1e774] [cursor=pointer]
              - button "ڈائیگرام" [ref=f1e775] [cursor=pointer]
              - button "مونوگرام" [ref=f1e776] [cursor=pointer]
              - button "بالالتزام" [ref=f1e777] [cursor=pointer]
              - button "خیرالکلام" [ref=f1e778] [cursor=pointer]
              - button "دارالعوام" [ref=f1e779] [cursor=pointer]
          - generic [ref=f1e780]:
            - generic [ref=f1e781]:
              - generic [ref=f1e782]:
                - generic [ref=f1e783]: مرکب وزن
                - generic [ref=f1e784]: "-===-"
                - generic [ref=f1e785]: (3 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=f1e786]
            - generic [ref=f1e791]:
              - button "نفیرعام" [ref=f1e792] [cursor=pointer]
              - button "نکوفرجام" [ref=f1e793] [cursor=pointer]
              - button "ابوالاجسام" [ref=f1e794] [cursor=pointer]
          - generic [ref=f1e795]:
            - generic [ref=f1e796]:
              - generic [ref=f1e797]:
                - generic [ref=f1e798]: مرکب وزن
                - generic [ref=f1e799]: "-=-=-"
                - generic [ref=f1e800]: (2 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=f1e801]
            - generic [ref=f1e806]:
              - button "بلندبام" [ref=f1e807] [cursor=pointer]
              - button "پروگرام" [ref=f1e808] [cursor=pointer]
          - generic [ref=f1e809]:
            - generic [ref=f1e810]:
              - generic [ref=f1e811]:
                - generic [ref=f1e812]: مرکب وزن
                - generic [ref=f1e813]: ====-
                - generic [ref=f1e814]: (2 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=f1e815]
            - generic [ref=f1e820]:
              - button "موبراندام" [ref=f1e821] [cursor=pointer]
              - button "دارالاسلام" [ref=f1e822] [cursor=pointer]
          - generic [ref=f1e823]:
            - generic [ref=f1e824]:
              - generic [ref=f1e825]:
                - generic [ref=f1e826]: مرکب وزن
                - generic [ref=f1e827]: ===-=-
                - generic [ref=f1e828]: (2 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=f1e829]
            - generic [ref=f1e834]:
              - button "مائکروگرام" [ref=f1e835] [cursor=pointer]
              - button "دارالاہتمام" [ref=f1e836] [cursor=pointer]
          - generic [ref=f1e837]:
            - generic [ref=f1e838]:
              - generic [ref=f1e839]:
                - generic [ref=f1e840]: مَفَاعِیلُ
                - generic [ref=f1e841]: "-==-"
                - generic [ref=f1e842]: (2 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=f1e843]
            - generic [ref=f1e848]:
              - button "زرخام" [ref=f1e849] [cursor=pointer]
              - button "سربام" [ref=f1e850] [cursor=pointer]
          - generic [ref=f1e851]:
            - generic [ref=f1e852]:
              - generic [ref=f1e853]:
                - generic [ref=f1e854]: مرکب وزن
                - generic [ref=f1e855]: =-=-=-
                - generic [ref=f1e856]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=f1e857]
            - button "احقرالانام" [ref=f1e863] [cursor=pointer]
          - generic [ref=f1e864]:
            - generic [ref=f1e865]:
              - generic [ref=f1e866]:
                - generic [ref=f1e867]: ہجائے بلند
                - generic [ref=f1e868]: =
                - generic [ref=f1e869]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=f1e870]
            - button "ام" [ref=f1e876] [cursor=pointer]
          - generic [ref=f1e877]:
            - generic [ref=f1e878]:
              - generic [ref=f1e879]:
                - generic [ref=f1e880]: مرکب وزن
                - generic [ref=f1e881]: "--==-"
                - generic [ref=f1e882]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=f1e883]
            - button "ثمرخام" [ref=f1e889] [cursor=pointer]
          - generic [ref=f1e890]:
            - generic [ref=f1e891]:
              - generic [ref=f1e892]:
                - generic [ref=f1e893]: مرکب وزن
                - generic [ref=f1e894]: =-==-
                - generic [ref=f1e895]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=f1e896]
            - button "طائربام" [ref=f1e902] [cursor=pointer]
          - generic [ref=f1e903]:
            - generic [ref=f1e904]:
              - generic [ref=f1e905]:
                - generic [ref=f1e906]: مرکب وزن
                - generic [ref=f1e907]: ==-===-
                - generic [ref=f1e908]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=f1e909]
            - button "مؤیدالاسلام" [ref=f1e915] [cursor=pointer]
          - generic [ref=f1e916]:
            - generic [ref=f1e917]:
              - generic [ref=f1e918]:
                - generic [ref=f1e919]: مرکب وزن
                - generic [ref=f1e920]: =--=-=-
                - generic [ref=f1e921]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=f1e922]
            - button "مستمرالنظام" [ref=f1e928] [cursor=pointer]
          - generic [ref=f1e929]:
            - generic [ref=f1e930]:
              - generic [ref=f1e931]:
                - generic [ref=f1e932]: فَعِلَاتُ
                - generic [ref=f1e933]: "--=-"
                - generic [ref=f1e934]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=f1e935]
            - button "نترام" [ref=f1e941] [cursor=pointer]
```

# Test source

```ts
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
  140 |     expect(recovery).toBe(true);
  141 |   });
  142 |   test('S13 dirty navigation warns before leaving', async ({ page }) => {
  143 |     await boot(page, JSON.stringify([draft()]));
  144 |     let warned = false;
  145 |     page.on('dialog', async dialog => { if (dialog.type() === 'beforeunload') warned = true; await dialog.dismiss(); });
  146 |     await page.locator('#misra-input-0').fill('لمحاتی تبدیلی S13');
  147 |     await page.reload({ timeout: 3000 }).catch(() => {});
> 148 |     expect(warned).toBe(true);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
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