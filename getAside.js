const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function getHTML(url) {
  try {
    return await axios.get(url);
  } catch (error) {
    console.error(error);
  }
}

const getUrl = async subjects => {
  let url = 'https://search.open.canada.ca/en/od/';
  let checkFirst = true;
  for (let i in subjects) {
    if (subjects[i]) {
      checkFirst
        ? (url += `?sort=score%20desc&page=1&search_text=&od-search-subjects=${i.replace(
            / /gi,
            '%20'
          )}`)
        : (url += `%7C${i.replace(/ /gi, '%20')}`);
      checkFirst = false;
    }
  }
  url += '#';
  return url;
};

const getObjFromString = a => {
  let obj = {};
  while (true) {
    if (a.indexOf(')') === -1) {
      break;
    }
    let x = parseInt(a.substr(a.indexOf('(') + 1, 1))
      ? a.indexOf('(')
      : a.indexOf('(', a.indexOf('(') + 1);
    let y = a.indexOf(')', x);
    let z = a
      .substr(0, x)
      .trim()
      .replace(/ /gi, '');

    obj[z] = parseInt(a.substr(x + 1, y - x - 1).trim());
    a = a.substr(a.indexOf(')', x) + 1);
  }
  // console.log(obj);
  return obj;
};

const getData = async url => {
  try {
    let resObj = {};
    let html = await getHTML(url);
    const $ = cheerio.load(html.data);
    const bodyList = $('details.panel');

    bodyList.each(function(i, elem) {
      if (
        $(this)
          .find('h5')
          .text()
          .trim() === 'Subjects'
      ) {
      } else {
        let a = $(this)
          .find('h5')
          .text()
          .trim();
        let b = $(this)
          .find('label')
          .text()
          .trim();

        resObj[a] = getObjFromString(b);
      }
    });
    return resObj;
  } catch (error) {
    console.log(error);
  }
};

const execFunc = async (subjects, filename) => {
  let url = await getUrl(subjects);
  let data = await getData(url);
  // console.log(JSON.stringify(data));
  fs.writeFile(filename, JSON.stringify(data), function(err) {
    if (err) throw err;
    console.log('Saved!');
  });
};

////////////////////////////////////////////
///////////////////실행///////////////////
///////////////////////////////////////////
//1이 선택 0이 노선택
let Subjects = {
  Agriculture: 1,
  'Arts Music Literature': 1,
  'Economics and Industry': 0,
  'Education and Training': 0,
  'Form Descriptors': 0,
  'Government and Politics': 1,
  'Health and Safety': 0,
  'History and Archaeology': 0,
  'Information and Communications': 0,
  Labour: 0,
  'Language and Linguistics': 0,
  Law: 0,
  Military: 0,
  'Nature and Environment': 0,
  Persons: 0,
  Processes: 0,
  'Science and Technology': 0,
  'Society and Culture': 0,
  Transport: 0
};
// json 파일 이름 정하기
let filename = 'jjj.json';
// 실행
execFunc(Subjects, filename);
