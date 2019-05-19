const { is } = require('ramda');
const { connectDB, cdList, cdupload, initdata, backup, updateRating, genrr, gengroup, nogame, addToList, add, replaceList, replace, update, count } = require('./utils/db');
const { tap, res, trynull, authorize } = require('./utils');

module.exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS')
    return res({});

  context.callbackWaitsForEmptyEventLoop = false;

  if (!(await authorize(event.headers.authorization)))
    return res({ isAuthenticated: false }, 401);

  const q = event.queryStringParameters;
  const body = trynull(_ => JSON.parse(event.body));
  const method = event.httpMethod;
  await connectDB();
  let r = 'no action';

  if (method === 'COPY') {
    if (q.initdb) {
      await initdata();
      r = await updateRating();
    } else if (q.bak) {
      r = await backup();
    }
  } else if (method === 'POST') {
    if (q.cd) {
      r = await cdList();
    } else if (q.cdupload) {
      r = await cdupload(body);
    } else if (q.genrr) {
      r = await genrr(body);
    } else if (q.gengroup) {
      r = await gengroup(+body.id);
    } else if (q.nogame) {
      r = await nogame(body);
    } else if (q.doc && q.id && q.list) {
      r = await addToList(q.doc, q.id, q.list, body);
    } else if (q.doc && q.count) {
      r = await count(q.doc);
    } else if (q.doc) {
      r = await add(q.doc, body);
    }
  } else if (method === 'PUT') {
    if (q.groupmatch) {
      r = await groupmatch(q.id, q.group, body);
    } else if (q.doc && q.id && q.list) {
      r = await replaceList(q.doc, q.id, q.list, body);
    } else if (q.doc) {
      r = await replace(q.doc, body);
    }
  } else if (method === 'PATCH') {
    if (q.updaterating) {
      r = await updateRating();
    } else if (q.result) {
      await replaceList('tournaments', q.id, 'games', body);
      r = await updaterating();
    } else if (q.doc) {
      r = await update(q.doc, body);
    }
  } else if (method === 'PURGE') {
    if (q.doc) {
      r = await drop(q.doc);
    }
  }

  return res(r);
};
