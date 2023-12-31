import React from 'react'
import { withState, withMount } from '@ln613/compose'
import { range, sortBy } from 'ramda'
import { compose, withHandlers } from 'recompose'
import {
  Label,
  Button,
  Icon,
  Dropdown,
  Checkbox,
  Input,
} from 'semantic-ui-react'
import { admin } from 'utils/actions'
import { enlargeCanvas, combineImages } from 'utils/ui'
import { connect } from '@ln613/state'
import actions from 'utils/actions'
import { lookupSelector } from 'utils/selectors'

const W1 = 1500
const H1 = 500
const W2 = 666
const H2 = 500
const W1H1 = W1 + 'x' + H1
const W2H2 = W2 + 'x' + H2
const colors = [
  'black',
  'blue',
  'green',
  'pink',
  'white',
  'red',
  'yellow',
  'orange',
  'purple',
  'yellowgreen',
  'maroon',
  'olive',
  'darkgreen',
  'aqua',
  'deepskyblue',
  'gold',
  'greenyellow',
  'violet',
]

const Convert = ({
  file,
  selectFile,
  convert,
  combine,
  inProgress,
  combineInProgress,
  folder,
  setFolder,
  name,
  setName,
  resize,
  setResize,
  numOfImgs,
  setNumOfImgs,
  setIsEnlarge,
  setSize,
  setWeight,
  setColor,
  txt0,
  setTxt0,
  txt1,
  setTxt1,
  txt2,
  setTxt2,
}) => (
  <div>
    <div>
      <Label
        width="4"
        as="label"
        htmlFor="file"
        color="orange"
        size="large"
        className="cp"
      >
        <Icon name="file" />
        Select a file...
      </Label>
      <div>{(file || {}).name}</div>
      <input id="file" hidden type="file" onChange={selectFile} />
      <div className="mt8">
        Folder:{' '}
        <Dropdown
          selection
          options={range(1, 10)
            .map(x => ({
              text: `slider${x === 1 ? '' : '-' + x}`,
              value: `slider${x === 1 ? '' : '-' + x}`,
            }))
            .concat(['doc', 'tmp'].map(x => ({ text: x, value: x })))}
          defaultValue="slider"
          style={{ width: '100px' }}
          onChange={(e, x) => setFolder(x.value)}
        />
      </div>
      <div className="mt8">
        File:{' '}
        <Dropdown
          selection
          options={range(1, 10).map(x => ({ text: x, value: x }))}
          defaultValue={1}
          onChange={(e, x) => setName(x.value)}
        />
      </div>
      <div className="mt8">
        Resize:{' '}
        <Dropdown
          selection
          options={[W1H1, W2H2].map(x => ({ text: x, value: x }))}
          defaultValue={W1H1}
          onChange={(e, x) => setResize(x.value)}
        />
      </div>
      <div className="mt8">
        Add white border:{' '}
        <Checkbox
          style={{ paddingTop: '5px' }}
          onChange={(e, x) => setIsEnlarge(x.checked)}
        />{' '}
      </div>
      <div className="mt8">
        Font size:{' '}
        <Dropdown
          selection
          options={range(1, 13).map(x => ({ text: x * 6, value: x * 6 }))}
          defaultValue={24}
          onChange={(e, x) => setSize(x.value)}
        />
      </div>
      <div className="mt8">
        Font weight:{' '}
        <Dropdown
          selection
          options={range(1, 10).map(x => ({ text: x * 100, value: x * 100 }))}
          defaultValue={900}
          onChange={(e, x) => setWeight(x.value)}
        />
      </div>
      <div className="mt8">
        Font color:
        <Dropdown
          selection
          style={{ width: '150px' }}
          options={sortBy(c => c, colors).map(x => ({
            text: x,
            value: x,
            label: { color: x, empty: true, circular: true },
          }))}
          defaultValue={'black'}
          onChange={(e, x) => setColor(x.value)}
        />
      </div>
      <div className="mt8">
        Line 1: <Input value={txt0} onChange={(e, x) => setTxt0(x.value)} />
      </div>
      <div className="mt8">
        Line 2: <Input value={txt1} onChange={(e, x) => setTxt1(x.value)} />
      </div>
      <div className="mt8">
        Line 3: <Input value={txt2} onChange={(e, x) => setTxt2(x.value)} />
      </div>
    </div>
    <div className="mt8">
      <Button
        primary
        onClick={() => convert(file, folder, name, resize)}
        disabled={!file || inProgress}
      >
        Convert &amp; Upload
      </Button>
      {inProgress && <div className="ui active inline loader medium"></div>}
    </div>

    <hr />

    <h3>Combine Images: (from 'tmp' to 'slider')</h3>
    <div className="mt8">
      Number of images:{' '}
      <Dropdown
        selection
        options={range(1, 10).map(x => ({ text: x, value: x }))}
        defaultValue={1}
        onChange={(e, x) => setNumOfImgs(x.value)}
      />
    </div>
    <div className="mt8">
      File name:{' '}
      <Dropdown
        selection
        options={range(1, 10).map(x => ({ text: x, value: x }))}
        defaultValue={1}
        onChange={(e, x) => setName(x.value)}
      />
    </div>
    <div className="mt8">
      <Button
        primary
        onClick={() => combine(numOfImgs, name)}
        disabled={combineInProgress}
      >
        Combine &amp; Upload
      </Button>
      {combineInProgress && (
        <div className="ui active inline loader medium"></div>
      )}
    </div>
  </div>
)

