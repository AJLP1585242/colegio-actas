// Buscador Inteligente con IA - Análisis de imágenes de actas
// Usa OCR en el navegador (Tesseract.js) para extraer texto de las imágenes

class BuscadorIA {
  constructor() {
    this.resultados = [];
    this.buscando = false;
    this.catalogoCompleto = this.obtenerCatalogoCompleto();
  }

  obtenerCatalogoCompleto() {
    return {
      '2012': { '1': ['B','C'], '2': ['B','C'], '3': ['A','B','C'], '4': ['A','B','C'], '5': ['A','B','C'] },
      '2011': { '1': ['B','C'], '2': ['B','C'], '3': ['A','B','C'], '4': ['A','B','C'], '5': ['A','B','C'] },
      '2010': { '1': ['A','B','C'], '2': ['A','B','C'], '3': ['A','B','C'], '4': ['A','B'], '5': ['A','B','C'] },
      '2009': { '1': ['A','B','C'], '2': ['A','B','C'], '3': ['A','B','C'], '4': ['A','B','C'], '5': ['A','C'] },
      '2008': { '1': ['A','B','C'], '2': ['A','B','C'], '3': ['A','B','C'], '4': ['A','C'], '5': ['A','B','C'] },
      '2007': { '1': ['A','B','C'], '2': ['A','B','C'], '3': ['A','C'], '4': ['A','B','C'], '5': ['A','B'] },
      '2006': { '1': ['A','B','C'], '2': ['A'], '3': ['A','B','C'], '4': ['A','B','C'], '5': ['A','B'] },
      '2005': { '1': ['A','B','C','D'], '2': ['A','C'], '3': ['A','B','C'], '4': ['B','C'], '5': ['A'] },
      '2004': { '1': ['A','B','C'], '2': ['B','C'], '3': ['A','B','C'], '4': ['A'], '5': ['A','C'] },
      '2003': { '1': ['A','B','C'], '2': ['A','B','C'], '3': ['A'], '4': ['A','B','C'], '5': ['A','B'] },
      '2002': { '1': ['A','B','C','D'], '2': ['A','B','C'], '3': ['A','C'], '4': ['A','B','C'], '5': ['A','B','C'] },
      '2001': { '1': ['A','C'], '2': ['A','C'], '3': ['A','C'], '4': ['A','B','C'] },
      '2000': { '1': ['A','C'], '2': ['A'], '3': ['B'], '4': ['A','C'], '5': ['A','B'] },
      '1999': { '1': ['A','C'], '2': ['A','B'], '3': ['A','C'], '4': ['A','B','C'], '5': ['A'] },
      '1998': { '1': ['A'], '3': ['A','B','C'], '4': ['A','B'], '5': ['A','B'] },
      '1997': { '1': ['A','C'], '2': ['A','B','C'], '3': ['A','B'], '4': ['A','B'], '5': ['A','B'] },
      '1996': { '1': ['A','B','C'], '2': ['A','B','POSTERGACION'], '3': ['A','B'], '4': ['A','B'], '5': ['UNICA'] },
      '1995': { '1': ['A'], '2': ['A','B'], '3': ['A'], '4': ['U'], '5': ['U'] },
      '1994': { '1': ['B'], '2': ['A','B'] },
      '1993': { '1': ['A','B'], '2': ['A','B'], '3': ['A'], '4': ['A'], '5': ['A'] },
      '1992': { '1': ['A','B'], '5': ['U'] },
      '1991': { '1': ['A','B'], '2': ['A'], '3': ['A'] },
      '1990': { '1': ['A','B'], '2': ['A'], '3': ['A'] }
    };
  }

