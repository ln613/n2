import React from 'react'
import ImageSlider from './ImageSlider'
import { withMobile } from '@ln613/ui/semantic'

const cards = [
  'https://www.youtube.com/embed/Bb1R3HeYcyA',
  'https://www.youtube.com/embed/mrxmQ-fMn7Q',
  'News',
  'Court',
  'Club',
  'Sales',
  'Products',
  'League',
  'Students',
  'VIP',
]
const num = [1, 1, 4, 8, 3, 3, 2, 4, 6, 4]

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
      <h2 style={{ color: 'red' }}>
        2024 BUTTERFLY AKBER OPEN & TEAM CHALLENGE
      </h2>
      <div>Jun 29, Jun 30, Jul 1</div>
      <div>
        <a href="/docs/2024 Akber open & Team Challenge.pdf">
          Registration Form
        </a>
      </div>
      <h2 style={{ color: 'gold' }}>U3200 Golden Team League</h2>
      <div>
        Every 2 weeks starting from Feb 26th. Fund raising for future junior
        players!
      </div>
      <div>
        <a href="https://www.score7.io/goldenteamleague">
          Results and Schedule
        </a>
      </div>
      {/* <h2>VTTC Monthly Tournaments</h2>
      <div className="news">
        All new monthly tournaments series! Starting from Sep., every month at VTTC there will be a tournament of different type to meet the need of different players of all levels. In Sep. there will be a team event, Oct. will be singles and Nov. is round robin. Registration is now open. Please refer to the registration form for more detials.
      </div>
      <div className="news" style={{paddingRight: '16px'}}>
        全新理念, 全新设计. 为满足所有乒乓球迷浓厚的热情, 本中心推出一系列的比赛, 每月举办一场不同类型的比赛来满足不同球友的需求, 使得我们的比赛更加丰富多彩. 这里是9月和10月比赛的信息和报名表.
      </div>  
      <div><a href="/docs/2022 VTTC Monthly Teams Sep.pdf">9月团体赛报名表 (Sep. Teams Challenge Registration Form)</a></div>
      <div><a href="/docs/2022 VTTC Monthly Singles Oct.pdf">10月单打报名表 (Oct. Singles Registration Form)</a></div> */}
      {/* <h2>2023 April Butterfly Akber Open & Team Challenge</h2>
      <div>
        <a href="/docs/2023 April Butterfly Akber open & Team Challenge.pdf">
          Registration Form
        </a>
      </div> */}
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
