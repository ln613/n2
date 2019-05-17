import React from 'react';
import { withState } from '@ln613/compose';
import { tap } from '@ln613/util';
import { compose, withHandlers } from 'recompose';
import { Label, Button, Icon } from 'semantic-ui-react';
import { admin } from 'utils/actions';

const Convert = ({ file, selectFile, convert, inProgress }) =>
  <div>
    <div>
      <Label width="4" as="label" htmlFor="file" color="orange" size="large" className="cp">
        <Icon name="file" />
        Select a file...
      </Label>
      <div>{(file || {}).name}</div>
      <input id="file" hidden type="file" onChange={selectFile} />
    </div>
    <div class="mt8">
      <Button primary onClick={() => convert(file)} disabled={!file || inProgress}>Convert &amp; Upload</Button>
      {inProgress && <div class="ui active inline loader medium"></div>}
    </div>
    
  </div>

export default compose(
  withState('file'),
  withState('inProgress'),
  withHandlers(({
    selectFile: p => () => p.setFile(((document.getElementById('file') || {}).files || [])[0]),
    convert: ({ setInProgress }) => async file => {
      setInProgress(true);
      const fd = new FormData();
      fd.append('upload_preset', 'baicr6sd');
      fd.append('file', file);
      const c = await post('https://api.cloudinary.com/v1_1/vttc/raw/upload', fd, true);
      const p = await post('https://api.cloudconvert.com/v1/process', { inputformat: 'docx', outputformat: 'png' }, false, 'Bearer bpeNFC52jeIx3SkL6VHjhqjYamwGjvK8RCm5Gg2fAtqIKysMmjuhx6Hb2B6oHa3i');
      const s = await post(p.url, { outputformat: 'png', input: 'download', file: c.url, wait: true, filename: '1.docx', converteroptions: { resize: '1500x500', resizemode: 'scale', quality: 75 } });
      tap(await post(admin + 'cdupload=1', { url: 'https:' + s.output.url }, false, localStorage.getItem('token')));
      //await post('https://api.cloudinary.com/v1_1/vttc/image/upload', { upload_preset: 'baicr6sd', file: 'https:' + s.output.url });
      setInProgress(false);
    }
  })),
)(Convert);

const post = (url, params, isUpload, key) => fetch(url, {
  method: 'post',
  headers: {
    ...(key ? { Authorization: key } : {}),
    ...(isUpload ? {} : { 'Content-Type': 'application/json' }),
  },
  body: isUpload ? params : JSON.stringify(params)
}).then(r => r.json());