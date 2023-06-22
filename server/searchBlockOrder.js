const puppeteer = require('puppeteer');

const searchBlockOrder = async (excelData, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (let i in excelData) {
      let searchURL = `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${excelData[i].Keyword}`;
      await page.goto(searchURL);
      console.log(searchURL);
      // let data = await page.evaluate(() => {
      //   try {
      //     // console.log('excelDATA : ', excelData);
      //     let tabName = document.querySelectorAll('.lnb_menu .base > li');
      //     for (let j in tabName) {
      //       if (tabName[j].innerText == '쇼핑') excelData[i].BlockRank = j+1;
      //     }
      //     if (excelData[i].BlockRank < 1) excelData[i].BlockRank = '8위 밖';
      //     return excelData;
      //   } catch (err) {
      //     console.log('EVALUATE ERROR :: ', err);
      //   }

      // });

      let tabNameArr = await page.evaluate(() => {
        try {
          let tabArrTemp = document.querySelectorAll('.lnb_menu .base > li');
          let tabNameArrTemp = [];
          for (let k in tabArrTemp) {
            tabNameArrTemp.push(document.querySelectorAll('.lnb_menu .base > li')[k].innerText);
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

    // await page.goto('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=땀복');
    // const data = await page.evaluate(() => {
    //   return {
    //     title: document.title,
    //     body: document.querySelectorAll('.lnb_menu .base > li')[2].innerText
    //   }
    // });
