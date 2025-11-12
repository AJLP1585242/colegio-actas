// --- Login y panel ---
function login() {
  let u = document.getElementById("usuario").value;
  let p = document.getElementById("clave").value;
  if (u === "admin" && p === "1234") {
    // Guardar el estado de la sesión
    sessionStorage.setItem('authenticated', 'true');
    document.getElementById("login").style.display = "none";
    mostrarOpciones();
  } else {
    alert("Usuario o clave incorrectos");
  }
}

// Función para cerrar sesión
function logout() {
  sessionStorage.removeItem('authenticated');
  // Redirigir al index desde cualquier ubicación
  const currentPath = window.location.pathname;
  if (currentPath.includes('/') && !currentPath.endsWith('index.html')) {
    // Si estamos en una subcarpeta, navegar al index del directorio raíz
    window.location.href = '../index.html';
  } else {
    // Si ya estamos en el directorio raíz, ocultar menús y mostrar login
    const loginDiv = document.getElementById("login");
    const menuDiv = document.getElementById("menu");
    const recuperacionDiv = document.getElementById("recuperacion");
    
    // Limpiar menús dinámicos
    limpiarMenus();
    
    // Ocultar todos los menús estáticos
    if (menuDiv) menuDiv.style.display = "none";
    if (recuperacionDiv) recuperacionDiv.style.display = "none";
    
    // Mostrar el formulario de login
    if (loginDiv) {
      loginDiv.style.display = "block";
      // Limpiar los campos del formulario
      const usuarioInput = document.getElementById("usuario");
      const claveInput = document.getElementById("clave");
      if (usuarioInput) usuarioInput.value = "";
      if (claveInput) claveInput.value = "";
    }
  }
}

// Verificar autenticación al cargar la página
function checkAuthentication() {
  const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
  const currentPath = window.location.pathname;
  const isIndexPage = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '/';
  
  if (!isIndexPage && !isAuthenticated) {
    // Si no está en index y no está autenticado, redirigir al login sin popup molesto
    console.log('Sesión no válida, redirigiendo al login...');
    window.location.href = '../index.html';
    return false;
  } else if (isIndexPage && isAuthenticated) {
    // Si está en index y ya está autenticado, verificar si debe mostrar un menú específico
    const urlParams = new URLSearchParams(window.location.search);
    const menuParam = urlParams.get('menu');
    
    const loginDiv = document.getElementById("login");
    if (loginDiv) {
      loginDiv.style.display = "none";
      
      // Si tiene parámetro menu=actas, mostrar directamente el selector de actas
      if (menuParam === 'actas') {
        limpiarMenus();
        document.getElementById('menu').style.display = 'block';
      } else if (menuParam === 'recuperacion') {
        limpiarMenus();
        document.getElementById('recuperacion').style.display = 'block';
      } else {
        // Mostrar opciones de tipo de actas
        mostrarOpciones();
      }
    }
    return true;
  }
  return isAuthenticated;
}

function mostrarOpciones() {
  // Limpiar cualquier menú existente primero
  limpiarMenus();
  
  // Crear botones para elegir entre actas normales y de recuperación
  const loginDiv = document.getElementById("login");
  const opcionesDiv = document.createElement("div");
  opcionesDiv.id = "opciones";
  opcionesDiv.className = "menu-box";
  opcionesDiv.innerHTML = `
    <h1 class="logo">Antonia Moreno de Caceres</h1>
    <h2>Seleccionar Tipo de Actas</h2>
    <div style="display: flex; flex-direction: column; gap: 10px; margin: 20px 0;">
      <button onclick="mostrarMenu('menu')" style="padding: 15px; font-size: 16px;">Actas Normales</button>
      <button onclick="mostrarMenu('recuperacion')" style="padding: 15px; font-size: 16px;">Actas de Recuperación</button>
      <button onclick="logout()" style="padding: 10px; font-size: 14px; background-color: #dc3545; color: white; margin-top: 10px;">Cerrar Sesión</button>
    </div>
  `;
  loginDiv.parentNode.insertBefore(opcionesDiv, loginDiv);
}

// Función para limpiar todos los menús dinámicos
function limpiarMenus() {
  const opcionesDiv = document.getElementById("opciones");
  if (opcionesDiv && opcionesDiv.parentNode) {
    opcionesDiv.parentNode.removeChild(opcionesDiv);
  }
}

function mostrarMenu(tipo) {
  document.getElementById("opciones").style.display = "none";
  document.getElementById(tipo).style.display = "block";
}

function volverATipoActas() {
  // Ocultar los selectores de actas
  const menuDiv = document.getElementById("menu");
  const recuperacionDiv = document.getElementById("recuperacion");
  
  if (menuDiv) menuDiv.style.display = "none";
  if (recuperacionDiv) recuperacionDiv.style.display = "none";
  
  // Mostrar el selector de tipo de actas
  const opcionesDiv = document.getElementById("opciones");
  if (opcionesDiv) {
    opcionesDiv.style.display = "block";
  } else {
    // Si no existe, recrearlo
    mostrarOpciones();
  }
}

