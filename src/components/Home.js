import React from 'react';
import ImageSlider from './ImageSlider';
import { withMobile } from '@ln613/ui/semantic';

const cards = ['https://www.youtube.com/embed/Bb1R3HeYcyA', 'https://www.youtube.com/embed/nmcOpuBDWRM', 'News', 'Court', 'Club', 'Sales', 'Products', 'League', 'Students', 'VIP'];
const num   = [1, 1, 6, 8, 3, 3, 2, 8, 3, 4];

const c1 = m =>
  <div class={`fw pb16 ${m ? '' : 'ph8'}`}>
    {cards.map((c, i) => m ? c2(c, i, m) : <div class="f w20 p8">{c2(c, i, m)}</div>)}
  </div>

const D1 = ({ isMobile, children }) => <div class={`${isMobile ? '' : 'card'} fv w100`}>{children}</div>

const c2 = (c, i, m) => {
  if (c.slice(0, 4) === 'http') return <D1 isMobile={m}>{yt(c, m)}</D1>;
  const c3 = <ImageSlider n={num[i]} f={i} name={c} t={6} filter="c_scale,w_600" />;
  const c4 = <div class="p8 fs18 tac">{c}</div>;

  return m ?
    <D1 isMobile={m}>{c4}{c3}</D1> :
    <D1 isMobile={m}>{c3}{c4}</D1>;
}

const yt = (s, m) => <iframe title="home" src={s} frameborder="0" style={{ overflow: 'hidden', height: m ? '300px' : '100%', width: '100%' }} height={m ? '300px' : '100%'} width="100%"></iframe>

const Home = ({ isMobile }) =>
  <div>
    <div class="p16">
      <h2>2021 Butterfly AKBER Open & Team Challenge</h2>
      The following events will be held on Aug 21/22: Teams U-4000/U-2000, Open Singles, Singles U-2100/U-1600/U-1200/U-1000/U-700/U-500/U-200, Juniors U-13. Please see the <a href="/docs/2021 VTTC OPEN August 21 - 22 V15.pdf">registration form</a> for details. 
      <br />
      Note:
      &nbsp;&nbsp;1. The starting time on Sun 8/22 has been changed to 12pm.
      &nbsp;&nbsp;2. There will be a daily lucky draw during the event.
      &nbsp;&nbsp;3. For singles events, in addition to regular rewards, female players will be ranked and awarded among female players. 
      <div>
      </div>
      {/* <div style={{paddingRight: '16px'}}>
        2021 MVTTL U-2000 联赛将于3月26日开始。为保持社交距离，双打比赛将改为单打。
      </div>   */}
      <div style={{paddingRight: '16px'}}>
        本中心将于8月21/22日举行团体及单打赛事。详情请见<a href="/docs/2021 VTTC OPEN August 21 - 22 V15.pdf">报名表</a>。
      </div>  
    </div>  

    <ImageSlider n={2} t={6} fitHeight={!isMobile}/>

    <div class="p16">
      <h2>Introduction</h2>
      <div>
        Vancouver Table Tennis Club (VTTC) is one of the best table tennis club in the Greater Vancouver area. The Club offers high quality tournament-level tables in a comfortable, well-lit playing environment.      
      </div>
    </div>  
    
    {c1(isMobile)}
  </div>

export default withMobile(Home);


//2021 MVTTL U-2000 will start on Mar. 26th. The doubles game will be replaced by a single game in order to keep social distance.
