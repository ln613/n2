import React from 'react';
import { compose } from 'recompose';
import { range } from 'ramda';
import { connect } from 'no-redux';
import { Button } from 'semantic-ui-react';
import actions from 'utils/actions';
import { scheduleSelector } from 'utils/selectors';
import { TextBox, Select, Table } from 'utils/comps';
import { withLoad, withEdit, withSuccess, withParams, tap } from 'utils';
import { withRouter } from "react-router-dom";

const Schedule = ({ tournament, schedule, history, putSchedule, postSchedule, id }) =>
  <div>
    <h1>Schedule - {tournament.name} - {tournament.isSingle ? ('Round ' + schedule.id) : schedule.date}</h1>
    <hr />
    <TextBox name="schedule.id" disabled />
    <TextBox name="schedule.date" />
    {tournament.isSingle ? 
      <Table name="schedule" data={schedule.matches}>
        <td key="result" input/>
        {/* name={`schedule.matches[${i}].result`} noLabel style={{width: '50px'}} */}
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
