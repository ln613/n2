import React from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { withRouter, Link } from "react-router-dom";
import { is, find, isNil, difference, innerJoin, view, lensPath, not, identity } from 'ramda';
import { toTitleCase, tap } from '.';
import { filterSelector } from './selectors';
import { Input, Dropdown, Checkbox, Responsive, Sidebar, Icon, Menu as _Menu } from 'semantic-ui-react';
import { withState } from 'utils';

const _Table = ({ data, name, link, equalWidth, setSort, children, history }) => {
  children = children && (is(Array, children) ? children : [children]);
  const l = data || [];
  const keys = l.length > 0 ? Object.keys(l[0]).filter(k => !hidden(k, children)) : [];
  //const sort = (filter[name] || {}).sort;
  //const sortby = sort && sort[0];
  //const sortDir = sort && sort[1];

  return (
    <table class="ui celled striped table unstackable fs12">
      <thead>
        <tr>
          {keys.map((k, i) =>
            <th key={`th${i}`} style={equalWidth ? { width: Math.floor(100 / keys.length) + '%' } : {}}
            >
              {title(k, children)}
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {l.map((o, i) =>
          <tr key={`tr${i}`} class={link ? "cp" : ""} onClick={() => link && history.push(is(Function, link) ? link(o.id) : '/' + name + '/' + o.id)}>
            {keys.map(k => col(i, k, o, children))}
          </tr>
        )}
      </tbody>
    </table>
  );
}

export const Table = compose(
  connect(filterSelector, {
    setSort: (name, prop, dir) => ({
      type: actionTypes.Set_Sort,
      name, prop, dir
    })
  }),
  withRouter
)(_Table);

const col = (idx, key, obj, children) => {
  if (!is(Array, children))
    children = children ? [children] : [];
  const c = find(x => x.key === key, children) || find(x => isNil(x.key), children) || { props: {} };
  const p = c.props;

  let v = obj[key];
  let cls = p.class || '';
  if (p.center) cls += ' tac';
  if (p.right) cls += ' tar';

  return (
    <td key={`td${key + idx}`} class={cls}>
      {p.children ? p.children(obj, obj[key]) : <div dangerouslySetInnerHTML={{ __html: v }} />}
    </td>
  );
}

const prop = (prop, val = '') => (key, children) => {
  const child = find(x => x.key === key, children || []);
  return (child && child.props[prop]) || val;
}

const title = (key, children) => prop('title', toTitleCase(key))(key, children);
const hidden = prop('hidden', false);

// class={sortby === k ? (sortDir === 1 ? '_asc' : '_desc') : ''}
// onClick={() => setSort(name, k, sortDir === 1 ? 2 : 1)}

const setForm = (n, v, i) => ({ type: 'setForm', path: 'form.' + n, payload: v });

const withInput = isCheck => comp => ({ name, index, label, noLabel, form, setForm, ...args }) => {
  const path = name.replace(/\[/g, '.').replace(/\]/g, '').split('.');
  let value = view(lensPath(path), form);
  if (!isNil(index) && is(Array, value)) value = value[index];
  const onChange = (e, i, v) => {
    const val = getElemValue(e, i, v);
    setForm(name, val, index);
    if (args.onChange) args.onChange(val, index);
  }
  const o = { ...args, id: path.join('_'), name, value, label, onChange };
  if (!noLabel && !label && path.length > 1) o.label = path[1];
  return comp(o);
}

const getElemValue = (e, i, v) => {
  const t = i || e.target;
  let val = t.value;
  if (t.type === 'checkbox') val = t.checked;
  if (typeof val === 'undefined') val = v;
  return val;
};

const withForm = connect(
  s => ({ form: s.form }),
  { setForm }
);

const withAll = compose(withForm, withInput(false));
const withCheck = compose(withForm, withInput(true));

const textBox = p =>
  <div class="pv8">
    <Input {...p} />
  </div>

const select1 = p =>
  <div class="pv8">
    <Dropdown selection {...p} />
  </div>
const withTextValue = withProps(p => ({...p, options: (p.options || []).map(o => !o.text && o.name ? {...o, text: o.name, value: o.id} : o)}));

const checkBox = p =>
  <div class="pv8">
    <Checkbox {...p} checked={p.value} />
  </div>

export const TextBox = withAll(textBox);
//export const Select = withAll(withTextValue(select1));
export const CheckBox = withCheck(checkBox);


const s1 = {
  display: 'flex',
  flexDirection: 'row'
};

const s2 = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginLeft: '8px',
  marginRight: '8px'
};

const s3 = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
};

