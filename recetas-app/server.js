// Backend Express: guarda la clave en .env y hace de intermediario con la API de recetas.
// El navegador solo llama a /api/recipes, nunca ve la clave.
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_NINJAS_KEY;

app.use(express.static(path.join(__dirname, 'public')));

// GET /api/recipes?title=pasta  ->  hasta 5 recetas (límite del plan gratuito)
app.get('/api/recipes', async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: 'Falta API_NINJAS_KEY en el archivo .env del servidor.' });
  }

  const title = String(req.query.title || '').trim();
  if (title.length < 2 || title.length > 60) {
    return res.status(400).json({ error: 'Escribe entre 2 y 60 caracteres para buscar (por ejemplo: pasta, chicken soup).' });
  }

  let respuesta;
  try {
    respuesta = await fetch(
      `https://api.api-ninjas.com/v3/recipe?title=${encodeURIComponent(title)}&limit=5`,
      { headers: { 'X-Api-Key': API_KEY }, signal: AbortSignal.timeout(8000) }
    );
  } catch (err) {
    // sin internet, DNS caído o la API tardó más de 8 segundos
    return res.status(503).json({ error: 'No se pudo conectar con el servicio de recetas. Revisa tu conexión.' });
  }

  if (!respuesta.ok) {
    if (respuesta.status === 429) {
      return res.status(429).json({ error: 'Se alcanzó el límite de peticiones. Intenta de nuevo más tarde.' });
    }
    if (respuesta.status === 401 || respuesta.status === 403) {
      return res.status(502).json({ error: 'La clave de API es inválida o no tiene permiso.' });
    }
    if (respuesta.status === 400) {
      return res.status(400).json({ error: 'La búsqueda no es válida. Prueba con otra palabra.' });
    }
    return res.status(502).json({ error: `El servicio de recetas respondió con error (${respuesta.status}).` });
  }

  let datos;
  try {
    datos = await respuesta.json();
  } catch (err) {
    return res.status(502).json({ error: 'El servicio de recetas devolvió una respuesta ilegible.' });
  }

  if (!Array.isArray(datos) || datos.length === 0) {
    return res.status(404).json({ error: `No se encontraron recetas para «${title}». Prueba en inglés (por ejemplo: chicken, soup).` });
  }

  res.json(datos);
});

app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
  if (!API_KEY) {
    console.warn('Aviso: falta API_NINJAS_KEY en .env');
  }
});
