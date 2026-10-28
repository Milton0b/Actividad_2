# Características de la aplicación

## Solicitado

- Vista de tipo consulta con **barra de búsqueda y filtro en la parte superior**.
- **Todas las recetas debajo, en filas**, como fichas individuales.
- Consumo de una API externa (Recipe API de API Ninjas).
- Manejo de errores: sin conexión, respuesta vacía y límite de peticiones.
- Interfaz clara y usable.
- Clave de API fuera del repositorio (`.env` + `.gitignore`).

## Implementado

**Barra superior**
- Buscador por nombre de receta.
- Filtro por calorías: hasta 300, de 301 a 600 y más de 600.
- Filtro por ingrediente (ignora mayúsculas y acentos).
- Selector de orden: menos calorías, más calorías, más proteína o nombre (A-Z).
- Botón "Limpiar filtros".

**Fichas de recetas**
- Título y porciones.
- Calorías, proteína, grasa y carbohidratos.
- Desplegables con ingredientes (cantidad, unidad y nombre) y pasos de preparación.

**Comportamiento**
- Búsqueda inicial ("chicken") para que la página no aparezca vacía.
- Contador "Mostrando X de Y recetas".
- Botón de búsqueda deshabilitado mientras se consulta.
- Diseño adaptable a teléfono (una columna).
- Los textos de la API se insertan con `textContent`, no con `innerHTML`.

## Limitaciones conocidas

- La API gratuita devuelve máximo 5 recetas por búsqueda y no incluye imágenes.
- Los filtros se aplican solo sobre esas recetas, porque los filtros nutricionales de la API son de pago.
- Las recetas y los ingredientes vienen en inglés; los filtros funcionan mejor con términos en inglés.
