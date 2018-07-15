'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.statsSelector = exports.gameSelector = exports.scheduleSelector = exports.teamSelector = exports.standingSelector = exports.historySelector = exports.tourSelector = exports.tournamentSelector = exports.tournamentsSelector = exports.playersSelector = exports.ratingSelector = exports.productsSelector = exports.catsSelector = exports.langSelector = exports.lookupSelector = exports.successSelector = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ramda = require('ramda');

var _noRedux = require('no-redux');

var _ = require('.');

var _form = function _form(s) {
  return s.form || {};
};
var _filter = function _filter(s) {
  return s.filter || {};
};

var form = function form(p) {
  return function (s) {
    return _form(s)[p] || {};
  };
};
var filter = function filter(p) {
  return function (s) {
    return _filter(s)[p] || {};
  };
};

var isLoading = function isLoading(s) {
  return s.isLoading;
};
var lastAction = function lastAction(s) {
  return s.lastAction || '';
};
var error = function error(s) {
  return s.error;
};
var lookup = function lookup(s) {
  return s.lookup || {};
};
var lang = function lang(s) {
  return s.lang || {};
};
var cats = function cats(s) {
  return s.cats || [];
};
var products = function products(s) {
  return s.products || [];
};
var _players = function _players(s) {
  return s.players || [];
};
var tournaments = function tournaments(s) {
  return s.tournaments || [];
};
var _tournament = function _tournament(s) {
  return s.tournament || {};
};
var _history = function _history(s) {
  return s.history || [];
};

var success = function success(a) {
  return (0, _noRedux.createSelector)(isLoading, lastAction, error, function (il, la, e) {
    return il || la.toLowerCase() !== 'set' + a ? null : !e;
  });
};

var sortedList = function sortedList(list, filter) {
  return (0, _noRedux.createSelector)(list, filter, function (l, f) {
    var sort = f.sort;
    if (!sort || sort.length < 2) return l;

    var by = (0, _ramda.prop)(sort[0]);
    return (0, _ramda.sortWith)([sort[1] === 2 ? (0, _ramda.descend)(by) : (0, _ramda.ascend)(by)], l);
  });
};

var catsDD = (0, _noRedux.createSelector)(cats, function (cs) {
  return cs.map(function (c) {
    return _extends({}, c, { text: c.name, value: c.id,
      subs: (c.subs || []).map(function (s) {
        return _extends({}, s, { text: s.name, value: s.id });
      }) });
  });
});

var productsWithCat = (0, _noRedux.createSelector)(products, cats, function (ps, cs) {
  return ps.map(function (p) {
    var c = (0, _.findById)(p.cat)(cs);
    return _extends({}, p, { cat_name: c && c.name, cat1_name: (0, _.getNameById)(p.cat1)(c && c.subs) });
  });
});

var filteredProducts = (0, _noRedux.createSelector)(productsWithCat, filter('product'), function (ps, f) {
  return (0, _ramda.reduce)(function (p, c) {
    return p.filter(c);
  }, ps, Object.keys(f).map(function (k) {
    if (k === 'cat') {
      if (f[k] === 1) return function (p) {
        return p;
      };
      if (f[k] === 2) return function (p) {
        return p.sale;
      };
    }
    return function (p) {
      return p[k] === f[k];
    };
  }));
});

var players = (0, _noRedux.createSelector)(_players, function (ps) {
  return (0, _ramda.sortWith)([(0, _ramda.ascend)((0, _ramda.prop)('name'))])(ps.map(function (p) {
    return _extends({}, p, { name: p.firstName + ' ' + p.lastName });
  }));
});

var filteredPlayers = (0, _noRedux.createSelector)(players, form('player'), function (ps, f) {
  return (0, _ramda.sortWith)([(0, _ramda.descend)((0, _ramda.prop)('rating'))])(ps.filter(function (p) {
    return (0, _ramda.isEmpty)(f) || p.name.toLowerCase().indexOf(f) > -1;
  }));
});

var dsPlayers = (0, _noRedux.createSelector)(filteredPlayers, function (ps) {
  return ps.map(function (p) {
    return _extends({}, p, { text: p.name + ' (' + p.rating + ')' });
  });
});

var teams = (0, _noRedux.createSelector)(_tournament, function (t) {
  return t.teams || [];
});

