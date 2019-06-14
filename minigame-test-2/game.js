// 创建一个画布
const canvas = wx.createCanvas(); 
// 创建一个 2d context
const context = canvas.getContext('2d');

// 屏幕宽高
const screenH = wx.getSystemInfoSync().windowHeight;
const screenW = wx.getSystemInfoSync().windowWidth;

// 除背景动画之外的控制器
let over = false;

// 两张背景用于循环轮播
const bgImage1 = wx.createImage();
const bgImage2 = wx.createImage();
bgImage1.src = './img/background.png';
bgImage2.src = './img/background.png';
// 我方飞机
let planeArr = [];
planeArr[0] = wx.createImage();
planeArr[0].src = './img/plane1.png';
planeArr[1] = wx.createImage();
planeArr[1].src = './img/plane2.png';
planeArr[2] = wx.createImage();
planeArr[2].src = './img/plane_bong1.png';
planeArr[3] = wx.createImage();
planeArr[3].src = './img/plane_bong2.png';
planeArr[4] = wx.createImage();
planeArr[4].src = './img/plane_bong3.png';
planeArr[5] = wx.createImage();
planeArr[5].src = './img/plane_bong4.png';
// 低等机
let enemyArr1 = [];
enemyArr1[0] = wx.createImage();
enemyArr1[0].src = './img/enemy1.png';
enemyArr1[1] = wx.createImage();
enemyArr1[1].src = './img/enemy1_bong1.png';
enemyArr1[2] = wx.createImage();
enemyArr1[2].src = './img/enemy1_bong2.png';
enemyArr1[3] = wx.createImage();
enemyArr1[3].src = './img/enemy1_bong3.png';
enemyArr1[4] = wx.createImage();
enemyArr1[4].src = './img/enemy1_bong4.png';
// 中等机
let enemyArr2 = [];
enemyArr2[0] = wx.createImage();
enemyArr2[0].src = './img/enemy2.png';
enemyArr2[1] = wx.createImage();
enemyArr2[1].src = './img/enemy2_bong1.png';
enemyArr2[2] = wx.createImage();
enemyArr2[2].src = './img/enemy2_bong2.png';
enemyArr2[3] = wx.createImage();
enemyArr2[3].src = './img/enemy2_bong3.png';
enemyArr2[4] = wx.createImage();
enemyArr2[4].src = './img/enemy2_bong4.png';
// 高等机
let enemyArr3 = [];
enemyArr3[0] = wx.createImage();
enemyArr3[0].src = './img/enemy3_A1.png';
enemyArr3[1] = wx.createImage();
enemyArr3[1].src = './img/enemy3_A2.png';
enemyArr3[2] = wx.createImage();
enemyArr3[2].src = './img/enemy3_bong1.png';
enemyArr3[3] = wx.createImage();
enemyArr3[3].src = './img/enemy3_bong2.png';
enemyArr3[4] = wx.createImage();
enemyArr3[4].src = './img/enemy3_bong3.png';
enemyArr3[5] = wx.createImage();
enemyArr3[5].src = './img/enemy3_bong4.png';
enemyArr3[6] = wx.createImage();
enemyArr3[6].src = './img/enemy3_bong5.png';
enemyArr3[7] = wx.createImage();
enemyArr3[7].src = './img/enemy3_bong6.png';

// 子弹
let bulletImg = wx.createImage();
bulletImg.src = './img/bullet.png';


// ------------------ 背景 ------------------
// 背景壁纸高度
const bgImageH = 852;
// 背景启始坐标
let bgImage1_Y = 0;
let bgImage2_Y = -bgImageH;

function bg(){
  // 背景滑动
  bgImage1_Y >= bgImageH ? bgImage1_Y = 0 : bgImage1_Y += 1;
  bgImage2_Y >= 0 ? bgImage2_Y = -bgImageH : bgImage2_Y += 1;
  // 背景图绘制
  context.drawImage(bgImage1, 0, bgImage1_Y);
  context.drawImage(bgImage2, 0, bgImage2_Y);
}


