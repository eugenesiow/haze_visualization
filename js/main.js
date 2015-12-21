function google_init(){
	var pos = new google.maps.LatLng(1.3,103.75);
	var map;
	var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var labelIndex = 0;
	function initialize(){
		var mapProp = {
		center:pos,
		zoom:5,
		mapTypeId:google.maps.MapTypeId.ROADMAP
		};
		map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
		 
		google.maps.event.addListener(map, 'click', function(event) {
			addMarker(event.latLng, map);
		});
		 
		 //addMarker(pos, map);
		//var bangalore = new google.maps.LatLng(1.3 - 5,103.75 - 5);

		 

		  // Add a marker at the center of the map.
		  //addMarker(bangalore, map);
	}

	google.maps.event.addDomListener(window, 'load', initialize);

	function addMarker(location, map) {
	  // Add the marker at the clicked location, and add the next-available label
	  // from the array of alphabetical characters.
	  var marker = new google.maps.Marker({
		position: location,
		label: labels[labelIndex++ % labels.length],
		map: map
	  });
	}
}

var fire_chart;

function deal_fire_init(){
	fire_chart = echarts.init(document.getElementById('map-top'));         

	var markPoint = {
					symbol: 'emptyCircle',
					symbolSize: function (value){
						//console.log(value);
						return value * value * value * .00000004;
					},
					effect : {
						show: true,
						shadowBlur : 0
					},
					itemStyle: {
						normal: {
							borderWidth: 5,
							label: {
								show: false
							}
						},
						emphasis: {
							borderColor: '#1e90ff',
							borderWidth: 5,
							label: {
								show: false
							}
						}
					},
					data : []
	};

	option = {
		color: ['gold','aqua','lime'],
		tooltip : {
			trigger: 'item',
			formatter: function (v) {
				return v[1].replace(':', ' > ');
			}
		},
		toolbox: {
			show : true,
			orient : 'vertical',
			x: 'right',
			y: 'center',
			feature : {
				mark : {show: true},
				dataView : {show: true, readOnly: false},
				restore : {show: true},
				saveAsImage : {show: true}
			}
		},
		dataRange: {
			min : 300,
			max : 500,
			y: '60%',
			calculable : true,
			color: ['red', 'yellow', 'orange', 'blue']
		},
		xAxis : [
			{
				type : 'value',
				show : false
			}
		],
		yAxis : [
			{
				type : 'value',
				show : false
			}
		],
		grid : {borderWidth:0},
		series : [
			{
				name: 'scatter0',
				type: 'scatter',
				data: [[0, 0], [5, 5]],
				markPoint : markPoint
			},
			{
				name: 'scatter1',
				type: 'scatter',
				data: [[0, 0], [5, 5]],
				markPoint : markPoint
			},
			{
				name: 'scatter2',
				type: 'scatter',
				data: [[0, 0], [5, 5]],
				markPoint: markPoint
			},
			{
				name: 'scatter3',
				type: 'scatter',
				data: [[0, 0], [5, 5]],
				markPoint: markPoint
			}
		]
	};
	fire_chart.setOption(option); 
}

var lastIndex = 0;
function deal_fire_tic(){
	if(lastIndex >= 1 && lastIndex - 1 < fire.length){
		var n = fire[lastIndex - 1].length;
		for(var i = 0; i < n; i++)
			fire_chart.delMarkPoint(0, i.toString());
	}
	//var showArr = [];
	if(lastIndex < fire.length)
		fire_chart.addMarkPoint(
			0,        // 系列索引
			{
				itemStyle: {
					normal: {
						borderWidth: 5,
						label: {
							show: false
						}
					},
					emphasis: {
						borderColor: '#1e90ff',
						borderWidth: 5,
						label: {
							show: false
						}
					}
				},
				data : fire[lastIndex]
			}
		);
	lastIndex += 1;
}

var lines_tic = [];

function line_init(sery, elem, tim, dat, buff, step, name){
	// 基于准备好的dom，初始化echarts图表
	var myChart = echarts.init(document.getElementById(elem));
	var empty = [], empty_k = [];
	
	for(var i = 0; i < buff * step * 2; i++)
		empty.push('-');
	for(var i = 0; i < buff * step * 2; i++)
		empty_k.push([0, 0, 0, 0]);

	var option = {
		title : {
			text: name,
			x : 'center'
		},
		calculable : true,
		xAxis : [
			{
				type : 'category',
				boundaryGap : false,
				data : empty,
				splitNumber: 0
			}
		],
		yAxis : [
			{
				type : 'value',
				axisLabel : {
					formatter: '{value}'
				},
				max : Math.max.apply(null, dat.join(',').split(',')).toFixed(2),
				min : Math.min(Math.min.apply(null, dat.join(',').split(',')), 0).toFixed(2)
			}
		],
		series : [
			{
				name: name,
				type: sery,
				data: sery == 'k' ? empty_k : empty
			}
		]
	};
	
	// 为echarts对象加载数据
	myChart.setOption(option);
	
	var cnt = 0;
	
	function putMark(centerCnt){
		//console.log(name + ' = ' + centerCnt);
		var val;
		if(sery == 'k')
			val = Math.max.apply(null, dat[centerCnt]);
		else
			val = dat[centerCnt];
		val = val.toFixed(2);
		myChart.addMarkPoint(
			0, {
				data : [{name : 'today', value : val, xAxis: tim[centerCnt], yAxis: val, symbolSize:18}]
			}
		);
	}
	
	function add_data(){
		buf = [];
		for(var i = 0; i < step; i++){
			if(cnt < dat.length)
				buf.push([0,
					dat[cnt],
					false,
					false,
					tim[cnt]
				]);
			else
				buf.push([0,
					[0, 0, 0, 0],
					false,
					false,
					'-'
				]);
			cnt += 1;
		}
		//console.log();
		myChart.addData(buf);
		if(cnt - step * (buff + 1) >= 0){
			try{
				if(cnt - step * (buff + 1) > 0)
					myChart.delMarkPoint(0, 'today');
				putMark(cnt - step * buff - 1);
			}catch(e){
				
			}
		}
	}
	
	for(var i = 0; i < buff; i++)
		add_data();
	lines_tic.push(add_data);
}


function lines_init(){
	line_init('k', 'div-psi', dates, psi, 8, 1, 'PSI in SG');
	line_init('k', 'div-pm', dates, pm, 8, 1, 'PM 2.5 in SG');
	line_init('line', 'div-senti', date_times, senti, 5, 12, 'Senti Score');
	line_init('line', 'div-fire', date_times, tamount, 5, 12, 'Tweeter Amount');
}

$(document).ready(function(){
	google_init();
	deal_fire_init();
	lines_init();
	
	var pauseFlag = false;
	
	$('.pause').click(function(){
		pauseFlag = !(pauseFlag);
	});
	
	var cnt = 0;
	setInterval(function(){
		if(pauseFlag)
			return;
		deal_fire_tic();
		for(var i = 0; i < lines_tic.length; i++)
			lines_tic[i]();
		if(cnt < pos_cont.length)
			$('#div-pos').text(pos_cont[cnt]);
		if(cnt < neg_cont.length)
			$('#div-neg').text(neg_cont[cnt]);
		if(cnt < fire.length)
			$('.div-fpa').html('<h3>Fire Point Amount: ' + fire[cnt].length + '</h3>');
		if(cnt < dates.length)
			$('.div-date').html('<h3>Date: ' + dates[cnt] + '</h3>');
		cnt += 1;
	}, 2000);
});