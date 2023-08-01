'use strict';

function onClick(e) {
	let x = e.offsetX;
 	let y = e.offsetY;

	//画面更新-1->0
 	if (screen == -1 && name.value.length>0) {
 		name_input();
 	}

	//画面10->11 ... 13->14 ->20
 	if (0 <= x && x < imgsize*3 && 0 <= y && y < imgsize*3 && screen >= 10 && screen <= 13) {

 		context.clearRect(0, 0, 1500, 7000);
        let x = e.offsetX;
        let y = e.offsetY;
        let number = Math.floor(y / imgsize) * 3 + Math.floor(x / imgsize) + 1;
        answer.push(number);
        screen++;
        var now_time = new Date();
        times.push(now_time.getTime()-start_time);

        if (screen <= 13) {
			let hack = new Hack();
			hack.draw();
        }
        else{

        	screen = 20;
			window.scrollTo(0,0);
			context.clearRect(0, 0, 1500, 7000);

			condition.style.visibility = 'visible';
			document.getElementById('next').style.visibility = 'visible';

			context.font = "24px sans-serif";
			let sentences = ["推測した条件を入力してください。",
				"条件がまったく分からなかった場合には、「不明」などの単語を入力してください。",			
				"次に進むを押すと正解の条件と認証正解率が表示されます。"]

			for (let i = 0; i < sentences.length; i++) {
				context.fillText(sentences[i], 0, 24*i+24);
				}
 		
        }

        return ;
        
 	}

}

//画面更新
function next() {

 	console.log(screen);
	//画面更新0->1 ... 3->4
 	if (screen <= 3) {
 		context.clearRect(0, 0, 1500, 7000);
		let display = new Display();
		display.draw();
 		screen++;
		return;
 	}

 	if (screen == 4) {
 		screen = 10;
 		context.clearRect(0, 0, 1500, 7000);
		let hack = new Hack();
		hack.draw();
		document.getElementById('next').style.visibility = 'hidden';
		return;
 	}

 	if (screen == 20) {
 		if (confirm("推測した条件は「"+condition.value+"」でいいですか？")==true) {
 			console.log(answer);
 			let correct = data[0][3].slice(4,8);
 			let point = 0;
 			for (let i=0; i<4; i++) {
 				if (answer[i] == correct[i]) {
 					point++;
 				}
 			}

 			screen+=1;

 			context.clearRect(0, 0, 1500, 7000);
			context.font = "24px sans-serif";
			let sentences = ["正解の条件 : "+data[0][0],
				"認証正解数 "+point+"/4"]
			for (let i = 0; i < sentences.length; i++) {
				context.fillText(sentences[i], 0, 24*i+24);
				}

 			return;
 		}


	    // //送信データ
	    // var data = [name.value, ok_choose, ng_choose, confirm_choose, ok_images, ng_images, correct, answer, condition.value, authentification, all_time];
	    // var json_data = JSON.stringify(data);

		// fetch("https://script.google.com/macros/s/AKfycbw6-2hQBWAx143Iq48EqRz11oXmhkC9U9NxYtYPMxwbSf2TJpyTARqTDvRLSptEKaU_Ew/exec" , {
		// 	method: "POST",
		// 	body: json_data,
		// 	mode: 'no-cors',
		// 	headers: {"Content-Type": "application/json"}
		// }).then((data) => {
	    // 	console.log(data);
	  	// });;

 	}
}
	

// 画面番号
let screen = -1;

let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
canvas.addEventListener('click', onClick, false);
let imgsize = 128;

//認証回答時間
let times = [0];
let start_time;

//実験開始時間
let all_start_time;
//実験総時間
let all_time;

let answer = [];

//認証情報
let authentification = [];

