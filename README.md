# 🎨 Visual Color-Tracking Theremin

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![OpenCV](https://img.shields.io/badge/OpenCV.js-Computer_Vision-5C3EE8?logo=opencv&logoColor=white)
![HCI](https://img.shields.io/badge/HCI-Touchless_Interaction-FF6F00)

> **An interactive Computer Vision project that transforms any specific colored object (e.g., a red pen) into a touchless, webcam-driven drawing tool, mimicking the ethereal interaction of a musical theremin.**

---

## 🎯 Summary & Objective

This project explores innovative forms of touchless Human-Computer Interaction (HCI) through the lens of computer vision. By leveraging the webcam, the system tracks a targeted color in real-time, translating physical motion into digital strokes and actions on the screen. 

Throughout its development lifecycle, the project evolves from fundamental object tracking to advanced interactive features, culminating in statistical regression analysis of the drawn trajectories.

---

## 🧰 Tech Stack & Computer Vision Techniques

- **Core Logic:** Vanilla JavaScript (Client-side processing)
- **UI/UX:** HTML5 & CSS3
- **Computer Vision Engine:** OpenCV.js
- **Key Techniques:**
  - **HSV Color Space Segmentation:** For robust color detection resilient to lighting variations.
  - **Morphological Transformations:** Applying erosion and dilation filters to minimize noise and improve tracking stability.
  - **Real-time Video Processing:** Capturing and processing webcam frames natively in the browser.

---

## 🌀 Project Evolution (Versions)

The repository is structured incrementally, demonstrating different capabilities of the vision tracking system:

| Version | Description |
| :--- | :--- |
| **v0** | **Basic Tracking:** Draws a simple circumference on the screen following the detected object's centroid. |
| **v1** | **Musical Simulation:** Associates spatial movement with generated frequencies and amplitudes (simulating a classic Theremin). |
| **v2** | **Guided Drawing:** Enables the user to draw specific geometric figures assisted by visual on-screen guides. |
| **v3** | **Enhanced Precision:** Draws circumferences utilizing a more refined and accurate mathematical approach. |
| **v4** | **Free Paint & Hidden Shapes:** Introduces a freehand painting mode alongside "hidden" figures that the user must complete without visual guides. |
| **v5** | **Statistical Analysis:** Analyzes the user's freehand stroke and calculates regression values/curves based on the painted trajectory. |

---

## 🚀 Getting Started

This project is entirely client-side and requires **no complex backend installation**. It runs directly in the browser.

### Prerequisites
- A modern web browser with webcam access.
- [Visual Studio Code](https://code.visualstudio.com/) with the **Live Server** extension installed.

### Installation & Execution

**1. Clone the repository:**
```bash
git clone https://github.com/fragompul/theremin-visual.git
cd theremin-visual
```

**2. Open the project in VS Code:**
```bash
code .
```

**3. Launch the application:**
    - Locate and open the `index.html` file in VS Code.
    - Right-click anywhere in the code and select **"Open with Live Server"**.
    - The browser will automatically open and request webcam permissions. 

*💡 **Troubleshooting:** If the camera fails to initialize, ensure your browser has granted webcam permissions to the local server.*

### Customization
To change the target color the system detects, modify the HSV threshold values within the `Theremin.js` file.

---

## 📸 Demo & Use Case

*(A demonstration video showcasing the real-time tracking and drawing capabilities is attached to the repository.)*

---

## 📌 Author

**Francisco Javier Gómez Pulido** *Data Scientist & Machine Learning Engineer*

- 📧 Email: [frangomezpulido2002@gmail.com](mailto:frangomezpulido2002@gmail.com)
- 💼 LinkedIn: [linkedin.com/in/frangomezpulido](https://www.linkedin.com/in/frangomezpulido)
- 🐙 GitHub: [github.com/fragompul](https://github.com/fragompul)

---
*If you find this Human-Computer Interaction project interesting, feel free to drop a ⭐!*
