import { semejanzaCromática, puntoCentral } from "./utils.js";

export class Theremin {
  constructor(canvas, video) {
    this.canvas = canvas;
    this.video = video;
    this.ctx = canvas.getContext("2d");

    this.colorDelMarcador = { r: 0, g: 0, b: 255 };
    this.centrosActivos = []; // Arreglo para almacenar los centros activos
    this.puntosDentro1 = [];
    this.puntosDentro2 = [];
    this.puntosDentro3 = [];
    this.puntosDentro4 = [];   
    this.exito1 = false;
    this.exito2 = false;
    this.exito3 = false;
    this.exito4 = false; 

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
    const c1x = centerCanvasX;
    const c1y = centerCanvasY;
    const c2x = centerCanvasX;
    const c2y = centerCanvasY;
    const c3x = centerCanvasX
    const c3y = centerCanvasY;
    const c4x = centerCanvasX
    const c4y = centerCanvasY;
    const margenDistancia = 30;
    const ratioPuntosDentro = 0.8;
    const radioCirculo = 200;
    const min_puntos=50;

    
    // Localiza en el canvas los puntos cuyo color se asemeja al color del marcador
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const nuevosPuntos = this.#obtenPuntosSegunColor(imageData, this.colorDelMarcador);
    // console.log("Puntos detectados:", puntos);

    // Añadir nuevos puntos a los puntos activos con el tiempo de creación
    const tiempoActual = Date.now();

    // Filtra los puntos que han pasado más de 5 segundos
    const tiempoLimite = 2000; // 5 segundos en milisegundos
    
    // Detecta un punto central representativo de un número limitado de puntos
    // const centro = this.#puntoIntermedio(this.puntosActivos);
    

    // taxi-distancia (rombo):
    // centro.x-centerCanvasX + centro.y-centerCanvasY < margenDistancia

    // distancia del máximo (cuadrado):
    // max(centro.x-centerCanvasX, centro.y-centerCanvasY) < margenDistancia
    const centro = this.#puntoIntermedio(nuevosPuntos);
    if (centro != null){
      if (centro.x < c1x+90 && centro.x > c1x-90 && centro.y < c1y+20 && centro.y > c1y-20) {
        this.puntosDentro1.push({ ...centro,tiempoCreacion: tiempoActual});
      }
      if(Math.abs(Math.sqrt((centro.x-c2x)**2+(centro.y-(c2y-20))**2)-100) < 1.5*margenDistancia && centro.y > c2y){
        this.puntosDentro2.push({ ...centro,tiempoCreacion: tiempoActual});
      }
      if((centro.x-c3x) + (centro.y-c3y) < 0.5*margenDistancia &&  Math.abs(centro.x-c3x) < 100){
        this.puntosDentro3.push({ ...centro,tiempoCreacion: tiempoActual});
      }
      if((centro.x-c4x) - (centro.y-c4y) < 0.5*margenDistancia &&  Math.abs(centro.x-c4x) < 100){
        this.puntosDentro4.push({ ...centro,tiempoCreacion: tiempoActual});
      }
    }

    this.centrosActivos.push({ ...centro,tiempoCreacion: tiempoActual});
    this.centrosActivos = this.centrosActivos.filter(centro => {
        return (tiempoActual - centro.tiempoCreacion) < tiempoLimite; });
    this.puntosDentro1 = this.puntosDentro1.filter(centro => {
        return (tiempoActual - centro.tiempoCreacion) < tiempoLimite; });
    this.puntosDentro2 = this.puntosDentro2.filter(centro => {
        return (tiempoActual - centro.tiempoCreacion) < tiempoLimite; });
    this.puntosDentro3 = this.puntosDentro3.filter(centro => {
        return (tiempoActual - centro.tiempoCreacion) < tiempoLimite; });
    this.puntosDentro4 = this.puntosDentro4.filter(centro => {
        return (tiempoActual - centro.tiempoCreacion) < tiempoLimite; });

    
    const N=3
    let check = true;
    // let j;
    // j=0;
    // for(let i=-N; i<N; i++){
    //   check = false;
    //   for (let k=0; k<this.puntosDentro.length; k++){
    //     let p = this.puntosDentro[k];
    //     const alpha = Math.atan2(p.y-centerCanvasY, p.x-centerCanvasX);
    //     // if (Math.atan2(p.y-centerCanvasY, p.x-centerCanvasX) < i*2*Math.PI/N && Math.atan2(p.y-centerCanvasY, p.x-centerCanvasX) > (i-1)*2*Math.PI/N){
    //     if ( alpha < (i+1)*Math.PI/N && alpha > i*Math.PI/N){
    //       check = true;
    //       j++;
    //       break;
    //     }
    //   }
    //   if (!check){
    //     break;
    //   }
    // }
    console.log("Check status:", check);

    const contadorPuntosActivo = this.centrosActivos.length

    if (this.puntosDentro1.length >= Math.max(ratioPuntosDentro*contadorPuntosActivo,min_puntos) && check){
      this.exito1 = true;
      document.body.classList.remove("grey-bg");
      document.body.classList.add("green-bg");
      // Crear el mensaje de "Congratulations" solo si no existe ya
      if (!document.getElementById("congratulations")) {
        const congratsMessage = document.createElement("div");
        congratsMessage.id = "congratulations";
        congratsMessage.textContent = "¡Enhorabuena! Has pintado la línea recta";
        congratsMessage.style.position = "absolute";
        congratsMessage.style.top = "50%";
        congratsMessage.style.left = "50%";
        congratsMessage.style.transform = "translate(-50%, -50%)";
        congratsMessage.style.color = "white";
        congratsMessage.style.fontSize = "2rem";
        congratsMessage.style.fontWeight = "bold";
        document.body.appendChild(congratsMessage);
        // Crear el número 1 grande
        const previousNumber = document.getElementById("big-number");
        if (previousNumber) {
          previousNumber.remove();
        }
        const bigNumber = document.createElement("div");
        bigNumber.id = "big-number";
        bigNumber.textContent = "1";
        bigNumber.style.position = "absolute";
        bigNumber.style.top = "20%";
        bigNumber.style.left = "50%";
        bigNumber.style.transform = "translate(-50%, -50%)";
        bigNumber.style.color = "green"; // Puedes cambiar el color si lo deseas
        bigNumber.style.fontSize = "5rem"; // Tamaño grande
        bigNumber.style.fontWeight = "bold";
        document.body.appendChild(bigNumber);

        
      }
    } else if (this.puntosDentro2.length >= Math.max(ratioPuntosDentro*contadorPuntosActivo,min_puntos) && check){
      this.exito2 = true;
      document.body.classList.remove("grey-bg");
      document.body.classList.add("green-bg");
      // Crear el mensaje de "Congratulations" solo si no existe ya
      if (!document.getElementById("congratulations")) {
        const congratsMessage = document.createElement("div");
        congratsMessage.id = "congratulations";
        congratsMessage.textContent = "¡Enhorabuena! Has pintado el medio círculo";
        congratsMessage.style.position = "absolute";
        congratsMessage.style.top = "50%";
        congratsMessage.style.left = "50%";
        congratsMessage.style.transform = "translate(-50%, -50%)";
        congratsMessage.style.color = "white";
        congratsMessage.style.fontSize = "2rem";
        congratsMessage.style.fontWeight = "bold";
        document.body.appendChild(congratsMessage);
        // Crear el número 1 grande
        const previousNumber = document.getElementById("big-number");
        if (previousNumber) {
          previousNumber.remove();
        }
        const bigNumber = document.createElement("div");
        bigNumber.id = "big-number";
        bigNumber.textContent = "2";
        bigNumber.style.position = "absolute";
        bigNumber.style.top = "20%";
        bigNumber.style.left = "50%";
        bigNumber.style.transform = "translate(-50%, -50%)";
        bigNumber.style.color = "green"; // Puedes cambiar el color si lo deseas
        bigNumber.style.fontSize = "5rem"; // Tamaño grande
        bigNumber.style.fontWeight = "bold";
        document.body.appendChild(bigNumber);
      }
    } else if (this.puntosDentro3.length >= Math.max(ratioPuntosDentro*contadorPuntosActivo,min_puntos) && check){
      this.exito3 = true;
      document.body.classList.remove("grey-bg");
      document.body.classList.add("green-bg");
      // Crear el mensaje de "Congratulations" solo si no existe ya
      if (!document.getElementById("congratulations")) {
        const congratsMessage = document.createElement("div");
        congratsMessage.id = "congratulations";
        congratsMessage.textContent = "¡Enhorabuena! Has pintado la tilde";
        congratsMessage.style.position = "absolute";
        congratsMessage.style.top = "50%";
        congratsMessage.style.left = "50%";
        congratsMessage.style.transform = "translate(-50%, -50%)";
        congratsMessage.style.color = "white";
        congratsMessage.style.fontSize = "2rem";
        congratsMessage.style.fontWeight = "bold";
        document.body.appendChild(congratsMessage);
        // Crear el número 1 grande
        const previousNumber = document.getElementById("big-number");
        if (previousNumber) {
          previousNumber.remove();
        }
        const bigNumber = document.createElement("div");
        bigNumber.id = "big-number";
        bigNumber.textContent = "3";
        bigNumber.style.position = "absolute";
        bigNumber.style.top = "20%";
        bigNumber.style.left = "50%";
        bigNumber.style.transform = "translate(-50%, -50%)";
        bigNumber.style.color = "green"; // Puedes cambiar el color si lo deseas
        bigNumber.style.fontSize = "5rem"; // Tamaño grande
        bigNumber.style.fontWeight = "bold";
        document.body.appendChild(bigNumber);
      }
    } else if (this.puntosDentro4.length >= Math.max(ratioPuntosDentro*contadorPuntosActivo,min_puntos) && check){
      this.exito4 = true;
      document.body.classList.remove("grey-bg");
      document.body.classList.add("green-bg");
      // Crear el mensaje de "Congratulations" solo si no existe ya
      if (!document.getElementById("congratulations")) {
        const congratsMessage = document.createElement("div");
        congratsMessage.id = "congratulations";
        congratsMessage.textContent = "¡Enhorabuena! Has pintado la tilde al revés";
        congratsMessage.style.position = "absolute";
        congratsMessage.style.top = "50%";
        congratsMessage.style.left = "50%";
        congratsMessage.style.transform = "translate(-50%, -50%)";
        congratsMessage.style.color = "white";
        congratsMessage.style.fontSize = "2rem";
        congratsMessage.style.fontWeight = "bold";
        document.body.appendChild(congratsMessage);
        // Crear el número 1 grande
        const previousNumber = document.getElementById("big-number");
        if (previousNumber) {
          previousNumber.remove();
        }
        const bigNumber = document.createElement("div");
        bigNumber.id = "big-number";
        bigNumber.textContent = "4";
        bigNumber.style.position = "absolute";
        bigNumber.style.top = "20%";
        bigNumber.style.left = "50%";
        bigNumber.style.transform = "translate(-50%, -50%)";
        bigNumber.style.color = "green"; // Puedes cambiar el color si lo deseas
        bigNumber.style.fontSize = "5rem"; // Tamaño grande
        bigNumber.style.fontWeight = "bold";
        document.body.appendChild(bigNumber);
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
    // Draw the line
    ctx.beginPath();
    if(!this.exito1){ctx.setLineDash([10, 15]);}
    if(this.exito1){
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 10;
    } else {  
      ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
      ctx.lineWidth = 4;
    }
    ctx.moveTo(c1x-100, c1y);
    ctx.lineTo(c1x+100, c1y);
    ctx.stroke();
    if(!this.exito1){ctx.setLineDash([]);}
    ctx.closePath();

    // Draw the circle
    ctx.beginPath();
    if(!this.exito2){ctx.setLineDash([10, 15]);}
    if(this.exito2){
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 10;
    } else {  
      ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
      ctx.lineWidth = 4;
    }
    ctx.arc(c2x, c2y-20, 100, 0, Math.PI); // 50 is the radius of the circle
    ctx.stroke();
    if(!this.exito2){ctx.setLineDash([]);}
    ctx.closePath();

    // Draw the line
    ctx.beginPath();
    if(!this.exito3){ctx.setLineDash([10, 15]);}
    if(this.exito3){
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 10;
    } else {  
      ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
      ctx.lineWidth = 4;
    }
    ctx.moveTo(c3x-100, c3y+100);
    ctx.lineTo(c3x+100, c3y-100);
    ctx.stroke();
    if(!this.exito3){ctx.setLineDash([]);}
    ctx.closePath();

    // Draw the line
    ctx.beginPath();
    if(!this.exito4){ctx.setLineDash([10, 15]);}
    if(this.exito4){
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 10;
    } else {  
      ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
      ctx.lineWidth = 4;
    }
    ctx.moveTo(c4x-100, c4y-100);
    ctx.lineTo(c4x+100, c4y+100);
    ctx.stroke();
    if(!this.exito4){ctx.setLineDash([]);}
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