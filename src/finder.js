import JQL from 'jqljs'

/**
 * From jquery.Thailand.js 
 */
const preprocess = (data) => {
  let lookup = [];
  let words = [];
  const expanded = [];
  let t;

  if (data.lookup && data.words) {
    // compact with dictionary and lookup
    lookup = data.lookup.split('|');
    words = data.words.split('|');
    ({ data } = data);
  }

  t = (text) => {

    function repl(m) {
      const ch = m.charCodeAt(0);
      return words[ch < 97 ? ch - 65 : 26 + ch - 97];
    }

    if (typeof text === 'number') {
      text = lookup[text];
    }
    return text.replace(/[A-Z]/ig, repl);
  };

  // decompacted database in hierarchical form of:
  // [["province",[["amphur",[["district",["zip"...]]...]]...]]...]
  data.map((provinces) => {

    let i = 1;
    if (provinces.length === 3) { // geographic database
      i = 2;
    }

    provinces[i].map((amphoes) => {
      amphoes[i].map((districts) => {
        districts[i] = districts[i] instanceof Array ? districts[i] : [districts[i]];
        districts[i].map((zipcode) => {
          const entry = {
            district: t(districts[0]),
            amphoe: t(amphoes[0]),
            province: t(provinces[0]),
            zipcode,
          };
          if (i === 2) { // geographic database
            entry.district_code = districts[1] || false;
            entry.amphoe_code = amphoes[1] || false;
            entry.province_code = provinces[1] || false;
          }
          expanded.push(entry);
        });
      });
    });
  });
  return expanded;
};


const DB = new JQL(preprocess(require('./db.json')));

const resolveResultbyField = (searchStr, type) => {
  let possibles = [];
  try {
    possibles = DB.select('*').where(type)
      .match(`^${searchStr}`)
      .orderBy(type)
      .fetch();
  } catch (e) {
    return [];
  }
  // console.log('possibles', possibles)
  return possibles;
};

export default { preprocess, resolveResultbyField };
