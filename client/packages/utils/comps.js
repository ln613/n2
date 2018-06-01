'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DoubleSelect = exports.Select = exports.TextBox = exports.Table = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _recompose = require('recompose');

var _reactRouterDom = require('react-router-dom');

var _ramda = require('ramda');

var _ = require('.');

var _selectors = require('./selectors');

var _semanticUiReact = require('semantic-ui-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _Table = function _Table(_ref) {
  var data = _ref.data,
      name = _ref.name,
      link = _ref.link,
      equalWidth = _ref.equalWidth,
      setSort = _ref.setSort,
      children = _ref.children,
      history = _ref.history;

  children = children && ((0, _ramda.is)(Array, children) ? children : [children]);
  var l = data || [];
  var keys = l.length > 0 ? Object.keys(l[0]).filter(function (k) {
    return !hidden(k, children);
  }) : [];
  //const sort = (filter[name] || {}).sort;
  //const sortby = sort && sort[0];
  //const sortDir = sort && sort[1];

  return _react2.default.createElement(
    'table',
    { 'class': 'ui celled striped table' },
    _react2.default.createElement(
      'thead',
      null,
      _react2.default.createElement(
        'tr',
        null,
        keys.map(function (k, i) {
          return _react2.default.createElement(
            'th',
            { key: 'th' + i, style: equalWidth ? { width: Math.floor(100 / keys.length) + '%' } : {}
            },
            title(k, children)
          );
        })
      )
    ),
    _react2.default.createElement(
      'tbody',
      null,
      l.map(function (o, i) {
        return _react2.default.createElement(
          'tr',
          { key: 'tr' + i, 'class': link ? "cp" : "", onClick: function onClick() {
              return link && history.push((0, _ramda.is)(Function, link) ? link(o.id) : '/' + name + '/' + o.id);
            } },
          keys.map(function (k) {
            return col(i, k, o, children);
          })
        );
      })
    )
  );
};

var Table = exports.Table = (0, _recompose.compose)((0, _reactRedux.connect)(_selectors.filterSelector, {
  setSort: function setSort(name, prop, dir) {
    return {
      type: actionTypes.Set_Sort,
      name: name, prop: prop, dir: dir
    };
  }
}), _reactRouterDom.withRouter)(_Table);

var col = function col(idx, key, obj, children) {
  if (!(0, _ramda.is)(Array, children)) children = children ? [children] : [];
  var c = (0, _ramda.find)(function (x) {
    return x.key === key;
  }, children) || { props: {} };
  var p = c.props;

  var v = obj[key];
  var cls = '';
  if (p.center) cls += 'tac';
  if (p.right) cls += 'tar';

  return _react2.default.createElement(
    'td',
    { key: 'td' + (key + idx), 'class': cls },
    _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: v } })
  );
};

var prop = function prop(_prop) {
  var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  return function (key, children) {
    var child = (0, _ramda.find)(function (x) {
      return x.key === key;
    }, children || []);
    return child && child.props[_prop] || val;
  };
};

var title = function title(key, children) {
  return prop('title', (0, _.toTitleCase)(key))(key, children);
};
var hidden = prop('hidden', false);

// class={sortby === k ? (sortDir === 1 ? '_asc' : '_desc') : ''}
// onClick={() => setSort(name, k, sortDir === 1 ? 2 : 1)}

var setForm = function setForm(n, v, i) {
  return { type: 'setForm', path: 'form.' + n, payload: v };
};

var withInput = function withInput(isCheck) {
  return function (comp) {
    return function (_ref2) {
      var name = _ref2.name,
          index = _ref2.index,
          noLabel = _ref2.noLabel,
          form = _ref2.form,
          setForm = _ref2.setForm,
          args = _objectWithoutProperties(_ref2, ['name', 'index', 'noLabel', 'form', 'setForm']);

      var path = name.replace(/\[/g, '.').replace(/\]/g, '').split('.');
      var value = (0, _ramda.view)((0, _ramda.lensPath)(path), form);
      if (!(0, _ramda.isNil)(index) && (0, _ramda.is)(Array, value)) value = value[index];
      var onChange = function onChange(e, i, v) {
        return setForm(name, getElemValue(e, i, v), index);
      };
      var o = _extends({}, args, { id: path.join('_'), name: name, value: value, onChange: onChange });
      if (!noLabel && path.length > 1) o.label = path[1];
      return comp(o);
    };
  };
};

