'use strict';

const placeDot = function(dot, {x = 0, y = 0}) {
  dot.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
};

const Dot = ({
  color = 'blue',
  radius = 10,
  x = 0,
  y = 0,
  zIndex
} = {}) => {
  const dot = document.createElement('div');
  dot.style.backgroundColor = color;
  dot.style.left = '0px';
  dot.style.top = '0px';
  dot.style.position = 'absolute';

  dot.style.borderRadius = '50%';
  dot.style.width = 2 * radius + 'px';
  dot.style.height = 2 * radius + 'px';

  dot.style.marginLeft = - radius + 'px';
  dot.style.marginTop = - radius + 'px';

  placeDot(dot, {x, y});

  if (zIndex !== undefined) {
    dot.style.zIndex = opt.zIndex;
  }

  return dot;
};

const nDots = 503;
const cycles = 5;
const fullCycleTime = 10 * 60 * 1000; // 10 minutes

let mousePos = {
  x: 1,
  y: 0
};

const dots = [];

let time = 0;

const loadTime = Date.now();
const relNow = () => time;//Date.now() - loadTime;

const radius = (theta) => {
  return Math.cos((nDots / cycles) * (relNow() / fullCycleTime) * theta);
};

let displayText;

const draw = () => {
  time += (1000 / 60) * Math.pow(mousePos.x, 3);

  const center = {
    x: 0.5 * document.body.clientWidth,
    y: 0.5 * document.body.clientHeight
  };

  displayText.innerHTML = (relNow() / fullCycleTime).toFixed(5);

  const unit = 0.8 * Math.min(center.x, center.y);

  dots.forEach((dot, i) => {
    const theta = cycles * i / nDots * 2 * Math.PI;

    placeDot(dot, {
      x: center.x + unit * radius(theta) * Math.cos(theta),
      y: center.y - unit * radius(theta) * Math.sin(theta)
    });
  });
};

global.addEventListener('load', () => {
  document.body.style.height = '100vh';
  document.body.style.backgroundColor = '#000';
  document.body.style.color = '#fff';

  displayText = document.createElement('div');
  document.body.appendChild(displayText);

  for (let i = 0; i < nDots; i++) {
    const dot = Dot({color: '#fff'});
    dot.style.opacity = Math.pow(0.01, i / (nDots - 1));
    document.body.appendChild(dot);
    dots.push(dot);
  }

  global.document.addEventListener('mousemove', (event) => {
    const cw = document.body.clientWidth;
    const ch = document.body.clientHeight;

    const unit = 0.8 * 0.5 * Math.min(cw, ch);

    mousePos.x = (event.pageX - 0.5 * cw) / unit;
    mousePos.y = (0.5 * ch - event.pageY) / unit;
  });

  const drawCycle = () => {
    draw();
    global.requestAnimationFrame(drawCycle);
  };

  global.requestAnimationFrame(drawCycle);
});
