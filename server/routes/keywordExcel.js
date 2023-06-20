const express = require('express');
const router = express.Router();
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

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

router.post('/', function(req, res) {
  try {
    const excelData = req.body.excelData;
    excelDataOver = req.body.excelData;
    console.log('SERVER get data : \n',excelData.length, excelData);
    searchPageCategory(excelData);
    console.log('SEARCH FINISHED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  } catch (err) {
    console.log('ERROR : \n', err);
  }
});

const searchPageCategory = (excelData) => {
  for (let i in excelData) {
    let keywordCategory = 'keywordcategory';
    keywordCategory = searchKeywordCategory(excelData[i].Keyword);
    console.log('return############ keywordCategory : ', keywordCategory);
    excelDataOver[i].Category = keywordCategory;
    console.log('excelDataOver [' + i + '] : \n', excelDataOver);
  }
  setTimeout(function() {
    console.log('excelDataOver : \n', excelDataOver);
  }, 3000);
  console.log('excelDataOver : \n', excelDataOver);
}

const searchKeywordCategory = (keyword) => {
  let api_url = 'https://openapi.naver.com/v1/search/shop.json?query=' + encodeURI(keyword); // JSON 결과
  let searchResult;
  let categoryKinds;

  let request = require('request');
  let options = {
      url: api_url,
      headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
   };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      searchResult = JSON.parse(body).items;
      // console.log(searchResult);
      console.log(searchResult[0].category3);
      console.log('category sum : ', searchResult[0].category1 + searchResult[0].category2 + searchResult[0].category3);
      console.log('category sum : ', searchResult[0].category1 +'>'+ searchResult[0].category2 +'>'+ searchResult[0].category3);
      categoryKinds = getCategoryKinds(searchResult);
      // return getCategoryKinds(searchResult);
      console.log('categoryKinds : ', categoryKinds);
      return categoryKinds;
    } else {
      console.log('error = ' + response.statusCode);
    }
  });

  return categoryKinds;
}

const getCategoryKinds = (searchResultArr) => {
  let keywordCategoryArr = [searchResultArr[0].category1 +'>'+ searchResultArr[0].category2 +'>'+ searchResultArr[0].category3 +'>'+ searchResultArr[0].category4];
  let productCategory;
  for(let i=1; i<10; i++){
    productCategory = searchResultArr[i].category1 +'>'+ searchResultArr[i].category2 +'>'+ searchResultArr[i].category3 +'>'+ searchResultArr[i].category4;
    if (productCategory !== keywordCategoryArr[0]) keywordCategoryArr.push(productCategory);
  }
  console.log('keywordCategoryArr : \n', keywordCategoryArr);
  return keywordCategoryArr;
}

module.exports = router;