export default compose(
  connect(lookupSelector, actions),
  withMount(p => p.getLookup()),
  withState('file'),
  withState('inProgress'),
  withState('combineInProgress'),
  withState('folder', 'slider'),
  withState('name', '1'),
  withState('numOfImgs', '1'),
  withState('resize', W1H1),
  withState('isEnlarge', false),
  withState('size', '24'),
  withState('weight', '900'),
  withState('color', 'black'),
  withState('txt0', ''),
  withState('txt1', ''),
  withState('txt2', ''),
  withHandlers({
    selectFile: p => () =>
      p.setFile(((document.getElementById('file') || {}).files || [])[0]),
    convert:
      ({ setInProgress, isEnlarge, size, weight, color, txt0, txt1, txt2 }) =>
      async (file, folder, name, resize) => {
        setInProgress(true)
        const fd = new FormData()
        fd.append('upload_preset', 'baicr6sd')
        fd.append('file', file)
        const c = await post(
          'https://api.cloudinary.com/v1_1/vttc/raw/upload',
          fd,
          true
        )

        if (file.name.slice(-5).toLowerCase() === '.docx') {
          const p = await post(
            'https://api.cloudconvert.com/v2/convert',
            { inputformat: 'docx', outputformat: 'png' },
            false,
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNmExMDU2NWJiNzVjODgyMjM5NWRhMjVhYTI0ODVhM2IyZDZiNDc3ODkyZjg3NmFiODQ0YzA5OWU2NWZhN2JiNGFiMGRkNWFhZjBjNGYzZDIiLCJpYXQiOjE2NTU1NDgzNjQuNDkxMzE2LCJuYmYiOjE2NTU1NDgzNjQuNDkxMzE3LCJleHAiOjQ4MTEyMjE5NjQuNDg2Nzg5LCJzdWIiOiIzNjkyMjQ0NCIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.aeitK5-rapbOT-WGMr9dkcyX2ECjEsExBvYFQbAZ0QEl5VukSTMsoW_ZN_Y9OSKOf_Oey37Gshg1MtvM3LrW1Tv-qstuu87GbFdoYPR5FwcVbBi0guQ0llNU3rKEctnsCmAqM01ls-XmroxwmH_k01RikmrXKf3LcXSqeuNzOaBGM7FMr-kMiqxMRYbIp2_xYKYwsI1w3ixjNP__RBI6zGA-XmrW6jXd-JvYvGeYG9_8SD8lo7A8tmSeXZZuehpccGTQZyhlWKRK4ryBJaIyZHx8JeUX1wbYtDK7VbkJl91ORqfCSI4AiKv6vslWS09PonEg4P_F3Du9kUSwRs4gKqf3M6BxJyvcC--'
          )
          const s = await post(p.url, {
            outputformat: 'png',
            input: 'download',
            file: c.url,
            wait: true,
            filename: '1.docx',
            converteroptions: { resize, resizemode: 'max', quality: 75 },
          })
          const url = 'https:' + s.output.url
          if (isEnlarge) {
            enlarge(url, resize, isEnlarge, {}, folder, name)
          } else {
            await post(
              admin + 'cdupload=1',
              { url, folder, name },
              false,
              localStorage.getItem('token')
            )
          }
          //await post('https://api.cloudinary.com/v1_1/vttc/image/upload', { upload_preset: 'baicr6sd', file: 'https:' + s.output.url });
        } else if (
          file.name.slice(-5).toLowerCase() === '.jpeg' ||
          file.name.slice(-4).toLowerCase() === '.jpg' ||
          file.name.slice(-4).toLowerCase() === '.png'
        ) {
          enlarge(
            c.url,
            resize,
            isEnlarge,
            { txts: [txt0, txt1, txt2].filter(x => x), size, weight, color },
            folder,
            name
          )
        }

        setInProgress(false)
      },
    combine:
      ({ setCombineInProgress, lookup }) =>
      async (numOfImgs, name) => {
        setCombineInProgress(true)
        const imgData = await combineImages(lookup, numOfImgs, W1, H1)
        await post(
          admin + 'cdupload=1',
          { url: imgData, folder: 'slider', name },
          false,
          localStorage.getItem('token')
        )
        setCombineInProgress(false)
      },
  })
)(Convert)

const post = (url, params, isUpload, key) =>
  fetch(url, {
    method: 'post',
    headers: {
      ...(key ? { Authorization: key } : {}),
      ...(isUpload ? {} : { 'Content-Type': 'application/json' }),
    },
    body: isUpload ? params : JSON.stringify(params),
  }).then(r => r.json())

const enlarge = async (url, resize, isEnlarge, option, folder, name) => {
  const [w, h] = resize.split('x')
  const imgData = await enlargeCanvas(url, w, h, isEnlarge, option)
  await post(
    admin + 'cdupload=1',
    { url: imgData, folder, name },
    false,
    localStorage.getItem('token')
  )
}
