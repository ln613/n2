import React, { Fragment } from 'react';
import { withMount, withState } from '@ln613/compose';
import { tap } from '@ln613/util';
import { compose, withHandlers } from 'recompose';
import { Label, Button, Icon } from 'semantic-ui-react';

const Convert = ({ file, selectFile, convert }) =>
  <div>
    <div>
      <Label width="4" as="label" htmlFor="file" color="orange" size="big" className="cp">
        <Icon name="file" />
        Select a file...
      </Label>
      <div>{(file || {}).name}</div>
      <input id="file" hidden type="file" onChange={selectFile} />
    </div>
    <div class="mt8">
      <Button primary onClick={() => convert(file)}>Convert &amp; Upload</Button>
    </div>
  </div>

export default compose(
  withState('file'),
  withHandlers(({
    selectFile: p => () => p.setFile(((document.getElementById('file') || {}).files || [])[0]),
    convert: () => async file => {
      const fd = new FormData();
      fd.append('upload_preset', 'baicr6sd');
      fd.append('file', file);
      const c = await post('https://api.cloudinary.com/v1_1/vttc/raw/upload', fd, true);
      const p = await post('https://api.cloudconvert.com/v1/process', { inputformat: 'docx', outputformat: 'png' }, false, true);
      const s = await post(p.url, { outputformat: 'png', input: 'download', file: c.url, wait: true });
      tap(s)
    }
  })),
)(Convert);

const post = (url, params, isUpload, withKey) => fetch(url, {
  method: 'post',
  headers: {
    ...(withKey ? { Authorization: 'Bearer eOgfamMWkKHQSkHwerVGWc6jvrWUrCC2SOh7J3oA8IrsYVkNuJoNyJI10fNbaBfZ' } : {}),
    ...(isUpload ? {} : { 'Content-Type': 'application/json' }),
  },
  body: isUpload ? params : JSON.stringify(params)
}).then(r => r.json());