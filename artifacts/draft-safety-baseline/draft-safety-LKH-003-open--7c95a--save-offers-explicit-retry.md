# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: draft-safety.spec.ts >> LKH-003 open acceptance contracts >> S7 failed draft save offers explicit retry
- Location: tests/e2e/draft-safety.spec.ts:111:3

# Error details

```
TimeoutError: locator.click: Timeout 2500ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /دوبارہ کوشش|Retry/i })

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
          - button "پچھلا عمل (Undo)" [ref=e179]
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
            - generic [ref=e248]: 3 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [active] [ref=e249]: دوبارہ محفوظ S7
          - generic [ref=e250]:
            - generic [ref=e251]:
              - generic [ref=e252]: بحرِ ہزج مسدس اخرم اشتر محذوف
              - generic [ref=e259]:
                - generic [ref=e260]: تلفظ کی تصدیق درکار
                - generic [ref=e264]: 6 ہجے
                - button "اصلاحِ بحر" [ref=e265]
            - generic [ref=e271]:
              - generic [ref=e272]:
                - generic [ref=e273]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e274]:
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
              - paragraph [ref=e275]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e276] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - status [ref=e277]: "ان الفاظ کے تلفظ کی تصدیق درکار ہے: S، 7۔ خودکار اصلاح روک دی گئی ہے۔"
              - generic [ref=e278]:
                - generic [ref=e279]: دوبارہ ===
                - generic [ref=e280]: محفوظ ==-
                - generic [ref=e281]: S ?
            - group [ref=e282]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e283] [cursor=pointer]
            - generic [ref=e284]:
              - generic [ref=e285]:
                - generic [ref=e286]:
                  - generic [ref=e287]: مَفْعُولُن
                  - generic [ref=e288]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e289]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e290]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e291]': =
                - generic [ref=e292]:
                  - generic [ref=e293]: فَاعِلُن
                  - generic [ref=e294]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e295]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e296]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e297]': "-"
              - generic [ref=e298]:
                - generic [ref=e299]:
                  - generic [ref=e300]: "مجموعی آہنگ:"
                  - generic [ref=e301]:
                    - generic [ref=e302]: = = =
                    - generic [ref=e303]: = = -
                - generic [ref=e304]: نامکمل تقطیع — تلفظ کی تصدیق درکار ہے
        - generic [ref=e305]:
          - generic [ref=e306]:
            - generic [ref=e307]:
              - generic [ref=e308]: "2"
              - generic [ref=e309]: دوسرا مصرع
            - generic [ref=e310]: 4 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e311]: مرا دل مرا دل
          - generic [ref=e312]:
            - generic [ref=e313]:
              - generic [ref=e314]: بحرِ متقارب مثمن محذوف
              - generic [ref=e321]:
                - generic [ref=e322]: زیرِ تکمیل
                - generic [ref=e326]: 6 ہجے
            - generic [ref=e327]:
              - generic [ref=e328]:
                - generic [ref=e329]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e330]:
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
              - paragraph [ref=e331]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e332] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - generic [ref=e333]:
                - generic [ref=e334]: مرا -=
                - generic [ref=e335]: دل =
                - generic [ref=e336]: مرا -=
                - generic [ref=e337]: دل =
            - group [ref=e338]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e339] [cursor=pointer]
            - generic [ref=e340]:
              - generic [ref=e341]:
                - generic [ref=e342]:
                  - generic [ref=e343]: فَعُولُن
                  - generic [ref=e344]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e345]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e346]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e347]': =
                - generic [ref=e348]:
                  - generic [ref=e349]: فَعُولُن
                  - generic [ref=e350]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e351]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e352]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e353]': =
              - generic [ref=e354]:
                - generic [ref=e355]:
                  - generic [ref=e356]: "مجموعی آہنگ:"
                  - generic [ref=e357]:
                    - generic [ref=e358]: "- = ="
                    - generic [ref=e359]: "- = ="
                - generic [ref=e360]: مصرع جاری رکھیں...
        - button "نیا مصرع شامل کریں" [ref=e362]
      - generic [ref=e365]:
        - generic [ref=e366]:
          - generic [ref=e367]:
            - generic [ref=e368]: "1"
            - generic [ref=e369]: اشعار
          - generic [ref=e370]:
            - generic [ref=e371]: "2"
            - generic [ref=e372]: مصرعے
          - generic [ref=e373]:
            - generic [ref=e374]: "7"
            - generic [ref=e375]: الفاظ
          - generic [ref=e376]:
            - generic [ref=e377]: "23"
            - generic [ref=e378]: حروف
        - generic [ref=e379]: کسی بھی لفظ کو منتخب کر کے لغت و مترادفات ملاحظہ فرمائیں
    - separator "کھینچ کر چوڑائی تبدیل کریں (Drag to resize)" [ref=e384]
    - generic [ref=e388]:
      - generic [ref=e389]:
        - generic [ref=e390]:
          - generic [ref=e391]: ادبی معاون (Literary Companion)
          - button "پینل بند کریں" [ref=e395]
        - generic [ref=e399]:
          - button "خزانہ قوافی" [ref=e400]
          - button "علمِ عروض" [ref=e406]
          - button "لغت و الفاظ" [ref=e412]
          - button "صنائع بدائع" [ref=e417]
          - button "دیوانِ کلام" [ref=e422]
      - generic [ref=e427]:
        - generic [ref=e429]:
          - button "معجمِ قوافی" [ref=e430]
          - button "قالب ساز (Slots)" [ref=e435]
          - button "درآمد فائل 📥" [ref=e438]
          - button "موضوعاتی اوزان" [ref=e443]
        - generic [ref=e447]:
          - 'textbox "قافیہ، حرفِ روی یا کوئی بھی لفظ درج فرمائیں (مثلاً: کلام، بہار، ایمان)..." [ref=e449]'
          - generic [ref=e450]:
            - button "عام کلاسک قوافی" [ref=e451]
            - 'button "قافیہ: ام" [ref=e452]'
            - 'button "قافیہ: ار" [ref=e453]'
            - 'button "قافیہ: ان" [ref=e454]'
            - 'button "قافیہ: ت (حقیقت، بصیرت)" [ref=e455]'
            - 'button "قافیہ: یت" [ref=e456]'
            - 'button "قافیہ: ال" [ref=e457]'
            - 'button "قافیہ: اب" [ref=e458]'
            - 'button "قافیہ: ور" [ref=e459]'
            - 'button "قافیہ: یر" [ref=e460]'
            - 'button "قافیہ: ات" [ref=e461]'
            - 'button "قافیہ: از" [ref=e462]'
            - 'button "قافیہ: اس" [ref=e463]'
            - 'button "قافیہ: نگ" [ref=e464]'
            - 'button "قافیہ: وش" [ref=e465]'
            - 'button "قافیہ: وا/دا/صدا" [ref=e466]'
            - 'button "قافیہ: یں" [ref=e467]'
        - generic [ref=e468]:
          - generic [ref=e473]:
            - text: "کلام سے دریافت شدہ قافیہ:"
            - strong [ref=e474]: S7
          - button "اس کے تمام قافیے دیکھیں" [ref=e475]
        - generic [ref=e476]:
          - generic [ref=e477]:
            - generic [ref=e478]:
              - generic [ref=e479]:
                - generic [ref=e480]: فَعْلُن
                - generic [ref=e481]: ==
                - generic [ref=e482]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e483]
            - button "توام" [ref=e489] [cursor=pointer]
          - generic [ref=e490]:
            - generic [ref=e491]:
              - generic [ref=e492]:
                - generic [ref=e493]: مَفْعُولُ
                - generic [ref=e494]: ==-
                - generic [ref=e495]: (78 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e496]
            - generic [ref=e501]:
              - button "ایام" [ref=e502] [cursor=pointer]
              - button "آرام" [ref=e503] [cursor=pointer]
              - button "آشام" [ref=e504] [cursor=pointer]
              - button "حجام" [ref=e505] [cursor=pointer]
              - button "حطام" [ref=e506] [cursor=pointer]
              - button "حمام" [ref=e507] [cursor=pointer]
              - button "خدام" [ref=e508] [cursor=pointer]
              - button "رسام" [ref=e509] [cursor=pointer]
              - button "صیام" [ref=e510] [cursor=pointer]
              - button "علام" [ref=e511] [cursor=pointer]
              - button "فہام" [ref=e512] [cursor=pointer]
              - button "قدام" [ref=e513] [cursor=pointer]
              - button "نمام" [ref=e514] [cursor=pointer]
              - button "ابرام" [ref=e515] [cursor=pointer]
              - button "اتمام" [ref=e516] [cursor=pointer]
              - button "اجرام" [ref=e517] [cursor=pointer]
              - button "اجسام" [ref=e518] [cursor=pointer]
              - button "احکام" [ref=e519] [cursor=pointer]
              - button "ادغام" [ref=e520] [cursor=pointer]
              - button "ازلام" [ref=e521] [cursor=pointer]
              - button "اسٹام" [ref=e522] [cursor=pointer]
              - button "اسلام" [ref=e523] [cursor=pointer]
              - button "اسہام" [ref=e524] [cursor=pointer]
              - button "اصنام" [ref=e525] [cursor=pointer]
              - button "اعجام" [ref=e526] [cursor=pointer]
              - button "اعلام" [ref=e527] [cursor=pointer]
              - button "اعمام" [ref=e528] [cursor=pointer]
              - button "اغلام" [ref=e529] [cursor=pointer]
              - button "اغنام" [ref=e530] [cursor=pointer]
              - button "افہام" [ref=e531] [cursor=pointer]
              - button "اقدام" [ref=e532] [cursor=pointer]
              - button "اقسام" [ref=e533] [cursor=pointer]
              - button "اقلام" [ref=e534] [cursor=pointer]
              - button "اقوام" [ref=e535] [cursor=pointer]
              - button "الزام" [ref=e536] [cursor=pointer]
              - button "الہام" [ref=e537] [cursor=pointer]
              - button "انجام" [ref=e538] [cursor=pointer]
              - button "اندام" [ref=e539] [cursor=pointer]
              - button "انعام" [ref=e540] [cursor=pointer]
              - button "اوہام" [ref=e541] [cursor=pointer]
              - button "اہرام" [ref=e542] [cursor=pointer]
              - button "ایتام" [ref=e543] [cursor=pointer]
              - button "ایلام" [ref=e544] [cursor=pointer]
              - button "ائلام" [ref=e545] [cursor=pointer]
              - button "ایہام" [ref=e546] [cursor=pointer]
              - button "بادام" [ref=e547] [cursor=pointer]
              - button "بدنام" [ref=e548] [cursor=pointer]
              - button "برسام" [ref=e549] [cursor=pointer]
              - button "بہرام" [ref=e550] [cursor=pointer]
              - button "پاتام" [ref=e551] [cursor=pointer]
              - button "پادام" [ref=e552] [cursor=pointer]
              - button "پانام" [ref=e553] [cursor=pointer]
              - button "پرنام" [ref=e554] [cursor=pointer]
              - button "پہنام" [ref=e555] [cursor=pointer]
              - button "پیتام" [ref=e556] [cursor=pointer]
              - button "پیغام" [ref=e557] [cursor=pointer]
              - button "پیلام" [ref=e558] [cursor=pointer]
              - button "تمتام" [ref=e559] [cursor=pointer]
              - button "حاخام" [ref=e560] [cursor=pointer]
              - button "دشنام" [ref=e561] [cursor=pointer]
              - button "سرسام" [ref=e562] [cursor=pointer]
              - button "ضرغام" [ref=e563] [cursor=pointer]
              - button "کہرام" [ref=e564] [cursor=pointer]
              - button "گمنام" [ref=e565] [cursor=pointer]
              - button "گودام" [ref=e566] [cursor=pointer]
              - button "مادام" [ref=e567] [cursor=pointer]
              - button "مطعام" [ref=e568] [cursor=pointer]
              - button "ملحام" [ref=e569] [cursor=pointer]
              - button "منعام" [ref=e570] [cursor=pointer]
              - button "موٹام" [ref=e571] [cursor=pointer]
              - button "ناکام" [ref=e572] [cursor=pointer]
              - button "نشکام" [ref=e573] [cursor=pointer]
              - button "نفرام" [ref=e574] [cursor=pointer]
              - button "نیپام" [ref=e575] [cursor=pointer]
              - button "نیلام" [ref=e576] [cursor=pointer]
              - button "ہنگام" [ref=e577] [cursor=pointer]
              - button "افہمام" [ref=e578] [cursor=pointer]
              - button "پھولام" [ref=e579] [cursor=pointer]
          - generic [ref=e580]:
            - generic [ref=e581]:
              - generic [ref=e582]:
                - generic [ref=e583]: فَعُولُ
                - generic [ref=e584]: "-=-"
                - generic [ref=e585]: (55 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e586]
            - generic [ref=e591]:
              - button "اتام" [ref=e592] [cursor=pointer]
              - button "اکام" [ref=e593] [cursor=pointer]
              - button "امام" [ref=e594] [cursor=pointer]
              - button "انام" [ref=e595] [cursor=pointer]
              - button "بتام" [ref=e596] [cursor=pointer]
              - button "بدام" [ref=e597] [cursor=pointer]
              - button "برام" [ref=e598] [cursor=pointer]
              - button "بنام" [ref=e599] [cursor=pointer]
              - button "پیام" [ref=e600] [cursor=pointer]
              - button "تلام" [ref=e601] [cursor=pointer]
              - button "تمام" [ref=e602] [cursor=pointer]
              - button "ٹرام" [ref=e603] [cursor=pointer]
              - button "جذام" [ref=e604] [cursor=pointer]
              - button "جسام" [ref=e605] [cursor=pointer]
              - button "حرام" [ref=e606] [cursor=pointer]
              - button "حسام" [ref=e607] [cursor=pointer]
              - button "ختام" [ref=e608] [cursor=pointer]
              - button "خرام" [ref=e609] [cursor=pointer]
              - button "خصام" [ref=e610] [cursor=pointer]
              - button "خنام" [ref=e611] [cursor=pointer]
              - button "خیام" [ref=e612] [cursor=pointer]
              - button "دوام" [ref=e613] [cursor=pointer]
              - button "رخام" [ref=e614] [cursor=pointer]
              - button "رہام" [ref=e615] [cursor=pointer]
              - button "زحام" [ref=e616] [cursor=pointer]
              - button "زکام" [ref=e617] [cursor=pointer]
              - button "زمام" [ref=e618] [cursor=pointer]
              - button "سلام" [ref=e619] [cursor=pointer]
              - button "سنام" [ref=e620] [cursor=pointer]
              - button "سیام" [ref=e621] [cursor=pointer]
              - button "طعام" [ref=e622] [cursor=pointer]
              - button "ظلام" [ref=e623] [cursor=pointer]
              - button "عوام" [ref=e624] [cursor=pointer]
              - button "غلام" [ref=e625] [cursor=pointer]
              - button "قوام" [ref=e626] [cursor=pointer]
              - button "قیام" [ref=e627] [cursor=pointer]
              - button "کرام" [ref=e628] [cursor=pointer]
              - button "کلام" [ref=e629] [cursor=pointer]
              - button "گرام" [ref=e630] [cursor=pointer]
              - button "لگام" [ref=e631] [cursor=pointer]
              - button "مٹام" [ref=e632] [cursor=pointer]
              - button "مدام" [ref=e633] [cursor=pointer]
              - button "مسام" [ref=e634] [cursor=pointer]
              - button "مشام" [ref=e635] [cursor=pointer]
              - button "مقام" [ref=e636] [cursor=pointer]
              - button "ملام" [ref=e637] [cursor=pointer]
              - button "منام" [ref=e638] [cursor=pointer]
              - button "مہام" [ref=e639] [cursor=pointer]
              - button "نحام" [ref=e640] [cursor=pointer]
              - button "نظام" [ref=e641] [cursor=pointer]
              - button "نعام" [ref=e642] [cursor=pointer]
              - button "نکام" [ref=e643] [cursor=pointer]
              - button "نیام" [ref=e644] [cursor=pointer]
              - button "چھدام" [ref=e645] [cursor=pointer]
              - button "دھڑام" [ref=e646] [cursor=pointer]
          - generic [ref=e647]:
            - generic [ref=e648]:
              - generic [ref=e649]:
                - generic [ref=e650]: فَاعِلَاتُ
                - generic [ref=e651]: =-=-
                - generic [ref=e652]: (44 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e653]
            - generic [ref=e658]:
              - button "اتہام" [ref=e659] [cursor=pointer]
              - button "ابتسام" [ref=e660] [cursor=pointer]
              - button "احترام" [ref=e661] [cursor=pointer]
              - button "احتشام" [ref=e662] [cursor=pointer]
              - button "احتمام" [ref=e663] [cursor=pointer]
              - button "اختتام" [ref=e664] [cursor=pointer]
              - button "اختصام" [ref=e665] [cursor=pointer]
              - button "ارتسام" [ref=e666] [cursor=pointer]
              - button "ازدحام" [ref=e667] [cursor=pointer]
              - button "ازدہام" [ref=e668] [cursor=pointer]
              - button "اژدحام" [ref=e669] [cursor=pointer]
              - button "اژدہام" [ref=e670] [cursor=pointer]
              - button "استدام" [ref=e671] [cursor=pointer]
              - button "استلام" [ref=e672] [cursor=pointer]
              - button "اشتمام" [ref=e673] [cursor=pointer]
              - button "اضطرام" [ref=e674] [cursor=pointer]
              - button "اعتصام" [ref=e675] [cursor=pointer]
              - button "اقتدام" [ref=e676] [cursor=pointer]
              - button "اقتسام" [ref=e677] [cursor=pointer]
              - button "اکتتام" [ref=e678] [cursor=pointer]
              - button "التزام" [ref=e679] [cursor=pointer]
              - button "التیام" [ref=e680] [cursor=pointer]
              - button "السلام" [ref=e681] [cursor=pointer]
              - button "انتسام" [ref=e682] [cursor=pointer]
              - button "انتظام" [ref=e683] [cursor=pointer]
              - button "انتقام" [ref=e684] [cursor=pointer]
              - button "انسجام" [ref=e685] [cursor=pointer]
              - button "انصرام" [ref=e686] [cursor=pointer]
              - button "انضمام" [ref=e687] [cursor=pointer]
              - button "انظلام" [ref=e688] [cursor=pointer]
              - button "انعدام" [ref=e689] [cursor=pointer]
              - button "انفصام" [ref=e690] [cursor=pointer]
              - button "انقسام" [ref=e691] [cursor=pointer]
              - button "انہدام" [ref=e692] [cursor=pointer]
              - button "انہزام" [ref=e693] [cursor=pointer]
              - button "انہضام" [ref=e694] [cursor=pointer]
              - button "اہتمام" [ref=e695] [cursor=pointer]
              - button "بدلگام" [ref=e696] [cursor=pointer]
              - button "تیزگام" [ref=e697] [cursor=pointer]
              - button "شاہگام" [ref=e698] [cursor=pointer]
              - button "مستہام" [ref=e699] [cursor=pointer]
              - button "ناتمام" [ref=e700] [cursor=pointer]
              - button "پیرتھام" [ref=e701] [cursor=pointer]
              - button "ذوالکرام" [ref=e702] [cursor=pointer]
          - generic [ref=e703]:
            - generic [ref=e704]:
              - generic [ref=e705]:
                - generic [ref=e706]: بر وزنِ معین
                - generic [ref=e707]: =-
                - generic [ref=e708]: (26 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e709]
            - generic [ref=e714]:
              - button "بام" [ref=e715] [cursor=pointer]
              - button "پام" [ref=e716] [cursor=pointer]
              - button "تام" [ref=e717] [cursor=pointer]
              - button "جام" [ref=e718] [cursor=pointer]
              - button "چام" [ref=e719] [cursor=pointer]
              - button "حام" [ref=e720] [cursor=pointer]
              - button "خام" [ref=e721] [cursor=pointer]
              - button "دام" [ref=e722] [cursor=pointer]
              - button "ڈام" [ref=e723] [cursor=pointer]
              - button "رام" [ref=e724] [cursor=pointer]
              - button "سام" [ref=e725] [cursor=pointer]
              - button "شام" [ref=e726] [cursor=pointer]
              - button "عام" [ref=e727] [cursor=pointer]
              - button "فام" [ref=e728] [cursor=pointer]
              - button "قام" [ref=e729] [cursor=pointer]
              - button "کام" [ref=e730] [cursor=pointer]
              - button "گام" [ref=e731] [cursor=pointer]
              - button "لام" [ref=e732] [cursor=pointer]
              - button "نام" [ref=e733] [cursor=pointer]
              - button "وام" [ref=e734] [cursor=pointer]
              - button "یام" [ref=e735] [cursor=pointer]
              - button "تھام" [ref=e736] [cursor=pointer]
              - button "ٹھام" [ref=e737] [cursor=pointer]
              - button "جھام" [ref=e738] [cursor=pointer]
              - button "دھام" [ref=e739] [cursor=pointer]
              - button "گھام" [ref=e740] [cursor=pointer]
          - generic [ref=e741]:
            - generic [ref=e742]:
              - generic [ref=e743]:
                - generic [ref=e744]: بر وزنِ معین
                - generic [ref=e745]: ===-
                - generic [ref=e746]: (13 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e747]
            - generic [ref=e752]:
              - button "حدتام" [ref=e753] [cursor=pointer]
              - button "بارعام" [ref=e754] [cursor=pointer]
              - button "استحکام" [ref=e755] [cursor=pointer]
              - button "استخدام" [ref=e756] [cursor=pointer]
              - button "استرحام" [ref=e757] [cursor=pointer]
              - button "استشمام" [ref=e758] [cursor=pointer]
              - button "استفہام" [ref=e759] [cursor=pointer]
              - button "استلزام" [ref=e760] [cursor=pointer]
              - button "بدانجام" [ref=e761] [cursor=pointer]
              - button "بداندام" [ref=e762] [cursor=pointer]
              - button "پراندام" [ref=e763] [cursor=pointer]
              - button "سرانجام" [ref=e764] [cursor=pointer]
              - button "نافرجام" [ref=e765] [cursor=pointer]
          - generic [ref=e766]:
            - generic [ref=e767]:
              - generic [ref=e768]:
                - generic [ref=e769]: مرکب وزن
                - generic [ref=e770]: ==-=-
                - generic [ref=e771]: (7 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e772]
            - generic [ref=e777]:
              - button "بدانتظام" [ref=e778] [cursor=pointer]
              - button "داراسلام" [ref=e779] [cursor=pointer]
              - button "ڈائیگرام" [ref=e780] [cursor=pointer]
              - button "مونوگرام" [ref=e781] [cursor=pointer]
              - button "بالالتزام" [ref=e782] [cursor=pointer]
              - button "خیرالکلام" [ref=e783] [cursor=pointer]
              - button "دارالعوام" [ref=e784] [cursor=pointer]
          - generic [ref=e785]:
            - generic [ref=e786]:
              - generic [ref=e787]:
                - generic [ref=e788]: مرکب وزن
                - generic [ref=e789]: "-===-"
                - generic [ref=e790]: (3 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e791]
            - generic [ref=e796]:
              - button "نفیرعام" [ref=e797] [cursor=pointer]
              - button "نکوفرجام" [ref=e798] [cursor=pointer]
              - button "ابوالاجسام" [ref=e799] [cursor=pointer]
          - generic [ref=e800]:
            - generic [ref=e801]:
              - generic [ref=e802]:
                - generic [ref=e803]: مرکب وزن
                - generic [ref=e804]: "-=-=-"
                - generic [ref=e805]: (2 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e806]
            - generic [ref=e811]:
              - button "بلندبام" [ref=e812] [cursor=pointer]
              - button "پروگرام" [ref=e813] [cursor=pointer]
          - generic [ref=e814]:
            - generic [ref=e815]:
              - generic [ref=e816]:
                - generic [ref=e817]: مرکب وزن
                - generic [ref=e818]: ====-
                - generic [ref=e819]: (2 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e820]
            - generic [ref=e825]:
              - button "موبراندام" [ref=e826] [cursor=pointer]
              - button "دارالاسلام" [ref=e827] [cursor=pointer]
          - generic [ref=e828]:
            - generic [ref=e829]:
              - generic [ref=e830]:
                - generic [ref=e831]: مرکب وزن
                - generic [ref=e832]: ===-=-
                - generic [ref=e833]: (2 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e834]
            - generic [ref=e839]:
              - button "مائکروگرام" [ref=e840] [cursor=pointer]
              - button "دارالاہتمام" [ref=e841] [cursor=pointer]
          - generic [ref=e842]:
            - generic [ref=e843]:
              - generic [ref=e844]:
                - generic [ref=e845]: مَفَاعِیلُ
                - generic [ref=e846]: "-==-"
                - generic [ref=e847]: (2 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e848]
            - generic [ref=e853]:
              - button "زرخام" [ref=e854] [cursor=pointer]
              - button "سربام" [ref=e855] [cursor=pointer]
          - generic [ref=e856]:
            - generic [ref=e857]:
              - generic [ref=e858]:
                - generic [ref=e859]: مرکب وزن
                - generic [ref=e860]: =-=-=-
                - generic [ref=e861]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e862]
            - button "احقرالانام" [ref=e868] [cursor=pointer]
          - generic [ref=e869]:
            - generic [ref=e870]:
              - generic [ref=e871]:
                - generic [ref=e872]: ہجائے بلند
                - generic [ref=e873]: =
                - generic [ref=e874]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e875]
            - button "ام" [ref=e881] [cursor=pointer]
          - generic [ref=e882]:
            - generic [ref=e883]:
              - generic [ref=e884]:
                - generic [ref=e885]: مرکب وزن
                - generic [ref=e886]: "--==-"
                - generic [ref=e887]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e888]
            - button "ثمرخام" [ref=e894] [cursor=pointer]
          - generic [ref=e895]:
            - generic [ref=e896]:
              - generic [ref=e897]:
                - generic [ref=e898]: مرکب وزن
                - generic [ref=e899]: =-==-
                - generic [ref=e900]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e901]
            - button "طائربام" [ref=e907] [cursor=pointer]
          - generic [ref=e908]:
            - generic [ref=e909]:
              - generic [ref=e910]:
                - generic [ref=e911]: مرکب وزن
                - generic [ref=e912]: ==-===-
                - generic [ref=e913]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e914]
            - button "مؤیدالاسلام" [ref=e920] [cursor=pointer]
          - generic [ref=e921]:
            - generic [ref=e922]:
              - generic [ref=e923]:
                - generic [ref=e924]: مرکب وزن
                - generic [ref=e925]: =--=-=-
                - generic [ref=e926]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e927]
            - button "مستمرالنظام" [ref=e933] [cursor=pointer]
          - generic [ref=e934]:
            - generic [ref=e935]:
              - generic [ref=e936]:
                - generic [ref=e937]: فَعِلَاتُ
                - generic [ref=e938]: "--=-"
                - generic [ref=e939]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e940]
            - button "نترام" [ref=e946] [cursor=pointer]
```

