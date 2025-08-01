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
