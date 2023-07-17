'use strict';

class NgChoose {

    //クリック時の動作
    onClick(e) {
        let x = e.offsetX;
        let y = e.offsetY;

        if (!(0 <= x && x < imgsize*10 && imgsize*1 <= y && y < imgsize*51 && screen == 3)) {
            return ;
        }

        let number = Math.floor(y / imgsize - 1) * 10 + Math.floor(x / imgsize) + 1;

        if (ng_choose.includes(number)) {
            context.globalAlpha = 1;
            let index = ng_choose.indexOf(number);
            ng_choose.splice(index, 1)

            let img = new Image();
            img.src = 'images/original/'+number+'.png';
            img.onload = function(){
                context.drawImage(img, (number-1)%10*imgsize, (Math.floor((number-1)/10)+1)*imgsize, imgsize, imgsize);
            }
        }
        else {
            if (ng_choose.length >= 15) {
                alert("15枚の画像をすでに選択しています");
                return;
            }
            context.globalAlpha = 0.2;
            context.fillStyle = "blue";
            context.fillRect((number-1)%10*imgsize, (Math.floor((number-1)/10)+1)*imgsize, imgsize, imgsize);
            ng_choose.push(number);       
        }

        context.globalAlpha = 1;
        context.fillStyle = "black";
        context.clearRect(0, 24*3+2, 1500, 24);
        context.fillText("画像選択枚数:"+ng_choose.length, 0, 24*4);

        if (ng_choose.length == 15) {
            setTimeout(function(){window.alert("15枚の画像が選択されました。問題がなければ画面上部の「次に進む」ボタンを押してください。")}, 1);
            document.getElementById('next').disabled = false;
        }
        else{
            document.getElementById('next').disabled = true;
        }
        
    }

    draw() {

        //文字表示
        context.font = "24px sans-serif";
        context.fillText("次に条件を　　　　　画像を選択してください。", 0, 24);

        //青字
        context.fillStyle = "blue";
        context.fillText("満たさない", 24*5, 24);
        context.fillStyle = "black";

        context.fillText("画像をクリックすることで画像の選択が可能であり、選択した画像は青色になります。", 0, 24*2);
        context.fillText("15枚の画像を選択したら画面上部の「次に進む」ボタンを押してください", 0, 24*3);
        context.fillText("画像選択枚数:"+ng_choose.length, 0, 24*4);

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