var pn = function pn(n, g) {
  return g['p' + n];
};
var findGames = function findGames(s, m, gs) {
  return gs.filter(function (g) {
    return g.t1 === m.home && g.t2 === m.away || g.t2 === m.home && g.t1 === m.away;
  });
};
var gg = function gg(g, x) {
  return +(g && g[x] || 0);
};
var getResult = function getResult(g) {
  return g.result || (0, _ramda.range)(0, 5).filter(function (n) {
    return gg(g.g1, n) > gg(g.g2, n);
  }).length + ':' + (0, _ramda.range)(0, 5).filter(function (n) {
    return gg(g.g1, n) < gg(g.g2, n);
  }).length;
};
var getPlayerName = function getPlayerName(n, g, ps) {
  return (0, _.getNameById)(pn(n, g))(ps) + (g.isDouble ? ' / ' + (0, _.getNameById)(pn(n + 2, g))(ps) : '');
};
var getPlayer = function getPlayer(pid, tid, ts) {
  return (0, _.findById)(pid)((0, _.findById)(tid)(ts).players);
};
var subs = function subs(n, g) {
  return (pn(n, g) || {}).isSub ? 1 : 0;
};
var totalSubs = function totalSubs(g) {
  return subs(1, g) + subs(3, g) - subs(2, g) - subs(4, g);
};
var isWin = function isWin(g) {
  var s = totalSubs(g);
  return s === 0 ? g.result[0] > g.result[2] : s < 0;
};
var getSinglePlayer = function getSinglePlayer(id, ps) {
  var p = (0, _.findById)(id)(ps);
  return p.name + ' (' + p.tRating + ')';
};
var tournament = (0, _noRedux.createSelector)(_tournament, players, function (t, ps) {
  if (ps.length === 0) return t;
  var teams = (t.teams || []).map(function (t) {
    return _extends({}, t, { text: t.name, value: t.id, players: (0, _ramda.sortWith)([(0, _ramda.ascend)(function (x) {
        return x.isSub ? 1 : 0;
      }), (0, _ramda.descend)(function (x) {
        return x.tRating;
      })], t.players.map(function (p) {
        return _extends({}, (0, _.findById)(p.id)(ps), { tRating: p.rating, isSub: p.isSub });
      })) });
  });
  var players = (0, _ramda.sortWith)([(0, _ramda.descend)(function (x) {
    return x.tRating;
  })], (t.players || []).map(function (p) {
    return _extends({}, (0, _.findById)(p.id)(ps), { tRating: p.rating });
  }));
  var games = (t.games || []).map(function (g) {
    var result = getResult(g);
    var team1 = (0, _.getNameById)(g.t1)(teams);
    var team2 = (0, _.getNameById)(g.t2)(teams);
    var game = _extends({}, g, { result: result, player1: getPlayerName(1, g, ps), player2: getPlayerName(2, g, ps), team1: team1, team2: team2 });
    game.isWin = isWin(game);
    return game;
  });
  var schedules = (t.schedules || []).map(function (s) {
    return _extends({}, s, {
      date: (0, _.toDate)(s.date),
      matches: t.isSingle ? s.matches.map(function (m) {
        return { '#': m.id, home: getSinglePlayer(m.home, players), result: m.result, away: getSinglePlayer(m.away, players) };
      }) : (0, _ramda.range)(1, 9).map(function (n) {
        return (0, _.findById)(n)(s.matches) || {};
      }).map(function (m) {
        var gs = findGames(s, m, games);
        var wn = gs.filter(function (g) {
          return g.isWin && g.t1 === m.home || !g.isWin && g.t1 === m.away;
        }).length;
        var ln = gs.length - wn;
        return _extends({}, m, { result: wn + ':' + ln });
      })
    });
  });
  return teams.length > 0 || players.length > 0 ? _extends({}, t, { teams: teams, players: players, schedules: schedules, games: games }) : t;
});

var tournamentsWithYears = (0, _noRedux.createSelector)(tournaments, function (ts) {
  return (0, _ramda.sortWith)([(0, _ramda.descend)((0, _ramda.prop)('year')), (0, _ramda.ascend)((0, _ramda.prop)('name'))], ts.map(function (t) {
    return _extends({ year: +(0, _ramda.find)(function (x) {
        return !isNaN(+x);
      }, (0, _ramda.unnest)(t.name.split(' ').map(function (x) {
        return x.split('/');
      }))) }, t);
  }));
});

var games = (0, _noRedux.createSelector)(_tournament, function (t) {
  return t.games || [];
});

var gameDetail = function gameDetail(n, g) {
  var r1 = +g.result.split(':')[n];
  var r2 = 5 - r1;
  var g1 = (0, _ramda.range)(0, r1).map(function (x) {
    return 11;
  });
  var g2 = (0, _ramda.range)(0, r2).map(function (x) {
    return 0;
  });
  return r1 > 2 ? g1.concat(g2) : g2.concat(g1);
};

