'use strict';

function onClick(e) {
	let x = e.offsetX;
 	let y = e.offsetY;

	//画面更新-1->0
 	if (screen == -1 && name.value.length>0) {
 		name_input();
 	}

	//画面4->5 ... 11->12 ->20
 	if (0 <= x && x < imgsize*3 && 0 <= y && y < imgsize*3 && screen%20 >= 4 && screen%20 <= 11) {

 		context.clearRect(0, 0, 1500, 1000);
        let x = e.offsetX;
        let y = e.offsetY;
        let number = Math.floor(y / imgsize) * 3 + Math.floor(x / imgsize) + 1;
        answer.push(number);
        screen++;

		var now_time = new Date();
        times.push(now_time.getTime()-n_time);
        n_time = now_time;

        if (screen%20 <= 11) {
			let hack = new Hack();
			hack.draw();
        }
        else{
			let pass = Math.floor(screen / 20);
			if (pass == 0 || pass == 7) {
				document.getElementById('next').style.visibility = 'visible';
				next();
				return;
			}

     		//screen%20==12
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

	//画面更新0->1 ... 3->4
 	if (screen%20 <= 3 & screen<280) {

 		if (screen%20 == 0 & screen/20 == 0) {
 			if (confirm("次の画像パスワード認証に進んでいいですか？　次のパスワードの条件は「前髪で額が隠れている人」です。") == false) {
 				return
 			};
 		}

 		else if (screen%20 == 0 & screen/20 == 7) {
 			if (confirm("次の画像パスワード認証に進んでいいですか？　次のパスワードの条件は「髪がパーマの人」です。") == false) {
 				return
 			};
 		}

 		else if (screen%20 == 0) {
 			if (confirm("次の画像パスワード認証に進んでいいですか？　次のパスワードの条件は自分で推測してください。") == false) {
 				return
 			};
 		}		

 		context.clearRect(0, 0, 1500, 1000);
		let display = new Display();
		display.draw();
 		screen++;

 		document.getElementById('next').style.visibility = 'hidden';

 		let limit = 1800;
 		if (0<Math.floor(screen/20) & Math.floor(screen/20)<=6) {
 			limit = auth_limit[rand[Math.floor(screen/20)-1]];
 		}
 		else if (7<Math.floor(screen/20) & Math.floor(screen/20)<=13) {
 			limit = auth_limit[rand[Math.floor(screen/20)-2]];
 		}

	    window.setTimeout(next, limit);
		return;
 	}

 	if (screen%20 == 4 & screen<280) {

        n_time = new Date();
 		context.clearRect(0, 0, 1500, 1000);
		let hack = new Hack();
		hack.draw();
		document.getElementById('next').style.visibility = 'hidden';
		return;
 	}

 	if (screen%20 == 12 & screen<280) {
 		let pass = Math.floor(screen / 20);
		if (document.getElementById('confidence').value == 0 && pass!=0 && pass!=7) {
			alert("自信度を選択してください。");
			return
		};

 		if (pass==0 || pass==7 || confirm("推測した条件は「"+condition.value+"」でいいですか？")==true) {
 			let correct = all_data[pass][3].slice(4,12);
 			let point = 0;
 			for (let i=0; i<8; i++) {
 				if (answer[8*pass+i] == correct[i]) {
 					point++;
 				}
 			}

 			condition.style.visibility = 'hidden';
 			screen+=8;

 			confs.push(document.getElementById('confidence').value);

 			document.getElementById('confidence').value=0;
 			document.getElementById('confidence').style.display='none';

 			context.clearRect(0, 0, 1500, 1000);
			context.font = "24px sans-serif";
			let sentences = ["正解の条件 : "+all_data[pass][0],
							"認証正解数 "+point+"/8"]
			for (let i = 0; i < sentences.length; i++) {
				context.fillText(sentences[i], 0, 24*i+24);
				}

			points.push(point);

			if (pass==0 || pass==7) {
				conditions.push("N");
			}
			else{
				conditions.push(condition.value);
			}

 			// return;
 		}

 	if (screen == 280) {

	    var now_time = new Date();
 		all_time=now_time.getTime()-all_start_time;

	    //送信データ
	    var dt = [name.value, points, answer, conditions, rand, rev_rand, times, all_time, confs];
	    var json_data = JSON.stringify(dt);

		fetch("https://script.google.com/macros/s/AKfycbx_uYSkQw8Tvoh0Y4ZSbM62oHDui_UJw3Wf58CqcpSh7_0PzvKA2aBoRvV8DJ-eNX-woQ/exec" , {
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
			"確認コードは、「psaf」になります。ランサーズ上の実験後アンケートに回答してください。",
			"確認コードはこのページを閉じると二度と表示出来なくなるので注意してください。",
			"なお、正解の条件は以下のようになります。"];

		for (let i = 0; i < sentences.length; i++) {
			context.fillText(sentences[i], 0, 24*i+72);
			}

		for (let i = 0; i < 14; i++) {
			var str;
			if (i == 0) {
				str = "前髪で額が隠れている人";
			}
			else if (i < 7) {
				str = data[rand[i-1]][0];
			}
			else if (i == 7) {
				str = "髪がパーマの人";
			}
			else {
				str = data[rand[i-2]][0];
			}
			context.fillText((i+1)+"セット目の条件："+str+" 認証正解数："+points[i]+"/8", 0, 24*i+72+120);
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
let times = [];
let n_time;

//実験開始時間
var now_time = new Date();
let all_start_time = now_time.getTime();;
//実験総時間
let all_time;

let answer = [];

//実験用データ
let data = [["歯が見えている人", "seed58_475.png,seed372_372.png,seed144_372.png,seed288_58.png,seed58_144.png,seed144_144.png,seed144_58.png,seed475_372.png,seed475_475.png,seed288_475.png,seed288_288.png,seed144_475.png,seed58_58.png,seed372_288.png,seed144_288.png,seed58_372.png,seed58_288.png,seed288_144.png,seed475_58.png,seed372_58.png,seed475_288.png,seed372_144.png,seed372_475.png,seed288_372.png,seed475_144.png",
	"seed436_259.png,seed259_259.png,seed347_1.png,seed257_457.png,seed347_259.png,seed55_55.png,seed194_457.png,seed259_1.png,seed185_13.png,seed321_257.png,seed40_13.png,seed55_185.png,seed1_194.png,seed402_402.png,seed321_55.png,seed117_185.png,seed40_55.png,seed321_13.png,seed457_259.png,seed154_347.png,seed402_55.png,seed40_1.png,seed13_257.png,seed154_257.png,seed257_257.png,seed154_13.png,seed457_194.png,seed321_259.png,seed55_321.png,seed40_257.png,seed185_117.png,seed117_117.png,seed321_185.png,seed259_154.png,seed436_13.png,seed1_55.png,seed117_1.png,seed185_40.png,seed13_55.png,seed194_436.png,seed55_194.png,seed457_457.png,seed55_1.png,seed117_259.png,seed436_257.png,seed436_117.png,seed40_40.png,seed194_257.png,seed40_457.png,seed257_436.png,seed194_117.png,seed347_402.png,seed13_40.png,seed347_117.png,seed194_55.png,seed154_185.png,seed13_321.png,seed154_117.png,seed194_347.png,seed457_321.png,seed13_117.png,seed402_194.png,seed347_457.png,seed154_55.png,seed194_321.png,seed185_436.png,seed436_194.png,seed55_402.png,seed402_321.png,seed347_347.png,seed13_194.png,seed1_347.png,seed1_257.png,seed259_185.png,seed55_257.png,seed185_55.png,seed259_402.png,seed40_436.png,seed457_154.png,seed13_457.png,seed257_13.png,seed185_194.png,seed402_185.png,seed402_436.png,seed457_40.png,seed185_321.png,seed13_436.png,seed402_117.png,seed194_194.png,seed194_13.png,seed457_402.png,seed194_154.png,seed117_436.png,seed259_257.png,seed194_259.png,seed13_154.png,seed402_154.png,seed259_457.png,seed154_1.png,seed402_40.png,seed154_40.png,seed347_154.png,seed1_117.png,seed436_40.png,seed436_185.png,seed40_117.png,seed259_321.png,seed117_40.png,seed347_55.png,seed347_194.png,seed257_1.png,seed185_457.png,seed436_436.png,seed347_436.png,seed117_55.png,seed457_257.png,seed1_259.png,seed347_40.png,seed154_402.png,seed436_347.png,seed257_185.png,seed1_154.png,seed259_55.png,seed194_185.png,seed257_55.png,seed402_257.png,seed40_402.png,seed457_13.png,seed257_194.png,seed117_154.png,seed117_347.png,seed402_1.png,seed436_321.png,seed1_1.png,seed13_259.png,seed13_13.png,seed117_321.png,seed257_154.png,seed257_117.png,seed40_154.png,seed347_321.png,seed154_436.png,seed40_347.png,seed402_457.png,seed154_154.png,seed194_402.png,seed117_194.png,seed1_321.png,seed457_117.png,seed117_402.png,seed436_402.png,seed457_436.png,seed321_347.png,seed154_457.png,seed154_259.png,seed55_259.png,seed13_347.png,seed347_13.png,seed321_1.png,seed321_154.png,seed321_117.png,seed117_257.png,seed321_194.png,seed259_40.png,seed185_1.png,seed259_436.png,seed194_1.png,seed347_185.png,seed457_347.png,seed321_321.png,seed55_436.png,seed259_347.png,seed402_13.png,seed321_402.png,seed55_347.png,seed1_13.png,seed40_194.png,seed259_117.png,seed321_436.png,seed154_321.png,seed55_13.png,seed402_347.png,seed402_259.png,seed436_457.png,seed457_1.png,seed457_55.png,seed436_154.png,seed259_194.png,seed185_347.png,seed13_402.png,seed185_402.png,seed259_13.png,seed436_55.png,seed55_40.png,seed1_185.png,seed185_257.png,seed13_185.png,seed40_259.png,seed1_402.png,seed117_13.png,seed55_154.png,seed257_40.png,seed1_436.png,seed1_457.png,seed321_457.png,seed185_259.png,seed257_321.png,seed40_321.png,seed321_40.png,seed185_154.png,seed347_257.png,seed13_1.png,seed257_402.png,seed185_185.png,seed194_40.png,seed436_1.png,seed1_40.png,seed55_457.png,seed117_457.png,seed257_259.png,seed257_347.png,seed457_185.png,seed154_194.png,seed40_185.png,seed55_117.png",
	"5,4,2,3,1,5,8,3,7,6,5,7,7,3,6,2,3,8,4,5,1,2,2,9,3"],

	["眼鏡をかけている人", "seed65_112.png,seed2_65.png,seed3_2.png,seed2_42.png,seed65_42.png,seed42_112.png,seed112_2.png,seed112_42.png,seed2_2.png,seed65_65.png,seed42_2.png,seed42_3.png,seed3_42.png,seed65_3.png,seed2_112.png,seed112_3.png,seed3_3.png,seed112_65.png,seed42_42.png,seed3_65.png,seed3_112.png,seed112_112.png,seed42_65.png,seed65_2.png,seed2_3.png",
	"seed25_35.png,seed45_35.png,seed38_35.png,seed47_37.png,seed4_5.png,seed38_54.png,seed47_48.png,seed44_48.png,seed45_46.png,seed38_37.png,seed44_44.png,seed25_48.png,seed34_5.png,seed5_37.png,seed35_25.png,seed36_45.png,seed15_34.png,seed34_48.png,seed34_35.png,seed47_5.png,seed5_35.png,seed37_37.png,seed37_44.png,seed37_15.png,seed48_54.png,seed15_5.png,seed44_37.png,seed4_25.png,seed35_5.png,seed15_48.png,seed36_25.png,seed45_45.png,seed37_48.png,seed34_45.png,seed44_47.png,seed34_44.png,seed47_4.png,seed38_34.png,seed47_34.png,seed48_25.png,seed25_34.png,seed5_4.png,seed4_44.png,seed45_15.png,seed46_15.png,seed45_44.png,seed37_45.png,seed46_48.png,seed37_5.png,seed34_54.png,seed15_35.png,seed54_4.png,seed54_47.png,seed4_38.png,seed47_47.png,seed38_45.png,seed54_44.png,seed4_15.png,seed46_34.png,seed36_38.png,seed36_47.png,seed54_45.png,seed38_47.png,seed4_35.png,seed15_44.png,seed44_34.png,seed38_4.png,seed45_47.png,seed25_38.png,seed25_36.png,seed44_36.png,seed54_36.png,seed36_46.png,seed4_54.png,seed36_36.png,seed5_38.png,seed47_35.png,seed45_37.png,seed48_44.png,seed5_5.png,seed35_37.png,seed47_54.png,seed48_45.png,seed48_34.png,seed4_37.png,seed15_4.png,seed5_46.png,seed54_37.png,seed38_48.png,seed48_46.png,seed15_37.png,seed48_35.png,seed48_48.png,seed46_4.png,seed46_5.png,seed44_54.png,seed5_47.png,seed5_15.png,seed36_48.png,seed35_44.png,seed36_15.png,seed25_4.png,seed38_15.png,seed25_47.png,seed45_5.png,seed47_15.png,seed44_15.png,seed35_4.png,seed47_25.png,seed47_38.png,seed44_46.png,seed35_15.png,seed4_47.png,seed46_37.png,seed5_45.png,seed45_34.png,seed54_34.png,seed25_15.png,seed5_48.png,seed15_25.png,seed36_35.png,seed35_47.png,seed45_54.png,seed46_38.png,seed47_44.png,seed46_35.png,seed15_38.png,seed48_5.png,seed46_54.png,seed48_47.png,seed25_44.png,seed38_46.png,seed35_45.png,seed46_25.png,seed4_34.png,seed38_44.png,seed34_47.png,seed45_48.png,seed15_54.png,seed37_36.png,seed45_38.png,seed4_48.png,seed44_5.png,seed36_4.png,seed34_38.png,seed37_46.png,seed44_25.png,seed5_36.png,seed48_15.png,seed46_36.png,seed45_4.png,seed35_34.png,seed38_5.png,seed46_45.png,seed46_46.png,seed34_34.png,seed36_34.png,seed36_44.png,seed4_46.png,seed5_34.png,seed37_25.png,seed54_35.png,seed35_36.png,seed34_15.png,seed44_45.png,seed44_38.png,seed25_54.png,seed36_54.png,seed48_36.png,seed47_45.png,seed48_4.png,seed15_36.png,seed25_46.png,seed35_48.png,seed48_37.png,seed38_38.png,seed37_35.png,seed25_5.png,seed25_45.png,seed34_25.png,seed37_38.png,seed45_36.png,seed34_36.png,seed35_46.png,seed36_37.png,seed5_44.png,seed37_34.png,seed5_54.png,seed54_25.png,seed25_25.png,seed54_15.png,seed4_4.png,seed4_36.png,seed48_38.png,seed38_25.png,seed34_37.png,seed44_4.png,seed38_36.png,seed47_46.png,seed35_38.png,seed35_35.png,seed37_47.png,seed44_35.png,seed54_48.png,seed37_4.png,seed45_25.png,seed54_46.png,seed35_54.png,seed54_54.png,seed34_4.png,seed36_5.png,seed37_54.png,seed54_38.png,seed34_46.png,seed54_5.png,seed47_36.png,seed15_46.png,seed15_15.png,seed46_47.png,seed5_25.png,seed25_37.png,seed15_47.png,seed4_45.png,seed15_45.png,seed46_44.png",
	"4,7,9,2,3,4,7,7,7,8,4,9,9,2,1,9,4,2,5,2,4,9,5,7,5"],

	["子供", "seed99_128.png,seed99_99.png,seed128_16.png,seed6_44.png,seed16_16.png,seed16_99.png,seed44_99.png,seed128_128.png,seed6_6.png,seed128_99.png,seed44_128.png,seed44_16.png,seed44_6.png,seed6_128.png,seed99_16.png,seed44_44.png,seed16_44.png,seed99_44.png,seed6_16.png,seed128_44.png,seed16_6.png,seed6_99.png,seed16_128.png,seed99_6.png,seed128_6.png",
	"seed14_13.png,seed11_11.png,seed22_13.png,seed4_12.png,seed22_4.png,seed4_23.png,seed13_24.png,seed5_14.png,seed22_24.png,seed4_24.png,seed2_22.png,seed5_25.png,seed11_13.png,seed4_15.png,seed1_11.png,seed25_15.png,seed21_11.png,seed11_23.png,seed24_13.png,seed2_15.png,seed24_4.png,seed13_3.png,seed5_15.png,seed24_23.png,seed14_14.png,seed11_2.png,seed1_15.png,seed23_3.png,seed11_24.png,seed13_22.png,seed2_14.png,seed1_12.png,seed12_1.png,seed3_3.png,seed15_21.png,seed3_24.png,seed12_2.png,seed22_5.png,seed22_1.png,seed5_11.png,seed5_21.png,seed21_1.png,seed3_2.png,seed4_11.png,seed25_4.png,seed11_15.png,seed1_24.png,seed11_5.png,seed14_4.png,seed1_21.png,seed12_23.png,seed3_12.png,seed4_3.png,seed25_2.png,seed1_1.png,seed5_12.png,seed12_15.png,seed4_4.png,seed2_25.png,seed23_2.png,seed2_2.png,seed15_14.png,seed2_23.png,seed24_15.png,seed21_3.png,seed21_14.png,seed22_22.png,seed25_23.png,seed25_5.png,seed23_21.png,seed12_3.png,seed3_11.png,seed11_12.png,seed15_22.png,seed3_13.png,seed14_23.png,seed15_23.png,seed14_11.png,seed24_3.png,seed5_24.png,seed22_14.png,seed13_1.png,seed25_21.png,seed4_25.png,seed4_5.png,seed23_11.png,seed1_25.png,seed21_24.png,seed21_21.png,seed15_15.png,seed21_5.png,seed4_21.png,seed25_24.png,seed4_1.png,seed14_22.png,seed22_21.png,seed15_4.png,seed23_1.png,seed5_13.png,seed21_23.png,seed11_4.png,seed21_22.png,seed21_25.png,seed2_1.png,seed14_21.png,seed11_3.png,seed25_13.png,seed5_22.png,seed15_11.png,seed5_5.png,seed11_1.png,seed13_13.png,seed24_2.png,seed11_14.png,seed3_15.png,seed24_5.png,seed15_12.png,seed23_23.png,seed12_14.png,seed1_3.png,seed14_25.png,seed23_24.png,seed1_23.png,seed15_5.png,seed4_2.png,seed5_1.png,seed3_14.png,seed21_4.png,seed15_3.png,seed14_3.png,seed25_22.png,seed12_11.png,seed25_25.png,seed12_4.png,seed15_25.png,seed14_2.png,seed13_21.png,seed2_11.png,seed1_14.png,seed22_12.png,seed14_12.png,seed21_15.png,seed13_23.png,seed15_1.png,seed4_22.png,seed2_13.png,seed12_5.png,seed21_13.png,seed2_3.png,seed21_2.png,seed23_5.png,seed24_14.png,seed4_13.png,seed3_1.png,seed22_15.png,seed24_11.png,seed25_1.png,seed1_22.png,seed3_22.png,seed12_24.png,seed13_14.png,seed23_12.png,seed1_2.png,seed12_21.png,seed2_12.png,seed22_25.png,seed4_14.png,seed22_2.png,seed23_14.png,seed13_5.png,seed3_25.png,seed13_2.png,seed24_22.png,seed24_12.png,seed12_25.png,seed12_22.png,seed5_23.png,seed2_4.png,seed13_15.png,seed14_1.png,seed11_22.png,seed15_24.png,seed21_12.png,seed25_14.png,seed22_11.png,seed23_22.png,seed1_13.png,seed5_4.png,seed13_25.png,seed14_5.png,seed13_12.png,seed22_23.png,seed11_25.png,seed1_5.png,seed25_11.png,seed2_5.png,seed3_23.png,seed13_4.png,seed13_11.png,seed5_2.png,seed22_3.png,seed3_4.png,seed23_13.png,seed23_25.png,seed24_25.png,seed5_3.png,seed3_21.png,seed1_4.png,seed25_12.png,seed3_5.png,seed24_1.png,seed24_24.png,seed11_21.png,seed2_24.png,seed14_15.png,seed23_15.png,seed15_13.png,seed25_3.png,seed2_21.png,seed14_24.png,seed15_2.png,seed12_13.png,seed23_4.png,seed12_12.png,seed24_21.png",
	"6,7,2,1,7,9,3,8,9,3,8,7,1,3,1,4,6,6,2,4,1,2,4,1,4"],

	["帽子をかぶっている人", "seed217_217.png,seed217_292.png,seed292_328.png,seed292_292.png,seed373_351.png,seed373_373.png,seed292_217.png,seed328_217.png,seed328_292.png,seed217_351.png,seed328_373.png,seed328_351.png,seed351_328.png,seed373_217.png,seed351_351.png,seed217_373.png,seed217_328.png,seed292_373.png,seed351_373.png,seed373_328.png,seed328_328.png,seed292_351.png,seed351_217.png,seed373_292.png,seed351_292.png",
	"seed18_1.png,seed8_2.png,seed9_10.png,seed16_1.png,seed5_10.png,seed9_19.png,seed19_4.png,seed8_1.png,seed20_3.png,seed8_16.png,seed10_9.png,seed4_1.png,seed5_4.png,seed4_3.png,seed6_7.png,seed10_5.png,seed6_20.png,seed5_17.png,seed17_9.png,seed1_8.png,seed3_4.png,seed5_19.png,seed19_1.png,seed1_1.png,seed20_18.png,seed7_8.png,seed10_17.png,seed20_1.png,seed18_8.png,seed9_3.png,seed20_8.png,seed8_18.png,seed8_20.png,seed1_10.png,seed1_2.png,seed17_20.png,seed16_6.png,seed5_16.png,seed19_9.png,seed2_8.png,seed3_20.png,seed19_10.png,seed2_19.png,seed17_1.png,seed7_5.png,seed6_5.png,seed16_19.png,seed10_18.png,seed17_7.png,seed20_20.png,seed3_5.png,seed10_16.png,seed19_6.png,seed20_10.png,seed17_4.png,seed8_10.png,seed9_18.png,seed7_19.png,seed8_9.png,seed18_17.png,seed8_19.png,seed20_2.png,seed16_3.png,seed9_7.png,seed19_7.png,seed16_20.png,seed10_19.png,seed7_6.png,seed17_19.png,seed5_9.png,seed19_3.png,seed4_6.png,seed19_8.png,seed6_19.png,seed7_18.png,seed16_17.png,seed1_4.png,seed3_2.png,seed3_17.png,seed2_18.png,seed17_3.png,seed6_2.png,seed8_8.png,seed1_17.png,seed3_6.png,seed2_5.png,seed18_18.png,seed7_2.png,seed18_6.png,seed1_3.png,seed5_20.png,seed18_19.png,seed9_9.png,seed10_6.png,seed1_20.png,seed5_7.png,seed20_19.png,seed18_10.png,seed20_6.png,seed16_8.png,seed4_20.png,seed17_6.png,seed9_20.png,seed9_1.png,seed18_3.png,seed4_17.png,seed6_18.png,seed6_9.png,seed10_1.png,seed4_16.png,seed4_4.png,seed1_5.png,seed7_1.png,seed9_4.png,seed6_17.png,seed4_18.png,seed2_1.png,seed20_17.png,seed9_8.png,seed18_9.png,seed16_4.png,seed17_5.png,seed10_2.png,seed8_7.png,seed9_17.png,seed8_17.png,seed1_9.png,seed10_7.png,seed5_6.png,seed6_8.png,seed5_18.png,seed6_16.png,seed4_9.png,seed2_17.png,seed16_18.png,seed16_5.png,seed20_16.png,seed16_10.png,seed18_7.png,seed2_16.png,seed19_2.png,seed6_10.png,seed3_9.png,seed6_6.png,seed16_2.png,seed20_7.png,seed7_4.png,seed5_1.png,seed2_7.png,seed5_8.png,seed9_5.png,seed18_20.png,seed4_5.png,seed8_4.png,seed7_9.png,seed3_8.png,seed20_4.png,seed4_19.png,seed6_1.png,seed17_16.png,seed8_6.png,seed1_7.png,seed2_20.png,seed2_9.png,seed2_4.png,seed9_6.png,seed7_10.png,seed1_16.png,seed7_20.png,seed1_19.png,seed4_7.png,seed3_1.png,seed8_5.png,seed7_7.png,seed5_2.png,seed10_20.png,seed19_5.png,seed5_3.png,seed3_16.png,seed3_10.png,seed19_19.png,seed5_5.png,seed7_17.png,seed2_10.png,seed10_4.png,seed2_6.png,seed9_2.png,seed20_5.png,seed7_16.png,seed10_10.png,seed6_3.png,seed17_10.png,seed2_2.png,seed4_8.png,seed19_20.png,seed3_3.png,seed18_16.png,seed17_18.png,seed18_4.png,seed19_16.png,seed6_4.png,seed16_7.png,seed17_8.png,seed17_17.png,seed16_16.png,seed9_16.png,seed16_9.png,seed17_2.png,seed10_3.png,seed4_10.png,seed20_9.png,seed1_6.png,seed7_3.png,seed3_7.png,seed3_18.png,seed10_8.png,seed4_2.png,seed19_17.png,seed8_3.png,seed18_5.png,seed19_18.png,seed18_2.png,seed2_3.png,seed1_18.png,seed3_19.png",
	"2,1,3,4,3,3,6,5,5,9,7,2,4,3,5,5,4,4,9,7,5,6,8,9,5"],

	["ダンディーな人", "seed404_11.png,seed404_36.png,seed404_132.png,seed11_132.png,seed36_404.png,seed36_1.png,seed1_404.png,seed132_11.png,seed36_132.png,seed1_11.png,seed11_11.png,seed11_36.png,seed404_1.png,seed36_11.png,seed132_36.png,seed404_404.png,seed132_1.png,seed132_404.png,seed132_132.png,seed1_36.png,seed1_1.png,seed11_1.png,seed1_132.png,seed11_404.png,seed36_36.png",
	"seed16_45.png,seed24_44.png,seed45_5.png,seed4_4.png,seed24_42.png,seed56_4.png,seed24_45.png,seed92_54.png,seed92_123.png,seed5_56.png,seed45_43.png,seed5_45.png,seed4_5.png,seed44_87.png,seed45_56.png,seed54_128.png,seed45_44.png,seed128_24.png,seed127_16.png,seed5_5.png,seed87_123.png,seed127_56.png,seed127_128.png,seed87_44.png,seed4_128.png,seed43_128.png,seed43_43.png,seed24_5.png,seed92_56.png,seed127_92.png,seed54_92.png,seed128_44.png,seed92_44.png,seed45_123.png,seed43_45.png,seed5_4.png,seed4_123.png,seed123_24.png,seed43_24.png,seed45_92.png,seed123_43.png,seed123_87.png,seed45_45.png,seed42_45.png,seed87_16.png,seed43_44.png,seed87_5.png,seed127_44.png,seed44_45.png,seed54_16.png,seed44_54.png,seed56_87.png,seed24_127.png,seed56_24.png,seed43_54.png,seed92_92.png,seed16_127.png,seed128_43.png,seed5_16.png,seed24_128.png,seed16_4.png,seed44_44.png,seed123_16.png,seed123_123.png,seed128_87.png,seed56_54.png,seed43_42.png,seed56_42.png,seed128_56.png,seed87_54.png,seed43_87.png,seed42_128.png,seed5_127.png,seed24_16.png,seed5_24.png,seed54_45.png,seed92_16.png,seed5_54.png,seed123_42.png,seed123_44.png,seed127_24.png,seed4_44.png,seed45_42.png,seed44_127.png,seed43_16.png,seed4_42.png,seed4_43.png,seed92_87.png,seed16_128.png,seed4_24.png,seed45_54.png,seed92_43.png,seed45_128.png,seed56_44.png,seed44_5.png,seed44_43.png,seed54_5.png,seed5_128.png,seed56_123.png,seed5_123.png,seed54_44.png,seed128_92.png,seed44_42.png,seed5_42.png,seed56_16.png,seed16_16.png,seed44_92.png,seed123_5.png,seed24_4.png,seed42_16.png,seed43_123.png,seed4_87.png,seed4_16.png,seed128_16.png,seed54_123.png,seed44_56.png,seed92_127.png,seed44_128.png,seed5_87.png,seed87_127.png,seed87_128.png,seed92_42.png,seed128_4.png,seed127_5.png,seed128_45.png,seed56_43.png,seed45_4.png,seed87_4.png,seed128_5.png,seed87_43.png,seed92_4.png,seed87_42.png,seed123_92.png,seed16_87.png,seed16_56.png,seed54_54.png,seed87_92.png,seed123_128.png,seed4_56.png,seed16_44.png,seed4_54.png,seed42_92.png,seed16_42.png,seed24_56.png,seed42_87.png,seed24_54.png,seed92_5.png,seed127_43.png,seed4_45.png,seed128_127.png,seed43_5.png,seed92_24.png,seed127_42.png,seed54_87.png,seed56_128.png,seed5_92.png,seed24_43.png,seed127_123.png,seed127_45.png,seed54_4.png,seed123_4.png,seed54_56.png,seed92_128.png,seed16_43.png,seed42_24.png,seed87_87.png,seed42_5.png,seed24_92.png,seed123_54.png,seed56_5.png,seed56_56.png,seed128_123.png,seed45_127.png,seed16_5.png,seed44_123.png,seed24_87.png,seed56_92.png,seed44_16.png,seed42_43.png,seed87_56.png,seed123_127.png,seed42_56.png,seed43_4.png,seed45_16.png,seed4_92.png,seed16_92.png,seed4_127.png,seed45_24.png,seed5_44.png,seed42_44.png,seed24_24.png,seed24_123.png,seed5_43.png,seed54_127.png,seed43_127.png,seed44_24.png,seed54_43.png,seed128_54.png,seed127_87.png,seed42_4.png,seed16_54.png,seed42_42.png,seed123_45.png,seed128_128.png,seed127_4.png,seed45_87.png,seed54_24.png,seed44_4.png,seed127_127.png,seed42_54.png,seed42_127.png,seed87_24.png,seed43_92.png,seed42_123.png,seed128_42.png,seed54_42.png,seed56_45.png,seed87_45.png,seed16_24.png,seed92_45.png,seed123_56.png,seed56_127.png,seed16_123.png,seed43_56.png,seed127_54.png",
	"6,5,5,9,1,8,6,1,1,1,3,2,6,3,4,1,8,1,7,9,3,9,8,8,2"],

	["背景が緑", "seed25_48.png,seed48_25.png,seed48_89.png,seed33_96.png,seed25_96.png,seed33_25.png,seed96_33.png,seed96_48.png,seed48_48.png,seed33_33.png,seed48_33.png,seed96_89.png,seed89_89.png,seed89_96.png,seed25_25.png,seed33_89.png,seed25_33.png,seed89_48.png,seed48_96.png,seed89_25.png,seed96_96.png,seed96_25.png,seed89_33.png,seed33_48.png,seed25_89.png",
	"seed1_16.png,seed20_18.png,seed5_16.png,seed18_10.png,seed7_3.png,seed20_17.png,seed14_9.png,seed4_14.png,seed2_10.png,seed7_6.png,seed3_10.png,seed5_17.png,seed7_8.png,seed5_7.png,seed20_2.png,seed16_1.png,seed5_4.png,seed14_3.png,seed9_5.png,seed17_8.png,seed20_7.png,seed2_17.png,seed10_4.png,seed3_9.png,seed5_3.png,seed18_3.png,seed5_14.png,seed18_6.png,seed7_17.png,seed1_9.png,seed16_14.png,seed7_9.png,seed16_20.png,seed16_16.png,seed14_2.png,seed5_5.png,seed17_1.png,seed20_8.png,seed7_14.png,seed8_20.png,seed4_16.png,seed14_14.png,seed10_7.png,seed6_18.png,seed8_1.png,seed14_20.png,seed4_9.png,seed14_10.png,seed17_3.png,seed9_7.png,seed10_6.png,seed3_8.png,seed18_7.png,seed6_9.png,seed20_3.png,seed14_18.png,seed1_10.png,seed2_5.png,seed17_18.png,seed5_8.png,seed8_18.png,seed4_7.png,seed4_1.png,seed2_20.png,seed2_6.png,seed9_6.png,seed9_9.png,seed3_20.png,seed6_1.png,seed3_1.png,seed18_1.png,seed8_6.png,seed14_8.png,seed9_16.png,seed18_5.png,seed4_5.png,seed5_1.png,seed2_8.png,seed14_6.png,seed20_6.png,seed17_16.png,seed2_14.png,seed7_4.png,seed4_2.png,seed10_16.png,seed16_3.png,seed8_10.png,seed2_16.png,seed17_17.png,seed10_20.png,seed2_3.png,seed8_7.png,seed5_20.png,seed18_20.png,seed16_6.png,seed17_9.png,seed10_2.png,seed1_6.png,seed20_16.png,seed14_5.png,seed3_6.png,seed6_8.png,seed4_10.png,seed18_4.png,seed1_8.png,seed5_6.png,seed6_16.png,seed3_5.png,seed16_8.png,seed3_18.png,seed17_4.png,seed10_14.png,seed8_5.png,seed8_8.png,seed8_16.png,seed2_7.png,seed16_5.png,seed7_10.png,seed3_14.png,seed18_17.png,seed16_2.png,seed14_17.png,seed17_10.png,seed9_10.png,seed5_2.png,seed10_10.png,seed9_3.png,seed7_16.png,seed9_17.png,seed10_17.png,seed18_18.png,seed6_10.png,seed6_7.png,seed8_9.png,seed20_14.png,seed2_18.png,seed16_18.png,seed1_14.png,seed4_6.png,seed20_10.png,seed8_3.png,seed14_1.png,seed9_20.png,seed4_4.png,seed9_2.png,seed6_6.png,seed17_6.png,seed4_3.png,seed14_4.png,seed4_8.png,seed17_20.png,seed5_10.png,seed2_1.png,seed7_1.png,seed3_4.png,seed17_2.png,seed10_9.png,seed9_14.png,seed3_16.png,seed20_1.png,seed20_5.png,seed17_7.png,seed6_2.png,seed1_1.png,seed18_9.png,seed18_8.png,seed9_1.png,seed6_20.png,seed7_5.png,seed7_20.png,seed1_20.png,seed6_4.png,seed4_18.png,seed1_3.png,seed2_9.png,seed8_4.png,seed16_7.png,seed1_7.png,seed20_20.png,seed10_18.png,seed2_2.png,seed14_16.png,seed16_4.png,seed3_3.png,seed1_2.png,seed8_2.png,seed14_7.png,seed7_18.png,seed17_5.png,seed10_1.png,seed9_8.png,seed10_5.png,seed5_18.png,seed6_14.png,seed16_9.png,seed5_9.png,seed10_3.png,seed1_17.png,seed6_17.png,seed1_4.png,seed1_5.png,seed20_9.png,seed18_2.png,seed16_17.png,seed3_7.png,seed8_14.png,seed9_4.png,seed7_7.png,seed6_5.png,seed1_18.png,seed10_8.png,seed8_17.png,seed17_14.png,seed20_4.png,seed4_17.png,seed18_16.png,seed2_4.png,seed4_20.png,seed7_2.png,seed3_17.png,seed16_10.png,seed9_18.png,seed3_2.png,seed6_3.png,seed18_14.png",
	"2,1,9,2,2,7,2,4,1,7,6,9,2,9,2,7,8,1,2,8,7,9,7,4,6"],

	//ここから後半

	["モンゴロイドの女性", "seed92_38.png,seed38_38.png,seed92_201.png,seed203_201.png,seed361_38.png,seed38_361.png,seed92_361.png,seed361_92.png,seed92_92.png,seed201_203.png,seed361_203.png,seed38_201.png,seed203_92.png,seed38_92.png,seed201_361.png,seed38_203.png,seed203_38.png,seed92_203.png,seed203_203.png,seed201_201.png,seed201_92.png,seed203_361.png,seed361_361.png,seed201_38.png,seed361_201.png",
	"seed6_3.png,seed13_16.png,seed9_1.png,seed14_10.png,seed16_6.png,seed7_3.png,seed8_7.png,seed13_17.png,seed14_2.png,seed9_2.png,seed7_5.png,seed17_7.png,seed15_15.png,seed4_16.png,seed10_14.png,seed3_1.png,seed10_15.png,seed5_15.png,seed1_8.png,seed7_16.png,seed1_13.png,seed13_3.png,seed8_14.png,seed14_16.png,seed8_17.png,seed1_9.png,seed15_9.png,seed5_1.png,seed16_3.png,seed17_13.png,seed16_5.png,seed15_2.png,seed13_15.png,seed9_16.png,seed2_1.png,seed16_15.png,seed17_2.png,seed8_13.png,seed5_5.png,seed14_8.png,seed3_10.png,seed10_13.png,seed4_13.png,seed6_9.png,seed4_2.png,seed17_16.png,seed5_3.png,seed2_13.png,seed9_6.png,seed2_2.png,seed7_8.png,seed14_3.png,seed3_16.png,seed3_5.png,seed8_15.png,seed15_14.png,seed13_2.png,seed5_17.png,seed10_3.png,seed5_10.png,seed1_15.png,seed7_15.png,seed10_4.png,seed7_7.png,seed2_3.png,seed3_3.png,seed3_14.png,seed10_7.png,seed8_1.png,seed9_8.png,seed3_17.png,seed17_6.png,seed6_16.png,seed14_17.png,seed15_8.png,seed13_8.png,seed10_1.png,seed8_6.png,seed7_4.png,seed16_13.png,seed1_14.png,seed3_7.png,seed14_9.png,seed15_7.png,seed16_8.png,seed5_4.png,seed15_1.png,seed4_1.png,seed16_10.png,seed17_3.png,seed8_10.png,seed6_17.png,seed3_13.png,seed9_13.png,seed14_5.png,seed8_8.png,seed4_5.png,seed3_8.png,seed1_1.png,seed6_2.png,seed15_4.png,seed7_2.png,seed3_15.png,seed1_17.png,seed13_7.png,seed6_8.png,seed13_6.png,seed7_17.png,seed2_14.png,seed13_4.png,seed9_3.png,seed8_3.png,seed3_9.png,seed1_6.png,seed4_10.png,seed16_1.png,seed7_14.png,seed1_5.png,seed16_16.png,seed17_17.png,seed16_17.png,seed17_14.png,seed2_10.png,seed2_5.png,seed16_7.png,seed1_10.png,seed9_4.png,seed16_9.png,seed6_13.png,seed5_8.png,seed10_2.png,seed7_1.png,seed5_16.png,seed6_14.png,seed15_16.png,seed7_9.png,seed2_6.png,seed2_17.png,seed10_17.png,seed4_7.png,seed6_7.png,seed9_10.png,seed17_5.png,seed14_7.png,seed8_16.png,seed7_13.png,seed2_15.png,seed4_8.png,seed14_6.png,seed14_4.png,seed4_3.png,seed13_5.png,seed17_10.png,seed1_7.png,seed1_16.png,seed15_13.png,seed15_10.png,seed5_9.png,seed6_10.png,seed10_5.png,seed17_15.png,seed10_9.png,seed4_17.png,seed9_5.png,seed2_9.png,seed13_10.png,seed1_4.png,seed10_10.png,seed15_5.png,seed4_4.png,seed5_6.png,seed9_9.png,seed15_17.png,seed8_5.png,seed1_2.png,seed6_5.png,seed16_14.png,seed6_15.png,seed6_4.png,seed13_9.png,seed17_8.png,seed10_6.png,seed5_13.png,seed9_15.png,seed6_6.png,seed15_6.png,seed17_1.png,seed3_6.png,seed14_1.png,seed17_9.png,seed5_2.png,seed2_4.png,seed4_14.png,seed7_6.png,seed7_10.png,seed2_16.png,seed14_15.png,seed8_9.png,seed14_14.png,seed5_14.png,seed8_4.png,seed2_8.png,seed10_16.png,seed13_14.png,seed4_6.png,seed10_8.png,seed5_7.png,seed16_4.png,seed9_14.png,seed13_1.png,seed16_2.png,seed9_17.png,seed14_13.png,seed4_9.png,seed9_7.png,seed4_15.png,seed8_2.png,seed1_3.png,seed2_7.png,seed15_3.png,seed3_2.png,seed3_4.png,seed6_1.png,seed13_13.png,seed17_4.png",
	"4,2,4,7,8,1,4,5,1,5,3,7,9,7,9,9,8,4,5,1,6,6,2,2,9"],

	["金髪の人", "seed9_4.png,seed95_105.png,seed105_105.png,seed47_9.png,seed105_95.png,seed9_95.png,seed105_9.png,seed47_95.png,seed105_47.png,seed95_47.png,seed47_4.png,seed47_47.png,seed47_105.png,seed9_105.png,seed95_4.png,seed4_47.png,seed9_9.png,seed95_95.png,seed4_9.png,seed105_4.png,seed4_95.png,seed9_47.png,seed4_4.png,seed95_9.png,seed4_105.png",
	"seed27_23.png,seed1_7.png,seed24_14.png,seed26_24.png,seed7_26.png,seed7_24.png,seed14_15.png,seed1_25.png,seed7_29.png,seed25_26.png,seed29_28.png,seed5_13.png,seed26_7.png,seed11_23.png,seed15_24.png,seed1_27.png,seed5_24.png,seed28_11.png,seed29_27.png,seed29_26.png,seed15_7.png,seed25_7.png,seed27_1.png,seed23_29.png,seed13_3.png,seed3_25.png,seed29_23.png,seed3_11.png,seed15_15.png,seed27_7.png,seed26_14.png,seed7_15.png,seed23_25.png,seed25_3.png,seed3_23.png,seed14_5.png,seed27_3.png,seed25_11.png,seed14_27.png,seed28_29.png,seed3_24.png,seed25_24.png,seed26_25.png,seed13_1.png,seed3_15.png,seed14_11.png,seed27_5.png,seed24_3.png,seed28_27.png,seed14_13.png,seed5_3.png,seed11_14.png,seed11_27.png,seed14_23.png,seed3_26.png,seed15_29.png,seed27_24.png,seed13_13.png,seed3_1.png,seed11_25.png,seed14_3.png,seed5_5.png,seed15_13.png,seed27_11.png,seed29_29.png,seed23_1.png,seed29_7.png,seed25_27.png,seed27_25.png,seed29_25.png,seed3_5.png,seed5_1.png,seed24_26.png,seed25_23.png,seed3_28.png,seed13_24.png,seed13_23.png,seed15_28.png,seed7_27.png,seed28_14.png,seed26_15.png,seed1_15.png,seed14_14.png,seed5_15.png,seed14_24.png,seed5_25.png,seed28_5.png,seed29_3.png,seed7_1.png,seed28_15.png,seed25_28.png,seed28_24.png,seed24_13.png,seed1_5.png,seed29_1.png,seed1_29.png,seed1_13.png,seed15_25.png,seed1_3.png,seed29_5.png,seed1_1.png,seed13_15.png,seed13_25.png,seed26_29.png,seed25_25.png,seed1_11.png,seed23_14.png,seed7_5.png,seed23_23.png,seed26_13.png,seed7_13.png,seed26_26.png,seed23_13.png,seed23_24.png,seed27_26.png,seed14_25.png,seed5_28.png,seed7_3.png,seed27_14.png,seed28_13.png,seed11_28.png,seed11_13.png,seed1_24.png,seed13_7.png,seed25_29.png,seed15_27.png,seed25_15.png,seed24_7.png,seed14_1.png,seed26_28.png,seed23_5.png,seed14_28.png,seed28_7.png,seed13_14.png,seed11_24.png,seed11_29.png,seed27_27.png,seed29_13.png,seed15_1.png,seed5_11.png,seed23_15.png,seed26_27.png,seed28_25.png,seed3_27.png,seed1_28.png,seed28_1.png,seed28_28.png,seed11_3.png,seed23_7.png,seed24_27.png,seed28_23.png,seed23_28.png,seed14_26.png,seed7_25.png,seed27_28.png,seed27_13.png,seed11_5.png,seed29_11.png,seed24_11.png,seed24_25.png,seed26_11.png,seed23_27.png,seed3_14.png,seed7_7.png,seed26_3.png,seed15_14.png,seed3_29.png,seed15_5.png,seed13_26.png,seed24_15.png,seed29_24.png,seed13_11.png,seed26_1.png,seed5_27.png,seed11_15.png,seed3_3.png,seed24_23.png,seed14_7.png,seed23_26.png,seed14_29.png,seed7_11.png,seed1_26.png,seed28_3.png,seed1_23.png,seed5_23.png,seed24_29.png,seed24_1.png,seed11_11.png,seed11_7.png,seed15_23.png,seed13_29.png,seed11_26.png,seed11_1.png,seed5_26.png,seed25_5.png,seed5_14.png,seed27_15.png,seed13_28.png,seed24_24.png,seed25_14.png,seed24_5.png,seed23_3.png,seed27_29.png,seed26_23.png,seed24_28.png,seed13_27.png,seed23_11.png,seed1_14.png,seed3_13.png,seed25_13.png,seed28_26.png,seed3_7.png,seed13_5.png,seed26_5.png,seed5_7.png,seed29_15.png,seed15_26.png,seed29_14.png,seed15_3.png,seed5_29.png,seed7_23.png,seed15_11.png,seed25_1.png,seed7_28.png,seed7_14.png",
	"4,5,3,1,6,8,6,5,3,4,8,3,1,9,6,1,5,2,7,6,8,3,4,7,4"],

	["正面を向いていない人", "seed167_122.png,seed40_167.png,seed111_122.png,seed19_122.png,seed40_111.png,seed167_19.png,seed19_40.png,seed122_19.png,seed19_19.png,seed167_40.png,seed111_40.png,seed122_111.png,seed167_167.png,seed122_122.png,seed122_40.png,seed19_167.png,seed111_19.png,seed122_167.png,seed19_111.png,seed111_167.png,seed40_19.png,seed167_111.png,seed111_111.png,seed40_122.png,seed40_40.png",
	"seed14_33.png,seed60_48.png,seed32_60.png,seed14_60.png,seed61_14.png,seed16_33.png,seed20_60.png,seed20_52.png,seed61_16.png,seed47_32.png,seed25_48.png,seed55_20.png,seed1_61.png,seed25_20.png,seed14_25.png,seed25_14.png,seed16_52.png,seed55_1.png,seed16_25.png,seed60_25.png,seed33_52.png,seed1_60.png,seed32_9.png,seed47_1.png,seed48_14.png,seed1_25.png,seed14_55.png,seed52_48.png,seed32_23.png,seed9_61.png,seed33_60.png,seed20_48.png,seed25_32.png,seed23_61.png,seed25_61.png,seed47_25.png,seed48_20.png,seed61_55.png,seed33_48.png,seed16_61.png,seed48_1.png,seed48_61.png,seed47_9.png,seed33_25.png,seed52_55.png,seed25_47.png,seed23_14.png,seed61_52.png,seed60_14.png,seed25_52.png,seed52_52.png,seed60_1.png,seed9_23.png,seed61_48.png,seed60_9.png,seed23_55.png,seed33_61.png,seed47_14.png,seed9_1.png,seed60_33.png,seed61_32.png,seed52_9.png,seed32_47.png,seed52_23.png,seed9_20.png,seed9_32.png,seed61_1.png,seed16_32.png,seed1_48.png,seed61_23.png,seed48_32.png,seed33_33.png,seed14_52.png,seed47_47.png,seed47_61.png,seed23_47.png,seed55_9.png,seed60_60.png,seed52_47.png,seed52_14.png,seed33_47.png,seed61_20.png,seed25_9.png,seed25_60.png,seed9_48.png,seed48_60.png,seed47_55.png,seed20_33.png,seed9_47.png,seed32_32.png,seed60_47.png,seed20_25.png,seed25_23.png,seed25_33.png,seed9_9.png,seed16_20.png,seed14_61.png,seed16_48.png,seed48_47.png,seed52_61.png,seed52_32.png,seed25_55.png,seed14_9.png,seed23_60.png,seed1_32.png,seed1_1.png,seed16_1.png,seed23_16.png,seed48_25.png,seed47_48.png,seed20_1.png,seed32_61.png,seed14_16.png,seed1_20.png,seed16_47.png,seed60_52.png,seed48_16.png,seed23_1.png,seed1_23.png,seed33_14.png,seed14_47.png,seed33_55.png,seed25_1.png,seed47_16.png,seed61_47.png,seed25_16.png,seed33_1.png,seed20_47.png,seed33_9.png,seed20_55.png,seed33_16.png,seed23_20.png,seed55_32.png,seed9_14.png,seed1_33.png,seed23_33.png,seed16_23.png,seed48_23.png,seed61_25.png,seed14_14.png,seed61_9.png,seed60_20.png,seed32_25.png,seed55_16.png,seed55_55.png,seed52_25.png,seed55_52.png,seed47_60.png,seed14_20.png,seed61_60.png,seed52_60.png,seed60_23.png,seed16_55.png,seed47_23.png,seed52_20.png,seed47_20.png,seed32_1.png,seed32_52.png,seed47_52.png,seed1_52.png,seed1_9.png,seed33_20.png,seed55_33.png,seed20_32.png,seed33_23.png,seed48_55.png,seed60_32.png,seed14_32.png,seed32_33.png,seed48_9.png,seed1_16.png,seed9_55.png,seed23_52.png,seed55_48.png,seed9_52.png,seed55_23.png,seed9_25.png,seed9_16.png,seed32_20.png,seed20_23.png,seed55_47.png,seed9_60.png,seed14_48.png,seed32_14.png,seed23_23.png,seed16_60.png,seed25_25.png,seed20_61.png,seed48_52.png,seed60_16.png,seed23_25.png,seed20_20.png,seed60_55.png,seed32_55.png,seed52_33.png,seed48_33.png,seed23_32.png,seed55_61.png,seed23_9.png,seed47_33.png,seed1_47.png,seed20_9.png,seed23_48.png,seed1_14.png,seed20_14.png,seed52_16.png,seed61_33.png,seed16_14.png,seed61_61.png,seed9_33.png,seed60_61.png,seed48_48.png,seed55_25.png,seed20_16.png,seed32_48.png,seed16_16.png,seed32_16.png,seed55_60.png,seed55_14.png,seed14_23.png,seed33_32.png,seed14_1.png,seed52_1.png,seed16_9.png,seed1_55.png",
	"7,6,6,7,2,1,4,6,1,9,3,9,2,6,9,5,8,1,1,8,4,1,8,9,8"],

	["耳に髪がかかっていない人", "seed132_132.png,seed116_64.png,seed36_36.png,seed228_132.png,seed132_116.png,seed36_228.png,seed228_116.png,seed64_132.png,seed132_64.png,seed64_116.png,seed228_64.png,seed116_36.png,seed228_36.png,seed36_116.png,seed64_36.png,seed36_132.png,seed116_116.png,seed64_228.png,seed228_228.png,seed36_64.png,seed116_132.png,seed64_64.png,seed132_228.png,seed132_36.png,seed116_228.png",
	"seed258_84.png,seed327_276.png,seed276_327.png,seed145_2.png,seed395_58.png,seed84_198.png,seed21_58.png,seed137_198.png,seed395_451.png,seed451_276.png,seed327_198.png,seed84_145.png,seed198_258.png,seed84_451.png,seed198_395.png,seed2_258.png,seed497_497.png,seed84_84.png,seed451_382.png,seed21_367.png,seed21_137.png,seed276_382.png,seed21_198.png,seed382_198.png,seed145_198.png,seed21_451.png,seed395_367.png,seed84_137.png,seed367_2.png,seed276_198.png,seed198_84.png,seed382_145.png,seed451_84.png,seed258_58.png,seed367_382.png,seed84_395.png,seed258_198.png,seed367_497.png,seed145_382.png,seed258_367.png,seed367_395.png,seed451_395.png,seed84_58.png,seed497_84.png,seed497_367.png,seed395_258.png,seed327_2.png,seed382_137.png,seed497_451.png,seed276_145.png,seed451_58.png,seed58_497.png,seed145_276.png,seed21_276.png,seed327_84.png,seed327_21.png,seed327_258.png,seed382_2.png,seed327_367.png,seed497_145.png,seed451_137.png,seed58_2.png,seed497_382.png,seed276_84.png,seed2_395.png,seed84_327.png,seed451_145.png,seed327_145.png,seed367_198.png,seed145_58.png,seed145_451.png,seed276_367.png,seed276_451.png,seed451_258.png,seed382_58.png,seed276_276.png,seed198_276.png,seed395_84.png,seed258_2.png,seed2_382.png,seed327_395.png,seed84_276.png,seed367_145.png,seed145_137.png,seed145_395.png,seed258_327.png,seed137_451.png,seed84_258.png,seed137_58.png,seed2_21.png,seed258_137.png,seed58_258.png,seed137_145.png,seed497_2.png,seed497_137.png,seed276_21.png,seed451_327.png,seed395_395.png,seed451_451.png,seed137_21.png,seed21_21.png,seed382_382.png,seed497_198.png,seed276_137.png,seed198_145.png,seed198_198.png,seed327_327.png,seed137_137.png,seed21_258.png,seed2_58.png,seed58_84.png,seed145_21.png,seed198_327.png,seed137_84.png,seed258_21.png,seed58_58.png,seed367_84.png,seed58_145.png,seed367_367.png,seed145_145.png,seed137_258.png,seed21_84.png,seed58_367.png,seed367_258.png,seed2_276.png,seed58_382.png,seed327_497.png,seed198_497.png,seed58_137.png,seed137_2.png,seed58_327.png,seed497_276.png,seed84_367.png,seed395_21.png,seed258_276.png,seed145_84.png,seed84_2.png,seed395_137.png,seed258_497.png,seed137_327.png,seed497_258.png,seed84_382.png,seed276_58.png,seed382_84.png,seed21_497.png,seed137_497.png,seed2_497.png,seed258_145.png,seed21_145.png,seed58_276.png,seed367_58.png,seed21_382.png,seed497_395.png,seed137_276.png,seed58_395.png,seed84_21.png,seed145_258.png,seed258_395.png,seed451_367.png,seed2_2.png,seed258_382.png,seed395_145.png,seed198_451.png,seed367_327.png,seed367_451.png,seed327_137.png,seed382_21.png,seed145_497.png,seed327_382.png,seed145_367.png,seed137_382.png,seed2_327.png,seed58_198.png,seed198_21.png,seed84_497.png,seed395_276.png,seed198_2.png,seed327_58.png,seed382_258.png,seed2_137.png,seed395_2.png,seed198_58.png,seed21_395.png,seed2_84.png,seed497_327.png,seed382_497.png,seed2_367.png,seed395_382.png,seed451_198.png,seed2_198.png,seed276_497.png,seed58_21.png,seed367_276.png,seed2_145.png,seed21_2.png,seed395_497.png,seed497_21.png,seed382_327.png,seed327_451.png,seed276_395.png,seed21_327.png,seed382_276.png,seed451_497.png,seed382_395.png,seed382_367.png,seed198_382.png,seed276_258.png,seed2_451.png,seed276_2.png,seed258_258.png,seed497_58.png,seed145_327.png,seed367_21.png,seed137_395.png,seed395_198.png,seed451_2.png,seed137_367.png,seed198_367.png,seed395_327.png,seed367_137.png,seed58_451.png,seed451_21.png,seed382_451.png,seed198_137.png,seed258_451.png",
	"4,2,7,2,6,1,4,5,4,2,3,7,8,3,1,4,9,1,6,6,8,1,3,7,4"],

	["真顔の人", "seed12_49.png,seed1_11.png,seed104_49.png,seed1_12.png,seed49_104.png,seed11_1.png,seed11_104.png,seed104_104.png,seed11_49.png,seed1_1.png,seed49_11.png,seed104_12.png,seed104_1.png,seed12_12.png,seed12_11.png,seed49_12.png,seed12_104.png,seed11_12.png,seed1_49.png,seed11_11.png,seed1_104.png,seed49_49.png,seed104_11.png,seed49_1.png,seed12_1.png",
	"seed130_184.png,seed34_44.png,seed32_10.png,seed34_72.png,seed183_109.png,seed65_75.png,seed51_109.png,seed51_65.png,seed95_184.png,seed95_45.png,seed184_130.png,seed10_184.png,seed95_51.png,seed130_95.png,seed184_45.png,seed10_65.png,seed75_32.png,seed44_44.png,seed45_183.png,seed45_51.png,seed183_51.png,seed34_51.png,seed183_72.png,seed32_183.png,seed45_72.png,seed45_95.png,seed95_109.png,seed75_130.png,seed72_65.png,seed45_34.png,seed130_75.png,seed130_32.png,seed75_45.png,seed72_44.png,seed183_95.png,seed44_10.png,seed109_184.png,seed44_75.png,seed44_95.png,seed183_183.png,seed95_65.png,seed32_184.png,seed32_100.png,seed109_32.png,seed72_95.png,seed10_130.png,seed183_34.png,seed130_44.png,seed75_100.png,seed100_65.png,seed183_65.png,seed183_45.png,seed100_75.png,seed183_10.png,seed65_45.png,seed109_95.png,seed184_100.png,seed100_10.png,seed75_34.png,seed130_10.png,seed10_109.png,seed100_95.png,seed10_75.png,seed65_95.png,seed95_130.png,seed32_72.png,seed51_184.png,seed130_34.png,seed130_130.png,seed32_51.png,seed65_32.png,seed100_32.png,seed45_130.png,seed45_184.png,seed45_32.png,seed32_45.png,seed32_75.png,seed95_75.png,seed65_44.png,seed130_183.png,seed72_100.png,seed95_32.png,seed44_130.png,seed34_75.png,seed184_44.png,seed184_75.png,seed51_95.png,seed34_184.png,seed32_44.png,seed32_95.png,seed44_32.png,seed45_109.png,seed184_10.png,seed109_44.png,seed184_34.png,seed75_51.png,seed45_10.png,seed10_72.png,seed183_184.png,seed100_183.png,seed130_65.png,seed32_130.png,seed34_65.png,seed100_184.png,seed109_100.png,seed45_44.png,seed65_109.png,seed100_44.png,seed183_100.png,seed72_130.png,seed44_65.png,seed34_183.png,seed51_100.png,seed72_72.png,seed184_51.png,seed100_51.png,seed34_95.png,seed75_10.png,seed100_34.png,seed10_51.png,seed75_109.png,seed44_34.png,seed95_10.png,seed130_72.png,seed51_75.png,seed44_100.png,seed109_183.png,seed109_72.png,seed44_45.png,seed44_72.png,seed10_100.png,seed183_75.png,seed109_109.png,seed72_183.png,seed51_32.png,seed10_183.png,seed100_72.png,seed65_184.png,seed51_51.png,seed72_75.png,seed65_10.png,seed109_10.png,seed44_109.png,seed44_184.png,seed65_34.png,seed10_44.png,seed65_65.png,seed44_51.png,seed45_75.png,seed130_45.png,seed109_45.png,seed95_100.png,seed184_183.png,seed45_45.png,seed109_75.png,seed72_45.png,seed72_32.png,seed65_51.png,seed51_72.png,seed32_34.png,seed75_72.png,seed130_109.png,seed100_109.png,seed34_10.png,seed65_100.png,seed75_184.png,seed100_130.png,seed72_34.png,seed72_109.png,seed183_130.png,seed10_45.png,seed109_65.png,seed75_44.png,seed109_51.png,seed65_130.png,seed183_44.png,seed95_72.png,seed10_34.png,seed34_109.png,seed95_183.png,seed51_183.png,seed72_51.png,seed75_65.png,seed65_183.png,seed72_10.png,seed184_109.png,seed32_65.png,seed72_184.png,seed95_95.png,seed44_183.png,seed51_10.png,seed75_95.png,seed130_51.png,seed183_32.png,seed75_75.png,seed10_10.png,seed51_130.png,seed109_130.png,seed184_32.png,seed51_45.png,seed75_183.png,seed34_34.png,seed10_32.png,seed184_65.png,seed184_72.png,seed34_32.png,seed51_34.png,seed184_184.png,seed109_34.png,seed10_95.png,seed34_100.png,seed45_65.png,seed34_45.png,seed51_44.png,seed34_130.png,seed95_44.png,seed95_34.png,seed45_100.png,seed130_100.png,seed100_45.png,seed65_72.png,seed100_100.png,seed32_109.png,seed32_32.png,seed184_95.png",
	"5,1,5,4,3,1,7,7,4,8,8,4,5,1,8,9,4,9,2,7,4,3,7,7,5"],

	["幼い女の子", "seed433_113.png,seed308_113.png,seed308_207.png,seed113_207.png,seed433_207.png,seed207_308.png,seed308_163.png,seed207_207.png,seed113_308.png,seed163_433.png,seed163_207.png,seed113_113.png,seed163_113.png,seed113_433.png,seed433_433.png,seed433_308.png,seed308_433.png,seed207_113.png,seed433_163.png,seed163_308.png,seed207_433.png,seed308_308.png,seed163_163.png,seed113_163.png,seed207_163.png",
	"seed7_15.png,seed21_14.png,seed22_11.png,seed2_3.png,seed3_5.png,seed15_16.png,seed16_15.png,seed2_16.png,seed13_17.png,seed4_21.png,seed21_5.png,seed1_11.png,seed11_17.png,seed3_11.png,seed17_13.png,seed21_22.png,seed3_21.png,seed2_4.png,seed4_5.png,seed3_3.png,seed14_13.png,seed13_11.png,seed12_11.png,seed12_16.png,seed13_12.png,seed5_22.png,seed1_15.png,seed11_12.png,seed15_1.png,seed22_15.png,seed2_1.png,seed13_1.png,seed17_7.png,seed17_11.png,seed5_3.png,seed4_4.png,seed5_17.png,seed1_16.png,seed5_5.png,seed11_4.png,seed15_13.png,seed11_21.png,seed22_1.png,seed11_3.png,seed16_4.png,seed1_22.png,seed14_7.png,seed14_3.png,seed12_12.png,seed17_15.png,seed1_13.png,seed7_12.png,seed1_2.png,seed1_3.png,seed16_21.png,seed21_2.png,seed16_16.png,seed14_11.png,seed5_14.png,seed22_2.png,seed12_5.png,seed13_2.png,seed4_22.png,seed5_4.png,seed16_14.png,seed22_22.png,seed3_1.png,seed5_15.png,seed13_16.png,seed12_21.png,seed1_21.png,seed2_11.png,seed16_1.png,seed16_3.png,seed13_5.png,seed14_4.png,seed11_2.png,seed13_14.png,seed12_14.png,seed7_2.png,seed7_4.png,seed1_12.png,seed17_16.png,seed7_17.png,seed21_12.png,seed15_14.png,seed22_4.png,seed2_15.png,seed15_21.png,seed3_17.png,seed7_13.png,seed1_17.png,seed14_14.png,seed4_17.png,seed14_21.png,seed2_7.png,seed3_7.png,seed2_5.png,seed22_12.png,seed11_13.png,seed7_11.png,seed2_2.png,seed21_15.png,seed4_1.png,seed5_2.png,seed11_7.png,seed12_4.png,seed5_13.png,seed13_15.png,seed17_5.png,seed14_5.png,seed14_12.png,seed14_1.png,seed1_1.png,seed2_13.png,seed16_2.png,seed5_21.png,seed11_11.png,seed21_16.png,seed1_7.png,seed17_17.png,seed11_1.png,seed21_13.png,seed7_3.png,seed16_7.png,seed4_15.png,seed16_17.png,seed3_14.png,seed11_22.png,seed3_22.png,seed5_7.png,seed4_7.png,seed4_3.png,seed13_3.png,seed14_22.png,seed15_17.png,seed11_14.png,seed3_15.png,seed15_7.png,seed3_12.png,seed7_22.png,seed3_2.png,seed7_1.png,seed5_12.png,seed21_7.png,seed22_21.png,seed5_11.png,seed4_13.png,seed3_4.png,seed15_12.png,seed22_16.png,seed22_13.png,seed14_16.png,seed7_7.png,seed21_21.png,seed17_3.png,seed4_2.png,seed11_5.png,seed16_12.png,seed4_12.png,seed21_4.png,seed15_11.png,seed2_12.png,seed16_13.png,seed13_4.png,seed22_14.png,seed4_16.png,seed7_5.png,seed12_13.png,seed17_4.png,seed1_4.png,seed1_14.png,seed2_14.png,seed11_16.png,seed21_3.png,seed4_11.png,seed7_16.png,seed16_5.png,seed17_1.png,seed17_2.png,seed17_12.png,seed15_2.png,seed16_11.png,seed12_1.png,seed14_17.png,seed15_22.png,seed2_21.png,seed4_14.png,seed3_13.png,seed5_16.png,seed12_15.png,seed12_3.png,seed3_16.png,seed16_22.png,seed17_22.png,seed22_17.png,seed21_11.png,seed5_1.png,seed12_7.png,seed17_21.png,seed13_21.png,seed2_22.png,seed12_22.png,seed22_5.png,seed13_13.png,seed13_22.png,seed14_15.png,seed15_15.png,seed21_1.png,seed14_2.png,seed21_17.png,seed11_15.png,seed15_3.png,seed13_7.png,seed22_3.png,seed2_17.png,seed22_7.png,seed7_14.png,seed15_4.png,seed15_5.png,seed12_17.png,seed17_14.png,seed12_2.png,seed1_5.png,seed7_21.png",
	"3,5,5,3,4,4,9,8,2,4,4,7,1,7,5,8,1,1,7,9,6,4,5,9,8"]

	];

//練習用データ
let p_data = [
	["前髪で額が隠れている人", "seed299_188.png,seed188_299.png,seed226_299.png,seed276_276.png,seed276_188.png,seed188_276.png,seed226_226.png,seed276_299.png,seed345_188.png,seed226_276.png,seed345_299.png,seed299_345.png,seed188_345.png,seed345_226.png,seed299_226.png,seed276_226.png,seed299_299.png,seed226_345.png,seed299_276.png,seed188_188.png,seed345_276.png,seed276_345.png,seed226_188.png,seed345_345.png,seed188_226.png",
	"seed367_377.png,seed377_218.png,seed318_354.png,seed66_132.png,seed491_283.png,seed318_232.png,seed232_354.png,seed132_218.png,seed367_76.png,seed451_76.png,seed232_132.png,seed1_377.png,seed218_354.png,seed232_451.png,seed451_186.png,seed66_186.png,seed367_491.png,seed491_186.png,seed218_132.png,seed354_354.png,seed377_1.png,seed283_66.png,seed232_218.png,seed76_132.png,seed416_76.png,seed318_1.png,seed354_377.png,seed451_66.png,seed76_377.png,seed66_354.png,seed283_491.png,seed132_186.png,seed354_367.png,seed377_318.png,seed66_232.png,seed186_76.png,seed232_76.png,seed218_66.png,seed186_367.png,seed377_232.png,seed76_232.png,seed232_367.png,seed451_354.png,seed491_377.png,seed132_76.png,seed283_218.png,seed218_451.png,seed451_218.png,seed354_283.png,seed66_377.png,seed76_318.png,seed318_76.png,seed491_416.png,seed318_377.png,seed416_66.png,seed186_66.png,seed66_318.png,seed377_491.png,seed367_232.png,seed218_283.png,seed491_491.png,seed318_283.png,seed283_132.png,seed367_318.png,seed66_218.png,seed186_283.png,seed1_416.png,seed354_66.png,seed491_367.png,seed232_232.png,seed354_491.png,seed186_218.png,seed218_218.png,seed451_491.png,seed416_491.png,seed354_1.png,seed1_354.png,seed186_186.png,seed491_232.png,seed451_232.png,seed318_132.png,seed218_367.png,seed132_318.png,seed132_283.png,seed1_186.png,seed416_132.png,seed283_354.png,seed491_76.png,seed232_491.png,seed76_186.png,seed1_491.png,seed491_218.png,seed1_1.png,seed416_1.png,seed283_377.png,seed132_354.png,seed218_318.png,seed451_377.png,seed218_1.png,seed354_76.png,seed186_132.png,seed491_354.png,seed491_318.png,seed451_318.png,seed451_416.png,seed377_354.png,seed1_318.png,seed416_283.png,seed232_186.png,seed283_76.png,seed132_66.png,seed367_416.png,seed318_491.png,seed1_218.png,seed318_451.png,seed186_377.png,seed132_491.png,seed283_416.png,seed491_1.png,seed283_318.png,seed416_451.png,seed132_451.png,seed218_232.png,seed76_451.png,seed66_491.png,seed377_186.png,seed367_354.png,seed66_76.png,seed451_451.png,seed377_283.png,seed232_283.png,seed76_491.png,seed354_451.png,seed283_186.png,seed318_416.png,seed132_232.png,seed1_132.png,seed186_1.png,seed76_218.png,seed283_232.png,seed1_283.png,seed283_367.png,seed76_354.png,seed186_491.png,seed367_218.png,seed76_283.png,seed367_132.png,seed318_186.png,seed416_232.png,seed66_283.png,seed283_283.png,seed1_367.png,seed186_354.png,seed232_66.png,seed416_367.png,seed232_416.png,seed76_76.png,seed416_318.png,seed377_377.png,seed451_132.png,seed354_318.png,seed76_66.png,seed367_283.png,seed232_377.png,seed1_66.png,seed367_186.png,seed377_451.png,seed132_132.png,seed132_367.png,seed451_283.png,seed218_377.png,seed451_367.png,seed354_186.png,seed66_451.png,seed318_318.png,seed76_416.png,seed416_186.png,seed377_66.png,seed491_451.png,seed416_416.png,seed66_367.png,seed377_416.png,seed491_66.png,seed76_367.png,seed377_367.png,seed354_218.png,seed218_491.png,seed218_76.png,seed367_367.png,seed367_66.png,seed318_66.png,seed354_416.png,seed232_1.png,seed416_218.png,seed132_377.png,seed451_1.png,seed66_66.png,seed76_1.png,seed1_232.png,seed66_1.png,seed132_416.png,seed491_132.png,seed232_318.png,seed318_367.png,seed66_416.png,seed1_76.png,seed416_377.png,seed354_232.png,seed377_132.png,seed186_416.png,seed218_416.png,seed186_318.png,seed283_1.png,seed283_451.png,seed354_132.png,seed377_76.png,seed218_186.png,seed132_1.png,seed367_1.png,seed318_218.png,seed186_232.png,seed186_451.png,seed1_451.png,seed367_451.png,seed416_354.png",
	"8,3,3,6,5,2,1,8,2,8,7,4,4,6,1,8,4,1,8,2,1,6,4,8,4"],

	["髪がパーマの人", "seed107_3.png,seed107_7.png,seed3_3.png,seed7_54.png,seed62_54.png,seed3_62.png,seed107_54.png,seed54_62.png,seed7_62.png,seed7_7.png,seed62_107.png,seed3_107.png,seed62_3.png,seed7_107.png,seed54_7.png,seed107_62.png,seed54_54.png,seed107_107.png,seed54_3.png,seed3_54.png,seed54_107.png,seed7_3.png,seed62_62.png,seed62_7.png,seed3_7.png",
	"seed32_138.png,seed182_34.png,seed182_156.png,seed58_166.png,seed58_95.png,seed34_2.png,seed156_6.png,seed42_10.png,seed2_2.png,seed86_38.png,seed58_202.png,seed95_34.png,seed156_86.png,seed95_182.png,seed2_38.png,seed182_138.png,seed34_86.png,seed166_10.png,seed34_95.png,seed138_10.png,seed42_38.png,seed166_156.png,seed95_166.png,seed202_2.png,seed32_95.png,seed38_182.png,seed182_10.png,seed182_166.png,seed58_34.png,seed2_58.png,seed95_156.png,seed182_6.png,seed156_58.png,seed138_86.png,seed32_202.png,seed156_182.png,seed32_34.png,seed6_58.png,seed156_32.png,seed138_2.png,seed58_6.png,seed202_34.png,seed34_202.png,seed95_86.png,seed6_38.png,seed166_86.png,seed138_95.png,seed6_166.png,seed156_166.png,seed202_10.png,seed182_86.png,seed38_86.png,seed202_86.png,seed166_58.png,seed6_202.png,seed58_10.png,seed42_2.png,seed58_32.png,seed38_58.png,seed10_202.png,seed42_32.png,seed166_34.png,seed95_58.png,seed34_166.png,seed182_32.png,seed86_6.png,seed38_2.png,seed182_2.png,seed6_10.png,seed42_138.png,seed34_156.png,seed42_58.png,seed10_42.png,seed95_95.png,seed32_182.png,seed138_156.png,seed202_138.png,seed182_42.png,seed86_156.png,seed2_95.png,seed95_38.png,seed138_32.png,seed10_86.png,seed32_10.png,seed34_10.png,seed10_166.png,seed156_202.png,seed2_32.png,seed2_138.png,seed38_34.png,seed182_182.png,seed182_58.png,seed38_32.png,seed86_42.png,seed2_182.png,seed6_86.png,seed58_86.png,seed6_34.png,seed2_156.png,seed32_58.png,seed6_138.png,seed42_166.png,seed32_2.png,seed86_10.png,seed6_156.png,seed166_95.png,seed86_86.png,seed156_156.png,seed34_58.png,seed58_138.png,seed2_6.png,seed10_95.png,seed182_95.png,seed10_10.png,seed138_202.png,seed6_42.png,seed166_32.png,seed202_58.png,seed156_38.png,seed138_34.png,seed166_182.png,seed32_42.png,seed38_138.png,seed202_202.png,seed156_138.png,seed138_42.png,seed10_34.png,seed202_156.png,seed6_2.png,seed86_32.png,seed156_10.png,seed86_58.png,seed166_6.png,seed2_10.png,seed138_38.png,seed42_182.png,seed42_156.png,seed34_182.png,seed86_182.png,seed166_42.png,seed95_138.png,seed86_166.png,seed138_182.png,seed6_32.png,seed42_34.png,seed95_202.png,seed42_86.png,seed2_166.png,seed58_38.png,seed32_86.png,seed2_42.png,seed138_58.png,seed138_138.png,seed182_202.png,seed10_2.png,seed166_138.png,seed2_86.png,seed156_2.png,seed202_95.png,seed6_182.png,seed10_58.png,seed95_42.png,seed38_10.png,seed86_2.png,seed32_156.png,seed34_38.png,seed86_138.png,seed202_32.png,seed10_38.png,seed58_2.png,seed38_42.png,seed166_166.png,seed10_138.png,seed182_38.png,seed10_182.png,seed166_2.png,seed32_32.png,seed6_6.png,seed95_2.png,seed38_38.png,seed38_202.png,seed156_34.png,seed95_32.png,seed42_42.png,seed156_95.png,seed2_202.png,seed202_42.png,seed42_95.png,seed42_202.png,seed58_182.png,seed86_202.png,seed138_6.png,seed10_6.png,seed58_58.png,seed38_156.png,seed58_156.png,seed138_166.png,seed202_182.png,seed156_42.png,seed10_156.png,seed34_34.png,seed34_32.png,seed86_95.png,seed95_10.png,seed6_95.png,seed38_166.png,seed42_6.png,seed58_42.png,seed38_95.png,seed2_34.png,seed86_34.png,seed202_38.png,seed166_202.png,seed10_32.png,seed202_166.png,seed32_38.png,seed202_6.png,seed95_6.png,seed34_42.png,seed166_38.png,seed34_138.png,seed32_166.png,seed38_6.png,seed34_6.png,seed32_6.png",
	"6,7,7,1,7,4,5,5,2,5,5,9,8,2,8,2,5,3,5,8,2,8,4,9,3"]

	];

//認証制限時間
let auth_limit = [2074, 1358, 1161, 947, 3684, 828, 1805, 948, 3063, 1653, 2729, 1382];

//random順番
let rand = [0,1,2,3,4,5,6,7,8,9,10,11];

//randomの逆対応
let rev_rand = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

for(let i = rand.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = rand[i];
    rand[i] = rand[j];
    rand[j] = tmp;
}

for (let i=0; i<rand.length; i++) {
	rev_rand[rand[i]] = i;
}

for (let i=0; i<data.length; i++) {
	data[i][1] = data[i][1].split(",");
	data[i][2] = data[i][2].split(",");
	data[i][3] = data[i][3].split(",");
}
for (let i=0; i<p_data.length; i++) {
	p_data[i][1] = p_data[i][1].split(",");
	p_data[i][2] = p_data[i][2].split(",");
	p_data[i][3] = p_data[i][3].split(",");
}

let all_data = [p_data[0]];

for (let i=0; i<6; i++) {
	all_data.push(data[rand[i]]);
}

all_data.push(p_data[1]);

for (let i=0; i<6; i++) {
	all_data.push(data[rand[i+6]]);
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
			"「画像パスワード認証」の画面には9枚の顔画像が並んでいます。（左下図）",
			"9枚の画像の内、ある条件を満たす「画像パスワード」が1枚だけあります。",
			"画像パスワードには一瞬だけ赤い枠が表示されます。これは、操作している人が画像パスワードをクリックしたということです。（右下図）",
			"9枚の画像は4組続けて表示されます。どの組にも、同じ条件を満たす画像パスワードが1枚だけあります。",
			"クリックされた画像を手がかりに、画像パスワードの条件を推測してください。",
			"その後、あなたが推測した条件を使って画像パスワード認証を行ってください。",
			"同じように9枚の顔画像が表示されるので、条件を満たす画像パスワードをクリックしてください。",
			"条件がわからない場合、どれでもいいので1枚の画像をクリックしてください。",
			"ただし、条件が画面に表示されている場合もあります。",
			"その場合は、あなたが推測した条件ではなく、表示されている条件を満たす画像パスワードをクリックしてください。",
			"あなたが操作するときは、9枚の画像が8組表示されます。どの組にも、同じ条件を満たす画像パスワードが1枚だけあります。",
			"その後、あなたが推測した条件と推測の自信度を回答してください。",
			"「条件の推測」と「あなたの操作」を1セットとして、14セットの実験を行います。画像パスワードの条件はセットごとに異なります。",
			"説明を理解したら、画面上部の「次に進む」をクリックして実験を開始してください。"]

		for (let i = 0; i < sentences.length; i++) {
			context.fillText(sentences[i], 0, 24*i+24);
			}

			let img = new Image();
	        img.src = "./fig1.png";
	        
	        img.onload = function(){
	            context.drawImage(img, 200, 400, imgsize*3, imgsize*3);}

	        let img2 = new Image();
	        img2.src = "./fig2.png";
	        
	        img2.onload = function(){
	            context.drawImage(img2, imgsize*3+400, 400, imgsize*3, imgsize*3);}

		document.getElementById('next').style.visibility = 'visible';
 		screen++;
 	}

}

window.onbeforeunload = function(e) {
    e.returnValue = "ページを離れようとしています。よろしいですか？";
}