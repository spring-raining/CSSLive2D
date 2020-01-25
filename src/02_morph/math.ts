export const invert33 = (...matrix: number[]) => {
  const [a, b, c, d, e, f, g, h, i] = matrix;
  const det =
    1 / (a * e * i + b * f * g + c * d * h - c * e * g - b * d * i - a * f * h);
  return [
    (e * i - f * h) * det,
    -(b * i - c * h) * det,
    (b * f - c * e) * det,
    -(d * i - f * g) * det,
    (a * i - c * g) * det,
    -(a * f - c * d) * det,
    (d * h - e * g) * det,
    -(a * h - b * g) * det,
    (a * e - b * d) * det
  ];
};

export const invert44 = (...matrix: number[]) => {
  const [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p] = matrix;
  const q = a * f - b * e;
  const r = a * g - c * e;
  const s = a * h - d * e;
  const t = b * g - c * f;
  const u = b * h - d * f;
  const v = c * h - d * g;
  const w = i * n - j * m;
  const x = i * o - k * m;
  const y = i * p - l * m;
  const z = j * o - k * n;
  const A = j * p - l * n;
  const B = k * p - l * o;
  const det = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
  return [
    (f * B - g * A + h * z) * det,
    (-b * B + c * A - d * z) * det,
    (n * v - o * u + p * t) * det,
    (-j * v + k * u - l * t) * det,
    (-e * B + g * y - h * x) * det,
    (a * B - c * y + d * x) * det,
    (-m * v + o * s - p * r) * det,
    (i * v - k * s + l * r) * det,
    (e * A - f * y + h * w) * det,
    (-a * A + b * y - d * w) * det,
    (m * u - n * s + p * q) * det,
    (-i * u + j * s - l * q) * det,
    (-e * z + f * x - g * w) * det,
    (a * z - b * x + c * w) * det,
    (-m * t + n * r - o * q) * det,
    (i * t - j * r + k * q) * det
  ];
};
