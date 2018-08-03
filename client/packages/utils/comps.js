'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ready = exports.Menu = exports.DoubleSelect = exports.Select = exports.CheckBox = exports.TextBox = exports.Table = exports.withMobile = exports.Desktop = exports.Mobile = undefined;

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

var _utils = require('utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Mobile = exports.Mobile = function Mobile(_ref) {
  var children = _ref.children;
  return _react2.default.createElement(
    _semanticUiReact.Responsive,
    _semanticUiReact.Responsive.onlyMobile,
    children
  );
};

var Desktop = exports.Desktop = function Desktop(_ref2) {
  var children = _ref2.children;
  return _react2.default.createElement(
    _semanticUiReact.Responsive,
    { minWidth: _semanticUiReact.Responsive.onlyTablet.minWidth },
    children
  );
};

var withMobile = exports.withMobile = function withMobile(Comp) {
  return function (p) {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        Mobile,
        null,
        _react2.default.createElement(Comp, _extends({}, p, { isMobile: true }))
      ),
      _react2.default.createElement(
        Desktop,
        null,
        _react2.default.createElement(Comp, _extends({}, p, { isMobile: false }))
      )
    );
  };
};

var _Table = function _Table(_ref3) {
  var data = _ref3.data,
      name = _ref3.name,
      link = _ref3.link,
      equalWidth = _ref3.equalWidth,
      setSort = _ref3.setSort,
      children = _ref3.children,
      history = _ref3.history,
      isMobile = _ref3.isMobile;

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
    { 'class': 'ui celled striped table unstackable ' + (isMobile ? 'mobile' : ''), id: name, style: isMobile ? { fontSize: '12px' } : {} },
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
}), _reactRouterDom.withRouter, withMobile)(_Table);

