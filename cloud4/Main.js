'use strict';

function onClick(e) {
	let x = e.offsetX;
 	let y = e.offsetY;

	//画面更新-1->0
 	if (screen == -1 && name.value.length>0) {
 		name_input();
 	}

	//画面 1->2 ... 4->5 ... 11->12 ->20
 	if (0 <= x && x < imgsize*3 && 0 <= y && y < imgsize*3 && screen%20 >= 1 && screen%20 <= 12) {

 		context.clearRect(0, 0, 1500, 1000);
        let x = e.offsetX;
        let y = e.offsetY;
        let number = Math.floor(y / imgsize) * 3 + Math.floor(x / imgsize) + 1;
        answer.push(number);

		var now_time = new Date();
        times.push(now_time.getTime()-n_time);
        n_time = now_time;

        if (screen%20 <= 11) {
			let hack = new Hack();
			hack.draw();
			screen++;
        }
        else{
        	screen++;
			let pass = Math.floor(screen / 20);
			if (pass == 0) {
				document.getElementById('next').style.visibility = 'visible';
				next();
				return;
			}

     		//screen%20==13
			window.scrollTo(0,0);
			context.clearRect(0, 0, 1500, 1000);

			condition.style.visibility = 'visible';
			condition.value = "";
			document.getElementById('next').style.visibility = 'visible';

			document.getElementById('confidence').style.display = 'inline';

			context.font = "24px sans-serif";
			let sentences = ["推測した条件を入力し、予測の自信度を選択してください。",
				"条件がまったく分からなかった場合には、「不明」などの単語を入力してください。",			
				"次に進むを押すと正解の条件と認証正解数が表示されます。"]

			for (let i = 0; i < sentences.length; i++) {
				context.fillText(sentences[i], 0, 24*i+24);
				}
 		
        }

        return ;
        
 	}

}

//画面更新
function next() {

	//画面更新0->1 ... 3->4 ... 11->12
 	if (screen%20 == 0 & screen<100) {

 		if (screen%20 == 0 & screen/20 == 0) {
 			if (confirm("次の画像パスワード認証に進んでいいですか？　次の顔画像の条件は「前髪で額が隠れている人」です。") == false) {
 				return
 			};
 		}

 		else if (screen%20 == 0) {
 			if (confirm("次の画像パスワード認証に進んでいいですか？　次の顔画像の条件は自分で推測してください。") == false) {
 				return
 			};
 		}		

        n_time = new Date();
 		context.clearRect(0, 0, 1500, 1000);
		let hack = new Hack();
		hack.draw();
		document.getElementById('next').style.visibility = 'hidden';

 		screen++;

		return;
 	}

 	if (screen%20 == 13 & screen<100) {
 		let pass = Math.floor(screen / 20);
		if (document.getElementById('confidence').value == 0 && pass!=0 && pass!=7) {
			alert("自信度を選択してください。");
			return
		};

 		if (pass==0 || confirm("推測した条件は「"+condition.value+"」でいいですか？")==true) {
 			let correct = all_data[pass][1].slice(0,12);
 			let point = 0;
 			let point8 = 0;
 			let point4 = 0;
 			for (let i=0; i<12; i++) {
 				if (answer[12*pass+i] == correct[i]) {
 					point++;
 					if (i>=4) {
						point8++;				
 					}
 					if (i>=8) {
 						point4++;
 					}
 				}
 			}

 			condition.style.visibility = 'hidden';
 			screen+=7;

 			confs.push(document.getElementById('confidence').value);

 			document.getElementById('confidence').value=0;
 			document.getElementById('confidence').style.display='none';

 			context.clearRect(0, 0, 1500, 1000);
			context.font = "24px sans-serif";
			let sentences = ["正解の条件 : "+all_data[pass][0],
							"認証正解数 "+point+"/12"]
			for (let i = 0; i < sentences.length; i++) {
				context.fillText(sentences[i], 0, 24*i+24);
				}

			points.push(point);
			points8.push(point8);
			points4.push(point4);

			if (pass==0) {
				conditions.push("N");
			}
			else{
				conditions.push(condition.value);
			}

 			// return;
 		}

 	if (screen == 100) {

	    var now_time = new Date();
 		all_time=now_time.getTime()-all_start_time;

	    //送信データ
	    var dt = [name.value, points, points8, points4, answer, conditions, rand, times, all_time, confs];
	    var json_data = JSON.stringify(dt);

		fetch("https://script.google.com/macros/s/AKfycbz-52cE2_xwwzxMcgZOOmXj5SRHgg3bvFGQADfKDPLubIH95WtkV1kk5QzQmoiJkjlE/exec" , {
			method: "POST",
			body: json_data,
			mode: 'no-cors',
			headers: {"Content-Type": "application/json"}
		}).then((dat) => {
	    	console.log(dat);
	  	});;

		context.font = "24px sans-serif";
		let sentences = [
			"これで実験は終了です。お疲れ様でした。",
			"確認コードは、「hfay」になります。ランサーズ上の実験後アンケートに回答してください。",
			"確認コードはこのページを閉じると二度と表示出来なくなるので注意してください。",
			"なお、正解の条件は以下のようになります。"];

		for (let i = 0; i < sentences.length; i++) {
			context.fillText(sentences[i], 0, 24*i+72);
			}

		for (let i = 0; i < 5; i++) {
			var str;
			if (i == 0) {
				str = "前髪で額が隠れている人";
			}
			else {
				str = data[rand[i-1]][0];
			}

			context.fillText((i+1)+"セット目の条件："+str+" 認証正解数："+points[i]+"/12", 0, 24*i+72+120);
		}

		document.getElementById('next').style.visibility = 'hidden';		

 	}

 	}
}
	