var gamesWithTeams = (0, _noRedux.createSelector)(teams, players, games, function (ts, ps, gs) {
  return gs.map(function (g) {
    return _extends({}, g, {
      date: (0, _.toDate)(g.date),
      player1: ((0, _.findById)(g.p1)(ps) || {}).name,
      player2: ((0, _.findById)(g.p2)(ps) || {}).name,
      team1: (0, _ramda.find)(function (x) {
        return (0, _.findById)(g.p1)(x.players);
      }, ts),
      team2: (0, _ramda.find)(function (x) {
        return (0, _.findById)(g.p2)(x.players);
      }, ts),
      g1: g.g1 || gameDetail(0, g),
      g2: g.g2 || gameDetail(1, g)
    });
  }).map(function (g) {
    return _extends({}, g, { t1: (g.team1 || {}).id, t2: (g.team2 || {}).id, team1: (g.team1 || {}).name, team2: (g.team2 || {}).name });
  });
});

var redSpan = function redSpan(x) {
  return '<span class="red">' + x + '</span>';
};

var getPoints = function getPoints(m, t, v) {
  return m[t] === v ? m[t + 'Points'] : 0;
};

var standing = (0, _noRedux.createSelector)(tournament, teams, function (tt, ts) {
  return (0, _ramda.pipe)((0, _ramda.sortWith)([(0, _ramda.descend)((0, _ramda.prop)('points')), (0, _ramda.ascend)((0, _ramda.prop)('total')), (0, _ramda.descend)((0, _ramda.prop)('w'))]), (0, _.addIndex)('rank'))(ts.map(function (t) {
    var ms = (0, _ramda.unnest)(tt.schedules.map(function (s) {
      return s.matches;
    })).filter(function (m) {
      return (m.home == t.id || m.away == t.id) && m.result != '0:0';
    });
    var ws = ms.filter(function (m) {
      return m.home == t.id && m.result[0] > m.result[2] || m.away == t.id && m.result[0] < m.result[2];
    });
    var wn = ws.length;
    var ln = ms.length - wn;
    var ps = (0, _ramda.sum)(ms.map(function (m) {
      return +m.result[m.home == t.id ? 0 : 2];
    }));
    return { team: t.name, total: ms.length, w: wn, l: ln, points: ps };
  }));
});

var isSamePlayer = function isSamePlayer(p1, p2) {
  return p1 && p2 && p1.id === p2.id || false;
};
var isHomePlayer = function isHomePlayer(p) {
  return function (g) {
    return isSamePlayer(p, g.p1) || isSamePlayer(p, g.p3);
  };
};
var isAwayPlayer = function isAwayPlayer(p) {
  return function (g) {
    return isSamePlayer(p, g.p2) || isSamePlayer(p, g.p4);
  };
};
var isPlayerInGame = function isPlayerInGame(p) {
  return (0, _ramda.anyPass)([isHomePlayer(p), isAwayPlayer(p)]);
};
var isPlayerWin = function isPlayerWin(p) {
  return function (g) {
    return isHomePlayer(p)(g) && g.isWin || isAwayPlayer(p)(g) && !g.isWin;
  };
};

var stats = (0, _noRedux.createSelector)(tournament, function (t) {
  return (0, _ramda.pipe)((0, _ramda.map)(function (x) {
    return x.players;
  }), _ramda.unnest, (0, _ramda.uniqBy)(function (x) {
    return x.id;
  }), function (ps) {
    return ps.map(function (p) {
      var gs = (t.games || []).filter(isPlayerInGame(p));
      var sgs = gs.filter(function (g) {
        return !g.isDouble;
      });
      var dgs = gs.filter(function (g) {
        return g.isDouble;
      });
      var total = sgs.length;
      var wins = sgs.filter(isPlayerWin(p));
      var loses = (0, _.diff)()(sgs, wins);
      var gw = (0, _ramda.sum)(sgs.map(function (g) {
        return +g.result[isHomePlayer(p)(g) ? 0 : 2];
      }));
      var gl = (0, _ramda.sum)(sgs.map(function (g) {
        return +g.result[isHomePlayer(p)(g) ? 2 : 0];
      }));
      var w = wins.length;
      var l = loses.length;
      var d = w - l;
      var wpc = ((total && w / total) * 100).toFixed(1) + '%';
      var dwins = dgs.filter(isPlayerWin(p));
      var dloses = (0, _.diff)()(dgs, dwins);
      var dw = dwins.length;
      var dl = dloses.length;
      return { player: p.name, 'mp': total, w: w, l: l, '+/-': d > 0 ? '+' + d : d, 'win %': wpc, gw: gw, gl: gl, dw: dw, dl: dl };
    });
  }, (0, _ramda.sortWith)([(0, _ramda.descend)((0, _ramda.prop)('+/-')), (0, _ramda.descend)((0, _ramda.prop)('win %'))]), (0, _.addIndex)('rank'))(t.teams || []);
});

