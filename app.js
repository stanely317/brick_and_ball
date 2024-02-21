const canvas = document.getElementById("myCanvas");
const width = canvas.width;
const height = canvas.height;
const ctx = canvas.getContext("2d");
let circle_x = 160;
let circle_y = 360;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;
let ground_x = 100;
let ground_y = 500;
let brickArray = [];
let count_ball = 0;

function getRandomNumber(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true; // 用來判斷是否要顯示磚塊
  }

  drawBrick() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  checkHitting(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY >= this.y - radius &&
      ballY <= this.y + this.height + radius
    );
  }
}

// 製作所有的磚塊
for (let i = 0; i < 10; i++) {
  new Brick(getRandomNumber(0, 950), getRandomNumber(0, 550));
}

canvas.addEventListener("mousemove", (e) => {
  ground_x = e.clientX; // 設定地板跟隨滑鼠移動
});

function drawCircle() {
  // 確認球是否有打到磚塊
  brickArray.forEach((brick) => {
    if (brick.checkHitting(circle_x, circle_y) && brick.visible) {
      count_ball++;
      console.log(count_ball);
      brick.visible = false; // 確認打到了就隱藏此磚塊
      // 確認撞擊來源方向，改變x或y的速度
      if (circle_x >= brick.x + brick.width) {
        // 從右側撞向磚塊
        xSpeed *= -1;
      } else if (circle_x <= brick.x) {
        // 從左側撞擊
        xSpeed *= -1;
      } else if (circle_y >= brick.y + brick.height) {
        // 從下方撞擊
        ySpeed *= -1;
      } else if (circle_y <= brick.y) {
        //從上方撞擊
        ySpeed *= -1;
      }
      // brickArray.splice(index, 1);
      if (count_ball == 10) {
        alert("遊戲結束，已完成");
        clearInterval(game);
        return;
      }
    }
  });
  // 判斷球是否已接觸到地板
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + 200 + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    if (ySpeed > 0) {
      circle_y -= 30;
    } else {
      circle_y += 30;
    }
    ySpeed *= -1;
  }
  // 更新圓心座標前，先確認是否已到達xy的邊界(1000,600)
  if (circle_x >= width - radius) {
    xSpeed *= -1;
  } else if (circle_x <= 0 + radius) {
    xSpeed *= -1;
  }
  if (circle_y >= height - radius) {
    ySpeed *= -1;
  } else if (circle_y <= 0 + radius) {
    ySpeed *= -1;
  }
  // 更新圓心座標讓圓移動
  circle_x += xSpeed;
  circle_y += ySpeed;

  // 畫圓之前，先將背景塗黑
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  // 畫出磚塊
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  // 畫出可移動式的地板
  ctx.fillStyle = "blue";
  ctx.fillRect(ground_x, ground_y, 200, 5);

  // 開始畫圓
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI); // 參數分別為(圓心xy座標，半徑，開始與結束角度)
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

let game = setInterval(drawCircle, 30);
