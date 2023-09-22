'use strict';

class Hack {

	draw() {
		let turn = screen%20;
		let pass = Math.floor(screen / 20);

		context.clearRect(0, 0, 1500, 1000);

        context.font = "24px sans-serif";
        if (pass == 0) {
        	context.fillText("表示されている条件を満たす画像をクリックしてください " +(turn+1)+" / 12組目 ", 0, 128*4+24);
        }
        else{
        	context.fillText("推測した条件を満たす画像をクリックしてください " +(turn+1)+" / 12組目 ", 0, 128*4+24);
        }

        context.fillText((pass+1)+" / 5 セット ", 0, 128*4+48);

        if (pass==0) {
        	context.fillText("条件は「前髪で額が隠れている人」です。", 0, 128*4+72);
        }
        else {
            context.fillText("条件は自分で考えてください。", 0, 128*4+72);
        }

		//画像描画
        let img = new Image();
        if (pass == 0) {
        	img.src = './image16/'+0+"/"+(turn+1)+".png";
        }
        else {
        	img.src = './image16/'+(rand[pass-1]+1)+"/"+(turn+1)+".png";
        }


        img.onload = function(){
            context.drawImage(img, 0, 0, imgsize*4, imgsize*4);}

	    canvas.addEventListener('click', this.onClick, false);
	}

}