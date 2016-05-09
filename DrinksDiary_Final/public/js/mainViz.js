//window.addEventListener('onload',init());
document.addEventListener("DOMContentLoaded", init, true);

function init(){
	$.ajax({
	    url : '/api/get',
	    dataType : 'json',
	    type: 'GET',
	    failure: function(err){
	    	return console.log ("Could not get the data");
	    },
	    success: function(data) {
//	    	console.log('get data from server: ', data);
	    	setTotalData(data);
	    	setChartDefaults();	    	
	    	buildDoughnutChart(data);
	    	buildHeatMap(data);
	    	
	    	//map
	    	// positionMap(); // let's position the map
      //   	var location = getLocationData(data);
      //       buildMap(location, {map: document.getElementById('map-canvas')});
//	        buildLegend(data);
	    }
	});
}

// function getLocationData(value){
// 	var map = [];
	
// 	value.forEach(function(data){
// 		if(data.location != null){
// 			map.push(data.location);
// 		}
// 	});
// 	return map;
// }
	
// /////////////////map/////////////////
// function buildMap (location, elements) {

//   // Start of Map based stuff
//   var getDefaultMapViewSettings = function(location) {
//     return {
//       center: {lat: 40.727237, lng: -73.988156},
// //      center: location,
//       zoom: 10,
//       disableDefaultUI: true,
//       zoomControl: true,
//       zoomControlOptions: {
//         style: google.maps.ZoomControlStyle.SMALL
//       }
//     };
//   };

//   var buildCircles = function(location, map) {
//     return location.map(function(loc) {
//       var options = {
//         // strokeColor: '#572d88',
//         strokeColor: '#2d2d2d',
//         strokeOpacity: 0.7,
//         strokeWeight: 2,
//         fillColor: '#fed136',
//         fillOpacity: 0.7,
//         map: map,
//         center: new google.maps.LatLng(loc.geo[0], loc.geo[1]),
//         radius: 20
//       };
//       return new google.maps.Circle(options);
//     });
//   };
  
//   var center = new google.maps.LatLng(location[0].geo[1], location[0].geo[0]);

//   var map = new google.maps.Map(elements.map, getDefaultMapViewSettings(center));

//   var circles = buildCircles(location, map);

//   circles.forEach(function(circle) {
//     var p = Math.pow(2, (21 - map.getZoom()));
//     circle.setRadius(p * 1128.497220 * 0.001);    
//   });


//   google.maps.event.addListener(map, 'zoom_changed', function() {
//     circles.forEach(function(circle) {
//       var p = Math.pow(2, (21 - map.getZoom()));
//       circle.setRadius(p * 1128.497220 * 0.001);
//     });
//   });
// }

// function positionMap(){
//   var width = $( window ).width()/1.5;
//   var height = $( window ).height()/1.5;
// //  var width = $("#map-canvas").width();
// //  var height = $("#map-canvas").height();

//   $( '#map-canvas' ).width(width);
//   $( '#map-canvas' ).height(height);
// }

// function positionLegend(){
//   var width = ($( window ).width())/5;
//   var height = $( window ).height();

//   $( '#map-legend' ).width(width);
//   $( '#map-legend' ).height(height);  
// }

// //adjust map on window resize
// $( window ).resize(function() {
//   positionMap();
//   positionLegend();
// });

// //End of Map

// function buildLegend (data){
//   positionLegend();
//   if(data.location == null) return;
//   data.location.forEach(function(e){
// 	if(e.add != null){
// 	    $( '#map-legend' ).append('<div class="holder">'+
// 	        '<ul>'+
// 	          '<li class="purple">' + e.location.add+'</li>'+
// 	        '</ul>'+
// 	      '</div>'
// 	    );
// 	}
//   });
// }

// //////////////////////////////////

