// put here utility functions for screen display?
var w=960, h=500,
svg=d3.select('#chart')
.append("svg")
.attr("width", w)
.attr("height", h);

var text=svg
.append("text")
.text("hello world")
.attr("y", 50);

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
