var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
  res.sendFile('index.html');
});

app.post('/title', function(req, res){
  var url = req.body.url;
  request(url, function (err, resquest, body) {
    if (!err && res.statusCode == 200) {
      var title = 'no title found';
      body = body.replace(/\n/g,'');
      var match=body.match(/<title>(.*)<\/title>/im);
      if (match && match.length>1){
        title= (''+match[1]).trim();
      }
      res.send({title: title}); 
    }
  });
});

module.exports = app;