'use strict';

function onClick(e) {
	let x = e.offsetX;
 	let y = e.offsetY;

	//画面更新-1->0
 	if (screen == -1 && name.value.length>0) {
 		name_input();
 	}

	//画面更新(101->102 ... 125->126 -> 200)
 	if (0 <= x && x < imgsize*3 && 0 <= y && y < imgsize*3 && screen >= 101 && screen <= 125) {
 		context.clearRect(0, 0, 1500, 7000);
        let x = e.offsetX;
        let y = e.offsetY;
        let number = Math.floor(y / imgsize) * 3 + Math.floor(x / imgsize) + 1;
        answer.push(number);
        screen++;
        var now_time = new Date();
        times.push(now_time.getTime()-start_time);

        if (screen > 125) {
        	context.clearRect(0, 0, 1500, 7000);
        	screen = 200;
        	//画面更新
        	next();
        	document.getElementById('next').style.visibility = 'visible';
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
 		context.clearRect(0, 0, 1500, 7000);
 		screen++;
		let authentification = new Authentification();
		authentification.draw();
		document.getElementById('next').disabled = true;
		document.getElementById('condition').style.visibility = 'hidden';
		document.getElementById('next').display = false;
		return;
 	}

	//画面更新1->3 (画面2は取り除いた)
 	if (screen == 1) {
 		screen+=2;
		window.scrollTo(0,0);
	    context.globalAlpha = 1;
	    context.fillStyle = "black"
	    context.clearRect(0, 0, 1500, 7000);
	    context.font = "24px sans-serif";
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
	        "1回のパスワード認証では9枚の顔画像が表示されます。",
	        "9枚の中から最も条件を満たすと思われる顔画像を1枚選択してクリックしてください。",
	        "画像を選択したら自動的に次の画像が表示されます。",
	        "選択のやり直しは出来ないためご注意ください。"
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
		var now_time = new Date();
		start_time = now_time.getTime();
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

	    for (let i = 0; i < sentences.length; i++) {
	        context.fillText(sentences[i], 0, 24*i+24);
	        }

	    var now_time = new Date();
 		all_time=now_time.getTime()-all_start_time;


	    for (let i=0;i<25;i++) {
	    	if (correct[i] == answer[i]) {
	    		authentification.push([1, times[i+1]-times[i], ok_images[i], ok_images[i]]);
	    	}
	    	else {
	    		authentification.push([0, times[i+1]-times[i], ok_images[i], ng_images[9*i+answer[i]-1]]);
	    	}
	    	
	    }

	    //実験参加者の名前
	    console.log(name.value);

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

	    //ユーザーの考えた条件
	    console.log(condition.value);

	    //認証実験情報(正解不正解、認証時間、正解画像、ユーザー選択画像)
	    console.log(authentification);

	    //総時間
	    console.log(all_time);

	    //どこかのサーバーに適当に投げる
	    //研究室のサーバーが良いか？→とりあえずこれをやってみる
	    //最初の条件記入の段階でも画像を提示する

	    //クラウドで行うときは技術背景なども聞く

	    //送信データ
	    var data = [name.value, ok_choose, ng_choose, confirm_choose, ok_images, ng_images, correct, answer, condition.value, authentification, all_time];
	    var json_data = JSON.stringify(data);

		fetch("https://script.google.com/macros/s/AKfycbw6-2hQBWAx143Iq48EqRz11oXmhkC9U9NxYtYPMxwbSf2TJpyTARqTDvRLSptEKaU_Ew/exec" , {
			method: "POST",
			body: json_data,
			mode: 'no-cors',
			headers: {"Content-Type": "application/json"}
		}).then((data) => {
	    	console.log(data);
	  	});;

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

let ok_images = [];
let ng_images = [];
let correct = [];
let answer = [];

//認証回答時間
let times = [0];
let start_time;

//実験開始時間
let all_start_time;
//実験総時間
let all_time;


//認証情報
let authentification = [];

//初期画面
context.font = "24px sans-serif";
context.fillText("テキストボックスにあなたの名前を入れ画面をクリックするかEnterキーを押してください。", 0, 36);

document.getElementById('next').style.visibility = 'hidden';

document.getElementById('next').style.display = 'none';

//実験参加者の名前
let name = document.getElementById("name");

//初期画面の名前入力
name.addEventListener('keypress', function(e){
	//エンターキーを押す
  	if (e.keyCode === 13) {
		name_input();
	}  
});

//名前入力
function name_input() {

	//画面更新-1->0
 	if (screen == -1 && name.value.length>0) {

 		if (confirm("あなたの名前は「"+name.value+"」でいいですか？")==false) {
 			return;
 		}

		document.getElementById('name').style.visibility = 'hidden';
		document.getElementById('next').style.display = 'inline';

        var now_time = new Date();
 		all_start_time=now_time.getTime();

		window.scrollTo(0,0);
		context.clearRect(0, 0, 1500, 7000);
		context.font = "24px sans-serif";
		let sentences = ["本実験は顔画像パスワード認証の強度を測定するものです。",
			"最初に4例のパスワードが表示されるので、そこから法則を見つけ",			
			"残り4例のパスワードの認証を行ってください。",
			"画面上部の「次に進む」をクリックすると実験が開始します。"]

		for (let i = 0; i < sentences.length; i++) {
			context.fillText(sentences[i], 0, 24*i+24);
			}

		document.getElementById('next').style.visibility = 'visible';
 		screen++;
 	}

}
