# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: draft-safety.spec.ts >> LKH-002 preservation >> S1 sample first line and metadata survive autosave, another read and reload
- Location: tests/e2e/draft-safety.spec.ts:39:3

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "میرا محفوظ پہلا مصرع S1"
Received string:    "[{\"id\":\"draft-initial-ghalib\",\"title\":\"نقش فریادی ہے کس کی شوخیِ تحریر کا\",\"poet\":\"مرزا اسد اللہ خان غالب\",\"form\":\"ghazal\",\"meterName\":\"بحرِ رمل مثمن محذوف\",\"meterRukn\":\"فاعلاتن فاعلاتن فاعلاتن فاعلن\",\"radif\":\"کا\",\"tags\":[\"کلاسیکی\",\"غزل\",\"معرفت\"],\"createdAt\":1793174750601,\"updatedAt\":1793261154035,\"qafiyaList\":[\"تحریر\",\"تصویر\",\"زنجیر\",\"تقدیر\",\"تدبیر\",\"شمشیر\",\"جاگیر\",\"تعبیر\"],\"content\":\"نقش فریادی ہے کس کی شوخیِ تحریر کا\\nکاغذی ہے پیرہن ہر پیکرِ تصویر کا\\n\\nکاو کاوِ سخت جانی ہائے تنہائی نہ پوچھ\\nصبح کرنا شام کا لانا ہے جوئے شیر کا\\n\\nجذبۂ بے اختیارِ شوق دیکھا چاہیے\\nسینۂ شمشیر سے باہر ہے دم شمشیر کا\\n\\nآگہی دامِ شنیدن جس قدر چاہے بچھائے\\nمدعا عنقا ہے اپنے عالمِ تقریر کا\\n\\nبسکہ ہوں غالب اسیری میں بھی آتش زیرِ پا\\nموئے آتش دیدہ ہے حلقہ مری زنجیر کا\"}]"

