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

const getSignature = async (timestamp, method, uri) => {
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(`${timestamp}.${method}.${uri}`);
  return hmac.digest('base64');
}

const getRequestOptions = async (uri, method, params = {}, bid) => {
  const timestamp = Date.now();
  const signature = await getSignature(timestamp, method, uri);
  console.log('### url : ', `${BASE_URL}${uri}`);
  const options = {
    url: `${BASE_URL}${uri}?${qs.stringify(params)}`,
    body: {
      nccAdgroupId: 'grp-a001-01-000000037950249',
      nccKeywordId: 'nkw-a001-01-000005714528286',
      bidAmt: bid,
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

const updateKeywordBid = async (bid) => {
  const uri = '/ncc/keywords/nkw-a001-01-000005714528286';  // Adkeyword update API
  const params = {
    fields:  'bidAmt',
  };
  // const params = 'nad-a001-02-000000146518095';
  const options = await getRequestOptions(uri, 'PUT', params, bid);
  // const options = getRequestOptions(uri);


  return new Promise((resolve, reject) => {
    request.put(options, (error, request, response, body) => {
      if (error) {
        console.log('REQUEST ERROR --- \n', error);
        reject(error);
      } else {
        // console.log('response: ', response);
        // console.log('body: ', response.body);
        // console.log('request: ', request.body);
        resolve(response);
      }
    });
  });
}

const getCurrentBid = async () => {
  const uri = '/ncc/keywords/nkw-a001-01-000005714528286';  // Adkeyword update API
  const params = {
  };
  // const params = 'nad-a001-02-000000146518095';
  const options = await getRequestOptions(uri, 'GET', params);

  return new Promise((resolve, reject) => {
    request.get(options, (error, request, response, body) => {
      if (error) {
        console.log('REQUEST ERROR --- \n', error);
        reject(error);
      } else {
        // console.log('response: ', response);
        // console.log('### RESPONSE.BIDAMOUNT: ', response.bidAmt);
        // console.log('request: ', request.body);
        resolve(response);
      }
    });
  });
}

module.exports = { updateKeywordBid, getCurrentBid };