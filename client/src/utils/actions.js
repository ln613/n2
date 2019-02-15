import { generateActions } from '@ln613/state';
import { api, admin } from '@ln613/util';

export const actionData = {
  logout: {
    url: '/logout'
  },
  lookup: {
    url: api + 'lookup'
  },
  players: {
    url: api + 'players'
  },
  playerRating: {
    url: api + 'playerRating/{id}/{date}',
    path: 'form.{formPath}.players[id].rating'
  },
  player: {
    url: admin + 'players',
    path: 'players[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  tournaments: {
    url: api + 'tournaments/_/_/isSingle,startDate,startDate2,ratingDate,players'
  },
  tour: {
    url: admin + 'tournaments',
    path: 'tournaments[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  tournament: {
    url: api + 'tournaments/{id}'
  },
  team: {
    url: admin + 'tournaments/{id1}/teams',
    path: 'tournament.teams[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  cats: {
    url: api + 'cats'
  },
  cat: {
    url: admin + 'cats',
    path: 'cats[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  products: {
    url: api + 'products'
  },
  product: {
    url: admin + 'products',
    path: 'products[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  schedules: {
    url: api + 'schedules'
  },
  schedule: {
    url: admin + 'tournaments/{id1}/schedules',
    path: 'tournament.schedules[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  genrr: {
    url: admin + 'genrr',
    method: 'post'
  },
  gengroup: {
    url: admin + 'gengroup',
    method: 'post'
  },
  games: {
    url: api + 'games'
  },
  game: {
    url: admin + 'tournaments/{id1}/games',
    path: 'tournament.games[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  groupMatch: {
    url: admin + 'groupmatch/{id}/{group}',
    methods: ['put']
  },
  result: {
    url: admin + 'result',
    methods: ['post', 'patch']
  },
  history: {
    url: api + 'playergames/{id}'
  },
  gameId: {
    url: api + 'gameid'
  },
  form: {
    path: 'form.{path}'
  },
  formTeamPlayers: {
    path: 'form.team.players[]'
  },
  formTournamentPlayers: {
    path: 'form.tournament.players[]'
  },
  formGame: {
    path: 'form.game.{prop}'
  },
  filter: {},
  lang: {},
}

export default generateActions(actionData);