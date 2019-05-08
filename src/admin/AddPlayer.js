import React, { Fragment } from 'react';
import { Button } from 'semantic-ui-react';
import { TextBox, Select, CheckBox } from '@ln613/ui';
import { withMobile } from '@ln613/ui/semantic';

const btns = (p, i) =>
  <Fragment>
    <Button primary onClick={() => p.getPlayerRating({id: p.players[i].id, date: p.date || '_', formPath: p.formPath})}>Get Tournament Rating</Button>
    <Button primary onClick={() => p.getPlayerRating({id: p.players[i].id, date: '_', formPath: p.formPath})}>Get Current Rating</Button>
  </Fragment>

const AddPlayer = p =>
  <div>
    {(p.players || []).map((_, i) =>
      <Fragment>
        <div class="f aic mrc8" key={`players${i}`}>
          <Select name={`${p.formPath}.players[${i}].id`} index={i} options={p.allPlayers} placeholder="- Select a player -" />
          {p.withSub ? <CheckBox name={`${p.formPath}.players[${i}].isSub`} index={i} label="Is Substitute?" /> : null}
          <TextBox name={`${p.formPath}.players[${i}].rating`} index={i} label="Rating" />
          {p.isMobile ? null : btns(p, i)}
        </div>
        {p.isMobile ? btns(p, i) : null}
      </Fragment>
    )}
    {p.isMobile ? <div class="mt16" /> : null}
    <Button secondary onClick={() => p.setFormPlayers({})} disabled={p.isLoading}>Add Player</Button>
  </div>

export default withMobile(AddPlayer)