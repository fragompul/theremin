export function semejanzaCromática(p1, p2, threshold = 160) {
  // Calcula la semejanza cromática entre dos pixeles p1 y p2
  // Un pixel se interpreta como un punto (r,g,b) en un espacio tridimensional
  // La semejanza de dos puntos (pixeles) se corresponde con
  // la distancia euclídea entre ambos en el espacio tridimensional RGB.
  // Se usa un ajuste de la distancia euclidea para mejorar el rendimiento

  // Primera versión: muy estricta (el pixel debe tener exactamente los mismos valores)
  //     return c1.r === c2.r && c1.g == c2.g && c1.b == c2.b;
  // Segunda versión:  distancia euclídea (muy coostosa compuntacionalmente)

  const sqDistance = (p1.r - p2.r) ** 2 + (p1.g - p2.g) ** 2 + (p1.b - p2.b) ** 2;

  return sqDistance < threshold * threshold;
}

// Calcula el punto central de una nube de puntos
export function puntoCentral(puntos) {
  const res = { x: 0, y: 0 };

  puntos.forEach((loc) => {
    res.x += loc.x;
    res.y += loc.y;
  });
  res.x /= puntos.length;
  res.y /= puntos.length;

  return res;
}

export function linearRegression(points) {
  const n = points.length;
  
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

  points.forEach(([x, y]) => {
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
  });

  const meanX = sumX / n;
  const meanY = sumY / n;

  const lineal_m = (sumXY * n - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const lineal_b = meanY - lineal_m * meanX;

  return { lineal_m, lineal_b };

}
export function meanErrorLinear(points, m, b) {
  let ssRes = 0;  // Suma de los errores al cuadrado
  const meanY = points.reduce((acc, [, y]) => acc + y, 0) / points.length;

  points.forEach(([x, y]) => {
    if (y!=0){

      const yPred = m * x + b;
      ssRes += ((y - yPred) ** 2)/y;
    }
  });
  ssRes = ssRes / points.length

  return ssRes;
}

export function calculateRSquared(points, m, b) {
  let ssRes = 0;  // Suma de los errores al cuadrado
  let ssTot = 0;  // Suma de las desviaciones al cuadrado
  const meanY = points.reduce((acc, [, y]) => acc + y, 0) / points.length;

  points.forEach(([x, y]) => {
      const yPred = m * x + b;
      ssRes += (y - yPred) ** 2;
      ssTot += (y) ** 2;
  });

  const rSquared = 1 - (ssRes / ssTot);
  return rSquared;
}


export function quadraticRegression(points) {
  const n = points.length;

  let sumX = 0, sumY = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0, sumXY = 0, sumX2Y = 0;

  points.forEach(([x, y]) => {
    sumX += x;
    sumY += y;
    sumX2 += x * x;
    sumX3 += x * x * x;
    sumX4 += x * x * x * x;
    sumXY += x * y;
    sumX2Y += x * x * y;
  });

  const matrix = [
    [n, sumX, sumX2],
    [sumX, sumX2, sumX3],
    [sumX2, sumX3, sumX4]
  ];

  const constants = [sumY, sumXY, sumX2Y];

  const [a, b, c] = solveLinearSystem(matrix, constants);

  return [ a, b, c ];
}

export function calculateRSquaredQuadratic(points, a, b, c) {
  let ssRes = 0;  // Suma de los errores al cuadrado
  let ssTot = 0;  // Suma de las desviaciones al cuadrado
  const meanY = points.reduce((acc, [, y]) => acc + y, 0) / points.length;

  points.forEach(([x, y]) => {
    const yPred = c * x * x + b * x + a;
    ssRes += (y - yPred) ** 2;
    ssTot += (y - meanY) ** 2;
  });

  const rSquared = 1 - (ssRes / ssTot);
  return rSquared;
}

function solveLinearSystem(matrix, constants) {
  const [a, b, c] = matrix;
  const [d, e, f] = constants;

  const det = a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]);

  const detA = d * (b[1] * c[2] - b[2] * c[1]) - e * (b[0] * c[2] - b[2] * c[0]) + f * (b[0] * c[1] - b[1] * c[0]);
  const detB = a[0] * (e * c[2] - f * c[1]) - a[1] * (d * c[2] - f * c[0]) + a[2] * (d * c[1] - e * c[0]);
  const detC = a[0] * (b[1] * f - b[2] * e) - a[1] * (b[0] * f - b[2] * d) + a[2] * (b[0] * e - b[1] * d);

  return [detA / det, detB / det, detC / det];
}