function setTotalData(data){
	var totalDollarsSpent = 0;
	var totalTimeSpent = 0;
	var drink = 0;

	var beerName = [];
	var beerWholeNum = 0;

//	console.log('data in setTotalData:', data)
	
	data.forEach(function(value){
//		console.log('values!: ', value)
		totalDollarsSpent += value.dollarspent;
		totalTimeSpent += value.timespent;
		if(value.timespent != 0){
			drink += 1;
		}
		
		for(var i =0; i<value.brandname.length;i++){
			beerName.push(value.brandname[i]);
			beerWholeNum++;
		}
	
	});

	// console.log(beerName);

	var m = [];
	var m1 = [];
	var N = [];

	m = beerName;
	NN=0;

    for (var i=1;i<=beerWholeNum; i++)	// Numwords is total number of words
    {	if (!(m[i]==""))	// only looks at m1 words that have not been processed before (not empty)
    	{	NN=NN+1;			//unique word stored in m1 array
    		m1[NN]=m[i];
    		N[NN]=1;			// initialize counter for word
    		for (var j=i+1;j<=beerWholeNum+1;j++)	//counts and makes m1 elements with unique word empty.
    		{	if (m1[NN]==m[j])
    			{	N[NN]=N[NN]+1;
    				m[j]="";
    			}
    		}	
    	}	
    }

	//////////////////sortFreq////
    for (var i=1;i<=NN-1;i++){
    	for (var j=i+1;j<=NN;j++){
    		if (N[i]<N[j]){
    			temp=m1[i];
				m1[i]=m1[j];
				m1[j]=temp;
				temp=N[i];
				N[i]=N[j];
				N[j]=temp;
			}
		}
	}
	//////////////////////////////

    m1.splice(0,1);
    N.splice(0,1);

//    console.log(m1[0]);
//    console.log(N[0]);
	
	$("#total_dollars_spent").text("$"+totalDollarsSpent);	
	$("#total_time_spent").text(totalTimeSpent+"h");
	$("#avg_dollars_spent").text("$"+(totalDollarsSpent/data.length).toFixed(1));
	$("#avg_time_spent").text((totalTimeSpent/drink).toFixed(1)+"h");
	$("#most_popular").text(m1[0]);
}