var getElemValue = function getElemValue(e, i, v) {
  var t = i || e.target;
  var val = t.value;
  if (t.type === 'checkbox') val = t.checked;
  if (typeof val === 'undefined') val = v;
  return val;
};

var withForm = (0, _reactRedux.connect)(function (s) {
  return { form: s.form };
}, { setForm: setForm });

var withAll = (0, _recompose.compose)(withForm, withInput(false));
var withCheck = (0, _recompose.compose)(withForm, withInput(true));

var textBox = function textBox(p) {
  return _react2.default.createElement(
    'div',
    { 'class': 'pv8' },
    _react2.default.createElement(_semanticUiReact.Input, p)
  );
};

var select1 = function select1(p) {
  return _react2.default.createElement(
    'div',
    { 'class': 'pv8' },
    _react2.default.createElement(_semanticUiReact.Dropdown, _extends({ selection: true }, p))
  );
};

var TextBox = exports.TextBox = withAll(textBox);
var Select = exports.Select = withAll(select1);

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

var select2 = function select2(_ref3) {
  var options = _ref3.options,
      placeholder = _ref3.placeholder,
      isGroup = _ref3.isGroup,
      size = _ref3.size,
      multiple = _ref3.multiple,
      onChange = _ref3.onChange;
  return _react2.default.createElement(
    'select',
    { onChange: onChange, size: size, multiple: multiple },
    placeholder ? _react2.default.createElement(
      'option',
      { value: '' },
      placeholder
    ) : null,
    isGroup ? Object.keys(options).map(function (k) {
      return optionGroup(k, options);
    }) : options.map(option)
  );
};

var Select2 = withAll(select2);
//export const Select = withAll(select2);

var option = function option(o) {
  return _react2.default.createElement(
    'option',
    { key: o.value, value: o.value },
    o.text
  );
};

var optionGroup = function optionGroup(key, options) {
  return _react2.default.createElement(
    'optgroup',
    { label: key, key: key },
    (options[key] || []).map(option)
  );
};

var _DoubleSelect = function _DoubleSelect(_ref4) {
  var name = _ref4.name,
      src = _ref4.src,
      dst = _ref4.dst,
      srcTitle = _ref4.srcTitle,
      dstTitle = _ref4.dstTitle,
      size = _ref4.size,
      buttonStyle = _ref4.buttonStyle,
      onChange = _ref4.onChange,
      onAdd = _ref4.onAdd,
      onRemove = _ref4.onRemove;
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

var DoubleSelect = exports.DoubleSelect = (0, _recompose.compose)(withForm, (0, _recompose.withProps)(function (_ref5) {
  var name = _ref5.name,
      options = _ref5.options,
      form = _ref5.form,
      setForm = _ref5.setForm;

  var _name$split = name.split('.'),
      _name$split2 = _slicedToArray(_name$split, 2),
      fn = _name$split2[0],
      n = _name$split2[1];

  var f = form;
  var selectedOptions = f && f[fn] && f[fn][n] || [];
  var src = (0, _ramda.innerJoin)(function (a, b) {
    return a.value != getSelectedValue(b);
  }, options, selectedOptions);
  var dst = (0, _ramda.innerJoin)(function (a, b) {
    return a.value == getSelectedValue(b);
  }, options, selectedOptions);
  var srcSelected = f && f[fn] && f[fn][n + '_src'] || [];
  var dstSelected = f && f[fn] && f[fn][n + '_dst'] || [];
  var onAdd = function onAdd() {
    setForm(name, dst.map(function (x) {
      return x.value.toString();
    }).concat(srcSelected));
    setForm(name + '_src', []);
  };
  var onRemove = function onRemove() {
    setForm(name, (0, _ramda.difference)(dst.map(function (x) {
      return x.value.toString();
    }), dstSelected));
    setForm(name + '_dst', []);
  };
  return { src: src, dst: dst, onAdd: onAdd, onRemove: onRemove };
}))(_DoubleSelect);