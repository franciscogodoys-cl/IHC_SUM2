# Asistente de Registro Guiado Accesible (IHC_SUM2)

Evaluación sumativa de la Unidad 2 de **Interacción Humano Computador...**

Equipo: Francisco Godoy, Carolina Vallejos y Eduardo Jaque
Profesora: Yenny Alexandra Méndez
Entrega: 17 de noviembre de 2026

> Este repositorio es un trabajo académico y no pertenece a Falabella ni está relacionado con la empresa. El prototipo no envía datos a ningún servidor y está pensado para probarse con datos de ejemplo.

## El caso

Durante la venta guiada en tienda, el asesor ingresa el RUT del cliente en un iPad y muchas veces descubre que no tiene cuenta en Falabella.com. El formulario de registro actual concentra todos los campos en una sola pantalla, usa términos técnicos y no explica sus errores, así que los clientes con baja alfabetización digital, en especial las personas mayores, terminan dependiendo del asesor para crear su cuenta.

Nuestra propuesta es un asistente de registro guiado. El asesor muestra un QR desde el iPad y el cliente termina el registro en su propio celular, en cinco pasos breves con una tarea por pantalla. El celular es el dato principal y se confirma con un código por SMS que el mismo teléfono sugiere sobre el teclado, mientras que el correo queda como opcional y no detiene el registro. Al final el cliente elige si quiere recibir sus boletas y avisos de compra por WhatsApp o por correo, de modo que quien no usa correo electrónico igual puede crear su cuenta y seguir en contacto con la tienda. Cada pantalla trae ejemplos, ayuda, lectura en voz alta y mensajes de error que explican cómo corregir.

## Estructura

```
caso_original/                     capturas del registro actual con los problemas marcados
prototipo/                         prototipo navegable en HTML, CSS y JavaScript
  index.html                       enlaces al prototipo completo y a cada flujo
  compartido/                      estilos y funciones comunes a los tres flujos
  flujo1-inicio-identificacion/    P0 a P2
  flujo2-contacto-verificacion/    P3 y P4
  flujo3-clave-cierre/             P5 a P8
```

## Cómo nos repartimos el trabajo

Dividimos el prototipo por flujos, para que cada integrante desarrollara una parte completa del recorrido del usuario.

| Flujo | Pantallas | Responsable | Problemas del caso que resuelve |
|---|---|---|---|
| Base compartida | Estilos, indicador de pasos, botón "Escuchar", validaciones y banner | Francisco Godoy | 2, 3 y 9 |
| 1. Inicio e identificación | P0 vista del asesor con QR, P1 bienvenida, P2 datos personales | Francisco Godoy | 1, 2, 3 y 4 |
| 2. Contacto, canal y verificación | P3 celular, correo opcional y canal, P4 confirmación del celular por SMS | Carolina Vallejos | 3, 5 y clientes que no usan correo |
| 3. Clave y cierre | P5 clave, P6 condiciones, P7 revisión, P8 confirmación | Eduardo Jaque | 6, 7, 8 y 9 |

Cada carpeta de flujo tiene su propio `README.md` con lo que hace y los requisitos del informe que demuestra. El detalle de los problemas numerados está en [`caso_original/README.md`](caso_original/README.md).

## Cómo verlo

Se puede abrir en local descargando el repositorio y abriendo `prototipo/index.html` en el navegador, sin instalar nada. También se publicará con GitHub Pages desde la rama `main`, y el enlace se agregará aquí cuando esté activo. Para verlo como en un celular, conviene usar las herramientas de desarrollo del navegador.

## Precauciones

Como el prototipo rediseña el registro de una empresa real, cuidamos que no se confunda con el sitio original. No usa el logo, los textos legales ni el código de Falabella, y aunque los colores y la tipografía se inspiran en el sitio, todo se construyó desde cero. Cada pantalla muestra el banner de la sumativa con los integrantes del equipo y la nota "Prototipo de uso local" al pie, y las páginas tienen `noindex` para que no aparezcan en buscadores.

Ningún formulario envía datos. Todo ocurre en el navegador y los datos de prueba se guardan solo en `sessionStorage`, que se borra al terminar, mientras que la clave no se guarda en ningún momento. Tampoco se envían SMS reales, porque el código de verificación es simulado y aparece como la sugerencia que haría el teclado del teléfono. Cuando el cliente elige WhatsApp, el prototipo le pide su autorización y le avisa que nunca se le pedirá la clave por ese medio.

## Requisitos que demuestra

El prototipo implementa los requisitos RF01 a RF10, RU01 a RU07, RA01 a RA05 y RE01 a RE05 del informe. La relación entre cada requisito, la pantalla y la barrera que atiende está en la matriz de trazabilidad del informe.
