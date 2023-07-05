'use strict';

class Confirm {

    //クリック時の動作
    onClick(e) {
        let x = e.offsetX;
        let y = e.offsetY;

        if (!(0 <= x && x < imgsize*5 && imgsize*1 <= y && y < imgsize*6 && screen == 201)) {
            return ;
        }

        let number = (Math.floor(y / imgsize) - 1) * 5 + Math.floor(x / imgsize) + 1;

        if (confirm_choose.includes(number)) {
            context.globalAlpha = 1;
            let index = confirm_choose.indexOf(number);
            confirm_choose.splice(index, 1)

            let img = new Image();
            img.src = 'images/synthesized/'+ok_images[number-1];
            img.onload = function(){
                context.drawImage(img, (number-1)%5*imgsize, (Math.floor((number-1)/5)+1)*imgsize, imgsize, imgsize);
            }
        }
        else {
            context.globalAlpha = 0.2;
            context.fillStyle = "blue";
            context.fillRect((number-1)%5*imgsize, (Math.floor((number-1)/5)+1)*imgsize, imgsize, imgsize);
            confirm_choose.push(number);       
        }
        
    }

    draw() {

        //画像描画
        for (let i = 0; i < 25; i++) {
            let img = new Image();
            img.src = 'images/synthesized/'+ok_images[i];
            img.onload = function(){
                context.drawImage(img, i%5*imgsize, (Math.floor(i/5)+1)*imgsize, imgsize, imgsize);
            }
        }

        //文字表示
        context.font = "24px sans-serif";
        context.fillText("条件を満たさない画像を選択してください。", 0, 24);
        context.fillText("すべての条件を満たさない画像を選択したら画面上部の「次に進む」ボタンを押してください。", 0, 24*2);
        context.fillText("1枚も選ばなくてもかまいません。", 0, 24*3);   

        canvas.addEventListener('click', this.onClick, false);
    }

}