const s4 = {
  marginBottom: '8px'
};

const select2 = ({ options, placeholder, isGroup, size, multiple, onChange, value }) =>
  <select onChange={onChange} size={size} multiple={multiple} value={value}>
    {isNil(placeholder) ? null : <option value="">{placeholder}</option>}
    {isGroup
      ? Object.keys(options).map(k => optionGroup(k, options))
      : options.map(option)
    }
  </select>

const Select2 = withAll(select2);
export const Select = withAll(select2);

const option = o =>
  <option key={o.value || o.id} value={o.value || o.id}>{o.text || o.name}</option>

const optionGroup = (key, options) =>
  <optgroup label={key} key={key}>
    {(options[key] || []).map(option)}
  </optgroup>

const _DoubleSelect = ({ name, src, dst, srcTitle, dstTitle, size, buttonStyle, onChange, onAdd, onRemove }) =>
  <div name={name} style={s1}>
    <div style={s3}>
      <div><b>{srcTitle}</b></div>
      <Select2 name={name + '_src'} options={src} size={size || 8} multiple onChange={onChange} />
    </div>
    <div style={s2}>
      <button class={buttonStyle} onClick={onAdd} style={s4}>&#x3E;&#x3E;</button>
      <button class={buttonStyle} onClick={onRemove}>&#x3C;&#x3C;</button>
    </div>
    <div style={s3}>
      <div><b>{dstTitle}</b></div>
      <Select2 name={name + '_dst'} options={dst} size={size || 8} multiple onChange={onChange} />
    </div>
  </div>

const getSelectedValue = x => is(Object, x) ? (x.value || x.id) : x;
const joinOptions = (o, l, r) => innerJoin((a, b) => (r ? not : identity)(a.value == getSelectedValue(b)), o, l);

export const DoubleSelect = compose(
  withForm,
  withProps(({ name, options, form, setForm }) => {
    const [fn, n] = name.split('.');
    const f = form;
    const selectedOptions = (f && f[fn] && f[fn][n]) || [];
    const src = joinOptions(options, selectedOptions, true);
    const dst = joinOptions(options, selectedOptions);
    const srcSelected = joinOptions(options, f && f[fn] && f[fn][n + '_src'] || []);
    const dstSelected = joinOptions(options, f && f[fn] && f[fn][n + '_dst'] || []);
    const onAdd = () => {
      setForm(name, dst.concat(srcSelected));
      setForm(name + '_src', []);
    };
    const onRemove = () => {
      setForm(name, difference(dst, dstSelected));
      setForm(name + '_dst', []);
    };
    return { src, dst, onAdd, onRemove };
  })
)(_DoubleSelect);

export const Mobile = ({ children }) =>
  <Responsive {...Responsive.onlyMobile}>
    {children}
  </Responsive>

export const Desktop = ({ children }) =>
  <Responsive minWidth={Responsive.onlyTablet.minWidth}>
    {children}
  </Responsive>

const items = (menus, setVisible) => (menus || []).map(x => <Link to={'/' + x} onClick={() => setVisible(false)}><_Menu.Item name={x} style={{fontWeight: 'bold'}}/></Link>);
const _menu = (children, color) => <_Menu inverted color={color || 'black'} style={{margin: 0}}>{children}</_Menu>;

const Menu1 = ({ color, menus, children, visible, setVisible }) =>
  <div>
    <Mobile>
      <Sidebar.Pushable>
        <Sidebar as={_Menu} animation="overlay" icon="labeled" inverted vertical visible={visible} color={color || 'black'}>
          {items(menus, setVisible)}
        </Sidebar>
        <Sidebar.Pusher dimmed={visible} onClick={() => visible && setVisible(false)} style={{ minHeight: "100vh" }}>
          {_menu(<_Menu.Item onClick={() => setVisible(!visible)} icon="sidebar"/>, color)}
          {children}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Mobile>
    <Desktop>
      {_menu(items(menus, setVisible), color)}
      {children}
    </Desktop>
  </div>

export const Menu = withState('visible')(Menu1)

export const withMobile = Comp => p =>
  <div>
    <Mobile><Comp {...p} isMobile={true}/></Mobile>
    <Desktop><Comp {...p} isMobile={false}/></Desktop>
  </div>
