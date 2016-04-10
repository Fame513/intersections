// пример многоугольников
var examples = {
  first: [
    { x: 60,  y: 60  },
    { x: 180, y: 0   },
    { x: 300, y: 60  },
    { x: 300, y: 300 },
    { x: 240, y: 180 },
    { x: 210, y: 180 },
    { x: 180, y: 240 },
    { x: 150, y: 180 },
    { x: 120, y: 180 },
    { x: 60,  y: 300 },
  ],
  second: [
    { x: 30,  y: 240 },
    { x: 330, y: 240 },
    { x: 330, y: 210 },
    { x: 270, y: 90  },
    { x: 210, y: 270 },
    { x: 210, y: 90  },
    { x: 180, y: 60  },
    { x: 150, y: 90  },
    { x: 150, y: 270 },
    { x: 90,  y: 90  },
    { x: 30,  y: 210 }
  ]

};

// examples = {
//   first: [
//     { x: 0,  y: 0  },
//     { x: 0, y: 200  },
//     { x: 200, y: 200   },
//     { x: 200, y: 0  },
//
//   ],
//     second: [
//     { x: 250,  y: 250  },
//     { x: 250, y: 350  },
//     { x: 99, y: 99},
//     { x: 350, y: 250  },
//   ]
//
// };
//
// examples = {
//   first: [
//     { x: 0,  y: 50  },
//     { x: 300, y: 50  },
//     { x: 300, y: 100   },
//     { x: 50, y: 100  },
//     { x: 50, y: 250  },
//     { x: 300, y: 250  },
//     { x: 300, y: 300  },
//     { x: 0, y: 300  },
//     { x: 0, y: 50  }
//   ],
//   second: [
//     { x: 100,  y: 0  },
//     { x: 200, y: 0  },
//     { x: 200, y: 150},
//     { x: 100, y: 200  },
//     { x: 100, y: 350  },
//     { x: 200, y: 350  },
//     { x: 200, y: 200  },
//     { x: 100, y: 150  },
//     { x: 100, y: 0  }
//   ]
//
// };

function drawPath(data, container, color) {
  var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  var str = 'M' + data[0].x + ',' + data[0].y+' ';
  str += data.slice(1).map(function (point) {
    return 'L' + point.x + ',' + point.y;
  }).join(' ');
  str += 'L' + data[0].x + ',' + data[0].y+' ';
  path.setAttribute('d', str);
  path.style.fill = color;
  container.appendChild(path);
}

drawPath(examples.first, document.querySelector('svg.base'), 'navy');
drawPath(examples.second, document.querySelector('svg.base'), 'yellow');

intersects(examples.first, examples.second).forEach(function (p) {
  drawPath(p, document.querySelector('svg.intersections'), 'red');
})
