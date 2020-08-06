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

let dataList = [];
const getData = async () => {
  for (let i = 2401; i <= 2700; i++) {
    //      const url = "https://search.open.canada.ca/en/od/?sort=last_modified_tdt%20desc&page=" + i + "&search_text=&od-search-subjects=Information%20and%20Communications&_ga=2.41256546.1102719533.1579883935-540404182.1570673186";
    //     const url = "https://search.open.canada.ca/en/od/?sort=last_modified_tdt%20desc&page="+ i + "&search_text=&od-search-subjects=Agriculture&_ga=2.224010907.1485443746.1579997234-540404182.1570673186";
    //const url= "https://search.open.canada.ca/en/od/?sort=last_modified_tdt%20desc&page=" + i + "&search_text=&od-search-subjects=Arts%20Music%20Literature&_ga=2.193686829.1485443746.1579997234-540404182.1570673186";
    const url =
      'https://search.open.canada.ca/en/od/?sort=last_modified_tdt%20desc&page=' +
      i +
      '&search_text=&od-search-subjects=Economics%20and%20Industry&_ga=2.235956481.1485443746.1579997234-540404182.1570673186';
    // const url= "https://search.open.canada.ca/en/od/?sort=last_modified_tdt%20desc&page="+ i +"&search_text=&od-search-subjects=Education%20and%20Training"
    //const url = "https://search.open.canada.ca/en/od/?sort=last_modified_tdt%20desc&page="+i+"&search_text=&od-search-subjects=Health%20and%20Safety";
    //const url ="https://search.open.canada.ca/en/od/?sort=last_modified_tdt%20desc&page=" + i + "&search_text=&od-search-subjects=History%20and%20Archaeology"
    //const url = "https://search.open.canada.ca/en/od/?sort=last_modified_tdt%20desc&page="+ i+"&search_text=&od-search-subjects=Labour"
    //const url = "https://search.open.canada.ca/en/od/?sort=last_modified_tdt%20desc&page="+i+"&search_text=&od-search-subjects=Language%20and%20Linguistics"
    //const url ="https://search.open.canada.ca/en/od/?sort=last_modified_tdt%20desc&page="+i+"&search_text=&od-search-subjects=Law"
    //const url ="https://search.open.canada.ca/en/od/?sort=last_modified_tdt%20desc&page="+i+"&search_text=&od-search-subjects=Military"
    //const url ="https://search.open.canada.ca/en/od/?sort=last_modified_tdt%20desc&page="+i+"&search_text=&od-search-subjects=Persons"
    //const url ="https://search.open.canada.ca/en/od/?sort=last_modified_tdt%20desc&page="+i+"&search_text=&od-search-subjects=Processes"
    //const url ="https://search.open.canada.ca/en/od/?sort=last_modified_tdt%20desc&page="+i+"&search_text=&od-search-subjects=Science%20and%20Technology"
    //const url ="https://search.open.canada.ca/en/od/?sort=last_modified_tdt%20desc&page="+i+"&search_text=&od-search-subjects=Society%20and%20Culture"
    // const url ="https://search.open.canada.ca/en/od/?sort=last_modified_tdt%20desc&page=" + i +"&search_text=&od-search-subjects=Transport"

    let html = await getHTML(url);

    const $ = cheerio.load(html.data);
    const bodyList = $('div.panel-body');
    bodyList.each(function(i, elem) {
      dataList.push({
        title: $(this)
          .find('a')
          .text()
          .trim(),
        desc1: $(this)
          .find('span p:nth-child(1)')
          .text(),
        desc2: $(this)
          .find('span p:nth-child(2)')
          .text(),
        org: $(this)
          .find('.col-sm-12 p:nth-child(2)')
          .text()
          .substr(
            $(this)
              .find('.col-sm-12 p:nth-child(2)')
              .text()
              .indexOf('Organization:') + 14
          )
          .replace(/\n/gi, '')
          .trim(),
        format: $(this)
          .find('p:nth-child(3)')
          .text()
          .substr(
            $(this)
              .find('p:nth-child(3)')
              .text()
              .indexOf('\n') + 2
          )
          .replace(/\n/gi, '')
          .trim(),
        tag: $(this)
          .find('p:nth-child(4)')
          .text()
          .substr(
            $(this)
              .find('p:nth-child(4)')
              .text()
              .indexOf('\n') + 2
          )
          .replace(/\n/gi, '')
          .trim(),
        jurisdiction: $(this)
          .find('span.label')
          .text()
          .trim(),
        subject: 'economic'
      });
    });
  }
};

const execFunc = async () => {
  await getData();
  console.log(dataList.length);
  fs.writeFile('economic9.json', JSON.stringify(dataList), function(err) {
    if (err) throw err;
    console.log('Saved!');
  });
};

execFunc();
