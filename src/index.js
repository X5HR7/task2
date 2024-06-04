const fs = require('fs');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;

const BASE_URL = 'https://loige.co';
const BASE_PATH = 'web';
const LEVELS = 3;
let linkArr = [];

function parse(url, currentLevel) {
  if (currentLevel > LEVELS) return;

  return fetch(url)
    .then(res => res.text())
    .then(data => {
      const dom = new JSDOM(data);
      const links = [];

      for (const link of dom.window.document.links) {
        if (!link.href.includes('http')) {
          links.push(BASE_URL + link.href);
        }
      }

      if (!fs.existsSync(`${BASE_PATH}/${currentLevel}`)) {
        fs.mkdirSync(`${BASE_PATH}/${currentLevel}`);
      }

      const filename = url.replaceAll(BASE_URL, '').replaceAll('/', '.');
      fs.writeFile(`${BASE_PATH}/${currentLevel}/page${filename}.html`, data, 'utf8', (err) => {
      });

      links.forEach(link => {
        if (!linkArr.includes(link)) {
          linkArr.push(link);
        } else return;
        parse(link, currentLevel + 1);
      })
    })
    .catch(() => {});
}

function main() {
  parse(BASE_URL, 1);
}

main()

