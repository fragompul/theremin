import { semejanzaCromática, puntoCentral } from "./utils.js";

export class Theremin {
  constructor(canvas, video) {
    this.canvas = canvas;
    this.video = video;
    this.ctx = canvas.getContext("2d");

    this.colorDelMarcador = { r: 0, g: 0, b: 255 };

    const audioCtx = new AudioContext();
    this.osc = audioCtx.createOscillator();
    this.gainNode = audioCtx.createGain();
    this.osc.connect(audioCtx.destination);
    this.gainNode.connect(audioCtx.destination); // Conectar el nodo de ganancia a la salida
    this.freq = 0;
    this.osc.frequency.value = this.freq;
    this.osc.start();

    this.#animate();
  }

  #animate() {
    const { ctx, canvas, video } = this;
    ctx.save(); // Guarda el estado actual del contexto
    ctx.scale(-1, 1); // Invierte el canvas en el eje X
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height); // Dibuja la imagen invertida
    ctx.restore(); // Restaura el estado original del contexto

    // Localiza en el canvas los puntos cuyo color se asemeja al color del marcador
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const puntos = this.#obtenPuntosSegunColor(imageData, this.colorDelMarcador);

    // console.log("Puntos detectados:", puntos);

    if (puntos.length > 0) {
      // Calcula un punto central representativo de todos los puntos localizados
      const centro = puntoCentral(puntos);

      // Asociación de la altura a la que se encuentra el marcador
      // con la frecuencia del sonido que se emitirá
      const p = 1 - centro.y / canvas.height;
      this.freq = 200 + 500 * p;
      this.osc.frequency.value = this.freq;

      // Ajusta la amplitud (ganancia) en función de la distancia horizontal
      const ganancia = centro.x / canvas.width; // Normaliza la posición x entre 0 y 1
      this.gainNode.gain.value = ganancia; // Asigna la ganancia
      
      // Dibuja una línea horizontal a la altura del centro calculado
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 5;
      ctx.moveTo(0, centro.y);
      ctx.lineTo(canvas.width, centro.y);
      ctx.stroke();
      ctx.closePath();

      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.moveTo(centro.x, 0);
      ctx.lineTo(centro.x, canvas.height);
      ctx.stroke();
      ctx.closePath();
    } else {
      // Si no se detecta el marcador, no se emitirá sonido
      this.freq = 0;
      this.osc.frequency.value = this.freq;
    }

    // Acceso a la leyenda para mostrar la por pantalla la frecuencia emitida
    const freqNode = document.getElementById("freq");
    const valorFreq = Math.floor(this.freq);
    freqNode.innerText = valorFreq.toString();

    // Acceso a la leyenda para mostrar la por pantalla la frecuencia emitida
    const amplNode = document.getElementById("ampl");
    const valorAmpl = Math.floor(this.gainNode.gain.value * 100); // Escalar a porcentaje
    amplNode.innerText = valorAmpl.toString(); // Usar gainNode.gain.value en lugar de this.ampl

    // OJO: La función bind() se necesita para solvnetar el problema de "pérdida" del objeto this
    // El objeto this de un método callback en una clase no es el mismo this de la clase
    // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    requestAnimationFrame(this.#animate.bind(this));
  }

  #obtenPuntosSegunColor(imageData, color) {
    const puntos = [];

    // imageDatata almacena en .data el mapa de bits de la imagen mediante un array de números
    // organizados en cuatro valores RGBA (pixel). Los pixeles figuran consecutivamente
    // según su aparición según el orden primero fila y después columna.

    for (let i = 0; i < imageData.data.length; i += 4) {
      // Se recupera el pixel como combinación de tres valores RGB (el componente A es ignorado)
      const pixel = {
        r: imageData.data[i],
        g: imageData.data[i + 1],
        b: imageData.data[i + 2],
      };

      // Se comprueba si el pixel es semejante al color deseado
      if (semejanzaCromática(pixel, color)) {
        // Calcula la localización punto (x,y) del pixel en el mapa de bits
        const pixelIndex = i / 4;
        const localizacionPixel = {
          x: pixelIndex % imageData.width,
          y: Math.floor(pixelIndex / imageData.width),
        };

        puntos.push(localizacionPixel);
      }
    }
    return puntos;
  }
}
