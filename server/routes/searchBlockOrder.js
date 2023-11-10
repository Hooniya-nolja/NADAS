const { log } = require('console');
const puppeteer = require('puppeteer');

const searchBlockOrder = async (excelData, res) => {
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();

    for (let i in excelData) {
      let searchURL = `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${excelData[i].Keyword}`;
      await page.goto(searchURL);
      console.log(searchURL);

      let tabNameArr = await page.evaluate(() => {

        try {
          let tabArrTemp = document.querySelectorAll('[role=tablist]');

          let tabNameArrTemp = [];
          for (let k in tabArrTemp) {
            tabNameArrTemp.push(document.querySelectorAll('[role=tablist] > [role=presentation]')[k].innerText);
          }
          return tabNameArrTemp;
        } catch (err) {
          console.log('EVALUATE ERROR :: ', err);
        }
      });

      for (let j in tabNameArr) {
        if (tabNameArr[j] == '쇼핑') {
          excelData[i].BlockRank = Number(j)+1;
        }
      }
      if (excelData[i].BlockRank < 1) excelData[i].BlockRank = '8위 밖';
      console.log('#',i,` BlockRank of [${excelData[i].Keyword}] : `, excelData[i].BlockRank);
    }

    await browser.close();
    return excelData;
}

module.exports = { searchBlockOrder };

