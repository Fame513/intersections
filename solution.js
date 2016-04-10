function intersect(fig1, fig2) {
    var poly1 = createPolygon(fig1, fig2),
        poly2 = createPolygon(fig2, fig1),
        isIntersection = addIntersection(poly1, poly2);

    if (isPolyInside(poly1))
        return [fig1];
    if (isPolyInside(poly2))
        return [fig2];
    if (!isIntersection)
        return [];

    var result = [];


    //walk through polygon nodes and get intersections
    // poly1 aways in forward direction, poly2 check direction
    poly1.foreach(function (fnod) {
        if (fnod.same && fnod.prev.isInside === false && (fnod.next.isInside || fnod.next.same) && !fnod.visited){
            var poly = [];
            poly.push(new Dot(fnod.value.x, fnod.value.y));
            fnod.visited = true;
            var nod = fnod.next;
            var isSecondFigure = false;
            var isBack = null;
            while (!nod.visited){
                // switch figure if is intersection and next node go outside
                if (nod.same && !isGoInside(isBack && isSecondFigure? nod.prev : nod, isSecondFigure ? fig1 : fig2)) {
                    nod.visited = true;
                    nod = nod.same; isSecondFigure = !isSecondFigure; //switch figure
                    if (nod.visited) break;
                    if (isSecondFigure && isBack === null){
                        isBack = !isGoInside(nod, fig1);
                    }
                }

                poly.push(new Dot(nod.value.x, nod.value.y));
                nod.visited = true;

                nod = isSecondFigure && isBack ? nod.prev :nod.next;
            }
            result.push(poly);
        }
    });

    for(var i = 0; i < result.length; i++){
        if (Math.abs(getArea(result[i])) < 0.0001){
            result.splice(i, 1);
        }
    }

    return result;

}


function isGoInside(dot, poly) {
    var middleDot = new Dot((dot.value.x + dot.next.value.x)/2, (dot.value.y + dot.next.value.y)/2);
    return isDotInFigure(middleDot, poly);
}

function isPolyInside(poly) {
    var isInside = true;
    poly.foreach(function (nod) {
        if (nod.isInside === false && !nod.same)
            isInside = false;
    });
    return isInside;
}

function addIntersection(poly1, poly2) {
    var isIntersection = false;
    poly1.foreach(function (dot1) {
        poly2.foreach(function (dot2) {
            var newDot = checkLineIntersection(dot1.value, dot1.next.value, dot2.value, dot2.next.value);

            if (newDot != null){
                var nod1, nod2;
                if (dot1.value.equals(newDot)){
                    nod1 = dot1;
                } else if (dot1.next.value.equals(newDot)){
                    nod1 = dot1.next;
                } else {
                    nod1 = poly1.insert(dot1, newDot);
                }
                if (dot2.value.equals(newDot)){
                    nod2 = dot2;
                } else if (dot2.next.value.equals(newDot)){
                    nod2 = dot2.next;
                } else {
                    nod2 = poly2.insert(dot2, newDot);
                }
                nod1.same = nod2; nod2.same = nod1;
                isIntersection = true;
            }
        });
    });
    return isIntersection;
}

function createPolygon(fig1, fig2) {
    var result = new DoublyCircularList();
    for (var i = 0; i < fig1.length; i++) {
        result.add(new Dot(fig1[i].x, fig1[i].y)).isInside = isDotInFigure(fig1[i], fig2);
    }
    return result;
}

function isDotInFigure(dot, figure){
    var npol = figure.length;
    var j = npol - 1;
    var c = false;
    for (var i = 0; i < npol; i++){
        if ((((figure[i].y<=dot.y) && (dot.y<figure[j].y)) || ((figure[j].y<=dot.y) && (dot.y<figure[i].y))) &&
        (dot.x > (figure[j].x - figure[i].x) * (dot.y - figure[i].y) / (figure[j].y - figure[i].y) + figure[i].x)) {
            c = !c;
        }
        j = i;
    }
    return c;
}



function checkLineIntersection(dot1Start, dot1End, dot2Start, dot2End) {
  var denominator, a, b, numerator1, numerator2,
      result = new Dot(null, null);
  denominator = ((dot2End.y - dot2Start.y) * (dot1End.x - dot1Start.x)) - ((dot2End.x - dot2Start.x) * (dot1End.y - dot1Start.y));
  if (denominator == 0) {
    return null;
  }
  a = dot1Start.y - dot2Start.y;
  b = dot1Start.x - dot2Start.x;
  numerator1 = ((dot2End.x - dot2Start.x) * a) - ((dot2End.y - dot2Start.y) * b);
  numerator2 = ((dot1End.x - dot1Start.x) * a) - ((dot1End.y - dot1Start.y) * b);
  a = numerator1 / denominator;
  b = numerator2 / denominator;


  result.x = dot1Start.x + (a * (dot1End.x - dot1Start.x));
  result.y = dot1Start.y + (a * (dot1End.y - dot1Start.y));

  if ((a >= 0 && a <= 1) && (b >= 0 && b <= 1))
    return result;
  else
    return null;
}