var history = (0, _noRedux.createSelector)(_history, players, function (h, ps) {
  return (0, _ramda.sortWith)([(0, _ramda.descend)(function (x) {
    return new Date(x.date);
  }), (0, _ramda.descend)((0, _ramda.prop)('id'))], h.map(function (x) {
    var g = x.games;
    var player1 = (0, _.getNameById)(g.p1)(ps) + ' (' + g.p1Rating + ' ' + ((g.p1Diff > 0 ? '+ ' : '- ') + Math.abs(g.p1Diff)) + ' = ' + Math.max(100, g.p1Rating + g.p1Diff) + ')';
    var player2 = (0, _.getNameById)(g.p2)(ps) + ' (' + g.p2Rating + ' ' + ((g.p2Diff > 0 ? '+ ' : '- ') + Math.abs(g.p2Diff)) + ' = ' + Math.max(100, g.p2Rating + g.p2Diff) + ')';
    if (g.p1 === +x.pid) player1 = '<b>' + player1 + '</b>';else player2 = '<b>' + player2 + '</b>';

    return {
      id: g.id,
      date: (0, _.toDate)(g.date),
      tournament: x.name,
      month: (0, _.toMonth)(g.date),
      player1: player1,
      result: g.result,
      player2: player2
    };
  }));
}
//groupWith((a, b) => a.month === b.month, gs).forEach(x => x[0].isLastGameInMonth = true);
);

var monthRatings = (0, _noRedux.createSelector)(history, function (h) {
  return h.filter(function (x) {
    return x.isLastGameInMonth;
  }).map(function (x) {
    return { text: x.month, value: x.rating };
  });
});

var successSelector = exports.successSelector = function successSelector(a) {
  return (0, _noRedux.mapStateWithSelectors)({ success: success(a) });
};
var lookupSelector = exports.lookupSelector = (0, _noRedux.mapStateWithSelectors)({ lookup: lookup, lang: lang });
var langSelector = exports.langSelector = (0, _noRedux.mapStateWithSelectors)({ lang: lang });
var catsSelector = exports.catsSelector = (0, _noRedux.mapStateWithSelectors)({ cats: cats, cat: form('cat'), lang: lang });
var productsSelector = exports.productsSelector = (0, _noRedux.mapStateWithSelectors)({ products: filteredProducts, productFilter: filter('product'), lookup: lookup, lang: lang, product: form('product'), cats: catsDD });
var ratingSelector = exports.ratingSelector = (0, _noRedux.mapStateWithSelectors)({ players: filteredPlayers });
var playersSelector = exports.playersSelector = (0, _noRedux.mapStateWithSelectors)({ players: players, lookup: lookup, player: form('player') });
var tournamentsSelector = exports.tournamentsSelector = (0, _noRedux.mapStateWithSelectors)({ tournaments: tournamentsWithYears, lookup: lookup });
var tournamentSelector = exports.tournamentSelector = (0, _noRedux.mapStateWithSelectors)({ tournament: tournament, lookup: lookup, players: players });
var tourSelector = exports.tourSelector = (0, _noRedux.mapStateWithSelectors)({ tournament: form('tournament'), tournaments: tournaments, players: players });
var historySelector = exports.historySelector = (0, _noRedux.mapStateWithSelectors)({ history: history, lookup: lookup, players: players });
var standingSelector = exports.standingSelector = (0, _noRedux.mapStateWithSelectors)({ standing: standing, tournament: tournament });
var teamSelector = exports.teamSelector = (0, _noRedux.mapStateWithSelectors)({ tournament: tournament, team: form('team'), players: players, monthRatings: monthRatings });
var scheduleSelector = exports.scheduleSelector = (0, _noRedux.mapStateWithSelectors)({ tournament: tournament, schedule: form('schedule') });
var gameSelector = exports.gameSelector = (0, _noRedux.mapStateWithSelectors)({ tournament: tournament, players: players, game: form('game') });
var statsSelector = exports.statsSelector = (0, _noRedux.mapStateWithSelectors)({ tournament: tournament, stats: stats });