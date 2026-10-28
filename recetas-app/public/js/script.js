// Frontend: solo llama a nuestro backend (/api/recipes), nunca directo a la API externa.
// Usa las funciones de logica.js (filtrarRecetas, ordenarRecetas, formatearNumero).

const formBusqueda = document.getElementById('form-busqueda');
const inputTitulo = document.getElementById('titulo');
const selectCalorias = document.getElementById('filtro-calorias');
const inputIngrediente = document.getElementById('filtro-ingrediente');
const selectOrden = document.getElementById('orden');
const botonLimpiar = document.getElementById('limpiar');
const estado = document.getElementById('estado');
const lista = document.getElementById('lista');

// Recetas tal como llegaron de la API. Los filtros trabajan sobre esta copia.
let recetasOriginales = [];

function mostrarEstado(mensaje, esError = false) {
  estado.textContent = mensaje;
  estado.classList.toggle('error', esError);
}

// Llama al backend y devuelve el JSON. Lanza un Error con mensaje claro si algo falla.
async function pedirJSON(url) {
  let respuesta;
  try {
    respuesta = await fetch(url);
  } catch (err) {
    throw new Error('Sin conexión con el servidor. Revisa tu internet o que el servidor esté encendido.');
  }

  let datos = null;
  try {
    datos = await respuesta.json();
  } catch (err) {
    // la respuesta no era JSON
  }

  if (!respuesta.ok) {
    throw new Error((datos && datos.error) || `Error inesperado (${respuesta.status}).`);
  }
  return datos;
}

// ---------- Construcción de las fichas (sin innerHTML, por seguridad) ----------
function crearElemento(etiqueta, clase, texto) {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function crearDato(etiqueta, valor, unidad) {
  const dato = crearElemento('div', 'dato');
  dato.appendChild(crearElemento('span', 'dato-valor', `${formatearNumero(valor)} ${unidad}`));
  dato.appendChild(crearElemento('span', 'dato-nombre', etiqueta));
  return dato;
}

function crearFicha(receta) {
  const ficha = crearElemento('article', 'ficha');
  ficha.appendChild(crearElemento('h2', 'ficha-titulo', receta.title || 'Receta sin título'));
  if (receta.servings) {
    ficha.appendChild(crearElemento('p', 'ficha-porciones', `Porciones: ${receta.servings}`));
  }

  const n = receta.nutrition;
  if (n) {
    const datos = crearElemento('div', 'datos');
    if (n.calories !== undefined) datos.appendChild(crearDato('Calorías', n.calories, 'kcal'));
    if (n.protein !== undefined) datos.appendChild(crearDato('Proteína', n.protein, 'g'));
    if (n.total_fat !== undefined) datos.appendChild(crearDato('Grasa', n.total_fat, 'g'));
    if (n.total_carbohydrate !== undefined) datos.appendChild(crearDato('Carbohidratos', n.total_carbohydrate, 'g'));
    ficha.appendChild(datos);
  }

  const ingredientes = Array.isArray(receta.ingredients) ? receta.ingredients : [];
  if (ingredientes.length > 0) {
    const detalle = crearElemento('details', 'desplegable');
    detalle.appendChild(crearElemento('summary', '', `Ingredientes (${ingredientes.length})`));
    const ul = crearElemento('ul');
    ingredientes.forEach((ing) => {
      const partes = [];
      if (ing.quantity !== undefined && ing.quantity !== null) partes.push(formatearNumero(ing.quantity));
      if (ing.unit) partes.push(ing.unit);
      partes.push(ing.name || '');
      ul.appendChild(crearElemento('li', '', partes.join(' ').trim()));
    });
    detalle.appendChild(ul);
    ficha.appendChild(detalle);
  }

  const pasos = Array.isArray(receta.instructions) ? receta.instructions : [];
  if (pasos.length > 0) {
    const detalle = crearElemento('details', 'desplegable');
    detalle.appendChild(crearElemento('summary', '', `Preparación (${pasos.length} pasos)`));
    const ol = crearElemento('ol');
    pasos.forEach((paso) => ol.appendChild(crearElemento('li', '', paso)));
    detalle.appendChild(ol);
    ficha.appendChild(detalle);
  }

  return ficha;
}

// ---------- Mostrar resultados aplicando filtros y orden ----------
function mostrar() {
  const filtradas = filtrarRecetas(recetasOriginales, {
    calorias: selectCalorias.value,
    ingrediente: inputIngrediente.value
  });
  const resultado = ordenarRecetas(filtradas, selectOrden.value);

  lista.replaceChildren();
  resultado.forEach((receta) => lista.appendChild(crearFicha(receta)));

  if (recetasOriginales.length === 0) return;
  if (resultado.length === 0) {
    mostrarEstado('Ninguna receta cumple los filtros. Prueba con otros o usa "Limpiar filtros".', true);
  } else {
    mostrarEstado(`Mostrando ${resultado.length} de ${recetasOriginales.length} recetas.`);
  }
}

async function buscar(titulo) {
  const boton = formBusqueda.querySelector('button');
  boton.disabled = true;
  recetasOriginales = [];
  lista.replaceChildren();
  mostrarEstado('Buscando recetas...');
  try {
    recetasOriginales = await pedirJSON(`/api/recipes?title=${encodeURIComponent(titulo)}`);
    mostrar();
  } catch (err) {
    mostrarEstado(err.message, true);
  } finally {
    boton.disabled = false;
  }
}

// ---------- Eventos ----------
formBusqueda.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const titulo = inputTitulo.value.trim();
  if (titulo.length < 2) {
    mostrarEstado('Escribe al menos 2 letras para buscar.', true);
    return;
  }
  buscar(titulo);
});

selectCalorias.addEventListener('change', mostrar);
selectOrden.addEventListener('change', mostrar);
inputIngrediente.addEventListener('input', mostrar);

botonLimpiar.addEventListener('click', () => {
  selectCalorias.value = '';
  inputIngrediente.value = '';
  selectOrden.value = '';
  mostrar();
});

// Búsqueda inicial para que la página no aparezca vacía.
inputTitulo.value = 'chicken';
buscar('chicken');