  async buscarEstudiante(nombreBuscar) {
    if (this.buscando) {
      alert('Ya hay una búsqueda en progreso. Por favor espera.');
      return;
    }

    const nombre = nombreBuscar.trim().toLowerCase();
    if (nombre.length < 3) {
      alert('Por favor ingresa al menos 3 letras del nombre');
      return;
    }

    this.buscando = true;
    this.resultados = [];
    this.mostrarProgreso('Iniciando búsqueda inteligente...', 0);

    try {
      // Cargar Tesseract.js si no está cargado
      if (typeof Tesseract === 'undefined') {
        this.mostrarProgreso('Cargando motor de reconocimiento de texto...', 5);
        await this.cargarTesseract();
      }

      const worker = await Tesseract.createWorker('spa', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            const progreso = Math.round(m.progress * 100);
            this.actualizarProgresoSeccion(progreso);
          }
        }
      });

      let totalActas = 0;
      let actasAnalizadas = 0;

      // Contar total de actas
      for (const [anio, grados] of Object.entries(this.catalogoCompleto)) {
        for (const [grado, secciones] of Object.entries(grados)) {
          totalActas += secciones.length;
        }
      }

      // Buscar en cada acta
      for (const [anio, grados] of Object.entries(this.catalogoCompleto)) {
        for (const [grado, secciones] of Object.entries(grados)) {
          for (const seccion of secciones) {
            const progreso = Math.round((actasAnalizadas / totalActas) * 100);
            this.mostrarProgreso(`Analizando ${anio} - Grado ${grado}${seccion}...`, progreso);
            
            const urlActa = `${anio}/${anio}.html`;
            const encontrado = await this.analizarActa(worker, urlActa, anio, grado, seccion, nombre);
            
            if (encontrado) {
              this.resultados.push({
                anio,
                grado,
                seccion,
                url: urlActa
              });
            }

            actasAnalizadas++;
          }
        }
      }

      await worker.terminate();
      this.mostrarResultados(nombre);

    } catch (error) {
      console.error('Error en búsqueda:', error);
      alert('Error durante la búsqueda: ' + error.message);
    } finally {
      this.buscando = false;
      this.ocultarProgreso();
    }
  }

  async cargarTesseract() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('No se pudo cargar Tesseract.js'));
      document.head.appendChild(script);
    });
  }

  async analizarActa(worker, urlActa, anio, grado, seccion, nombreBuscar) {
    try {
      // Cargar el HTML del acta
      const response = await fetch(urlActa);
      if (!response.ok) return false;
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Encontrar la sección específica
      const actaCard = doc.querySelector(
        `section[data-grado="${grado}"][data-seccion="${seccion}"]`
      );
      
      if (!actaCard) return false;

      // Obtener todas las imágenes de esta acta
      const imagenes = actaCard.querySelectorAll('img');
      
      for (const img of imagenes) {
        const urlImagen = img.src;
        
        // Analizar imagen con OCR
        const { data: { text } } = await worker.recognize(urlImagen);
        const textoLimpio = text.toLowerCase();
        
        // Buscar el nombre en el texto extraído
        if (textoLimpio.includes(nombreBuscar)) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error(`Error analizando ${anio}-${grado}${seccion}:`, error);
      return false;
    }
  }

  mostrarProgreso(mensaje, porcentaje) {
    let modal = document.getElementById('modal-busqueda-ia');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-busqueda-ia';
      modal.className = 'modal-busqueda';
      modal.innerHTML = `
        <div class="modal-contenido">
          <h3>🤖 Búsqueda Inteligente</h3>
          <p id="mensaje-progreso"></p>
          <div class="barra-progreso">
            <div id="barra-progreso-fill" class="barra-progreso-fill"></div>
          </div>
          <p id="porcentaje-progreso">0%</p>
        </div>
      `;
      document.body.appendChild(modal);
    }

    modal.style.display = 'flex';
    document.getElementById('mensaje-progreso').textContent = mensaje;
    document.getElementById('barra-progreso-fill').style.width = porcentaje + '%';
    document.getElementById('porcentaje-progreso').textContent = porcentaje + '%';
  }

  actualizarProgresoSeccion(porcentaje) {
    const fill = document.getElementById('barra-progreso-fill');
    if (fill) {
      fill.style.width = porcentaje + '%';
    }
  }

  ocultarProgreso() {
    const modal = document.getElementById('modal-busqueda-ia');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  mostrarResultados(nombreBuscado) {
    let modal = document.getElementById('modal-resultados-ia');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-resultados-ia';
      modal.className = 'modal-busqueda';
      document.body.appendChild(modal);
    }

    let html = `
      <div class="modal-contenido resultados">
        <h3>🔍 Resultados para "${nombreBuscado}"</h3>
    `;

    if (this.resultados.length === 0) {
      html += `
        <p class="sin-resultados">No se encontraron coincidencias en ninguna acta.</p>
        <p class="sugerencia">Intenta con otro nombre o verifica la ortografía.</p>
      `;
    } else {
      html += `<p class="total-resultados">Se encontraron ${this.resultados.length} coincidencia(s):</p>`;
      html += '<div class="lista-resultados">';
      
      this.resultados.forEach(resultado => {
        html += `
          <div class="resultado-item">
            <div class="resultado-info">
              <strong>📅 Año:</strong> ${resultado.anio}<br>
              <strong>📚 Grado:</strong> ${resultado.grado}°<br>
              <strong>🏫 Sección:</strong> ${resultado.seccion}
            </div>
            <button onclick="verActa('${resultado.anio}', '${resultado.grado}', '${resultado.seccion}')" 
                    class="btn-ver-acta">
              Ver Acta
            </button>
          </div>
        `;
      });
      
      html += '</div>';
    }

    html += `
        <button onclick="cerrarResultados()" class="btn-cerrar">Cerrar</button>
      </div>
    `;

    modal.innerHTML = html;
    modal.style.display = 'flex';
  }
}

// Inicializar buscador
const buscadorIA = new BuscadorIA();

// Funciones globales
function buscarConIA() {
  const input = document.getElementById('busqueda-ia-input');
  const nombre = input.value;
  buscadorIA.buscarEstudiante(nombre);
}

function cerrarResultados() {
  const modal = document.getElementById('modal-resultados-ia');
  if (modal) {
    modal.style.display = 'none';
  }
}

function verActa(anio, grado, seccion) {
  // Redirigir a la página del año con los parámetros
  window.location.href = `${anio}/${anio}.html?grado=${grado}&seccion=${seccion}`;
}
