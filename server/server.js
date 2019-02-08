const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const moment = require('moment');
const api = require('./api');
const { tap, isProd, done, send, config, cors, nocache, port, ip, mongoURL, secret, username, password, gotoLogin, rrSchedule, rrScheduleTeam, group, sortTeam, numOfGroups, gengames, serial } = require('./utils');
const { last, mergeDeepWith, zipWith, concat, is, find, findIndex, unnest, uniq, pipe, map, filter, length, sortBy, sortWith, descend, prop, ascend, isNil, groupBy, sum, range } = require('ramda');
const { getPropByProp, split2, getPropById } = require('@ln613/util');

const app = express();

if (!isProd)
  app.use(cors);

api.initdb(mongoURL);

app.use(express.static('client/packages/vttc/build'));
app.use(express.static('client/packages/admin/build'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  api.initdb(mongoURL);
  next();
});

// get --------------------

app.get('/api/ut', (req, res) => {
  //api.getById('tournaments', 86).then(x => rrScheduleTeam(x)).then(x => res.json(x));
  api.bak().then(r => res.json(pipe(
    map(x => x.games),
    unnest,
    filter(x => x && x.result.indexOf('3') === -1 && ((+x.result[0] > +x.result[2] && x.p1Diff <= 0) || ((+x.result[0] < +x.result[2] && x.p1Diff > 0)))),
    sortBy(x => x.date),
    map(x => [x.id, x.date]),
    //map(x => [x.p1, x.p2]),
    //unnest,
    //uniq,
    //length,
    //map(x => getPropById('firstName')(x)(r.players) + ' ' + getPropById('lastName')(x)(r.players))
  )(r.tournaments)));
  //api.bak().then(r => res.json(r.players.length));
});

app.get('/api/ut1', (req, res) => {
  api.bak().then(r => {
    const games = pipe(map(x => x.games), unnest)(r.tournaments);
    res.json(pipe(
      sortBy(x => +x.id),
      map(x => {
        const g0 = sortWith([ascend(x => new Date(x.date)), ascend(prop('id'))])(games.filter(g => g && (g.p1 === x.id || g.p2 === x.id)))[0];
        return [x.id, x.firstName + ' ' + x.lastName, g0 ? (g0.p1 === x.id ? g0.p1Rating : g0.p2Rating) : ''];
      }),
    )(r.players));
  });
});

app.get('/api/env', (req, res) => {
  res.send(process.env);
});

app.get('/api/lookup', (req, res) => {
  send(
    Promise.all([api.cdVersion(), api.get('cats')])
      .then(r => ({ cdVersion: r[0], cats: r[1] })),
    res
  );
});

app.get('/api/playergames/:id', (req, res) => {
  send(api.getPlayerGames(req.params.id), res);
});

app.get('/api/playerRating/:id/:date', (req, res) => {
  send(api.getPlayerRating(+req.params.id, req.params.date), res);
});

app.get('/api/idname/:doc', (req, res) => {
  send(api.getIdName(req.params.doc), res);
});

app.get('/api/:doc/:prop/:val/:fields', (req, res) => {
  const { doc, prop, val, fields } = req.params;
  send(api.search(doc, prop, val, fields), res);
});

app.get('/api/:doc/:id', (req, res) => {
  const { doc, id } = req.params;
  send(api.getById(doc, id), res);
});

app.get('/api/:doc', (req, res) => {
  send(api.get(req.params.doc), res);
});

// admin --------------------

app.copy('/admin/bak', (req, res) => {
  send(api.bak(), res);
});

app.get('/login', nocache, (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', (req, res) => {
  if (username != req.body.username || password != req.body.password) {
    gotoLogin(res);
  } else {
    const token = jwt.sign({}, secret, { expiresIn: '24h' });
    res.cookie('vttc_token', token);
    res.redirect('/admin');
  }
});

app.get('/logout', (req, res) => {
  gotoLogin(res);
});

app.use('/admin', (req, res, next) => {
  if (!isProd) {
    next();
  } else {
    const token = req.cookies.vttc_token;
    if (token) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          gotoLogin(res);
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      gotoLogin(res);
    }
  }  
});

app.copy('/admin/initdata', (req, res) => {
  done(api.initdata(), res);
});

app.copy('/admin/initacc', (req, res) => {
  done(api.initacc(), res);
});

app.post('/admin/fix', (req, res) => {
  done(api.fix(), res);
});

app.get('/admin/env', (req, res) => {
  res.send(Object.keys(process.env).map(k => k + ' - ' + process.env[k]).sort());
});

app.get('/admin/cd/list', (req, res) => {
  send(api.cdList(), res);
});

