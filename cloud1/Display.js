'use strict';

class Display {

	draw() {
		let turn = screen%20;
		let pass = Math.floor(screen / 20);

		context.clearRect(0, 0, 1500, 700);

        context.font = "24px sans-serif";
        context.fillText("条件を考えてください " +(turn+1)+" / 4枚目 ", 0, 128*3+24);
        context.fillText((pass+1)+" / 14 パスワード ", 0, 128*3+48);

        if (pass==0) {
        	context.fillText("これは練習です。条件は「前髪で額が隠れている人」です。", 0, 128*3+72);
        }
        if (pass==7) {
        	context.fillText("これは練習です。条件は「髪がパーマの人」です。", 0, 128*3+72);
        }

		//画像描画
	    for (let i = 0; i < 9; i++) {
	        let img = new Image();
	        if (all_data[pass][3][turn] - 1 == i) {
	        	img.src = '../images/synthesized/'+all_data[pass][1][turn];

	        }
	        else {
	        	img.src = '../images/synthesized/'+all_data[pass][2][turn*9+i];
	        }
	        
	        img.onload = function(){
	            context.drawImage(img, i%3*imgsize, Math.floor(i/3)*imgsize, imgsize, imgsize);}

	    }

	    let i = all_data[pass][3][turn] - 1;

	    setTimeout(function(){
    	context.strokeStyle = "red";
        context.lineWidth = 6;
        context.strokeRect(i%3*imgsize, Math.floor(i/3)*imgsize, imgsize, imgsize);
    	}, 1700);

	    canvas.addEventListener('click', this.onClick, false);
	}

}