// 画面番号
let screen = -1;

let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
canvas.addEventListener('click', onClick, false);
let imgsize = 128;

//認証回答時間
let times = ["N"];
let n_time;

//実験開始時間
var now_time = new Date();
let all_start_time = now_time.getTime();;
//実験総時間
let all_time;

let answer = [];

let data =[

	["耳に髪がかかっていない人", [6, 2, 4, 7, 7, 2, 5, 5, 9, 9, 8, 8]],

	["モンゴロイドの女性", [2, 1, 5, 1, 9, 4, 2, 7, 3, 9, 5, 8]],

	["背景が緑", [2, 1, 9, 2, 2, 7, 2, 4, 1, 7, 6, 9]],

	["幼い女の子", [3, 5, 5, 3, 4, 4, 9, 8, 2, 4, 4, 7]]

	];

//練習用データ
let p_data = [
	["前髪で額が隠れている人", [6, 2, 1, 2, 1, 2, 7, 2, 6, 3, 6, 9]],
	];

//random順番
let rand = [0,1,2,3];

for(let i = rand.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = rand[i];
    rand[i] = rand[j];
    rand[j] = tmp;
}

let all_data = [p_data[0]];

for (let i=0; i<4; i++) {
	all_data.push(data[rand[i]]);
}

//認証時間
let auth_time = [];


//初期画面
context.font = "24px sans-serif";
context.fillText("テキストボックスにあなたのユーザー名を入れ画面をクリックするかEnterキーを押してください。", 0, 36);

document.getElementById('next').style.visibility = 'hidden';
document.getElementById('next').style.display = 'none';

//確信度
document.getElementById('confidence').style.display = 'none';

//実験参加者の名前
let name = document.getElementById("name");

//推測した条件
let condition = document.getElementById("condition");
condition.style.visibility = 'hidden';

let conditions = [];

//point
let points = [];

let points8 = [];

let points4 = [];

//自信度
let confs = [];

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

 		if (confirm("あなたのユーザー名は「"+name.value+"」でいいですか？")==false) {
 			return;
 		}

		document.getElementById('name').style.visibility = 'hidden';
		document.getElementById('next').style.display = 'inline';

        var now_time = new Date();
 		all_start_time=now_time.getTime();

		window.scrollTo(0,0);
		context.clearRect(0, 0, 1500, 1000);
		context.font = "24px sans-serif";
		let sentences = [
			"9枚の顔画像が画面に表示され、1枚のみがある条件を満たします。",
			"条件を推測し、その条件を満たす画像をクリックしてください。",
			"条件がわからない場合、どれでもいいので1枚の画像をクリックしてください。",
			"これを12回繰り返します。この間条件は変化しません。",
			"その後、あなたが推測した条件と推測の自信度を回答してください。(1セット目は行わない)",
			"ここまでを1セットとして、5セットの実験を行います。条件はセットごとに異なります。",
			"なお、1セット目は条件が表示されてるので、その条件を満たす画像をクリックしてください。",
			"説明を理解したら、画面上部の「次に進む」をクリックして実験を開始してください。"]

		for (let i = 0; i < sentences.length; i++) {
			context.fillText(sentences[i], 0, 24*i+24);
			}


		document.getElementById('next').style.visibility = 'visible';
 		screen++;
 	}

}

window.onbeforeunload = function(e) {
    e.returnValue = "ページを離れようとしています。よろしいですか？";
}