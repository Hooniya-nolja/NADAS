var express = require('express');
var router = express.Router();
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors({ origin: 'http://localhost:3000'}));
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
  // res.header("Access-Control-Allow-Origin", "*");
  const excelData = req.body.excelData;
  console.log('SERVER get data : \n', excelData);
});

module.exports = router;
