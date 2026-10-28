# Estructura del proyecto

```
recetas-app/
├── .env.example        plantilla de variables (se sube al repositorio)
├── .env                clave real de la API (NO se sube)
├── .gitignore          excluye .env y node_modules/
├── package.json        dependencias: express y dotenv
├── server.js           backend: lee .env y consulta la API de recetas
├── README.md           instrucciones de ejecución y declaración de IA
├── ESTRUCTURA.md       este archivo
├── CARACTERISTICAS.md  características de la aplicación
├── bitacora.md         bitácora de programación con IA (plantilla)
└── public/             todo lo que el navegador puede ver
    ├── index.html      vista principal
    ├── css/
    │   └── style.css   estilos
    └── js/
        ├── logica.js   funciones puras: filtrar, ordenar, formatear
        └── script.js   interfaz: eventos, llamadas al backend y fichas
```

## Por qué el HTML está dentro de `public/`

La clave de la API no puede estar en el JavaScript del navegador, porque cualquiera la vería con las herramientas de desarrollo. Por eso existe `server.js`: recibe la petición del navegador, agrega la clave desde `.env` y consulta la API. Express sirve la carpeta `public/` como sitio web.

## Flujo de una búsqueda

1. La persona escribe un título y pulsa "Buscar" (`script.js`).
2. El navegador llama a `GET /api/recipes?title=...` en nuestro servidor.
3. `server.js` valida el texto, agrega `X-Api-Key` desde `.env` y consulta `https://api.api-ninjas.com/v3/recipe`.
4. El servidor devuelve la lista de recetas o un mensaje de error claro.
5. `script.js` guarda las recetas, aplica filtros y orden con `logica.js` y dibuja las fichas.
