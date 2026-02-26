# PITCH: RUTIX – Versión Técnica Estratégica (Scrum Edition)

## 👥 1. El Equipo (The Scrum Team)
"Hola, somos el equipo **RUTIX**. No solo desarrollamos software, somos un equipo autogestionado aplicando metodologías ágiles para transformar la movilidad en el Valle de Aburrá."

* **Juan Pablo (Product Owner):** "Como PO, mi foco es maximizar el valor del producto, asegurando que cada funcionalidad del *backlog* resuelva una necesidad real del ciudadano."
* **Santiago (Scrum Master):** "Mi rol es garantizar la eficiencia del proceso, eliminando impedimentos técnicos y fomentando la mejora continua en cada iteración."
* **Franklin & Camilo (Development Team):** "Nosotros nos encargamos del 'cómo', transformando datos complejos en un incremento de software funcional, escalable y de alta calidad."

---

## ⏱ 2. El Problema (Visión de Usuario)
En la movilidad urbana del Valle de Aburrá, el transporte en bus enfrenta un problema de **incertidumbre estructural**. La información:
* No está centralizada.
* No está actualizada.
* **No es confiable.**

El problema no es la falta de buses, es la **falta de información estructurada y validada**. El resultado para el usuario es pérdida de tiempo y una movilidad ineficiente.

---

## ⚙️ 3. La Solución (Ingeniería de Valor)
RUTIX no es un mapa estático; es un sistema que evoluciona mediante **inspección y adaptación**. Modelamos el sistema de buses como un **grafo dinámico**:

* **Nodos y Aristas:** Paradas y conexiones basadas en datos reales.
* **Lógica Determinista:** El tiempo de viaje se calcula basado en el **movimiento real del vehículo**, eliminando el ruido de tiempos muertos en paradas.
* **Capa de IA Ligera:** Usamos inteligencia artificial para la detección de similitud entre trayectorias y el ajuste dinámico de promedios históricos.

> **Clave:** La IA apoya la toma de decisiones, pero la lógica central es algorítmica y basada en evidencia empírica.

---

## 🖥️ 4. Demo en Vivo (Incremento de Producto)
*Presentación del estado actual del software ([rutix.lovable.app](https://rutix.lovable.app)):*

1.  **Planificación:** El usuario busca origen y destino; el sistema calcula rutas optimizadas con transbordos.
2.  **Validación en tiempo real:** Al activar *"Estoy en este bus"*, el sistema inicia la captura de trazas GPS por segmentos.
3.  **Definición de Hecho (DoD):** Al finalizar, la ruta se guarda exitosamente, alimentando el historial y validando el