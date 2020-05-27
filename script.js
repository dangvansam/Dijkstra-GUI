let canvas, ctx

function init () {
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')
}

function createGraph(){
    var num_point = document.getElementById("num_point_input").value;
    var num_line = document.getElementById("num_line_input").value;
    console.log("create_graph:",num_point,num_line)
    //document.addEventListener('DOMContentLoaded', init)
    init()
    //console.log(canvas.width, canvas.height)
}