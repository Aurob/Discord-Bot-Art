var canvas2 = document.getElementById('main');
var context2 = canvas.getContext('2d');
var scroll = document.getElementById('b');
var drawing = false;
var disconnect=false;
var msgLog=[];
var users=[];
var cookie=[];
var oldXY=[];
var userInfo={};
var color = 'red';
var size = 10;


function drawLine(x0, y0, x1, y1, color, size, emit){
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = size;
  context.lineJoin = "round";
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.closePath();
  context.stroke();

  if (!emit) { return; }
  var w = canvas.width;
  var h = canvas.height;
}

function onMouseDown(e){
  if(e.button!=1){
    drawing = true;
    current.x = e.clientX+scroll.scrollLeft;
    current.y = e.clientY+scroll.scrollTop-25;
  }
}

function onMouseUp(e){
  if (!drawing) { return; }
  drawing = false;
  drawLine(current.x, current.y, e.clientX+scroll.scrollLeft, e.clientY+scroll.scrollTop-25, color, size, true);
}

function onMouseMove(e){
  if (!drawing) { return; }
  drawLine(current.x, current.y, e.clientX+scroll.scrollLeft, e.clientY+scroll.scrollTop-25, color, size, true);
  current.x = e.clientX+scroll.scrollLeft;
  current.y = e.clientY+scroll.scrollTop-25;
}

// limit the number of events per second
function throttle(callback, delay) {
  var previousCall = new Date().getTime();
  return function() {
    var time = new Date().getTime();

    if ((time - previousCall) >= delay) {
      previousCall = time;
      callback.apply(null, arguments);
    }
  };
}

function onDrawingEvent(data){
    var w = canvas.width;
    var h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.colors, data.sizes);
}


function loadCanvas(data){
  var w = canvas.width;
  var h = canvas.height;
  for(var a =0;a<data.length;a++){
    drawLine(data[a].x0 * w, data[a].y0 * h, data[a].x1 * w, data[a].y1 * h, data[a].colors, data[a].sizes);
  }
}