function getRandInt() {
return Math.floor(Math.random() * 150);
}

function getRandPoint() {
return {'x':Math.floor(Math.random() * 150000), 'y':Math.floor(Math.random() * 150000)};
}

function main(){
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const canvas1 = document.getElementById('canvas1');
const ctx1 = canvas.getContext('2d');

ctx.fillStyle = 'green';
ctx.fillRect(10, 10, 150, 100);

const idIntervalMovingRect = setInterval(()=>{
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.moveTo(getRandInt(), getRandInt());
    ctx.lineTo(getRandInt(), getRandInt());
    ctx.stroke();
}, 1000);

const idIntervalMovingRect1 = setInterval(()=>{
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    const p1 = getRandPoint();
    const p2 = getRandPoint();
    const sinAngle = p1.y-p2.y/Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2));
    
    ctx.moveTo(getRandInt(), getRandInt());
    ctx.lineTo(getRandInt(), getRandInt());
    ctx.stroke();
}, 1000);
}
main();