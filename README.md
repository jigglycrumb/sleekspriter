# SleekSpriter

## A cross-platform pixel art editor

### Setup

To build cross-platform: `brew install wine mono dpkg rpm fakeroot`

### Data handling

The file data is held in a redux store in this format:

```
// state.file.present

{
  { // frames via frame number, starting at 1
    1: ..
    2: ..
    3: { // layers via id
      1: ..
      2: ..
      3: { // pixels via x-values
        1: ..
        2: ..
        3: { // pixels via y-values
          1: Pixel
          2: Pixel
          3: Pixel
        }
      }
    }
  }
}

// Pixel

{
  frame: 1,
  layer: 3,
  x: 11,
  y: 7,
  r: 226,
  g: 50,
  b: 226,
  a: 1
}

```

### File saving

Files are saved in a JSON format with the `.pixels` suffix.

The format is defined like this:

```

{
  "meta": {
    "version": 1, // file format version
    "created": "2019-10-01T20:19:10.317Z",
    "updated": "2019-10-01T20:19:10.317Z",
    "author": "",
    "homepage": ""
  },
  "size": [32, 32], // width and height of one frame
  "frames": [3, 2], // number of frames x/y
  "layers": [
    [2, 1, "Layer 2", 1, 100, 1], // [id, frame, name, z, opacity, visible]
    ..
  ],
  "pixels": [[3, 14, 9, 0, 0, 0, 1]] // [layer, x, y, r, g, b, a]
}

```

In the web version, the JSON output is encrypted with AES for obfuscation.