function entrarRecuperacion() {
  const anio = document.getElementById('anio-rp').value;
  if (anio) {
    window.location.href = anio;
  } else {
    alert("Por favor selecciona un año.");
  }
}

// --- FILTRO DE ACTAS ---
document.addEventListener('DOMContentLoaded', function() {
  // Detectar si estamos en una página de año: .../YYYY/YYYY.html o .../YYYY_rp/YYYYrp.html
  const path = window.location.pathname.replace(/\\/g, '/');
  const isYearPage = /\/\d{4}\/\d{4}\.html$/.test(path) || /\/\d{4}_rp\/\d{4}rp\.html$/.test(path);
  
  // Verificar autenticación - si no está autenticado y es una página de año, redirigir
  if (isYearPage && !checkAuthentication()) {
    return; // checkAuthentication() ya maneja la redirección
  } else if (!isYearPage) {
    // Solo verificar en index
    checkAuthentication();
  }
  
  // Agregar botones de navegación si estamos en una página de año
  addNavigationButtons();
  
  // Inicializar controles de zoom para imágenes
  initImageZoom();
  
  if (isYearPage) {
    const params = new URLSearchParams(window.location.search);
    const grado = params.get('grado');
    const seccion = params.get('seccion');
    const cards = Array.from(document.querySelectorAll('.card, .acta-card'));

    if (grado) {
      let found = false;
      cards.forEach(card => {
        const match = card.dataset.grado === grado && (!seccion || card.dataset.seccion === seccion);
        card.style.display = match ? '' : 'none';
        if (match) found = true;
      });
      if (!found) {
        const main = document.querySelector('main');
        if (main) {
          const msg = document.createElement('div');
          msg.className = 'acta-card';
          msg.innerHTML = `<p>No se encontró el acta seleccionada.</p>`;
          main.appendChild(msg);
        }
      }
    } else {
      // Sin parámetros, no filtramos: se muestran todas las tarjetas tal cual.
    }
  }
});

// Función para agregar botones de navegación automáticamente
function addNavigationButtons() {
  const path = window.location.pathname.replace(/\\/g, '/');
  const isYearPage = /\/\d{4}\/\d{4}\.html$/.test(path) || /\/\d{4}_rp\/\d{4}rp\.html$/.test(path);
  
  if (isYearPage) {
    const header = document.querySelector('header');
    if (header && !header.querySelector('.navigation-buttons')) {
      const navDiv = document.createElement('div');
      navDiv.className = 'navigation-buttons';
      navDiv.style.cssText = 'margin: 10px 0; display: flex; gap: 10px; justify-content: center;';
      navDiv.innerHTML = `
        <button onclick="window.location.href='../index.html?menu=actas'" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Volver al Selector</button>
        <button onclick="logout()" style="padding: 10px 20px; background-color: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">Cerrar Sesión</button>
      `;
      header.appendChild(navDiv);
    }
  }
}

// --- Sistema de zoom con controles ---
function initImageZoom() {
  // Procesar todas las imágenes existentes en las cards
  const images = document.querySelectorAll('.card img, .acta-card img');
  images.forEach(img => {
    wrapImageWithZoom(img);
  });

  // Observer para imágenes que se agreguen dinámicamente
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) { // Element node
          const newImages = node.querySelectorAll ? node.querySelectorAll('.card img:not(.zoom-image), .acta-card img:not(.zoom-image)') : [];
          newImages.forEach(img => wrapImageWithZoom(img));
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function wrapImageWithZoom(img) {
  if (img.classList.contains('zoom-image')) return; // Ya procesada
  
  // Crear contenedor
  const container = document.createElement('div');
  container.className = 'zoom-container';
  
  // Insertar contenedor antes de la imagen
  img.parentNode.insertBefore(container, img);
  
  // Mover imagen al contenedor y agregar clase
  container.appendChild(img);
  img.classList.add('zoom-image');
  
  // Crear controles
  const controls = document.createElement('div');
  controls.className = 'zoom-controls';
  controls.innerHTML = `
    <button class="zoom-btn zoom-in" title="Acercar">+</button>
    <button class="zoom-btn zoom-out" title="Alejar">−</button>
    <button class="zoom-btn zoom-reset" title="Tamaño original">⌂</button>
  `;
  
  // Crear indicador de nivel de zoom
  const zoomLevel = document.createElement('div');
  zoomLevel.className = 'zoom-level';
  zoomLevel.textContent = '100%';
  
  container.appendChild(controls);
  container.appendChild(zoomLevel);
  
  // Variables de zoom
  let currentZoom = 1;
  let isDragging = false;
  let startX = 0, startY = 0;
  let translateX = 0, translateY = 0;
  
  // Función para actualizar el transform
  function updateTransform() {
    img.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
    zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
  }
  
  // Event listeners para los controles
  controls.querySelector('.zoom-in').addEventListener('click', function(e) {
    e.stopPropagation();
    currentZoom = Math.min(currentZoom * 1.2, 5);
    updateTransform();
  });
  
  controls.querySelector('.zoom-out').addEventListener('click', function(e) {
    e.stopPropagation();
    currentZoom = Math.max(currentZoom / 1.2, 0.5);
    updateTransform();
  });
  
  controls.querySelector('.zoom-reset').addEventListener('click', function(e) {
    e.stopPropagation();
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
  });
  
  // Zoom con rueda del mouse
  container.addEventListener('wheel', function(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    currentZoom = Math.max(0.5, Math.min(5, currentZoom * delta));
    updateTransform();
  });
  
  // Arrastrar imagen cuando está en zoom
  img.addEventListener('mousedown', function(e) {
    if (currentZoom > 1) {
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      img.style.cursor = 'grabbing';
      e.preventDefault();
    }
  });
  
  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      updateTransform();
    }
  });
  
  document.addEventListener('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      img.style.cursor = currentZoom > 1 ? 'grab' : 'crosshair';
    }
  });
  
  // Cambiar cursor según el zoom
  img.addEventListener('mouseover', function() {
    if (currentZoom > 1) {
      img.style.cursor = 'grab';
    } else {
      img.style.cursor = 'crosshair';
    }
  });
}

