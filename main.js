var V = function(x,y,z){
  this.x = parseFloat(x);
  this.y = parseFloat(y);
  this.z = parseFloat(z);
};

var V2D = function(x,y){
  this.x = parseFloat(x);
  this.y = parseFloat(y);
};

var center = new V(canvas.width / 2, canvas.height / 2 ,canvas.height / 2);
var hidariue = new V(canvas.getBoundingClientRect().left, canvas.getBoundingClientRect().top, canvas.getBoundingClientRect().top);

var Stars = [
  new V(center.x + 0,center.y + 0,center.z + 0),
  new V(center.x + 20,center.y + 30,center.z + 60),
  new V(center.x + 50,center.y + 20,center.z + 70),
  new V(center.x + 40,center.y + 30,center.z + 50),
  new V(center.x + 60,center.y + 70,center.z + 80),
  new V(center.x + 10,center.y + 50,center.z + 30),
  new V(center.x + 60,center.y + 10,center.z + 0),
  new V(center.x + 20,center.y + 80,center.z + 30),
];

var Lines = [
  [Stars[0],Stars[1]],
  [Stars[1],Stars[2]],
  [Stars[2],Stars[3]],
  [Stars[3],Stars[4]],
  [Stars[3],Stars[5]],
  [Stars[2],Stars[6]],
  [Stars[5],Stars[7]]
];

var O = project(Stars[0]);

function project(M){
  return new V2D(M.x,M.z);
}

function render(line_arry,ctx ,star) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i=0, n = line_arry.length; i<n; ++i){

    var P1 = project(Lines[i][0]);
    var P2 = project(Lines[i][1]);
    ctx.beginPath();
    ctx.moveTo(P1.x,P1.y);
    ctx.lineTo(P2.x,P2.y);

    if(P1.x == P2.x && P1.y == P2.y){
      var Q = new V(P1.x,P2.y);
    }else{
      Q = new V(P2.x,P2.y)
    }
    ctx.fillRect(Q.x-2.5,Q.y-2.5,5,5);
    ctx.fillRect(O.x-1,O.y-1,2,2);

    ctx.closePath();
    ctx.stroke();
  }
  /*
  for (var j=0, m = star.length; i<m; ++j){
    var Q = project(Stars[j]);
    ctx.strokeRect(Q.x,Q.y,3,3)
  }
  */

}



(function(){

  var canvas = document.getElementById("canvas");

  var dx = canvas.width / 2;
  var dy = canvas.height / 2;

  var ctx = canvas.getContext("2d");
  ctx.strokeStyle = "rgb(255, 255, 255)"
  ctx.fillStyle = "rgb(244,255,70)"
  
  //var center = new V(canvas.width / 2, canvas.height / 2 ,canvas.height / 2);

  render(Lines,ctx,Stars);

  /*
  ctx.beginPath();
  ctx.moveTo(30,50);
  ctx.lineTo(200,30);
  ctx.closePath();
  ctx.stroke();
  ctx.stroke
  */



  //event
  var mousedown = false;
  var pan = false;
  var mx = 0;
  var my = 0;
  var pan_x = 0;
  var pan_y = 0;

  canvas.addEventListener("mousedown", initMove);
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", stopMove);
  document.addEventListener("wheel", zoom, false);
  canvas.addEventListener("click", active);


  canvas.oncontextmenu = function(evt){
    return false;
  }

  //rotate
  function rotate(M, center, theta, phi){
    var ct = Math.cos(theta);
    var st = Math.sin(theta);
    var cp = Math.cos(phi);
    var sp = Math.sin(phi);

    var x = M.x - center.x;
    var y = M.y - center.y;
    var z = M.z - center.z;

    M.x = ct * x - st * cp * y + st * sp * z + center.x;
    M.y = st * x + ct * cp * y - ct * sp * z + center.y;
    M.z = sp * y + cp * z + center.z;
  }

  //pan
  function pan_move(mousex,mousey,cen, evt, ctx){
    var scene = project(cen);
    var nx = evt.clientX;
    var ny = evt.clientY;
    
    ctx.translate(-(mousex-nx)/8,-(mousey-ny)/8);
  }


  function initMove(evt){
    if(typeof evt === "object"){
      switch(evt.button){
        case 0:
          clearTimeout(autrotate_timeout);
          mx = evt.clientX;
          my = evt.clientY;

          for(var i=0; i<Stars.length; ++i){
            var AC_S = project(Stars[i]);
            if(AC_S.x+50 >= mx && mx >= AC_S.x-50){
              console.log("active" + Stars[i]);
            }else{
              console.log("not");
              mousedown = true;
              return;
            }
          }

          break;
        case 2:
          pan = true;
          pan_x = evt.clientX;
          pan_y = evt.clientY;
          break;
      }
    }else{
      return;
    }
  }

  function move(evt){
    if(mousedown){
      var theta = (evt.clientX - mx) * Math.PI / 360;
      var phi = (evt.clientY - my) * Math.PI / -360;

      for(var i = 0; i < Stars.length; ++i){
        rotate(Stars[i], center, theta, phi);
      }

      mx = evt.clientX;
      my = evt.clientY;

      render(Lines,ctx,Stars);
    }

    if(pan){
      var mousex

      for(var j = 0; j<Stars.length; ++j){
        pan_move(pan_x, pan_y, center, evt, ctx);
      }
      pan_x = evt.clientX;
      pan_y = evt.clientY;
      render(Lines,ctx,Stars);
      
    }
  }

  function stopMove(){
    mousedown = false;
    pan = false;
  }

  //zoom
  function zoom(){
    if(event.wheelDelta > 0){
      var sca = 1.1
      zmx = center.x * 1.1;
      zmy = center.y * 1.1;
    }else{
      var sca = 0.9
      zmx = center.x * 0.9;
      zmy = center.y * 0.9;
    }
    ctx.beginPath();
    ctx.scale(sca, sca);
    //ctx.translate(zmx,zmy);
    
    render(Lines,ctx,Stars);
    ctx.closePath();
    ctx.stroke();

  }

  //星選択
  function active(evt){
  }

  function autorotate(){
    for(var i = 0; i<Stars.length; ++i){
      rotate(Stars[i], center, -Math.PI / 720, Math.PI /720);
    }

    render(Lines,ctx,Stars);
    autrotate_timeout = setTimeout(autorotate,30);
  }
  autrotate_timeout = setTimeout(autorotate, 2000);
})();