import React from 'react';
import ImageSlider from './ImageSlider';
import { withMobile } from '@ln613/ui/semantic';

const cards = ['https://www.youtube.com/embed/Bb1R3HeYcyA', 'https://www.youtube.com/embed/nmcOpuBDWRM', 'News', 'Court', 'Club', 'Sales', 'Products', 'League', 'Students', 'VIP'];
const num   = [1, 1, 3, 8, 4, 6, 2, 4, 3, 4];

const c1 = m =>
  <div class={`fw pb16 ${m ? '' : 'ph8'}`}>
    {cards.map((c, i) => m ? c2(c, i, m) : <div class="f w20 p8">{c2(c, i, m)}</div>)}
  </div>

const D1 = ({ isMobile, children }) => <div class={`${isMobile ? '' : 'card'} fv w100`}>{children}</div>

const c2 = (c, i, m) => {
  if (c.slice(0, 4) === 'http') return <D1 isMobile={m}>{yt(c, m)}</D1>;
  const c3 = <ImageSlider n={num[i]} f={i} name={c} t={6} />;
  const c4 = <div class="p8 fs18 tac">{c}</div>;

  return m ?
    <D1 isMobile={m}>{c4}{c3}</D1> :
    <D1 isMobile={m}>{c3}{c4}</D1>;
}

const yt = (s, m) => <iframe title="home" src={s} frameborder="0" style={{ overflow: 'hidden', height: m ? '300px' : '100%', width: '100%' }} height={m ? '300px' : '100%'} width="100%"></iframe>

const Home = ({ isMobile }) =>
  <div>
    <ImageSlider n={3} t={6} />

    <div class="p16">
      <h2>Introduction</h2>
      <div>
        Vancouver Table Tennis Club (VTTC) is one of the best table tennis club in the Greater Vancouver area. The Club offers high quality tournament-level tables in a comfortable, well-lit playing environment.      
      </div>
    </div>  
    
    {c1(isMobile)}
  </div>

export default withMobile(Home);