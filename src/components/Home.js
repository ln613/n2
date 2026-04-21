import React from 'react'
import ImageSlider from './ImageSlider'
import { withMobile } from '@ln613/ui/semantic'

const cards = [
  'https://www.youtube.com/embed/Bb1R3HeYcyA',
  'https://www.youtube.com/embed/39FM60HwSnY',
  'News',
  'Court',
  'Club',
  'Sales',
  'Products',
  'League',
  'Students',
  'VIP',
]
const num = [1, 1, 4, 8, 3, 5, 2, 6, 6, 4]

const c1 = m => (
  <div className={`fw pb16 ${m ? '' : 'ph8'}`}>
    {cards.map((c, i) =>
      m ? (
        c2(c, i, m)
      ) : (
        <div key={i} className="f w20 p8">
          {c2(c, i, m)}
        </div>
      )
    )}
  </div>
)

const D1 = ({ isMobile, children }) => (
  <div className={`${isMobile ? '' : 'card'} fv w100`}>{children}</div>
)

const c2 = (c, i, m) => {
  if (c.slice(0, 4) === 'http') return <D1 isMobile={m}>{yt(c, m)}</D1>
  const c3 = (
    <ImageSlider n={num[i]} f={i} name={c} t={6} filter="c_fill,w_600,h_450" />
  )
  const c4 = <div className="p8 fs18 tac">{c}</div>

  return m ? (
    <D1 isMobile={m}>
      {c4}
      {c3}
    </D1>
  ) : (
    <D1 isMobile={m}>
      {c3}
      {c4}
    </D1>
  )
}

const yt = (s, m) => (
  <iframe
    title="home"
    src={s}
    frameBorder="0"
    style={{ overflow: 'hidden', height: m ? '300px' : '100%', width: '100%' }}
    height={m ? '300px' : '100%'}
    width="100%"
  ></iframe>
)

const Home = ({ isMobile }) => (
  <div>
    <div className="p16">
      {/* <h2 style={{ color: 'red' }}>
        2025 VTTC BUTTERFLY AKBER OPEN AND EDMOND TEAM CHALLENGE
      </h2>
      <div>Dec. 5,6,7, 2025</div>
      <div>
        <a href="/docs/2025 VTTC BUTTERFLY AKBER OPEN AND EDMOND TEAM CHALLENGE.pdf">
          Registration Form
        </a>
      </div>
      <h2>Closed for Renovation 装修停业两周 Feb 17 to Mar 2</h2>
      <div>
        <a href="/docs/2023 April Butterfly Akber open & Team Challenge.pdf">
          Registration Form
        </a>
      </div>
      <h2>本场馆将于4月18日（周六）举办年度全国选拔赛，Drop-in将暂停开放一天</h2>
      <h2>No drop-in on Sat, Apr 18, as we will be hosting the National Championship tryout</h2> */}
    </div>

    <div className="p8"></div>
    <ImageSlider n={3} t={6} fitHeight={!isMobile} />

    <div className="p16">
      <h2>Introduction</h2>
      <div>
        Vancouver Table Tennis Club (VTTC) is one of the best table tennis club
        in the Greater Vancouver area. The Club offers high quality
        tournament-level tables in a comfortable, well-lit playing environment.
      </div>
    </div>

    {c1(isMobile)}
  </div>
)

export default withMobile(Home)

//2021 MVTTL U-2000 will start on Mar. 26th. The doubles game will be replaced by a single game in order to keep social distance.
