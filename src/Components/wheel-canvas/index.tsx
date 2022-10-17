import React, { useEffect, useState, useRef } from 'react';
import styles from './styles.module.css';

export type WheelProps = {
  segments: prizeItem[];
  segColors: string[];
  winningSegment: string;
  onFinished: (msg: string, index: number) => void;
  onConfirmed: () => void;
  primaryColor: string;
  contrastColor: string;
  buttonText: string;
  isOnlyOnce: boolean;
  size: number;
  upDuration: number;
  downDuration: number;
  fontFamily: string;
};

export type prizeItem = {
  value: string;
  picked: boolean;
};

const clear = (context: CanvasRenderingContext2D) => {
  context.clearRect(0, 0, 1000, 800);
};

const drawWheel = (context: CanvasRenderingContext2D) => {
  const centerX = 300;
  const centerY = 300;
  let angleCurrent = 0;
  let size = 290;
  let lastAngle = angleCurrent;
  const len = 5; // segments.length;
  const PI2 = Math.PI * 2;
  context.lineWidth = 1;
  context.strokeStyle = 'black'; // primaryColor || 'black';
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  // context.font = '1em ' + fontFamily;

  for (let i = 1; i <= len; i++) {
    const angle = PI2 * (i / len) + angleCurrent;
    // drawSegment(i - 1, lastAngle, angle);
    // const ctx = canvasContext;
    // const value = segments[key].value;
    context.save();
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, size, lastAngle, angle, false);
    context.lineTo(centerX, centerY);
    context.closePath();
    context.fillStyle = 'white';
    context.fill();
    context.stroke();
    context.save();
    context.translate(centerX, centerY);
    context.rotate((lastAngle + angle) / 2);
    context.fillStyle = 'white'; // contrastColor || 'white';
    // context.font = 'bold 1em ' + fontFamily;
    // context.fillText(value.substr(0, 21), size / 2 + 20, 0);
    // ctx.fillText("hi", 2, 0);
    context.restore();

    lastAngle = angle;
  }

  // Draw a center circle
  context.beginPath();
  context.arc(centerX, centerY, 50, 0, PI2, false);
  context.closePath();

  context.fillStyle = 'black'; // primaryColor || 'black';
  context.lineWidth = 10;
  context.strokeStyle = 'white'; // contrastColor || 'white';
  context.fill();

  // context.font = 'bold 1em ' + fontFamily;
  context.fillStyle = 'white'; // contrastColor || 'white';
  context.textAlign = 'center';
  // context.fillText(buttonText || 'Spin', centerX, centerY + 3);
  context.stroke();

  // Draw outer circle
  context.beginPath();
  context.arc(centerX, centerY, size, 0, PI2, false);
  context.closePath();

  context.lineWidth = 10;
  context.strokeStyle = 'black'; // primaryColor || 'black';
  context.stroke();
};

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>();

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current?.getContext('2d');

      if (context) {
        contextRef.current = context;
        clear(contextRef.current);
        drawWheel(contextRef.current);
        // drawNeedle();
      }
    }
    // initCanvas();
    // wheelDraw();
  }, []);

  return <canvas ref={canvasRef} id="canvas" width="600" height="600" />;
};

