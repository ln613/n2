import React from 'react'

export default p => (
  <div className="p16">
    <h1>Introduction</h1>
    <div className="ui divider"></div>
    <div className="f">
      <div className="">
        <div className="pb16">
          <i className="phone icon" />
          1-604-215-0288
        </div>
        <div className="pb16">
          <i className="phone icon" />
          1-604-771-9188
        </div>
        <div className="pb16">
          <i className="mail icon" />
          <a href="mailto:vttc@vttc.ca">vttc@vttc.ca</a>
        </div>
        <div className="f">
          <i className="map marker alternate icon" />
          <div>
            3925 Fraser Street
            <br />
            Vancouver, BC
          </div>
        </div>
      </div>
      <div className="fg1 pl16">
        <iframe
          className="w100"
          height="500"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2604.4094691796067!2d-123.09272768386832!3d49.249684379327874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548673ff255560f7%3A0xf9a8f86b985e8dc5!2s3925+Fraser+St%2C+Vancouver%2C+BC+V5V+4E5!5e0!3m2!1sen!2sca!4v1522820494676"
          frameborder="0"
          allowfullscreen
          title="gmap"
        ></iframe>
      </div>
    </div>
  </div>
)
