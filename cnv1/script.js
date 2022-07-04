function getRandPoint() {
    return Math.floor(Math.random() * 150);
  }


function main(){
const canvas = document.getElementById('canvas');
canvas == null ? console.log('canvas is null') : '';
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'green';
ctx.fillRect(10, 10, 150, 100);

const idIntervalMovingRect = setInterval(()=>{
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.moveTo(getRandPoint(), getRandPoint());
    ctx.lineTo(getRandPoint(), getRandPoint());
    ctx.stroke();
}, 1000);
}
main();