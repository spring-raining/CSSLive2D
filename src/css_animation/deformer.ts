import { invert33 } from "./math.js";

const svgURI = "http://www.w3.org/2000/svg";
const DEBUG = false;

type PlainDeformPos = [
  [number, number, number, number],
  [number, number, number, number]
];
export type WarpDeformerParam = [number[][], number[][]];
export type PlainDeformerParam = [PlainDeformPos, PlainDeformPos];
export type RotateDeformerParam = [number, number];

const interpolate = (p: number, q: number, ratio: number) =>
  p * (1 - ratio) + q * ratio;

const minmax = (min: number, max: number) => (n: number) =>
  Math.max(min, Math.min(max, n));

const round = (n: number) => Math.round(n * 1000) / 1000;

const rand = () => {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  return [...a].map(i => i.toString(16)).join("");
};

const style = document.getElementById("style");

const getMatrix = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
  x5: number,
  y5: number,
  x6: number,
  y6: number
) => {
  const invA = invert33(x1, y1, 1, x3, y3, 1, x5, y5, 1);
  const m = [
    invA[0] * x2 + invA[1] * x4 + invA[2] * x6,
    invA[0] * y2 + invA[1] * y4 + invA[2] * y6,
    invA[3] * x2 + invA[4] * x4 + invA[5] * x6,
    invA[3] * y2 + invA[4] * y4 + invA[5] * y6,
    invA[6] * x2 + invA[7] * x4 + invA[8] * x6,
    invA[6] * y2 + invA[7] * y4 + invA[8] * y6
  ];
  return `matrix(${round(m[0])},${round(m[1])},${round(m[2])},${round(
    m[3]
  )},${round(m[4])},${round(m[5])})`;
};

const getSubDeformer = (deformer?: number[][]) => (
  x: number,
  y: number
): PlainDeformPos =>
  deformer
    ? ([
        deformer[y].slice(2 * x, 2 * x + 4),
        deformer[y + 1].slice(2 * x, 2 * x + 4)
      ] as PlainDeformPos)
    : [
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];

export const warpDeformer = ({
  x1,
  x2,
  y1,
  y2,
  ctrlDivX,
  ctrlDivY,
  deformer
}: {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  ctrlDivX: number;
  ctrlDivY: number;
  deformer?: WarpDeformerParam;
}) => (
  part: SVGElement,
  polyVertexPosMap: Record<
    string,
    [number, number, number, number, number, number][]
  >,
  polyVertexUvMap: Record<
    string,
    [number, number, number, number, number, number][]
  >
) => {
  const g = document.createElementNS(svgURI, "g");
  const id = part.dataset.drawableId;

  if (id) {
    // leaf node
    [...part.childNodes].forEach((el, i) => {
      const pos = polyVertexPosMap[id][i];

      const w = (x2 - x1) / ctrlDivX;
      const h = (y2 - y1) / ctrlDivY;
      const div: number[] = [];
      const ipl: number[] = [];
      for (let j = 0; j < 3; j++) {
        div.push(
          minmax(
            0,
            ctrlDivX
          )(Math.floor((ctrlDivX * (pos[j * 2] - x1)) / (x2 - x1))),
          minmax(
            0,
            ctrlDivY
          )(Math.floor((ctrlDivY * (pos[j * 2 + 1] - y1)) / (y2 - y1)))
        );
        ipl.push(
          ((((pos[j * 2] - x1) % w) + w) % w) / w,
          ((((pos[j * 2 + 1] - y1) % h) + h) % h) / h
        );
      }

      const calcTransformValue = (angle: number) => {
        const src = polyVertexUvMap[id][i];
        const dst: number[] = [];
        for (let j = 0; j < 3; j++) {
          const divX = div[j * 2];
          const divY = div[j * 2 + 1];
          const iplX = ipl[j * 2];
          const iplY = ipl[j * 2 + 1];
          const sdf = getSubDeformer(
            deformer && (angle < 0 ? deformer[0] : deformer[1])
          )(divX, divY);
          dst.push(
            interpolate(
              interpolate(
                x1 + w * (divX + Math.abs(angle) * sdf[0][0]),
                x1 + w * (divX + Math.abs(angle) * sdf[0][2] + 1),
                iplX
              ),
              interpolate(
                x1 + w * (divX + Math.abs(angle) * sdf[1][0]),
                x1 + w * (divX + Math.abs(angle) * sdf[1][2] + 1),
                iplX
              ),
              iplY
            ),
            interpolate(
              interpolate(
                y1 + h * (divY + Math.abs(angle) * sdf[0][1]),
                y1 + h * (divY + Math.abs(angle) * sdf[1][1] + 1),
                iplY
              ),
              interpolate(
                y1 + h * (divY + Math.abs(angle) * sdf[0][3]),
                y1 + h * (divY + Math.abs(angle) * sdf[1][3] + 1),
                iplY
              ),
              iplX
            )
          );
        }
        return getMatrix(
          src[0] * 2048,
          src[1] * 2048,
          dst[0] * 2048,
          dst[1] * 2048,
          src[2] * 2048,
          src[3] * 2048,
          dst[2] * 2048,
          dst[3] * 2048,
          src[4] * 2048,
          src[5] * 2048,
          dst[4] * 2048,
          dst[5] * 2048
        );
      };
      const polyId = `poly_${rand()}`;
      (el as SVGGElement).dataset.poly = polyId;

      if (deformer) {
        style.textContent += `
          @keyframes anim_${polyId} {
            0% {
              transform: ${calcTransformValue(-1)};
              animation-timing-function: cubic-bezier(0.34, 0, 0.64, 0.43);
            }
            50% {
              transform: ${calcTransformValue(0)};
              animation-timing-function: cubic-bezier(0.36, 0.57, 0.66, 1);
            }
            100% {
              transform: ${calcTransformValue(1)};
            }
          }
          [data-poly="${polyId}"] {
            animation: 2s linear 0s infinite alternate anim_${polyId};
          }`;
      } else {
        style.textContent += `
          [data-poly="${polyId}"] {
            transform: ${calcTransformValue(0)};
          }`;
      }
      g.dataset.part = id;
      g.appendChild(el);
    });
  } else {
    // intermediate node
    g.appendChild(part);
  }

  if (DEBUG) {
    const rect = document.createElementNS(svgURI, "rect");
    rect.setAttribute("x", `${x1 * 2048}`);
    rect.setAttribute("y", `${y1 * 2048}`);
    rect.setAttribute("width", `${(x2 - x1) * 2048}`);
    rect.setAttribute("height", `${(y2 - y1) * 2048}`);
    rect.setAttribute("fill", "none");
    rect.setAttribute("stroke", "#0000ff");
    g.appendChild(rect);
  }
  return g;
};

