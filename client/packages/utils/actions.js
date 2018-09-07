'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actionData = undefined;

var _state = require('@ln613/state');

var _util = require('@ln613/util');

var actionData = exports.actionData = {
  logout: {
    url: '/logout'
  },
  lookup: {
    url: _util.api + 'lookup'
  },
  players: {
    url: _util.api + 'players'
  },
  playerRating: {
    url: _util.api + 'playerRating/{id}/{date}',
    path: 'form.{formPath}.players[id].rating'
  },
  player: {
    url: _util.admin + 'players',
    path: 'players[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  tournaments: {
    url: _util.api + 'tournaments/_/_/isSingle,startDate,ratingDate,players'
  },
  tour: {
    url: _util.admin + 'tournaments',
    path: 'tournaments[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  tournament: {
    url: _util.api + 'tournaments/{id}'
  },
  team: {
    url: _util.admin + 'tournaments/{id1}/teams',
    path: 'tournament.teams[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  cats: {
    url: _util.api + 'cats'
  },
  cat: {
    url: _util.admin + 'cats',
    path: 'cats[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  products: {
    url: _util.api + 'products'
  },
  product: {
    url: _util.admin + 'products',
    path: 'products[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  schedules: {
    url: _util.api + 'schedules'
  },
  schedule: {
    url: _util.admin + 'tournaments/{id1}/schedules',
    path: 'tournament.schedules[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  genrr: {
    url: _util.admin + 'genrr/{id}',
    path: 'tournament.schedules'
  },
  games: {
    url: _util.api + 'games'
  },
  game: {
    url: _util.admin + 'tournaments/{id1}/games',
    path: 'tournament.games[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  result: {
    url: _util.admin + 'result',
    methods: ['post', 'patch']
  },
  history: {
    url: _util.api + 'playergames/{id}'
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
  lang: {}
};

exports.default = (0, _state.generateActions)(actionData);