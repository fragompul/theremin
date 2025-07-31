import { Theremin } from "./Theremin.js";

async function comienzo() {
  try {
    // Solicita el acceso a la cámara. El objeto devuelto facilita acceder al flujo (fotogramas)
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });

    // Crea un elemento video (no se incluye en el DOM) cuya fuente procede de mediaStream
    const video = document.createElement("video");
    video.srcObject = mediaStream;

    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#events
    // Hay varios eventos asociados al elemento video
    //   loadeddata se dispara cuando hay sufientes fotogramas para comenzar la reprodución aunque no
    //               se asegura que pueden existir interrupciones

    video.addEventListener("loadeddata", () => {
      // Comienza la reproducción del video
      video.play();

      // Ajusta el tamaño del canvas para que coincida con el video
      const canvasApp = document.getElementById("canvasApp");
      canvasApp.width = video.videoWidth;
      canvasApp.height = video.videoHeight;

      // Crea una instancia de Theremin y pasa el canvas y el video
      const theremin = new Theremin(canvasApp, video);

      // Captura el cambio de forma en el menú y ajusta la forma en Theremin
      document.getElementById("gameMode").addEventListener("change", (event) => {
        const nuevaForma = event.target.value; // Obtiene la nueva forma seleccionada
        theremin.cambiarForma(nuevaForma); // Cambia la forma en la instancia de Theremin
        console.log(`Forma cambiada a: ${nuevaForma}`);
      });
    });
  } catch (err) {
    // Manejo de errores, como problemas de acceso  a la cámara
    alert(err);
  }
}

comienzo();