export const WheelCanvas: React.FC<WheelProps> = ({
  segments,
  segColors,
  winningSegment,
  onFinished,
  onConfirmed,
  primaryColor,
  contrastColor,
  buttonText,
  isOnlyOnce = true,
  size = 290,
  upDuration = 1000,
  downDuration = 1000,
  fontFamily = 'Gatwick Bold',
}) => {
  const [isFinished, setFinished] = useState(false);
  const [prize, setPrize] = useState<string>('');

  let currentSegment = '';
  let currentSegmentIndex = 0;
  let isStarted = false;
  let timerHandle: any = 0;
  const timerDelay: number = segments.length;
  let angleCurrent = 0;
  let angleDelta = 0;
  let canvasContext: any = null;
  let maxSpeed = Math.PI / segments.length;
  const upTime: number = segments.length * upDuration;
  const downTime = segments.length * downDuration;
  let spinStart = 0;
  let frames = 0;
  const centerX = 300;
  const centerY = 300;
  let colorPickerRef = React.createRef<HTMLCanvasElement>();

  useEffect(() => {
    wheelInit();

    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 0);
  }, []);

  const wheelInit = () => {
    initCanvas();
    wheelDraw();
  };

  const initCanvas = () => {
    let canvas = document.getElementById('canvas');

    if (navigator.appVersion.indexOf('MSIE') !== -1) {
      canvas = document.createElement('canvas');
      canvas.setAttribute('width', '1000');
      canvas.setAttribute('height', '600');
      canvas.setAttribute('id', 'canvas');
      document.getElementById('wheel')?.appendChild(canvas);
    }

    canvas?.addEventListener('click', spin, false);
    // canvasContext = canvas.getContext('2d')

    if (colorPickerRef.current) {
      canvasContext = colorPickerRef.current.getContext('2d');
    }
  };

  const spin = () => {
    isStarted = true;

    if (timerHandle === 0) {
      spinStart = new Date().getTime();
      // maxSpeed = Math.PI / ((segments.length*2) + Math.random())
      maxSpeed = Math.PI / segments.length;
      frames = 0;
      // timerHandle = setInterval(onTimerTick, timerDelay);
      timerHandle = setInterval(onTimerTick, segments.length);
    }
  };

  const onTimerTick = () => {
    frames++;
    draw();

    const duration = new Date().getTime() - spinStart;
    let progress = 0;
    let finished = false;

    if (duration < upTime) {
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else {
      if (winningSegment) {
        console.log(currentSegment);

        if (currentSegment === winningSegment && frames > segments.length) {
          console.log(currentSegment);
          progress = duration / upTime;
          angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
          progress = 1;
        } else {
          progress = duration / downTime;
          angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
        }
      } else {
        progress = duration / downTime;
        angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      }

      if (progress >= 1) {
        finished = true;
      }
    }

    angleCurrent += angleDelta;

    while (angleCurrent >= Math.PI * 2) {
      angleCurrent -= Math.PI * 2;
    }

    if (finished) {
      // const ctx = canvasContext;
      // ctx.fillStyle = segColors[2]
      // let lastAngle = angleCurrent
      // darkenSegment(currentSegmentIndex, lastAngle);
      draw();
      setFinished(true);
      onFinished(currentSegment, currentSegmentIndex);
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
      setPrize(currentSegment);
    }
  };

  /*
  const darkenSegment = (key: number, lastAngle: number) => {
    const ctx = canvasContext;
    const value = segments[key].value;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    if (segments[key].picked) {
      ctx.fillStyle = segColors[2];
    } else {
      ctx.fillStyle = segColors[key % 2];
    }
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.fillStyle = contrastColor || 'white';
    ctx.font = 'bold 1em ' + fontFamily;
    ctx.fillText(value.substr(0, 21), size / 2 + 20, 0);
    // ctx.fillText("hi", 2, 0);
    ctx.restore();
  };
  */

  const wheelDraw = () => {
    // clear();
    // drawWheel();
    // drawNeedle();
  };

  const draw = () => {
    // clear();
    // drawWheel();
    // drawNeedle();
  };

  const drawSegment = (key: number, lastAngle: number, angle: number) => {
    const ctx = canvasContext;
    const value = segments[key].value;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    if (segments[key].picked) {
      ctx.fillStyle = segColors[2];
    } else {
      ctx.fillStyle = segColors[key % 2];
    }
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((lastAngle + angle) / 2);
    ctx.fillStyle = contrastColor || 'white';
    ctx.font = 'bold 1em ' + fontFamily;
    ctx.fillText(value.substr(0, 21), size / 2 + 20, 0);
    // ctx.fillText("hi", 2, 0);
    ctx.restore();
  };

  const drawWheel = () => {
    const ctx = canvasContext;
    let lastAngle = angleCurrent;
    const len = segments.length;
    const PI2 = Math.PI * 2;
    ctx.lineWidth = 1;
    ctx.strokeStyle = primaryColor || 'black';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = '1em ' + fontFamily;
    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrent;
      drawSegment(i - 1, lastAngle, angle);
      lastAngle = angle;
    }

    // Draw a center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = primaryColor || 'black';
    ctx.lineWidth = 10;
    ctx.strokeStyle = contrastColor || 'white';
    ctx.fill();
    ctx.font = 'bold 1em ' + fontFamily;
    ctx.fillStyle = contrastColor || 'white';
    ctx.textAlign = 'center';
    ctx.fillText(buttonText || 'Spin', centerX, centerY + 3);
    ctx.stroke();

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, PI2, false);
    ctx.closePath();

    ctx.lineWidth = 10;
    ctx.strokeStyle = primaryColor || 'black';
    ctx.stroke();
  };
  /*
    let lastAngle = angleCurrent
    const len = segments.length
    const PI2 = Math.PI * 2
    ctx.lineWidth = 1
    ctx.strokeStyle = primaryColor || 'black'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.font = '1em ' + fontFamily
    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrent
      drawSegment(i - 1, lastAngle, angle)
*/
  const drawNeedle = () => {
    const ctx = canvasContext;
    ctx.lineWidth = 1;
    ctx.strokeStyle = contrastColor || 'white';
    ctx.fileStyle = contrastColor || 'white';
    ctx.beginPath();
    ctx.moveTo(centerX + 20, centerY - 50);
    ctx.lineTo(centerX - 20, centerY - 50);
    ctx.lineTo(centerX, centerY - 70);
    ctx.closePath();
    ctx.fill();
    const change = angleCurrent + Math.PI / 2;
    let i = segments.length - Math.floor((change / (Math.PI * 2)) * segments.length) - 1;
    if (i < 0) i = i + segments.length;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = primaryColor || 'black';
    ctx.font = 'bold 1.5em ' + fontFamily;
    currentSegment = segments[i].value;
    currentSegmentIndex = i;
    isStarted && ctx.fillText(currentSegment, centerX + 10, centerY + size + 50);
  };

  // const clear = () => {
  //   const ctx = canvasContext;
  //   ctx.clearRect(0, 0, 1000, 800);
  // };

  return (
    <div id="wheel" className={styles.root}>
      {prize === '' ? <h1>Spin the wheel!</h1> : <h1>You won a very special: {prize}</h1>}
      <Canvas />
      {isFinished && (
        <button className={styles.confirm} onClick={onConfirmed}>
          Confirm
        </button>
      )}
    </div>
  );
};
