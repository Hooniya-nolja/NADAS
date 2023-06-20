var express = require('express');
// var request = require('request');
var router = express.Router();

var client_id = 'lUVXg6tiDzC4LmrpRtIa';
var client_secret = 'rfhbfOAfPV';

router.get('/', function (req, res) {
    var api_url = 'https://openapi.naver.com/v1/search/shop.json?query=' + encodeURI('땀복'); // JSON 결과
    // var api_url = 'https://openapi.naver.com/v1/search/shop.json?query=' + encodeURI(req.query.query); // JSON 결과

    var request = require('request');
    var options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
     };
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
        res.end(body);
      } else {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    });
  });

module.exports = router;
