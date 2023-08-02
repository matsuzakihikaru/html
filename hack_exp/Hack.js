'use strict';

class Hack {

	draw() {
		let turn = screen%20;//turnは4以上
		let pass = Math.floor(screen / 20);

		context.clearRect(0, 0, 1500, 700);

        context.font = "24px sans-serif";
        context.fillText("推測した条件を満たす画像をクリックしてください " +(turn-3)+" / 8枚目 ", 0, 128*3+24);
        context.fillText((pass+1)+" / 12 パスワード ", 0, 128*3+48);

		//画像描画
	    for (let i = 0; i < 9; i++) {
	        let img = new Image();
	        if (data[pass][3][turn] - 1 == i) {
	        	img.src = '../images/synthesized/'+data[pass][1][turn];

	        }
	        else {
	        	img.src = '../images/synthesized/'+data[pass][2][turn*9+i];
	        }
	        
	        img.onload = function(){
	            context.drawImage(img, i%3*imgsize, Math.floor(i/3)*imgsize, imgsize, imgsize);            
	        }

	    }

	    canvas.addEventListener('click', this.onClick, false);
	}

}