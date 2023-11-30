import React, { Fragment } from 'react'
import { compose, withProps } from 'recompose'
import { find, is, isNil } from 'ramda'
import { connect } from '@ln613/state'
import { Button } from 'semantic-ui-react'
import actions from 'utils/actions'
import { isEmpty } from 'utils'
import { tourSelector } from 'utils/selectors'
import { TextBox, CheckBox, withMobile } from '@ln613/ui/semantic'
import { withMount, withParams, withLoad, withLoadForce } from '@ln613/compose'
import { withRouter, Link } from 'react-router-dom'
import { withSuccess } from 'utils/ui'

const NUMBERS = ['', 'one', 'two', 'three', 'four', 'five', 'six']

const b1 = p => (
  <Fragment>
    {p.t.isSingle ? (
      <Link class="item" to={`/admin/singleplayers/${p.t.id}`}>
        Players
      </Link>
    ) : (
      <Link class="item" to={`/admin/teams/${p.t.id}`}>
        Teams
      </Link>
    )}
    {p.canDisplaySchedule ? (
      <Link class="item" to={`/admin/schedules/${p.t.id}`}>
        Schedules
      </Link>
    ) : null}
    {/* <Link class="item" to={`/admin/games/${tournament.id}`}>Games</Link> */}
    {p.canGenerateGroup ? (
      <Link
        class="item"
        onClick={() => !p.isLoading && p.postGengroup({ id: p.id })}
        to="#"
      >
        Generate Groups
      </Link>
    ) : null}
    {p.canGenerateSchedule ? (
      <Link
        class="item"
        onClick={() => !p.isLoading && p.postGenrr({ id: p.id })}
        to="#"
      >
        Generate Schedule
      </Link>
    ) : null}
    {p.canGenerateSchedule2 ? (
      <Link
        class="item"
        onClick={() =>
          !p.isLoading && p.postGenrr({ id: p.id, standing: p.standing })
        }
        to="#"
      >
        Generate Sch 2
      </Link>
    ) : null}
    {p.canGenerateKO ? (
      <Link
        class="item"
        onClick={() =>
          !p.isLoading &&
          p.postGenrr({ id: p.id, standing: p.standing, koStanding: p.ko })
        }
        to="#"
      >
        Generate KO
      </Link>
    ) : null}
  </Fragment>
)

const Tournament = p => (
  <div>
    <h1>Tournament - {+p.t.id ? p.t.name : 'Add New'}</h1>
    <hr />
    {+p.t.id ? (
      <div class={`ui ${NUMBERS[p.numOfButtons]} item menu`}>{b1(p)}</div>
    ) : null}
    <TextBox name="tournament.id" disabled />
    <TextBox name="tournament.name" fluid />
    <CheckBox name="tournament.isSingle" label="Is Non-Rated Single RR?" />
    <CheckBox name="tournament.isHidden" label="Is Hidden?" />
    <TextBox name="tournament.startDate" />
    <TextBox name="tournament.startDate2" />
    {/* <TextBox name="tournament.ratingDate" /> */}
    <hr />
    <Button primary onClick={p.history.goBack}>
      Back
    </Button>
    <Button
      primary
      onClick={() =>
        p.id[0] !== '+' ? p.patchTour(p.tournament) : p.postTour(p.tournament)
      }
      disabled={p.isLoading}
    >
      Save
    </Button>
  </div>
)

export default compose(
  connect(tourSelector, actions),
  withParams,
  withLoad('players'),
  withLoadForce('tournament'),
  withMount(p =>
    p.setForm(
      find(x => x.id == +p.id, p.tournaments || []) || {
        id: +p.id,
        name: '',
        startDate: '',
        startDate2: '',
        isSingle: false,
        ratingDate: '',
      },
      { path: 'tournament' }
    )
  ),
  withProps(({ standing, t }) => ({
    canDisplaySchedule: !isEmpty(t.schedules),
    canGenerateSchedule:
      !isEmpty(t.isSingle ? t.players : t.teams) && isEmpty(t.schedules),
    canGenerateSchedule2:
      !t.has2half &&
      !isEmpty(t.teams) &&
      isNil(t.teams[0].group) &&
      !isEmpty(t.schedules) &&
      !isEmpty(standing) &&
      standing.length > 2,
    canGenerateGroup:
      !t.isSingle &&
      !isEmpty(t.teams) &&
      isNil(t.teams[0].group) &&
      isEmpty(t.games) &&
      isEmpty(t.schedules),
    canGenerateKO:
      !isEmpty(t.teams) && !isNil(t.teams[0].group) && !isEmpty(t.schedules),
  })),
  withProps(p => ({
    numOfButtons:
      [
        p.canDisplaySchedule,
        p.canGenerateSchedule,
        p.canGenerateSchedule2,
        p.canGenerateGroup,
        p.canGenerateKO,
      ].filter(x => x === true).length + 1,
  })),
  withSuccess(
    ['tour', 'genrr', 'gengroup'],
    () => alert('Saved'),
    () => alert('Error happened!')
  ),
  withRouter,
  withMobile
)(Tournament)
