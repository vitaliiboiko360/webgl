
function main(){
const canvas = document.getElementById('canvas');
canvas == null ? console.log('canvas is null') : '';
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'green';
ctx.fillRect(10, 10, 150, 100);
}
main();