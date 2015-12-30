
// DOM Ready =================================
$(document).ready(function(){

    // Populate the user table on initial page load
    populateData();

});

// Functions ==================================

// Fill screen with data
function populateData(){
    
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
var vis, g, w, h, margin;
socket.on("connect", function(){
    console.log("Connected!");

    w = 800,
    h = 200,
    margin = 40;
    
    vis = d3.select("#chart")
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h);
 
    g = vis.append("svg:g")
        .attr("transform", "translate(0, 200)");

    g.append("svg:path");

    var now = new Date();
    x = d3.time.scale()
        .range([0 + margin, w - margin])
        .domain([now - 10*1000, now]),
    xAxis = d3.svg.axis().scale(x).orient("bottom"),
    
    y = d3.scale.linear()
        .domain([0, 1.5])
        .range([h- margin, 0+ margin]),
    yAxis = d3.svg.axis().scale(y).orient("left");

    vis.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + (h - margin) + ")")
        .call(xAxis);
    
    vis.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin +", 0)")
        .call(yAxis);


});


socket.on("load", function(data){
    console.log("load data", data);
    $('#currentLoadAvg').text(data.loadAvg);
    $('#uptime').text(data.uptime);

});

socket.on("warning", function(data){
    console.log("WARNING", data);
    $('#warning').prepend($('<p>').text(data.warning));
});

socket.on("recovered", function(data){
    console.log("recovered", data);
    $('#warning').prepend($('<p>').text(data.msg));
});

var points = [];

socket.on("loadHistory", function(data){

    var endTime = Date.now();
    var startTime = endTime - 1000*10*data.series.length;
    var dt = 10000;
    var n = data.series.length;
    var ymax = d3.max(data.series);
    y = d3.scale.linear().domain([0, ymax]).range([h - margin, 0 + margin]),
    x = d3.time.scale()
        .range([0 + margin, w - margin])
        .domain([startTime, endTime]);

    vis.selectAll("g.x.axis")
        .call(d3.svg.axis().scale(x).orient("bottom"));

    vis.selectAll("g.y.axis")
        .call(d3.svg.axis().scale(y).orient("left")); 
    var line = d3.svg.line()
        .x(function(d,i) { return x(endTime - (n-i)*dt); })
        .y(function(d) { return -h + y(d); });

    points.push(data.newPt);     

    var path = g.selectAll("path");
     
    path.attr('d', line(points))
        .attr("transform", null)
    if (points.length > 600)
    {
        path.transition()
            .attr("transform","translate(" + x(-1) +")");
        points.shift();
        axis.call(x.axis);
    }
    

});
