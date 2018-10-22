import React from 'react';

const images = [1, 2, 3];
let timer;

export default class ImageSlider extends React.Component {
  constructor() {
    super();
    this.state = { index: 0 };
  }

  componentDidMount() {
    timer = setInterval(() => this.setState({ index: this.state.index === images.length - 1 ? 0 : this.state.index + 1 }), 6000);
  }

  componentWillUnmount() {
    clearInterval(timer);
  }

  render() {
    return (
      <div>
        {images.map((x, i) =>
          <img src={`images/${x}.jpg`} class={`fade ${this.state.index === i ? 'show' : ''}`} />
        )}
      </div>
    );
  }
}