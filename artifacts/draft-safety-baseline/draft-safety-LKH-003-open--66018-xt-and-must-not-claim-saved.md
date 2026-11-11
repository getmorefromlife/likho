# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: draft-safety.spec.ts >> LKH-003 open acceptance contracts >> S6 failed draft write retains text and must not claim saved
- Location: tests/e2e/draft-safety.spec.ts:102:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByText('محفوظ شدہ', { exact: true })
Expected: 0
Received: 1
Timeout:  10000ms

Call log:
  - Expect "toHaveCount" getByText('محفوظ شدہ', { exact: true }) with timeout 10000ms
  - waiting for getByText('محفوظ شدہ', { exact: true })
    24 × locator resolved to 1 element
       - unexpected value "1"

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
            - generic [ref=e248]: 5 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [active] [ref=e249]: نہ محفوظ مگر دستیاب S6
          - generic [ref=e250]:
            - generic [ref=e251]:
              - generic [ref=e252]: بحرِ رمل مسدس مخبون محذوف مقطوع
              - generic [ref=e259]:
                - generic [ref=e260]: تلفظ کی تصدیق درکار
                - generic [ref=e264]: 10 ہجے
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
              - paragraph [ref=e277]: آخر میں زائد ہجائے کوتاہ
              - status [ref=e278]: "ان الفاظ کے تلفظ کی تصدیق درکار ہے: S، 6۔ خودکار اصلاح روک دی گئی ہے۔"
              - generic [ref=e279]:
                - generic [ref=e280]: نہ -
                - generic [ref=e281]: محفوظ ==-
                - generic [ref=e282]: مگر -=
                - generic [ref=e283]: دستیاب =-=-
                - generic [ref=e284]: S ?
            - group [ref=e285]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e286] [cursor=pointer]
            - generic [ref=e287]:
              - generic [ref=e288]:
                - generic [ref=e289]:
                  - generic [ref=e290]: فَاعِلَاتُن
                  - generic [ref=e291]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e292]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e293]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e294]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e295]': "-"
                - generic [ref=e296]:
                  - generic [ref=e297]: فَعِلَاتُن
                  - generic [ref=e298]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e299]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e300]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e301]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e302]': "-"
                - generic [ref=e303]:
                  - generic [ref=e304]: فَعْلُن
                  - generic [ref=e305]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e306]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e307]': "-"
              - generic [ref=e308]:
                - generic [ref=e309]:
                  - generic [ref=e310]: "مجموعی آہنگ:"
                  - generic [ref=e311]:
                    - generic [ref=e312]: "- = = -"
                    - generic [ref=e313]: "- = = -"
                    - generic [ref=e314]: = -
                - generic [ref=e315]: نامکمل تقطیع — تلفظ کی تصدیق درکار ہے
        - generic [ref=e316]:
          - generic [ref=e317]:
            - generic [ref=e318]:
              - generic [ref=e319]: "2"
              - generic [ref=e320]: دوسرا مصرع
            - generic [ref=e321]: 4 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e322]: مرا دل مرا دل
          - generic [ref=e323]:
            - generic [ref=e324]:
              - generic [ref=e325]: بحرِ متقارب مثمن محذوف
              - generic [ref=e332]:
                - generic [ref=e333]: زیرِ تکمیل
                - generic [ref=e337]: 6 ہجے
            - generic [ref=e338]:
              - generic [ref=e339]:
                - generic [ref=e340]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e341]:
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
              - paragraph [ref=e342]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e343] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - generic [ref=e344]:
                - generic [ref=e345]: مرا -=
                - generic [ref=e346]: دل =
                - generic [ref=e347]: مرا -=
                - generic [ref=e348]: دل =
            - group [ref=e349]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e350] [cursor=pointer]
            - generic [ref=e351]:
              - generic [ref=e352]:
                - generic [ref=e353]:
                  - generic [ref=e354]: فَعُولُن
                  - generic [ref=e355]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e356]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e357]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e358]': =
                - generic [ref=e359]:
                  - generic [ref=e360]: فَعُولُن
                  - generic [ref=e361]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e362]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e363]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e364]': =
              - generic [ref=e365]:
                - generic [ref=e366]:
                  - generic [ref=e367]: "مجموعی آہنگ:"
                  - generic [ref=e368]:
                    - generic [ref=e369]: "- = ="
                    - generic [ref=e370]: "- = ="
                - generic [ref=e371]: مصرع جاری رکھیں...
        - button "نیا مصرع شامل کریں" [ref=e373]
      - generic [ref=e376]:
        - generic [ref=e377]:
          - generic [ref=e378]:
            - generic [ref=e379]: "1"
            - generic [ref=e380]: اشعار
          - generic [ref=e381]:
            - generic [ref=e382]: "2"
            - generic [ref=e383]: مصرعے
          - generic [ref=e384]:
            - generic [ref=e385]: "9"
            - generic [ref=e386]: الفاظ
          - generic [ref=e387]:
            - generic [ref=e388]: "28"
            - generic [ref=e389]: حروف
        - generic [ref=e390]: کسی بھی لفظ کو منتخب کر کے لغت و مترادفات ملاحظہ فرمائیں
    - separator "کھینچ کر چوڑائی تبدیل کریں (Drag to resize)" [ref=e395]
    - generic [ref=e399]:
      - generic [ref=e400]:
        - generic [ref=e401]:
          - generic [ref=e402]: ادبی معاون (Literary Companion)
          - button "پینل بند کریں" [ref=e406]
        - generic [ref=e410]:
          - button "خزانہ قوافی" [ref=e411]
          - button "علمِ عروض" [ref=e417]
          - button "لغت و الفاظ" [ref=e423]
          - button "صنائع بدائع" [ref=e428]
          - button "دیوانِ کلام" [ref=e433]
      - generic [ref=e438]:
        - generic [ref=e440]:
          - button "معجمِ قوافی" [ref=e441]
          - button "قالب ساز (Slots)" [ref=e446]
          - button "درآمد فائل 📥" [ref=e449]
          - button "موضوعاتی اوزان" [ref=e454]
        - generic [ref=e458]:
          - 'textbox "قافیہ، حرفِ روی یا کوئی بھی لفظ درج فرمائیں (مثلاً: کلام، بہار، ایمان)..." [ref=e460]'
          - generic [ref=e461]:
            - button "عام کلاسک قوافی" [ref=e462]
            - 'button "قافیہ: ام" [ref=e463]'
            - 'button "قافیہ: ار" [ref=e464]'
            - 'button "قافیہ: ان" [ref=e465]'
            - 'button "قافیہ: ت (حقیقت، بصیرت)" [ref=e466]'
            - 'button "قافیہ: یت" [ref=e467]'
            - 'button "قافیہ: ال" [ref=e468]'
            - 'button "قافیہ: اب" [ref=e469]'
            - 'button "قافیہ: ور" [ref=e470]'
            - 'button "قافیہ: یر" [ref=e471]'
            - 'button "قافیہ: ات" [ref=e472]'
            - 'button "قافیہ: از" [ref=e473]'
            - 'button "قافیہ: اس" [ref=e474]'
            - 'button "قافیہ: نگ" [ref=e475]'
            - 'button "قافیہ: وش" [ref=e476]'
            - 'button "قافیہ: وا/دا/صدا" [ref=e477]'
            - 'button "قافیہ: یں" [ref=e478]'
        - generic [ref=e479]:
          - generic [ref=e484]:
            - text: "کلام سے دریافت شدہ قافیہ:"
            - strong [ref=e485]: S6
          - button "اس کے تمام قافیے دیکھیں" [ref=e486]
        - generic [ref=e487]:
          - generic [ref=e488]:
            - generic [ref=e489]:
              - generic [ref=e490]:
                - generic [ref=e491]: فَعْلُن
                - generic [ref=e492]: ==
                - generic [ref=e493]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e494]
            - button "توام" [ref=e500] [cursor=pointer]
          - generic [ref=e501]:
            - generic [ref=e502]:
              - generic [ref=e503]:
                - generic [ref=e504]: مَفْعُولُ
                - generic [ref=e505]: ==-
                - generic [ref=e506]: (78 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e507]
            - generic [ref=e512]:
              - button "ایام" [ref=e513] [cursor=pointer]
              - button "آرام" [ref=e514] [cursor=pointer]
              - button "آشام" [ref=e515] [cursor=pointer]
              - button "حجام" [ref=e516] [cursor=pointer]
              - button "حطام" [ref=e517] [cursor=pointer]
              - button "حمام" [ref=e518] [cursor=pointer]
              - button "خدام" [ref=e519] [cursor=pointer]
              - button "رسام" [ref=e520] [cursor=pointer]
              - button "صیام" [ref=e521] [cursor=pointer]
              - button "علام" [ref=e522] [cursor=pointer]
              - button "فہام" [ref=e523] [cursor=pointer]
              - button "قدام" [ref=e524] [cursor=pointer]
              - button "نمام" [ref=e525] [cursor=pointer]
              - button "ابرام" [ref=e526] [cursor=pointer]
              - button "اتمام" [ref=e527] [cursor=pointer]
              - button "اجرام" [ref=e528] [cursor=pointer]
              - button "اجسام" [ref=e529] [cursor=pointer]
              - button "احکام" [ref=e530] [cursor=pointer]
              - button "ادغام" [ref=e531] [cursor=pointer]
              - button "ازلام" [ref=e532] [cursor=pointer]
              - button "اسٹام" [ref=e533] [cursor=pointer]
              - button "اسلام" [ref=e534] [cursor=pointer]
              - button "اسہام" [ref=e535] [cursor=pointer]
              - button "اصنام" [ref=e536] [cursor=pointer]
              - button "اعجام" [ref=e537] [cursor=pointer]
              - button "اعلام" [ref=e538] [cursor=pointer]
              - button "اعمام" [ref=e539] [cursor=pointer]
              - button "اغلام" [ref=e540] [cursor=pointer]
              - button "اغنام" [ref=e541] [cursor=pointer]
              - button "افہام" [ref=e542] [cursor=pointer]
              - button "اقدام" [ref=e543] [cursor=pointer]
              - button "اقسام" [ref=e544] [cursor=pointer]
              - button "اقلام" [ref=e545] [cursor=pointer]
              - button "اقوام" [ref=e546] [cursor=pointer]
              - button "الزام" [ref=e547] [cursor=pointer]
              - button "الہام" [ref=e548] [cursor=pointer]
              - button "انجام" [ref=e549] [cursor=pointer]
              - button "اندام" [ref=e550] [cursor=pointer]
              - button "انعام" [ref=e551] [cursor=pointer]
              - button "اوہام" [ref=e552] [cursor=pointer]
              - button "اہرام" [ref=e553] [cursor=pointer]
              - button "ایتام" [ref=e554] [cursor=pointer]
              - button "ایلام" [ref=e555] [cursor=pointer]
              - button "ائلام" [ref=e556] [cursor=pointer]
              - button "ایہام" [ref=e557] [cursor=pointer]
              - button "بادام" [ref=e558] [cursor=pointer]
              - button "بدنام" [ref=e559] [cursor=pointer]
              - button "برسام" [ref=e560] [cursor=pointer]
              - button "بہرام" [ref=e561] [cursor=pointer]
              - button "پاتام" [ref=e562] [cursor=pointer]
              - button "پادام" [ref=e563] [cursor=pointer]
              - button "پانام" [ref=e564] [cursor=pointer]
              - button "پرنام" [ref=e565] [cursor=pointer]
              - button "پہنام" [ref=e566] [cursor=pointer]
              - button "پیتام" [ref=e567] [cursor=pointer]
              - button "پیغام" [ref=e568] [cursor=pointer]
              - button "پیلام" [ref=e569] [cursor=pointer]
              - button "تمتام" [ref=e570] [cursor=pointer]
              - button "حاخام" [ref=e571] [cursor=pointer]
              - button "دشنام" [ref=e572] [cursor=pointer]
              - button "سرسام" [ref=e573] [cursor=pointer]
              - button "ضرغام" [ref=e574] [cursor=pointer]
              - button "کہرام" [ref=e575] [cursor=pointer]
              - button "گمنام" [ref=e576] [cursor=pointer]
              - button "گودام" [ref=e577] [cursor=pointer]
              - button "مادام" [ref=e578] [cursor=pointer]
              - button "مطعام" [ref=e579] [cursor=pointer]
              - button "ملحام" [ref=e580] [cursor=pointer]
              - button "منعام" [ref=e581] [cursor=pointer]
              - button "موٹام" [ref=e582] [cursor=pointer]
              - button "ناکام" [ref=e583] [cursor=pointer]
              - button "نشکام" [ref=e584] [cursor=pointer]
              - button "نفرام" [ref=e585] [cursor=pointer]
              - button "نیپام" [ref=e586] [cursor=pointer]
              - button "نیلام" [ref=e587] [cursor=pointer]
              - button "ہنگام" [ref=e588] [cursor=pointer]
              - button "افہمام" [ref=e589] [cursor=pointer]
              - button "پھولام" [ref=e590] [cursor=pointer]
          - generic [ref=e591]:
            - generic [ref=e592]:
              - generic [ref=e593]:
                - generic [ref=e594]: فَعُولُ
                - generic [ref=e595]: "-=-"
                - generic [ref=e596]: (55 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e597]
            - generic [ref=e602]:
              - button "اتام" [ref=e603] [cursor=pointer]
              - button "اکام" [ref=e604] [cursor=pointer]
              - button "امام" [ref=e605] [cursor=pointer]
              - button "انام" [ref=e606] [cursor=pointer]
              - button "بتام" [ref=e607] [cursor=pointer]
              - button "بدام" [ref=e608] [cursor=pointer]
              - button "برام" [ref=e609] [cursor=pointer]
              - button "بنام" [ref=e610] [cursor=pointer]
              - button "پیام" [ref=e611] [cursor=pointer]
              - button "تلام" [ref=e612] [cursor=pointer]
              - button "تمام" [ref=e613] [cursor=pointer]
              - button "ٹرام" [ref=e614] [cursor=pointer]
              - button "جذام" [ref=e615] [cursor=pointer]
              - button "جسام" [ref=e616] [cursor=pointer]
              - button "حرام" [ref=e617] [cursor=pointer]
              - button "حسام" [ref=e618] [cursor=pointer]
              - button "ختام" [ref=e619] [cursor=pointer]
              - button "خرام" [ref=e620] [cursor=pointer]
              - button "خصام" [ref=e621] [cursor=pointer]
              - button "خنام" [ref=e622] [cursor=pointer]
              - button "خیام" [ref=e623] [cursor=pointer]
              - button "دوام" [ref=e624] [cursor=pointer]
              - button "رخام" [ref=e625] [cursor=pointer]
              - button "رہام" [ref=e626] [cursor=pointer]
              - button "زحام" [ref=e627] [cursor=pointer]
              - button "زکام" [ref=e628] [cursor=pointer]
              - button "زمام" [ref=e629] [cursor=pointer]
              - button "سلام" [ref=e630] [cursor=pointer]
              - button "سنام" [ref=e631] [cursor=pointer]
              - button "سیام" [ref=e632] [cursor=pointer]
              - button "طعام" [ref=e633] [cursor=pointer]
              - button "ظلام" [ref=e634] [cursor=pointer]
              - button "عوام" [ref=e635] [cursor=pointer]
              - button "غلام" [ref=e636] [cursor=pointer]
              - button "قوام" [ref=e637] [cursor=pointer]
              - button "قیام" [ref=e638] [cursor=pointer]
              - button "کرام" [ref=e639] [cursor=pointer]
              - button "کلام" [ref=e640] [cursor=pointer]
              - button "گرام" [ref=e641] [cursor=pointer]
              - button "لگام" [ref=e642] [cursor=pointer]
              - button "مٹام" [ref=e643] [cursor=pointer]
              - button "مدام" [ref=e644] [cursor=pointer]
              - button "مسام" [ref=e645] [cursor=pointer]
              - button "مشام" [ref=e646] [cursor=pointer]
              - button "مقام" [ref=e647] [cursor=pointer]
              - button "ملام" [ref=e648] [cursor=pointer]
              - button "منام" [ref=e649] [cursor=pointer]
              - button "مہام" [ref=e650] [cursor=pointer]
              - button "نحام" [ref=e651] [cursor=pointer]
              - button "نظام" [ref=e652] [cursor=pointer]
              - button "نعام" [ref=e653] [cursor=pointer]
              - button "نکام" [ref=e654] [cursor=pointer]
              - button "نیام" [ref=e655] [cursor=pointer]
              - button "چھدام" [ref=e656] [cursor=pointer]
              - button "دھڑام" [ref=e657] [cursor=pointer]
          - generic [ref=e658]:
            - generic [ref=e659]:
              - generic [ref=e660]:
                - generic [ref=e661]: فَاعِلَاتُ
                - generic [ref=e662]: =-=-
                - generic [ref=e663]: (44 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e664]
            - generic [ref=e669]:
              - button "اتہام" [ref=e670] [cursor=pointer]
              - button "ابتسام" [ref=e671] [cursor=pointer]
              - button "احترام" [ref=e672] [cursor=pointer]
              - button "احتشام" [ref=e673] [cursor=pointer]
              - button "احتمام" [ref=e674] [cursor=pointer]
              - button "اختتام" [ref=e675] [cursor=pointer]
              - button "اختصام" [ref=e676] [cursor=pointer]
              - button "ارتسام" [ref=e677] [cursor=pointer]
              - button "ازدحام" [ref=e678] [cursor=pointer]
              - button "ازدہام" [ref=e679] [cursor=pointer]
              - button "اژدحام" [ref=e680] [cursor=pointer]
              - button "اژدہام" [ref=e681] [cursor=pointer]
              - button "استدام" [ref=e682] [cursor=pointer]
              - button "استلام" [ref=e683] [cursor=pointer]
              - button "اشتمام" [ref=e684] [cursor=pointer]
              - button "اضطرام" [ref=e685] [cursor=pointer]
              - button "اعتصام" [ref=e686] [cursor=pointer]
              - button "اقتدام" [ref=e687] [cursor=pointer]
              - button "اقتسام" [ref=e688] [cursor=pointer]
              - button "اکتتام" [ref=e689] [cursor=pointer]
              - button "التزام" [ref=e690] [cursor=pointer]
              - button "التیام" [ref=e691] [cursor=pointer]
              - button "السلام" [ref=e692] [cursor=pointer]
              - button "انتسام" [ref=e693] [cursor=pointer]
              - button "انتظام" [ref=e694] [cursor=pointer]
              - button "انتقام" [ref=e695] [cursor=pointer]
              - button "انسجام" [ref=e696] [cursor=pointer]
              - button "انصرام" [ref=e697] [cursor=pointer]
              - button "انضمام" [ref=e698] [cursor=pointer]
              - button "انظلام" [ref=e699] [cursor=pointer]
              - button "انعدام" [ref=e700] [cursor=pointer]
              - button "انفصام" [ref=e701] [cursor=pointer]
              - button "انقسام" [ref=e702] [cursor=pointer]
              - button "انہدام" [ref=e703] [cursor=pointer]
              - button "انہزام" [ref=e704] [cursor=pointer]
              - button "انہضام" [ref=e705] [cursor=pointer]
              - button "اہتمام" [ref=e706] [cursor=pointer]
              - button "بدلگام" [ref=e707] [cursor=pointer]
              - button "تیزگام" [ref=e708] [cursor=pointer]
              - button "شاہگام" [ref=e709] [cursor=pointer]
              - button "مستہام" [ref=e710] [cursor=pointer]
              - button "ناتمام" [ref=e711] [cursor=pointer]
              - button "پیرتھام" [ref=e712] [cursor=pointer]
              - button "ذوالکرام" [ref=e713] [cursor=pointer]
          - generic [ref=e714]:
            - generic [ref=e715]:
              - generic [ref=e716]:
                - generic [ref=e717]: بر وزنِ معین
                - generic [ref=e718]: =-
                - generic [ref=e719]: (26 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e720]
            - generic [ref=e725]:
              - button "بام" [ref=e726] [cursor=pointer]
              - button "پام" [ref=e727] [cursor=pointer]
              - button "تام" [ref=e728] [cursor=pointer]
              - button "جام" [ref=e729] [cursor=pointer]
              - button "چام" [ref=e730] [cursor=pointer]
              - button "حام" [ref=e731] [cursor=pointer]
              - button "خام" [ref=e732] [cursor=pointer]
              - button "دام" [ref=e733] [cursor=pointer]
              - button "ڈام" [ref=e734] [cursor=pointer]
              - button "رام" [ref=e735] [cursor=pointer]
              - button "سام" [ref=e736] [cursor=pointer]
              - button "شام" [ref=e737] [cursor=pointer]
              - button "عام" [ref=e738] [cursor=pointer]
              - button "فام" [ref=e739] [cursor=pointer]
              - button "قام" [ref=e740] [cursor=pointer]
              - button "کام" [ref=e741] [cursor=pointer]
              - button "گام" [ref=e742] [cursor=pointer]
              - button "لام" [ref=e743] [cursor=pointer]
              - button "نام" [ref=e744] [cursor=pointer]
              - button "وام" [ref=e745] [cursor=pointer]
              - button "یام" [ref=e746] [cursor=pointer]
              - button "تھام" [ref=e747] [cursor=pointer]
              - button "ٹھام" [ref=e748] [cursor=pointer]
              - button "جھام" [ref=e749] [cursor=pointer]
              - button "دھام" [ref=e750] [cursor=pointer]
              - button "گھام" [ref=e751] [cursor=pointer]
          - generic [ref=e752]:
            - generic [ref=e753]:
              - generic [ref=e754]:
                - generic [ref=e755]: بر وزنِ معین
                - generic [ref=e756]: ===-
                - generic [ref=e757]: (13 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e758]
            - generic [ref=e763]:
              - button "حدتام" [ref=e764] [cursor=pointer]
              - button "بارعام" [ref=e765] [cursor=pointer]
              - button "استحکام" [ref=e766] [cursor=pointer]
              - button "استخدام" [ref=e767] [cursor=pointer]
              - button "استرحام" [ref=e768] [cursor=pointer]
              - button "استشمام" [ref=e769] [cursor=pointer]
              - button "استفہام" [ref=e770] [cursor=pointer]
              - button "استلزام" [ref=e771] [cursor=pointer]
              - button "بدانجام" [ref=e772] [cursor=pointer]
              - button "بداندام" [ref=e773] [cursor=pointer]
              - button "پراندام" [ref=e774] [cursor=pointer]
              - button "سرانجام" [ref=e775] [cursor=pointer]
              - button "نافرجام" [ref=e776] [cursor=pointer]
          - generic [ref=e777]:
            - generic [ref=e778]:
              - generic [ref=e779]:
                - generic [ref=e780]: مرکب وزن
                - generic [ref=e781]: ==-=-
                - generic [ref=e782]: (7 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e783]
            - generic [ref=e788]:
              - button "بدانتظام" [ref=e789] [cursor=pointer]
              - button "داراسلام" [ref=e790] [cursor=pointer]
              - button "ڈائیگرام" [ref=e791] [cursor=pointer]
              - button "مونوگرام" [ref=e792] [cursor=pointer]
              - button "بالالتزام" [ref=e793] [cursor=pointer]
              - button "خیرالکلام" [ref=e794] [cursor=pointer]
              - button "دارالعوام" [ref=e795] [cursor=pointer]
          - generic [ref=e796]:
            - generic [ref=e797]:
              - generic [ref=e798]:
                - generic [ref=e799]: مرکب وزن
                - generic [ref=e800]: "-===-"
                - generic [ref=e801]: (3 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e802]
            - generic [ref=e807]:
              - button "نفیرعام" [ref=e808] [cursor=pointer]
              - button "نکوفرجام" [ref=e809] [cursor=pointer]
              - button "ابوالاجسام" [ref=e810] [cursor=pointer]
          - generic [ref=e811]:
            - generic [ref=e812]:
              - generic [ref=e813]:
                - generic [ref=e814]: مرکب وزن
                - generic [ref=e815]: "-=-=-"
                - generic [ref=e816]: (2 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e817]
            - generic [ref=e822]:
              - button "بلندبام" [ref=e823] [cursor=pointer]
              - button "پروگرام" [ref=e824] [cursor=pointer]
          - generic [ref=e825]:
            - generic [ref=e826]:
              - generic [ref=e827]:
                - generic [ref=e828]: مرکب وزن
                - generic [ref=e829]: ====-
                - generic [ref=e830]: (2 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e831]
            - generic [ref=e836]:
              - button "موبراندام" [ref=e837] [cursor=pointer]
              - button "دارالاسلام" [ref=e838] [cursor=pointer]
          - generic [ref=e839]:
            - generic [ref=e840]:
              - generic [ref=e841]:
                - generic [ref=e842]: مرکب وزن
                - generic [ref=e843]: ===-=-
                - generic [ref=e844]: (2 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e845]
            - generic [ref=e850]:
              - button "مائکروگرام" [ref=e851] [cursor=pointer]
              - button "دارالاہتمام" [ref=e852] [cursor=pointer]
          - generic [ref=e853]:
            - generic [ref=e854]:
              - generic [ref=e855]:
                - generic [ref=e856]: مَفَاعِیلُ
                - generic [ref=e857]: "-==-"
                - generic [ref=e858]: (2 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e859]
            - generic [ref=e864]:
              - button "زرخام" [ref=e865] [cursor=pointer]
              - button "سربام" [ref=e866] [cursor=pointer]
          - generic [ref=e867]:
            - generic [ref=e868]:
              - generic [ref=e869]:
                - generic [ref=e870]: مرکب وزن
                - generic [ref=e871]: =-=-=-
                - generic [ref=e872]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e873]
            - button "احقرالانام" [ref=e879] [cursor=pointer]
          - generic [ref=e880]:
            - generic [ref=e881]:
              - generic [ref=e882]:
                - generic [ref=e883]: ہجائے بلند
                - generic [ref=e884]: =
                - generic [ref=e885]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e886]
            - button "ام" [ref=e892] [cursor=pointer]
          - generic [ref=e893]:
            - generic [ref=e894]:
              - generic [ref=e895]:
                - generic [ref=e896]: مرکب وزن
                - generic [ref=e897]: "--==-"
                - generic [ref=e898]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e899]
            - button "ثمرخام" [ref=e905] [cursor=pointer]
          - generic [ref=e906]:
            - generic [ref=e907]:
              - generic [ref=e908]:
                - generic [ref=e909]: مرکب وزن
                - generic [ref=e910]: =-==-
                - generic [ref=e911]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e912]
            - button "طائربام" [ref=e918] [cursor=pointer]
          - generic [ref=e919]:
            - generic [ref=e920]:
              - generic [ref=e921]:
                - generic [ref=e922]: مرکب وزن
                - generic [ref=e923]: ==-===-
                - generic [ref=e924]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e925]
            - button "مؤیدالاسلام" [ref=e931] [cursor=pointer]
          - generic [ref=e932]:
            - generic [ref=e933]:
              - generic [ref=e934]:
                - generic [ref=e935]: مرکب وزن
                - generic [ref=e936]: =--=-=-
                - generic [ref=e937]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e938]
            - button "مستمرالنظام" [ref=e944] [cursor=pointer]
          - generic [ref=e945]:
            - generic [ref=e946]:
              - generic [ref=e947]:
                - generic [ref=e948]: فَعِلَاتُ
                - generic [ref=e949]: "--=-"
                - generic [ref=e950]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e951]
            - button "نترام" [ref=e957] [cursor=pointer]
```

# Test source

```ts
  9   |       sessionStorage.setItem('draft-safety-seeded', '1');
  10  |     }
  11  |   }, { key, raw });
  12  |   await page.clock.install();
  13  |   await page.goto('/');
  14  | }
  15  | const rawStore = (page: Page) => page.evaluate(key => localStorage.getItem(key), key);
  16  | async function settle(page: Page) { await page.clock.runFor(1700); }
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
> 109 |     await expect(page.getByText('محفوظ شدہ', { exact: true })).toHaveCount(0);
      |                                                                ^ Error: expect(locator).toHaveCount(expected) failed
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