Call Log:
- Timeout 10000ms exceeded while waiting on the predicate
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
          - generic [ref=e76]: "3"
          - generic [ref=e77]: /
          - generic [ref=e78]: "8"
          - generic [ref=e79]: مستعمل
        - button "کلام کے ساتھ خودکار مطابقت کریں (Re-sync with text)" [ref=e80]
      - generic [ref=e84]:
        - textbox "تلاش کریں..." [ref=e86]
        - generic [ref=e90]:
          - textbox "نیا قافیہ..." [ref=e91]
          - button "قافیہ شامل کریں" [disabled] [ref=e92]
        - button "تختی کی ترتیبات (Zoom & Marker)" [ref=e95]
        - button "تختی بند کریں" [ref=e97]
    - generic [ref=e100]:
      - generic [ref=e101] [cursor=pointer]:
        - generic [ref=e102]: تحریر
        - button "حذف کریں" [ref=e103]
      - generic [ref=e107] [cursor=pointer]:
        - generic [ref=e108]: تصویر
        - button "حذف کریں" [ref=e109]
      - generic [ref=e113] [cursor=pointer]:
        - generic [ref=e114]: زنجیر
        - button "حذف کریں" [ref=e115]
      - generic [ref=e119] [cursor=pointer]:
        - generic [ref=e120]: تقدیر
        - button "حذف کریں" [ref=e121]
      - generic [ref=e125] [cursor=pointer]:
        - generic [ref=e126]: تدبیر
        - button "حذف کریں" [ref=e127]
      - generic [ref=e131] [cursor=pointer]:
        - generic [ref=e132]: شمشیر
        - button "حذف کریں" [ref=e133]
      - generic [ref=e137] [cursor=pointer]:
        - generic [ref=e138]: جاگیر
        - button "حذف کریں" [ref=e139]
      - generic [ref=e143] [cursor=pointer]:
        - generic [ref=e144]: تعبیر
        - button "حذف کریں" [ref=e145]
  - generic [ref=e149]:
    - generic [ref=e151]:
      - generic [ref=e152]:
        - generic [ref=e153]:
          - generic [ref=e154]:
            - textbox "عنوانِ کلام یا مطلع درج فرمائیں..." [ref=e156]: میرا عنوان S1
            - textbox "شاعر کا نام..." [ref=e161]: میرا نام S1
          - generic [ref=e162]:
            - button "غزل" [ref=e163]
            - button "نظم" [ref=e164]
            - button "رباعی" [ref=e165]
            - button "نثر / مضمون" [ref=e166]
        - generic [ref=e167]:
          - generic [ref=e168]:
            - generic [ref=e171]: بحرِ رمل مثمن محذوف
            - generic [ref=e172]: (فاعلاتن فاعلاتن فاعلاتن فاعلن)
          - generic [ref=e173]:
            - generic [ref=e174]: "ردیف:"
            - generic [ref=e175]: کا
      - generic [ref=e176]:
        - generic [ref=e177]:
          - generic [ref=e178]:
            - generic [ref=e179]:
              - button "دائیں صف بندی (Align Right - معیاری اردو)" [ref=e180]
              - button "درمیانی صف بندی (Couplet / Center Align)" [ref=e182]
              - button "بائیں صف بندی (Align Left - حوالہ جات/انگریزی)" [ref=e184]
              - button "دونوں طرف ہموار (Justify - کتابی و نثری صف بندی)" [ref=e186]
            - generic [ref=e189]:
              - button "جلی (Bold / Ctrl+B)" [ref=e190]
              - button "ترچھا (Italic / Ctrl+I)" [ref=e193]
              - button "خط کشیدہ (Underline / Ctrl+U)" [ref=e196]
              - button "خطِ تنسیخ (Strikethrough)" [ref=e199]
            - generic [ref=e204]:
              - button "بڑی سرخی (Heading 1)" [ref=e205]
              - button "ذیلی سرخی (Heading 2)" [ref=e208]
              - button "اقتباس / حوالہ (Blockquote)" [ref=e211]
              - button "نقاطی فہرست (Bullet List)" [ref=e215]
              - button "عددی فہرست (Numbered List)" [ref=e217]
              - button "خطِ فاصل (Divider Line)" [ref=e221]
          - generic [ref=e224]:
            - button "+ مطلع" [ref=e225]
            - button "+ شعر" [ref=e226]
            - button "+ مقطع" [ref=e227]
        - generic [ref=e228]:
          - generic [ref=e229] [cursor=pointer]:
            - checkbox "نمائشِ تقطیع و اوزان" [checked] [ref=e230]
            - generic [ref=e233]: نمائشِ تقطیع و اوزان
          - button "پچھلا عمل (Undo)" [ref=e235]
          - button "اگلا عمل (Redo)" [disabled] [ref=e239]
          - button "اعراب تختی" [ref=e243]
          - generic [ref=e245]:
            - 'button "صوتی کی بورڈ: آف" [ref=e246]'
            - button "کی بورڈ گائیڈ (نقشہ)" [ref=e250]
      - generic [ref=e254]:
        - generic [ref=e255]: "اعراب و علامات:"
        - generic [ref=e256]:
          - button "ب بَ" [ref=e257]:
            - generic [ref=e258]:
              - text: ب
              - generic [ref=e259]: بَ
          - button "ب بِ" [ref=e260]:
            - generic [ref=e261]:
              - text: ب
              - generic [ref=e262]: بِ
          - button "ب بُ" [ref=e263]:
            - generic [ref=e264]:
              - text: ب
              - generic [ref=e265]: بُ
          - button "ب بّ" [ref=e266]:
            - generic [ref=e267]:
              - text: ب
              - generic [ref=e268]: بّ
          - button "ب بْ" [ref=e269]:
            - generic [ref=e270]:
              - text: ب
              - generic [ref=e271]: بْ
          - button "ب بً" [ref=e272]:
            - generic [ref=e273]:
              - text: ب
              - generic [ref=e274]: بً
          - button "ب بٍ" [ref=e275]:
            - generic [ref=e276]:
              - text: ب
              - generic [ref=e277]: بٍ
          - button "ب بٌ" [ref=e278]:
            - generic [ref=e279]:
              - text: ب
              - generic [ref=e280]: بٌ
          - button "ب بٰ" [ref=e281]:
            - generic [ref=e282]:
              - text: ب
              - generic [ref=e283]: بٰ
          - button "ب بٖ" [ref=e284]:
            - generic [ref=e285]:
              - text: ب
              - generic [ref=e286]: بٖ
          - button "ب بٗ" [ref=e287]:
            - generic [ref=e288]:
              - text: ب
              - generic [ref=e289]: بٗ
          - button "ب بٓ" [ref=e290]:
            - generic [ref=e291]:
              - text: ب
              - generic [ref=e292]: بٓ
          - button "ء" [ref=e293]
          - button "ۂ" [ref=e294]
          - button "ؔ" [ref=e295]
          - button "؏" [ref=e296]
      - generic [ref=e298]:
        - generic [ref=e299]:
          - generic [ref=e300]:
            - generic [ref=e301]:
              - generic [ref=e302]: "1"
              - generic [ref=e303]: پہلا مصرع
            - generic [ref=e304]: 5 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e305]: میرا محفوظ پہلا مصرع S1
          - generic [ref=e306]:
            - generic [ref=e307]:
              - generic [ref=e308]: بحرِ ہزج مسدس اخرم اشتر محذوف
              - generic [ref=e315]:
                - generic [ref=e316]: تلفظ کی تصدیق درکار
                - generic [ref=e320]: 9 ہجے
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
              - status [ref=e327]: "ان الفاظ کے تلفظ کی تصدیق درکار ہے: S، 1۔ خودکار اصلاح روک دی گئی ہے۔"
              - generic [ref=e328]:
                - generic [ref=e329]: میرا ==
                - generic [ref=e330]: محفوظ ==-
                - generic [ref=e331]: پہلا =-
                - generic [ref=e332]: مصرع ==
                - generic [ref=e333]: S ?
            - group [ref=e334]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e335] [cursor=pointer]
            - generic [ref=e336]:
              - generic [ref=e337]:
                - generic [ref=e338]:
                  - generic [ref=e339]: مَفْعُولُن
                  - generic [ref=e340]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e341]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e342]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e343]': =
                - generic [ref=e344]:
                  - generic [ref=e345]: فَاعِلُن
                  - generic [ref=e346]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e347]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e348]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e349]': =
                - generic [ref=e350]:
                  - generic [ref=e351]: فَعُولُن
                  - generic [ref=e352]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e353]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e354]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e355]': =
              - generic [ref=e356]:
                - generic [ref=e357]:
                  - generic [ref=e358]: "مجموعی آہنگ:"
                  - generic [ref=e359]:
                    - generic [ref=e360]: = = =
                    - generic [ref=e361]: = - =
                    - generic [ref=e362]: "- = ="
                - generic [ref=e363]: نامکمل تقطیع — تلفظ کی تصدیق درکار ہے
        - generic [ref=e364]:
          - generic [ref=e365]:
            - generic [ref=e366]:
              - generic [ref=e367]: "2"
              - generic [ref=e368]: دوسرا مصرع
            - generic [ref=e369]: 7 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e370]: کاغذی ہے پیرہن ہر پیکرِ تصویر کا
          - generic [ref=e371]:
            - generic [ref=e372]:
              - generic [ref=e373]:
                - generic [ref=e379]: بحرِ رمل مثمن محذوف
                - generic [ref=e380]: (Bahr-e-Ramal Musamman Mahzoof)
              - generic [ref=e381]:
                - generic [ref=e382]: تقطیع کے مطابق موزوں
                - generic [ref=e387]: 15 ہجے
            - generic [ref=e388]:
              - generic [ref=e389]:
                - generic [ref=e390]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e391]:
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
              - paragraph [ref=e392]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e393] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - generic [ref=e394]:
                - generic [ref=e395]: کاغذی =-=
                - generic [ref=e396]: ہے =
                - generic [ref=e397]: پیرہن =-=
                - generic [ref=e398]: ہر =
                - generic [ref=e399]: پیکرِ =-=
                - generic [ref=e400]: تصویر ==-
                - generic [ref=e401]: کا =
            - group [ref=e402]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e403] [cursor=pointer]
            - generic [ref=e404]:
              - generic [ref=e405]:
                - generic [ref=e406]:
                  - generic [ref=e407]: فَاعِلَاتُن
                  - generic [ref=e408]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e409]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e410]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e411]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e412]': =
                - generic [ref=e413]:
                  - generic [ref=e414]: فَاعِلَاتُن
                  - generic [ref=e415]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e416]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e417]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e418]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e419]': =
                - generic [ref=e420]:
                  - generic [ref=e421]: فَاعِلَاتُن
                  - generic [ref=e422]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e423]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e424]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e425]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e426]': =
                - generic [ref=e427]:
                  - generic [ref=e428]: فَاعِلُن
                  - generic [ref=e429]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e430]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e431]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e432]': =
              - generic [ref=e433]:
                - generic [ref=e434]:
                  - generic [ref=e435]: "مجموعی آہنگ (دائیں تا بائیں):"
                  - generic [ref=e436]:
                    - generic [ref=e437]: = - = =
                    - generic [ref=e438]: = - = =
                    - generic [ref=e439]: = - = =
                    - generic [ref=e440]: = - =
                - generic [ref=e441]:
                  - generic [ref=e442]:
                    - generic [ref=e443]: =
                    - generic [ref=e444]: بلند (Long)
                  - generic [ref=e445]:
                    - generic [ref=e446]: "-"
                    - generic [ref=e447]: کوتاہ (Short)
        - generic [ref=e448]:
          - generic [ref=e450]:
            - generic [ref=e451]: "3"
            - generic [ref=e452]: پہلا مصرع
          - textbox "مصرع تحریر فرمائیں..." [ref=e453]
        - generic [ref=e454]:
          - generic [ref=e455]:
            - generic [ref=e456]:
              - generic [ref=e457]: "4"
              - generic [ref=e458]: دوسرا مصرع
            - generic [ref=e459]: 8 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e460]: کاو کاوِ سخت جانی ہائے تنہائی نہ پوچھ
          - generic [ref=e461]:
            - generic [ref=e462]:
              - generic [ref=e463]: بحرِ رمل مسدس محذوف
              - generic [ref=e470]:
                - generic [ref=e471]: تلفظ کی تصدیق درکار
                - generic [ref=e475]: 12 ہجے
            - generic [ref=e476]:
              - generic [ref=e477]:
                - generic [ref=e478]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e479]:
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
              - paragraph [ref=e480]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e481] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - paragraph [ref=e482]: آخر میں زائد ہجائے کوتاہ
              - status [ref=e483]: "ان الفاظ کے تلفظ کی تصدیق درکار ہے: کاو، کاوِ۔ خودکار اصلاح روک دی گئی ہے۔"
              - generic [ref=e484]:
                - generic [ref=e485]: کاو ?
                - generic [ref=e486]: کاوِ ?
                - generic [ref=e487]: سخت =-
                - generic [ref=e488]: جانی ==
                - generic [ref=e489]: ہائے =-
                - generic [ref=e490]: تنہائی ===
                - generic [ref=e491]: نہ -
                - generic [ref=e492]: پوچھ =-
            - group [ref=e493]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e494] [cursor=pointer]
            - generic [ref=e495]:
              - generic [ref=e496]:
                - generic [ref=e497]:
                  - generic [ref=e498]: فَاعِلَاتُن
                  - generic [ref=e499]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e500]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e501]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e502]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e503]': =
                - generic [ref=e504]:
                  - generic [ref=e505]: فَاعِلَاتُن
                  - generic [ref=e506]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e507]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e508]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e509]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e510]': =
                - generic [ref=e511]:
                  - generic [ref=e512]: فَاعِلُن
                  - generic [ref=e513]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e514]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e515]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e516]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e517]': "-"
              - generic [ref=e518]:
                - generic [ref=e519]:
                  - generic [ref=e520]: "مجموعی آہنگ:"
                  - generic [ref=e521]:
                    - generic [ref=e522]: = - = =
                    - generic [ref=e523]: = - = =
                    - generic [ref=e524]: = - = -
                - generic [ref=e525]: نامکمل تقطیع — تلفظ کی تصدیق درکار ہے
        - generic [ref=e526]:
          - generic [ref=e527]:
            - generic [ref=e528]:
              - generic [ref=e529]: "5"
              - generic [ref=e530]: پہلا مصرع
            - generic [ref=e531]: 9 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e532]: صبح کرنا شام کا لانا ہے جوئے شیر کا
          - generic [ref=e533]:
            - generic [ref=e534]:
              - generic [ref=e535]:
                - generic [ref=e541]: بحرِ رمل مثمن محذوف
                - generic [ref=e542]: (Bahr-e-Ramal Musamman Mahzoof)
              - generic [ref=e543]:
                - generic [ref=e544]: تقطیع کے مطابق موزوں
                - generic [ref=e549]: 15 ہجے
            - generic [ref=e550]:
              - generic [ref=e551]:
                - generic [ref=e552]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e553]:
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
              - paragraph [ref=e554]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e555] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - generic [ref=e556]:
                - generic [ref=e557]: صبح =-
                - generic [ref=e558]: کرنا ==
                - generic [ref=e559]: شام =-
                - generic [ref=e560]: کا =
                - generic [ref=e561]: لانا ==
                - generic [ref=e562]: ہے -
                - generic [ref=e563]: جوئے ==
                - generic [ref=e564]: شیر =-
                - generic [ref=e565]: کا =
            - group [ref=e566]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e567] [cursor=pointer]
            - generic [ref=e568]:
              - generic [ref=e569]:
                - generic [ref=e570]:
                  - generic [ref=e571]: فَاعِلَاتُن
                  - generic [ref=e572]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e573]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e574]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e575]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e576]': =
                - generic [ref=e577]:
                  - generic [ref=e578]: فَاعِلَاتُن
                  - generic [ref=e579]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e580]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e581]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e582]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e583]': =
                - generic [ref=e584]:
                  - generic [ref=e585]: فَاعِلَاتُن
                  - generic [ref=e586]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e587]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e588]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e589]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e590]': =
                - generic [ref=e591]:
                  - generic [ref=e592]: فَاعِلُن
                  - generic [ref=e593]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e594]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e595]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e596]': =
              - generic [ref=e597]:
                - generic [ref=e598]:
                  - generic [ref=e599]: "مجموعی آہنگ (دائیں تا بائیں):"
                  - generic [ref=e600]:
                    - generic [ref=e601]: = - = =
                    - generic [ref=e602]: = - = =
                    - generic [ref=e603]: = - = =
                    - generic [ref=e604]: = - =
                - generic [ref=e605]:
                  - generic [ref=e606]:
                    - generic [ref=e607]: =
                    - generic [ref=e608]: بلند (Long)
                  - generic [ref=e609]:
                    - generic [ref=e610]: "-"
                    - generic [ref=e611]: کوتاہ (Short)
        - generic [ref=e612]:
          - generic [ref=e614]:
            - generic [ref=e615]: "6"
            - generic [ref=e616]: دوسرا مصرع
          - textbox "مصرع تحریر فرمائیں..." [ref=e617]
        - generic [ref=e618]:
          - generic [ref=e619]:
            - generic [ref=e620]:
              - generic [ref=e621]: "7"
              - generic [ref=e622]: پہلا مصرع
            - generic [ref=e623]: 6 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e624]: جذبۂ بے اختیارِ شوق دیکھا چاہیے
          - generic [ref=e625]:
            - generic [ref=e626]:
              - generic [ref=e627]:
                - generic [ref=e633]: بحرِ رمل مثمن محذوف
                - generic [ref=e634]: (Bahr-e-Ramal Musamman Mahzoof)
              - generic [ref=e635]:
                - generic [ref=e636]: تقطیع کے مطابق موزوں
                - generic [ref=e641]: 15 ہجے
            - generic [ref=e642]:
              - generic [ref=e643]:
                - generic [ref=e644]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e645]:
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
              - paragraph [ref=e646]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e647] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - generic [ref=e648]:
                - generic [ref=e649]: جذبۂ =-=
                - generic [ref=e650]: بے =
                - generic [ref=e651]: اختیارِ =-==
                - generic [ref=e652]: شوق =-
                - generic [ref=e653]: دیکھا ==
                - generic [ref=e654]: چاہیے =-=
            - group [ref=e655]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e656] [cursor=pointer]
            - generic [ref=e657]:
              - generic [ref=e658]:
                - generic [ref=e659]:
                  - generic [ref=e660]: فَاعِلَاتُن
                  - generic [ref=e661]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e662]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e663]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e664]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e665]': =
                - generic [ref=e666]:
                  - generic [ref=e667]: فَاعِلَاتُن
                  - generic [ref=e668]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e669]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e670]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e671]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e672]': =
                - generic [ref=e673]:
                  - generic [ref=e674]: فَاعِلَاتُن
                  - generic [ref=e675]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e676]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e677]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e678]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e679]': =
                - generic [ref=e680]:
                  - generic [ref=e681]: فَاعِلُن
                  - generic [ref=e682]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e683]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e684]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e685]': =
              - generic [ref=e686]:
                - generic [ref=e687]:
                  - generic [ref=e688]: "مجموعی آہنگ (دائیں تا بائیں):"
                  - generic [ref=e689]:
                    - generic [ref=e690]: = - = =
                    - generic [ref=e691]: = - = =
                    - generic [ref=e692]: = - = =
                    - generic [ref=e693]: = - =
                - generic [ref=e694]:
                  - generic [ref=e695]:
                    - generic [ref=e696]: =
                    - generic [ref=e697]: بلند (Long)
                  - generic [ref=e698]:
                    - generic [ref=e699]: "-"
                    - generic [ref=e700]: کوتاہ (Short)
        - generic [ref=e701]:
          - generic [ref=e702]:
            - generic [ref=e703]:
              - generic [ref=e704]: "8"
              - generic [ref=e705]: دوسرا مصرع
            - generic [ref=e706]: 8 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e707]: سینۂ شمشیر سے باہر ہے دم شمشیر کا
          - generic [ref=e708]:
            - generic [ref=e709]:
              - generic [ref=e710]:
                - generic [ref=e716]: بحرِ رمل مثمن محذوف
                - generic [ref=e717]: (Bahr-e-Ramal Musamman Mahzoof)
              - generic [ref=e718]:
                - generic [ref=e719]: تقطیع کے مطابق موزوں
                - generic [ref=e724]: 15 ہجے
            - generic [ref=e725]:
              - generic [ref=e726]:
                - generic [ref=e727]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e728]:
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
              - paragraph [ref=e729]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e730] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - generic [ref=e731]:
                - generic [ref=e732]: سینۂ =-=
                - generic [ref=e733]: شمشیر ==-
                - generic [ref=e734]: سے =
                - generic [ref=e735]: باہر ==
                - generic [ref=e736]: ہے -
                - generic [ref=e737]: دم =
                - generic [ref=e738]: شمشیر ==-
                - generic [ref=e739]: کا =
            - group [ref=e740]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e741] [cursor=pointer]
            - generic [ref=e742]:
              - generic [ref=e743]:
                - generic [ref=e744]:
                  - generic [ref=e745]: فَاعِلَاتُن
                  - generic [ref=e746]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e747]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e748]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e749]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e750]': =
                - generic [ref=e751]:
                  - generic [ref=e752]: فَاعِلَاتُن
                  - generic [ref=e753]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e754]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e755]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e756]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e757]': =
                - generic [ref=e758]:
                  - generic [ref=e759]: فَاعِلَاتُن
                  - generic [ref=e760]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e761]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e762]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e763]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e764]': =
                - generic [ref=e765]:
                  - generic [ref=e766]: فَاعِلُن
                  - generic [ref=e767]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e768]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e769]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e770]': =
              - generic [ref=e771]:
                - generic [ref=e772]:
                  - generic [ref=e773]: "مجموعی آہنگ (دائیں تا بائیں):"
                  - generic [ref=e774]:
                    - generic [ref=e775]: = - = =
                    - generic [ref=e776]: = - = =
                    - generic [ref=e777]: = - = =
                    - generic [ref=e778]: = - =
                - generic [ref=e779]:
                  - generic [ref=e780]:
                    - generic [ref=e781]: =
                    - generic [ref=e782]: بلند (Long)
                  - generic [ref=e783]:
                    - generic [ref=e784]: "-"
                    - generic [ref=e785]: کوتاہ (Short)
        - generic [ref=e786]:
          - generic [ref=e788]:
            - generic [ref=e789]: "9"
            - generic [ref=e790]: پہلا مصرع
          - textbox "مصرع تحریر فرمائیں..." [ref=e791]
        - generic [ref=e792]:
          - generic [ref=e793]:
            - generic [ref=e794]:
              - generic [ref=e795]: "10"
              - generic [ref=e796]: دوسرا مصرع
            - generic [ref=e797]: 7 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e798]: آگہی دامِ شنیدن جس قدر چاہے بچھائے
          - generic [ref=e799]:
            - generic [ref=e800]:
              - generic [ref=e801]: بحرِ متدارک مثمن سالم
              - generic [ref=e808]:
                - generic [ref=e809]: تلفظ کی تصدیق درکار
                - generic [ref=e813]: 13 ہجے
            - generic [ref=e814]:
              - generic [ref=e815]:
                - generic [ref=e816]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e817]:
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
              - paragraph [ref=e818]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e819] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - paragraph [ref=e820]: آخر میں زائد ہجائے کوتاہ
              - status [ref=e821]: "ان الفاظ کے تلفظ کی تصدیق درکار ہے: شنیدن۔ خودکار اصلاح روک دی گئی ہے۔"
              - generic [ref=e822]:
                - generic [ref=e823]: آگہی =-=
                - generic [ref=e824]: دامِ =-
                - generic [ref=e825]: شنیدن ?
                - generic [ref=e826]: جس =
                - generic [ref=e827]: قدر =-
                - generic [ref=e828]: چاہے ==
                - generic [ref=e829]: بچھائے -=-
            - group [ref=e830]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e831] [cursor=pointer]
            - generic [ref=e832]:
              - generic [ref=e833]:
                - generic [ref=e834]:
                  - generic [ref=e835]: فَاعِلُن
                  - generic [ref=e836]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e837]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e838]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e839]': =
                - generic [ref=e840]:
                  - generic [ref=e841]: فَاعِلُن
                  - generic [ref=e842]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e843]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e844]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e845]': =
                - generic [ref=e846]:
                  - generic [ref=e847]: فَاعِلُن
                  - generic [ref=e848]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e849]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e850]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e851]': =
                - generic [ref=e852]:
                  - generic [ref=e853]: فَاعِلُن
                  - generic [ref=e854]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e855]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e856]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e857]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e858]': "-"
              - generic [ref=e859]:
                - generic [ref=e860]:
                  - generic [ref=e861]: "مجموعی آہنگ:"
                  - generic [ref=e862]:
                    - generic [ref=e863]: = - =
                    - generic [ref=e864]: = - =
                    - generic [ref=e865]: = - =
                    - generic [ref=e866]: = - = -
                - generic [ref=e867]: نامکمل تقطیع — تلفظ کی تصدیق درکار ہے
        - generic [ref=e868]:
          - generic [ref=e869]:
            - generic [ref=e870]:
              - generic [ref=e871]: "11"
              - generic [ref=e872]: پہلا مصرع
            - generic [ref=e873]: 7 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e874]: مدعا عنقا ہے اپنے عالمِ تقریر کا
          - generic [ref=e875]:
            - generic [ref=e876]:
              - generic [ref=e877]:
                - generic [ref=e883]: بحرِ رمل مثمن محذوف
                - generic [ref=e884]: (Bahr-e-Ramal Musamman Mahzoof)
              - generic [ref=e885]:
                - generic [ref=e886]: تقطیع کے مطابق موزوں
                - generic [ref=e891]: 15 ہجے
            - generic [ref=e892]:
              - generic [ref=e893]:
                - generic [ref=e894]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e895]:
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
              - paragraph [ref=e896]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e897] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - generic [ref=e898]:
                - generic [ref=e899]: مدعا =-=
                - generic [ref=e900]: عنقا ==
                - generic [ref=e901]: ہے -
                - generic [ref=e902]: اپنے ==
                - generic [ref=e903]: عالمِ =-=
                - generic [ref=e904]: تقریر ==-
                - generic [ref=e905]: کا =
            - group [ref=e906]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e907] [cursor=pointer]
            - generic [ref=e908]:
              - generic [ref=e909]:
                - generic [ref=e910]:
                  - generic [ref=e911]: فَاعِلَاتُن
                  - generic [ref=e912]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e913]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e914]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e915]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e916]': =
                - generic [ref=e917]:
                  - generic [ref=e918]: فَاعِلَاتُن
                  - generic [ref=e919]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e920]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e921]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e922]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e923]': =
                - generic [ref=e924]:
                  - generic [ref=e925]: فَاعِلَاتُن
                  - generic [ref=e926]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e927]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e928]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e929]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e930]': =
                - generic [ref=e931]:
                  - generic [ref=e932]: فَاعِلُن
                  - generic [ref=e933]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e934]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e935]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e936]': =
              - generic [ref=e937]:
                - generic [ref=e938]:
                  - generic [ref=e939]: "مجموعی آہنگ (دائیں تا بائیں):"
                  - generic [ref=e940]:
                    - generic [ref=e941]: = - = =
                    - generic [ref=e942]: = - = =
                    - generic [ref=e943]: = - = =
                    - generic [ref=e944]: = - =
                - generic [ref=e945]:
                  - generic [ref=e946]:
                    - generic [ref=e947]: =
                    - generic [ref=e948]: بلند (Long)
                  - generic [ref=e949]:
                    - generic [ref=e950]: "-"
                    - generic [ref=e951]: کوتاہ (Short)
        - generic [ref=e952]:
          - generic [ref=e954]:
            - generic [ref=e955]: "12"
            - generic [ref=e956]: دوسرا مصرع
          - textbox "مصرع تحریر فرمائیں..." [ref=e957]
        - generic [ref=e958]:
          - generic [ref=e959]:
            - generic [ref=e960]:
              - generic [ref=e961]: "13"
              - generic [ref=e962]: پہلا مصرع
            - generic [ref=e963]: 9 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e964]: بسکہ ہوں غالب اسیری میں بھی آتش زیرِ پا
          - generic [ref=e965]:
            - generic [ref=e966]:
              - generic [ref=e967]: رباعی — ہزج مثمن اخرب مکفوف مجبوب
              - generic [ref=e974]:
                - generic [ref=e975]: تلفظ کی تصدیق درکار
                - generic [ref=e979]: 13 ہجے
                - button "اصلاحِ بحر" [ref=e980]
            - generic [ref=e986]:
              - generic [ref=e987]:
                - generic [ref=e988]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e989]:
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
              - paragraph [ref=e990]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e991] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - status [ref=e992]: "ان الفاظ کے تلفظ کی تصدیق درکار ہے: بسکہ۔ خودکار اصلاح روک دی گئی ہے۔"
              - generic [ref=e993]:
                - generic [ref=e994]: بسکہ ?
                - generic [ref=e995]: ہوں =
                - generic [ref=e996]: غالب =-
                - generic [ref=e997]: اسیری -==
                - generic [ref=e998]: میں -
                - generic [ref=e999]: بھی -
                - generic [ref=e1000]: آتش ==
                - generic [ref=e1001]: زیرِ =-
                - generic [ref=e1002]: پا =
            - group [ref=e1003]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e1004] [cursor=pointer]
            - generic [ref=e1005]:
              - generic [ref=e1006]:
                - generic [ref=e1007]:
                  - generic [ref=e1008]: مَفْعُولُ
                  - generic [ref=e1009]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e1010]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e1011]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e1012]': "-"
                - generic [ref=e1013]:
                  - generic [ref=e1014]: مَفَاعِیلُ
                  - generic [ref=e1015]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e1016]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e1017]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e1018]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e1019]': "-"
                - generic [ref=e1020]:
                  - generic [ref=e1021]: مَفَاعِیلُ
                  - generic [ref=e1022]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e1023]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e1024]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e1025]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e1026]': =
                - generic [ref=e1027]:
                  - generic [ref=e1028]: فَعَلْ
                  - generic [ref=e1029]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e1030]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e1031]': =
              - generic [ref=e1032]:
                - generic [ref=e1033]:
                  - generic [ref=e1034]: "مجموعی آہنگ:"
                  - generic [ref=e1035]:
                    - generic [ref=e1036]: = = -
                    - generic [ref=e1037]: "- = = -"
                    - generic [ref=e1038]: "- = = ="
                    - generic [ref=e1039]: "- ="
                - generic [ref=e1040]: نامکمل تقطیع — تلفظ کی تصدیق درکار ہے
        - generic [ref=e1041]:
          - generic [ref=e1042]:
            - generic [ref=e1043]:
              - generic [ref=e1044]: "14"
              - generic [ref=e1045]: دوسرا مصرع
            - generic [ref=e1046]: 8 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e1047]: موئے آتش دیدہ ہے حلقہ مری زنجیر کا
          - generic [ref=e1048]:
            - generic [ref=e1049]:
              - generic [ref=e1050]:
                - generic [ref=e1056]: بحرِ رمل مثمن محذوف
                - generic [ref=e1057]: (Bahr-e-Ramal Musamman Mahzoof)
              - generic [ref=e1058]:
                - generic [ref=e1059]: تقطیع کے مطابق موزوں
                - generic [ref=e1064]: 15 ہجے
            - generic [ref=e1065]:
              - generic [ref=e1066]:
                - generic [ref=e1067]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e1068]:
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
              - paragraph [ref=e1069]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e1070] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - generic [ref=e1071]:
                - generic [ref=e1072]: موئے =-
                - generic [ref=e1073]: آتش ==
                - generic [ref=e1074]: دیدہ =-
                - generic [ref=e1075]: ہے =
                - generic [ref=e1076]: حلقہ ==
                - generic [ref=e1077]: مری -=
                - generic [ref=e1078]: زنجیر ==-
                - generic [ref=e1079]: کا =
            - group [ref=e1080]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e1081] [cursor=pointer]
            - generic [ref=e1082]:
              - generic [ref=e1083]:
                - generic [ref=e1084]:
                  - generic [ref=e1085]: فَاعِلَاتُن
                  - generic [ref=e1086]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1087]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e1088]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1089]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1090]': =
                - generic [ref=e1091]:
                  - generic [ref=e1092]: فَاعِلَاتُن
                  - generic [ref=e1093]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1094]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e1095]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1096]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1097]': =
                - generic [ref=e1098]:
                  - generic [ref=e1099]: فَاعِلَاتُن
                  - generic [ref=e1100]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1101]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e1102]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1103]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1104]': =
                - generic [ref=e1105]:
                  - generic [ref=e1106]: فَاعِلُن
                  - generic [ref=e1107]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1108]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e1109]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1110]': =
              - generic [ref=e1111]:
                - generic [ref=e1112]:
                  - generic [ref=e1113]: "مجموعی آہنگ (دائیں تا بائیں):"
                  - generic [ref=e1114]:
                    - generic [ref=e1115]: = - = =
                    - generic [ref=e1116]: = - = =
                    - generic [ref=e1117]: = - = =
                    - generic [ref=e1118]: = - =
                - generic [ref=e1119]:
                  - generic [ref=e1120]:
                    - generic [ref=e1121]: =
                    - generic [ref=e1122]: بلند (Long)
                  - generic [ref=e1123]:
                    - generic [ref=e1124]: "-"
                    - generic [ref=e1125]: کوتاہ (Short)
        - button "نیا مصرع شامل کریں" [ref=e1127]
      - generic [ref=e1130]:
        - generic [ref=e1131]:
          - generic [ref=e1132]:
            - generic [ref=e1133]: "5"
            - generic [ref=e1134]: اشعار
          - generic [ref=e1135]:
            - generic [ref=e1136]: "10"
            - generic [ref=e1137]: مصرعے
          - generic [ref=e1138]:
            - generic [ref=e1139]: "74"
            - generic [ref=e1140]: الفاظ
          - generic [ref=e1141]:
            - generic [ref=e1142]: "267"
            - generic [ref=e1143]: حروف
        - generic [ref=e1144]: کسی بھی لفظ کو منتخب کر کے لغت و مترادفات ملاحظہ فرمائیں
    - separator "کھینچ کر چوڑائی تبدیل کریں (Drag to resize)" [ref=e1149]
    - generic [ref=e1153]:
      - generic [ref=e1154]:
        - generic [ref=e1155]:
          - generic [ref=e1156]: ادبی معاون (Literary Companion)
          - button "پینل بند کریں" [ref=e1160]
        - generic [ref=e1164]:
          - button "خزانہ قوافی" [ref=e1165]
          - button "علمِ عروض" [ref=e1171]
          - button "لغت و الفاظ" [ref=e1177]
          - button "صنائع بدائع" [ref=e1182]
          - button "دیوانِ کلام" [active] [ref=e1187]
      - generic [ref=e1192]:
        - generic [ref=e1193]:
          - textbox "مسودات میں تلاش کریں..." [ref=e1195]
          - generic [ref=e1199]:
            - generic [ref=e1200]:
              - text: "کل کلام:"
              - strong [ref=e1201]: "1"
            - generic [ref=e1202]:
              - button "بیک اپ" [ref=e1203]
              - generic "بیک اپ فائل بحال کریں" [ref=e1208] [cursor=pointer]: بحالی
        - generic [ref=e1214] [cursor=pointer]:
          - generic [ref=e1215]:
            - generic [ref=e1216]:
              - heading "نقش فریادی ہے کس کی شوخیِ تحریر کا" [level=4] [ref=e1217]
              - generic [ref=e1218]: "شاعر: مرزا اسد اللہ خان غالب"
            - button "مسودہ حذف کریں" [ref=e1223]
          - paragraph [ref=e1227]: نقش فریادی ہے کس کی شوخیِ تحریر کا
          - generic [ref=e1228]:
            - generic [ref=e1229]: 29 اکتوبر، 2026
            - generic [ref=e1234]: بحرِ رمل مثمن محذوف
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test';
  2   | const key = 'qalam_drafts_v1';
  3   | const draft = (id = 'ordinary-a') => ({ id, title: `عنوان ${id}`, poet: 'شاعر آزمائش', form: 'ghazal', tags: [], createdAt: 1, updatedAt: 1, qafiyaList: [], content: 'مرا دل مرا دل\nمرا دل مرا دل' });
  4   | async function boot(page: Page, raw?: string) {
  5   |   await page.addInitScript(({ key, raw }) => {
  6   |     if (!sessionStorage.getItem('draft-safety-seeded')) {
  7   |       localStorage.clear();
  8   |       if (raw !== undefined) localStorage.setItem(key, raw);
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
> 46  |     await expect.poll(() => rawStore(page)).toContain('میرا محفوظ پہلا مصرع S1');
      |                                             ^ Error: expect(received).toContain(expected) // indexOf
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
  140 |     expect(recovery).toBe(true);
  141 |   });
  142 |   test('S13 dirty navigation warns before leaving', async ({ page }) => {
  143 |     await boot(page, JSON.stringify([draft()]));
  144 |     let warned = false;
  145 |     page.on('dialog', async dialog => { if (dialog.type() === 'beforeunload') warned = true; await dialog.dismiss(); });
  146 |     await page.locator('#misra-input-0').fill('لمحاتی تبدیلی S13');
```