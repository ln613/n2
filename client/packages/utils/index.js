'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adjustRating = exports.rateDiff = exports.diff = exports.isPrimitiveType = exports.replaceParam = exports.addIndex = exports.toMonth = exports.toDate = exports.toTitleCase = exports.withNewId = exports.withParams = exports.withLang = exports.withListener = exports.withSuccess = exports.withNewValue = exports.withEditList = exports.withEdit = exports.withLoad = exports.view = exports.toLensPath = exports.getNameById = exports.getPropById = exports.findByName = exports.findById = exports.findByProp = exports.desc = exports.name = exports.ml = exports.admin = exports.api = exports.host = exports.isDev = exports.tap = exports.cdurl = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ramda = require('ramda');

var _noRedux = require('no-redux');

var _recompose = require('recompose');

var _selectors = require('./selectors');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var cdurl = exports.cdurl = function cdurl(l, c, n) {
  return l.cdVersion ? 'http://res.cloudinary.com/vttc/image/upload/v' + l.cdVersion + '/' + c + '/' + n + '.jpg' : '';
};

var tap = exports.tap = function tap(x) {
  return (0, _ramda.tap)(console.log, (0, _ramda.isNil)(x) ? 'null' : x);
};

var isDev = exports.isDev = function isDev() {
  return process.env.NODE_ENV === 'development';
};

var host = exports.host = isDev() ? 'http://localhost:8080/' : '/';
var api = exports.api = host + 'api/';
var admin = exports.admin = host + 'admin/';

var ml = exports.ml = function ml(p) {
  return function (l) {
    return function (o) {
      return o[p + '_' + l] || o[p];
    };
  };
};
var name = exports.name = ml('name');
var desc = exports.desc = ml('desc');

var findByProp = exports.findByProp = function findByProp(p) {
  return function (v) {
    return function (l) {
      return (0, _ramda.find)(function (x) {
        return x[p] == v;
      }, l || []);
    };
  };
};
var findById = exports.findById = findByProp('id');
var findByName = exports.findByName = findByProp('name');

var getPropById = exports.getPropById = function getPropById(p) {
  return function (id) {
    return (0, _ramda.pipe)(findById(id), (0, _ramda.prop)(p));
  };
};
var getNameById = exports.getNameById = getPropById('name');

var toLensPath = exports.toLensPath = function toLensPath(s) {
  return s.replace(/\[/g, '.').replace(/\]/g, '').split('.');
};
var view = exports.view = function view(s, o) {
  return (0, _ramda.view)((0, _ramda.lensPath)(toLensPath(s)), o);
};

var withLoad = exports.withLoad = function withLoad(p, v, force) {
  return (0, _recompose.lifecycle)({
    componentWillMount: function componentWillMount() {
      var v1 = (0, _ramda.is)(Array, v) ? v[0] : v || 'id';
      var v2 = (0, _ramda.is)(Array, v) ? v[1] : v || 'id';
      (force || (0, _ramda.isEmpty)(this.props[p])) && this.props['get' + p[0].toUpperCase() + p.slice(1)](_defineProperty({}, v1, this.props[v2]));
    }
  });
};

var withEdit = exports.withEdit = function withEdit(p, l, o) {
  return (0, _recompose.lifecycle)({
    componentWillMount: function componentWillMount() {
      var id = +this.props.match.params.id;
      var list = toLensPath(l || p + 's');
      var v = (0, _ramda.find)(function (x) {
        return x.id == id;
      }, (0, _ramda.view)((0, _ramda.lensPath)(list), this.props) || []);
      this.props.setForm(v || _extends({ id: id }, o || {}), { path: p });
    }
  });
};

var withEditList = exports.withEditList = function withEditList(p) {
  return (0, _recompose.lifecycle)({
    componentWillMount: function componentWillMount() {
      var list = toLensPath(p);
      var v = (0, _ramda.view)((0, _ramda.lensPath)(list), this.props);
      this.props.setForm(v, { path: list });
    }
  });
};

