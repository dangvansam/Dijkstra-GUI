let canvas, ctx

function init () {
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')
}

class Point {
    constructor(x,y){
        this.x=x
        this.y=y
    }
}

class Line {
    constructor(startx, starty, endx, endy){
        this.startx = startx
        this.starty = starty
        this.endx = endx
        this.endy = endy
    }

    len(){
        return parseInt(Math.sqrt(Math.pow((this.startx-this.endx),2) + Math.pow((this.starty-this.endy),2)))
    }

    getMidPoint(){
        var mid_p = new Point(parseInt(Math.min(this.startx, this.endx)+Math.abs(this.startx-this.endx)/2),parseInt(Math.min(this.starty, this.endy)+Math.abs(this.starty-this.endy)/2))
        //console.log(mid_p)
        return mid_p
    }
}


function drawGraph(){

    init()

    var num_point = document.getElementById("num_point_input").value;
    var num_line = document.getElementById("num_line_input").value;
    num_point = parseInt(num_point)
    num_line = parseInt(num_line)
    
    console.log("create_graph:",num_point,num_line)
    //document.addEventListener('DOMContentLoaded', init)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    window_x = 100
    window_y = 100
    window_w = canvas.width - 100
    window_h = canvas.height - 100

    list_point  = []
    list_line = []

    for (var i=0; i<num_point; i++){
        tmp_x = getRndInteger(window_x, window_w)
        tmp_y = getRndInteger(window_y, window_h)
        tmp_p = new Point(tmp_x, tmp_y)
 
        //drawPoint(tmp_p, i)
        list_point.push(tmp_p)
        //console.log("list_point:",list_point)
        
        if (i != 0){
            for (var j=0; j<list_point.length; j++){
                p = list_point[j]
                tmp_line = new Line(p.x, p.y, tmp_p.x, tmp_p.y)
                if (tmp_line.len()!=0){
                    list_line.push(tmp_line)
                }
            }
        }

    }
    // console.log(list_line[0])
    list_line = shuffle(list_line)
    // console.log(list_line[0])
    // console.log(list_point.length, list_line.length)

    if (num_line > list_line.length){
        num_line = list_line.length;
    }
    for (var i=0; i<num_line; i++){
        //console.log('i:',i)
        tmp_line = list_line[i]
        drawLine(tmp_line)
    }
    for (var i=0; i<list_point.length; i++){
        tmp_p = list_point[i]
        drawPoint(tmp_p, i+1)
    }

}

function drawPoint(p, t, c="#57ff7b") {
    ctx.fillStyle = c
    ctx.beginPath();
    ctx.arc(p.x, p.y, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.font = "bold 14px Arial";
    ctx.fillText(t, p.x-4, p.y+4);
}

function drawLine(l, c="black"){
    ctx.strokeStyle = c;
    ctx.beginPath();
    ctx.moveTo(l.startx, l.starty);
    ctx.lineTo(l.endx, l.endy);
    ctx.stroke();

    mid_point = l.getMidPoint()
    ctx.font = "italic 12px Arial";
    ctx.fillText(l.len(), mid_point.x, mid_point.y);
}

function getRndInteger(min=0, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {  
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  function shortestPath(edges, numVertices, startVertex) {
    var done = new Array(numVertices);
    done[startVertex] = true;
    var pathLengths = new Array(numVertices);
    var predecessors = new Array(numVertices);
    for (var i = 0; i < numVertices; i++) {
      pathLengths[i] = edges[startVertex][i];
      if (edges[startVertex][i] != Infinity) {
        predecessors[i] = startVertex;
      }
    }
    pathLengths[startVertex] = 0;
    for (var i = 0; i < numVertices - 1; i++) {
      var closest = -1;
      var closestDistance = Infinity;
      for (var j = 0; j < numVertices; j++) {
        if (!done[j] && pathLengths[j] < closestDistance) {
          closestDistance = pathLengths[j];
          closest = j;
        }
      }
      done[closest] = true;
      for (var j = 0; j < numVertices; j++) {
        if (!done[j]) {
          var possiblyCloserDistance = pathLengths[closest] + edges[closest][j];
          if (possiblyCloserDistance < pathLengths[j]) {
            pathLengths[j] = possiblyCloserDistance;
            predecessors[j] = closest;
          }
        }
      }
    }
    return { "startVertex": startVertex,
             "pathLengths": pathLengths,
             "predecessors": predecessors };
  }
  
  function constructPath(shortestPathInfo, endVertex) {
    var path = [];
    while (endVertex != shortestPathInfo.startVertex) {
      path.unshift(endVertex);
      endVertex = shortestPathInfo.predecessors[endVertex];
    }
    return path;
  }

function Create2DArray(rows) {
    var arr = [];
  
    for (var i=0; i<rows; i++) {
       arr[i] = [];
    }
  
    return arr;
  }

function createMatrix(list_point, list_line){
    var _ = Infinity;
    

}
  // The adjacency matrix defining the graph.
  // var _ = Infinity;
//   var e = [
//     [ _, _, _, _, _, _, _, _, 4, 2, 3 ],
//     [ _, _, 5, 2, 2, _, _, _, _, _, _ ],
//     [ _, 5, _, _, _, 1, 4, _, _, _, _ ],
//     [ _, 2, _, _, 3, 6, _, 3, _, _, _ ],
//     [ _, 2, _, 3, _, _, _, 4, 3, _, _ ],
//     [ _, _, 1, 6, _, _, 2, 5, _, _, _ ],
//     [ _, _, 4, _, _, 2, _, 5, _, _, 3 ],
//     [ _, _, _, 3, 4, 5, 5, _, 3, 2, 4 ],
//     [ 4, _, _, _, 3, _, _, 3, _, 3, _ ],
//     [ 2, _, _, _, _, _, _, 2, 3, _, 3 ],
//     [ 3, _, _, _, _, _, 3, 4, _, 3, _ ]
//   ];
  
  // Compute the shortest paths from vertex number 1 to each other vertex
  // in the graph.
  // var shortestPathInfo = shortestPath(e, 11, 1);
  
  // Get the shortest path from vertex 1 to vertex 6.
  // var path1to6 = constructPath(shortestPathInfo, 6);