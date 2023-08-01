'use strict';

class Display {

	draw() {
		let turn = screen;

		context.clearRect(0, 0, 1500, 7000);

        context.font = "24px sans-serif";
        context.fillText("条件を考えてください " +(turn+1)+" / 4枚目 ", 0, 128*3+24);

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

	        if (data[0][3][turn] - 1 == i) {
	        	context.strokeStyle = "red";
		        context.lineWidth = 6;
		        context.strokeRect(i%3*imgsize, Math.floor(i/3)*imgsize, imgsize, imgsize);
	        	}	            
	        }

	    }

	    canvas.addEventListener('click', this.onClick, false);
	}

}