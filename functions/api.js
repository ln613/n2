import fs from 'fs'
import {
  connectDB,
  get,
  getIdName,
  getById,
  search,
  getPlayerRating,
  getPlayerGames,
  cdVersion,
  getNewGameId,
  getDetail,
  update,
} from './utils/db'
import { res } from './utils'
import { updatePlayerSex } from '../src/bl/player'

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const {
    test,
    doc,
    id,
    fields,
    prop,
    val,
    idname,
    player_rating,
    rating_date,
    player_games,
    lookup,
    newgameid,
    folder,
    detail,
    push,
    pusherChannel,
    pusherEvent,
    pusherData,
  } = event.queryStringParameters
  await connectDB()
  let r = {}

  if (lookup) {
    const version = await cdVersion()
    const cats = await get('cats')
    r = { cats, cdVersion: version }
  } else if (newgameid) {
    r = await getNewGameId()
  } else if (idname) {
    r = await getIdName(doc)
  } else if (id && doc) {
    r = await getById(doc, id)
  } else if (fields || prop) {
    r = await search(doc, prop, val, fields)
  } else if (player_rating) {
    r = await getPlayerRating(id, rating_date)
  } else if (player_games) {
    r = await getPlayerGames(id)
  } else if (detail) {
    r = await getDetail(id)
  } else if (doc) {
    r = await get(doc)
  } else if (folder) {
    //r = fs.readdirSync(process.cwd());
    r = fs.writeFileSync(process.cwd() + '/tmp/1.txt', 'abc')
  } else if (test) {
    const p1 = await getById('players', 642)
    updatePlayerSex(p1)
    update('players', p1)
    r = p1
  }

  return res(r)
}
