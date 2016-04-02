function intersects(fig1, fig2) {
    var lfig1 = createPolygon(fig1, fig2),
        lfig2 = createPolygon(fig2, fig1);
        var isIntersection = addIntersection(lfig1, lfig2);

    var isInside = true;
    lfig1.foreach(function (nod) {
        if (nod.isInside === false && !nod.same)
            isInside = false;
    });
    if (isInside === true)
        return [fig1];
    isInside = true;
    lfig2.foreach(function (nod) {
        if (nod.isInside === false  && !nod.same)
            isInside = false;
    });
    if (isInside === true)
        return [fig2];
    if (!isIntersection)
        return [];

    var result = [];
    lfig1.foreach(function (fnod) {
        if (fnod.same && fnod.prev.isInside === false && (fnod.next.isInside || fnod.next.same || fnod.next.same) && !fnod.visited){
            var poly = [];
            poly.push({x: fnod.value.x, y: fnod.value.y});
            fnod.visited = true;
            var nod = fnod.next;
            while (!nod.visited){
                if (nod.same) {
                    nod.visited = true;
                    nod = nod.same;
                }
                if (!nod.visited)
                    poly.push({x: nod.value.x, y: nod.value.y});
                nod.visited = true;

                nod = nod.next;
            }
            result.push(poly);
        }
    });

    return result;

}

function addIntersection(poly1, poly2) {
    var isIntersection = false;
    poly1.foreach(function (f1p) {
        poly2.foreach(function (f2p) {
            var newDot = checkLineIntersection(f1p.value, f1p.next.value, f2p.value, f2p.next.value);

            if (newDot != null){
                var nod1, nod2;
                if (f1p.value.x == newDot.x && f1p.value.y == newDot.y){
                    nod1 = f1p;
                } else if (f1p.next.value.x == newDot.x && f1p.next.value.y == newDot.y){
                    nod1 = f1p.next;
                } else {
                    nod1 = poly1.insert(f1p, newDot);
                }
                if (f2p.value.x == newDot.x && f2p.value.y == newDot.y){
                    nod2 = f2p;
                } else if (f2p.next.value.x == newDot.x && f2p.next.value.y == newDot.y){
                    nod2 = f2p.next;
                } else {
                    nod2 = poly2.insert(f2p, newDot);
                }
                nod1.same = nod2; nod2.same = nod1;
                isIntersection = true;
            }
        });
    });
    return isIntersection;
}

function createPolygon(fig1, fig2) {
    var fd = new DoublyCircularList();
    if (isClockwise(fig1)) {
        for (var i = 0; i < fig1.length; i++) {
            fd.add(fig1[i]).isInside = isDotInPolygon(fig1[i], fig2);
        }
    } else {
        for (var i = fig1.length - 1; i >= 0; i--) {
            fd.add(fig1[i]).isInside = isDotInPolygon(fig1[i], fig2);
        }
    }
    return fd;
}

function isDotInPolygon(dot, polygon){
  var npol = polygon.length;
  var j = npol - 1;
  var c = false;
  for (var i = 0; i < npol; i++){
      if ((((polygon[i].y<=dot.y) && (dot.y<polygon[j].y)) || ((polygon[j].y<=dot.y) && (dot.y<polygon[i].y))) &&
      (dot.x > (polygon[j].x - polygon[i].x) * (dot.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
       c = !c
       }
       j = i;
  }
return c;
}



function checkLineIntersection(dot1Start, dot1End, dot2Start, dot2End) {
  var denominator, a, b, numerator1, numerator2, result = {
    x: null,
    y: null
  };
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

function isClockwise(fig) {
    var result = 0;
    for (var i = 0; i < fig.length-1; i++){
        result+=((fig[i+1].x - fig[i].x) * (fig[i+1].y + fig[i].y));
    }
    result+=((fig[fig.length-1].x - fig[0].x) * (fig[fig.length-1].y + fig[0].y));
    return result > 0;
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
    assert(isDotInPolygon({x: 50, y: 50}, poly), true);
    assert(isDotInPolygon({x: 500, y: 500}, poly), false);
    assert(isDotInPolygon({x: 0, y: 0}, poly), false);

    poly = [
        {x: 0, y: 0},
        {x: 50, y: 200},
        {x: 0, y: 100},
        {x: 100, y: 100},
        {x: 100, y: 0}
    ];
    assert(isDotInPolygon({x: 50, y: 101}, poly), false);
    assert(isDotInPolygon({x: 50, y: 99}, poly), true);
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
    lfig1.add({x: 0, y: 0});
    lfig1.add({x: 100, y: 0});
    lfig1.add({x: 100, y: 100});
    lfig1.add({x: 0, y: 100});


    var lfig2 = new DoublyCircularList();
    lfig2.add({x: 50, y: 50});
    lfig2.add({x: 150, y: 50});
    lfig2.add({x: 150, y: 150});
    lfig2.add({x: 50, y: 150});

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