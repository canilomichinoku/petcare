# 🐾 PetCare — Front-end

Sitio web para el cuidado de mascotas: registra a tus compañeros, agenda citas, conoce mascotas en adopción y lee consejos de cuidado. Esta es la **versión front-end** (HTML, CSS y JavaScript puro) del proyecto final desarrollado originalmente en Laravel, con el mismo diseño visual.

## ✨ Características

- Página de inicio con portada, servicios, equipo, planes, galería, consejos, opiniones y preguntas frecuentes.
- **Adopción** con filtros por especie, proceso y requisitos.
- **Consejos** con categorías, artículo destacado y página de detalle.
- **Contacto** con formulario.
- **Registro e inicio de sesión** simulados en el navegador.
- **Mi cuenta**: banner, foto de perfil, estadísticas, mascotas con foto y citas.
- **Editar perfil**: foto, banner, datos personales y cambio de contraseña.
- Diseño **responsive** (celular, tablet y computadora) con menú hamburguesa.

## 🗂️ Estructura

```
petcare-frontend/
├── index.html        Inicio
├── adopcion.html     Mascotas en adopción
├── consejos.html     Lista de consejos
├── articulo.html     Detalle de un consejo (?slug=...)
├── contacto.html     Contacto
├── login.html        Iniciar sesión
├── registro.html     Crear cuenta
├── mi-cuenta.html    Panel del usuario
├── perfil.html       Editar perfil
├── style.css         Estilos
├── data.js           Mascotas y artículos de ejemplo
└── app.js            Menú, sesión, formularios y renderizado
```

## 🚀 Cómo ejecutarlo

1. Descarga o clona el repositorio.
2. Abre `index.html` en tu navegador, o usa la extensión **Live Server** de VS Code.

No requiere instalar nada.

## 🌐 Publicarlo en GitHub Pages

1. Sube el proyecto a un repositorio de GitHub.
2. Ve a **Settings → Pages**.
3. En **Branch** elige `main` y la carpeta `/ (root)`, y presiona **Save**.
4. En un minuto tendrás tu sitio en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

## ⚠️ Notas importantes

- Es un proyecto **solo front-end**: no hay servidor ni base de datos. Las cuentas, mascotas, citas, fotos y mensajes se guardan en el `localStorage` de tu navegador, así que **solo existen en ese navegador y no se comparten**.
- Por ser una demostración, las contraseñas se guardan sin cifrar en tu navegador. **No uses contraseñas reales.**
- Las fotos que subes se reducen de tamaño antes de guardarse. Si el navegador se queda sin espacio, usa imágenes más pequeñas.
- Las imágenes del sitio se cargan desde [Unsplash](https://unsplash.com), por lo que necesitas conexión a internet para verlas.
- Los datos de la barra de cifras, planes, equipo y opiniones son de ejemplo.

## 🛠️ Tecnologías

HTML5 · CSS3 (Grid, Flexbox, variables CSS) · JavaScript (ES6) · Google Fonts (Baloo 2 y Nunito)

## 📸 Capturas

> Agrega aquí tus capturas, por ejemplo en una carpeta `capturas/`:
>
> `![Inicio](capturas/inicio.png)`

## 👤 Autor

Proyecto final · *Tu nombre aquí*
