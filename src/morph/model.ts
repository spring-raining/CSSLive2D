import {
  warpDeformer,
  rotateDeformer,
  WarpDeformerParam,
  RotateDeformerParam
} from "./deformer.js";

const svgURI = "http://www.w3.org/2000/svg";

interface ADeformerNode<T> {
  children?: DeformerNode<T>[];
  parts?: T[];
}

interface WarpDeformerNode<T> extends ADeformerNode<T> {
  type: "warp";
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  ctrlDivX: number;
  ctrlDivY: number;
  deformer?: WarpDeformerParam;
}

interface RotateDeformerNode<T> extends ADeformerNode<T> {
  type: "rotate";
  cx: number;
  cy: number;
  deformer?: RotateDeformerParam;
}

type DeformerNode<T> = WarpDeformerNode<T> | RotateDeformerNode<T>;

const model: DeformerNode<string> = {
  type: "warp",
  x1: -1,
  x2: 1,
  y1: -1,
  y2: 1,
  ctrlDivX: 1,
  ctrlDivY: 1,
  parts: [
    "D_PSD_10",
    "D_PSD_09",
    "D_PSD_08",
    "D_PSD_13",
    "D_PSD_12",
    "D_PSD_11",
    "D_PSD_16",
    "D_PSD_15",
    "D_PSD_14",
    "D_PSD_05",
    "D_PSD_02",
    "D_PSD_01",
    "D_PSD_00"
  ],
  children: [
    {
      type: "warp",
      x1: -0.15,
      x2: 0.15,
      y1: 0.4,
      y2: 0.7,
      ctrlDivX: 2,
      ctrlDivY: 2,
      parts: [
        "D_PSD_07",
        "D_PSD_06",
        "D_PSD_27",
        "D_PSD_26",
        "D_PSD_25",
        "D_PSD_24"
      ],
      deformer: [
        [
          [0.0, 0.0, -0.05, 0.0, -0.2, 0.0],
          [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
          [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        ],
        [
          [0.1, 0.0, 0.05, 0.0, 0.0, 0.0],
          [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
          [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        ]
      ],
      children: [
        {
          type: "rotate",
          cx: 0,
          cy: 0.49,
          deformer: [-5, 5],
          children: [
            {
              type: "warp",
              x1: -0.18,
              x2: 0.18,
              y1: 0.17,
              y2: 0.53,
              ctrlDivX: 1,
              ctrlDivY: 1,
              parts: [
                "D_PSD_30",
                "D_PSD_73",
                // "D_PSD_69",
                "D_PSD_64",
                "D_PSD_72",
                // "D_PSD_66",
                "D_PSD_63",
                // "D_PSD_65",
                "D_PSD_80",
                "D_PSD_79",
                // "D_PSD_68",
                "D_PSD_39",
                "D_PSD_44",
                "D_PSD_43",
                "D_PSD_60",
                "D_PSD_59",
                "D_PSD_58",
                "D_PSD_56",
                "D_PSD_54",
                "D_PSD_52",
                "D_PSD_50",
                "D_PSD_48",
                "D_PSD_46",
                "D_PSD_38",
                // "D_PSD_70",
                "D_PSD_40",
                "D_PSD_42",
                "D_PSD_41",
                "D_PSD_62",
                "D_PSD_61",
                "D_PSD_57",
                "D_PSD_55",
                "D_PSD_53",
                "D_PSD_51",
                "D_PSD_49",
                "D_PSD_47",
                "D_PSD_45",
                "D_PSD_37",
                "D_PSD_34",
                "D_PSD_33",
                "D_PSD_32",
                "D_PSD_31",
                "D_PSD_28",
                "D_PSD_29",
                "D_PSD_74",
                "D_PSD_75",
                "D_PSD_04"
              ],
              children: [
                {
                  type: "warp",
                  x1: -0.13,
                  x2: 0.13,
                  y1: 0.15,
                  y2: 0.45,
                  ctrlDivX: 3,
                  ctrlDivY: 3,
                  parts: ["D_PSD_78"],
                  deformer: [
                    [
                      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
                      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
                      [-0.1, 0.0, -0.1, 0.0, -0.1, 0.0, -0.1, 0.0],
                      [-0.3, 0.0, -0.3, 0.0, -0.3, 0.0, -0.3, 0.0]
                    ],
                    [
                      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
                      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
                      [0.1, 0.0, 0.1, 0.0, 0.1, 0.0, 0.1, 0.0],
                      [0.1, 0.0, 0.1, 0.0, 0.1, 0.0, 0.1, 0.0]
                    ]
                  ]
                },
                {
                  type: "warp",
                  x1: 0.07,
                  x2: 0.12,
                  y1: 0.28,
                  y2: 0.56,
                  ctrlDivX: 2,
                  ctrlDivY: 3,
                  parts: ["D_PSD_77"],
                  deformer: [
                    [
                      [0.0, 0.0, 0.0, 0.0],
                      [0.0, 0.0, 0.0, 0.0],
                      [-0.2, 0.0, -0.2, 0.0],
                      [-0.3, 0.0, -0.3, 0.0]
                    ],
                    [
                      [0.0, 0.0, 0.0, 0.0],
                      [0.0, 0.0, 0.0, 0.0],
                      [0.2, 0.0, 0.2, 0.0],
                      [0.3, 0.0, 0.3, 0.0]
                    ]
                  ]
                },
                {
                  type: "warp",
                  x1: -0.12,
                  x2: -0.07,
                  y1: 0.28,
                  y2: 0.56,
                  ctrlDivX: 1,
                  ctrlDivY: 3,
                  parts: ["D_PSD_76"],
                  deformer: [
                    [
                      [0.0, 0.0, 0.0, 0.0],
                      [0.0, 0.0, 0.0, 0.0],
                      [-0.2, 0.0, -0.2, 0.0],
                      [-0.3, 0.0, -0.3, 0.0]
                    ],
                    [
                      [0.0, 0.0, 0.0, 0.0],
                      [0.0, 0.0, 0.0, 0.0],
                      [0.2, 0.0, 0.2, 0.0],
                      [0.3, 0.0, 0.3, 0.0]
                    ]
                  ]
                },
                {
                  type: "warp",
                  x1: -0.2,
                  x2: -0.05,
                  y1: 0.3,
                  y2: 0.55,
                  ctrlDivX: 3,
                  ctrlDivY: 3,
                  parts: ["D_PSD_03"],
                  deformer: [
                    [
                      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
                      [-0.1, 0.0, -0.1, 0.0, -0.1, 0.0, -0.1, 0.0],
                      [-0.2, -0.1, -0.2, 0.0, -0.2, 0.0, -0.2, 0.0],
                      [-0.3, -0.1, -0.3, -0.1, -0.4, 0.0, -0.4, 0.0]
                    ],
                    [
                      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
                      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
                      [0.2, 0.0, 0.2, 0.0, 0.1, 0.0, 0.1, 0.0],
                      [0.2, 0.0, 0.2, 0.0, 0.1, 0.0, 0.1, 0.0]
                    ]
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

type PolyVertexPositionMap = {
  [id: string]: [number, number, number, number, number, number][];
};

export function getPolyVertexPositionMap({
  ids,
  indices,
  indexCounts,
  vertexPositions
}: {
  ids: string[];
  indices: Uint16Array[];
  indexCounts: Int32Array;
  vertexPositions: Float32Array[];
}): PolyVertexPositionMap {
  return ids.reduce((map, id, i) => {
    const indexArray = indices[i];
    const count = indexCounts[i];
    const vertexPosition = vertexPositions[i];
    const arr: [number, number, number, number, number, number][] = [];
    for (let i = 0; i < count; i += 3) {
      const [p, q, r] = indexArray.slice(i, i + 3);
      // prettier-ignore
      arr.push([
        vertexPosition[p * 2], 1 - vertexPosition[p * 2 + 1],
        vertexPosition[q * 2], 1 - vertexPosition[q * 2 + 1],
        vertexPosition[r * 2], 1 - vertexPosition[r * 2 + 1]
      ].map(i => i * 2400 / 2048) as [number, number, number, number, number, number]);
    }
    map[id] = arr;
    return map;
  }, {} as PolyVertexPositionMap);
}

type PolyVertexUvMap = {
  [id: string]: [number, number, number, number, number, number][];
};

export function getPolyVertexUvMap({
  ids,
  indices,
  indexCounts,
  vertexUvs
}: {
  ids: string[];
  indices: Uint16Array[];
  indexCounts: Int32Array;
  vertexUvs: Float32Array[];
}): PolyVertexUvMap {
  return ids.reduce((map, id, i) => {
    const indexArray = indices[i];
    const count = indexCounts[i];
    const vertexUv = vertexUvs[i];
    const arr: [number, number, number, number, number, number][] = [];
    for (let i = 0; i < count; i += 3) {
      const [p, q, r] = indexArray.slice(i, i + 3);
      // prettier-ignore
      arr.push([
        vertexUv[p * 2], 1 - vertexUv[p * 2 + 1],
        vertexUv[q * 2], 1 - vertexUv[q * 2 + 1],
        vertexUv[r * 2], 1 - vertexUv[r * 2 + 1]
      ]);
    }
    map[id] = arr;
    return map;
  }, {} as PolyVertexUvMap);
}

export function getModelNode(
  partsMap: {
    [id: string]: {
      element: SVGElement;
      order: number;
    };
  },
  polyVertexPosMap: PolyVertexPositionMap,
  polyVertexUvMap: PolyVertexUvMap
) {
  type Route = DeformerNode<string>[];
  const traceResult: {
    tracedRoute: Route;
    id: string;
    order: number;
  }[] = [];
  const trace = (node: DeformerNode<string>, route: Route) => {
    const tracedRoute = [...route, node];
    (node.parts || []).forEach(id => {
      if (id in partsMap) {
        traceResult.push({
          tracedRoute,
          id,
          order: partsMap[id].order
        });
      }
    });
    (node.children || []).forEach(n => trace(n, tracedRoute));
  };
  trace(model, []);

  const globalEl = document.createElementNS(svgURI, "g");
  traceResult.sort((a, b) => a.order - b.order);
  traceResult.forEach(({ tracedRoute, id }) => {
    console.log(id, tracedRoute);
    globalEl.appendChild(
      tracedRoute.reduceRight((el, node) => {
        if (node.type === "warp") {
          return warpDeformer(node)(el, polyVertexPosMap, polyVertexUvMap);
        }
        if (node.type === "rotate") {
          return rotateDeformer(node)(el);
        }
      }, partsMap[id].element)
    );
  });
  return globalEl;
}
