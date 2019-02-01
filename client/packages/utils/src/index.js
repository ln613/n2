import { last } from 'ramda';
import { connect } from '@ln613/state';
import { compose } from 'recompose';
import { successSelector } from './selectors';
import { withNewValue } from '@ln613/compose';

export const cdurl = (l, c, n) => l.cdVersion ? `http://res.cloudinary.com/vttc/image/upload/v${l.cdVersion}/${c}/${n}.jpg` : '';

export const withSuccess = (a, f1, f2) => compose(
  connect(successSelector(a)),
  withNewValue('success', true, f1),
  withNewValue('success', false, f2),
);

const rdiff = [[3,0],[5,-2],[8,-5],[10,-7],[13,-9],[15,-11],[18,-14],[20,-16],[25,-21],[30,-26],[35,-31],[40,-36],[45,-41],[50,-45],[55,-50]];
const rdelta = [401,301,201,151,101,51,26,-24,-49,-99,-149,-199,-299,-399];

const rateDiff = (r1, r2) => {
  const n = rdelta.findIndex(x => x <= r1 - r2);
  return n === -1 ? last(rdiff) : rdiff[n];
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

export const newRating = (r, d) => Math.max(r + d, 100)

export const resultOptions = ['3:0', '3:1', '3:2', '2:3', '1:3', '0:3', '2:0', '2:1', '1:2', '0:2'];
