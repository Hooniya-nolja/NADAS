const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=%EB%95%80%EB%B3%B5');
  const data = await page.evaluate(() => {
    return {
      title: document.title,
      body: document.querySelectorAll('.lnb_menu .base > li')[1].innerText
    }
  });
  await browser.close();
  res.send(data);
});

module.exports = router;