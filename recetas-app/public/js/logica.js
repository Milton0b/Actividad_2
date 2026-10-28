// Funciones puras (sin DOM) para filtrar y ordenar recetas. Se pueden probar con Node.

// Pasa a minúsculas y quita acentos para comparar textos.
function normalizar(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

function caloriasDe(receta) {
  const valor = receta && receta.nutrition ? Number(receta.nutrition.calories) : NaN;
  return Number.isFinite(valor) ? valor : null;
}

function proteinaDe(receta) {
  const valor = receta && receta.nutrition ? Number(receta.nutrition.protein) : NaN;
  return Number.isFinite(valor) ? valor : null;
}

// filtros = { calorias: '' | 'bajo' | 'medio' | 'alto', ingrediente: 'texto' }
function filtrarRecetas(recetas, filtros) {
  const { calorias = '', ingrediente = '' } = filtros || {};
  const buscado = normalizar(ingrediente);

  return recetas.filter((receta) => {
    if (calorias) {
      const cal = caloriasDe(receta);
      if (cal === null) return false;
      if (calorias === 'bajo' && !(cal <= 300)) return false;
      if (calorias === 'medio' && !(cal > 300 && cal <= 600)) return false;
      if (calorias === 'alto' && !(cal > 600)) return false;
    }
    if (buscado) {
      const ingredientes = Array.isArray(receta.ingredients) ? receta.ingredients : [];
      const hay = ingredientes.some((ing) => normalizar(ing && ing.name).includes(buscado));
      if (!hay) return false;
    }
    return true;
  });
}

// Devuelve una copia ordenada; las recetas sin el dato van al final.
function ordenarRecetas(recetas, orden) {
  const copia = recetas.slice();
  const comparar = (obtener, descendente) => (a, b) => {
    const x = obtener(a);
    const y = obtener(b);
    if (x === null && y === null) return 0;
    if (x === null) return 1;
    if (y === null) return -1;
    return descendente ? y - x : x - y;
  };

  if (orden === 'cal-asc') copia.sort(comparar(caloriasDe, false));
  if (orden === 'cal-desc') copia.sort(comparar(caloriasDe, true));
  if (orden === 'prot-desc') copia.sort(comparar(proteinaDe, true));
  if (orden === 'titulo') {
    copia.sort((a, b) => normalizar(a.title).localeCompare(normalizar(b.title)));
  }
  return copia;
}

// Redondea a 2 decimales y quita ceros sobrantes (2.50 -> 2.5).
function formatearNumero(valor) {
  const n = Number(valor);
  if (!Number.isFinite(n)) return '?';
  return String(Math.round(n * 100) / 100);
}

// Permite probar este archivo con Node sin romper el navegador.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { normalizar, filtrarRecetas, ordenarRecetas, formatearNumero };
}
