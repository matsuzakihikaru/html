'use strict';

class Hack {

	draw() {
		let turn = screen - 10 + 4;//turnは4以上

		context.clearRect(0, 0, 1500, 7000);

        context.font = "24px sans-serif";
        context.fillText("推測した条件を満たす画像をクリックしてください " +(turn+1 - 4)+" / 4枚目 ", 0, 128*3+24);

		//画像描画
	    for (let i = 0; i < 9; i++) {
	        let img = new Image();
	        if (data[0][3][turn] - 1 == i) {
	        	img.src = '../images/synthesized/'+data[0][1][turn];

	        }
	        else {
	        	img.src = '../images/synthesized/'+data[0][2][turn*9+i];
	        }
	        
	        img.onload = function(){
	            context.drawImage(img, i%3*imgsize, Math.floor(i/3)*imgsize, imgsize, imgsize);            
	        }

	    }

	    canvas.addEventListener('click', this.onClick, false);
	}

}