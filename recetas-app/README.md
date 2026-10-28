# Consulta de Recetas

Aplicación web de consulta de recetas. Arriba tiene una barra de búsqueda y filtros; debajo, las recetas aparecen como fichas individuales en filas. Usa la [Recipe API de API Ninjas](https://api-ninjas.com/api/recipe). Un backend en Node.js + Express guarda la clave de API en una variable de entorno, de modo que el navegador nunca la ve.

## Requisitos

- Node.js 18 o superior
- Una clave gratuita de [API Ninjas](https://api-ninjas.com)

## Cómo ejecutarla

1. Clona el repositorio y entra a la carpeta:
   ```bash
   git clone <URL-DE-TU-REPOSITORIO>
   cd recetas-app
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea tu archivo `.env` a partir de la plantilla:
   ```bash
   cp .env.example .env
   ```
   En Windows (CMD): `copy .env.example .env`
4. Abre `.env` y escribe tu clave después del `=`, sin comillas ni espacios:
   ```
   API_NINJAS_KEY=tu_clave_de_api_ninjas
   PORT=3000
   ```
5. Inicia el servidor:
   ```bash
   npm start
   ```
6. Abre <http://localhost:3000> en el navegador.

## Cómo se usa

- **Buscar:** escribe el nombre de una receta, preferentemente en inglés (por ejemplo `pasta` o `chicken soup`), y pulsa "Buscar".
- **Filtrar** (sobre los resultados ya mostrados): por rango de calorías o por ingrediente.
- **Ordenar:** por calorías, proteína o nombre.
- **Fichas:** cada receta muestra porciones, calorías, proteína, grasa y carbohidratos, y despliega ingredientes y pasos de preparación.

## Límites del plan gratuito de la API

- La búsqueda es solo por título y devuelve **máximo 5 recetas** por consulta.
- La búsqueda por ingredientes, los filtros de nutrición de la API y la paginación son de pago.
- Por eso los filtros de esta app se aplican en el navegador sobre las recetas que ya llegaron.

## Seguridad de la clave

- La clave vive solo en `.env`, que está en `.gitignore` y **no se sube al repositorio**.
- `.env.example` es la plantilla pública y no contiene claves.
- El frontend solo llama a `/api/recipes` del propio servidor.

## Manejo de errores

| Situación | Qué ve el usuario |
|---|---|
| Sin conexión o servidor apagado | "Sin conexión con el servidor…" |
| Búsqueda vacía o demasiado corta | Aviso para escribir al menos 2 letras |
| Búsqueda sin resultados | "No se encontraron recetas para…" |
| Filtros que dejan 0 resultados | Aviso para cambiar los filtros |
| Límite de peticiones (HTTP 429) | Aviso de límite alcanzado |
| Clave inválida (401/403) o faltante | Mensaje de clave inválida o faltante |
| La API tarda más de 8 s o no responde | Mensaje de falla de conexión |

Más detalle en [`ESTRUCTURA.md`](ESTRUCTURA.md) y [`CARACTERISTICAS.md`](CARACTERISTICAS.md).

## Declaración de uso de IA

> **COMPLETAR POR EL AUTOR antes de entregar.** Describe con tus palabras la información real.

- **Herramientas de IA utilizadas:** _(escribe aquí cuáles usaste)_
- **Para qué usé cada una:** _(generar código, depurar, explicar errores, documentar…)_
- **Qué parte hice sin ayuda de IA:** _(escribe aquí lo que hiciste por tu cuenta)_

## Autor

_(Tu nombre)_ · _(Materia y grupo)_
