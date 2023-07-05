'use strict';

function onClick(e) {
	let x = e.offsetX;
 	let y = e.offsetY;

	//画面更新-1->0
 	if (screen == -1) {

		window.scrollTo(0,0);
		context.clearRect(0, 0, 1500, 7000);
		context.font = "24px sans-serif";
		let sentences = ["本実験は顔認証パスワードで用いる顔画像の条件としてふさわしいものを調べるための実験です。",
			"本実験で用いる顔認証システムでは、あなたに条件を考えてもらい、その条件を満たす画像を選択するというものです。",
			"最初に500枚の画像からあなたの考える条件を満たす画像を5枚選択してください。",
			"画像をクリックすることで画像の選択が可能であり、選択した画像は赤色になります。",
			"選択をやり直す場合には、画像をもう一度クリックしてください。",
			"条件を考えたらその条件を画面上部のテキストボックスに入力して、画面上部の「次に進む」をクリックしてください。",
			"テキストボックスに入れる条件の文字数は64文字以下にしてください。"]

		for (let i = 0; i < sentences.length; i++) {
			context.fillText(sentences[i], 0, 24*i+24);
			}

		document.getElementById('next').style.visibility = 'visible';
		document.getElementById('condition').style.visibility = 'visible';
		document.getElementById('next').disabled = true;
 		screen++;
 	}

	//画面更新(101->102 ... 125->126 -> 200)
 	if (0 <= x && x < imgsize*3 && 0 <= y && y < imgsize*3 && screen >= 101 && screen <= 125) {
 		context.clearRect(0, 0, 1500, 7000);
        let x = e.offsetX;
        let y = e.offsetY;
        let number = Math.floor(y / imgsize) * 3 + Math.floor(x / imgsize) + 1;
        answer.push(number);
        screen++;
        if (screen > 125) {
        	context.clearRect(0, 0, 1500, 7000);
        	screen = 200;
        	document.getElementById('next').style.visibility = 'visible';

		    context.clearRect(0, 0, 1500, 7000);

		    context.globalAlpha = 1;
		    window.scrollTo(0,0);
		    context.fillStyle = "black"
		    context.font = "24px sans-serif";
		    let sentences = [
		        "これが最後の手順です。",
		        "今から一度に先ほど見せた画像のうち条件を満たす25枚の画像を表示します。",
		        "この中で条件を満たさないものがあればクリックしてください。",
		        ]

		    // console.log(answer);

		    for (let i = 0; i < sentences.length; i++) {
		        context.fillText(sentences[i], 0, 24*i+24);
		        }

	        }
        else {
        	auth.draw();
        }
        return ;
        
 	}

}