var col = function col(idx, key, obj, children) {
  if (!(0, _ramda.is)(Array, children)) children = children ? [children] : [];
  var c = (0, _ramda.find)(function (x) {
    return x.key === key;
  }, children) || (0, _ramda.find)(function (x) {
    return (0, _ramda.isNil)(x.key);
  }, children) || { props: {} };
  var p = c.props;

  var v = obj[key];
  var cls = p.class || '';
  if (p.center) cls += ' tac';
  if (p.right) cls += ' tar';
  if (p.input) {
    v = _react2.default.createElement(TextBox, { name: p.path.replace('{i}', idx), noLabel: true, className: (p.center ? 'text-center' : '') + ' ' + (p.right ? 'text-right' : '') });
    cls += ' edit';
  } else if (p.select) {
    v = _react2.default.createElement(Select, { name: p.path.replace('{i}', idx), placeholder: '', options: p.options });
  }

  return _react2.default.createElement(
    'td',
    { key: 'td' + (key + idx), 'class': cls },
    p.children ? p.children(obj, obj[key]) : v && v.props ? v : _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: v } })
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
    return function (_ref4) {
      var name = _ref4.name,
          index = _ref4.index,
          label = _ref4.label,
          noLabel = _ref4.noLabel,
          form = _ref4.form,
          setForm = _ref4.setForm,
          args = _objectWithoutProperties(_ref4, ['name', 'index', 'label', 'noLabel', 'form', 'setForm']);

      var path = name.replace(/\[/g, '.').replace(/\]/g, '').split('.');
      var value = (0, _ramda.view)((0, _ramda.lensPath)(path), form);
      if (!(0, _ramda.isNil)(index) && (0, _ramda.is)(Array, value)) value = value[index];
      var onChange = function onChange(e, i, v) {
        var val = getElemValue(e, i, v);
        setForm(name, val, index);
        if (args.onChange) args.onChange(val, index);
      };
      var o = _extends({}, args, { id: path.join('_'), name: name, value: value, label: label, onChange: onChange });
      if (!noLabel && !label && path.length > 1) o.label = path[1];
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
var withTextValue = (0, _recompose.withProps)(function (p) {
  return _extends({}, p, { options: (p.options || []).map(function (o) {
      return !o.text && o.name ? _extends({}, o, { text: o.name, value: o.id }) : o;
    }) });
});

var checkBox = function checkBox(p) {
  return _react2.default.createElement(
    'div',
    { 'class': 'pv8' },
    _react2.default.createElement(_semanticUiReact.Checkbox, _extends({}, p, { checked: p.value }))
  );
};

var TextBox = exports.TextBox = withAll(textBox);
//export const Select = withAll(withTextValue(select1));
var CheckBox = exports.CheckBox = withCheck(checkBox);

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

var select2 = function select2(_ref5) {
  var options = _ref5.options,
      placeholder = _ref5.placeholder,
      isGroup = _ref5.isGroup,
      size = _ref5.size,
      multiple = _ref5.multiple,
      onChange = _ref5.onChange,
      value = _ref5.value;
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

var Select2 = withAll(select2);
var Select = exports.Select = withAll(select2);

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

var _DoubleSelect = function _DoubleSelect(_ref6) {
  var name = _ref6.name,
      src = _ref6.src,
      dst = _ref6.dst,
      srcTitle = _ref6.srcTitle,
      dstTitle = _ref6.dstTitle,
      size = _ref6.size,
      buttonStyle = _ref6.buttonStyle,
      onChange = _ref6.onChange,
      onAdd = _ref6.onAdd,
      onRemove = _ref6.onRemove;
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

var DoubleSelect = exports.DoubleSelect = (0, _recompose.compose)(withForm, (0, _recompose.withProps)(function (_ref7) {
  var name = _ref7.name,
      options = _ref7.options,
      form = _ref7.form,
      setForm = _ref7.setForm;

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

var items = function items(menus, setVisible) {
  return (menus || []).map(function (x, i) {
    return _react2.default.createElement(
      _reactRouterDom.Link,
      { to: '/' + (i === 0 ? '' : x), onClick: function onClick() {
          return setVisible(false);
        } },
      _react2.default.createElement(_semanticUiReact.Menu.Item, { name: x, style: { fontWeight: 'bold' } })
    );
  });
};
var _menu = function _menu(children, color) {
  return _react2.default.createElement(
    _semanticUiReact.Menu,
    { inverted: true, color: color || 'black', style: { margin: 0 } },
    children
  );
};

var Menu1 = function Menu1(_ref8) {
  var color = _ref8.color,
      menus = _ref8.menus,
      children = _ref8.children,
      visible = _ref8.visible,
      setVisible = _ref8.setVisible;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      Mobile,
      null,
      _react2.default.createElement(
        _semanticUiReact.Sidebar.Pushable,
        null,
        _react2.default.createElement(
          _semanticUiReact.Sidebar,
          { as: _semanticUiReact.Menu, animation: 'overlay', icon: 'labeled', inverted: true, vertical: true, visible: visible, color: color || 'black' },
          items(menus, setVisible)
        ),
        _react2.default.createElement(
          _semanticUiReact.Sidebar.Pusher,
          { dimmed: visible, onClick: function onClick() {
              return visible && setVisible(false);
            }, style: { minHeight: "100vh" } },
          _menu(_react2.default.createElement(_semanticUiReact.Menu.Item, { onClick: function onClick() {
              return setVisible(!visible);
            }, icon: 'sidebar' }), color),
          children
        )
      )
    ),
    _react2.default.createElement(
      Desktop,
      null,
      _menu(items(menus, setVisible), color),
      children
    )
  );
};

var Menu = exports.Menu = (0, _utils.withState)('visible')(Menu1);

var Ready = exports.Ready = function Ready(_ref9) {
  var on = _ref9.on,
      children = _ref9.children;
  return on.every(ready) ? children : _react2.default.createElement(_semanticUiReact.Loader, { active: true, inline: 'centered' });
};

var ready = function ready(x) {
  return (0, _ramda.is)(Array, x) ? x.length > 0 : (0, _ramda.is)(Object, x) ? Object.keys(x).length > 0 : !(0, _ramda.isNil)(x);
};