// ------------------ 我方飞机 ------------------
let planeData = {};
// 飞机大小
planeData.planeW = 50;
planeData.planeH = 65;
// 飞机计时器
let planeTiming = 0;
// 飞机爆炸动画延迟
let planeADelay = 30;
planeData.state = true;
planeData.animation = '';
planeData.aliveA = 2;
planeData.deathA = planeArr.length;
planeData.count = planeArr.length;
planeData.life = 3;
planeData.score = 0;

// 屏幕连续滑动触发
wx.onTouchMove((res) => {
  // 当前移动的坐标
  planeData.planeX = res.changedTouches[0].clientX - (planeData.planeW / 2);
  planeData.planeY = res.changedTouches[0].clientY - (planeData.planeH / 2);
})

function plane(){
    // 我方飞机动画
    if(planeData.state){
      planeData.animation = planeTiming % planeData.aliveA;
    }else{
      planeData.animation = planeTiming % planeData.deathA;
      if(timing % planeADelay == 0) planeData.count = planeData.count -= 1;
    }
    // 爆炸动画执行完成后恢复
    if(planeData.count <= 0 && !planeData.state){
        planeData.state = true;
        planeData.count = planeArr.length;
    }
    context.drawImage(planeArr[planeData.animation], planeData.planeX, planeData.planeY, planeData.planeW, planeData.planeH); 
}


// ------------------ 子弹 ------------------
// 用于存放所有子弹
let bulletBox = [];

// 子弹大小
let bulletW = 8;
let bulletH = 20;
// 子弹发射的频率
let bulletRate = 50; 
// 子弹的速度
let bulletSpeed = 2;
// 用于计算加成后的比例
let originSpeed = 2;
// 最终比例
let ratio = 100;

function bullet(){
  // 添加子弹集
  if (timing % bulletRate == 0 && planeData.planeX){
    bulletBox.push({
      bullet: bulletImg,
      x: planeData.planeX + planeData.planeW / 2 - bulletW / 2,
      y: planeData.planeY - bulletH / 2,
      h: bulletH,
      w: bulletW,
    })
  }

  // 绘制子弹
  for (let i = 0; i < bulletBox.length;i++){
    // 让子弹往上走
    bulletBox.y = bulletBox[i].y -= bulletSpeed;
    context.drawImage(bulletBox[i].bullet, bulletBox[i].x, bulletBox[i].y, bulletW, bulletH);
    // 删除超出屏幕的子弹
    if (bulletBox[i].y <= -bulletH) bulletBox.splice(i,1);
  }
}

// ------------------ 敌方飞机 ------------------

// 存放所有敌机
let enemyBox = [];
// 所有敌机的X,y坐标
let enemyX = 0;
let enemyY = 0;
// 敌机爆炸动画延迟
let enemyADelay = 10;
// 敌机出项频率(最少100)
let enemyRate = 100; 
// 敌机速度
let enemySpeed = 1;
// 敌机计时器
let enemyTiming = 0;
// 各机型出现次数
let low = 1;
// 敌机速度
// 低等机的宽高
let enemyW1 = 57;
let enemyH1 = 51;

//  中等机的宽高
let enemyW2 = 69;
let enemyH2 = 95;

//  高等机的宽高
let enemyW3 = 165;
let enemyH3 = 261;

// 添加敌机数据
function addEnemy(enemyW,enemyH,enemyType,aliveA,shield,score){
  enemyX = ~~(Math.random() * (screenW - enemyW));
  enemyY = -enemyH;
  enemyBox.push({
    enemyS:enemyType,
    x:enemyX,
    y:enemyY,
    h:enemyH,
    w:enemyW,
    state:true,
    aliveA,
    deathA:enemyType.length,
    animation:'',
    count:enemyType.length,
    shield,
    score
  });
}
function enemy(){
  // 添加敌机类型
    if(timing % enemyRate == 0){
      enemySpeed += 0.01;
      addEnemy(enemyW1,enemyH1,enemyArr1,1,1,1);
      low += 1;
      if(low > 0 && low % 5 == 0){
        addEnemy(enemyW2,enemyH2,enemyArr2,1,3,2);
      }
      if(low > 0 && low % 10 == 0){
        addEnemy(enemyW3,enemyH3,enemyArr3,2,5,3);
      }
    }
}

