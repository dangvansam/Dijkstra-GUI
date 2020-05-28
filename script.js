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
        this.points = []
    }

    len(){
        return parseInt(Math.sqrt(Math.pow((this.startx-this.endx),2) + Math.pow((this.starty-this.endy),2)))
    }

    getMidPoint(){
        var mid_p = new Point(parseInt(Math.min(this.startx, this.endx)+Math.abs(this.startx-this.endx)/2),parseInt(Math.min(this.starty, this.endy)+Math.abs(this.starty-this.endy)/2))
        //console.log(mid_p)
        return mid_p
    }
    setPoint(p){
      this.points.push(p)
    }
    getPoint(){
      return this.points
    }
}

class Graph {
  constructor() {
    this.nodes = [];
    this.adjacencyList = {};
  }
  addNode(node) {
    this.nodes.push(node); 
    this.adjacencyList[node] = [];
  }
  addEdge(node1, node2, weight) {
    this.adjacencyList[node1].push({node:node2, weight: weight});
    this.adjacencyList[node2].push({node:node1, weight: weight});
  }

  findPathWithDijkstra(startNode, endNode) {

    let times = {};
    let backtrace = {};
    let result = [];
    if (this.adjacencyList[startNode].length == 0 || this.adjacencyList[endNode].length == 0){
      result = ["INFINITY",[]];
      return result;
    }
    let pq = new PriorityQueue();
    times[startNode] = 0;
    
    this.nodes.forEach(node => {
      if (node !== startNode) {
        times[node] = Infinity
      }
    });
    pq.enqueue([startNode, 0]);
    while (!pq.isEmpty()) {
      let shortestStep = pq.dequeue();
      let currentNode = shortestStep[0];
      this.adjacencyList[currentNode].forEach(neighbor => {
        let time = times[currentNode] + neighbor.weight;
        if (time < times[neighbor.node]) {
          times[neighbor.node] = time;
          backtrace[neighbor.node] = currentNode;
          pq.enqueue([neighbor.node, time]);
        }
      });
    }
    let path = [endNode];
    let lastStep = endNode;
    while(lastStep !== startNode) {
      path.unshift(backtrace[lastStep])
      lastStep = backtrace[lastStep]
    }
    //path.push(times[endNode])
    result.push(times[endNode])
    result.push(path)
    
    //console.log("result:",result)
    return result
  }
}

class PriorityQueue {
  constructor() {
    this.collection = [];
  }
  enqueue(element){
    if (this.isEmpty()){ 
      this.collection.push(element);
    } else {
      let added = false;
      for (let i = 1; i <= this.collection.length; i++){
        if (element[1] < this.collection[i-1][1]){ 
          this.collection.splice(i-1, 0, element);
          added = true;
          break;
        }
      }
      if (!added){
          this.collection.push(element);
      }
    }
  };

  dequeue() {
    let value = this.collection.shift();
    return value;
  };
  isEmpty() {
    return (this.collection.length === 0) 
  };
}


function drawGraph(){
    // Khởi tạo canvas
    init()

    num_point = document.getElementById("num_point_input").value;
    num_line = document.getElementById("num_line_input").value;
    num_point = parseInt(num_point)
    num_line = parseInt(num_line)
    
    var start_point = document.getElementById("start_point_input");
    var end_point = document.getElementById("end_point_input");
    start_point.value = 0;
    end_point.value = 3;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    destance_text = document.getElementById("destance");
    path_text = document.getElementById("path");
    destance_text.innerHTML = ""
    path_text.innerHTML = ""

    window_x = 100
    window_y = 100
    window_w = canvas.width - 100
    window_h = canvas.height - 100

    list_point  = []
    list_line = []
    map = new Graph();

    for (var i=0; i<num_point; i++){
        var tmp_x = getRndInteger(window_x, window_w)
        var tmp_y = getRndInteger(window_y, window_h)
        var tmp_p = new Point(tmp_x, tmp_y)
 
        map.addNode(i)
        list_point.push(tmp_p)

        if (i != 0){
            for (var j=0; j<list_point.length; j++){
                var p = list_point[j]
                var tmp_line = new Line(p.x, p.y, tmp_p.x, tmp_p.y)
                tmp_line.setPoint(i)
                tmp_line.setPoint(j)

                if (tmp_line.len()!=0){
                    list_line.push(tmp_line)
                }
            }
        }

    }
    // trộn các cạnh ngẫu nhiên
    list_line = shuffle(list_line)

    if (num_line > list_line.length){
        num_line = list_line.length;
    }
    for (var i=0; i<num_line; i++){
        var tmp_line = list_line[i]
        nodes = tmp_line.getPoint().sort()
        map.addEdge(nodes[0], nodes[1], tmp_line.len())
        drawLine(tmp_line)
    }
    for (var i=0; i<list_point.length; i++){
        var tmp_p = list_point[i]
        drawPoint(tmp_p, i)
    }

    //rs = map.findPathWithDijkstra(0,3)
    //console.log(rs)
}

function isInclude(arr, x){
    for (var i=0;i<arr.length;i++){
      if (arr[i]==x){
        return true;
      }
    }
    return false;
}
function drawGraphDijsktra(){
    var start_point = document.getElementById("start_point_input").value;
    var end_point = document.getElementById("end_point_input").value;
    start_point = parseInt(start_point)
    end_point = parseInt(end_point)
    if (start_point >= num_point || end_point >= num_point){
        if (start_point >=num_point){
          start_point = num_point -1
        }
        if (end_point >=num_point){
          end_point = num_point -1
        }
      }
    rs = map.findPathWithDijkstra(start_point, end_point)

    destance = rs[0]
    path = rs[1]
    //console.log(destance)
    //console.log(path)

    destance_text.innerHTML = destance;
    path_text.innerHTML = path.join(">");

    var path = Object.keys(path).map(function (key) { return path[key]; });
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i=0; i<num_line; i++){
      var tmp_line = list_line[i]

      if (isInclude(path,tmp_line.getPoint()[0]) && isInclude(path,tmp_line.getPoint()[1])){
        drawLine(tmp_line, c="#FF6347")
        // console.log("true")
        // console.log(path)
        // console.log(tmp_line.getPoint()[0])
        // console.log(tmp_line.getPoint()[1])
      }
      else{
        drawLine(tmp_line)
      }
    }
    for (var i=0; i<list_point.length; i++){
        var tmp_p = list_point[i]
        if (path.indexOf(i) != -1){
          drawPoint(tmp_p, i, c="#FF6347")
        }
        else {
            drawPoint(tmp_p, i)
        }
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

function drawLine(l, c="grey"){
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
