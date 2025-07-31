# Theremin Visual por Detección de Color 🖍️📹

Este proyecto convierte cualquier objeto de un color específico (por ejemplo, un bolígrafo azul) en una herramienta de dibujo sin contacto físico, utilizando únicamente una webcam.  
La interacción recuerda al funcionamiento de un theremin musical: el movimiento del objeto frente a la cámara se traduce en trazos y acciones en la pantalla.

## 🎯 Objetivo

Explorar diferentes formas de interacción visual sin contacto físico mediante **visión por computador**.  
A lo largo de sus versiones, el proyecto evoluciona desde un simple dibujo de circunferencias hasta análisis estadístico de lo dibujado.

---

## 🧰 Tecnologías utilizadas

- **JavaScript** (procesamiento en el navegador)
- **HTML + CSS** (interfaz básica)
- **OpenCV.js** para visión por computador
- Segmentación en espacio **HSV** para detección de color
- Filtros morfológicos para reducir ruido

---

## 🌀 Versiones del proyecto

| Versión | Descripción |
|---------|-------------|
| **v0** | Dibuja una **circunferencia** en la pantalla siguiendo el objeto detectado. |
| **v1** | Asocia el movimiento a **frecuencias y amplitudes** (simulación musical). |
| **v2** | Permite **dibujar figuras concretas con guía visual**. |
| **v3** | Dibuja **circunferencia**, pero con un método diferente y más preciso. |
| **v4** | Modo pintura libre + **figuras ocultas** para completar (las mismas que en v2, pero sin guía). |
| **v5** | Analiza el trazo dibujado y calcula **valores de regresión** de la curva pintada. |

---

## 🚀 Ejecución

Este proyecto **no necesita instalación** especial más allá de un navegador y Visual Studio Code con la extensión **Live Server**.

1. **Clona el repositorio** o descárgalo como ZIP:
   ```bash
   git clone https://github.com/fragompul/theremin-visual.git

2. **Abre la carpeta** del proyecto en Visual Studio Code.

3. Instala la **extensión Live Server** si no la tienes.

4. Abre el archivo index.html.

5. Haz clic derecho y selecciona "Open with Live Server".

6. Se abrirá el navegador mostrando la interfaz del theremin visual.

💡 Consejo: si la cámara no se activa, revisa los permisos del navegador.

## 📸 Ejemplo de uso

Se adjunta un vídeo de ejemplo de uso.
