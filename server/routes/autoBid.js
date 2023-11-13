const { log } = require('console');
var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');

/* 파워링크 입찰가 반영은 3분 30초 이상 소요됨. */
router.get('/', async function(req, res, next) {
  let adRankNum;
  let adGoalRank = 3;
  let searchKeyword = '스포츠머리띠';
  const browser = await puppeteer.launch({
    headless: "new"
  });
  const page = await browser.newPage();
  await page.goto(`https://ad.search.naver.com/search.naver?where=ad&query=${searchKeyword}`);
  const data = await page.evaluate(() => {
    let adUrlClassArr = document.querySelectorAll('.lst_type > li .inner .url_area .url');
    let adUrlArr = [];
    for (let k in adUrlClassArr) {
      adUrlArr.push(document.querySelectorAll('.lst_type > li .inner .url_area .url')[k].innerText);
    }
    // return {
    //   title: document.title,
    //   body: document.querySelectorAll('.lst_type > li .inner .url_area .url') // [n].innerText
    // }
    return {
      adUrlArr: adUrlArr,
      adUrlClassArr: adUrlClassArr
    }
  });
  await browser.close();

  console.log('adUrlArr ===== ', data);

  for (let i in data.adUrlArr) {
    if (data.adUrlArr[i] && data.adUrlArr[i].indexOf('blacktula') > -1) {
      adRankNum = i+1;
      if (adRankNum == adGoalRank) {
        console.log(`#${i} Goal!!!`);
      } else {
        console.log(`#${i} Not goal....`);
      }
      // res.send(data);
    } else if(!data.adUrlArr[i]) {
      console.log(`${i} Here is NULL value***`);
    } else {
      console.log(`#${i} There is no your AD with "${searchKeyword}" keyword`);
    }
  }

  res.send(data);
});

module.exports = router;
