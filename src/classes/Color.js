const pad = function(s) {
  return (s.length === 1 ? "0"+s : s).toUpperCase();
};

const hex2rgb = function(hex) {
  const
    r = parseInt(hex.substr(1, 2), 16),
    g = parseInt(hex.substr(3, 2), 16),
    b = parseInt(hex.substr(5, 2), 16);
  return {r, g, b};
};

class Color {
  constructor(c) {
    this.r = null;
    this.g = null;
    this.b = null;

    if(undefined != c.rgb) { // expects c = {rgb: [255, 255, 255]}
      this.r = c.rgb[0];
      this.g = c.rgb[1];
      this.b = c.rgb[2];
    }
    else if(undefined != c.hex) { // expects c = {hex: "#ffffff"}
      const ch = hex2rgb(c.hex);
      this.r = ch.r;
      this.g = ch.g;
      this.b = ch.b;
    }
  }

  hex() {
    return `#${pad(this.r.toString(16))}${pad(this.g.toString(16))}${pad(this.b.toString(16))}`;
  }

  rgbHuman() {
    return `${this.r}, ${this.g}, ${this.b}`;
  }
}

export default Color;
