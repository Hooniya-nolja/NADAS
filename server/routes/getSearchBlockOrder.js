const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=땀복');
  const data = await page.evaluate(() => {
    return {
      title: document.title,
      // body: document.querySelectorAll('.lnb_menu .base > li')[2].innerText
      body: document.querySelectorAll('[role=tablist] ')
    }
  });
  await browser.close();
  res.send(data);
});

module.exports = router;