//実験用データ
let data = [["歯が見えている", "seed58_475.png,seed372_372.png,seed144_372.png,seed288_58.png,seed58_144.png,seed144_144.png,seed144_58.png,seed475_372.png,seed475_475.png,seed288_475.png,seed288_288.png,seed144_475.png,seed58_58.png,seed372_288.png,seed144_288.png,seed58_372.png,seed58_288.png,seed288_144.png,seed475_58.png,seed372_58.png,seed475_288.png,seed372_144.png,seed372_475.png,seed288_372.png,seed475_144.png",
	"seed436_259.png,seed259_259.png,seed347_1.png,seed257_457.png,seed347_259.png,seed55_55.png,seed194_457.png,seed259_1.png,seed185_13.png,seed321_257.png,seed40_13.png,seed55_185.png,seed1_194.png,seed402_402.png,seed321_55.png,seed117_185.png,seed40_55.png,seed321_13.png,seed457_259.png,seed154_347.png,seed402_55.png,seed40_1.png,seed13_257.png,seed154_257.png,seed257_257.png,seed154_13.png,seed457_194.png,seed321_259.png,seed55_321.png,seed40_257.png,seed185_117.png,seed117_117.png,seed321_185.png,seed259_154.png,seed436_13.png,seed1_55.png,seed117_1.png,seed185_40.png,seed13_55.png,seed194_436.png,seed55_194.png,seed457_457.png,seed55_1.png,seed117_259.png,seed436_257.png,seed436_117.png,seed40_40.png,seed194_257.png,seed40_457.png,seed257_436.png,seed194_117.png,seed347_402.png,seed13_40.png,seed347_117.png,seed194_55.png,seed154_185.png,seed13_321.png,seed154_117.png,seed194_347.png,seed457_321.png,seed13_117.png,seed402_194.png,seed347_457.png,seed154_55.png,seed194_321.png,seed185_436.png,seed436_194.png,seed55_402.png,seed402_321.png,seed347_347.png,seed13_194.png,seed1_347.png,seed1_257.png,seed259_185.png,seed55_257.png,seed185_55.png,seed259_402.png,seed40_436.png,seed457_154.png,seed13_457.png,seed257_13.png,seed185_194.png,seed402_185.png,seed402_436.png,seed457_40.png,seed185_321.png,seed13_436.png,seed402_117.png,seed194_194.png,seed194_13.png,seed457_402.png,seed194_154.png,seed117_436.png,seed259_257.png,seed194_259.png,seed13_154.png,seed402_154.png,seed259_457.png,seed154_1.png,seed402_40.png,seed154_40.png,seed347_154.png,seed1_117.png,seed436_40.png,seed436_185.png,seed40_117.png,seed259_321.png,seed117_40.png,seed347_55.png,seed347_194.png,seed257_1.png,seed185_457.png,seed436_436.png,seed347_436.png,seed117_55.png,seed457_257.png,seed1_259.png,seed347_40.png,seed154_402.png,seed436_347.png,seed257_185.png,seed1_154.png,seed259_55.png,seed194_185.png,seed257_55.png,seed402_257.png,seed40_402.png,seed457_13.png,seed257_194.png,seed117_154.png,seed117_347.png,seed402_1.png,seed436_321.png,seed1_1.png,seed13_259.png,seed13_13.png,seed117_321.png,seed257_154.png,seed257_117.png,seed40_154.png,seed347_321.png,seed154_436.png,seed40_347.png,seed402_457.png,seed154_154.png,seed194_402.png,seed117_194.png,seed1_321.png,seed457_117.png,seed117_402.png,seed436_402.png,seed457_436.png,seed321_347.png,seed154_457.png,seed154_259.png,seed55_259.png,seed13_347.png,seed347_13.png,seed321_1.png,seed321_154.png,seed321_117.png,seed117_257.png,seed321_194.png,seed259_40.png,seed185_1.png,seed259_436.png,seed194_1.png,seed347_185.png,seed457_347.png,seed321_321.png,seed55_436.png,seed259_347.png,seed402_13.png,seed321_402.png,seed55_347.png,seed1_13.png,seed40_194.png,seed259_117.png,seed321_436.png,seed154_321.png,seed55_13.png,seed402_347.png,seed402_259.png,seed436_457.png,seed457_1.png,seed457_55.png,seed436_154.png,seed259_194.png,seed185_347.png,seed13_402.png,seed185_402.png,seed259_13.png,seed436_55.png,seed55_40.png,seed1_185.png,seed185_257.png,seed13_185.png,seed40_259.png,seed1_402.png,seed117_13.png,seed55_154.png,seed257_40.png,seed1_436.png,seed1_457.png,seed321_457.png,seed185_259.png,seed257_321.png,seed40_321.png,seed321_40.png,seed185_154.png,seed347_257.png,seed13_1.png,seed257_402.png,seed185_185.png,seed194_40.png,seed436_1.png,seed1_40.png,seed55_457.png,seed117_457.png,seed257_259.png,seed257_347.png,seed457_185.png,seed154_194.png,seed40_185.png,seed55_117.png",
	"5,4,2,3,1,5,8,3,7,6,5,7,7,3,6,2,3,8,4,5,1,2,2,9,3"]
	];

for (let i=0; i<data.length; i++) {
	data[i][1] = data[i][1].split(",");
	data[i][2] = data[i][2].split(",");
	data[i][3] = data[i][3].split(",");
}

//初期画面
context.font = "24px sans-serif";
context.fillText("テキストボックスにあなたの名前を入れ画面をクリックするかEnterキーを押してください。", 0, 36);

document.getElementById('next').style.visibility = 'hidden';
document.getElementById('next').style.display = 'none';

//実験参加者の名前
let name = document.getElementById("name");

//推測した条件
let condition = document.getElementById("condition");
condition.style.visibility = 'hidden';

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
