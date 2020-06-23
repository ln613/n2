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
      <h2>Reopening Update:</h2>
      <div>
        Our club will reopen on July 1st, and our regular opening time will be changed to 11am, in order to help our club members and players regain the time lost due to the pandemic and give everyone more time to execise. We will follow all the government health regulations, keep our club clean and ensure good air circulation with our ventilation and air conditioning system. We will create a safe environment for everyone to enjoy playing here.
      </div>
      <br />
      <div style={{paddingRight: '16px'}}>
      春雷过後，大地回春，疫情過後人們更加精神换發，為了更好的让我們具樂部所以的會員和球友們更快夺回増經失去的炼習時间，决定7月1日全面灰复正常，同時開放時間提前到11奌早上，让大家多奌時間練鍛，但疫情時間大家也要遵守政府規定的衛生條例，長情到中心场地會有安排，一切都是为大家生體健康，中心也做好一切准备，我們有安全抽風和冷氣系統，新裝修飄亮高貴的衛生间，實在的衛生查驗服務，會让所以的球員們玩的安心，练得安心，會盡情享受這個運動帶來的無比快樂。
      </div>  
    </div>  

    {/* <ImageSlider n={3} t={6} fitHeight={!isMobile}/> */}

    <div class="p16">
      <h2>Introduction</h2>
      <div>
        Vancouver Table Tennis Club (VTTC) is one of the best table tennis club in the Greater Vancouver area. The Club offers high quality tournament-level tables in a comfortable, well-lit playing environment.      
      </div>
    </div>  
    
    {c1(isMobile)}
  </div>

export default withMobile(Home);
