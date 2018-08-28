import React from 'react';
import { compose, withProps } from 'recompose';
import { connect } from 'no-redux';
import moment from 'moment';
import { Button } from 'semantic-ui-react';
import actions from 'utils/actions';
import { tourSelector } from 'utils/selectors';
import { TextBox, Select, CheckBox } from 'utils/comps';
import { withLoad, withEditList, withSuccess, withParams } from 'utils';

export default ({ players, allPlayers, formPath, date, withSub, setFormPlayers, getPlayerRating, id }) =>
  <div>
    {(players || []).map((p, i) =>
      <div class="f aic mrc8" key={`players${i}`}>
        <Select name={`${formPath}.players[${i}].id`} index={i} options={allPlayers} />
        {withSub ? <CheckBox name={`${formPath}.players[${i}].isSub`} index={i} label="Is Substitute?" /> : null}
        <TextBox name={`${formPath}.players[${i}].rating`} index={i} label="Rating" />
        <Button primary onClick={() => getPlayerRating({id: players[i].id, date})}>Get Tournament Rating</Button>
        <Button primary onClick={() => getPlayerRating({id: players[i].id, date: '_'})}>Get Current Rating</Button>
      </div>
    )}
    <Button secondary onClick={() => setFormPlayers({})}>Add Player</Button>
  </div>
