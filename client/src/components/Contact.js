import React from 'react';
import { withMobile } from '@ln613/ui/semantic';

export const Contact = ({ isMobile }) =>
  <div class="p16">
    <h1>Contact</h1>
    <div class="ui divider"></div>
    <div class={`${isMobile ? 'fv' : 'f'} tac`}>
      <div class="">
        <div class="pb16">
          <i class="phone icon" />1-604-215-0288
        </div>  
        <div class="pb16">
          <i class="phone icon" />1-604-771-9188
        </div>  
        <div class="pb16">
          <i class="mail icon" /><a href="mailto:vttc@vttc.ca">vttc@vttc.ca</a>
        </div>  
        <div class="pb16">
          <i class="map marker alternate icon" />
          3925 Fraser Street, Vancouver
        </div>
        <br/>
      </div>  
      <div class={`${isMobile ? '' : 'pl16'} fg1`}>
        <iframe class="w100" height="500" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2604.4094691796067!2d-123.09272768386832!3d49.249684379327874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548673ff255560f7%3A0xf9a8f86b985e8dc5!2s3925+Fraser+St%2C+Vancouver%2C+BC+V5V+4E5!5e0!3m2!1sen!2sca!4v1522820494676" frameborder="0" allowfullscreen title="gmap"></iframe>
      </div>
    </div>  
  </div>  

export default withMobile(Contact);