import React from 'react'
import { connect } from '@ln613/state'
import { compose } from 'recompose'
import { isNil, range, sum } from 'ramda'
import { successSelector, authSelector } from './selectors'
import actions from './actions'
import { withNewValue, withMount } from '@ln613/compose'
import { TextBox, Password } from '@ln613/ui'
import { Button } from 'semantic-ui-react'
import { cdurl } from './'

export const withAuth = compose(
  connect(authSelector, actions),
  withMount(p => {
    if (isNil(p.auth.isAuthenticated)) p.patchAuth()
  }),
  Comp => p => p.auth.isAuthenticated ? <Comp {...p} /> : <Login />
)

const Login = connect(
  authSelector,
  actions
)(({ login, postAuth }) => (
  <div class="p16">
    Username: <TextBox name="login.username" />
    Password: <Password name="login.password" />
    <hr />
    <Button primary onClick={() => postAuth(login)}>
      Login
    </Button>
  </div>
))

export const withSuccess = (a, f1, f2) =>
  compose(
    connect(successSelector(a)),
    withNewValue('success', true, f1),
    withNewValue('success', false, f2)
  )

export const loadImage = url =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', () => {
      reject(new Error(`Failed to load image's URL: ${url}`))
    })
    img.crossOrigin = true
    img.src = url
  })

const createCanvas = (w, h) => {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, w, h)
  return [canvas, ctx]
}

const getBoundingSize = (img, w, h) => {
  const w1 = img.width
  const h1 = img.height
  const landscape = w1 / h1 > w / h
  return [
    landscape ? w : (w1 * h) / h1,
    landscape ? (w * h1) / w1 : h,
    landscape,
  ]
}

const drawBoundingImage = (
  ctx,
  img,
  x,
  y,
  w,
  h,
  { txts, font = 'Arial', size = 24, weight = 900, color = 'black' } = {}
) => {
  const [w2, h2, landscape] = getBoundingSize(img, w, h)
  const x2 = landscape ? x : x + (w - w2) / 2
  const y2 = landscape ? y + (h - h2) / 2 : y
  console.log(x, y, w, h)
  console.log(x2, y2, w2, h2)
  ctx.drawImage(img, x2, y2, w2, h2)
  if (txts && txts.length > 0) {
    ctx.font = `${weight} ${size}px ${font}`
    const th = ctx.measureText('M').width
    const mh = 10
    const left = th / 2
    const top = th + th / 2
    const rl = x2 + left - mh
    const rw = Math.max(...txts.map(x => ctx.measureText(x).width)) + 2 * mh
    const rt = y2 + top - th - mh
    const rh = txts.length * (th + mh) + 2 * mh
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.fillRect(rl, rt, rw, rh)
    ctx.fillStyle = color
    txts.forEach((t, i) => {
      ctx.fillText(t, x2 + left, y2 + top + i * (th + mh))
    })
  }
}

export const enlargeCanvas = async (url, w, h, isEnlarge, txt) => {
  const img = await loadImage(url)
  if (!isEnlarge) {
    w = img.width
    h = img.height
  }
  const [canvas, ctx] = createCanvas(w, h)
  drawBoundingImage(ctx, img, 0, 0, w, h, txt)
  return canvas.toDataURL()
}

const getLines = len => (len < 4 ? 1 : 2)
const getLine = (idx, len) => (len < 4 || idx < Math.ceil(len / 2) ? 1 : 2)
const getImagesInLine = (line, len) =>
  len < 4 ? len : (line === 1 ? Math.ceil : Math.floor)(len / 2)

export const combineImages = async (l, n, W, H) => {
  const imgs = await Promise.all(
    range(1, n + 1).map(x => loadImage(cdurl(l, 'tmp', x)))
  )
  const [canvas, ctx] = createCanvas(W, H)
  const lines = getLines(n)
  const h = H / lines
  const imgWidths = imgs.map((img, i) => {
    const l = getLine(i, n)
    const ps = getImagesInLine(l, n)
    return getBoundingSize(img, W / ps, h)[0]
  })
  const line1Imgs = getImagesInLine(1, n)
  const lineWidths = [
    sum(imgWidths.slice(0, line1Imgs)),
    sum(imgWidths.slice(line1Imgs)),
  ]
  imgs.forEach((img, i) => {
    const l = getLine(i, n)
    const ps = getImagesInLine(l, n)
    const w = W / ps
    const left = (W - lineWidths[l - 1]) / 2
    const x = left + sum(imgWidths.slice(l === 1 ? 0 : line1Imgs, i))
    const y = (l - 1) * h
    drawBoundingImage(ctx, img, x, y, imgWidths[i], h)
  })
  return canvas.toDataURL()
}
