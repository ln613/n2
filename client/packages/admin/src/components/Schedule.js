import React from 'react';
import { compose } from 'recompose';
import { range, pick } from 'ramda';
import { connect } from '@ln613/state';
import { Button } from 'semantic-ui-react';
import actions from 'utils/actions';
import { scheduleSelector } from 'utils/selectors';
import { TextBox, Table } from '@ln613/ui/semantic';
import { Select } from '@ln613/ui';
import { withLoad, withEdit, withParams } from '@ln613/compose';
import { withRouter } from "react-router-dom";
import { withSuccess } from 'utils';

const results = ['3:0', '3:1', '3:2', '2:3', '1:3', '0:3'];

const Schedule = ({ tournament, schedule, history, putSchedule, postSchedule, id }) =>
  <div>
    <h1>Schedule - {tournament.name} - {tournament.isSingle ? ('Round ' + schedule.id) : schedule.date}</h1>
    <hr />
    <TextBox name="schedule.id" disabled />
    <TextBox name="schedule.date" />
    {tournament.isSingle ? 
      <Table name="schedule" data={(schedule.matches || []).map(pick(['id', 'player1', 'result', 'player2']))}>
        <td key="result" path="schedule.matches[{i}].result" select options={results}/>
      </Table> :
    range(0, 8).map(n =>
      <div class="f aic">
        <div class="pr8">Table {n + 1}: </div>
        <Select name={`schedule.matches[${n}].home`} options={tournament.teams} placeholder="" />
        <div class="ph8">VS</div>
        <Select name={`schedule.matches[${n}].away`} options={tournament.teams} placeholder="" />
        <div class="ph8"></div>
        <Button primary onClick={() => history.push(`/games/${tournament.id}/${schedule.id}/${n + 1}`)}>Matches</Button>
      </div>
    )}
    <hr />
    <Button primary onClick={() => id[0] === '+' ? postSchedule(schedule, { id1: tournament.id }) : putSchedule(schedule, { id1: tournament.id, id: schedule.id })}>Save</Button>
  </div>

export default compose(
  connect(scheduleSelector, actions),
  withParams,
  withLoad('tournament', ['id', 'id1'], true),
  withEdit('schedule', 'tournament.schedules', { matches: [] }),
  withSuccess('schedule', () => alert('Saved'), () => alert('Error happened!')),
  withRouter
)(Schedule)