export const rotateDeformer = ({
  cx,
  cy,
  deformer
}: {
  cx: number;
  cy: number;
  deformer?: RotateDeformerParam;
}) => (part: SVGElement) => {
  const g = document.createElementNS(svgURI, "g");
  g.appendChild(part);
  if (DEBUG) {
    const circle = document.createElementNS(svgURI, "circle");
    circle.setAttribute("cx", `${cx * 2048}`);
    circle.setAttribute("cy", `${cy * 2048}`);
    circle.setAttribute("r", "5");
    circle.setAttribute("fill", "#ff0000");
    const line = document.createElementNS(svgURI, "line");
    line.setAttribute("x1", `${cx * 2048}`);
    line.setAttribute("x2", `${cx * 2048}`);
    line.setAttribute("y1", `${cy * 2048}`);
    line.setAttribute("y2", `${(cy - 0.1) * 2048}`);
    line.setAttribute("stroke", "#ff0000");
    line.setAttribute("stroke-width", "1");
    g.appendChild(circle);
    g.appendChild(line);
  }

  const calcTransformValue = (angle: number) => {
    const rot = deformer ? (angle < 0 ? deformer[0] : deformer[1]) : 0;
    return `rotate(${Math.abs(angle) * rot}deg)`;
  };

  if (deformer) {
    const rotateId = `rotate_${rand()}`;
    g.dataset.rotate = rotateId;
    style.textContent += `
      @keyframes anim_${rotateId} {
        0% {
          transform: ${calcTransformValue(-1)};
          animation-timing-function: cubic-bezier(0.34, 0, 0.64, 0.43);
        }
        50% {
          transform: ${calcTransformValue(0)};
          animation-timing-function: cubic-bezier(0.36, 0.57, 0.66, 1);
        }
        100% {
          transform: ${calcTransformValue(1)};
        }
      }
      [data-rotate="${rotateId}"] {
        animation: 2s linear 0s infinite alternate anim_${rotateId};
        transform-origin: ${cx * 2048}px ${cy * 2048}px;
      }`;
  }
  return g;
};
