import p5 from 'p5';

export default function perlinNoise (p) {
  let phase = 0;
  let zoff = 0;
  let width = 500;
  let height = 300;
  let noiseMax = 100;
  let count = 1;
  let spacing = 100;
  let detail = 5;
  let size = 100;
  let twist = 0;
  let strokeWidth;
  let strokeWidthDecay;
  let strokeOpacityDecay;
  let zOffset;
  let iteratorArray = [];

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    width = props.width;
    height = props.height;
    noiseMax = props.noiseMax / 100;
    count = props.count;
    spacing = props.spacing / 100;
    detail = props.detail;
    size = props.size;
    twist = props.twist / 1000;
    strokeWidth = props.strokeWidth / 100;
    strokeWidthDecay = props.strokeWidthDecay / 100;
    strokeOpacityDecay = props.strokeOpacityDecay / 100;
    zOffset = props.zOffset / 5000;
  };

  // Setup function
  p.setup = () => {
    p.createCanvas(width, height);
  }

  // Draw function
  p.draw = () => {
    p.resizeCanvas(width, height, true);
    p.translate(width / 2, height / 2);
    p.noFill();
    iteratorArray.length = count;
    iteratorArray.fill();
    iteratorArray.forEach((c, index) => {
      const calcStrokeWeight = strokeWidth - (((strokeWidth / count) * index) * strokeWidthDecay);
      const calcHeight = (height * (size / 100)) - (spacing * index);
      const calcPhase = phase + (index * twist);
      const calcZoff = zoff - (index * zOffset);
      p.stroke(`rgba(255,255,255,${1 - (((1 / count) * index) * strokeOpacityDecay)})`);
      p.strokeWeight(calcStrokeWeight);
      p.beginShape();
      for (let a = 0; a < (2 * Math.PI); a += p.radians(detail)) {
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
    phase += 0.003;
    zoff += 0.01;
  }
}