# Test source

```ts
  17  | async function portfolio(page: Page) { await page.getByRole('button', { name: 'دیوانِ کلام', exact: true }).click(); }
  18  | async function failDraftWrites(page: Page) {
  19  |   await page.evaluate(key => {
  20  |     const original = Storage.prototype.setItem;
  21  |     (window as any).__restoreWrites = () => { Storage.prototype.setItem = original; };
  22  |     Storage.prototype.setItem = function(k, value) {
  23  |       if (k === key) throw new DOMException('Injected drafts quota failure', 'QuotaExceededError');
  24  |       return original.call(this, k, value);
  25  |     };
  26  |   }, key);
  27  | }
  28  | async function restoreBackup(page: Page, data: unknown) {
  29  |   await portfolio(page);
  30  |   page.once('dialog', dialog => dialog.accept());
  31  |   await page.locator('input[type=file]').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)) });
  32  | }
  33  | 
  34  | test.describe('LKH-002 preservation', () => {
  35  |   test.describe.configure({ timeout: 20000 });
  36  |   test.afterEach(async ({ page }, info) => {
  37  |     if (!page.isClosed()) await info.attach('draft-storage.json', { body: JSON.stringify({ raw: await rawStore(page).catch(() => null) }, null, 2), contentType: 'application/json' });
  38  |   });
  39  |   test('S1 sample first line and metadata survive autosave, another read and reload', async ({ page }) => {
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
> 117 |     await page.getByRole('button', { name: /دوبارہ کوشش|Retry/i }).click({ timeout: 2500 });
      |                                                                    ^ TimeoutError: locator.click: Timeout 2500ms exceeded.
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