var stsLib = require('../stslib_web.js');

main = function() {
  stsLib.test.test_stslib_core();
  stsLib.web.test_stslib_web();
  stsLib.system.test_stslib_console();

  var drawRect01 = function () {
    var e = document.getElementById('canvas01');
    if ( ! e || ! e.getContext ) { return false; }
    var canvas = e.getContext('2d');
    canvas.beginPath();

    var p = stsLib.point.Point(30, 30);
    canvas.moveTo(p.x, p.y);
    p.move(30, 0);
    canvas.lineTo(p.x, p.y);
    p.move(0, 30);
    canvas.lineTo(p.x, p.y);
    p.move(-30, 0);
    canvas.lineTo(p.x, p.y);
    canvas.closePath();
    canvas.stroke();
  };
  drawRect01();

  var drawRect02 = function () {
    var e = document.getElementById('canvas01');
    if ( ! e || ! e.getContext ) { return false; }
    var canvas = e.getContext('2d');
    canvas.beginPath();

    var v = stsLib.vector.Vector(
      stsLib.point.Point(130, 30),
      stsLib.point.Point(160, 30));
    canvas.moveTo(v.from.x, v.from.y);
    canvas.lineTo(v.to.x, v.to.y);
    v.setFrom(v.to);
    v = v.rotate(-90);
    canvas.lineTo(v.to.x, v.to.y);
    v.setFrom(v.to);
    v = v.rotate(-90);
    canvas.lineTo(v.to.x, v.to.y);
    canvas.closePath();
    canvas.stroke();
  };
  drawRect02();

 var drawStar = function () {
    var e = document.getElementById('canvas01');
    if ( ! e || ! e.getContext ) { return false; }
    var canvas = e.getContext('2d');
    canvas.beginPath();

    var v = stsLib.vector.Vector(
      stsLib.point.Point(30, 160),
      stsLib.point.Point(30, 130));
    v.rotate(-18);
    canvas.moveTo(v.from.x, v.from.y);
    canvas.lineTo(v.to.x, v.to.y);
    v.setFrom(v.to);
    v.rotate(-1 * (180-36));
    canvas.lineTo(v.to.x, v.to.y);
    v.setFrom(v.to);
    v.rotate(-1 * (180-36));
    canvas.lineTo(v.to.x, v.to.y);
    v.setFrom(v.to);
    v.rotate(-1 * (180-36));
    canvas.lineTo(v.to.x, v.to.y);

    canvas.closePath();
    canvas.stroke();
  };
  drawStar();
};

