const pngPrefix = 'data:image/jpeg;base64,';
const jpgPrefix = 'data:image/png;base64,';

function decodeImageFromBase64(base64String) {
  let base64Data = base64String.replace(pngPrefix, '').replace(jpgPrefix, '');
  let buffer = Buffer.from(base64Data, 'base64');
  return cv.imdecode(buffer);
}

/**
 * 
 * @param {*} img 'Mat' data
 * @param {*} canvas 'canvas' tag
 */
function renderImage(img, canvas) {
  if('main-frame-mask' == canvas.id) {
    const widthRatio = (img.cols / img.rows) * 80;
    const width = String(widthRatio).concat('%');

    canvas.style.width = width;
  }

  let matRGBA = img.channels === 1 ? img.cvtColor(cv.COLOR_GRAY2RGBA) : img.cvtColor(cv.COLOR_BGR2RGBA);

  canvas.width = img.cols;
  canvas.height = img.rows;

  let imgData = new ImageData(
    new Uint8ClampedArray(matRGBA.getData()),
    img.cols,
    img.rows
  );
                                                                              
  if(canvas.getContext) {
    let ctx = canvas.getContext('2d');
    ctx.putImageData(imgData, 0, 0);
  } else {
    console.log('canvas를 지원하지 않는 브라우저');
  }
}

function renderImageOnText(canvas) {
  let ctx = canvas.getContext('2d');
  const textPositionWidth = (canvas.width / 2);

  drawStroked(ctx, canvas.id, textPositionWidth, 20);
}

function drawStroked(ctx, text, x, y) {
  ctx.font = '1.3rem Sans-serif';
  ctx.strokeStyle = 'black';
  ctx.textAlign = "center";
  ctx.lineWidth = 4;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = 'white';
  ctx.fillText(text, x, y);
}

function mainFrameSize() {
  const canvas = document.getElementById('main-frame-mask');

  canvas.style.width = (window.innerWidth * 0.2) + 'px';
}