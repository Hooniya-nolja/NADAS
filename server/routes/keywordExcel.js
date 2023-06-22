const express = require('express');
const router = express.Router();
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { response } = require('../app');
const { resolve } = require('path');

let client_id = 'lUVXg6tiDzC4LmrpRtIa';
let client_secret = 'rfhbfOAfPV';
let excelDataOver;

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

router.post('/', async (req, res) => {
  try {
    const excelData = req.body.excelData;
    excelDataOver = req.body.excelData;

    await searchPageCategory(excelData, res)
    console.log('=============== Here is routerPOST =============== \n');

    res.send(excelDataOver);
    // setTimeout(function() {
    //   res.send(excelDataOver);
    // }, 3000);
    console.log('SEARCH FINISHED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    return 0;
  } catch (err) {
    console.log('ERROR : \n', err);
    return res.status(res.statusCode).end();
  }
});

const searchPageCategory = async (excelData, res) => {
  try {
    console.log('HERE222222222');

    for (let i in excelData) {
      console.log('HERE33333333333');
      let keywordCategory = 'keywordcategory';
      keywordCategory = await searchKeywordCategory(excelData[i].Keyword, i, res);
      await apiDelay(100);
      console.log('HERE44444444444');
    }

    // console.log('HERE33333333333');
    // await searchKeywordCategory(excelData[0].Keyword, 0, res);
    // console.log('HERE44444444444');

    // console.log('HERE55555555555');
    // await searchKeywordCategory(excelData[1].Keyword, 1, res);
    // console.log('HERE666666666666');

    console.log('=============== Here is searchPageCategory finish =============== \n');
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
        console.log('Before REQUEST #######\n');
        categoryKinds = getCategoryKinds(searchResult);
        console.log('categoryKinds : ', categoryKinds);
        excelDataOver[num].Category = categoryKinds;
        resolve(categoryKinds);
        // return categoryKinds;
      } else {
        console.log('error = ' + response.statusCode + '\n ERROR at API REQUEST :: ' + error);
        resolve(res.status(response.statusCode).end());
        // return res.status(response.statusCode).end();
      }
    });
  
    return categoryKinds;
  }).catch(function(error) { console.log('ERROR at searchKeyWordCategory catch : \n' + error); });

}

const getCategoryKinds = (searchResultArr) => {
  let keywordCategoryArr = [searchResultArr[0].category1 +'>'+ searchResultArr[0].category2 +'>'+ searchResultArr[0].category3 +'>'+ searchResultArr[0].category4];
  let productCategory;
  for(let i=1; i<10; i++){
    productCategory = searchResultArr[i].category1 +'>'+ searchResultArr[i].category2 +'>'+ searchResultArr[i].category3 +'>'+ searchResultArr[i].category4;
    if (!keywordCategoryArr.includes(productCategory)) keywordCategoryArr.push(', ', productCategory);
  }
  console.log('keywordCategoryArr : \n', keywordCategoryArr);
  return keywordCategoryArr;
}

// async function testFunc() {
//     setTimeout(function() {
//       console.log('THIS IS testFunc !@#@!#!@#@!#\n');
//       resolve();
//     }, 1000);
// }
function apiDelay(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // console.log('THIS IS testFunc !@#@!#!@#@!#\n')
      resolve();
    }, time);
  });
}

module.exports = router;
