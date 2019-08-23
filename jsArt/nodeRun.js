var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var myParser = require("body-parser");

app.use(express.static(__dirname));
app.get('/*', function(req, res){
  res.sendFile('index.html', { root: __dirname });
});

var ims = {};
function init(socket){
  socket.emit('init',true);
  socket.on('bndMove', function(loc, childs, id, sid){
    (sid in ims) ? '' : ims[sid] = [];
    if(childs[1]!='' && ims[sid].indexOf(hash(childs[1]) <0)){
      ims[sid].push(hash(childs[1]));      
    } 
    //console.log(sid, id, childs[1], loc);
    newIm = (hash(childs[1]) in ims[sid]) ? false:true;
    io.emit('update', sid, id, childs, loc, newIm);
  });
}

function hash(str){
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
io.on('connection',init);
http.listen(10001, ()=>{console.log("Running...")});
