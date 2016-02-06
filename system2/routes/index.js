var express = require('express');
var router = express.Router();
var path = require('path');


router.get('/', function(req, res, next){

  res.sendFile(path.join(__dirname, '../views', 'index.html'));

});

router.get('/second', function(req, res, next){

  res.sendFile(path.join(__dirname, '../views', 'second.html'));

});

module.exports = router;
