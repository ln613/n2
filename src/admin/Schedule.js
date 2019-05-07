import React from 'react';
import { compose } from 'recompose';
import { range, pick, find, isNil } from 'ramda';
import { connect } from '@ln613/state';
import { Button } from 'semantic-ui-react';
import actions from 'utils/actions';
import { scheduleSelector } from 'utils/selectors';
import { TextBox, Table } from '@ln613/ui/semantic';
import { Select } from '@ln613/ui';
import { withLoad, withEdit, withParams, withMount } from '@ln613/compose';
import { withRouter } from "react-router-dom";
import { resultOptions } from 'utils';
import { withSuccess } from 'utils/ui';
import { tap } from '@ln613/util';
import { kos } from 'utils';

const single = ms =>
  <Table name="schedule" data={(ms || []).map(pick(['id', 'player1', 'result', 'player2']))}>
    <td key="result" path="schedule.matches[{i}].result" select options={resultOptions}/>
  </Table>;

const teams = (tournament, schedule, history) =>
  range(0, 8).map(n =>
    <div class="f aic">
      <div class="pr8">Table {n + 1}: </div>
      <Select name={`schedule.matches[${n}].home`} options={tournament.teams} placeholder="" />
      <div class="ph8">VS</div>
      <Select name={`schedule.matches[${n}].away`} options={tournament.teams} placeholder="" />
      <div class="ph8"></div>
      <Button primary disabled={!schedule.matches || !schedule.matches[n] || !schedule.matches[n].home} onClick={() => history.push(`/admin/games/${tournament.id}/${schedule.id}/${n + 1}`)}>Matches</Button>
    </div>
  );

const groups = (ms, tid, sid) =>
  <Table name="groups" link={x => `/admin/games/${tid}/${sid}/${x.id}`} data={(ms || []).map(pick(['id', 'round', 'team1', 'result', 'team2']))}>
    <td key="id" hidden />
  </Table>;

const Schedule = ({ tournament, schedule, history, putSchedule, postSchedule, id }) =>
  <div>
    <h1>Schedule - {tournament.name} - {tournament.isSingle ? ('Round ' + schedule.id) : schedule.date}</h1>
    <hr />
    <div class="pv8 fs24 darkgreen">
      {schedule.ko ? kos[Math.log2(schedule.ko)] : (schedule.group ? ('Group ' + schedule.group) : ('Id ' + schedule.id))}
    </div>
    <TextBox name="schedule.date" />
    {tournament.isSingle ?
      single(schedule.matches) :
      (tournament.groups ?
        groups(find(x => x.id == id, tournament.schedules).matches, tournament.id, id) :
        teams(tournament, schedule, history)
      )
    }
    <hr />
    <Button primary onClick={history.goBack}>Back</Button>
    {tournament.groups ? null : <Button primary onClick={() => id[0] === '+' ? postSchedule(schedule, { id1: tournament.id }) : putSchedule(schedule, { id1: tournament.id, id: schedule.id })}>Save</Button>}
  </div>

export default compose(
  connect(scheduleSelector, actions),
  withParams,
  withLoad('tournament', ['id', 'id1'], true),
  withMount(p => p.setForm({ matches: [], ...find(x => x.id == p.id, p.tournament.schedules) }, { path: 'schedule' })),
  withSuccess('schedule', () => alert('Saved'), () => alert('Error happened!')),
  withRouter
)(Schedule)
