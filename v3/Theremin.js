import { semejanzaCromática, puntoCentral } from "./utils.js";

export class Theremin {
  constructor(canvas, video) {
    this.canvas = canvas;
    this.video = video;
    this.ctx = canvas.getContext("2d");

    this.colorDelMarcador = { r: 0, g: 0, b: 255 };
    this.centrosActivos = []; // Arreglo para almacenar los centros activos
    this.puntosDentro = [];
    

    this.#animate();
  }

  #animate() {
    const { ctx, canvas, video } = this;
    ctx.save(); // Guarda el estado actual del contexto
    ctx.scale(-1, 1); // Invierte el canvas en el eje X
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height); // Dibuja la imagen invertida
    ctx.restore(); // Restaura el estado original del contexto

    document.body.classList.add("grey-bg");

    const centerCanvasX = canvas.width / 2;
    const centerCanvasY = canvas.height / 2;
    const margenDistancia = 30;
    const ratioPuntosDentro = 0.8;
    const radioCirculo = 200;

    
    // Localiza en el canvas los puntos cuyo color se asemeja al color del marcador
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const nuevosPuntos = this.#obtenPuntosSegunColor(imageData, this.colorDelMarcador);
    // console.log("Puntos detectados:", puntos);

    // Añadir nuevos puntos a los puntos activos con el tiempo de creación
    const tiempoActual = Date.now();

    // Filtra los puntos que han pasado más de 5 segundos
    const tiempoLimite = 10000; // 5 segundos en milisegundos
    
    // Detecta un punto central representativo de un número limitado de puntos
    // const centro = this.#puntoIntermedio(this.puntosActivos);
    

    // taxi-distancia (rombo):
    // centro.x-centerCanvasX + centro.y-centerCanvasY < margenDistancia

    // distancia del máximo (cuadrado):
    // max(centro.x-centerCanvasX, centro.y-centerCanvasY) < margenDistancia
    const centro = this.#puntoIntermedio(nuevosPuntos);
    if (centro != null){
      if (Math.abs(Math.sqrt((centro.x-centerCanvasX)**2+(centro.y-centerCanvasY)**2)-radioCirculo) < margenDistancia) {
        this.puntosDentro.push({ ...centro,tiempoCreacion: tiempoActual});
      }
    }

    this.centrosActivos.push({ ...centro,tiempoCreacion: tiempoActual});
    this.centrosActivos = this.centrosActivos.filter(centro => {
        return (tiempoActual - centro.tiempoCreacion) < tiempoLimite; });
    this.puntosDentro = this.puntosDentro.filter(centro => {
        return (tiempoActual - centro.tiempoCreacion) < tiempoLimite; });

    
    const N=3
    let check = false;
    let j;
    j=0;
    for(let i=-N; i<N; i++){
      check = false;
      for (let k=0; k<this.puntosDentro.length; k++){
        let p = this.puntosDentro[k];
        const alpha = Math.atan2(p.y-centerCanvasY, p.x-centerCanvasX);
        // if (Math.atan2(p.y-centerCanvasY, p.x-centerCanvasX) < i*2*Math.PI/N && Math.atan2(p.y-centerCanvasY, p.x-centerCanvasX) > (i-1)*2*Math.PI/N){
        if ( alpha < (i+1)*Math.PI/N && alpha > i*Math.PI/N){
          check = true;
          j++;
          break;
        }
      }
      if (!check){
        break;
      }
    }
    console.log("Check status:", check);

    const contadorPuntosDentro = this.puntosDentro.length;
    const contadorPuntosActivo = this.centrosActivos.length

    if (contadorPuntosDentro >= ratioPuntosDentro*contadorPuntosActivo && check){
      document.body.classList.remove("grey-bg");
      document.body.classList.add("green-bg");
      // Crear el mensaje de "Congratulations" solo si no existe ya
      if (!document.getElementById("congratulations")) {
        const congratsMessage = document.createElement("div");
        congratsMessage.id = "congratulations";
        congratsMessage.textContent = "¡Enhorabuena!";
        congratsMessage.style.position = "absolute";
        congratsMessage.style.top = "50%";
        congratsMessage.style.left = "50%";
        congratsMessage.style.transform = "translate(-50%, -50%)";
        congratsMessage.style.color = "white";
        congratsMessage.style.fontSize = "2rem";
        congratsMessage.style.fontWeight = "bold";
        document.body.appendChild(congratsMessage);
      }
    } else {
      document.body.classList.remove("green-bg");
      document.body.classList.add("grey-bg");

      // Eliminar el mensaje "Congratulations" si existe
      const congratsMessage = document.getElementById("congratulations");
      if (congratsMessage) {
        congratsMessage.remove();
      }
    }
    
    
    let prev_centro = this.centrosActivos[0];
    // Draw the circle
    ctx.beginPath();
    ctx.setLineDash([10, 15]);
    ctx.arc(centerCanvasX, centerCanvasY, radioCirculo, 0, Math.PI * 2); // 50 is the radius of the circle
    ctx.strokeStyle = 'black'; // Set the fill color
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.closePath();

    if (this.centrosActivos.length > 0){
      for (const centro of this.centrosActivos){
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 5;
        ctx.moveTo(prev_centro.x, prev_centro.y);
        ctx.lineTo(centro.x, centro.y);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        
        prev_centro = centro;
      }
    }

    ctx.closePath();
    

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

  #puntoIntermedio(puntos) {
    if (puntos.length === 0) return null;

    // Encuentra un punto central entre los puntos
    const sumaX = puntos.reduce((sum, punto) => sum + punto.x, 0);
    const sumaY = puntos.reduce((sum, punto) => sum + punto.y, 0);

    const cantidadPuntos = puntos.length;
    return {
      x: sumaX / cantidadPuntos,
      y: sumaY / cantidadPuntos,
    };

  
  }
}