function buildHeatMap(data){
	var margin = { top: 30, right: 0, bottom: 30, left: 50 },
	width = 800 - margin.left - margin.right,
	height = 120 - margin.top - margin.bottom,
	gridSize = Math.floor(width / 31),
	legendElementWidth = gridSize*3,
	buckets = 5,
	// colors = ["#d38bc9","#a876a8","#7f6187","#554d66","#404c56"],
	colors = ["#bde4ed","#6bceee","#fed136","#f26f20","#e01d25"],
	month = ["Apr.", "Mar.", "Feb."],
	days = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
	
	
	var svg = d3.select("#chart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var dayLabels = svg.selectAll(".dayLabel")
		.data(month)
		.enter().append("text")
		.text(function (d) { return d; })
		.attr("x", 0)
		.attr("y", function (d, i) { return i * gridSize; })
		.style("fill", "#606567")
		.style("text-anchor", "end")
		.attr("transform", "translate(-10," + gridSize / 1.5 + ")");
	
	var timeLabels = svg.selectAll(".timeLabel")
		.data(days)
		.enter().append("text")
		.text(function(d) { return d; })
		.attr("x", function(d, i) { return i * gridSize; })
		.attr("y", 0)
		.style("fill", "#606567")
		.style("text-anchor", "middle")
		.attr("transform", "translate(" + gridSize / 2 + ", -6)");
		
	var heatmapChart = function(data) {
		var month = 0;		
		
		var cards = svg.selectAll(".timespent").data(data);
			cards.enter().append("rect")
			.attr("x", function(d) {
				//return (d.day-1) * gridSize;})
				return (getDay(d.drinkDate)-1) * gridSize;})
			.attr("y", function(d) {
				if(getMonth(d.drinkDate)-1 == 4){
					month = 0;
				}else if(getMonth(d.drinkDate)-1 == 3){
					month = 1;
				}else if(getMonth(d.drinkDate)-1 == 2){
					month = 2;
				}
				return month * gridSize; })
			.attr("class", "timespent bordered")
			.attr("width", gridSize)
			.attr("height", gridSize)
			.style("fill", colors[0])
	
			.on("mouseover", function(d){
				d3.select(this).classed("cell-hover",true);
//				d3.selectAll(".timeLabel").classed("text-highlight",function(r,ri){ return ri==(d.timespent);});
//				d3.selectAll(".dayLabel").classed("text-highlight",function(c,ci){ return ci==(d.timespent);});
	 
				//Update the tooltip position and value
				d3.select("#tooltip")
					.style("left", (d3.event.pageX+10) + "px")
					.style("top", (d3.event.pageY-10) + "px")
					.select("#value");
							    				
				var month ="";
				var drinkInfo ="";
				var people = "";
				var amount = "";
				var where = "";
				
				// d.date.forEach(function(data){
				// 	date += data+"<br/>";
				// });
				
				month = changeMonth(getMonth(d.drinkDate));
				console.log("# : "+d.brandname);
//				d.brandname.forEach(function(data){
//					drinkInfo += data+"<br/>";
//				});				
//				d.amount.forEach(function(data){
//					amount += data+"<br/>";
//				});
//				d.who.forEach(function(data){
//					people += data+"<br/>";
//				});
//				d.where.forEach(function(data){
//					where += data+"<br/>";
//				});
				
				$("#date").text(month+" "+getDay(d.drinkDate)+", "+getYear(d.drinkDate));
				$("#time_spent").text(d.timespent+"h");
				$("#dollars_spent").text("$"+d.dollarspent);
				$("#drinks_info").html(d.brandname);
				$("#d_people").html("");
				$("#d_amount").html(d.amount);
				$("#d_where").html("");
				$("#occasion").text(d.occasion);
			});//onmouseover 
		
		 
		cards.transition().duration(1000)
			.style("fill", function(d) {
				return colors[changeColors(d.inebriation)] }); 
//				return colors[d.inebriation]; });
//		cards.select("title").text(function(d) { return d.timespent; });
	
		cards.exit().remove();
	};
	
	heatmapChart(data);
}

function changeColors(color){
	var temp = 0;
	if(color != null) temp = color; 		
	return temp;
	
}

function changeMonth(num){
	var month = ["January", "February", "March", "April", "May", "June",
	             "July", "August", "September", "October", "November", "December"];
	return month[num-1];	
}


// set default options for ALL charts
function setChartDefaults(){
	// make it responsive
	Chart.defaults.global.responsive = true;
	// set the default line
	Chart.defaults.global.scaleLineColor = '#fff';
	// set the font family
	Chart.defaults.global.scaleFontFamily = "'Quattrocento Sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
	// set the font color
	Chart.defaults.global.scaleFontColor = "#fff";
}

function getYear(date){
	var temp;
	if(date != null){
		temp = date.substring(0, 4);
	}else{
		temp = 1;
	}
	return temp;	
}

function getMonth(date){
	var temp;
	if(date != null){
		temp = date.substring(5, 7);
	}else{
		temp = 1;
	}
	return temp;
}

function getDay(date){
	var temp;
	if(date != null){
		temp = date.substring(8, 10);
	}else{
		temp = 1;
	}
	return temp;
}


// see http://www.chartjs.org/docs/#doughnut-pie-chart
function buildDoughnutChart(data){
	var inebriation = ['','','','','',''];
	
	for(var i=0;i<data.length;i++){
		if(data[i].inebriation=='0') inebriation[0]++;
		else if (data[i].inebriation=='1') inebriation[1]++;
		else if (data[i].inebriation=='2') inebriation[2]++;
		else if (data[i].inebriation=='3') inebriation[3]++;
		else if (data[i].inebriation=='4') inebriation[4]++;
	}
	
	// data is an array of objects
	// each holds the value and color of a segment of the chart
	var data = [
	    {
	        value: inebriation[0],
	        color:"#bde4ed",
	        label: "None"
	    },
	    {
	        value: inebriation[1],
	        color: "#6bceee",
	        label: "Good"
	    },
	    {
	        value: inebriation[2],
	        color: "#fed136",
	        label: "Tipsy"
	    },
	    {
	        value: inebriation[3],
	        color: "#f26f20",
	        label: "Bad"
	    },
	    {
	        value: inebriation[4],
	        color: "#e01d25",
	        label: "Binge"
	    }	    
	];

	// create chart options (this is optional)
	// see list of options:
	// http://www.chartjs.org/docs/#doughnut-pie-chart-chart-options
	var options = {
		 segmentShowStroke : false,
		 legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"		 
	}; 

	// first, get the context of the canvas where we're drawing the chart
	var ctx = document.getElementById("doughnutChart").getContext("2d");
	
	// now, create the donought chart, passing in:
	// 1. the data (required)
	// 2. chart options (optional)
	var myDoughnutChart = new Chart(ctx).Doughnut(data, options);	
	// create the legend
//	var chartLegend = myDoughnutChart.generateLegend();
	// append it above the chart
//	$('#doughnutChartLegend').append(chartLegend);
}
