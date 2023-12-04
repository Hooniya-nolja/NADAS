const { log } = require('console');
var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');
const { updateBidAmtFunc } = require('./functions/updateBidAmtFunc');

let searchKeyword = '스포츠머리띠';

/* 파워링크 입찰가 반영은 3분 30초 이상 소요됨. */
router.get('/', async function(req, res, next) {
  let adRankNum = 0;
  let adGoalRank = 12;
  let bidMax = 500;
  let loopCount = 1;

  const adUrlData = await getAdUrlArr();
  await checkAdRank(adRankNum, adGoalRank, bidMax, adUrlData);
  console.log('\n@@@@@@@@@@ ', req.body.keyword), ' @@@@@@@@@@ ';

  let loop = setTimeout(async function loopFunc() {
    console.log(`\n\n -------------  LOOP  #${loopCount++}  ------------- \n\n`);
    const adUrlData = await getAdUrlArr();
    await checkAdRank(adRankNum, adGoalRank, bidMax, adUrlData);
    loop = setTimeout(loopFunc, 10000)  // 4분 240000,  1시간 3,600,000
  }, 10000);

  res.send(adUrlData);
});

const getAdUrlArr = async () => {
  const browser = await puppeteer.launch({
    // headless: "new"
    headless: false
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 580 });
  await page.goto(`https://ad.search.naver.com/search.naver?where=ad&query=${searchKeyword}`);
  await new Promise((page) => setTimeout(page, 1000));
  const data = await page.evaluate(() => {
    // for (let i=1; i<6; i++) {
    //   window.scrollBy(0, 500*i);
    // }
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
  await page.screenshot({ path: 'screenshot5.png', fullPage: true });
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
