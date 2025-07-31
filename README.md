# Theremin Visual por Detección de Color 🖍️📹

Este proyecto permite convertir cualquier objeto de un color específico (por ejemplo, un bolígrafo azul) en una herramienta de dibujo sin contacto físico, usando solo una webcam.

## 🎯 Objetivo

Simular el comportamiento de un theremin, pero en el ámbito visual. Al mover un objeto de color frente a la cámara, el sistema detecta su posición y pinta trazos en una ventana en tiempo real.

## 🧰 Tecnologías utilizadas

- **Python 3**
- **OpenCV**
- Segmentación en espacio **HSV**
- Filtros morfológicos para limpieza del ruido
- Detección de contornos y tracking básico

## 📸 Funcionamiento

1. El sistema abre la webcam y permite seleccionar un color (ya sea por hardcodeo o mediante calibración manual).
2. Detecta y aísla dicho color en cada frame.
3. Calcula el centroide del objeto detectado.
4. Dibuja trazos en la pantalla conforme se mueve.

## Versiones

Hay diferentes versiones, y cada una de ellas lleva a cabo una funcionalidad distinta.
