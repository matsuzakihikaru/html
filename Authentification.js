'use strict';

class Authentification {

	draw() {
		let turn = screen - 101;

		context.clearRect(0, 0, 1500, 7000);

        context.font = "24px sans-serif";
        context.fillText("最も条件を満たす画像をクリックしてください " +(turn+1)+" / 25枚目 ", 0, 128*3+24);

		//画像描画
	    for (let i = 0; i < 9; i++) {
	        let img = new Image();
	        if (correct[turn] - 1 == i) {
	        	img.src = 'images/synthesized/'+ok_images[turn];
	        }
	        else {
	        	img.src = 'images/synthesized/'+ng_images[turn*9+i];
	        }
	        
	        img.onload = function(){
	            context.drawImage(img, i%3*imgsize, Math.floor(i/3)*imgsize, imgsize, imgsize);
	        }
	    }
	    canvas.addEventListener('click', this.onClick, false);
	}

}