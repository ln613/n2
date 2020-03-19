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
      <h2>Notice:</h2>
      <div>
        Due to the COVID-19 outbreak, VTTC will be closed from March 19 to March 31. If no further notice, we will reopen on April 1st. Thanks for your understanding.       </div>
      </div>  
      <div>
        因為新冠狀病毒的疫情嚴重，為了保障大家的安全，本中心決定暫時停放兩周（包括中心所有项目）由3月19日到3月31日，如果沒有特別情況4月1日會重新開放，有关各項聯賽的開賽時間，請大家留意䋞站的公布，如有不便之处，請各位原諒！有問題請call: 604-7719188.
      </div>  

    <ImageSlider n={3} t={6} fitHeight={!isMobile}/>

    <div class="p16">
      <h2>Introduction</h2>
      <div>
        Vancouver Table Tennis Club (VTTC) is one of the best table tennis club in the Greater Vancouver area. The Club offers high quality tournament-level tables in a comfortable, well-lit playing environment.      
      </div>
    </div>  
    
    {c1(isMobile)}
  </div>

export default withMobile(Home);
