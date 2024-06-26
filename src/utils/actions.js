import { generateActions } from '@ln613/state'
import { isDev } from '.'

const aws = isDev ? 'http://localhost:9001/' : '/.netlify/functions/'
export const api = aws + 'api?'
export const admin = aws + 'admin?'

export const actionData = {
  auth: {
    url: aws + 'login',
    methods: ['post', 'patch'],
    after: x => {
      if (x.isAuthenticated) x.token && localStorage.setItem('token', x.token)
      else localStorage.removeItem('token')
      return { isAuthenticated: x.isAuthenticated }
    },
  },
  logout: {
    url: aws + 'logout',
    method: 'post',
    path: 'auth',
    after: x => {
      localStorage.removeItem('token')
      return x
    },
  },
  lookup: {
    url: api + 'lookup=1',
  },
  players: {
    url: api + 'doc=players',
  },
  playerRating: {
    url: api + 'player_rating=1&id={id}&rating_date={date}',
    path: 'form.{formPath}.players[id].rating',
  },
  tournamentRating: {
    url: api + 'player_rating=1&id={id}',
  },
  player: {
    url: admin + 'doc=players',
    path: 'players[id]',
    methods: ['post', 'put', 'patch', 'delete'],
  },
  tournaments: {
    url:
      api +
      'doc=tournaments&fields=isSingle,isGolden,isHidden,startDate,startDate2,ratingDate,players',
  },
  tour: {
    url: admin + 'doc=tournaments',
    path: 'tournaments[id]',
    methods: ['post', 'put', 'patch', 'delete'],
  },
  tournament: {
    url: api + 'doc=tournaments&id={id}',
  },
  team: {
    url: admin + 'doc=tournaments&id={id1}&list=teams',
    path: 'tournament.teams[id]',
    methods: ['post', 'put', 'patch', 'delete'],
  },
  cats: {
    url: api + 'doc=cats',
  },
  cat: {
    url: admin + 'doc=cats',
    path: 'cats[id]',
    methods: ['post', 'put', 'patch', 'delete'],
  },
  products: {
    url: api + 'doc=products',
  },
  product: {
    url: admin + 'doc=products',
    path: 'products[id]',
    methods: ['post', 'put', 'patch', 'delete'],
  },
  schedules: {
    url: api + 'schedules',
  },
  schedule: {
    url: admin + 'doc=tournaments&id={id1}&list=schedules',
    path: 'tournament.schedules[id]',
    methods: ['post', 'put', 'patch', 'delete'],
  },
  genrr: {
    url: admin + 'genrr=1',
    method: 'post',
  },
  gengroup: {
    url: admin + 'gengroup=1',
    method: 'post',
  },
  games: {
    url: api + 'games', // ?
  },
  game: {
    url: admin + 'doc=tournaments&id={id1}&list=games',
    path: 'tournament.games[id]',
    methods: ['post', 'put', 'patch', 'delete'],
  },
  groupMatch: {
    url: admin + 'groupmatch=1&id={id}&group={group}',
    methods: ['put'],
  },
  upDownGames: {
    url: admin + 'updowngames=1&id={id}',
    methods: ['put'],
  },
  result: {
    url: admin + 'result=1&id={id}',
    methods: ['post', 'patch'],
  },
  updateRating: {
    url: admin + 'updaterating=1',
    methods: ['patch'],
  },
  history: {
    url: api + 'player_games=1&id={id}',
  },
  newGameId: {
    url: api + 'newgameid=1',
  },
  form: {
    path: 'form.{path}',
  },
  formTeamPlayers: {
    path: 'form.team.players[]',
  },
  formTournamentPlayers: {
    path: 'form.tournament.players[]',
  },
  formGame: {
    path: 'form.game.{prop}',
  },
  filter: {},
  lang: {},
  isUpdating: {},
}

export default generateActions(actionData)
