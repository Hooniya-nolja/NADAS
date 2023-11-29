const { log } = require('console');
var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');
const { updateBidAmtFunc } = require('./functions/updateBidAmtFunc');

let searchKeyword = '스포츠머리띠';

/* 파워링크 입찰가 반영은 3분 30초 이상 소요됨. */
router.get('/', async function(req, res, next) {
  let adRankNum = 0;
  let adGoalRank = 10;
  let bidMax = 300;
  let loopCount = 1;
  const adUrlData = await getAdUrlArr();

  let loop = setTimeout(async function loopFunc() {
    await checkAdRank(adRankNum, adGoalRank, bidMax, adUrlData);
    console.log(`\n\n -------------  LOOP  #${loopCount++}  ------------- \n\n`);
    loop = setTimeout(loopFunc, 10000)
  }, 10000);

  res.send(adUrlData);
});

const getAdUrlArr = async () => {
  const browser = await puppeteer.launch({
    headless: "new"
  });
  const page = await browser.newPage();
  await page.goto(`https://ad.search.naver.com/search.naver?where=ad&query=${searchKeyword}`);
  const data = await page.evaluate(() => {
    let adUrlClassArr = document.querySelectorAll('.lst_type > li .inner .url_area .url');
    let adUrlArr = [];
    for (let k in adUrlClassArr) {
      adUrlArr.push(adUrlClassArr[k].innerText);
    }
    return {
      adUrlArr: adUrlArr.filter((e) => e != null),
      adUrlClassArr: adUrlClassArr
    }
  });
  await browser.close();
  console.log('adUrlArr ===== ', data.adUrlArr);
  return data;
}

const checkAdRank = async (adRankNum, adGoalRank, bidMax, adUrlData) => {
  for (let i in adUrlData.adUrlArr) {
    // console.log('This is #', i, ' check');
    if (adUrlData.adUrlArr[i] && adUrlData.adUrlArr[i].indexOf('blacktula') > -1) { // 내 광고일 때
      adRankNum = parseInt(i)+1;
      if (adRankNum == adGoalRank) {
        console.log(`#${i} Goal!!!`);
        break;
      } else {
        console.log(`#${i} Not goal.... adRankNum is ${adRankNum} // adGoalRank is ${adGoalRank}`);
        adjustBidAmt(adRankNum, adGoalRank, bidMax);
        break;
      }
    }
  }
  if (adRankNum < 1) {
    adNotFound();
  }
}

const adjustBidAmt = (adRankNum, adGoalRank, bidMax) => {
  updateBidAmtFunc(adRankNum, adGoalRank, bidMax);
}

const adNotFound = () => {
  console.log('AD NOT FOUND ::: ');
}

module.exports = router;