function getArea(fig) {
    var result = 0;
    for (var i = 0; i < fig.length-1; i++){
        result+=((fig[i+1].x - fig[i].x) * (fig[i+1].y + fig[i].y));
    }
    result+=((fig[fig.length-1].x - fig[0].x) * (fig[fig.length-1].y + fig[0].y));
    return result / 2;
}

//############# DoublyCircularList

function Dot(x, y) {
    this.x = x;
    this.y = y;
    
    this.equals = function (dot) {
        return dot && dot.x === this.x && dot.y === this.y
    }
}

function Node(value) {
  this.value = value;
  this.prev = null;
  this.next = null;
}

function DoublyCircularList() {
  this.length = 0;
  this.head = null;
}



DoublyCircularList.prototype.add = function(value) {
  var node = new Node(value);

  if (this.length) {
    node.prev = this.head.prev;
    node.next = this.head;
    this.head.prev.next = node;
    this.head.prev = node;
  } else {
    this.head = node;
    node.next = node;
    node.prev = node;
  }

  this.length++;

  return node;
};

DoublyCircularList.prototype.insert = function(after, value) {
  var node = new Node(value);
    node.prev = after;
    node.next = after.next;
    after.next.prev = node;
    after.next = node;

  this.length++;

  return node;
};

DoublyCircularList.prototype.foreach = function(fun){
    fun(this.head);
    for (var p = this.head.next; p != this.head; p = p.next) {
        fun(p);
    }
};

DoublyCircularList.prototype.get = function(index){
    var result = this.head;
    for (var i = 0; i < index; i++){
        result = result.next;
    }

    return result;
};
//############# DoublyCircularList end


function testIsDotInPolygon() {
    var poly = [
        {x: 0, y: 0},
        {x: 0, y: 100},
        {x: 100, y: 100},
        {x: 100, y: 0}
    ];
    assert(isDotInFigure({x: 50, y: 50}, poly), true);
    assert(isDotInFigure({x: 500, y: 500}, poly), false);
    assert(isDotInFigure({x: 0, y: 0}, poly), false);

    poly = [
        {x: 0, y: 0},
        {x: 50, y: 200},
        {x: 0, y: 100},
        {x: 100, y: 100},
        {x: 100, y: 0}
    ];
    assert(isDotInFigure({x: 50, y: 101}, poly), false);
    assert(isDotInFigure({x: 50, y: 99}, poly), true);
}

function testDoublyCircularList() {
    var list = new DoublyCircularList();
    list.add(1);
    list.add(2);
    list.add(3);
    assert(list.head.value, 1);
    assert(list.head.next.value, 2);
    assert(list.head.next.next.value, 3);
    list.insert(list.head, 15);
    assert(list.head.next.value, 15);
    assert(list.head.next.next.value, 2);

}

function testAddIntersection() {
    var lfig1 = new DoublyCircularList();
    lfig1.add(new Dot(0, 0));
    lfig1.add(new Dot(100, 0));
    lfig1.add(new Dot(100, 100));
    lfig1.add(new Dot(0, 100));


    var lfig2 = new DoublyCircularList();
    lfig2.add(new Dot(50, 50));
    lfig2.add(new Dot(150, 50));
    lfig2.add(new Dot(150, 150));
    lfig2.add(new Dot(50, 150));

    addIntersection(lfig1, lfig2);
    var dot = lfig1.get(2).value;
    assert(dot.x, 100); assert(dot.y, 50);
    dot = lfig1.get(4).value;
    assert(dot.x, 50); assert(dot.y, 100);
    dot = lfig2.get(1).value;
    assert(dot.x, 100); assert(dot.y, 50);
    dot = lfig2.get(5).value;
    assert(dot.x, 50); assert(dot.y, 100);

}


function testCheckLineIntersection() {
    var result = checkLineIntersection({x: 0, y: 50}, {x: 100, y: 50},
        {x: 50, y: 0}, {x: 50, y: 100});
    assert(result.x, 50);
    assert(result.y, 50);
    result = checkLineIntersection({x: 0, y: 0}, {x: 100, y: 100},
        {x: 100, y: 0}, {x: 0, y: 100});
    assert(result.x, 50);
    assert(result.y, 50);
}


testIsDotInPolygon();
testDoublyCircularList();
testAddIntersection();
testCheckLineIntersection();

function assert(is, should) {
    if (is != should){
        var error = new Error();
        error.name = "Assert";
        error.message = is + " != " + should;
        throw error;
    }
}