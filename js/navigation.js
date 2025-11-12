/**
 * ============================================
 * MÓDULO DE NAVEGACIÓN
 * ============================================
 * Maneja la navegación entre diferentes niveles del sistema:
 * - Nivel 1: Login
 * - Nivel 2: Selector de tipo de actas (Normales/Recuperación)
 * - Nivel 3: Selector de actas (Año/Grado/Sección)
 * - Nivel 4: Visualización de actas
 */

const NavigationModule = (function() {
  'use strict';

  /**
   * Muestra el selector de tipo de actas (Nivel 2)
   */
  function showTypeSelector() {
    clearDynamicMenus();
    
    const loginDiv = document.getElementById("login");
    const opcionesDiv = document.createElement("div");
    opcionesDiv.id = "opciones";
    opcionesDiv.className = "menu-box";
    opcionesDiv.innerHTML = `
      <h1 class="logo">Antonia Moreno de Caceres</h1>
      <h2>Seleccionar Tipo de Actas</h2>
      <div style="display: flex; flex-direction: column; gap: 10px; margin: 20px 0;">
        <button onclick="NavigationModule.showMenu('menu')" style="padding: 15px; font-size: 16px;">
          📚 Actas Normales
        </button>
        <button onclick="NavigationModule.showMenu('recuperacion')" style="padding: 15px; font-size: 16px;">
          📝 Actas de Recuperación
        </button>
        <button onclick="logout()" style="padding: 10px; font-size: 14px; background-color: #dc3545; color: white; margin-top: 10px;">
          🚪 Cerrar Sesión
        </button>
      </div>
    `;
    
    if (loginDiv && loginDiv.parentNode) {
      loginDiv.parentNode.insertBefore(opcionesDiv, loginDiv);
    }
  }

  /**
   * Muestra un menú específico (Nivel 3)
   * @param {string} tipo - 'menu' para actas normales, 'recuperacion' para recuperación
   */
  function showMenu(tipo) {
    const opcionesDiv = document.getElementById("opciones");
    const targetDiv = document.getElementById(tipo);
    
    if (opcionesDiv) opcionesDiv.style.display = "none";
    if (targetDiv) targetDiv.style.display = "block";
  }

  /**
   * Muestra el selector de actas normales
   */
  function showActasSelector() {
    const menuDiv = document.getElementById('menu');
    if (menuDiv) menuDiv.style.display = 'block';
  }

  /**
   * Muestra el selector de actas de recuperación
   */
  function showRecuperacionSelector() {
    const recuperacionDiv = document.getElementById('recuperacion');
    if (recuperacionDiv) recuperacionDiv.style.display = 'block';
  }

  /**
   * Vuelve al selector de tipo de actas (Nivel 2)
   */
  function backToTypeSelector() {
    const menuDiv = document.getElementById("menu");
    const recuperacionDiv = document.getElementById("recuperacion");
    
    if (menuDiv) menuDiv.style.display = "none";
    if (recuperacionDiv) recuperacionDiv.style.display = "none";
    
    const opcionesDiv = document.getElementById("opciones");
    if (opcionesDiv) {
      opcionesDiv.style.display = "block";
    } else {
      showTypeSelector();
    }
  }

  /**
   * Limpia todos los menús dinámicos creados
   */
  function clearDynamicMenus() {
    const opcionesDiv = document.getElementById("opciones");
    if (opcionesDiv && opcionesDiv.parentNode) {
      opcionesDiv.parentNode.removeChild(opcionesDiv);
    }
  }

  /**
   * Navega a una página de actas específica
   * @param {string} anio - Año del acta
   * @param {string} grado - Grado del acta
   * @param {string} seccion - Sección del acta (opcional)
   */
  function goToActa(anio, grado, seccion) {
    if (anio && grado && seccion) {
      window.location.href = `${anio}?grado=${grado}&seccion=${seccion}`;
    } else if (anio && grado) {
      window.location.href = `${anio}?grado=${grado}`;
    } else {
      alert(window.APP_CONFIG.MESSAGES.SELECT_REQUIRED);
    }
  }

  /**
   * Navega a una página de actas de recuperación
   * @param {string} anio - Año del acta de recuperación
   */
  function goToRecuperacion(anio) {
    if (anio) {
      window.location.href = anio;
    } else {
      alert(window.APP_CONFIG.MESSAGES.SELECT_REQUIRED);
    }
  }

  /**
   * Agrega botones de navegación en las páginas de años
   */
  function addYearPageButtons() {
    const path = window.location.pathname.replace(/\\/g, '/');
    const config = window.APP_CONFIG.SELECTORS;
    const isYearPage = config.YEAR_PAGE_PATTERN.test(path) || 
                       config.RECOVERY_PAGE_PATTERN.test(path);
    
    if (!isYearPage) return;
    
    const header = document.querySelector('header');
    if (header && !header.querySelector('.navigation-buttons')) {
      const navDiv = document.createElement('div');
      navDiv.className = 'navigation-buttons';
      navDiv.style.cssText = 'margin: 10px 0; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;';
      navDiv.innerHTML = `
        <button onclick="window.location.href='../index.html?menu=actas'" 
                style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
          ← Volver al Selector
        </button>
        <button onclick="logout()" 
                style="padding: 10px 20px; background-color: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">
          🚪 Cerrar Sesión
        </button>
      `;
      header.appendChild(navDiv);
    }
  }

  // API pública del módulo
  return {
    showTypeSelector,
    showMenu,
    showActasSelector,
    showRecuperacionSelector,
    backToTypeSelector,
    clearDynamicMenus,
    goToActa,
    goToRecuperacion,
    addYearPageButtons
  };

})();

// Exponer funciones globales para compatibilidad con HTML onclick
window.mostrarMenu = NavigationModule.showMenu;
window.volverATipoActas = NavigationModule.backToTypeSelector;
window.entrar = function() {
  const anio = document.getElementById('anio').value;
  const grado = document.getElementById('grado').value;
  const seccion = document.getElementById('seccion').value;
  NavigationModule.goToActa(anio, grado, seccion);
};
window.entrarRecuperacion = function() {
  const anio = document.getElementById('anio-rp').value;
  NavigationModule.goToRecuperacion(anio);
};
