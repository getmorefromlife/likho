# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: draft-safety.spec.ts >> LKH-002 preservation >> S8 unreadable/invalid storage remains byte-for-byte intact after an edit
- Location: tests/e2e/draft-safety.spec.ts:86:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "{unreadable-original-S8"
Received: "[{\"id\":\"draft-initial-ghalib\",\"title\":\"جلسے کا عنوان S8\",\"poet\":\"مرزا اسد اللہ خان غالب\",\"form\":\"ghazal\",\"meterName\":\"بحرِ رمل مثمن محذوف\",\"meterRukn\":\"فاعلاتن فاعلاتن فاعلاتن فاعلن\",\"radif\":\"کا\",\"tags\":[\"کلاسیکی\",\"غزل\",\"معرفت\"],\"createdAt\":1793174785845,\"updatedAt\":1793261188535,\"qafiyaList\":[\"تحریر\",\"تصویر\",\"زنجیر\",\"تقدیر\",\"تدبیر\",\"شمشیر\",\"جاگیر\",\"تعبیر\"],\"content\":\"نقش فریادی ہے کس کی شوخیِ تحریر کا\\nکاغذی ہے پیرہن ہر پیکرِ تصویر کا\\n\\nکاو کاوِ سخت جانی ہائے تنہائی نہ پوچھ\\nصبح کرنا شام کا لانا ہے جوئے شیر کا\\n\\nجذبۂ بے اختیارِ شوق دیکھا چاہیے\\nسینۂ شمشیر سے باہر ہے دم شمشیر کا\\n\\nآگہی دامِ شنیدن جس قدر چاہے بچھائے\\nمدعا عنقا ہے اپنے عالمِ تقریر کا\\n\\nبسکہ ہوں غالب اسیری میں بھی آتش زیرِ پا\\nموئے آتش دیدہ ہے حلقہ مری زنجیر کا\"}]"
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
          - generic [ref=e76]: "4"
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
            - textbox "عنوانِ کلام یا مطلع درج فرمائیں..." [active] [ref=e156]: جلسے کا عنوان S8
            - textbox "شاعر کا نام..." [ref=e161]: مرزا اسد اللہ خان غالب
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
          - button "پچھلا عمل (Undo)" [disabled] [ref=e235]
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
            - generic [ref=e304]: 8 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e305]: نقش فریادی ہے کس کی شوخیِ تحریر کا
          - generic [ref=e306]:
            - generic [ref=e307]:
              - generic [ref=e308]:
                - generic [ref=e314]: بحرِ رمل مثمن محذوف
                - generic [ref=e315]: (Bahr-e-Ramal Musamman Mahzoof)
              - generic [ref=e316]:
                - generic [ref=e317]: تقطیع کے مطابق موزوں
                - generic [ref=e322]: 15 ہجے
            - generic [ref=e323]:
              - generic [ref=e324]:
                - generic [ref=e325]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e326]:
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
              - paragraph [ref=e327]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e328] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - generic [ref=e329]:
                - generic [ref=e330]: نقش =-
                - generic [ref=e331]: فریادی ===
                - generic [ref=e332]: ہے -
                - generic [ref=e333]: کس =
                - generic [ref=e334]: کی =
                - generic [ref=e335]: شوخیِ =-=
                - generic [ref=e336]: تحریر ==-
                - generic [ref=e337]: کا =
            - group [ref=e338]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e339] [cursor=pointer]
            - generic [ref=e340]:
              - generic [ref=e341]:
                - generic [ref=e342]:
                  - generic [ref=e343]: فَاعِلَاتُن
                  - generic [ref=e344]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e345]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e346]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e347]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e348]': =
                - generic [ref=e349]:
                  - generic [ref=e350]: فَاعِلَاتُن
                  - generic [ref=e351]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e352]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e353]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e354]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e355]': =
                - generic [ref=e356]:
                  - generic [ref=e357]: فَاعِلَاتُن
                  - generic [ref=e358]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e359]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e360]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e361]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e362]': =
                - generic [ref=e363]:
                  - generic [ref=e364]: فَاعِلُن
                  - generic [ref=e365]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e366]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e367]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e368]': =
              - generic [ref=e369]:
                - generic [ref=e370]:
                  - generic [ref=e371]: "مجموعی آہنگ (دائیں تا بائیں):"
                  - generic [ref=e372]:
                    - generic [ref=e373]: = - = =
                    - generic [ref=e374]: = - = =
                    - generic [ref=e375]: = - = =
                    - generic [ref=e376]: = - =
                - generic [ref=e377]:
                  - generic [ref=e378]:
                    - generic [ref=e379]: =
                    - generic [ref=e380]: بلند (Long)
                  - generic [ref=e381]:
                    - generic [ref=e382]: "-"
                    - generic [ref=e383]: کوتاہ (Short)
        - generic [ref=e384]:
          - generic [ref=e385]:
            - generic [ref=e386]:
              - generic [ref=e387]: "2"
              - generic [ref=e388]: دوسرا مصرع
            - generic [ref=e389]: 7 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e390]: کاغذی ہے پیرہن ہر پیکرِ تصویر کا
          - generic [ref=e391]:
            - generic [ref=e392]:
              - generic [ref=e393]:
                - generic [ref=e399]: بحرِ رمل مثمن محذوف
                - generic [ref=e400]: (Bahr-e-Ramal Musamman Mahzoof)
              - generic [ref=e401]:
                - generic [ref=e402]: تقطیع کے مطابق موزوں
                - generic [ref=e407]: 15 ہجے
            - generic [ref=e408]:
              - generic [ref=e409]:
                - generic [ref=e410]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e411]:
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
              - paragraph [ref=e412]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e413] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - generic [ref=e414]:
                - generic [ref=e415]: کاغذی =-=
                - generic [ref=e416]: ہے =
                - generic [ref=e417]: پیرہن =-=
                - generic [ref=e418]: ہر =
                - generic [ref=e419]: پیکرِ =-=
                - generic [ref=e420]: تصویر ==-
                - generic [ref=e421]: کا =
            - group [ref=e422]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e423] [cursor=pointer]
            - generic [ref=e424]:
              - generic [ref=e425]:
                - generic [ref=e426]:
                  - generic [ref=e427]: فَاعِلَاتُن
                  - generic [ref=e428]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e429]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e430]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e431]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e432]': =
                - generic [ref=e433]:
                  - generic [ref=e434]: فَاعِلَاتُن
                  - generic [ref=e435]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e436]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e437]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e438]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e439]': =
                - generic [ref=e440]:
                  - generic [ref=e441]: فَاعِلَاتُن
                  - generic [ref=e442]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e443]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e444]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e445]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e446]': =
                - generic [ref=e447]:
                  - generic [ref=e448]: فَاعِلُن
                  - generic [ref=e449]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e450]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e451]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e452]': =
              - generic [ref=e453]:
                - generic [ref=e454]:
                  - generic [ref=e455]: "مجموعی آہنگ (دائیں تا بائیں):"
                  - generic [ref=e456]:
                    - generic [ref=e457]: = - = =
                    - generic [ref=e458]: = - = =
                    - generic [ref=e459]: = - = =
                    - generic [ref=e460]: = - =
                - generic [ref=e461]:
                  - generic [ref=e462]:
                    - generic [ref=e463]: =
                    - generic [ref=e464]: بلند (Long)
                  - generic [ref=e465]:
                    - generic [ref=e466]: "-"
                    - generic [ref=e467]: کوتاہ (Short)
        - generic [ref=e468]:
          - generic [ref=e470]:
            - generic [ref=e471]: "3"
            - generic [ref=e472]: پہلا مصرع
          - textbox "مصرع تحریر فرمائیں..." [ref=e473]
        - generic [ref=e474]:
          - generic [ref=e475]:
            - generic [ref=e476]:
              - generic [ref=e477]: "4"
              - generic [ref=e478]: دوسرا مصرع
            - generic [ref=e479]: 8 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e480]: کاو کاوِ سخت جانی ہائے تنہائی نہ پوچھ
          - generic [ref=e481]:
            - generic [ref=e482]:
              - generic [ref=e483]: بحرِ رمل مسدس محذوف
              - generic [ref=e490]:
                - generic [ref=e491]: تلفظ کی تصدیق درکار
                - generic [ref=e495]: 12 ہجے
            - generic [ref=e496]:
              - generic [ref=e497]:
                - generic [ref=e498]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e499]:
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
              - paragraph [ref=e500]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e501] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - paragraph [ref=e502]: آخر میں زائد ہجائے کوتاہ
              - status [ref=e503]: "ان الفاظ کے تلفظ کی تصدیق درکار ہے: کاو، کاوِ۔ خودکار اصلاح روک دی گئی ہے۔"
              - generic [ref=e504]:
                - generic [ref=e505]: کاو ?
                - generic [ref=e506]: کاوِ ?
                - generic [ref=e507]: سخت =-
                - generic [ref=e508]: جانی ==
                - generic [ref=e509]: ہائے =-
                - generic [ref=e510]: تنہائی ===
                - generic [ref=e511]: نہ -
                - generic [ref=e512]: پوچھ =-
            - group [ref=e513]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e514] [cursor=pointer]
            - generic [ref=e515]:
              - generic [ref=e516]:
                - generic [ref=e517]:
                  - generic [ref=e518]: فَاعِلَاتُن
                  - generic [ref=e519]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e520]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e521]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e522]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e523]': =
                - generic [ref=e524]:
                  - generic [ref=e525]: فَاعِلَاتُن
                  - generic [ref=e526]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e527]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e528]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e529]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e530]': =
                - generic [ref=e531]:
                  - generic [ref=e532]: فَاعِلُن
                  - generic [ref=e533]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e534]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e535]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e536]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e537]': "-"
              - generic [ref=e538]:
                - generic [ref=e539]:
                  - generic [ref=e540]: "مجموعی آہنگ:"
                  - generic [ref=e541]:
                    - generic [ref=e542]: = - = =
                    - generic [ref=e543]: = - = =
                    - generic [ref=e544]: = - = -
                - generic [ref=e545]: نامکمل تقطیع — تلفظ کی تصدیق درکار ہے
        - generic [ref=e546]:
          - generic [ref=e547]:
            - generic [ref=e548]:
              - generic [ref=e549]: "5"
              - generic [ref=e550]: پہلا مصرع
            - generic [ref=e551]: 9 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e552]: صبح کرنا شام کا لانا ہے جوئے شیر کا
          - generic [ref=e553]:
            - generic [ref=e554]:
              - generic [ref=e555]:
                - generic [ref=e561]: بحرِ رمل مثمن محذوف
                - generic [ref=e562]: (Bahr-e-Ramal Musamman Mahzoof)
              - generic [ref=e563]:
                - generic [ref=e564]: تقطیع کے مطابق موزوں
                - generic [ref=e569]: 15 ہجے
            - generic [ref=e570]:
              - generic [ref=e571]:
                - generic [ref=e572]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e573]:
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
              - paragraph [ref=e574]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e575] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - generic [ref=e576]:
                - generic [ref=e577]: صبح =-
                - generic [ref=e578]: کرنا ==
                - generic [ref=e579]: شام =-
                - generic [ref=e580]: کا =
                - generic [ref=e581]: لانا ==
                - generic [ref=e582]: ہے -
                - generic [ref=e583]: جوئے ==
                - generic [ref=e584]: شیر =-
                - generic [ref=e585]: کا =
            - group [ref=e586]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e587] [cursor=pointer]
            - generic [ref=e588]:
              - generic [ref=e589]:
                - generic [ref=e590]:
                  - generic [ref=e591]: فَاعِلَاتُن
                  - generic [ref=e592]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e593]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e594]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e595]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e596]': =
                - generic [ref=e597]:
                  - generic [ref=e598]: فَاعِلَاتُن
                  - generic [ref=e599]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e600]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e601]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e602]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e603]': =
                - generic [ref=e604]:
                  - generic [ref=e605]: فَاعِلَاتُن
                  - generic [ref=e606]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e607]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e608]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e609]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e610]': =
                - generic [ref=e611]:
                  - generic [ref=e612]: فَاعِلُن
                  - generic [ref=e613]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e614]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e615]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e616]': =
              - generic [ref=e617]:
                - generic [ref=e618]:
                  - generic [ref=e619]: "مجموعی آہنگ (دائیں تا بائیں):"
                  - generic [ref=e620]:
                    - generic [ref=e621]: = - = =
                    - generic [ref=e622]: = - = =
                    - generic [ref=e623]: = - = =
                    - generic [ref=e624]: = - =
                - generic [ref=e625]:
                  - generic [ref=e626]:
                    - generic [ref=e627]: =
                    - generic [ref=e628]: بلند (Long)
                  - generic [ref=e629]:
                    - generic [ref=e630]: "-"
                    - generic [ref=e631]: کوتاہ (Short)
        - generic [ref=e632]:
          - generic [ref=e634]:
            - generic [ref=e635]: "6"
            - generic [ref=e636]: دوسرا مصرع
          - textbox "مصرع تحریر فرمائیں..." [ref=e637]
        - generic [ref=e638]:
          - generic [ref=e639]:
            - generic [ref=e640]:
              - generic [ref=e641]: "7"
              - generic [ref=e642]: پہلا مصرع
            - generic [ref=e643]: 6 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e644]: جذبۂ بے اختیارِ شوق دیکھا چاہیے
          - generic [ref=e645]:
            - generic [ref=e646]:
              - generic [ref=e647]:
                - generic [ref=e653]: بحرِ رمل مثمن محذوف
                - generic [ref=e654]: (Bahr-e-Ramal Musamman Mahzoof)
              - generic [ref=e655]:
                - generic [ref=e656]: تقطیع کے مطابق موزوں
                - generic [ref=e661]: 15 ہجے
            - generic [ref=e662]:
              - generic [ref=e663]:
                - generic [ref=e664]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e665]:
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
              - paragraph [ref=e666]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e667] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - generic [ref=e668]:
                - generic [ref=e669]: جذبۂ =-=
                - generic [ref=e670]: بے =
                - generic [ref=e671]: اختیارِ =-==
                - generic [ref=e672]: شوق =-
                - generic [ref=e673]: دیکھا ==
                - generic [ref=e674]: چاہیے =-=
            - group [ref=e675]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e676] [cursor=pointer]
            - generic [ref=e677]:
              - generic [ref=e678]:
                - generic [ref=e679]:
                  - generic [ref=e680]: فَاعِلَاتُن
                  - generic [ref=e681]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e682]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e683]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e684]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e685]': =
                - generic [ref=e686]:
                  - generic [ref=e687]: فَاعِلَاتُن
                  - generic [ref=e688]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e689]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e690]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e691]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e692]': =
                - generic [ref=e693]:
                  - generic [ref=e694]: فَاعِلَاتُن
                  - generic [ref=e695]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e696]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e697]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e698]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e699]': =
                - generic [ref=e700]:
                  - generic [ref=e701]: فَاعِلُن
                  - generic [ref=e702]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e703]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e704]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e705]': =
              - generic [ref=e706]:
                - generic [ref=e707]:
                  - generic [ref=e708]: "مجموعی آہنگ (دائیں تا بائیں):"
                  - generic [ref=e709]:
                    - generic [ref=e710]: = - = =
                    - generic [ref=e711]: = - = =
                    - generic [ref=e712]: = - = =
                    - generic [ref=e713]: = - =
                - generic [ref=e714]:
                  - generic [ref=e715]:
                    - generic [ref=e716]: =
                    - generic [ref=e717]: بلند (Long)
                  - generic [ref=e718]:
                    - generic [ref=e719]: "-"
                    - generic [ref=e720]: کوتاہ (Short)
        - generic [ref=e721]:
          - generic [ref=e722]:
            - generic [ref=e723]:
              - generic [ref=e724]: "8"
              - generic [ref=e725]: دوسرا مصرع
            - generic [ref=e726]: 8 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e727]: سینۂ شمشیر سے باہر ہے دم شمشیر کا
          - generic [ref=e728]:
            - generic [ref=e729]:
              - generic [ref=e730]:
                - generic [ref=e736]: بحرِ رمل مثمن محذوف
                - generic [ref=e737]: (Bahr-e-Ramal Musamman Mahzoof)
              - generic [ref=e738]:
                - generic [ref=e739]: تقطیع کے مطابق موزوں
                - generic [ref=e744]: 15 ہجے
            - generic [ref=e745]:
              - generic [ref=e746]:
                - generic [ref=e747]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e748]:
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
              - paragraph [ref=e749]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e750] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - generic [ref=e751]:
                - generic [ref=e752]: سینۂ =-=
                - generic [ref=e753]: شمشیر ==-
                - generic [ref=e754]: سے =
                - generic [ref=e755]: باہر ==
                - generic [ref=e756]: ہے -
                - generic [ref=e757]: دم =
                - generic [ref=e758]: شمشیر ==-
                - generic [ref=e759]: کا =
            - group [ref=e760]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e761] [cursor=pointer]
            - generic [ref=e762]:
              - generic [ref=e763]:
                - generic [ref=e764]:
                  - generic [ref=e765]: فَاعِلَاتُن
                  - generic [ref=e766]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e767]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e768]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e769]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e770]': =
                - generic [ref=e771]:
                  - generic [ref=e772]: فَاعِلَاتُن
                  - generic [ref=e773]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e774]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e775]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e776]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e777]': =
                - generic [ref=e778]:
                  - generic [ref=e779]: فَاعِلَاتُن
                  - generic [ref=e780]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e781]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e782]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e783]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e784]': =
                - generic [ref=e785]:
                  - generic [ref=e786]: فَاعِلُن
                  - generic [ref=e787]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e788]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e789]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e790]': =
              - generic [ref=e791]:
                - generic [ref=e792]:
                  - generic [ref=e793]: "مجموعی آہنگ (دائیں تا بائیں):"
                  - generic [ref=e794]:
                    - generic [ref=e795]: = - = =
                    - generic [ref=e796]: = - = =
                    - generic [ref=e797]: = - = =
                    - generic [ref=e798]: = - =
                - generic [ref=e799]:
                  - generic [ref=e800]:
                    - generic [ref=e801]: =
                    - generic [ref=e802]: بلند (Long)
                  - generic [ref=e803]:
                    - generic [ref=e804]: "-"
                    - generic [ref=e805]: کوتاہ (Short)
        - generic [ref=e806]:
          - generic [ref=e808]:
            - generic [ref=e809]: "9"
            - generic [ref=e810]: پہلا مصرع
          - textbox "مصرع تحریر فرمائیں..." [ref=e811]
        - generic [ref=e812]:
          - generic [ref=e813]:
            - generic [ref=e814]:
              - generic [ref=e815]: "10"
              - generic [ref=e816]: دوسرا مصرع
            - generic [ref=e817]: 7 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e818]: آگہی دامِ شنیدن جس قدر چاہے بچھائے
          - generic [ref=e819]:
            - generic [ref=e820]:
              - generic [ref=e821]: بحرِ متدارک مثمن سالم
              - generic [ref=e828]:
                - generic [ref=e829]: تلفظ کی تصدیق درکار
                - generic [ref=e833]: 13 ہجے
            - generic [ref=e834]:
              - generic [ref=e835]:
                - generic [ref=e836]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e837]:
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
              - paragraph [ref=e838]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e839] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - paragraph [ref=e840]: آخر میں زائد ہجائے کوتاہ
              - status [ref=e841]: "ان الفاظ کے تلفظ کی تصدیق درکار ہے: شنیدن۔ خودکار اصلاح روک دی گئی ہے۔"
              - generic [ref=e842]:
                - generic [ref=e843]: آگہی =-=
                - generic [ref=e844]: دامِ =-
                - generic [ref=e845]: شنیدن ?
                - generic [ref=e846]: جس =
                - generic [ref=e847]: قدر =-
                - generic [ref=e848]: چاہے ==
                - generic [ref=e849]: بچھائے -=-
            - group [ref=e850]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e851] [cursor=pointer]
            - generic [ref=e852]:
              - generic [ref=e853]:
                - generic [ref=e854]:
                  - generic [ref=e855]: فَاعِلُن
                  - generic [ref=e856]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e857]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e858]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e859]': =
                - generic [ref=e860]:
                  - generic [ref=e861]: فَاعِلُن
                  - generic [ref=e862]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e863]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e864]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e865]': =
                - generic [ref=e866]:
                  - generic [ref=e867]: فَاعِلُن
                  - generic [ref=e868]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e869]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e870]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e871]': =
                - generic [ref=e872]:
                  - generic [ref=e873]: فَاعِلُن
                  - generic [ref=e874]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e875]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e876]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e877]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e878]': "-"
              - generic [ref=e879]:
                - generic [ref=e880]:
                  - generic [ref=e881]: "مجموعی آہنگ:"
                  - generic [ref=e882]:
                    - generic [ref=e883]: = - =
                    - generic [ref=e884]: = - =
                    - generic [ref=e885]: = - =
                    - generic [ref=e886]: = - = -
                - generic [ref=e887]: نامکمل تقطیع — تلفظ کی تصدیق درکار ہے
        - generic [ref=e888]:
          - generic [ref=e889]:
            - generic [ref=e890]:
              - generic [ref=e891]: "11"
              - generic [ref=e892]: پہلا مصرع
            - generic [ref=e893]: 7 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e894]: مدعا عنقا ہے اپنے عالمِ تقریر کا
          - generic [ref=e895]:
            - generic [ref=e896]:
              - generic [ref=e897]:
                - generic [ref=e903]: بحرِ رمل مثمن محذوف
                - generic [ref=e904]: (Bahr-e-Ramal Musamman Mahzoof)
              - generic [ref=e905]:
                - generic [ref=e906]: تقطیع کے مطابق موزوں
                - generic [ref=e911]: 15 ہجے
            - generic [ref=e912]:
              - generic [ref=e913]:
                - generic [ref=e914]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e915]:
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
              - paragraph [ref=e916]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e917] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - generic [ref=e918]:
                - generic [ref=e919]: مدعا =-=
                - generic [ref=e920]: عنقا ==
                - generic [ref=e921]: ہے -
                - generic [ref=e922]: اپنے ==
                - generic [ref=e923]: عالمِ =-=
                - generic [ref=e924]: تقریر ==-
                - generic [ref=e925]: کا =
            - group [ref=e926]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e927] [cursor=pointer]
            - generic [ref=e928]:
              - generic [ref=e929]:
                - generic [ref=e930]:
                  - generic [ref=e931]: فَاعِلَاتُن
                  - generic [ref=e932]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e933]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e934]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e935]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e936]': =
                - generic [ref=e937]:
                  - generic [ref=e938]: فَاعِلَاتُن
                  - generic [ref=e939]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e940]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e941]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e942]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e943]': =
                - generic [ref=e944]:
                  - generic [ref=e945]: فَاعِلَاتُن
                  - generic [ref=e946]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e947]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e948]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e949]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e950]': =
                - generic [ref=e951]:
                  - generic [ref=e952]: فَاعِلُن
                  - generic [ref=e953]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e954]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e955]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e956]': =
              - generic [ref=e957]:
                - generic [ref=e958]:
                  - generic [ref=e959]: "مجموعی آہنگ (دائیں تا بائیں):"
                  - generic [ref=e960]:
                    - generic [ref=e961]: = - = =
                    - generic [ref=e962]: = - = =
                    - generic [ref=e963]: = - = =
                    - generic [ref=e964]: = - =
                - generic [ref=e965]:
                  - generic [ref=e966]:
                    - generic [ref=e967]: =
                    - generic [ref=e968]: بلند (Long)
                  - generic [ref=e969]:
                    - generic [ref=e970]: "-"
                    - generic [ref=e971]: کوتاہ (Short)
        - generic [ref=e972]:
          - generic [ref=e974]:
            - generic [ref=e975]: "12"
            - generic [ref=e976]: دوسرا مصرع
          - textbox "مصرع تحریر فرمائیں..." [ref=e977]
        - generic [ref=e978]:
          - generic [ref=e979]:
            - generic [ref=e980]:
              - generic [ref=e981]: "13"
              - generic [ref=e982]: پہلا مصرع
            - generic [ref=e983]: 9 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e984]: بسکہ ہوں غالب اسیری میں بھی آتش زیرِ پا
          - generic [ref=e985]:
            - generic [ref=e986]:
              - generic [ref=e987]: رباعی — ہزج مثمن اخرب مکفوف مجبوب
              - generic [ref=e994]:
                - generic [ref=e995]: تلفظ کی تصدیق درکار
                - generic [ref=e999]: 13 ہجے
                - button "اصلاحِ بحر" [ref=e1000]
            - generic [ref=e1006]:
              - generic [ref=e1007]:
                - generic [ref=e1008]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e1009]:
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
              - paragraph [ref=e1010]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e1011] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - status [ref=e1012]: "ان الفاظ کے تلفظ کی تصدیق درکار ہے: بسکہ۔ خودکار اصلاح روک دی گئی ہے۔"
              - generic [ref=e1013]:
                - generic [ref=e1014]: بسکہ ?
                - generic [ref=e1015]: ہوں =
                - generic [ref=e1016]: غالب =-
                - generic [ref=e1017]: اسیری -==
                - generic [ref=e1018]: میں -
                - generic [ref=e1019]: بھی -
                - generic [ref=e1020]: آتش ==
                - generic [ref=e1021]: زیرِ =-
                - generic [ref=e1022]: پا =
            - group [ref=e1023]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e1024] [cursor=pointer]
            - generic [ref=e1025]:
              - generic [ref=e1026]:
                - generic [ref=e1027]:
                  - generic [ref=e1028]: مَفْعُولُ
                  - generic [ref=e1029]:
                    - 'generic "ہجائے بلند (Long: =)" [ref=e1030]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e1031]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e1032]': "-"
                - generic [ref=e1033]:
                  - generic [ref=e1034]: مَفَاعِیلُ
                  - generic [ref=e1035]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e1036]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e1037]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e1038]': =
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e1039]': "-"
                - generic [ref=e1040]:
                  - generic [ref=e1041]: مَفَاعِیلُ
                  - generic [ref=e1042]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e1043]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e1044]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e1045]': =
                    - 'generic "ہجائے بلند (Long: =)" [ref=e1046]': =
                - generic [ref=e1047]:
                  - generic [ref=e1048]: فَعَلْ
                  - generic [ref=e1049]:
                    - 'generic "ہجائے کوتاہ (Short: -)" [ref=e1050]': "-"
                    - 'generic "ہجائے بلند (Long: =)" [ref=e1051]': =
              - generic [ref=e1052]:
                - generic [ref=e1053]:
                  - generic [ref=e1054]: "مجموعی آہنگ:"
                  - generic [ref=e1055]:
                    - generic [ref=e1056]: = = -
                    - generic [ref=e1057]: "- = = -"
                    - generic [ref=e1058]: "- = = ="
                    - generic [ref=e1059]: "- ="
                - generic [ref=e1060]: نامکمل تقطیع — تلفظ کی تصدیق درکار ہے
        - generic [ref=e1061]:
          - generic [ref=e1062]:
            - generic [ref=e1063]:
              - generic [ref=e1064]: "14"
              - generic [ref=e1065]: دوسرا مصرع
            - generic [ref=e1066]: 8 الفاظ
          - textbox "مصرع تحریر فرمائیں..." [ref=e1067]: موئے آتش دیدہ ہے حلقہ مری زنجیر کا
          - generic [ref=e1068]:
            - generic [ref=e1069]:
              - generic [ref=e1070]:
                - generic [ref=e1076]: بحرِ رمل مثمن محذوف
                - generic [ref=e1077]: (Bahr-e-Ramal Musamman Mahzoof)
              - generic [ref=e1078]:
                - generic [ref=e1079]: تقطیع کے مطابق موزوں
                - generic [ref=e1084]: 15 ہجے
            - generic [ref=e1085]:
              - generic [ref=e1086]:
                - generic [ref=e1087]: "مطلوبہ بحر:"
                - combobox "مطلوبہ بحر" [ref=e1088]:
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
              - paragraph [ref=e1089]:
                - 'link "ماخذِ تلفظ: Aruuz" [ref=e1090] [cursor=pointer]':
                  - /url: /licenses/Aruuz-NOTICE.txt
                - text: · جوازات اور قرأت کی تفصیل ذیل میں ملاحظہ فرمائیں۔
              - generic [ref=e1091]:
                - generic [ref=e1092]: موئے =-
                - generic [ref=e1093]: آتش ==
                - generic [ref=e1094]: دیدہ =-
                - generic [ref=e1095]: ہے =
                - generic [ref=e1096]: حلقہ ==
                - generic [ref=e1097]: مری -=
                - generic [ref=e1098]: زنجیر ==-
                - generic [ref=e1099]: کا =
            - group [ref=e1100]:
              - generic "تلفظ، ماخذ اور استعمال شدہ جوازات" [ref=e1101] [cursor=pointer]
            - generic [ref=e1102]:
              - generic [ref=e1103]:
                - generic [ref=e1104]:
                  - generic [ref=e1105]: فَاعِلَاتُن
                  - generic [ref=e1106]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1107]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e1108]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1109]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1110]': =
                - generic [ref=e1111]:
                  - generic [ref=e1112]: فَاعِلَاتُن
                  - generic [ref=e1113]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1114]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e1115]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1116]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1117]': =
                - generic [ref=e1118]:
                  - generic [ref=e1119]: فَاعِلَاتُن
                  - generic [ref=e1120]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1121]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e1122]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1123]': =
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1124]': =
                - generic [ref=e1125]:
                  - generic [ref=e1126]: فَاعِلُن
                  - generic [ref=e1127]:
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1128]': =
                    - 'generic "ہجائے کوتاہ (Short Syllable: -)" [ref=e1129]': "-"
                    - 'generic "ہجائے بلند (Long Syllable: =)" [ref=e1130]': =
              - generic [ref=e1131]:
                - generic [ref=e1132]:
                  - generic [ref=e1133]: "مجموعی آہنگ (دائیں تا بائیں):"
                  - generic [ref=e1134]:
                    - generic [ref=e1135]: = - = =
                    - generic [ref=e1136]: = - = =
                    - generic [ref=e1137]: = - = =
                    - generic [ref=e1138]: = - =
                - generic [ref=e1139]:
                  - generic [ref=e1140]:
                    - generic [ref=e1141]: =
                    - generic [ref=e1142]: بلند (Long)
                  - generic [ref=e1143]:
                    - generic [ref=e1144]: "-"
                    - generic [ref=e1145]: کوتاہ (Short)
        - button "نیا مصرع شامل کریں" [ref=e1147]
      - generic [ref=e1150]:
        - generic [ref=e1151]:
          - generic [ref=e1152]:
            - generic [ref=e1153]: "5"
            - generic [ref=e1154]: اشعار
          - generic [ref=e1155]:
            - generic [ref=e1156]: "10"
            - generic [ref=e1157]: مصرعے
          - generic [ref=e1158]:
            - generic [ref=e1159]: "77"
            - generic [ref=e1160]: الفاظ
          - generic [ref=e1161]:
            - generic [ref=e1162]: "275"
            - generic [ref=e1163]: حروف
        - generic [ref=e1164]: کسی بھی لفظ کو منتخب کر کے لغت و مترادفات ملاحظہ فرمائیں
    - separator "کھینچ کر چوڑائی تبدیل کریں (Drag to resize)" [ref=e1169]
    - generic [ref=e1173]:
      - generic [ref=e1174]:
        - generic [ref=e1175]:
          - generic [ref=e1176]: ادبی معاون (Literary Companion)
          - button "پینل بند کریں" [ref=e1180]
        - generic [ref=e1184]:
          - button "خزانہ قوافی" [ref=e1185]
          - button "علمِ عروض" [ref=e1191]
          - button "لغت و الفاظ" [ref=e1197]
          - button "صنائع بدائع" [ref=e1202]
          - button "دیوانِ کلام" [ref=e1207]
      - generic [ref=e1212]:
        - generic [ref=e1214]:
          - button "معجمِ قوافی" [ref=e1215]
          - button "قالب ساز (Slots)" [ref=e1220]
          - button "درآمد فائل 📥" [ref=e1223]
          - button "موضوعاتی اوزان" [ref=e1228]
        - generic [ref=e1232]:
          - 'textbox "قافیہ، حرفِ روی یا کوئی بھی لفظ درج فرمائیں (مثلاً: کلام، بہار، ایمان)..." [ref=e1234]'
          - generic [ref=e1235]:
            - button "عام کلاسک قوافی" [ref=e1236]
            - 'button "قافیہ: ام" [ref=e1237]'
            - 'button "قافیہ: ار" [ref=e1238]'
            - 'button "قافیہ: ان" [ref=e1239]'
            - 'button "قافیہ: ت (حقیقت، بصیرت)" [ref=e1240]'
            - 'button "قافیہ: یت" [ref=e1241]'
            - 'button "قافیہ: ال" [ref=e1242]'
            - 'button "قافیہ: اب" [ref=e1243]'
            - 'button "قافیہ: ور" [ref=e1244]'
            - 'button "قافیہ: یر" [ref=e1245]'
            - 'button "قافیہ: ات" [ref=e1246]'
            - 'button "قافیہ: از" [ref=e1247]'
            - 'button "قافیہ: اس" [ref=e1248]'
            - 'button "قافیہ: نگ" [ref=e1249]'
            - 'button "قافیہ: وش" [ref=e1250]'
            - 'button "قافیہ: وا/دا/صدا" [ref=e1251]'
            - 'button "قافیہ: یں" [ref=e1252]'
        - generic [ref=e1253]:
          - generic [ref=e1258]:
            - text: "کلام سے دریافت شدہ قافیہ:"
            - strong [ref=e1259]: تحریر
            - generic [ref=e1260]: "(ردیف: کا)"
          - button "اس کے تمام قافیے دیکھیں" [ref=e1261]
        - generic [ref=e1262]:
          - generic [ref=e1263]:
            - generic [ref=e1264]:
              - generic [ref=e1265]:
                - generic [ref=e1266]: فَعْلُن
                - generic [ref=e1267]: ==
                - generic [ref=e1268]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e1269]
            - button "توام" [ref=e1275] [cursor=pointer]
          - generic [ref=e1276]:
            - generic [ref=e1277]:
              - generic [ref=e1278]:
                - generic [ref=e1279]: مَفْعُولُ
                - generic [ref=e1280]: ==-
                - generic [ref=e1281]: (78 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e1282]
            - generic [ref=e1287]:
              - button "ایام" [ref=e1288] [cursor=pointer]
              - button "آرام" [ref=e1289] [cursor=pointer]
              - button "آشام" [ref=e1290] [cursor=pointer]
              - button "حجام" [ref=e1291] [cursor=pointer]
              - button "حطام" [ref=e1292] [cursor=pointer]
              - button "حمام" [ref=e1293] [cursor=pointer]
              - button "خدام" [ref=e1294] [cursor=pointer]
              - button "رسام" [ref=e1295] [cursor=pointer]
              - button "صیام" [ref=e1296] [cursor=pointer]
              - button "علام" [ref=e1297] [cursor=pointer]
              - button "فہام" [ref=e1298] [cursor=pointer]
              - button "قدام" [ref=e1299] [cursor=pointer]
              - button "نمام" [ref=e1300] [cursor=pointer]
              - button "ابرام" [ref=e1301] [cursor=pointer]
              - button "اتمام" [ref=e1302] [cursor=pointer]
              - button "اجرام" [ref=e1303] [cursor=pointer]
              - button "اجسام" [ref=e1304] [cursor=pointer]
              - button "احکام" [ref=e1305] [cursor=pointer]
              - button "ادغام" [ref=e1306] [cursor=pointer]
              - button "ازلام" [ref=e1307] [cursor=pointer]
              - button "اسٹام" [ref=e1308] [cursor=pointer]
              - button "اسلام" [ref=e1309] [cursor=pointer]
              - button "اسہام" [ref=e1310] [cursor=pointer]
              - button "اصنام" [ref=e1311] [cursor=pointer]
              - button "اعجام" [ref=e1312] [cursor=pointer]
              - button "اعلام" [ref=e1313] [cursor=pointer]
              - button "اعمام" [ref=e1314] [cursor=pointer]
              - button "اغلام" [ref=e1315] [cursor=pointer]
              - button "اغنام" [ref=e1316] [cursor=pointer]
              - button "افہام" [ref=e1317] [cursor=pointer]
              - button "اقدام" [ref=e1318] [cursor=pointer]
              - button "اقسام" [ref=e1319] [cursor=pointer]
              - button "اقلام" [ref=e1320] [cursor=pointer]
              - button "اقوام" [ref=e1321] [cursor=pointer]
              - button "الزام" [ref=e1322] [cursor=pointer]
              - button "الہام" [ref=e1323] [cursor=pointer]
              - button "انجام" [ref=e1324] [cursor=pointer]
              - button "اندام" [ref=e1325] [cursor=pointer]
              - button "انعام" [ref=e1326] [cursor=pointer]
              - button "اوہام" [ref=e1327] [cursor=pointer]
              - button "اہرام" [ref=e1328] [cursor=pointer]
              - button "ایتام" [ref=e1329] [cursor=pointer]
              - button "ایلام" [ref=e1330] [cursor=pointer]
              - button "ائلام" [ref=e1331] [cursor=pointer]
              - button "ایہام" [ref=e1332] [cursor=pointer]
              - button "بادام" [ref=e1333] [cursor=pointer]
              - button "بدنام" [ref=e1334] [cursor=pointer]
              - button "برسام" [ref=e1335] [cursor=pointer]
              - button "بہرام" [ref=e1336] [cursor=pointer]
              - button "پاتام" [ref=e1337] [cursor=pointer]
              - button "پادام" [ref=e1338] [cursor=pointer]
              - button "پانام" [ref=e1339] [cursor=pointer]
              - button "پرنام" [ref=e1340] [cursor=pointer]
              - button "پہنام" [ref=e1341] [cursor=pointer]
              - button "پیتام" [ref=e1342] [cursor=pointer]
              - button "پیغام" [ref=e1343] [cursor=pointer]
              - button "پیلام" [ref=e1344] [cursor=pointer]
              - button "تمتام" [ref=e1345] [cursor=pointer]
              - button "حاخام" [ref=e1346] [cursor=pointer]
              - button "دشنام" [ref=e1347] [cursor=pointer]
              - button "سرسام" [ref=e1348] [cursor=pointer]
              - button "ضرغام" [ref=e1349] [cursor=pointer]
              - button "کہرام" [ref=e1350] [cursor=pointer]
              - button "گمنام" [ref=e1351] [cursor=pointer]
              - button "گودام" [ref=e1352] [cursor=pointer]
              - button "مادام" [ref=e1353] [cursor=pointer]
              - button "مطعام" [ref=e1354] [cursor=pointer]
              - button "ملحام" [ref=e1355] [cursor=pointer]
              - button "منعام" [ref=e1356] [cursor=pointer]
              - button "موٹام" [ref=e1357] [cursor=pointer]
              - button "ناکام" [ref=e1358] [cursor=pointer]
              - button "نشکام" [ref=e1359] [cursor=pointer]
              - button "نفرام" [ref=e1360] [cursor=pointer]
              - button "نیپام" [ref=e1361] [cursor=pointer]
              - button "نیلام" [ref=e1362] [cursor=pointer]
              - button "ہنگام" [ref=e1363] [cursor=pointer]
              - button "افہمام" [ref=e1364] [cursor=pointer]
              - button "پھولام" [ref=e1365] [cursor=pointer]
          - generic [ref=e1366]:
            - generic [ref=e1367]:
              - generic [ref=e1368]:
                - generic [ref=e1369]: فَعُولُ
                - generic [ref=e1370]: "-=-"
                - generic [ref=e1371]: (55 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e1372]
            - generic [ref=e1377]:
              - button "اتام" [ref=e1378] [cursor=pointer]
              - button "اکام" [ref=e1379] [cursor=pointer]
              - button "امام" [ref=e1380] [cursor=pointer]
              - button "انام" [ref=e1381] [cursor=pointer]
              - button "بتام" [ref=e1382] [cursor=pointer]
              - button "بدام" [ref=e1383] [cursor=pointer]
              - button "برام" [ref=e1384] [cursor=pointer]
              - button "بنام" [ref=e1385] [cursor=pointer]
              - button "پیام" [ref=e1386] [cursor=pointer]
              - button "تلام" [ref=e1387] [cursor=pointer]
              - button "تمام" [ref=e1388] [cursor=pointer]
              - button "ٹرام" [ref=e1389] [cursor=pointer]
              - button "جذام" [ref=e1390] [cursor=pointer]
              - button "جسام" [ref=e1391] [cursor=pointer]
              - button "حرام" [ref=e1392] [cursor=pointer]
              - button "حسام" [ref=e1393] [cursor=pointer]
              - button "ختام" [ref=e1394] [cursor=pointer]
              - button "خرام" [ref=e1395] [cursor=pointer]
              - button "خصام" [ref=e1396] [cursor=pointer]
              - button "خنام" [ref=e1397] [cursor=pointer]
              - button "خیام" [ref=e1398] [cursor=pointer]
              - button "دوام" [ref=e1399] [cursor=pointer]
              - button "رخام" [ref=e1400] [cursor=pointer]
              - button "رہام" [ref=e1401] [cursor=pointer]
              - button "زحام" [ref=e1402] [cursor=pointer]
              - button "زکام" [ref=e1403] [cursor=pointer]
              - button "زمام" [ref=e1404] [cursor=pointer]
              - button "سلام" [ref=e1405] [cursor=pointer]
              - button "سنام" [ref=e1406] [cursor=pointer]
              - button "سیام" [ref=e1407] [cursor=pointer]
              - button "طعام" [ref=e1408] [cursor=pointer]
              - button "ظلام" [ref=e1409] [cursor=pointer]
              - button "عوام" [ref=e1410] [cursor=pointer]
              - button "غلام" [ref=e1411] [cursor=pointer]
              - button "قوام" [ref=e1412] [cursor=pointer]
              - button "قیام" [ref=e1413] [cursor=pointer]
              - button "کرام" [ref=e1414] [cursor=pointer]
              - button "کلام" [ref=e1415] [cursor=pointer]
              - button "گرام" [ref=e1416] [cursor=pointer]
              - button "لگام" [ref=e1417] [cursor=pointer]
              - button "مٹام" [ref=e1418] [cursor=pointer]
              - button "مدام" [ref=e1419] [cursor=pointer]
              - button "مسام" [ref=e1420] [cursor=pointer]
              - button "مشام" [ref=e1421] [cursor=pointer]
              - button "مقام" [ref=e1422] [cursor=pointer]
              - button "ملام" [ref=e1423] [cursor=pointer]
              - button "منام" [ref=e1424] [cursor=pointer]
              - button "مہام" [ref=e1425] [cursor=pointer]
              - button "نحام" [ref=e1426] [cursor=pointer]
              - button "نظام" [ref=e1427] [cursor=pointer]
              - button "نعام" [ref=e1428] [cursor=pointer]
              - button "نکام" [ref=e1429] [cursor=pointer]
              - button "نیام" [ref=e1430] [cursor=pointer]
              - button "چھدام" [ref=e1431] [cursor=pointer]
              - button "دھڑام" [ref=e1432] [cursor=pointer]
          - generic [ref=e1433]:
            - generic [ref=e1434]:
              - generic [ref=e1435]:
                - generic [ref=e1436]: فَاعِلَاتُ
                - generic [ref=e1437]: =-=-
                - generic [ref=e1438]: (44 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e1439]
            - generic [ref=e1444]:
              - button "اتہام" [ref=e1445] [cursor=pointer]
              - button "ابتسام" [ref=e1446] [cursor=pointer]
              - button "احترام" [ref=e1447] [cursor=pointer]
              - button "احتشام" [ref=e1448] [cursor=pointer]
              - button "احتمام" [ref=e1449] [cursor=pointer]
              - button "اختتام" [ref=e1450] [cursor=pointer]
              - button "اختصام" [ref=e1451] [cursor=pointer]
              - button "ارتسام" [ref=e1452] [cursor=pointer]
              - button "ازدحام" [ref=e1453] [cursor=pointer]
              - button "ازدہام" [ref=e1454] [cursor=pointer]
              - button "اژدحام" [ref=e1455] [cursor=pointer]
              - button "اژدہام" [ref=e1456] [cursor=pointer]
              - button "استدام" [ref=e1457] [cursor=pointer]
              - button "استلام" [ref=e1458] [cursor=pointer]
              - button "اشتمام" [ref=e1459] [cursor=pointer]
              - button "اضطرام" [ref=e1460] [cursor=pointer]
              - button "اعتصام" [ref=e1461] [cursor=pointer]
              - button "اقتدام" [ref=e1462] [cursor=pointer]
              - button "اقتسام" [ref=e1463] [cursor=pointer]
              - button "اکتتام" [ref=e1464] [cursor=pointer]
              - button "التزام" [ref=e1465] [cursor=pointer]
              - button "التیام" [ref=e1466] [cursor=pointer]
              - button "السلام" [ref=e1467] [cursor=pointer]
              - button "انتسام" [ref=e1468] [cursor=pointer]
              - button "انتظام" [ref=e1469] [cursor=pointer]
              - button "انتقام" [ref=e1470] [cursor=pointer]
              - button "انسجام" [ref=e1471] [cursor=pointer]
              - button "انصرام" [ref=e1472] [cursor=pointer]
              - button "انضمام" [ref=e1473] [cursor=pointer]
              - button "انظلام" [ref=e1474] [cursor=pointer]
              - button "انعدام" [ref=e1475] [cursor=pointer]
              - button "انفصام" [ref=e1476] [cursor=pointer]
              - button "انقسام" [ref=e1477] [cursor=pointer]
              - button "انہدام" [ref=e1478] [cursor=pointer]
              - button "انہزام" [ref=e1479] [cursor=pointer]
              - button "انہضام" [ref=e1480] [cursor=pointer]
              - button "اہتمام" [ref=e1481] [cursor=pointer]
              - button "بدلگام" [ref=e1482] [cursor=pointer]
              - button "تیزگام" [ref=e1483] [cursor=pointer]
              - button "شاہگام" [ref=e1484] [cursor=pointer]
              - button "مستہام" [ref=e1485] [cursor=pointer]
              - button "ناتمام" [ref=e1486] [cursor=pointer]
              - button "پیرتھام" [ref=e1487] [cursor=pointer]
              - button "ذوالکرام" [ref=e1488] [cursor=pointer]
          - generic [ref=e1489]:
            - generic [ref=e1490]:
              - generic [ref=e1491]:
                - generic [ref=e1492]: بر وزنِ معین
                - generic [ref=e1493]: =-
                - generic [ref=e1494]: (26 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e1495]
            - generic [ref=e1500]:
              - button "بام" [ref=e1501] [cursor=pointer]
              - button "پام" [ref=e1502] [cursor=pointer]
              - button "تام" [ref=e1503] [cursor=pointer]
              - button "جام" [ref=e1504] [cursor=pointer]
              - button "چام" [ref=e1505] [cursor=pointer]
              - button "حام" [ref=e1506] [cursor=pointer]
              - button "خام" [ref=e1507] [cursor=pointer]
              - button "دام" [ref=e1508] [cursor=pointer]
              - button "ڈام" [ref=e1509] [cursor=pointer]
              - button "رام" [ref=e1510] [cursor=pointer]
              - button "سام" [ref=e1511] [cursor=pointer]
              - button "شام" [ref=e1512] [cursor=pointer]
              - button "عام" [ref=e1513] [cursor=pointer]
              - button "فام" [ref=e1514] [cursor=pointer]
              - button "قام" [ref=e1515] [cursor=pointer]
              - button "کام" [ref=e1516] [cursor=pointer]
              - button "گام" [ref=e1517] [cursor=pointer]
              - button "لام" [ref=e1518] [cursor=pointer]
              - button "نام" [ref=e1519] [cursor=pointer]
              - button "وام" [ref=e1520] [cursor=pointer]
              - button "یام" [ref=e1521] [cursor=pointer]
              - button "تھام" [ref=e1522] [cursor=pointer]
              - button "ٹھام" [ref=e1523] [cursor=pointer]
              - button "جھام" [ref=e1524] [cursor=pointer]
              - button "دھام" [ref=e1525] [cursor=pointer]
              - button "گھام" [ref=e1526] [cursor=pointer]
          - generic [ref=e1527]:
            - generic [ref=e1528]:
              - generic [ref=e1529]:
                - generic [ref=e1530]: بر وزنِ معین
                - generic [ref=e1531]: ===-
                - generic [ref=e1532]: (13 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e1533]
            - generic [ref=e1538]:
              - button "حدتام" [ref=e1539] [cursor=pointer]
              - button "بارعام" [ref=e1540] [cursor=pointer]
              - button "استحکام" [ref=e1541] [cursor=pointer]
              - button "استخدام" [ref=e1542] [cursor=pointer]
              - button "استرحام" [ref=e1543] [cursor=pointer]
              - button "استشمام" [ref=e1544] [cursor=pointer]
              - button "استفہام" [ref=e1545] [cursor=pointer]
              - button "استلزام" [ref=e1546] [cursor=pointer]
              - button "بدانجام" [ref=e1547] [cursor=pointer]
              - button "بداندام" [ref=e1548] [cursor=pointer]
              - button "پراندام" [ref=e1549] [cursor=pointer]
              - button "سرانجام" [ref=e1550] [cursor=pointer]
              - button "نافرجام" [ref=e1551] [cursor=pointer]
          - generic [ref=e1552]:
            - generic [ref=e1553]:
              - generic [ref=e1554]:
                - generic [ref=e1555]: مرکب وزن
                - generic [ref=e1556]: ==-=-
                - generic [ref=e1557]: (7 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e1558]
            - generic [ref=e1563]:
              - button "بدانتظام" [ref=e1564] [cursor=pointer]
              - button "داراسلام" [ref=e1565] [cursor=pointer]
              - button "ڈائیگرام" [ref=e1566] [cursor=pointer]
              - button "مونوگرام" [ref=e1567] [cursor=pointer]
              - button "بالالتزام" [ref=e1568] [cursor=pointer]
              - button "خیرالکلام" [ref=e1569] [cursor=pointer]
              - button "دارالعوام" [ref=e1570] [cursor=pointer]
          - generic [ref=e1571]:
            - generic [ref=e1572]:
              - generic [ref=e1573]:
                - generic [ref=e1574]: مرکب وزن
                - generic [ref=e1575]: "-===-"
                - generic [ref=e1576]: (3 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e1577]
            - generic [ref=e1582]:
              - button "نفیرعام" [ref=e1583] [cursor=pointer]
              - button "نکوفرجام" [ref=e1584] [cursor=pointer]
              - button "ابوالاجسام" [ref=e1585] [cursor=pointer]
          - generic [ref=e1586]:
            - generic [ref=e1587]:
              - generic [ref=e1588]:
                - generic [ref=e1589]: مرکب وزن
                - generic [ref=e1590]: "-=-=-"
                - generic [ref=e1591]: (2 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e1592]
            - generic [ref=e1597]:
              - button "بلندبام" [ref=e1598] [cursor=pointer]
              - button "پروگرام" [ref=e1599] [cursor=pointer]
          - generic [ref=e1600]:
            - generic [ref=e1601]:
              - generic [ref=e1602]:
                - generic [ref=e1603]: مرکب وزن
                - generic [ref=e1604]: ====-
                - generic [ref=e1605]: (2 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e1606]
            - generic [ref=e1611]:
              - button "موبراندام" [ref=e1612] [cursor=pointer]
              - button "دارالاسلام" [ref=e1613] [cursor=pointer]
          - generic [ref=e1614]:
            - generic [ref=e1615]:
              - generic [ref=e1616]:
                - generic [ref=e1617]: مرکب وزن
                - generic [ref=e1618]: ===-=-
                - generic [ref=e1619]: (2 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e1620]
            - generic [ref=e1625]:
              - button "مائکروگرام" [ref=e1626] [cursor=pointer]
              - button "دارالاہتمام" [ref=e1627] [cursor=pointer]
          - generic [ref=e1628]:
            - generic [ref=e1629]:
              - generic [ref=e1630]:
                - generic [ref=e1631]: مَفَاعِیلُ
                - generic [ref=e1632]: "-==-"
                - generic [ref=e1633]: (2 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e1634]
            - generic [ref=e1639]:
              - button "زرخام" [ref=e1640] [cursor=pointer]
              - button "سربام" [ref=e1641] [cursor=pointer]
          - generic [ref=e1642]:
            - generic [ref=e1643]:
              - generic [ref=e1644]:
                - generic [ref=e1645]: مرکب وزن
                - generic [ref=e1646]: =-=-=-
                - generic [ref=e1647]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e1648]
            - button "احقرالانام" [ref=e1654] [cursor=pointer]
          - generic [ref=e1655]:
            - generic [ref=e1656]:
              - generic [ref=e1657]:
                - generic [ref=e1658]: ہجائے بلند
                - generic [ref=e1659]: =
                - generic [ref=e1660]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e1661]
            - button "ام" [ref=e1667] [cursor=pointer]
          - generic [ref=e1668]:
            - generic [ref=e1669]:
              - generic [ref=e1670]:
                - generic [ref=e1671]: مرکب وزن
                - generic [ref=e1672]: "--==-"
                - generic [ref=e1673]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e1674]
            - button "ثمرخام" [ref=e1680] [cursor=pointer]
          - generic [ref=e1681]:
            - generic [ref=e1682]:
              - generic [ref=e1683]:
                - generic [ref=e1684]: مرکب وزن
                - generic [ref=e1685]: =-==-
                - generic [ref=e1686]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e1687]
            - button "طائربام" [ref=e1693] [cursor=pointer]
          - generic [ref=e1694]:
            - generic [ref=e1695]:
              - generic [ref=e1696]:
                - generic [ref=e1697]: مرکب وزن
                - generic [ref=e1698]: ==-===-
                - generic [ref=e1699]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e1700]
            - button "مؤیدالاسلام" [ref=e1706] [cursor=pointer]
          - generic [ref=e1707]:
            - generic [ref=e1708]:
              - generic [ref=e1709]:
                - generic [ref=e1710]: مرکب وزن
                - generic [ref=e1711]: =--=-=-
                - generic [ref=e1712]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e1713]
            - button "مستمرالنظام" [ref=e1719] [cursor=pointer]
          - generic [ref=e1720]:
            - generic [ref=e1721]:
              - generic [ref=e1722]:
                - generic [ref=e1723]: فَعِلَاتُ
                - generic [ref=e1724]: "--=-"
                - generic [ref=e1725]: (1 الفاظ)
              - button "یہ سب تختی پر لائیں" [ref=e1726]
            - button "نترام" [ref=e1732] [cursor=pointer]
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
> 90  |       expect(await rawStore(page)).toBe(raw);
      |                                    ^ Error: expect(received).toBe(expected) // Object.is equality
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
```