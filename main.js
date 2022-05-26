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

var Stars = [
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
];

function project(M){
  return new V2D(M.x,M.z);
}

function render(line_arry, ctx, dx, dy) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i=0, n = line_arry.length; i<n; ++i){

    var P1 = project(Lines[i][0]);
    var P2 = project(Lines[i][1]);
    ctx.beginPath();
    ctx.moveTo(P1.x,P1.y);
    ctx.lineTo(P2.x,P2.y);

    ctx.closePath();
    ctx.stroke();
  }
}



(function(){

  var canvas = document.getElementById("canvas");

  var dx = canvas.width / 2;
  var dy = canvas.height / 2;

  var ctx = canvas.getContext("2d");
  ctx.strokeStyle = "rgb(255, 255, 255)"
  
  //var center = new V(canvas.width / 2, canvas.height / 2 ,canvas.height / 2);

  render(Lines, ctx, dx, dy);

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
  var mx = 0;
  var my = 0;

  canvas.addEventListener("mousedown", initMove);
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", stopMove);

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

  function initMove(evt){
    clearTimeout(autrotate_timeout);
    mousedown = true;
    mx = evt.clientX;
    my = evt.clientY;
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

      render(Lines, ctx, dx,dy);
    }
  }

  function stopMove(){
    mousedown = false;
  }

  function autorotate(){
    for(var i = 0; i<Stars.length; ++i){
      rotate(Stars[i], center, -Math.PI / 720, Math.PI /720);
    }

    render(Lines, ctx, dx,dy);
    autrotate_timeout = setTimeout(autorotate,30);
  }
  autrotate_timeout = setTimeout(autorotate, 2000);
})();