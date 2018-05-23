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
  player: {
    url: _utils.admin + 'players',
    path: 'players[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  tournaments: {
    url: _utils.api + 'idname/tournaments'
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
    url: _utils.admin + 'teams',
    path: 'teams[id]',
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
    url: _utils.admin + 'schedules',
    path: 'schedules[id]',
    methods: ['post', 'put', 'patch', 'delete']
  },
  history: {
    url: _utils.api + 'playergames/{id}'
  },
  form: {
    path: 'form.{path}'
  },
  filter: {},
  lang: {}
};

exports.default = (0, _noRedux.generateActions)(actionData);