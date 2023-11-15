var express = require('express');
var router = express.Router();

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const crypto = require('crypto');
const request = require('request');
const qs = require('querystring');
const { time, log } = require('console');

const API_KEY = '01000000005730892ec2c19e4603cf90850a1e9393c030b0858faa13f71ab97559dd9f3025';
const SECRET_KEY = 'AQAAAABXMIkuwsGeRgPPkIUKHpOTaNggOD0lE91wqOZIG+qz/A==';
const CUSTOMER_ID = '2091136';

const BASE_URL = 'https://api.searchad.naver.com';

/* GET users listing. */
router.get('/', function(req, res, next) {
  // getRelKwdStatApi();
  getKeywordList();
  res.send('@@@@@@@@@@@@@connectAdAPI@@@@@@@@@@@');
});

const getSignature = (timestamp, method, uri) => {
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(`${timestamp}.${method}.${uri}`);
  return hmac.digest('base64');
}

const getRequestOptions = (uri, params = {}) => {
  const timestamp = Date.now();
  const signature = getSignature(timestamp, 'PUT', uri);
  // const signature = getSignature(timestamp, 'GET', '/ncc/ads');
  // const paramsTemp = 'grp-a001-02-000000033382631';
  console.log('### url : ', `${BASE_URL}${uri}`);
  const options = {
    url: `${BASE_URL}${uri}?${qs.stringify(params)}`,
    body: {
      nccAdgroupId: 'grp-a001-01-000000037950249',
      nccKeywordId: 'nkw-a001-01-000005714528286',
      bidAmt: 300,
      useGroupBidAmt: false
    },

    headers: {
      'X-Timestamp': timestamp,
      'X-API-KEY': API_KEY,
      'X-Customer': CUSTOMER_ID,
      'X-Signature': signature,
    },
    json: true,
  };
  return options;
}

const getKeywordList = (keyword) => {
  const uri = '/ncc/keywords/nkw-a001-01-000005714528286';  // Adkeyword update API
  const params = {
    fields:  'bidAmt',
  };
  // const params = 'nad-a001-02-000000146518095';
  const options = getRequestOptions(uri, params);
  // const options = getRequestOptions(uri);


  return new Promise((resolve, reject) => {
    request.put(options, (error, request, response, body) => {
      if (error) {
        console.log('REQUEST ERROR --- \n', error);
        reject(error);
      } else {
        // request.body.bidAmt = 100;
        console.log('response: ', response);
        console.log('body: ', response.body);
        console.log('request: ', request.body);

        // resolve({
        //   bidAmt: 100
        // });
        resolve(body);
      }
    });
  });
}

module.exports = router;
