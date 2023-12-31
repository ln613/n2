import React, { Fragment } from 'react'
import { connect } from '@ln613/state'
import { compose, withProps, lifecycle } from 'recompose'
import actions from 'utils/actions'
import { historySelector } from 'utils/selectors'
import { findById } from 'utils'
import { withLoad, withParams, withLoadForce } from '@ln613/compose'
import { Table, withMobile, Select } from '@ln613/ui/semantic'

const History = ({
  lookup,
  history,
  player,
  oppoList,
  tourList,
  isMobile,
  tournamentRating,
}) => (
  <div className="p16 fv">
    <div className="f">
      <h1 className="fg1">
        History - {player.name} ({player.rating})
      </h1>
      {!isMobile && (
        <div className="f">
          <Select
            fluid
            name="oppo"
            options={oppoList}
            placeholder="All players"
            clearable
          ></Select>
          <div className="pr16" />
          <Select
            fluid
            name="tour"
            options={tourList}
            placeholder="All tournaments"
            clearable
          ></Select>
        </div>
      )}
    </div>
    <div className="ui divider"></div>
    {/* <div>Tournament Rating (lowest in previous month): {tournamentRating}</div> */}
    {isMobile && (
      <Fragment>
        <div className="f fg1 fixdd">
          <Select
            fluid
            name="oppo"
            options={oppoList}
            placeholder="All players"
            clearable
          ></Select>
        </div>
        <div className="f fg1 fixdd">
          <Select
            fluid
            name="tour"
            options={tourList}
            placeholder="All tournaments"
            clearable
          ></Select>
        </div>
      </Fragment>
    )}
    <Table name="history" data={history} isMobile={isMobile}>
      <td key="id" hidden />
      <td key="startTime" hidden />
      <td key="month" hidden />
      <td key="isLastGameInMonth" hidden />
      <td key="group" hidden />
      <td key="ko" hidden />
      <td key="round" hidden />
      <td key="p1" hidden />
      <td key="p2" hidden />
    </Table>
  </div>
)

export default compose(
  connect(historySelector, actions),
  withParams,
  withLoad('players'),
  withLoadForce('tournamentRating'),
  withLoadForce('history'),
  withProps(p => ({ player: findById(p.id)(p.players) || {} })),
  withMobile,
  lifecycle({
    componentWillUnmount: function () {
      this.props.setForm(null, { path: 'oppo' })
      this.props.setForm(null, { path: 'tour' })
    },
  })
)(History)
