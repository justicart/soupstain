import p5 from 'p5';

export default function perlinNoise (p) {
  let phase = 0;
  let zoff = 0;
  let width = 500;
  let height = 300;
  let max = 300;
  let noiseMax = 100;
  let count = 1;
  let spacing = 100;
  let smooth = 5;
  let size = 100;
  let twist = 0;
  let rotate;
  let strokeWidth;
  let strokeWidthDecay;
  let strokeOpacityDecay;
  let zOffset;
  let iteratorArray = [];
  let fps = false;

  let currentTime;
  let timer = new Date();
  let currentFps = 0;

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    width = props.width;
    height = props.height;
    max = width > height ? height : width;
    noiseMax = props.noiseMax / 1000;
    count = props.count;
    spacing = props.spacing / 100;
    smooth = props.smooth;
    size = props.size;
    twist = props.twist / 1000;
    rotate = props.rotate / 1000;
    strokeWidth = props.strokeWidth / 100;
    strokeWidthDecay = props.strokeWidthDecay / 100;
    strokeOpacityDecay = props.strokeOpacityDecay / 100;
    zOffset = props.zOffset / 5000;
    fps = props.fps;
  };

  // Setup function
  p.setup = () => {
    p.createCanvas(width, height);
  }

  // Draw function
  p.draw = () => {
    p.resizeCanvas(width, height, true);
    p.translate(width / 2, height / 2);
    iteratorArray.length = count;
    iteratorArray.fill();
    iteratorArray.forEach((c, index) => {
      const calcStrokeWeight = strokeWidth - (((strokeWidth / count) * index) * strokeWidthDecay);
      const calcHeight = (max * (size / 100)) - (spacing * index);
      const calcPhase = phase + (index * twist);
      const calcZoff = zoff - (index * zOffset);
      p.noFill();
      p.stroke(`rgba(255,255,255,${1 - (((1 / count) * index) * strokeOpacityDecay)})`);
      p.strokeWeight(calcStrokeWeight);
      p.beginShape();
      for (let a = 0; a < (2 * Math.PI); a += p.radians(smooth)) {
        let xoff = p.map(p.cos(a + calcPhase), -1, 1, 0, noiseMax);
        let yoff = p.map(p.sin(a + calcPhase), -1, 1, 0, noiseMax);
        let r = p.map(p.noise(xoff, yoff, calcZoff), 0, 1, 100, calcHeight / 2);
        let x = r * p.cos(a);
        let y = r * p.sin(a);
        p.vertex(x, y);
      }
      p.endShape(p5.CLOSE);
      return false;
    })
    if (fps) {
      currentTime = new Date();
      if (currentTime - timer > 250) {
        currentFps = Math.round(p.frameRate());
        timer = new Date();
      }
      p.textSize(32);
      p.textAlign(p.CENTER);
      p.fill('white');
      p.stroke('black');
      p.strokeWeight(5)
      p.text(currentFps, 0, 0);
    }
    phase += rotate || 0;
    zoff += 0.01;
  }
}
