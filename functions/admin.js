import { is } from 'ramda'
import {
  connectDB,
  cdList,
  cdupload,
  initdata,
  backup,
  updateRating,
  genrr,
  gengroup,
  nogame,
  changePlayer,
  changeYears,
  addToList,
  add,
  replaceList,
  replace,
  update,
  count,
  groupmatch,
  upDownGames,
  resetTeams,
  giant,
  rr2single,
} from './utils/db'
import { res, trynull, authorize } from './utils'

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return res({})

  context.callbackWaitsForEmptyEventLoop = false

  const q = event.queryStringParameters
  const body = trynull(_ => JSON.parse(event.body))
  const method = event.httpMethod

  if (!(await authorize(event.headers.authorization)))
    return res({ isAuthenticated: false }, 401)

  await connectDB()
  let r = 'no action'

  if (method === 'COPY') {
    if (q.initdb) {
      await initdata()
      r = await updateRating()
    } else if (q.bak) {
      r = await backup()
    }
  } else if (method === 'POST') {
    if (q.cd) {
      r = await cdList()
    } else if (q.cdupload) {
      r = await cdupload(body)
    } else if (q.genrr) {
      r = await genrr(body)
    } else if (q.gengroup) {
      r = await gengroup(+body.id, +body.nog)
    } else if (q.nogame) {
      r = await nogame(body)
    } else if (q.reset) {
      r = await resetTeams(body)
    } else if (q.giant) {
      r = await giant(body)
    } else if (q.doc && q.id && q.list) {
      r = await addToList(q.doc, q.id, q.list, body)
    } else if (q.doc && q.count) {
      r = await count(q.doc)
    } else if (q.doc) {
      r = await add(q.doc, body)
    }
  } else if (method === 'PUT') {
    if (q.groupmatch) {
      r = await groupmatch(q.id, q.group, body)
    } else if (q.updowngames) {
      r = await upDownGames(q.id, body.games)
    } else if (q.doc && q.id && q.list) {
      r = await replaceList(q.doc, q.id, q.list, body)
    } else if (q.doc) {
      r = await replace(q.doc, body)
    }
  } else if (method === 'PATCH') {
    if (q.updaterating) {
      r = await updateRating(body)
    } else if (q.result) {
      await replaceList('tournaments', q.id, 'games', body)
      r = await updaterating()
    } else if (q.changeplayer) {
      r = await changePlayer(q.tid, q.p1, q.p2)
    } else if (q.changeyear) {
      r = await changeYears(q.tid, q.year)
    } else if (q.doc) {
      r = await update(q.doc, body)
    }
  } else if (method === 'PURGE') {
    if (q.doc) {
      r = await drop(q.doc)
    }
  }

  return res(r)
}
