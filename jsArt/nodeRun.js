var express = require('express')
var app = express();
var http = require('http').Server(app);
var myParser = require("body-parser");

app.use(express.static(__dirname));
app.get('/*', function(req, res){
  res.sendFile('index.html', { root: __dirname });
});
http.listen(10001, ()=>{console.log("Running...")});
