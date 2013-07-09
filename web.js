var express = require('express');
var fs = require('fs')
var b = new Buffer('I am a string',"utf-8");

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  b=fs.readFileSync('~/index.html');
  response.send(b.toString('utf-8');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
