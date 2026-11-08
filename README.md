# ZETA LAB · Think & Connect

Landing de una página en Astro, generada como HTML estático. No requiere servidor de aplicación ni framework de interfaz en el navegador.

```bash
npm ci
npm run dev
```

Desarrollo: http://localhost:4321

```bash
npm run check
npm run build
npm run preview
```

El resultado de producción está en `dist/` y se puede alojar en cualquier hosting estático.

## Contactos y solicitudes

Los datos de contacto se configuran en `src/data/site.ts`:

```ts
export const contact = {
  whatsapp: '', // Prefijo internacional + número, solo dígitos.
  email: '',
};
```

Están vacíos a petición del cliente. La web muestra estados de próxima disponibilidad y no inventa datos ni confirma envíos. Al configurar un destino y volver a compilar:

- El botón de WhatsApp abre una conversación con el número indicado.
- El cuestionario de servicios prepara un correo en la aplicación del visitante; si solo hay WhatsApp, prepara un mensaje allí. El visitante revisa y envía el mensaje. No se necesita un backend y no se garantiza el envío automático.
- Si no hay un destino configurado, el cuestionario permite revisar los servicios seleccionados e indica expresamente que no se ha enviado nada.

## Auditoría digital

Implementada únicamente la experiencia de tres pasos y su validación: negocio, canales y contacto. No hay endpoint, llamada a IA, seguimiento, persistencia ni transmisión de los datos. El último paso explica que es una vista previa. La automatización y la entrega del análisis quedan pendientes según el alcance solicitado.

## Diseño y accesibilidad

Se mantienen los textos proporcionados y la dirección visual de los bocetos: blanco y negro, acento lima y fotografía editorial. El recorrido incluye orientación contextual, servicios desplegables, cuestionario con selección múltiple y diálogos nativos con control de foco. Animaciones discretas con `prefers-reduced-motion`; sin scroll forzado. Navegación y contenido funcionan sin JavaScript; los formularios requieren JavaScript.

Las imágenes se procesan con `astro:assets` con tamaños adaptados y carga diferida excepto la imagen principal. Manrope se sirve localmente y solo se importa su subconjunto latino. No hay recursos de terceros solicitados por el navegador, cookies de seguimiento ni analítica.

## Recursos visuales

- `src/assets/hero.png`: fotografía creada con la herramienta integrada ImageGen. Prompt: fotografía editorial panorámica 3:2 en blanco y negro de una profesional sanitaria de unos 40 años, bata blanca sobre uniforme oscuro, sentada en una clínica contemporánea, mirada hacia la luz a la derecha, sujeto en el tercio derecho y espacio negativo oscuro a la izquierda, textura natural y alto contraste; sin texto, logotipos ni marcas de agua.
- `src/assets/strategy.jpg`: origen CDN `images.unsplash.com/photo-1454165804606-c3d57bc86b40`.
- `src/assets/content.jpg`: origen CDN `images.unsplash.com/photo-1516035069371-29a1b244cc32`.
- `src/assets/advertising.jpg`: origen CDN `images.unsplash.com/photo-1512428559087-560fa5ceab42`.
- `src/assets/management.jpg`: origen CDN `images.unsplash.com/photo-1496181133206-80ce9b88a853`.

## Antes de publicar

Confirmar los contactos reales y la información legal del titular. Revisar la información de privacidad cuando se conecte un tratamiento real de solicitudes. Configurar el dominio definitivo para las URL canónicas, el sitemap y la imagen social absoluta si se requieren. No se ha publicado el proyecto ni conectado ningún servicio externo.

## Validación realizada

- `npm run check`: sin errores ni advertencias.
- `npm run build`: compilación estática correcta.
- Pruebas de interacción con Chrome: menú móvil, orientación contextual, despliegue de servicios, preselección del cuestionario, cierre de diálogos con Escape, validación, recorrido y regreso entre pasos de la auditoría y avisos de ausencia de envío.
- Sin desbordamiento horizontal a 320, 361, 390, 768, 1024 y 1440 px. Verificación adicional de navegación y contenido sin JavaScript.
- Axe WCAG 2 A/AA y 2.1 AA: sin infracciones detectadas en escritorio, móvil, servicios desplegados, cuestionario y los tres pasos de la auditoría. Esto no sustituye una revisión manual completa de accesibilidad.
- Lighthouse móvil sobre producción en local: 100 en rendimiento, accesibilidad, buenas prácticas y SEO; LCP 1,4 s, bloqueo 0 ms, CLS 0. Son medidas de laboratorio; el resultado real depende del alojamiento, la red y el dispositivo.
- Sin errores de JavaScript ni peticiones a dominios externos durante las pruebas.

Los útiles de prueba se ejecutaron fuera del proyecto; no añaden dependencias al sitio.
