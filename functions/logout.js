import { res } from './utils';

export const handler = async event => { return res({ isAuthenticated: false }); }
