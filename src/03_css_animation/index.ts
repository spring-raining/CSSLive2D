import {
  getModelNode,
  getPolyVertexPositionMap,
  getPolyVertexUvMap
} from "./model.js";

const core = Live2DCubismCore;

const svgURI = "http://www.w3.org/2000/svg";
const xlinkURI = "http://www.w3.org/1999/xlink";

const rand = () => {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  return [...a].map(i => i.toString(16)).join("");
};

function drawPartGroup(
  texture: HTMLCanvasElement,
  textureName: string,
  indexCount: number,
  indexArray: Uint16Array,
  positionArray: Float32Array,
  uvArray: Float32Array
) {
  if (indexCount <= 0) {
    return null;
  }
  const w = texture.width;
  const h = texture.height;
  const defsEl = document.getElementById("svgDefs");

  const getTexClipPath = (p: number, q: number, r: number) => {
    const [px, py] = uvArray.slice(p * 2, (p + 1) * 2);
    const [qx, qy] = uvArray.slice(q * 2, (q + 1) * 2);
    const [rx, ry] = uvArray.slice(r * 2, (r + 1) * 2);
    const el = document.createElementNS(svgURI, "path");
    el.setAttribute(
      "d",
      `M ${px * w} ${(1 - py) * h} L ${qx * w} ${(1 - qy) * h} L ${rx *
        w} ${(1 - ry) * h} Z`
    );
    const clipPathEl = document.createElementNS(svgURI, "clipPath");
    clipPathEl.appendChild(el);
    return clipPathEl;
  };

  let x1 = Infinity;
  let y1 = Infinity;
  let x2 = -Infinity;
  let y2 = -Infinity;
  let tx1 = Infinity;
  let ty1 = Infinity;
  let tx2 = -Infinity;
  let ty2 = -Infinity;

  const parentEl = document.createElementNS(svgURI, "g");
  for (let i = 0; i < indexCount; i += 3) {
    const [p, q, r] = indexArray.slice(i, i + 3);
    const [px, py] = positionArray.slice(p * 2, (p + 1) * 2);
    const [qx, qy] = positionArray.slice(q * 2, (q + 1) * 2);
    const [rx, ry] = positionArray.slice(r * 2, (r + 1) * 2);
    const [tpx, tpy] = uvArray.slice(p * 2, (p + 1) * 2);
    const [tqx, tqy] = uvArray.slice(q * 2, (q + 1) * 2);
    const [trx, trY] = uvArray.slice(r * 2, (r + 1) * 2);
    x1 = Math.min(x1, px, qx, rx);
    x2 = Math.max(x2, px, qx, rx);
    y1 = Math.min(y1, py, qy, ry);
    y2 = Math.max(y2, py, qy, ry);
    tx1 = Math.min(tx1, tpx, tqx, trx);
    tx2 = Math.max(tx2, tpx, tqx, trx);
    ty1 = Math.min(ty1, tpy, tqy, trY);
    ty2 = Math.max(ty2, tpy, tqy, trY);

    const poly = document.createElementNS(svgURI, "use");
    const id = rand();

    const clipPath = getTexClipPath(p, q, r);
    clipPath.setAttribute("id", `clip_${id}`);
    defsEl.appendChild(clipPath);

    poly.setAttributeNS(xlinkURI, "xlink:href", `#${textureName}`);
    poly.setAttribute("clip-path", `url(#clip_${id})`);
    const gr = document.createElementNS(svgURI, "g");
    gr.appendChild(poly);
    parentEl.appendChild(gr);
  }
  return parentEl;
}
function drawDebugPoly(
  texture: HTMLCanvasElement,
  textureName: string,
  indexCount: number,
  indexArray: Uint16Array,
  positionArray: Float32Array,
  uvArray: Float32Array
) {
  if (indexCount <= 0) {
    return null;
  }
  const w = texture.width;
  const h = texture.height;
  const getPoly = (p: number, q: number, r: number) => {
    const [px, py] = positionArray.slice(p * 2, (p + 1) * 2);
    const [qx, qy] = positionArray.slice(q * 2, (q + 1) * 2);
    const [rx, ry] = positionArray.slice(r * 2, (r + 1) * 2);
    const el = document.createElementNS(svgURI, "path");
    el.setAttribute(
      "d",
      `M ${px * 2400} ${(1 - py) * 2400} L ${qx * 2400} ${(1 - qy) *
        2400} L ${rx * 2400} ${(1 - ry) * 2400} Z`
    );
    // el.style.position = "absolute";
    // el.style.width = `${(x2 - x1) * SCALE}vmin`;
    // el.style.height = `${(y2 - y1) * SCALE}vmin`;
    // el.style.transform = `translate3d(${x1 * SCALE}vmin, ${(1 - y2) *
    //   SCALE}vmin, 0)`;
    el.setAttribute("fill", "rgba(0, 255, 0, 0.2)");
    return el;
  };

  const debugPolyEl = document.createElementNS(svgURI, "g");
  for (let i = 0; i < indexCount; i += 3) {
    const [p, q, r] = indexArray.slice(i, i + 3);
    debugPolyEl.appendChild(getPoly(p, q, r));
  }
  return debugPolyEl;
}

