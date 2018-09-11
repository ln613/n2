'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DoubleSelect = exports.Select = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _recompose = require('recompose');

var _reactRouterDom = require('react-router-dom');

var _ramda = require('ramda');

var _util = require('@ln613/util');

var _ui = require('@ln613/ui');

var _semantic = require('@ln613/ui/semantic');

var _selectors = require('./selectors');

var _semanticUiReact = require('semantic-ui-react');

var _compose = require('@ln613/compose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var s1 = {
  display: 'flex',
  flexDirection: 'row'
};

var s2 = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginLeft: '8px',
  marginRight: '8px'
};

var s3 = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
};

var s4 = {
  marginBottom: '8px'
};

var select2 = function select2(_ref) {
  var options = _ref.options,
      placeholder = _ref.placeholder,
      isGroup = _ref.isGroup,
      size = _ref.size,
      multiple = _ref.multiple,
      onChange = _ref.onChange,
      value = _ref.value;
  return _react2.default.createElement(
    'select',
    { onChange: onChange, size: size, multiple: multiple, value: value },
    (0, _ramda.isNil)(placeholder) ? null : _react2.default.createElement(
      'option',
      { value: '' },
      placeholder
    ),
    isGroup ? Object.keys(options).map(function (k) {
      return optionGroup(k, options);
    }) : options.map(option)
  );
};

var Select2 = (0, _ui.withAll)(select2);
var Select = exports.Select = (0, _ui.withAll)(select2);

var option = function option(o) {
  return _react2.default.createElement(
    'option',
    { key: o.value || o.id || o, value: o.value || o.id || o },
    o.text || o.name || o
  );
};

var optionGroup = function optionGroup(key, options) {
  return _react2.default.createElement(
    'optgroup',
    { label: key, key: key },
    (options[key] || []).map(option)
  );
};

var _DoubleSelect = function _DoubleSelect(_ref2) {
  var name = _ref2.name,
      src = _ref2.src,
      dst = _ref2.dst,
      srcTitle = _ref2.srcTitle,
      dstTitle = _ref2.dstTitle,
      size = _ref2.size,
      buttonStyle = _ref2.buttonStyle,
      onChange = _ref2.onChange,
      onAdd = _ref2.onAdd,
      onRemove = _ref2.onRemove;
  return _react2.default.createElement(
    'div',
    { name: name, style: s1 },
    _react2.default.createElement(
      'div',
      { style: s3 },
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'b',
          null,
          srcTitle
        )
      ),
      _react2.default.createElement(Select2, { name: name + '_src', options: src, size: size || 8, multiple: true, onChange: onChange })
    ),
    _react2.default.createElement(
      'div',
      { style: s2 },
      _react2.default.createElement(
        'button',
        { 'class': buttonStyle, onClick: onAdd, style: s4 },
        '>>'
      ),
      _react2.default.createElement(
        'button',
        { 'class': buttonStyle, onClick: onRemove },
        '<<'
      )
    ),
    _react2.default.createElement(
      'div',
      { style: s3 },
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'b',
          null,
          dstTitle
        )
      ),
      _react2.default.createElement(Select2, { name: name + '_dst', options: dst, size: size || 8, multiple: true, onChange: onChange })
    )
  );
};

var getSelectedValue = function getSelectedValue(x) {
  return (0, _ramda.is)(Object, x) ? x.value || x.id : x;
};
var joinOptions = function joinOptions(o, l, r) {
  return (0, _ramda.innerJoin)(function (a, b) {
    return (r ? _ramda.not : _ramda.identity)(a.value == getSelectedValue(b));
  }, o, l);
};

var DoubleSelect = exports.DoubleSelect = (0, _recompose.compose)(_ui.withForm, (0, _recompose.withProps)(function (_ref3) {
  var name = _ref3.name,
      options = _ref3.options,
      form = _ref3.form,
      setForm = _ref3.setForm;

  var _name$split = name.split('.'),
      _name$split2 = _slicedToArray(_name$split, 2),
      fn = _name$split2[0],
      n = _name$split2[1];

  var f = form;
  var selectedOptions = f && f[fn] && f[fn][n] || [];
  var src = joinOptions(options, selectedOptions, true);
  var dst = joinOptions(options, selectedOptions);
  var srcSelected = joinOptions(options, f && f[fn] && f[fn][n + '_src'] || []);
  var dstSelected = joinOptions(options, f && f[fn] && f[fn][n + '_dst'] || []);
  var onAdd = function onAdd() {
    setForm(name, dst.concat(srcSelected));
    setForm(name + '_src', []);
  };
  var onRemove = function onRemove() {
    setForm(name, (0, _ramda.difference)(dst, dstSelected));
    setForm(name + '_dst', []);
  };
  return { src: src, dst: dst, onAdd: onAdd, onRemove: onRemove };
}))(_DoubleSelect);