const core = Live2DCubismCore;

const SCALE = 100;

function createTextureBlob(
  texture: HTMLCanvasElement,
  vPx: number,
  vPy: number,
  vQx: number,
  vQy: number
): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const x = texture.width * vPx;
  const y = texture.height * (1 - vQy);
  const w = texture.width * (vQx - vPx);
  const h = texture.height * (vQy - vPy);
  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(texture, x, y, w, h, 0, 0, w, h);
  return canvas.toDataURL();
}

function drawPartTexture(
  texture: HTMLCanvasElement,
  indexCount: number,
  indexArray: Uint16Array,
  uvArray: Float32Array
) {
  if (indexCount <= 0) {
    return null;
  }
  const offCanvas = document.createElement("canvas");
  offCanvas.width = texture.width;
  offCanvas.height = texture.height;
  const w = texture.width;
  const h = texture.height;
  const ctx = offCanvas.getContext("2d");

  let x1 = Infinity;
  let y1 = Infinity;
  let x2 = -Infinity;
  let y2 = -Infinity;
  const path = new Path2D();
  for (let i = 0; i < indexCount; i += 3) {
    const [p, q, r] = indexArray.slice(i, i + 3);
    const [px, py] = uvArray.slice(p * 2, (p + 1) * 2);
    const [qx, qy] = uvArray.slice(q * 2, (q + 1) * 2);
    const [rx, ry] = uvArray.slice(r * 2, (r + 1) * 2);
    x1 = Math.min(x1, px, qx, rx);
    x2 = Math.max(x2, px, qx, rx);
    y1 = Math.min(y1, py, qy, ry);
    y2 = Math.max(y2, py, qy, ry);

    path.moveTo(px * w, (1 - py) * h);
    path.lineTo(qx * w, (1 - qy) * h);
    path.lineTo(rx * w, (1 - ry) * h);
    path.closePath();
  }
  ctx.clip(path, "nonzero");
  ctx.drawImage(texture, 0, 0);

  const retCanvas = document.createElement("canvas");
  retCanvas.width = (x2 - x1) * w;
  retCanvas.height = (y2 - y1) * h;
  const retCtx = retCanvas.getContext("2d");
  retCtx.drawImage(
    offCanvas,
    x1 * w,
    (1 - y2) * h,
    (x2 - x1) * w,
    (y2 - y1) * h,
    0,
    0,
    retCanvas.width,
    retCanvas.height
  );
  return retCanvas;
}

async function run() {
  const ret = await fetch("resources/Haru/Haru.moc3");
  const buf = await ret.arrayBuffer();

  const moc = core.Moc.fromArrayBuffer(buf);
  const model = core.Model.fromMoc(moc);
  const { drawables } = model;

  console.log(model);
  const sceneEl = document.getElementById("scene");

  const textures = await Promise.all(
    [
      "resources/Haru/Haru.2048/texture_00.png",
      "resources/Haru/Haru.2048/texture_01.png"
    ].map(
      src =>
        new Promise<HTMLCanvasElement>(res => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, 2048, 2048);
            res(canvas);
          };
          img.src = src;
        })
    )
  );

  for (let i = 0; i < drawables.count; i++) {
    const vCount = drawables.vertexCounts[i];
    const iCount = drawables.indexCounts[i];
    const vPosition = drawables.vertexPositions[i];
    const vUV = drawables.vertexUvs[i];
    const vIndex = drawables.indices[i];
    const texture = textures[drawables.textureIndices[i]];
    const opacity = drawables.opacities[i];

    const parentEl = document.createElement("div");
    let x1 = Infinity;
    let y1 = Infinity;
    let x2 = -Infinity;
    let y2 = -Infinity;

    for (let j = 0; j < vCount; j++) {
      const [x, y] = vPosition.slice(j * 2, (j + 1) * 2);
      x1 = Math.min(x1, x);
      x2 = Math.max(x2, x);
      y1 = Math.min(y1, y);
      y2 = Math.max(y2, y);
    }

    parentEl.style.position = "absolute";
    parentEl.style.width = `${(x2 - x1) * SCALE}vmin`;
    parentEl.style.height = `${(y2 - y1) * SCALE}vmin`;
    parentEl.style.transform = `translate3d(${x1 * SCALE}vmin, ${(1 - y2) *
      SCALE}vmin, 0)`;
    parentEl.style.zIndex = `${drawables.renderOrders[i]}`;
    parentEl.style.opacity = `${opacity}`;

    const texPartCanvas = drawPartTexture(texture, iCount, vIndex, vUV);
    if (texPartCanvas) {
      parentEl.style.backgroundImage = `url(${texPartCanvas.toDataURL()})`;
      parentEl.style.backgroundSize = "100%";
    }

    sceneEl.appendChild(parentEl);
  }
}

run();
