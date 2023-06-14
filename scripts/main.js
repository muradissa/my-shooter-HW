// function ShootyController(element,color1,color2) {

function ShootyController(args) {

  var canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  args.parent.appendChild(canvas);
  //element.appendChild(canvas);
  var ctx = canvas.getContext("2d");
  
  var gunRadius = 10;
  var bulletRadius = 5;
  var gun = null;
  var bullets = []; 
  var speed = 5;
  var mouseIsDown = false; 
  var mousePosition = {
    x: null,
    y: null
  }


  /******************* Gun ******************/
  function Gun(color, position) {
    this.x = position.x;
    this.y = position.y;

    this.draw = function(){
      ctx.beginPath();
      ctx.arc(this.x, this.y, gunRadius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
    // Calaculate the distance between click postion and the gun and check if the mose clicked near the gun radius
    this.showGun = function(clickPosition) {
        return (Math.pow(clickPosition.x - this.x, 2) + Math.pow(clickPosition.y - this.y, 2) < Math.pow(gunRadius, 2));
    }
  }
  

  /******************* Bullet ******************/ 
  function Bullet() {
    var x = gun.x;
    var y = gun.y;
    var dy = mousePosition.y - gun.y;
    var dx = mousePosition.x - gun.x;
    var angle = Math.atan2(dy, dx);
    angle = angle*(180 / Math.PI); 
    var angleRad = angle * (Math.PI/180); 

    this.draw = function(){
      ctx.beginPath();
      ctx.arc(x, y, bulletRadius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = args.bulletColor;
      ctx.fill();
    }
    // is it out of the area
    this.isLastUpdate = function() {
      return (x + bulletRadius < 0 ||y + bulletRadius < 0 ||x - bulletRadius > canvas.width ||y - bulletRadius > canvas.height);
    }
    this.updatePosition = function() {
      x = x + speed * Math.cos(angleRad);
      y = y + speed * Math.sin(angleRad);
    }   
  }


  /*** Mouse Postion ***/
  function getMousePostion(event) {
    var rect = canvas.getBoundingClientRect();
    return {'x': event.clientX - rect.left,'y': event.clientY - rect.top}
  }
  
  /*** Events  Listener  (mousedown,mousemove,mouseup,mouseout)***/
  canvas.addEventListener('mousedown', function(event) {
    var clickPosition = getMousePostion(event);
    if (gun) {
      if (gun.showGun(clickPosition)) {
        deleteGun();
      } else {
        mouseIsDown = true;
      }
    } else {
      newGun(args.color, clickPosition);
    }
  })
  canvas.addEventListener('mousemove', function(event) {
    mousePosition = getMousePostion(event);
  });
  canvas.addEventListener('mouseup', function(event) {
    mouseIsDown = false;
  });
  canvas.addEventListener('mouseout', function(event) {
    mouseIsDown = false;
  });


  /*** Draw ***/
  function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the canvas
    drawBullets();
    drawGun();
  }
  function drawGun() {
    if (gun) {
      gun.draw();
    }
  }
  function drawBullets() {
    for (var i = 0; i < bullets.length; i++) {
      var bullet = bullets[i];
      bullet.draw();
      bullet.updatePosition();  
      if (bullet.isLastUpdate()) {
        deleteBullet(i);
      }
    }
  }
  
  /*** New ***/
  function newGun(color, position) {
    gun = new Gun(color, position);
  }
  function newBullet() {
    var bullet = new Bullet();
    bullets.push(bullet);
  }


  /*** Delete ***/
  function deleteGun() {
    gun = null;
  }
  function deleteBullet(i) {
    bullets.splice(i, 1);
  }
  

  /** bullets speed**/
  setInterval(function() {
    if (mouseIsDown) {
      newBullet();
    }
  }, 50);

  setInterval(function() {
    drawCanvas();
  }, 10);
  
}

// var container1 = document.getElementById('container1');
// var interactive1 = new ShootyController(container1, 'red', 'blue');

// var container2 = document.getElementById('container2');
// var interactive2 = new ShootyController(container2, 'green', 'yellow');