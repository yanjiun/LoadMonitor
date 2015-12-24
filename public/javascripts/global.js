// put here utility functions for screen display?
//var w=960, h=500,
//svg=d3.select('#chart')
//.append("svg")
//.attr("width", w)
//.attr("height", h);

//var text=svg
//.append("text")
//.text("hello world")
//.attr("y", 50);

// don't use a global in the long run 
var candidateListData = [];

// DOM Ready =================================
$(document).ready(function(){

    // Populate the user table on initial page load
    populateData();

});

// Functions ==================================

// Fill screen with data
function populateData(){
    //TODO: fill in logic for what displays where
    
    $.getJSON('/monitor/monitor', function(data){
        $.each(data, function(){
            showLoadInfo(data);
        });
    });
};

function showLoadInfo(data){

    var uptime = data.uptime;
    var loadAvg = data.loadAvg;
    var hostname = data.hostname;
    $('#uptime').text(uptime);
    $('#loadAvg').text(loadAvg);  
    $('#hostname').text(hostname); 
    $('#currentLoadAvg').text(loadAvg);

};

// Functions related to socket.io 

var socket = io.connect('http://localhost:3000');
socket.on("connect", function(){
    console.log("Connected!");
});

socket.on("test", function(data){
    console.log("test data: ", data);
});

socket.on("load", function(data){
    console.log("load data", data);
    // connect this part to the DOM
    $('#currentLoadAvg').text(data.loadAvg);

});

socket.on("warning", function(data){
    // also connect this part to the DOM
    console.log("WARNING", data);
    $('#warning').prepend($('<p>').text(data.warning));
});

// D3??

var data = [3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 7],
w = 400,
h = 200,
margin = 20,
y = d3.scale.linear().domain([0, d3.max(data)]).range([0 + margin, h - margin]),
x = d3.scale.linear().domain([0, data.length]).range([0 + margin, w - margin]);

var vis = d3.select("#chart")
    .append("svg:svg")
    .attr("width", w)
    .attr("height", h);
 
var g = vis.append("svg:g")
    .attr("transform", "translate(0, 200)");

var line = d3.svg.line()
    .x(function(d,i) { return x(i); })
    .y(function(d) { return -1 * y(d); });

g.append("svg:path").attr("d", line(data));

g.append("svg:line")
    .attr("x1", x(0))
    .attr("y1", -1 * y(0))
    .attr("x2", x(w))
    .attr("y2", -1 * y(0));
 
g.append("svg:line")
    .attr("x1", x(0))
    .attr("y1", -1 * y(0))
    .attr("x2", x(0))
    .attr("y2", -1 * y(d3.max(data)));

g.selectAll(".xLabel")
    .data(x.ticks(5))
    .enter().append("svg:text")
    .attr("class", "xLabel")
    .text(String)
    .attr("x", function(d) { return x(d) })
    .attr("y", 0)
    .attr("text-anchor", "middle");
 
g.selectAll(".yLabel")
    .data(y.ticks(4))
    .enter().append("svg:text")
    .attr("class", "yLabel")
    .text(String)
    .attr("x", 0)
    .attr("y", function(d) { return -1 * y(d) })
    .attr("text-anchor", "right")
    .attr("dy", 4);

g.selectAll(".xTicks")
    .data(x.ticks(5))
    .enter().append("svg:line")
    .attr("class", "xTicks")
    .attr("x1", function(d) { return x(d); })
    .attr("y1", -1 * y(0))
    .attr("x2", function(d) { return x(d); })
    .attr("y2", -1 * y(-0.3));
 
g.selectAll(".yTicks")
    .data(y.ticks(4))
    .enter().append("svg:line")
    .attr("class", "yTicks")
    .attr("y1", function(d) { return -1 * y(d); })
    .attr("x1", x(-0.3))
    .attr("y2", function(d) { return -1 * y(d); })
    .attr("x2", x(0));