//画面更新
function next() {

	//画面更新0->1
 	if (screen == 0) {
 		if (confirm("条件は「"+condition.value+"」でいいですか？")==false) {
 			return;
 		}
 		context.clearRect(0, 0, 1500, 7000);
 		screen++;
		let okchoose = new OkChoose();
		okchoose.draw();
		document.getElementById('next').disabled = true;
		document.getElementById('condition').style.visibility = 'hidden';
		return;
 	}

	//画面更新1->2
 	if (screen == 1) {
 		screen++;
		window.scrollTo(0,0);
	    context.globalAlpha = 1;
	    context.fillStyle = "black"
	    context.clearRect(0, 0, 1500, 7000);
	    context.font = "24px sans-serif";
	    let sentences = [
	        "次に500枚の画像からあなたの考える条件を満たさない画像を15枚選択してください。",
	        "条件を満たさない画像であることと15枚選択することに注意してください。",
	        "画像をクリックすることで画像の選択が可能であり、選択した画像は青色になります。",
	        "選択をやり直す場合には、画像をもう一度クリックしてください。",
	        ]

	    for (let i = 0; i < sentences.length; i++) {
	        context.fillText(sentences[i], 0, 24*i+24);
	        }
	    return;
	 	}

	//画面更新2->3
 	if (screen == 2) {
 		context.clearRect(0, 0, 1500, 7000);
 		screen++;
		let ngchoose = new NgChoose();
		ngchoose.draw();
		document.getElementById('next').disabled = true;
		return;
 	}

	//画面更新3->4
 	if (screen == 3) {
 		screen++;
		window.scrollTo(0,0);
	    context.globalAlpha = 1;
	    context.fillStyle = "black"
	    context.clearRect(0, 0, 1500, 7000);
	    context.font = "24px sans-serif";
	    let sentences = [
	        "それではこれから25回のパスワード認証を行います。",
	        "1回のパスワード認証では8枚の条件を満たさない画像と1枚の条件を満たす画像の計9枚が表示されます。",
	        "9枚の中から最も条件を満たすと思われる画像を1枚選択してクリックしてください。",
	        "1枚の画像をクリックしたら自動的に次の画像が表示されます。"
	        ]

	    for (let i = 0; i < sentences.length; i++) {
	        context.fillText(sentences[i], 0, 24*i+24);
	        }

		document.getElementById('next').disabled = false;
		return;
 	}

	//画面更新4->101
 	if (screen == 4) {
 		context.clearRect(0, 0, 1500, 7000);
 		screen=101;

 		for (let i=0; i<5; i++) {
 			for (let j=0; j<5; j++) {
 				ok_images.push("seed"+ok_choose[i]+"_"+ok_choose[j]+".png");
 			}
 		}
		for(let i = ok_images.length - 1; i > 0; i--) {
		    let j = Math.floor(Math.random() * (i + 1));
		    let tmp = ok_images[i];
		    ok_images[i] = ok_images[j];
		    ok_images[j] = tmp;
		}

 		for (let i=0; i<15; i++) {
 			for (let j=0; j<15; j++) {
 				ng_images.push("seed"+ng_choose[i]+"_"+ng_choose[j]+".png");
 			}
 		}
		for(let i = ng_images.length - 1; i > 0; i--) {
		    let j = Math.floor(Math.random() * (i + 1));
		    let tmp = ng_images[i];
		    ng_images[i] = ng_images[j];
		    ng_images[j] = tmp;
		}

		for (let i = 0; i < 25; i++) {
			correct.push(Math.floor(Math.random() * 9) + 1)
		}	  	

		auth.draw();
		document.getElementById('next').style.visibility = 'hidden';
		return ;
 	}

	//画面更新200->201
 	if (screen == 200) {
 		context.clearRect(0, 0, 1500, 7000);
 		screen++;
		let confirm = new Confirm();
		confirm.draw();
		return ;
 	}

 	//画面更新201->202
 	if (screen == 201) {
 		if (confirm("画像をすべて選択しましたか？")==false){
 			return;
 		}
 		screen++;
 		document.getElementById('next').style.visibility = 'hidden';
		window.scrollTo(0,0);
	    context.globalAlpha = 1;
	    context.fillStyle = "black"
	    context.clearRect(0, 0, 1500, 7000);
	    context.font = "24px sans-serif";
	    let sentences = [
	        "これで実験は終了です。",
	        "お疲れ様でした。",
	        "再度実験を行う場合にはF5キーなどで画面を更新してください。"
	        ]

	    //ユーザーの選んだ画像番号
	    console.log(ok_choose);
	    console.log(ng_choose);
	    console.log(confirm_choose);

	    //認証で使った画像名
	    console.log(ok_images);
	    console.log(ng_images);

	    //認証の正解とユーザーの解答
	    console.log(correct);
	    console.log(answer);

	    //正解・不正解, 間違えた画像名、正解画像名も出力する
	    //認証時間測定もするか?
	    //ブラウザ情報の取得?
	    //最初に条件を表示させる?/条件を覚えておいてください/条件の表示はさせない
	    //2回入力してもらうかも

	    for (let i = 0; i < sentences.length; i++) {
	        context.fillText(sentences[i], 0, 24*i+24);
	        }

 	}
	
}

// 画面番号
let screen = -1;

let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
canvas.addEventListener('click', onClick, false);
let imgsize = 128;
let ok_choose = [];
let ng_choose = [];
let confirm_choose = [];

let auth = new Authentification();
let ok_images = [];
let ng_images = [];
let correct = [];
let answer = [];

//初期画面
context.font = "48px sans-serif";
context.fillText("画面をクリックしてください", 0, 50);
document.getElementById('next').style.visibility = 'hidden';
document.getElementById('condition').style.visibility = 'hidden';

//screen0におけるテキストボックス表示
let condition = document.getElementById("condition");
condition.addEventListener("input", function(){
	if (screen == 0 && this.value.length>0) {
		document.getElementById('next').disabled = false;
		}
	else if (screen == 0 && this.value.length == 0) {
		document.getElementById('next').disabled = true;
	}
	});