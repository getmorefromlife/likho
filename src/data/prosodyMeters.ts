/** Named Urdu forms, indexed to Pritchett/Khaliq's Handbook §6.1 and §6.3.
 * Zihafat are explicit named forms; no arbitrary foot substitutions are licensed.
 */
export interface ClassicalMeterDef {
  id: string; nameUrdu: string; nameEnglish: string;
  afailList: string[]; patternsList: string[]; fullRawPattern: string;
  source: string; initialFlexible?: boolean; caesuraAfter?: number;
  allowTerminalShort: boolean;
}
export const FOOT_NAMES: Record<string, string> = {
  '=': 'فَعْ', '==': 'فَعْلُن', '===': 'مَفْعُولُن', '==-': 'مَفْعُولُ',
  '-=': 'فَعَلْ', '-==': 'فَعُولُن', '-=-': 'فَعُولُ', '-===': 'مَفَاعِیلُن',
  '=-==': 'فَاعِلَاتُن', '=-=': 'فَاعِلُن', '=-=-': 'فَاعِلَاتُ',
  '-=-=': 'مَفَاعِلُن', '-==-': 'مَفَاعِیلُ', '==-=': 'مُسْتَفْعِلُن',
  '--==': 'فَعِلَاتُن', '--=': 'فَعِلُن', '=--=': 'مُفْتَعِلُن',
  '--=-': 'فَعِلَاتُ', '--=-=': 'مُتَفَاعِلُن',
};
type Row = [string, string, string, string, number?, boolean?];
// id, Urdu name, English name, foot patterns, caesura after foot, flexible first syllable
const rows: Row[] = [
  ['hazaj-musaddas-akhram-ashtar-mahzoof','ہزج مسدس اخرم اشتر محذوف','Hazaj Musaddas Akhram Ashtar Mahzoof','===/=-=/-=='],
  ['mutaqarib-musamman-asram','متقارب مثمن اثرم','Mutaqarib Musamman Asram','==/-==/==/-==',2],
  ['rajaz-musamman-salim','رجز مثمن سالم','Rajaz Musamman Salim','==-= / ==-= / ==-= / ==-='],
  ['muzara-musamman-akhrab','مضارع مثمن اخرب','Muzara Musamman Akhrab','==-/=-==/==-/=-==',2],
  ['muzara-musamman-akhrab-makfoof-mahzoof','مضارع مثمن اخرب مکفوف محذوف','Muzara Musamman Akhrab Makfoof Mahzoof','==-/=-=-/-==- /=-='],
  ['mutadarak-musamman-muzaaf-maqtoo-makhboon','متدارک مثمن مضاعف مقطوع مخبون','Mutadarak Musamman Muzaaf Maqtoo Makhboon','==/--=/==/==/==/--=/==/=='],
  ['hazaj-musamman-akhrab-salim','ہزج مثمن اخرب','Hazaj Musamman Akhrab','==-/ -=== / ==- / -===',2],
  ['hazaj-musamman-akhrab-makfoof-mahzoof','ہزج مثمن اخرب مکفوف محذوف','Hazaj Musamman Akhrab Makfoof Mahzoof','==-/ -==- / -==- / -=='],
  ['hazaj-musaddas-akhrab-maqbooz-mahzoof','ہزج مسدس اخرب مقبوض محذوف','Hazaj Musaddas Akhrab Maqbooz Mahzoof','==-/ -=-= / -=='],
  ['ramal-musamman-mahzoof','رمل مثمن محذوف','Ramal Musamman Mahzoof','=-==/=-==/=-==/=-='],
  ['ramal-musaddas-mahzoof','رمل مسدس محذوف','Ramal Musaddas Mahzoof','=-==/=-==/=-='],
  ['mutadarak-musamman-muzaaf-salim','متدارک مثمن مضاعف سالم','Mutadarak Musamman Muzaaf Salim','=-=/=-=/=-=/=-=/=-=/=-=/=-=/=-='],
  ['mutadarak-musamman-maqtoo-mahzoof','متدارک مثمن مقطوع محذوف','Mutadarak Musamman Maqtoo Mahzoof','=-=/=-=/=-=/='],
  ['khafeef-musaddas-variant','خفیف مسدس مخبون محذوف مقطوع','Khafeef Musaddas Makhboon Mahzoof Maqtoo','=-==/-=-=/==',undefined,true],
  ['khafeef-musaddas-makhboon-mahzoof','خفیف مسدس مخبون محذوف','Khafeef Musaddas Makhboon Mahzoof','=-==/-=-=/--=',undefined,true],
  ['ramal-musaddas-makhboon-maqtoo','رمل مسدس مخبون محذوف مقطوع','Ramal Musaddas Makhboon Mahzoof Maqtoo','=-==/--==/==',undefined,true],
  ['ramal-musaddas-makhboon-mahzoof','رمل مسدس مخبون محذوف','Ramal Musaddas Makhboon Mahzoof','=-==/--==/--=',undefined,true],
  ['ramal-musamman-makhboon-maqtoo','رمل مثمن مخبون محذوف مقطوع','Ramal Musamman Makhboon Mahzoof Maqtoo','=-==/--==/--==/==',undefined,true],
  ['ramal-musamman-makhboon-mahzoof','رمل مثمن مخبون محذوف','Ramal Musamman Makhboon Mahzoof','=-==/--==/--==/--=',undefined,true],
  ['hazaj-musamman-ashtar','ہزج مثمن اشتر','Hazaj Musamman Ashtar','=-=/-===/=-=/-===',2],
  ['hazaj-musamman-ashtar-maqbooz','ہزج مثمن اشتر مقبوض','Hazaj Musamman Ashtar Maqbooz','=-=/-=-=/=-=/-=-=',2],
  ['munsareh-musamman-matwi-makshoof','منسرح مثمن مطوی مکسوف','Munsareh Musamman Matwi Maksoof','=--=/=-=/=--=/=-=',2],
  ['munsareh-musamman-matwi-manhoor','منسرح مثمن مطوی منحور','Munsareh Musamman Matwi Manhoor','=--=/=-=-/=--=/='],
  ['saree-musaddas-matwi-maksoof','سریع مسدس مطوی مکسوف','Saree Musaddas Matwi Maksoof','=--=/=--=/=-='],
  ['rajaz-musamman-matwi-makhboon','رجز مثمن مطوی مخبون','Rajaz Musamman Matwi Makhboon','=--=/-=-=/=--=/-=-=',2],
  ['hazaj-musamman-salim','ہزج مثمن سالم','Hazaj Musamman Salim','-===/-===/-===/-==='],
  ['hazaj-musaddas-mahzoof','ہزج مسدس محذوف','Hazaj Musaddas Mahzoof','-===/-===/-=='],
  ['mutaqarib-musamman-salim','متقارب مثمن سالم','Mutaqarib Musamman Salim','-==/-==/-==/-=='],
  ['mutaqarib-musamman-mahzoof','متقارب مثمن محذوف','Mutaqarib Musamman Mahzoof','-==/-==/-==/-='],
  ['mutaqarib-musamman-muzaaf-maqbooz-aslam','متقارب مثمن مضاعف مقبوض اثلم','Mutaqarib Musamman Muzaaf Maqbooz Aslam','-=-/==/-=-/==/-=-/==/-=-/=='],
  ['mutaqarib-musaddas-muzaaf-maqbooz-aslam','متقارب مسدس مضاعف مقبوض اثلم','Mutaqarib Musaddas Muzaaf Maqbooz Aslam','-=-/==/-=-/==/-=-/=='],
  ['hazaj-musamman-maqbooz','ہزج مثمن مقبوض','Hazaj Musamman Maqbooz','-=-=/-=-=/-=-=/-=-='],
  ['mujtas-musamman-makhboon-maqtoo','مجتث مثمن مخبون محذوف مقطوع','Mujtas Musamman Makhboon Mahzoof Maqtoo','-=-=/--==/-=-=/=='],
  ['mujtas-musamman-makhboon-mahzoof','مجتث مثمن مخبون محذوف','Mujtas Musamman Makhboon Mahzoof','-=-=/--==/-=-=/--='],
  ['mujtas-musamman-makhboon','مجتث مثمن مخبون','Mujtas Musamman Makhboon','-=-=/--==/-=-=/--=='],
  ['ramal-musamman-mashkool','رمل مثمن مشکول','Ramal Musamman Mashkool','--=-/=-==/--=-/=-==',2],
  ['kamil-musamman-salim','کامل مثمن سالم','Kamil Musamman Salim','--=-=/--=-=/--=-=/--=-='],
];
const rubai: [string, string][] = [
  ['اخرب مکفوف مجبوب','==-/ -==- / -==- / -='], ['اخرب مکفوف ابتر','==-/ -==- / -=== / ='],
  ['اخرب مقبوض ابتر','==-/ -=-= / -=== / ='], ['اخرب مقبوض مکفوف مجبوب','==-/ -=-= / -==- / -='],
  ['اخرم اشتر مکفوف مجبوب','===/ =-= / -==- / -='], ['اخرم اشتر ابتر','===/ =-= / -=== / ='],
  ['اخرب اخرم ابتر','==-/ -=== / === / ='], ['اخرب مجبوب','==-/ -=== / ==- / -='],
  ['اخرم اخرب مجبوب','===/ === / ==- / -='], ['اخرم ابتر','===/ === / === / ='],
  ['اخرم اخرب ابتر','===/ ==- / -=== / ='], ['اخرم اخرب مکفوف مجبوب','===/ ==- / -==- / -='],
];
export const CLASSICAL_BUHUR: ClassicalMeterDef[] = rows.map<ClassicalMeterDef>(([id, urdu, english, feet, caesuraAfter, initialFlexible], index) => {
  const patternsList = feet.replace(/\s/gu, '').split('/');
  return { id, nameUrdu: 'بحرِ ' + urdu, nameEnglish: 'Bahr-e-' + english,
    afailList: patternsList.map(p => FOOT_NAMES[p]), patternsList, fullRawPattern: patternsList.join(''),
    source: `handbook:6.1:${index + 1}`, caesuraAfter, initialFlexible,
    allowTerminalShort: id !== 'hazaj-musamman-salim' };
}).concat(rubai.map(([urdu, feet], index) => {
  const patternsList = feet.replace(/\s/gu, '').split('/');
  return { id: `rubai-${index + 1}`, nameUrdu: `رباعی — ہزج مثمن ${urdu}`, nameEnglish: `Rubai form ${index + 1}`,
    afailList: patternsList.map(p => FOOT_NAMES[p]), patternsList, fullRawPattern: patternsList.join(''),
    source: `handbook:6.3:${index + 1}`, allowTerminalShort: true };
}));
// The four-foot form is explicitly permitted in Handbook §6.1 #12.
const mutadarak = CLASSICAL_BUHUR.find(m => m.id === 'mutadarak-musamman-muzaaf-salim')!;
CLASSICAL_BUHUR.push({ ...mutadarak, id: 'mutadarak-musamman-salim', nameUrdu: 'بحرِ متدارک مثمن سالم',
  nameEnglish: 'Bahr-e-Mutadarak Musamman Salim', patternsList: mutadarak.patternsList.slice(0, 4),
  afailList: mutadarak.afailList.slice(0, 4), fullRawPattern: mutadarak.patternsList.slice(0, 4).join('') });
