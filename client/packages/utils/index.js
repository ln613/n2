'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resultOptions = exports.newRating = exports.toGame = exports.adjustRating = exports.withSuccess = exports.cdurl = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ramda = require('ramda');

var _state = require('@ln613/state');

var _recompose = require('recompose');

var _selectors = require('./selectors');

var _compose = require('@ln613/compose');

var cdurl = exports.cdurl = function cdurl(l, c, n) {
  return l.cdVersion ? 'http://res.cloudinary.com/vttc/image/upload/v' + l.cdVersion + '/' + c + '/' + n + '.jpg' : '';
};

var withSuccess = exports.withSuccess = function withSuccess(a, f1, f2) {
  return (0, _recompose.compose)((0, _state.connect)((0, _selectors.successSelector)(a)), (0, _compose.withNewValue)('success', true, f1), (0, _compose.withNewValue)('success', false, f2));
};

var rdiff = [[3, 0], [5, -2], [8, -5], [10, -7], [13, -9], [15, -11], [18, -14], [20, -16], [25, -21], [30, -26], [35, -31], [40, -36], [45, -41], [50, -45], [55, -50]];
var rdelta = [401, 301, 201, 151, 101, 51, 26, -24, -49, -99, -149, -199, -299, -399];

var rateDiff = function rateDiff(r1, r2) {
  var n = rdelta.findIndex(function (x) {
    return x <= r1 - r2;
  });
  return n === -1 ? (0, _ramda.last)(rdiff) : rdiff[n];
};

var adjustRating = exports.adjustRating = function adjustRating(g) {
  if (g.isDouble) {
    return g;
  } else {
    var p1Win = +g.result[0] > +g.result[2];
    var d = p1Win ? rateDiff(g.p1Rating, g.p2Rating) : rateDiff(g.p2Rating, g.p1Rating);
    return _extends({}, g, { p1Diff: p1Win ? d[0] : d[1], p2Diff: p1Win ? d[1] : d[0] });
  }
};

var toGame = exports.toGame = function toGame(g, s, m) {
  var g1 = adjustRating({ id: g.id, isDouble: g.isDouble, date: s.date, t1: +m.home, t2: +m.away, p1: +g.p1, p2: +g.p2, p1Rating: g.p1Rating, p2Rating: g.p2Rating, result: g.result });
  if (g.isDouble) {
    g1.p3 = +g.p3;
    g1.p4 = +g.p4;
  }
  if (!(0, _ramda.isNil)(s.group)) g1.group = s.group;
  return g1;
};

var newRating = exports.newRating = function newRating(r, d) {
  return Math.max(r + d, 100);
};

var resultOptions = exports.resultOptions = ['', '3:0', '3:1', '3:2', '2:3', '1:3', '0:3', '2:0', '2:1', '1:2', '0:2'];