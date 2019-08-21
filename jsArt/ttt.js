
//HTML script init
function runit(){  
    console.log("hello");
    
    //runXO();
    zoom();
    runFileScroll(); // change name?
}
//

//Shortname element retrieval
function get(id){
    return document.getElementById(id);
}
//

//Tic-Tac-Toe with buttons
var XOrun;
function runXO(){
    XOrun = true;
    board = get('board');

    var button;
    for(i=1;i<10;i++){
        board.innerHTML += '<button onclick="XO(this)" class = "button" id='+i+'>&nbsp;</button>';
        console.log(i);
        (i%3==0) ? board.innerHTML+="<br>":'';
    }
}
function XO(that){
    var player = "O";
    var b = [{1:'0',2:'0',3:'0'},{4:'0',5:'0',6:'0'},{7:'0',8:'0',9:'0'}];
    if(XOrun){
        that.innerHTML = player;
        player = (player=="X") ? "O":"X";
    }
}

var clicked;
var cx = 0, cy = 0;
var drawX = 0, drawY = 0;
var bndCanvas = [];
var drawCanvas = []; //All boundaries that are being drawn on
var clickId;
var drawing;



function canvasDraw(e){
    if(drawCanvas.indexOf(e.target.parentElement.id) > -1){
        drawX = e.clientX;
        drawY = e.clientY;
        drawing = true;
        console.log('drawing');
    }
}
function boundaryHover(e){
    //console.log("Hovering in "+e.target.id);
    if(clicked && drawCanvas.indexOf(e.target.parentElement.id)<0 && (e.target.id == clickId || e.target.parentElement.id == clickId)){
        var b = get(clickId);
        b.style.position ='absolute';
        b.style.zIndex = "1";
        b.style.left = e.x-(b.clientWidth/2)+'px';
        b.style.top = e.y-(b.clientHeight/2)+'px';
    }
    if(drawing && drawCanvas.indexOf(e.target.parentElement.id) > -1){
        console.log("drawww");
        var canvas = get('cnv'+e.target.parentElement.id);
        var context = canvas.getContext('2d');
        context.rect(drawX,drawY,1,1);
        // context.beginPath();
        // context.strokeStyle = '#123456';
        // context.lineWidth = 1
        // context.lineJoin = "round";
        // context.moveTo(drawX, drawY);
        // context.lineTo(e.clientX, e.clientY);
        // context.closePath();
        context.stroke();
 
        drawX = e.clientX;
        drawY = e.clientY;
    }
}
function boundaryClick(e){
    console.log(e);
    clickId = (e.target.id.startsWith('_f')) ? e.target.id : e.target.parentElement.id;
    if(clicked){
        clicked = false;
        var b = get(clickId);
        b.style.zIndex = "-1";
        //console.log("Clicked "+e.target.id);
    }else{
        clicked = true;
    
    }
    if(e.button == 2){
        clicked = false;
        var b = get(clickId);
        if(bndCanvas.indexOf(clickId) < 0){ //Add canvas element to a boundary
            b.innerHTML += "<canvas id='cnv"+clickId+"' class='can'></canvas>";
            var cnv = get('cnv'+clickId);
            cnv.width = e.target.width;
            cnv.hieght = e.target.height;
            b.style.borderRadius = '10px';
            bndCanvas.push(clickId);
        }
        else{ //boundary already has a canvas
            

            if(drawCanvas.indexOf(clickId)>-1){ //Canvas is in draw mode, turn off draw mode
                drawCanvas.pop();
                var bndCnvText = get('i'+clickId)
                bndCnvText.remove();
            }else{ //Canvas not in draw mode, turn on draw mode
                b.innerHTML+="<i id='i"+clickId+"'>Drawing</i>";
                drawCanvas.push(clickId);
            }
        }
    }
}
function fileDrop(e, dragging){
    console.log(e);
    if(!dragging){
        id = e.target.id;
        
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files;
        console.log(e);
        if(files[0].type.startsWith('image')){
            console.log(files[0]);
            var boundary = get(id);
            let reader = new FileReader()
            reader.readAsDataURL(files[0])
            reader.onloadend = function() {
                boundary.children[0].src = reader.result;
                boundary.children[0].style.height = "100%";
                boundary.children[0].style.width = "100%";
                boundary.children[0].style.zIndex = "0";
            }
        }
        b = get(id);
        b.style.border = '';

        return false;
    }
}
//File Scroll
var fileRun;
var boundCnt = 0;
var boundaries = [];
function runFileScroll(){
    fileRun=true;
    board = get('board');
    board.innerHTML += "<div class='fz' id='_f"+boundCnt+"' style='width:10px; height:10px; border:solid 2px black;'><img id='_f"+boundCnt+"'/><p contenteditable='true'>>>></p></div>";
    boundaries.push("_f"+boundCnt);
    boundCnt++;
}

//Button Zoom
var zooming = false;
w = 0;
function zoom(){
    function scr(e){
        if(fileRun){
            var scrollLocation = String(e.target.id);       
            if(scrollLocation.startsWith('_f')){
                fileBoundary = get(scrollLocation);
                if(boundaries.indexOf(scrollLocation) > -1){
                    bw = fileBoundary.style.width;
                    bw = parseInt(String(bw).replace('px',''));
                    (e.deltaY < 0) ? bw+=10 : bw-=10;
                    
                    fileBoundary.style.width = bw+'px';
                    fileBoundary.style.height = bw+'px';
                    text = fileBoundary.children[0];
                    text.style.fontSize = bw*.1+'px';
                    console.log(text);
                }
            }
        }
        if(XOrun){
            var buttons = document.querySelectorAll('.button');
            (e.deltaY < 0) ? w+=10 : w-=10; //If scrolling down or up
            for(var i = 0; i < buttons.length; i++){
                buttons[i].style.width = w+'px';
                buttons[i].style.height = w+'px';
            }
        }
    }
    window.addEventListener('wheel',scr);
}
//

window.addEventListener('mousedown', (e)=>canvasDraw(e));
window.addEventListener('mousemove',(e)=> {(e.target.id!='') ? boundaryHover(e) : ''}); 
document.addEventListener('dragover', (e)=> e.preventDefault(), false);
window.addEventListener('drop', (e)=> fileDrop(e, false));
window.addEventListener('click',(e)=> {(e.target.id!='') ? boundaryClick(e) : ''});
window.addEventListener('keypress',(e)=>{(e.key=='=') ? runFileScroll() : ''});