function entrar() {
  const anio = document.getElementById('anio').value;
  const grado = document.getElementById('grado').value;
  const seccion = document.getElementById('seccion').value;
  if (anio && grado && seccion) {
    window.location.href = `${anio}?grado=${grado}&seccion=${seccion}`;
  } else if (anio && grado) {
    window.location.href = `${anio}?grado=${grado}`;
  } else {
    alert("Por favor selecciona al menos año y grado.");
  }
}

// --- Generar PDF ---
function generarPDF(anio, grado, seccion, url1, url2) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.setFontSize(14);
  pdf.text(`${anio} - Grado ${grado} - Sección ${seccion}`, 15, 15);

  let img1 = new Image();
  img1.crossOrigin = "anonymous";
  img1.src = url1;
  img1.onload = function () {
    let imgWidth = pageWidth - 20; // márgenes
    let ratio = img1.width / img1.height;
    let imgHeight = imgWidth / ratio;

    // Si la suma de ambas imágenes excede el alto, las ajustamos proporcionalmente
    if (url2) {
      let img2 = new Image();
      img2.crossOrigin = "anonymous";
      img2.src = url2;
      img2.onload = function () {
        let img2Width = pageWidth - 20;
        let ratio2 = img2.width / img2.height;
        let img2Height = img2Width / ratio2;

        // Calcular espacio disponible para ambas imágenes
        let espacioDisponible = pageHeight - 25 - 10 - 10; // margen superior + espacio entre + margen inferior
        let sumaAltos = imgHeight + img2Height + 10;
        if (sumaAltos > espacioDisponible) {
          // Ajustar ambas imágenes proporcionalmente
          let factor = espacioDisponible / sumaAltos;
          imgHeight = imgHeight * factor;
          imgWidth = imgWidth * factor;
          img2Height = img2Height * factor;
          img2Width = img2Width * factor;
        }

    // Usar canvas para asegurar orientación correcta
    const canvas1 = document.createElement('canvas');
    canvas1.width = img1.naturalWidth;
    canvas1.height = img1.naturalHeight;
    const ctx1 = canvas1.getContext('2d');
    ctx1.drawImage(img1, 0, 0);
    const imgData1 = canvas1.toDataURL('image/jpeg', 1.0);
    pdf.addImage(imgData1, 'JPEG', 10, 25, imgWidth, imgHeight);

    const canvas2 = document.createElement('canvas');
    canvas2.width = img2.naturalWidth;
    canvas2.height = img2.naturalHeight;
    const ctx2 = canvas2.getContext('2d');
    ctx2.drawImage(img2, 0, 0);
    const imgData2 = canvas2.toDataURL('image/jpeg', 1.0);
    pdf.addImage(imgData2, 'JPEG', 10, 25 + imgHeight + 10, img2Width, img2Height);
    pdf.save(`acta_${anio}_${grado}${seccion}.pdf`);
      };
    } else {
      // Solo una imagen, ajusta si es necesario
      let espacioDisponible = pageHeight - 25 - 10;
      if (imgHeight > espacioDisponible) {
        let factor = espacioDisponible / imgHeight;
        imgHeight = imgHeight * factor;
        imgWidth = imgWidth * factor;
      }
  // Usar canvas para asegurar orientación correcta
  const canvas1 = document.createElement('canvas');
  canvas1.width = img1.naturalWidth;
  canvas1.height = img1.naturalHeight;
  const ctx1 = canvas1.getContext('2d');
  ctx1.drawImage(img1, 0, 0);
  const imgData1 = canvas1.toDataURL('image/jpeg', 1.0);
  pdf.addImage(imgData1, 'JPEG', 10, 25, imgWidth, imgHeight);
  pdf.save(`acta_${anio}_${grado}${seccion}.pdf`);
    }
  };
}

// --- Generar un PDF con todas las imágenes de la página ---
// Basado en el snippet proporcionado, adaptado a UMD (CDN) y con fallback por CORS.
function generarPDFConTodasLasImagenes() {
  // Eliminada: solo se mantiene la función generarPDF sencilla
}