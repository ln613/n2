'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.statsSelector = exports.gameSelector = exports.scheduleSelector = exports.teamSelector = exports.standingSelector = exports.historySelector = exports.tourSelector = exports.tournamentSelector = exports.tournamentsSelector = exports.playersSelector = exports.ratingSelector = exports.productsSelector = exports.catsSelector = exports.langSelector = exports.lookupSelector = exports.successSelector = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ramda = require('ramda');

var _state = require('@ln613/state');

var _ui = require('@ln613/ui');

var _util = require('@ln613/util');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
var isMobile = function isMobile(s) {
  return s.isMobile;
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
  return (0, _state.createSelector)(isLoading, lastAction, error, function (il, la, e) {
    return il || la.toLowerCase() !== 'set' + a ? null : !e;
  });
};

var sortedList = function sortedList(list, filter) {
  return (0, _state.createSelector)(list, filter, function (l, f) {
    var sort = f.sort;
    if (!sort || sort.length < 2) return l;

    var by = (0, _ramda.prop)(sort[0]);
    return (0, _ramda.sortWith)([sort[1] === 2 ? (0, _ramda.descend)(by) : (0, _ramda.ascend)(by)], l);
  });
};

var catsDD = (0, _state.createSelector)(cats, function (cs) {
  return cs.map(function (c) {
    return _extends({}, c, { text: c.name, value: c.id,
      subs: (c.subs || []).map(function (s) {
        return _extends({}, s, { text: s.name, value: s.id });
      }) });
  });
});

var productsWithCat = (0, _state.createSelector)(products, cats, function (ps, cs) {
  return ps.map(function (p) {
    var c = (0, _util.findById)(p.cat)(cs);
    return _extends({}, p, { cat_name: c && c.name, cat1_name: (0, _util.getNameById)(p.cat1)(c && c.subs) });
  });
});

