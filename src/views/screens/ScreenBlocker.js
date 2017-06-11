import React from "react";

class ScreenBlocker extends React.Component {
  constructor() {
    super();

    this.state = {
      pac: 0
    };
  }

  render() {
    var pac = [
      <circle stroke="#979797" fill="#FFEE00" cx="201" cy="201" r="200"></circle>,
      <path stroke="#979797" fill="#FFEE00" d="M344.748485,340.055534 C308.387197,377.636196 257.422053,401 201,401 C90.54305,401 1,311.45695 1,201 C1,90.54305 90.54305,1 201,1 C255.963615,1 305.748783,23.1715656 341.899692,59.0588845 L202.825764,198.132812 L344.748485,340.055534 Z"></path>
    ];

    var pacman = pac[this.state.pac];

    return (
      <div id="ScreenBlocker">
        <div>
          <svg width="50px" height="70px" viewBox="0 0 402 402" version="1.1">
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              {pacman}
            </g>
          </svg>
          <div>working, please wait...</div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.interval = setInterval(::this.tick, 150);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    if(this.state.pac === 0) this.setState({pac: 1});
    else this.setState({pac: 0});
  }
}

export default ScreenBlocker;
