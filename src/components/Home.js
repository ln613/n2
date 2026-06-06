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
      <h2 style={{ color: 'red' }}>VTTC Goes Live</h2>
      <div style={{ marginBottom: 8 }}>
        We're excited to launch our new online platform with:
      </div>
      <ul style={{ marginTop: 0, marginBottom: 12 }}>
        <li>
          <strong>Online registration.</strong> Sign up once and register for any
          upcoming event without paperwork at the club.
        </li>
        <li>
          <strong>Live scores from every table.</strong> Scheduling and live
          scores are displayed at the club and online so everyone can follow
          along in real time.
        </li>
        <li>
          <strong>Real-time table assignments and match queue.</strong> Know
          exactly when and where you play.
        </li>
      </ul>
      <div style={{ marginBottom: 8 }}>
        Before your next event, please:
      </div>
      <ol style={{ marginTop: 0, marginBottom: 12 }}>
        <li style={{ marginBottom: 8 }}>
          <strong>Sign up and register online.</strong>
          <br />
          If you've played at VTTC before and have an existing rating, you'll
          find your name and current rating in the players dropdown during
          sign-up — just select yourself, then enter and verify your email
          address to claim the account.
          <br />
          If you run into any trouble during sign-up, please come to the club
          and we will help you set it up.
        </li>
        <li>
          <strong>Bring your phone on match day.</strong>
          <br />
          Players are now responsible for keeping score on their phones so
          results can be reflected in real time across the club. Make sure your
          device is charged before you arrive.
        </li>
      </ol>
      <div>
        Thank you for being part of VTTC — we look forward to seeing you on the
        tables.
      </div>
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