var filteredProducts = (0, _state.createSelector)(productsWithCat, filter('product'), function (ps, f) {
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

var fullname = function fullname(p) {
  return p.firstName + ' ' + p.lastName;
};

var players = (0, _state.createSelector)(_players, function (ps) {
  return (0, _ramda.sortWith)([(0, _ramda.ascend)((0, _ramda.prop)('name'))])(ps.map(function (p) {
    return _extends({}, p, { name: fullname(p) });
  }));
});

var filteredPlayers = (0, _state.createSelector)(players, form('player'), function (ps, f) {
  return (0, _ramda.sortWith)([(0, _ramda.descend)((0, _ramda.prop)('rating'))])(ps.filter(function (p) {
    return (0, _ramda.isEmpty)(f) || p.name.toLowerCase().indexOf(f.toLowerCase()) > -1;
  }));
});

var dsPlayers = (0, _state.createSelector)(filteredPlayers, function (ps) {
  return ps.map(function (p) {
    return _extends({}, p, { text: p.name + ' (' + p.rating + ')' });
  });
});

var teams = (0, _state.createSelector)(_tournament, players, function (t, ps) {
  return (t.teams || []).map(function (x) {
    return _extends({}, x, { name: x.name || (0, _util.getNameById)(x.players[0].id)(ps) + " / " + (0, _util.getNameById)(x.players[1].id)(ps) });
  });
});

var pn = function pn(n, g) {
  return g['p' + n];
};
var tn = function tn(n, g) {
  return g['t' + (n > 2 ? n - 2 : n)];
};
var findGames = function findGames(s, m, gs) {
  return gs.filter(function (g) {
    return (0, _util.toAbsDate)(g.date) === (0, _util.toAbsDate)(s.date) && (g.t1 === m.home && g.t2 === m.away || g.t2 === m.home && g.t1 === m.away);
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
  return (0, _util.getNameById)(pn(n, g))(ps) + (g.isDouble ? ' / ' + (0, _util.getNameById)(pn(n + 2, g))(ps) : '');
};
var getPlayer = function getPlayer(pid, tid, ts) {
  return (0, _util.findById)(pid)(((0, _util.findById)(tid)(ts) || {}).players);
};
var subs = function subs(n, g, ts) {
  return (getPlayer(pn(n, g), tn(n, g), ts) || {}).isSub ? 1 : 0;
};
var totalSubs = function totalSubs(g, ts) {
  return subs(1, g, ts) + subs(3, g, ts) - subs(2, g, ts) - subs(4, g, ts);
};
var isWin = function isWin(g, ts) {
  var s = totalSubs(g, ts);
  return s === 0 ? g.result[0] > g.result[2] : s < 0;
};
var getSinglePlayer = function getSinglePlayer(id, ps) {
  var p = (0, _util.findById)(id)(ps);
  return p.rank + '. ' + p.name + ' (' + p.tRating + ')';
};
var tournament = (0, _state.createSelector)(_tournament, players, teams, function (t, ps, ts) {
  if (ps.length === 0) return t;
  var teams = (ts || []).map(function (m) {
    return _extends({}, m, { text: m.name, value: m.id,
      players: (0, _ramda.sortWith)([(0, _ramda.ascend)(function (x) {
        return x.isSub ? 1 : 0;
      }), (0, _ramda.descend)(function (x) {
        return x.tRating || x.rating;
      })], m.players.map(function (p) {
        return (0, _util.findById)(p.id)(ps);
      }).map(function (p) {
        return _extends({}, p, { rating: p.rating, tRating: (0, _util.findById)(p.id)(m.players).rating, isSub: p.isSub, name: fullname(p)
        });
      }))
    });
  });
  var groups = teams.length === 0 || (0, _ramda.isNil)(teams[0].group) ? null : (0, _ramda.toPairs)((0, _ramda.groupBy)(function (x) {
    return x.group;
  }, teams));
  var players = (0, _util.addIndex)('rank')((0, _ramda.sortWith)([(0, _ramda.descend)(function (x) {
    return x.tRating;
  })], (t.players || []).map(function (p) {
    return _extends({}, (0, _util.findById)(p.id)(ps), { tRating: p.rating });
  })));
  var games = (t.games || []).map(function (g) {
    var result = getResult(g);
    var team1 = (0, _util.getNameById)(g.t1)(teams);
    var team2 = (0, _util.getNameById)(g.t2)(teams);
    var game = _extends({}, g, { result: result, player1: getPlayerName(1, g, ps), player2: getPlayerName(2, g, ps), team1: team1, team2: team2 });
    game.isWin = isWin(game, teams);
    return game;
  });
  var schedules = (t.schedules || []).map(function (s) {
    return _extends({}, s, {
      date: s.date && (0, _util.toDate)(s.date),
      matches: t.isSingle ? s.matches.map(function (m) {
        return _extends({}, m, { player1: getSinglePlayer(m.home, players), player2: getSinglePlayer(m.away, players), result: m.result || '' });
      }) : (s.group || s.ko ? s.matches : (0, _ramda.range)(1, 9).map(function (n) {
        return (0, _util.findById)(n)(s.matches) || {};
      })).map(function (m) {
        var gs = findGames(s, m, games).filter(function (g) {
          return s.group ? s.group == g.group : s.ko ? s.ko == g.ko : true;
        });
        var wn = gs.filter(function (g) {
          return g.isWin && g.t1 === m.home || !g.isWin && g.t1 === m.away;
        }).length;
        var ln = gs.length - wn;
        var groupGames = (m.games || []).map(function (x) {
          return _extends({}, x, {
            team1: (0, _util.getNameById)(x.t1)(teams),
            team2: (0, _util.getNameById)(x.t2)(teams),
            player1: (0, _util.getNameById)(x.p1)(ps) + (x.p3 ? ' / ' + (0, _util.getNameById)(x.p3)(ps) : ''),
            player2: (0, _util.getNameById)(x.p2)(ps) + (x.p4 ? ' / ' + (0, _util.getNameById)(x.p4)(ps) : ''),
            p1Rating: (0, _util.getPropById)('rating')(x.p1)(ps),
            p2Rating: (0, _util.getPropById)('rating')(x.p2)(ps),
            isDouble: !!x.p3,
            result: ((0, _ramda.find)(function (g1) {
              return g1.t1 == x.t1 && g1.t2 == x.t2 && g1.p1 == x.p1 && g1.p2 == x.p2 && g1.p3 == x.p3 && g1.p4 == x.p4;
            }, gs) || {}).result
          });
        });
        return _extends({}, m, { team1: (0, _util.getNameById)(m.home)(teams), team2: (0, _util.getNameById)(m.away)(teams), result: wn + ':' + ln, games: groupGames });
      })
    });
  });
  return teams.length > 0 || players.length > 0 ? _extends({}, t, { teams: teams, groups: groups, players: players, schedules: schedules, games: games }) : t;
});

var tournamentsWithYears = (0, _state.createSelector)(tournaments, function (ts) {
  return (0, _ramda.sortWith)([(0, _ramda.descend)((0, _ramda.prop)('year')), (0, _ramda.ascend)((0, _ramda.prop)('name'))], ts.map(function (t) {
    return _extends({ year: +(0, _ramda.find)(function (x) {
        return !isNaN(+x);
      }, (0, _ramda.unnest)(t.name.split(' ').map(function (x) {
        return x.split('/');
      }))) }, t);
  }));
});

var games = (0, _state.createSelector)(_tournament, function (t) {
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

var gamesWithTeams = (0, _state.createSelector)(teams, players, games, function (ts, ps, gs) {
  return gs.map(function (g) {
    return _extends({}, g, {
      date: (0, _util.toDate)(g.date),
      player1: ((0, _util.findById)(g.p1)(ps) || {}).name,
      player2: ((0, _util.findById)(g.p2)(ps) || {}).name,
      team1: (0, _ramda.find)(function (x) {
        return (0, _util.findById)(g.p1)(x.players);
      }, ts),
      team2: (0, _ramda.find)(function (x) {
        return (0, _util.findById)(g.p2)(x.players);
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

var dp = function dp(s) {
  return (0, _ramda.descend)((0, _ramda.prop)(s ? 'gw' : 'points'));
};
var at = (0, _ramda.ascend)((0, _ramda.prop)('total'));
var dw = (0, _ramda.descend)((0, _ramda.prop)('w'));
var al = (0, _ramda.ascend)((0, _ramda.prop)('gl'));

var standing = (0, _state.createSelector)(tournament, teams, function (tt, ts) {
  var st = (tt.isSingle ? tt.players : ts).map(function (t) {
    var _s;

    var ms = (0, _ramda.unnest)((tt.schedules || []).filter(function (s) {
      return !s.ko;
    }).map(function (s) {
      return s.matches;
    })).filter(function (m) {
      return (m.home === t.id || m.away === t.id) && m.result && m.result != '0:0';
    });
    var ws = ms.filter(function (m) {
      return m.home === t.id && m.result[0] > m.result[2] || m.away === t.id && m.result[0] < m.result[2];
    });
    var wn = ws.length;
    var ln = ms.length - wn;
    var ps = (0, _ramda.sum)(ms.map(function (m) {
      return +m.result[m.home == t.id ? 0 : 2];
    }));
    var ps1 = (0, _ramda.sum)(ms.map(function (m) {
      return +m.result[m.home == t.id ? 2 : 0];
    }));
    var s = (_s = {}, _defineProperty(_s, tt.isSingle ? 'player' : 'team', t.name), _defineProperty(_s, 'id', t.id), _defineProperty(_s, 'total', ms.length), _defineProperty(_s, 'w', wn), _defineProperty(_s, 'l', ln), _defineProperty(_s, tt.isSingle ? 'gw' : 'points', ps), _defineProperty(_s, 'rank', t.rank), _defineProperty(_s, 'group', t.group), _s);
    if (tt.isSingle) s.gl = ps1;
    return s;
  });

  var p = (0, _ramda.pipe)((0, _ramda.sortWith)(tt.isSingle ? [dw, at, dp(1), al] : [dp(0), at, dw]), (0, _util.addIndex)('rank'));

  return tt.has2half ? (0, _ramda.pipe)((0, _ramda.sortBy)((0, _ramda.prop)('rank')), _util.split2, (0, _ramda.map)(p))(st) : tt.teams && tt.teams.length > 0 && !(0, _ramda.isNil)(tt.teams[0].group) ? (0, _ramda.pipe)((0, _ramda.groupBy)(function (t) {
    return t.group;
  }), _ramda.toPairs, (0, _ramda.map)(function (x) {
    return x[1];
  }), (0, _ramda.map)(p))(st) : p(st);
});

var ko = (0, _state.createSelector)(tournament, function (t) {
  var kos = (t.schedules || []).filter(function (s) {
    return s.ko;
  });
  if (kos.length === 0) return null;
  var ms = (0, _ramda.sortBy)(function (s) {
    return s.ko;
  }, kos)[0].matches;
  if (ms.length === 1 || ms.some(function (m) {
    return !m.result || m.result == '0:0';
  })) return null;
  return ms.map(function (m) {
    return m.result[0] > m.result[2] ? m.home : m.away;
  });
});

var isSamePlayer = function isSamePlayer(p1, id) {
  return p1 && id && p1.id === id || false;
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
var isPlayerLose = function isPlayerLose(p) {
  return function (g) {
    return isHomePlayer(p)(g) && !g.isWin || isAwayPlayer(p)(g) && g.isWin;
  };
};

var stats = (0, _state.createSelector)(tournament, function (t) {
  var teams = t.teams || [];

  var players = (0, _ramda.pipe)((0, _ramda.map)(function (x) {
    return x.players.map(function (p) {
      return _extends({}, p, { isUpperDiv: x.rank <= teams.length / 2 });
    });
  }), _ramda.unnest, (0, _ramda.filter)(function (x) {
    return !x.isSub;
  }), (0, _ramda.uniqBy)(function (x) {
    return x.id;
  }))(teams);

  var st = (0, _ramda.pipe)((0, _ramda.map)(function (p) {
    var gs = (t.games || []).filter(isPlayerInGame(p));
    var sgs = gs.filter(function (g) {
      return !g.isDouble;
    });
    var dgs = gs.filter(function (g) {
      return g.isDouble;
    });
    var total = sgs.length;
    var wins = sgs.filter(isPlayerWin(p));
    var loses = sgs.filter(isPlayerLose(p));
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
    var dloses = dgs.filter(isPlayerLose(p));
    var dw = dwins.length;
    var dl = dloses.length;
    return { player: p.name, 'mp': total, w: w, l: l, '+/-': d > 0 ? '+' + d : d, 'win %': wpc, gw: gw, gl: gl, dw: dw, dl: dl };
  }), (0, _ramda.sortWith)([(0, _ramda.descend)(function (x) {
    return +x['+/-'];
  }), (0, _ramda.descend)(function (x) {
    return +(0, _ramda.dropLast)(1, x['win %']);
  }), (0, _ramda.descend)(function (x) {
    return x.gw;
  })]), (0, _util.addIndex)('#'));

  if (t.has2half) {
    var p1 = players.filter(function (x) {
      return x.isUpperDiv;
    });
    var p2 = players.filter(function (x) {
      return !x.isUpperDiv;
    });
    return (0, _ramda.map)(st, [p1, p2]);
  }

  return st(players);
});

var history = (0, _state.createSelector)(_history, players, function (h, ps) {
  return (0, _ramda.sortWith)([(0, _ramda.descend)(function (x) {
    return new Date(x.date);
  }), (0, _ramda.descend)((0, _ramda.prop)('id'))], h.map(function (x) {
    var g = x.games;
    var player1 = (0, _util.getNameById)(g.p1)(ps) + ' (' + g.p1Rating + ' ' + ((g.p1Diff > 0 ? '+ ' : '- ') + Math.abs(g.p1Diff)) + ' = ' + Math.max(100, g.p1Rating + g.p1Diff) + ')';
    var player2 = (0, _util.getNameById)(g.p2)(ps) + ' (' + g.p2Rating + ' ' + ((g.p2Diff > 0 ? '+ ' : '- ') + Math.abs(g.p2Diff)) + ' = ' + Math.max(100, g.p2Rating + g.p2Diff) + ')';

    if (g.p1 === +x.pid) player1 = (0, _ui.Italic)(player1);else player2 = (0, _ui.Italic)(player2);

    if (+g.result[0] > +g.result[2]) player1 = (0, _ui.Bold)(player1);else player2 = (0, _ui.Bold)(player2);

    return {
      id: g.id,
      date: (0, _util.toDate)(g.date),
      tournament: x.name,
      month: (0, _util.toMonth)(g.date),
      player1: player1,
      result: g.result,
      player2: player2
    };
  }));
}
//groupWith((a, b) => a.month === b.month, gs).forEach(x => x[0].isLastGameInMonth = true);
);

var monthRatings = (0, _state.createSelector)(history, function (h) {
  return h.filter(function (x) {
    return x.isLastGameInMonth;
  }).map(function (x) {
    return { text: x.month, value: x.rating };
  });
});

var successSelector = exports.successSelector = function successSelector(a) {
  return (0, _state.mapStateWithSelectors)({ success: success(a) });
};
var lookupSelector = exports.lookupSelector = (0, _state.mapStateWithSelectors)({ lookup: lookup, lang: lang, isMobile: isMobile });
var langSelector = exports.langSelector = (0, _state.mapStateWithSelectors)({ lang: lang });
var catsSelector = exports.catsSelector = (0, _state.mapStateWithSelectors)({ cats: cats, cat: form('cat'), lang: lang });
var productsSelector = exports.productsSelector = (0, _state.mapStateWithSelectors)({ products: filteredProducts, productFilter: filter('product'), lookup: lookup, lang: lang, product: form('product'), cats: catsDD });
var ratingSelector = exports.ratingSelector = (0, _state.mapStateWithSelectors)({ players: filteredPlayers });
var playersSelector = exports.playersSelector = (0, _state.mapStateWithSelectors)({ players: players, lookup: lookup, player: form('player') });
var tournamentsSelector = exports.tournamentsSelector = (0, _state.mapStateWithSelectors)({ tournaments: tournamentsWithYears, lookup: lookup });
var tournamentSelector = exports.tournamentSelector = (0, _state.mapStateWithSelectors)({ tournament: tournament, lookup: lookup, players: players, formMatch: form('match') });
var tourSelector = exports.tourSelector = (0, _state.mapStateWithSelectors)({ tournament: form('tournament'), tournaments: tournaments, players: players, standing: standing, ko: ko });
var historySelector = exports.historySelector = (0, _state.mapStateWithSelectors)({ history: history, lookup: lookup, players: players });
var standingSelector = exports.standingSelector = (0, _state.mapStateWithSelectors)({ standing: standing, tournament: tournament, players: players });
var teamSelector = exports.teamSelector = (0, _state.mapStateWithSelectors)({ tournament: tournament, team: form('team'), players: players, monthRatings: monthRatings });
var scheduleSelector = exports.scheduleSelector = (0, _state.mapStateWithSelectors)({ tournament: tournament, schedule: form('schedule'), players: players });
var gameSelector = exports.gameSelector = (0, _state.mapStateWithSelectors)({ tournament: tournament, players: players, game: form('game') });
var statsSelector = exports.statsSelector = (0, _state.mapStateWithSelectors)({ tournament: tournament, stats: stats });