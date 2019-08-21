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
    var id = (node.target.id.startsWith('_f')) ? node.target.id : node.target.parentElement.id;
    return id;
}

var clicked;
var cx = 0, cy = 0;
var bndCanvas = [];
var bndImages = [];
var clickId;
var del;

function boundaryHover(e){
    //console.log("Hovering in "+e.target.id);

    if(del){
        b = get(e.target.id);
        b.remove();
        del = false;

    }
    var hoverNode = bndId(e);

    if(clicked && hoverNode==clickId){
        var b = get(clickId);
        b.style.position ='absolute';
        b.style.left = e.x-(b.clientWidth/2)+'px';
        b.style.top = e.y-(b.clientHeight/2)+'px';
    }
}

function boundaryClick(e){
    
    if(e.button != 2){
        var b = get(bndId(e));
        if(clicked){
            clicked = false;
            clickId = '';
            if(bndImages.indexOf(bndId(e)) < 0){
                b.style.borderColor = "black";
            } else b.style.border = '';
            
            b.style.zIndex = "-1"; //when not moving a boundary, move it to the back
        }else {
            console.log(e); 
            clickId = bndId(e);
            b.style.border = "solid";
            b.style.borderColor = "red";
            b.style.zIndex = "0";
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
        "<div class='fz' id='"+boundId+"' style='width:25px;height:25px;'>\
        <img id='"+boundId+"'/>\
        </div>";
    boundaries.push(boundId);
    boundCnt++;
}

//Zoom
var zooming = false;
w = 0;
function zoom(e){
    var scrollLocation = String(e.target.id);       
    if(scrollLocation.startsWith('_f')){
        fileBoundary = get(scrollLocation);
        if(boundaries.indexOf(scrollLocation) > -1){
            bw = fileBoundary.style.width;
            bw = parseInt(String(bw).replace('px',''));
            (e.deltaY < 0) ? bw+=10 : bw-=10;
            
            fileBoundary.style.width = bw+'px';
            fileBoundary.style.height = bw+'px';
            text = fileBoundary.children[1];
            text.style.fontSize = bw*.1+'px';
            //console.log(text);
        }
    }    
}
//

//Events

//Scrolling
window.addEventListener('wheel',(zoom));

//For tracking mouse location and boundary dragging
window.addEventListener('mousemove',(e)=> {
    (e.target.id!='') ? boundaryHover(e) : '';
}); 
window.addEventListener('click',(e)=> {
    (e.target.id!='') ? boundaryClick(e) : '';
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
});