async function run() {
  const ret = await fetch("resources/Haru/Haru.moc3");
  const buf = await ret.arrayBuffer();

  const moc = core.Moc.fromArrayBuffer(buf);
  const model = core.Model.fromMoc(moc);
  const { drawables } = model;

  console.log(model);
  const sceneEl = document.getElementById("svgScene");

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

  const partArr = [];
  const partsMap: {
    [id: string]: {
      element: SVGElement;
      order: number;
    };
  } = {};

  for (let i = 0; i < drawables.count; i++) {
    const vCount = drawables.vertexCounts[i];
    const iCount = drawables.indexCounts[i];
    const vPosition = drawables.vertexPositions[i];
    const vUV = drawables.vertexUvs[i];
    const vIndex = drawables.indices[i];
    const texture = textures[drawables.textureIndices[i]];
    const tIndex = drawables.textureIndices[i];
    const opacity = drawables.opacities[i];

    // const parentEl = document.createElement("div");
    const parentEl = drawPartGroup(
      texture,
      ["texture_00", "texture_01"][tIndex],
      iCount,
      vIndex,
      vPosition,
      vUV
    );
    const debugPolyEl = drawDebugPoly(
      texture,
      ["texture_00", "texture_01"][tIndex],
      iCount,
      vIndex,
      vPosition,
      vUV
    );

    parentEl.setAttribute("data-drawable-id", drawables.ids[i]);
    partArr.push({
      order: drawables.renderOrders[i],
      el: parentEl,
      id: drawables.ids[i]
      // debugPolyEl
    });
    partsMap[drawables.ids[i]] = {
      element: parentEl,
      order: drawables.renderOrders[i]
    };
  }
  const polyVertexPositionMap = getPolyVertexPositionMap(drawables);
  const polyVertexUvMap = getPolyVertexUvMap(drawables);
  const globalEl = document.createElementNS(svgURI, "g");
  globalEl.appendChild(
    getModelNode(partsMap, polyVertexPositionMap, polyVertexUvMap)
  );
  globalEl.setAttribute("transform", "translate(1024,0) scale(0.5)");
  sceneEl.appendChild(globalEl);

  const entireDOM = document.documentElement.cloneNode(true) as Element;
  [...entireDOM.querySelectorAll("script.builder")].forEach(el => el.remove());
  const body = entireDOM.querySelector("body");
  body.classList.add("loading");
  body.setAttribute("onload", "this.document.body.classList.remove('loading')");

  const url = URL.createObjectURL(
    new Blob([entireDOM.outerHTML], { type: "text/html" })
  );
  const a = document.createElement("a");
  a.download = "out.html";
  a.href = url;
  document.body.appendChild(a);
  a.click();

  document.body.classList.remove("loading");
}

run();
