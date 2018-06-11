import React from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { withRouter } from "react-router-dom";
import { is, find, isNil, difference, innerJoin, view, lensPath } from 'ramda';
import { toTitleCase, tap } from '.';
import { filterSelector } from './selectors';
import { Input, Dropdown, Checkbox } from 'semantic-ui-react';

const _Table = ({ data, name, link, equalWidth, setSort, children, history }) => {
  children = children && (is(Array, children) ? children : [children]);
  const l = data || [];
  const keys = l.length > 0 ? Object.keys(l[0]).filter(k => !hidden(k, children)) : [];
  //const sort = (filter[name] || {}).sort;
  //const sortby = sort && sort[0];
  //const sortDir = sort && sort[1];

  return (
    <table class="ui celled striped table">
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
  const onChange = (e, i, v) => setForm(name, getElemValue(e, i, v), index);
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

const checkBox = p =>
  <div class="pv8">
    <Checkbox {...p} checked={p.value} />
  </div>

export const TextBox = withAll(textBox);
export const Select = withAll(select1);
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

const select2 = ({ options, placeholder, isGroup, size, multiple, onChange }) =>
  <select onChange={onChange} size={size} multiple={multiple}>
    {placeholder ? <option value="">{placeholder}</option> : null}
    {isGroup
      ? Object.keys(options).map(k => optionGroup(k, options))
      : options.map(option)
    }
  </select>

const Select2 = withAll(select2);
//export const Select = withAll(select2);

const option = o =>
  <option key={o.value} value={o.value}>{o.text}</option>

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

export const DoubleSelect = compose(
  withForm,
  withProps(({ name, options, form, setForm }) => {
    const [fn, n] = name.split('.');
    const f = form;
    const selectedOptions = (f && f[fn] && f[fn][n]) || [];
    const src = innerJoin((a, b) => a.value != getSelectedValue(b), options, selectedOptions);
    const dst = innerJoin((a, b) => a.value == getSelectedValue(b), options, selectedOptions);
    const srcSelected = (f && f[fn] && f[fn][n + '_src']) || [];
    const dstSelected = (f && f[fn] && f[fn][n + '_dst']) || [];
    const onAdd = () => {
      setForm(name, dst.map(x => x.value.toString()).concat(srcSelected));
      setForm(name + '_src', []);
    };
    const onRemove = () => {
      setForm(name, difference(dst.map(x => x.value.toString()), dstSelected));
      setForm(name + '_dst', []);
    };
    return { src, dst, onAdd, onRemove };
  })
)(_DoubleSelect);