var withNewValue = exports.withNewValue = function withNewValue(p, v, f) {
  return (0, _recompose.lifecycle)({
    componentWillReceiveProps: function componentWillReceiveProps(np) {
      var nv = np[p];
      var ov = this.props[p];
      if ((0, _ramda.isNil)(v) ? nv !== ov : nv === v && ov === null) f(this.props, nv);
    }
  });
};

var withSuccess = exports.withSuccess = function withSuccess(a, f1, f2) {
  return (0, _recompose.compose)((0, _noRedux.connect)((0, _selectors.successSelector)(a)), withNewValue('success', true, f1), withNewValue('success', false, f2));
};

var getEl = function getEl(id) {
  return id ? document.getElementById(id) : window;
};

var withListener = exports.withListener = function withListener(ev, f, id) {
  return (0, _recompose.compose)((0, _recompose.withHandlers)({ listener: function listener(p) {
      return function (e) {
        return f(p);
      };
    } }), (0, _recompose.lifecycle)({
    componentDidMount: function componentDidMount() {
      getEl(id).addEventListener(ev, this.props.listener);
    },
    componentWillUnmount: function componentWillUnmount() {
      getEl(id).removeEventListener(ev, this.props.listener);
    }
  }));
};

var withLang = exports.withLang = (0, _recompose.withProps)(function (p) {
  return { n: name(p.lang), d: desc(p.lang) };
});

var withParams = exports.withParams = (0, _recompose.withProps)(function (p) {
  return _extends({}, p.match.params);
});

var withNewId = exports.withNewId = function withNewId(path) {
  return (0, _recompose.withProps)(function (p) {
    return { newId: (0, _ramda.reduce)(_ramda.max, 0, (view(path, p) || []).map(function (x) {
        return +x.id;
      })) + 1 };
  });
};

var toTitleCase = exports.toTitleCase = function toTitleCase(s) {
  return s.replace(/\w\S*/g, function (t) {
    return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
  });
};

var toDate = exports.toDate = function toDate(s) {
  var d = new Date(s);
  return d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
};

var toMonth = exports.toMonth = function toMonth(s) {
  var d = new Date(s);
  return d.getFullYear() + '/' + (d.getMonth() + 1);
};

var addIndex = exports.addIndex = function addIndex(p) {
  return function (a) {
    return a.map(function (x, i) {
      return _extends(_defineProperty({}, p || 'id', i + 1), x);
    });
  };
};

var replaceParam = exports.replaceParam = function replaceParam(s, ps) {
  return (0, _ramda.reduce)(function (p, c) {
    return p.replace(new RegExp('{' + c + '}'), ps[c]);
  }, s, Object.keys(ps));
};

var isPrimitiveType = exports.isPrimitiveType = (0, _ramda.anyPass)([(0, _ramda.is)(Number), (0, _ramda.is)(String), (0, _ramda.is)(Boolean)]);

var diff = exports.diff = function diff(p) {
  return (0, _ramda.differenceWith)(function (a, b) {
    return isPrimitiveType(a) ? a === b : a[p || 'id'] === b[p || 'id'];
  });
};

var rdiff = [[3, 0], [5, -2], [8, -5], [10, -7], [13, -9], [15, -11], [18, -14], [20, -16], [25, -21], [30, -26], [35, -31], [40, -36], [45, -41], [50, -45], [55, -50]];
var rdelta = [401, 301, 201, 151, 101, 51, 26, -24, -49, -99, -149, -199, -299, -399];

var rateDiff = exports.rateDiff = function rateDiff(r1, r2) {
  var n = rdelta.findIndex(function (x) {
    return x <= r1 - r2;
  });
  return n === -1 ? R.last(rdiff) : rdiff[n];
};

var adjustRating = exports.adjustRating = function adjustRating(g) {
  if (g.isDouble) {
    return g;
  } else {
    var p1Win = g.result[0] === '3';
    var d = p1Win ? rateDiff(g.p1Rating, g.p2Rating) : rateDiff(g.p2Rating, g.p1Rating);
    return _extends({}, g, { p1Diff: p1Win ? d[0] : d[1], p2Diff: p1Win ? d[1] : d[0] });
  }
};