import { tap as _tap, prop, find, pipe, isNil, is, isEmpty, view as _view, lensPath, reduce, max, last, differenceWith, anyPass } from 'ramda';
import { connect } from 'no-redux';
import { compose, lifecycle, withProps, withHandlers } from 'recompose';
import { successSelector } from './selectors';

export const cdurl = (l, c, n) => l.cdVersion ? `http://res.cloudinary.com/vttc/image/upload/v${l.cdVersion}/${c}/${n}.jpg` : '';

export const tap = x => _tap(console.log, isNil(x) ? 'null' : x);

export const isDev = () => process.env.NODE_ENV === 'development';

export const host = isDev() ? 'http://localhost:8080/' : '/';
export const api = host + 'api/';
export const admin = host + 'admin/';

export const ml = p => l => o => o[p + '_' + l] || o[p];
export const name = ml('name');
export const desc = ml('desc');

export const findByProp = p => v => l => find(x => x[p] == v, l || []);
export const findById = findByProp('id');
export const findByName = findByProp('name');

export const getPropById = p => id => pipe(findById(id), prop(p));
export const getNameById = getPropById('name')

export const toLensPath = s => s.replace(/\[/g, '.').replace(/\]/g, '').split('.');
export const view = (s, o) => _view(lensPath(toLensPath(s)), o);

export const withWidth = lifecycle({
  componentWillMount() {
    if (window.innerWidth <= 960)
      this.props.setIsMobile(true);
  }
});

export const withLoad = (p, v, force) => lifecycle({
  componentWillMount() {
    const v1 = is(Array, v) ? v[0] : (v || 'id');
    const v2 = is(Array, v) ? v[1] : (v || 'id');
    (force || isEmpty(this.props[p])) && this.props['get' + p[0].toUpperCase() + p.slice(1)]({ [v1]: this.props[v2] });
  }
});

export const withEdit = (p, l, o) => lifecycle({
  componentWillMount() {
    const id = +this.props.match.params.id;
    const list = toLensPath(l || (p + 's'));
    const v = find(x => x.id == id, _view(lensPath(list), this.props) || []);
    this.props.setForm(v || { id, ...(o || {}) }, { path: p });
  }
});

export const withEditList = p => lifecycle({
  componentWillMount() {
    const list = toLensPath(p);
    const v = _view(lensPath(list), this.props);
    this.props.setForm(v, { path: list });
  }
});

export const withNewValue = (p, v, f) => lifecycle({
  componentWillReceiveProps(np) {
    const nv = np[p];
    const ov = this.props[p];
    if (isNil(v) ? nv !== ov : (nv === v && ov === null))
      f(this.props, nv);
  }
});

export const withSuccess = (a, f1, f2) => compose(
  connect(successSelector(a)),
  withNewValue('success', true, f1),
  withNewValue('success', false, f2),
);

const getEl = id => id ? document.getElementById(id) : window;

export const withListener = (ev, f, id) => compose(
  withHandlers({ listener: p => e => f(p) }),
  lifecycle({
    componentDidMount() {
      getEl(id).addEventListener(ev, this.props.listener);
    },

    componentWillUnmount() {
      getEl(id).removeEventListener(ev, this.props.listener);
    }
  })
)  

export const withLang = withProps(p => ({ n: name(p.lang), d: desc(p.lang) }));

export const withParams = withProps(p => ({ ...p.match.params }));

export const withNewId = path => withProps(p => ({ newId: reduce(max, 0, (view(path, p) || []).map(x => +x.id)) + 1 }));

export const toTitleCase = s => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());

export const toDate = s => {
  const d = new Date(s);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

export const toMonth = s => {
  const d = new Date(s);
  return `${d.getFullYear()}/${d.getMonth() + 1}`;
}

export const addIndex = p => a => a.map((x, i) => ({ [p || 'id']: i + 1, ...x }));

export const replaceParam = (s, ps) => reduce((p, c) => p.replace(new RegExp(`\{${c}\}`), ps[c]), s, Object.keys(ps));

export const isPrimitiveType = anyPass([is(Number), is(String), is(Boolean)]);

export const diff = p => differenceWith((a, b) => isPrimitiveType(a) ? a === b : a[p || 'id'] === b[p || 'id']);

const rdiff = [[3,0],[5,-2],[8,-5],[10,-7],[13,-9],[15,-11],[18,-14],[20,-16],[25,-21],[30,-26],[35,-31],[40,-36],[45,-41],[50,-45],[55,-50]];
const rdelta = [401,301,201,151,101,51,26,-24,-49,-99,-149,-199,-299,-399];

export const rateDiff = (r1, r2) => {
  const n = rdelta.findIndex(x => x <= r1 - r2);
  return n === -1 ? R.last(rdiff) : rdiff[n];
}

export const adjustRating = g => {
  if (g.isDouble) {
      return g;
  } else {
    const p1Win = g.result[0] === '3';
    const d = p1Win ? rateDiff(g.p1Rating, g.p2Rating) : rateDiff(g.p2Rating, g.p1Rating);
    return {...g, p1Diff: p1Win ? d[0] : d[1], p2Diff: p1Win ? d[1] : d[0]};
  }
}
