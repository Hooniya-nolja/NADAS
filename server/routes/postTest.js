const { log } = require('console');
var express = require('express');
var router = express.Router();
var app = express();
const path = require('path');

// app.use(express.static(path.join(__dirname, '../../client/build')));

/* GET home page. */
router.post('/', function(req, res, next) {
  res.send('respond with a resource');
  console.log('post here');
});


// router.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, '../../client/build/index.html'));
// });

module.exports = router;
