import React, { Fragment } from 'react'
import { connect } from '@ln613/state'
import { compose, lifecycle } from 'recompose'
import { pick, isNil, sortWith, ascend, sort } from 'ramda'
import actions from 'utils/actions'
import { tournamentSelector } from 'utils/selectors'
import { kos, highlightWinner, getNameById } from 'utils'
import { withLoad, withParams } from '@ln613/compose'
import { Table, withMobile, Select } from '@ln613/ui/semantic'
import TMenu from './TMenu'

const Schedule = ({ tournament, id, isMobile }) => (
  <div class={`p16 ${isMobile ? 'fv' : 'f'}`}>
    <TMenu
      id={id}
      isSingle={tournament.isSingle}
      isMobile={isMobile}
      page="schedule"
    />
    <div class={`${isMobile ? '' : 'ph32'} fv`}>
      <h1>{tournament.name}</h1>
      <hr />
      <div class="f fg1 fixdd">
        {tournament.isSingle ? (
          <Select
            fluid
            name="player"
            options={sortWith([ascend(x => x.name)], tournament.players || [])}
            placeholder="All players"
            clearable
          ></Select>
        ) : (
          <Select
            fluid
            name="team"
            options={sortWith([ascend(x => x.name)], tournament.teams || [])}
            placeholder="All teams"
            clearable
          ></Select>
        )}
      </div>
      <hr />
      {/* {(id == 96) && <Fragment><i>*The schedule for the 2nd round will be generated after all 1st round matches are finished.</i><hr/></Fragment>} */}
      {sortWith([ascend(x => x.date)], tournament.schedules || [])
        .filter(s => s.matches && s.matches.length > 0)
        .map((s, i) => (
          <div class="pt8">
            <div class="pv8 fs24 darkgreen">
              {tournament.isSingle
                ? 'Round ' + (i + 1)
                : !isNil(s.group)
                ? 'Group ' + s.group
                : s.ko
                ? kos[Math.log2(s.ko)]
                : s.date}
            </div>
            <Table
              name="schedule"
              data={mapMatches(
                s.matches || [],
                tournament,
                !isNil(s.group),
                !isNil(s.ko)
              )}
              link={
                tournament.isSingle
                  ? null
                  : x =>
                      `/games/${tournament.id}/${s.id}/${
                        x.id || x.table || x.round
                      }`
              }
            />
            {/* <Table name="week" data={w.matches} equalWidth>
            <td key="team1Points" hidden />  
            <td key="team2Points" hidden />  
            <td key="winner" hidden />  
            <td key="loser" hidden />  
            <td key="result" center />  
          </Table> */}
          </div>
        ))}
    </div>
  </div>
)

export default compose(
  connect(tournamentSelector, actions),
  withParams,
  withLoad('players'),
  withLoad('tournament'),
  withMobile,
  lifecycle({
    componentWillUnmount: function () {
      this.props.setForm(null, { path: 'player' })
      this.props.setForm(null, { path: 'team' })
    },
  })
)(Schedule)

const mapMatches = (ms, t, isGroup, isKo) =>
  (t.isSingle
    ? ms.map(pick(['id', 'player1', 'result', 'player2']))
    : ms
        .filter(m => m && m.id)
        .map(m => ({
          [isGroup ? 'round' : 'table']: isGroup ? m.round : m.id,
          home: getNameById(m.home)(t.teams),
          result:
            m.result === '0:0'
              ? ''
              : (isGroup || isKo) && m.games.length === 1
              ? m.games[0].result
              : m.result,
          away: getNameById(m.away)(t.teams),
        }))
  ).map(highlightWinner)
