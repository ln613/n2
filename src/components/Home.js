import React from 'react';
import ImageSlider from './ImageSlider';
import { withMobile } from '@ln613/ui/semantic';

const cards = ['https://www.youtube.com/embed/Bb1R3HeYcyA', 'https://www.youtube.com/embed/nmcOpuBDWRM', 'News', 'Court', 'Club', 'Sales', 'Products', 'League', 'Students', 'VIP'];
const num   = [1, 1, 4, 8, 3, 3, 2, 4, 6, 4];

const c1 = m =>
  <div class={`fw pb16 ${m ? '' : 'ph8'}`}>
    {cards.map((c, i) => m ? c2(c, i, m) : <div class="f w20 p8">{c2(c, i, m)}</div>)}
  </div>

const D1 = ({ isMobile, children }) => <div class={`${isMobile ? '' : 'card'} fv w100`}>{children}</div>

const c2 = (c, i, m) => {
  if (c.slice(0, 4) === 'http') return <D1 isMobile={m}>{yt(c, m)}</D1>;
  const c3 = <ImageSlider n={num[i]} f={i} name={c} t={6} filter="c_fill,w_600,h_450" />;
  const c4 = <div class="p8 fs18 tac">{c}</div>;

  return m ?
    <D1 isMobile={m}>{c4}{c3}</D1> :
    <D1 isMobile={m}>{c3}{c4}</D1>;
}

const yt = (s, m) => <iframe title="home" src={s} frameborder="0" style={{ overflow: 'hidden', height: m ? '300px' : '100%', width: '100%' }} height={m ? '300px' : '100%'} width="100%"></iframe>

const Home = ({ isMobile }) =>
  <div>
    <div class="p16">
      <h2>2022 Butterfly AKBER Open & Team Challenge</h2>
      <div style={{paddingRight: '16px'}}>
        一年一度的 Butterfly AKBER Open & Team 比赛又来了。奖金总值6000元和价值2000多元的水机在比赛中送出, 请尽快报名吧! <a href="~/docs/2022 May vttc open.pdf">报名表 (Registration Form)</a>
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
