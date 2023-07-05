'use strict';

class OkChoose {

    //クリック時の動作
    onClick(e) {
        let x = e.offsetX;
        let y = e.offsetY;

        if (!(0 <= x && x < imgsize*10 && imgsize*1 <= y && y < imgsize*51 && screen == 1)) {
            return ;
        }

        let number = Math.floor(y / imgsize - 1) * 10 + Math.floor(x / imgsize) + 1;

        if (ok_choose.includes(number)) {
            context.globalAlpha = 1;
            let index = ok_choose.indexOf(number);
            ok_choose.splice(index, 1)

            let img = new Image();
            img.src = 'images/original/'+number+'.png';
            img.onload = function(){
                context.drawImage(img, (number-1)%10*imgsize, (Math.floor((number-1)/10)+1)*imgsize, imgsize, imgsize);
            }
        }
        else {
            if (ok_choose.length >= 5) {
                alert("すでに5枚の画像を選択しています");
                return;
            }
            context.globalAlpha = 0.2;
            context.fillStyle = "red";
            context.fillRect((number-1)%10*imgsize, (Math.floor((number-1)/10)+1)*imgsize, imgsize, imgsize);
            ok_choose.push(number);       
        }


        context.globalAlpha = 1;
        context.fillStyle = "black";
        context.clearRect(0, 24*2+2, 1500, 24);
        context.fillText("画像選択枚数:"+ok_choose.length, 0, 24*3);

        if (ok_choose.length == 5) {
            setTimeout(function(){window.alert("5枚の画像が選択されました。問題がなければ画面上部の「次に進む」ボタンを押してください。")}, 1);
            document.getElementById('next').disabled = false;

        }
        else{
            document.getElementById('next').disabled = true;
        }
        
    }

    draw() {

        //文字表示
        context.font = "24px sans-serif";
        context.fillText("条件を満たす画像を選択してください。", 0, 24);
        context.fillText("5枚の画像を選択したら画面上部の「次に進む」ボタンを押してください", 0, 24*2);
        context.fillText("画像選択枚数:"+ok_choose.length, 0, 24*3);

        //画像描画
        for (let i = 0; i < 500; i++) {
            let img = new Image();
            img.src = 'images/original/'+(i+1)+'.png';
            img.onload = function(){
                context.drawImage(img, i%10*imgsize, (Math.floor(i/10)+1)*imgsize, imgsize, imgsize);
            }
        }

        canvas.addEventListener('click', this.onClick, false);
    }

}
