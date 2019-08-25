
var playerBnds = {};

//HTML script init
function runit(){  
    console.log("hello");
    //zoom();
    addBoundary(); // change name?
}
//

//Shortname element retrieval
function get(id){
    return document.getElementById(id);
}
//

function bndId(node){
    try{
        var id = (node.target.id.startsWith('_f')) ? node.target.id : node.target.parentElement.id;
    }
    catch{
        id = false;
    }
    return id;
}

canvas = get('main');
context = canvas.getContext('2d');
var clicked;
var cx = 0, cy = 0;
var bndCanvas = [];
var bndImages = [];
var clickId;
var del;
var resizetop, resizing, dontgrab;
var canvas, context;
var bndClickX = 0, bndClickY = 0;
var oobX = 0, oobY = 0;
var scrollClick, oob;

function movBound(e){
    var b = get(clickId);
    b.style.position ='absolute';
    if(bndClickX != 0 && bndClickY !=0){
        b.style.left = (e.x)-(bndClickX)+'px';//-(b.clientWidth/3)+'px';
        b.style.top = (e.y)-(bndClickY)+'px';//-(b.clientHeight/3)+'px';
    }

    bndLoc = [b.style.left,b.style.top,b.style.width,b.style.height]
    bndChilds = [b.children[0].innerText,b.children[1].src]

}
function boundaryHover(e){
    //console.log("Hovering in "+e.target.id);

    if(del){
        b = get(bndId(e));
        b.remove();
        del = false;

    }
    var hoverNode = (e.target.id=='') ? false : bndId(e);

    if(clicked && hoverNode==clickId){
        movBound(e);
    }

    if(!hoverNode){
        //console.log('oob');
        oobX = e.clientX;
        oobY = e.clientY;
        oob = true;
        movBound(e);
    }

    if(e.layerY < 50){
        //console.log('resize?');
        resizetop = true;
    }else resizetop = false;

    if(dontgrab){
        //console.log("resizing");
        b = get(bndId(e));
        //console.log(b);        
    }
}

function boundaryClick(e){
    
    if(e.button != 2){


        var b;
        if(clicked || clicked && oob){
            
            clicked = false;
            bndClickX = 0;
            bndClickY = 0;

            
            id = bndId(e);
            b = get(id);
            console.log(b);
            clickId = '';
            if(!b || bndImages.indexOf(id) < 0){
                b.style.borderColor = "black";
                b.style.cursor = 'grab';
            } else {
                b.style.border = '';
                b.style.cursor = 'grab';
            }
            
            b.style.zIndex = "-1"; //when not moving a boundary, move it to the back
        }else {
            b = get(bndId(e));
            console.log(e); 
            clickId = bndId(e);
            movBound(e);
            b.style.border = "solid";
            b.style.borderColor = "red";
            b.style.zIndex = "0";
            b.style.cursor = 'grabbing';
            bndClickX = e.layerX;
            bndClickY = e.layerY;
            clicked = true;
        }
    }
}

function fileDrop(e, bg){
    if(e){
        console.log(e);
        id = e.target.id;
        
        e.stopPropagation();
        e.preventDefault();
         
        var items = e.dataTransfer.items;
        var files = e.dataTransfer.files;


        if(files.length > 0){
            if(files[0].type.startsWith('image')){
                console.log(files[0]);
                
                let reader = new FileReader()
                reader.readAsDataURL(files[0])
                reader.onloadend = function() {
                    if(bg){
                        document.body.style.backgroundImage = "url("+reader.result+")";
                        document.body.style.backgroundSize = 'cover';
                    }else{
                        var boundary = get(id);
                        boundary.children[1].src = reader.result;
                        boundary.children[1].style.height = "100%";
                        boundary.children[1].style.width = "100%";
                        boundary.children[1].style.zIndex = "0";
                        boundary.style.border = '';
                    }
                }
                
            }
            if(files[0].type.startsWith('text')){
                let reader = new FileReader()
                reader.readAsText(files[0])
                reader.onloadend = function() { 
                    var boundary = get(id);
                    boundary.innerText = reader.result;
                    boundary.fontSize = boundary.width*.1+'px'; 
                }
            }
            bndImages.push(id);
        }
        else if(items.length > 0){
            if(bg){
                document.body.style.backgroundImage = "url("+e.dataTransfer.getData('text/x-moz-url-data')+")";
            }
            else{
                var boundary = get(id);
                boundary.children[1].src = e.dataTransfer.getData('text/x-moz-url-data');
                boundary.children[1].style.height = "100%";
                boundary.children[1].style.width = "100%";
                boundary.children[1].style.zIndex = "0";
                boundary.style.border = '';
            }
            bndImages.push(id);
        }
        return false;
    }
}

function bndText(e){
    var boundary = get(clickId);
    boundary.childNodes[1].innerText = 'text here';
}
function deleteBoundary(e){
    var boundary = get(clickId);
    boundary.remove();
}

//Boundaries
var boundCnt = 0;
var boundaries = [];
function addBoundary(){
    var boundId = "_f"+boundCnt;
    board = get('board');
    board.innerHTML += 
        "<span class='fz' id='"+boundId+"' style='border:solid;width:25px;height:25px;'>\
        <p contenteditable='true' style='font-size:.1px; word-wrap:break-word;'></p>\
        <img id='"+boundId+"'/>\
        </span>";
    boundaries.push(boundId);
    boundCnt++;
    return boundId;
}

//Zoom
var zooming = false;
w = 0;
var outOfBnd = false;
function zoom(e){
    var scrollLocation = String(e.target.id);    
    if(scrollLocation.startsWith('_f')){
        fileBoundary = get(scrollLocation);
        if(boundaries.indexOf(scrollLocation) > -1){
            bw = fileBoundary.style.width;
            bl = fileBoundary.style.left;
            bt = fileBoundary.style.top;
            bw = parseInt(String(bw).replace('px',''));
            bl = parseInt(String(bl).replace('px',''));
            
            zm = 0;
            (e.deltaY < 0) ? zm=10 : zm=-10;
            
            fileBoundary.style.width = zm+bw+'px';
            fileBoundary.style.height = zm+bw+'px';

            text = fileBoundary.children[0];
            text.style.fontSize = bw*.1+'px';
            //console.log(text);
        }
    }    
    if(oob){
        console.log('oob');
        console.log(document.getElementsByTagName('span'))
    }
}
//

//Events

//Scrolling
window.addEventListener('wheel',(zoom));

//window.addEventListener('mousedown', (resize));
//window.addEventListener('mouseup', (resize));

//For tracking mouse location and boundary dragging
window.addEventListener('mousemove',(e)=> {
    //(e.target.id!='' || clicked) ? boundaryHover(e) : '';
    boundaryHover(e)
    
}); 
window.addEventListener('click',(e)=> {
    // boundaryClick(e)
    id = (e.target.id=='') ? '' : bndId(e);

    (id!='' && id.startsWith('_f') || oob) ? boundaryClick(e) : '';
    //(e.target.id!='') ? boundaryClick(e) : (String(e).indexOf('Para') >-1) ? console.log('123') : boundaryClick(e);
});

//For handling file drops
window.addEventListener('dragover', (e)=> e.preventDefault(), false);
window.addEventListener('drop', (e)=> {
    (e.target.id!='') ? fileDrop(e, false) : fileDrop(e, true); //Sets image for boundary or background
});

//For creating and deleting boundaries
window.addEventListener('keypress',(e)=>{
    (e.key=='=') ? addBoundary(false) : '';
    (e.key=='-') ? deleteBoundary(e) : '';
    (e.key=='t') ? bndText(e) : '';
    
    
});