// ------------------ 碰撞/积分/生命 ------------------

function collide(){
  // 遍历所有敌机
  for(let i=0;i<enemyBox.length;i++){

    // 删除超出屏幕的敌机
    if(enemyBox[i].y >= screenH) enemyBox.splice(i,1);

    if(enemyBox[i]){
      // 敌机动画帧
      if(enemyBox[i].state){
        enemyBox[i].animation = enemyTiming % enemyBox[i].aliveA;
        // 所有敌机往下走
        enemyBox[i].y = enemyBox[i].y += enemySpeed;
      }
      if(!enemyBox[i].state){
        enemyBox[i].animation = enemyTiming % enemyBox[i].deathA;
        if(timing % enemyADelay == 0) enemyBox[i].count = enemyBox[i].count -= 1;
      }
      // 绘制敌机
      let animation = enemyBox[i].animation;
      context.drawImage(enemyBox[i].enemyS[animation], enemyBox[i].x, enemyBox[i].y); 

   

      // 飞机撞敌机
      if(enemyBox[i].x < planeData.planeX + planeData.planeW && enemyBox[i].x + enemyBox[i].w > planeData.planeX && enemyBox[i].y < planeData.planeY + planeData.planeH && enemyBox[i].y + enemyBox[i].h > planeData.planeY){
        if(planeData.state && enemyBox[i].state){
          planeData.state = false;
          planeData.life = planeData.life -= 1;
          enemyBox[i].state = false;
        }
      }
      // 爆炸动画执行完成后删除
      if(enemyBox[i].count <= 0){
        enemyBox.splice(i,1);
      } 
    }
    let flag = true;
    // 敌机撞子弹
    for(let f=0;f<bulletBox.length;f++){
      if(bulletBox[f] && enemyBox[i]){
        if(bulletBox[f].y < enemyBox[i].y + enemyBox[i].h && bulletBox[f].y + bulletBox[f].h > enemyBox[i].y && bulletBox[f].x < enemyBox[i].x + enemyBox[i].w && bulletBox[f].x + bulletBox[f].w > enemyBox[i].x){
          // 保护层
          if(enemyBox[i].state && flag){
            flag = false;
            enemyBox[i].shield -=1;
            bulletBox.splice(f,1);
            flag = true;
          } 
          // 死亡
          if(enemyBox[i].shield <= 0 && enemyBox[i].state){
            enemyBox[i].state = false;
            planeData.score += enemyBox[i].score;
            // 子弹速度加成
            if(planeData.score > 0 && planeData.score % 10 == 0){
              if(bulletSpeed < originSpeed * 2) bulletSpeed += .1;
              ratio = (bulletSpeed / originSpeed) * 100;
              ratio = ratio.toString().substring(0,3);
            }
          }
        }
      }
    }

    if(planeData.life < 0){
      planeData.life = 0;
      over = true;
    } 
    

  }
  // 生命
  context.fillText(`file：${planeData.life}`,10,30);
  // 分数
  context.fillText(`score：${planeData.score}`,10,60);
  // 子弹加成比例
  
  context.font = '14px 微软雅黑';
  context.fillText(`子弹速度：${ratio}%`,screenW - 120,screenH - 20);
  context.font = '20px 微软雅黑';
  context.fillStyle = 'black';
}


// ------------------ 定时器 ------------------

let timing = 0;
(function run() {
  setTimeout(function () {
    timing += 1;
    timing % enemyADelay == 0 ? enemyTiming += 1 : enemyTiming;
    timing % planeADelay == 0 ? planeTiming += 1 : planeTiming;
    // 背景
    bg();
    if(!over){
      // 飞机
      plane();
      // 子弹
      bullet();
      // 敌机
      enemy();
      // 碰撞/积分/生命
      collide();
    }
    if(over){
      context.fillText('Game over',screenW/3,screenH/2);
    }
    run();
  }, 10)
})();
