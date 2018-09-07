import React from 'react';
import { Button } from 'semantic-ui-react';
import { TextBox, Select, CheckBox } from '@ln613/ui/semantic';

export default ({ players, allPlayers, formPath, date, withSub, setFormPlayers, getPlayerRating, id }) =>
  <div>
    {(players || []).map((p, i) =>
      <div class="f aic mrc8" key={`players${i}`}>
        <Select name={`${formPath}.players[${i}].id`} index={i} options={allPlayers} />
        {withSub ? <CheckBox name={`${formPath}.players[${i}].isSub`} index={i} label="Is Substitute?" /> : null}
        <TextBox name={`${formPath}.players[${i}].rating`} index={i} label="Rating" />
        <Button primary onClick={() => getPlayerRating({id: players[i].id, date: date || '_', formPath})}>Get Tournament Rating</Button>
        <Button primary onClick={() => getPlayerRating({id: players[i].id, date: '_', formPath})}>Get Current Rating</Button>
      </div>
    )}
    <Button secondary onClick={() => setFormPlayers({})}>Add Player</Button>
  </div>
