
var width  = 450,
    height = 500;

var svg = d3.select("#map").append("svg")
          .attr("width", width)
          .attr("height",height)
      	  .style("background-color","white");  

var svg_ = d3.select("#county_btn_div").append("svg")
           .attr("width", 100)
           .attr("height",500)
           .style("background-color","transparent"); 

var preview = d3.select("#preview").append("svg")
           .attr("width", 400)
           .attr("height",305)
           .style("background-color","transparent"); 

var projection = d3.geo.mercator()
		           .scale(2800)
		           .center([38,0.8])
		           .translate([width / 2, height / 2.2]);

var path    = d3.geo.path()
		            .projection(projection)
		            .pointRadius(4);

var projection_ = d3.geo.mercator()
                   .scale(1700)
                   .center([38,0.5])
                   .translate([400 / 2, 305 / 2]);

var path_    = d3.geo.path()
                  .projection(projection_);                

var json_data = '';

var selected_counties = new Set();

let json_headers= '{\"type\": \"FeatureCollection\",\"features\":[';

let node=document.getElementById('county_name');

let json_trailer= ']}';

const file_url = 'json/ke.geojson';

var json_file = '';

drawMap();

function drawMap(){

	d3.json(file_url,function(data){

	   json_data = data.features;

    svg.selectAll("path")
		   .data(data.features)
		   .enter()
		   .append("path")
		   .attr("d", path)
       .attr('class',function(d){return d.properties.COUNTY})
       .attr('id',function(d){return JSON.stringify(d.properties);})
		   .attr("stroke","white")
		   .attr("fill","grey")
       .attr('opacity',0.3)
		   .on('click',onCountyClicked)
       .on('mouseover',onHover)
       .on('mouseout',onMouseOut);

       previewJSON(data);

       createButtons();
     

	});
}
function createButtons(){
  
    let county_ = [] ;

    json_data.forEach(function(d){
      county_.push(d.properties.COUNTY);
    });

    let t = county_.sort(sortCounties);

    let div_ = document.getElementById('county_btn_div');

    countyLabel(t);
    

}
function sortCounties(a,b){
   
   if(a > b){
     return 1;
   }else if(a < b){
     return -1;
   }
     return 0;

}
function onCountyClicked(evt){

	var temp = JSON.parse(this.id).COUNTY;

        d3.select('.'+temp)
            .style('fill','orange')
            .attr('opacity',1);

       preview.select('.'+temp)
              .style('fill','orange')
              .style('stroke','grey')
              .style('stroke-width',0.5);     


     d3.selectAll("#"+temp).attr('text-decoration','underline').attr('font-weight','bolder');  

     json_data.forEach(function(d){
             
         if(d.properties.COUNTY === temp){

          	selected_counties.add(d);
         }

    });
     
}
function onHover(evt){

  let name=JSON.parse(this.id).COUNTY;

      node.textContent = name.replace('_',' ');

}
function countyLabel(rry){

    svg_.selectAll(".txt")
        .data(rry)
        .enter().append("text")
        .attr("class", "txt")
        .attr("x",5)
        .attr('y',function(d,i){
          return (i * 12) + 20;
        })
        .attr('id',function(d){return d})
        .attr('font-size',10)
        .text(function(d){return d.replace('_',' ');});
      
}
function onMouseOut(evt){
  //node.textContent = '';
}
function saveJson(){

   var tmp = '';
 
   selected_counties.forEach(function(d){

      if(selected_counties.size === 1){
         
   	     tmp += JSON.stringify(d);
       }else{
         tmp += JSON.stringify(d)+",";
       }

   });
   
   json_headers += tmp;

   json_file = json_headers + json_trailer;

   let tmp_=json_file.substring(0,json_file.lastIndexOf(',')) + json_trailer;

   downloadGeoJson(tmp_);
}
function previewJSON(data){

      preview.selectAll("path")
         .data(data.features)
         .enter()
         .append("path")
         .attr("d", path_)
         .attr('class',function(d){return d.properties.COUNTY})
         .attr("stroke","transparent")
         .attr("fill","transparent");


}	
function downloadGeoJson(json_){

    var pom = document.createElement('a');
    var blob = new Blob([json_],{type: 'text/json;charset=utf-8;'});
    var url = URL.createObjectURL(blob);
    pom.href = url;
    pom.setAttribute('download', 'admin.geojson');
    pom.click();

}
