'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actionData = undefined;

var _noRedux = require('no-redux');

var _utils = require('utils');

var actionData = exports.actionData = {
  logout: {
    url: '/logout'
  },
  lookup: {
    url: _utils.api + 'lookup'
  },
  players: {
    url: _utils.api + 'players'
  },
  playerRating: {
    url: _utils.api + 'playerRating/{id}/{date}',
    path: 'form.tournament.players[id].rating'
  },
  player: {
    url: _utils.admin + 'players',
    path: 'players[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  tournaments: {
    url: _utils.api + 'tournaments/_/_/isSingle,startDate,ratingDate,players'
  },
  tour: {
    url: _utils.admin + 'tournaments',
    path: 'tournaments[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  tournament: {
    url: _utils.api + 'tournaments/{id}'
  },
  team: {
    url: _utils.admin + 'tournaments/{id1}/teams',
    path: 'tournament.teams[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  cats: {
    url: _utils.api + 'cats'
  },
  cat: {
    url: _utils.admin + 'cats',
    path: 'cats[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  products: {
    url: _utils.api + 'products'
  },
  product: {
    url: _utils.admin + 'products',
    path: 'products[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  schedules: {
    url: _utils.api + 'schedules'
  },
  schedule: {
    url: _utils.admin + 'tournaments/{id1}/schedules',
    path: 'tournament.schedules[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  genrr: {
    url: _utils.admin + 'genrr/{id}',
    path: 'tournament.schedules'
  },
  games: {
    url: _utils.api + 'games'
  },
  game: {
    url: _utils.admin + 'tournaments/{id1}/games',
    path: 'tournament.games[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  history: {
    url: _utils.api + 'playergames/{id}'
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
  filter: {},
  lang: {}
};

exports.default = (0, _noRedux.generateActions)(actionData);