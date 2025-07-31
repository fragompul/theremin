import { semejanzaCromática, puntoCentral, linearRegression, quadraticRegression, calculateRSquaredQuadratic, meanErrorLinear} from "./utils.js";

export class Theremin {
  constructor(canvas, video) {
    this.canvas = canvas;
    this.video = video;
    this.ctx = canvas.getContext("2d");

    this.colorDelMarcador = { r: 0, g: 0, b: 255 };
    this.centrosActivos = []; // Arreglo para almacenar los centros activos
    this.puntosRegresion = []; 

    this.teclaPresionada = false; // Estado de la tecla
    this.cambio = false; // Representa el primer frame en el que la tecla se pulsa o se levanta

    this.exito1=false;
    this.exito2=false;
    this.exito3=false;
    this.exito4=false;

    // Configura los eventos de teclado
    document.addEventListener("keydown", (e) => {
      if (e.key === "Control") {
          this.teclaPresionada = true;
          this.exito1=false;
          this.exito2=false;
          this.exito3=false;
          this.exito4=false;
      }
  });
  
   document.addEventListener("keyup", (e) => {
      if (e.key === "Control") {
          this.teclaPresionada = false;
          this.cambio = true;
      }
  });

    this.#animate();
  }

  #animate() {
    const { ctx, canvas, video } = this;
    ctx.save(); // Guarda el estado actual del contexto
    ctx.scale(-1, 1); // Invierte el canvas en el eje X
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height); // Dibuja la imagen invertida
    ctx.restore(); // Restaura el estado original del contexto

    document.body.classList.add("grey-bg");

    
    // Localiza en el canvas los puntos cuyo color se asemeja al color del marcador
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const nuevosPuntos = this.#obtenPuntosSegunColor(imageData, this.colorDelMarcador);
    // console.log("Puntos detectados:", puntos);

    // Añadir nuevos puntos a los puntos activos con el tiempo de creación
    const tiempoActual = Date.now();

    // Filtra los puntos que han pasado más de 5 segundos
    const tiempoLimite = 5000; // 5 segundos en milisegundos
    
    // Detecta un punto central representativo de un número limitado de puntos
    // const centro = this.#puntoIntermedio(this.puntosActivos);
    

    // taxi-distancia (rombo):
    // centro.x-centerCanvasX + centro.y-centerCanvasY < margenDistancia

    // distancia del máximo (cuadrado):
    // max(centro.x-centerCanvasX, centro.y-centerCanvasY) < margenDistancia
    const centro = this.#puntoIntermedio(nuevosPuntos);
    if(this.teclaPresionada){

      const congratsMessage = document.getElementById("congratulations");
      const bigNumber = document.getElementById("big-number");
      if (congratsMessage) {
        congratsMessage.remove();
      }
      if (bigNumber) {
        bigNumber.remove();
      }

      this.centrosActivos.push({ ...centro,tiempoCreacion: tiempoActual});
      this.centrosActivos = this.centrosActivos.filter(centro => {
          return (tiempoActual - centro.tiempoCreacion) < tiempoLimite; });

      
      let prev_centro = this.centrosActivos[0];
      ctx.beginPath();
          
      if (this.centrosActivos.length > 0){
        for (const punto of this.centrosActivos){
          
          ctx.strokeStyle = "red";
          ctx.lineWidth = 5;
          ctx.moveTo(prev_centro.x, prev_centro.y);
          ctx.lineTo(punto.x, punto.y);
          ctx.stroke();
          ctx.fill();
          
          prev_centro = punto;
        }
      }
      ctx.closePath();
    }

    
    if (!this.teclaPresionada) {
      if (this.cambio){
        
        this.puntosRegresion = this.centrosActivos;
        this.centrosActivos=[];
      }

      if(this.puntosRegresion.length > 0){

        if (this.cambio){
          this.cambio = false;
          
          const listaDeCoordenadas = [];
        

          for (const punto of this.puntosRegresion) {
            if(punto.x!=undefined && punto.y!=undefined){
              listaDeCoordenadas.push([punto.x, punto.y]);
            }
          }

          // REALIZO REGRESION LINEAL
          const { lineal_m, lineal_b } = linearRegression(listaDeCoordenadas);
          const linear_error = meanErrorLinear(listaDeCoordenadas, lineal_m, lineal_b);
          
          console.log("Pendiente (lineal_m), ", lineal_m);
          console.log("R^2 squared (linear_error)), ", linear_error);

          // REALIZO REGRESION CUADRATICA
          const [ quadratic_a, quadratic_b, quadratic_c ] = quadraticRegression(listaDeCoordenadas);
          const quadratic_Rsquared = calculateRSquaredQuadratic(listaDeCoordenadas, quadratic_a, quadratic_b, quadratic_c);
          console.log("Valores cuadráticos (a), ", quadratic_a, " (b), ", quadratic_b, " (c), ", quadratic_c);
          console.log("R^2 squared, ", quadratic_Rsquared);

          const linearInfo = document.getElementById("linear-regression-info");
          const quadraticInfo = document.getElementById("quadratic-regression-info");

          if (linearInfo && quadraticInfo) {
            linearInfo.textContent = `Regresión Lineal: pendiente = ${(-lineal_m).toFixed(3)}, ECM = ${linear_error.toFixed(3)}`;
            quadraticInfo.textContent = `Regresión Cuadrática: a = ${(-quadratic_c).toFixed(3)}, b = ${(-quadratic_b).toFixed(3)}, c = ${(-quadratic_a).toFixed(3)}, R² = ${quadratic_Rsquared.toFixed(3)}`;
          }
          
          // COMPRUEBO EXITO1 
          if ( -0.2 < lineal_m && lineal_m < 0.2 && linear_error < 0.15){
            this.exito1=true;
            console.log("EXITO 1");
          } else if ( 0.8 < lineal_m && lineal_m < 1.2 && linear_error < 0.15){
            this.exito2=true;
            console.log("EXITO 2");
          }  else if ( -1.2 < lineal_m && lineal_m < -0.8 && linear_error < 0.15){
            this.exito3=true;
            console.log("EXITO 3");
          } else if ( quadratic_c >-0.025 && quadratic_c < -0.005 && quadratic_b > 0 && quadratic_Rsquared>0.92){
            this.exito4=true;
            console.log("EXITO 4");
          }
        }
        
        // COMPRUEBA AQUI LAS VARIABLES EXITO1-EXITO4 Y HAZ LO QUE SEA
        // EXITO 1 ----
        if(this.exito1){
          document.body.classList.remove("grey-bg");
          document.body.classList.add("green-bg");
          // Crear el mensaje de "Congratulations" solo si no existe ya
          if (!document.getElementById("congratulations")) {
            const congratsMessage = document.createElement("div");
            congratsMessage.id = "congratulations";
            congratsMessage.textContent = "¡Enhorabuena! Has pintado el primer tono";
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
        }

        // EXITO 2 \
        if(this.exito2){
          document.body.classList.remove("grey-bg");
          document.body.classList.add("green-bg");
          // Crear el mensaje de "Congratulations" solo si no existe ya
          if (!document.getElementById("congratulations")) {
            const congratsMessage = document.createElement("div");
            congratsMessage.id = "congratulations";
            congratsMessage.textContent = "¡Enhorabuena! Has pintado el segundo tono";
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
        }

        // EXITO 3 /
        // EXITO 4 U
        if(this.exito3){
          document.body.classList.remove("grey-bg");
          document.body.classList.add("green-bg");
          // Crear el mensaje de "Congratulations" solo si no existe ya
          if (!document.getElementById("congratulations")) {
            const congratsMessage = document.createElement("div");
            congratsMessage.id = "congratulations";
            congratsMessage.textContent = "¡Enhorabuena! Has pintado el tercer tono";
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
        }

        if(this.exito4){
          document.body.classList.remove("grey-bg");
          document.body.classList.add("green-bg");
          // Crear el mensaje de "Congratulations" solo si no existe ya
          if (!document.getElementById("congratulations")) {
            const congratsMessage = document.createElement("div");
            congratsMessage.id = "congratulations";
            congratsMessage.textContent = "¡Enhorabuena! Has pintado el cuarto tono";
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
      }

        let prev_centro = this.puntosRegresion[0];
        ctx.beginPath();
        
        for (const punto of this.puntosRegresion){
          
          ctx.strokeStyle = "red";
          ctx.lineWidth = 5;
          ctx.moveTo(prev_centro.x, prev_centro.y);
          ctx.lineTo(punto.x, punto.y);
          ctx.stroke();
          ctx.fill();
          
          
          prev_centro = punto;
        }
      
        ctx.closePath();
      
      }

    }
    if (centro != null){
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.arc(centro.x, centro.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }

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
