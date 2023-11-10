const express = require('express');
const router = express.Router();
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { response } = require('../app');
const { resolve } = require('path');
const { searchBlockOrder } = require('./searchBlockOrder.js');
// import { searchBlockOrder } from '../searchBlockOrder.js';
// const searchBlockOrderFunc = searchBlockOrder.searchBlockOrder();

let client_id = 'lUVXg6tiDzC4LmrpRtIa';
let client_secret = 'rfhbfOAfPV';
let excelDataOver;
let searchCount = 1;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const whitelist = [
  "http://localhost:3000",
  "http://localhost:5000",
  "http://127.0.0.1:3000",
  "http://127.0.01:5000",
];

var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true, credentials: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
app.use(cors(corsOptionsDelegate));

const wrap = asyncFn => {
  return (async (req, res, next) => {
    try {
      return await asyncFn(req, res, next)
    } catch (error) {
      return next(error)
    }
  })  
}

router.post('/', wrap(async(req, res) => {
  try {
    const excelData = req.body.excelData;
    excelDataOver = req.body.excelData;

    // const search = () => {
    //   return new Promise((resolve) => {
    //     searchPageCategory(excelData, res);
    //     searchBlockOrder(excelData, res);
    //     resolve();
    //   });
    // }

    await searchPageCategory(excelData, res);
    await searchBlockOrder(excelData, res);
    // category 찾아둔것 미리 저장
    // block 찾아둔것 따로 저장
    // 서로 동시 실행하고 여기서 차례대로 대입하자

    res.send(excelDataOver);
    searchCount = 1;
    return 0;
  } catch (err) {
    console.log('ERROR : \n', err);
    return res.status(res.statusCode).end();
  }
}));

const searchPageCategory = async (excelData, res) => {
  try {
    console.log('excelData at searchPageCategory FUNCTION : \n', excelData);
    for (let i in excelData) {
      await searchKeywordCategory(excelData[i].Keyword, i, res);
      await apiDelay(50);
    }

    // console.log('=============== Here is searchPageCategory finish =============== \n');
    return 0;
  } catch (error) {
    console.log('ERROR :: error in searchPageCategory Function\n ' + error);
    return res.status(res.statusCode).end();
  }
}

const searchKeywordCategory = (keyword, num, res) => {
  return new Promise((resolve) => {
    let api_url = 'https://openapi.naver.com/v1/search/shop.json?query=' + encodeURI(keyword); // JSON 결과
    let searchResult;
    let categoryKinds;
  
    let request = require('request');
    let options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
     };
    request.get(options, async function (error, response, body) {
      if (!error && response.statusCode == 200) {
        searchResult = JSON.parse(body).items;
        categoryKinds = getCategoryKinds(searchResult);
        console.log('#',searchCount,` categoryKinds of [${excelDataOver[num].Keyword}] : `, categoryKinds);
        searchCount++;
        excelDataOver[num].Category = categoryKinds;
        resolve(categoryKinds);
      } else {
        console.log('error = ' + response.statusCode + '\n ERROR at API REQUEST :: ' + error);
        resolve(res.status(response.statusCode).end());
      }
    });
  
    return categoryKinds;
  }).catch(function(error) { console.log('ERROR at searchKeyWordCategory catch : \n' + error); });

}

const getCategoryKinds = (searchResultArr) => {
  let keywordCategoryString = '';
  if (searchResultArr.length) {
    let keywordCategoryArr = [searchResultArr[0].category1 +'>'+ searchResultArr[0].category2 +'>'+ searchResultArr[0].category3 +'>'+ searchResultArr[0].category4];
    let productCategory;
    for(let i=1; i<10; i++){
      if (searchResultArr[i]) {
        productCategory = searchResultArr[i].category1 +'>'+ searchResultArr[i].category2 +'>'+ searchResultArr[i].category3 +'>'+ searchResultArr[i].category4;
        if (!keywordCategoryArr.includes(productCategory)) keywordCategoryArr.push(productCategory);
      } else {}
    }
    keywordCategoryString = keywordCategoryArr.join(' AND ');
  } else {keywordCategoryString = '검색결과가 없는 키워드입니다.';} 

  return keywordCategoryString;
}

function apiDelay(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}



module.exports = router;
