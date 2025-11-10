// Buscador Inteligente - Búsqueda rápida en índice pre-generado
// Sistema de búsqueda instantánea sin necesidad de OCR

class BuscadorIA {
  constructor() {
    this.resultados = [];
    this.buscando = false;
    this.catalogoCompleto = this.obtenerCatalogoCompleto();
    this.indiceEstudiantes = null; // Se cargará dinámicamente
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
    if (nombre.length < 2) {
      alert('Por favor ingresa al menos 2 letras del nombre');
      return;
    }

    this.buscando = true;
    this.resultados = [];
    this.mostrarProgreso('Buscando...', 50);

    try {
      // Cargar índice si no está cargado
      if (!this.indiceEstudiantes) {
        this.mostrarProgreso('Cargando índice de estudiantes...', 30);
        await this.cargarIndice();
      }

      this.mostrarProgreso('Buscando coincidencias...', 70);

      // Búsqueda rápida en el índice
      for (const [nombreCompleto, ubicaciones] of Object.entries(this.indiceEstudiantes)) {
        if (nombreCompleto.toLowerCase().includes(nombre)) {
          // Agregar todas las ubicaciones donde aparece este estudiante
          ubicaciones.forEach(ubicacion => {
            this.resultados.push({
              anio: ubicacion.anio,
              grado: ubicacion.grado,
              seccion: ubicacion.seccion,
              url: `${ubicacion.anio}/${ubicacion.anio}.html`,
              nombreCompleto: nombreCompleto
            });
          });
        }
      }

      this.mostrarProgreso('Completado', 100);
      this.mostrarResultados(nombre);

    } catch (error) {
      console.error('Error en búsqueda:', error);
      
      // Si falla la carga del índice, ofrecer búsqueda manual
      this.ocultarProgreso();
      const respuesta = confirm(
        'No se pudo cargar el índice de búsqueda.\n\n' +
        '¿Deseas crear el índice ahora? (Tomará unos minutos pero solo se hace una vez)\n\n' +
        'Presiona Aceptar para crear el índice, o Cancelar para buscar manualmente.'
      );
      
      if (respuesta) {
        this.generarIndiceConOCR();
      }
    } finally {
      this.buscando = false;
      setTimeout(() => this.ocultarProgreso(), 500);
    }
  }

  async cargarIndice() {
    try {
      const response = await fetch('js/indice-estudiantes.json');
      if (!response.ok) throw new Error('No se pudo cargar el índice');
      this.indiceEstudiantes = await response.json();
    } catch (error) {
      // Si no existe el índice, usar un índice demo
      console.warn('Usando índice demo. Genera el índice real con OCR.');
      this.indiceEstudiantes = this.obtenerIndicDemo();
      throw error; // Propagar para que se ofrezca generarlo
    }
  }

  obtenerIndicDemo() {
    // Índice de demostración - puedes reemplazar esto con nombres reales
    return {
      "EJEMPLO ESTUDIANTE UNO": [
        { "anio": "2012", "grado": "5", "seccion": "A" }
      ],
      "EJEMPLO ESTUDIANTE DOS": [
        { "anio": "2011", "grado": "4", "seccion": "B" }
      ]
      // Aquí irían todos los nombres de estudiantes extraídos con OCR
    };
  }