app.post('/admin/genrr', (req, res) => {
  const id = +req.body.id;
  const standing = req.body.standing;
  const koStanding = req.body.koStanding || [];

  api.getById('tournaments', id).then(t => {
    if (t.isSingle) {
      if (t.players && !t.schedules) {
        const s = rrSchedule(t.players, true);
        api.update('tournaments', {
          id,
          schedules: s.map((x, i) => ({ id: i + 1, matches: x, date: moment(t.startDate).add(i, 'week').toISOString() }))
        }).then(_ => res.json(s));
      } else {
        res.json('N/A');
      }
    } else {
      if (t.teams && t.teams.length > 0 && !isNil(t.teams[0].group)) {
        const groups = groupBy(x => x.group, t.teams);
        const hasKO = find(s => s.ko, t.schedules || []);
        const hasKOStanding = find(s => s.ko === koStanding.length, t.schedules || []);
        if (!t.schedules) {
          const schedules = Object.keys(groups).map(g => ({
            matches: pipe(l => rrSchedule(l, false, true), unnest, map(x => ({ ...x, games: gengames(t, x.home, x.away) })))(groups[g]),
            date: moment(t.startDate).toISOString(),
            group: g,
            id: +g
          }));
          api.update('tournaments', { id, schedules }).then(r => res.json(r));
        } else if ((standing && !hasKO) || hasKOStanding) {
          const matches = (hasKOStanding ?
            range(0, koStanding.length / 2).map((n, i) => ({ home: koStanding[n], away: koStanding[koStanding.length - n - 1], id: i + 1 })) :
            unnest(range(0, standing.length / 2).map((n, i) => [
              { home: standing[n][0].id, away: standing[standing.length - n - 1][1].id, id: i * 2 + 1 },
              { home: standing[n][1].id, away: standing[standing.length - n - 1][0].id, id: i * 2 + 2 }
            ]))
          ).map(x => ({ ...x, games: gengames(t, x.home, x.away) }));
          api.update('tournaments', { id, schedules: [...t.schedules, { date: t.startDate, ko: hasKOStanding ? koStanding.length / 2 : standing.length, matches, id: t.schedules.length + 1 }] }).then(r => res.json(r));
        } else {
          res.json('N/A');
        }
      } else if (!t.has2half && t.teams && t.schedules) {
        const sd = t.startDate2 || moment(last(t.schedules).date).add(1, 'week');
        const tt = split2(standing.map(x => find(y => y.name === x.team, t.teams)));
        const s1 = rrScheduleTeam(tt[0], sd, [5, 6, 7]);
        const s2 = rrScheduleTeam(tt[1], sd, [1, 2, 3]);
        const s = zipWith(mergeDeepWith((a, b) => is(Array, a) ? concat(a, b) : a))(s1, s2);
        const lastId = last(t.schedules).id;
        api.update('tournaments', {
          id,
          startDate2: is(String, sd) ? sd : sd.toISOString(),
          has2half: true,
          teams: t.teams.map(x => ({...x, rank: find(y => y.team === x.name, standing).rank })),
          schedules: concat(t.schedules, s.map(x => ({ ...x, id: lastId + x.id, half: true })))
        }).then(_ => res.json(s));
      } else if (t.teams && !t.schedules) {
        const s = rrScheduleTeam(t.teams, t.startDate);
        api.update('tournaments', { id, schedules: s }).then(_ => res.json(s));
      } else {
        res.json('N/A');
      }
    }
  });
});

app.post('/admin/gengroup', (req, res) => {
  const id = +req.body.id;
  api.getById('tournaments', id).then(t => {
    if (!t.isSingle && t.teams && t.teams.length > 0 && isNil(t.teams[0].group) && isNil(t.games) && isNil(t.schedules)) {
      const teams = group(sortTeam(t.teams));
      api.update('tournaments', { id, teams }).then(r => res.json(r));
    } else {
      res.json('N/A');
    }
  });
});

app.post('/admin/nogame', (req, res) => {
  const id = +req.body.id;
  const date = new Date(req.body.date + 'T08:00:00').toDateString();
  api.getById('tournaments', id).then(t => {
    if (t.schedules) {
      const n = findIndex(s => new Date(s.date).toDateString() === date, t.schedules);
      if (n === -1) {
        res.json('N/A');
      } else {
        const schedules = t.schedules.map((s, i) => i >= n ? {...s, date: moment(s.date).add(1, 'week').toISOString()} : s);
        api.update('tournaments', { id, schedules }).then(r => res.json(r));
      }
    } else {
      res.json('N/A');
    }
  });
});

app.get('/admin/count/:doc', (req, res) => {
  send(api.count(req.params.doc), res);
});

app.patch('/admin/result', (req, res) => {
  done(api.changeResult(req.body), res);
});

app.patch('/admin/updaterating', (req, res) => {
  done(api.updateRating(), res);
});

app.put('/admin/groupmatch/:id/:group', (req, res) => {
  const { id, group } = req.params;
  api.getById('tournaments', id).then(t => {
    if (t.schedules) {
      //const games = t.games.map(() => g.group);
      //const schedules = t.schedules.map((s, i) => s.group == group ? {...s, matches: s.matches.map(m => m.id == req.body.id ? req.body : m)} : s);
      //api.update('tournaments', { id: +id, schedules }).then(r => res.json(r));
      serial(req.body.games.filter(g => g.result && g.result !== '0:0'), g => api.addToList('tournaments', +id, 'games', g)).then(r => res.json(r));
    } else {
      res.json('N/A');
    }
  });
});

app.post('/admin/:doc/:id/:list', (req, res) => {
  const { doc, id, list } = req.params;
  send(api.addToList(doc, id, list, req.body), res);
});

app.put('/admin/:doc/:id/:list', (req, res) => {
  const { doc, id, list } = req.params;
  send(api.replaceList(doc, id, list, req.body), res);
});

app.post('/admin/:doc', (req, res) => {
  send(api.add(req.params.doc, req.body), res);
});

app.put('/admin/:doc', (req, res) => {
  send(api.replace(req.params.doc, req.body), res);
});

app.patch('/admin/:doc', (req, res) => {
  send(api.update(req.params.doc, req.body), res);
});

app.purge('/admin/:doc', (req, res) => {
  done(api.drop(req.params.doc), res);
});

// catch all --------------------

app.get('/admin', nocache, function (req, res) {
  res.sendFile(path.resolve(__dirname, '../client/packages/admin/build/index.html'))
});

app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../client/packages/vttc/build/index.html'))
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);
