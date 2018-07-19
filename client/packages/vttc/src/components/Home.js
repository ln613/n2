import React from 'react';
import ImageSlider from './ImageSlider';
import { Mobile, Desktop } from 'utils/comps';

const cards = ['', 'Club', 'League', 'Students', 'VIP'];
const num   = [1, 2, 2, 2, 2];

const c1 = m =>
  <div class="fw ph8 pb16">
    {cards.map((c, i) => m ? c2(c, i, m) : <div class="f w20 p8">{c2(c, i, m)}</div>)}
  </div>

const c2 = (c, i, m) =>
  <div class="card fv w100">
    {i === 0 ? yt(m) : <ImageSlider n={num[i]} f={i} name={c} />}
    <div class="p8 fs18 tac">{c}</div>
  </div>

const yt = m => <iframe src="https://www.youtube.com/embed/2vHedm6ycsY?rel=0&amp;autoplay=1" frameborder="0" style={{ overflow: 'hidden', height: m ? '300px' : '100%', width: '100%' }} height={m ? '300px' : '100%'} width="100%"></iframe>

const Home = p =>
  <div>
    <ImageSlider n={2} />

    <div class="p16">
      <h2>Introduction</h2>
      <div>
        Vancouver Table Tennis Club (VTTC) is one of the best table tennis club in the Greater Vancouver area. VTTC is located near Chinatown in Vancouver and has been opened to the public from Monday to Friday from 11AM to 11PM and Saturday from 11AM-9PM, Sunday from 11PM-7pm since September, 2004. The Club offers high quality tournament-level tables in a comfortable, well-lit playing environment.      
      </div>
    </div>  
    
    <Mobile>{c1(true)}</Mobile>
    <Desktop>{c1(false)}</Desktop>
  </div>

export default Home;