  async generarIndiceConOCR() {
    if (this.buscando) return;
    
    this.buscando = true;
    this.mostrarProgreso('Preparando generación de índice...', 0);

    try {
      // Cargar Tesseract.js
      if (typeof Tesseract === 'undefined') {
        this.mostrarProgreso('Cargando motor OCR...', 5);
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

      const nuevoIndice = {};
      let totalActas = 0;
      let actasAnalizadas = 0;

      // Contar total
      for (const [anio, grados] of Object.entries(this.catalogoCompleto)) {
        for (const [grado, secciones] of Object.entries(grados)) {
          totalActas += secciones.length;
        }
      }

      // Analizar cada acta
      for (const [anio, grados] of Object.entries(this.catalogoCompleto)) {
        for (const [grado, secciones] of Object.entries(grados)) {
          for (const seccion of secciones) {
            const progreso = Math.round((actasAnalizadas / totalActas) * 100);
            this.mostrarProgreso(`Analizando ${anio} - Grado ${grado}${seccion}...`, progreso);
            
            const nombres = await this.extraerNombresDeActa(worker, anio, grado, seccion);
            
            // Agregar al índice
            nombres.forEach(nombre => {
              if (!nuevoIndice[nombre]) {
                nuevoIndice[nombre] = [];
              }
              nuevoIndice[nombre].push({ anio, grado, seccion });
            });

            actasAnalizadas++;
          }
        }
      }

      await worker.terminate();

      // Guardar índice (mostrar JSON para que el usuario lo copie)
      const jsonIndice = JSON.stringify(nuevoIndice, null, 2);
      this.mostrarIndiceGenerado(jsonIndice);
      this.indiceEstudiantes = nuevoIndice;

    } catch (error) {
      console.error('Error generando índice:', error);
      alert('Error al generar el índice: ' + error.message);
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

  async extraerNombresDeActa(worker, anio, grado, seccion) {
    try {
      const urlActa = `${anio}/${anio}.html`;
      const response = await fetch(urlActa);
      if (!response.ok) return [];
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const actaCard = doc.querySelector(
        `section[data-grado="${grado}"][data-seccion="${seccion}"]`
      );
      
      if (!actaCard) return [];

      const imagenes = actaCard.querySelectorAll('img');
      const nombres = [];
      
      for (const img of imagenes) {
        const { data: { text } } = await worker.recognize(img.src);
        
        // Extraer nombres (líneas que parecen nombres)
        const lineas = text.split('\n');
        lineas.forEach(linea => {
          const limpia = linea.trim();
          // Filtrar líneas que parecen nombres (más de 3 palabras, letras mayúsculas)
          if (limpia.length > 5 && /[A-ZÁÉÍÓÚÑ]/.test(limpia)) {
            nombres.push(limpia);
          }
        });
      }

      return [...new Set(nombres)]; // Eliminar duplicados
    } catch (error) {
      console.error(`Error extrayendo nombres ${anio}-${grado}${seccion}:`, error);
      return [];
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
        <p class="sin-resultados">No se encontraron coincidencias.</p>
        <p class="sugerencia">Intenta con otro nombre o verifica la ortografía.</p>
        <p class="sugerencia"><small>Si crees que el estudiante existe, puedes generar el índice completo usando OCR.</small></p>
      `;
    } else {
      html += `<p class="total-resultados">✅ ${this.resultados.length} coincidencia(s) encontrada(s):</p>`;
      html += '<div class="lista-resultados">';
      
      this.resultados.forEach(resultado => {
        const nombreMostrar = resultado.nombreCompleto || 'Estudiante';
        html += `
          <div class="resultado-item">
            <div class="resultado-info">
              <strong>� Nombre:</strong> ${nombreMostrar}<br>
              <strong>�📅 Año:</strong> ${resultado.anio}<br>
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

  mostrarIndiceGenerado(jsonIndice) {
    let modal = document.getElementById('modal-indice-generado');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-indice-generado';
      modal.className = 'modal-busqueda';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-contenido resultados">
        <h3>✅ Índice Generado</h3>
        <p>Copia este contenido y guárdalo como <code>js/indice-estudiantes.json</code></p>
        <textarea id="indice-json" readonly style="width:100%; height:300px; margin:15px 0; padding:10px; font-family:monospace; font-size:0.8rem; background:#1a1a1a; color:#34d399; border:1px solid #34d399; border-radius:8px;">${jsonIndice}</textarea>
        <button onclick="copiarIndice()" class="btn-ver-acta" style="width:100%; margin-bottom:10px;">
          📋 Copiar al portapapeles
        </button>
        <button onclick="descargarIndice()" class="btn-ver-acta" style="width:100%; margin-bottom:10px;">
          💾 Descargar archivo
        </button>
        <button onclick="cerrarModalIndice()" class="btn-cerrar">Cerrar</button>
      </div>
    `;

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

function copiarIndice() {
  const textarea = document.getElementById('indice-json');
  textarea.select();
  document.execCommand('copy');
  alert('✅ Índice copiado al portapapeles');
}

function descargarIndice() {
  const textarea = document.getElementById('indice-json');
  const blob = new Blob([textarea.value], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'indice-estudiantes.json';
  a.click();
  URL.revokeObjectURL(url);
  alert('✅ Archivo descargado. Muévelo a la carpeta js/');
}

function cerrarModalIndice() {
  const modal = document.getElementById('modal-indice-generado');
  if (modal) {
    modal.style.display = 'none';
  }
}
