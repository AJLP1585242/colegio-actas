/**
 * ============================================
 * MÓDULO DE FILTRADO DE ACTAS
 * ============================================
 * Maneja el filtrado y visualización de actas en las páginas de años
 */

const FilterModule = (function() {
  'use strict';

  /**
   * Inicializa el sistema de filtrado en páginas de años
   */
  function initFilter() {
    const path = window.location.pathname.replace(/\\/g, '/');
    const config = window.APP_CONFIG.SELECTORS;
    const isYearPage = config.YEAR_PAGE_PATTERN.test(path) || 
                       config.RECOVERY_PAGE_PATTERN.test(path);
    
    if (!isYearPage) return;
    
    const params = new URLSearchParams(window.location.search);
    const grado = params.get('grado');
    const seccion = params.get('seccion');
    
    if (grado) {
      filterActas(grado, seccion);
    }
  }

  /**
   * Filtra las actas según grado y sección
   * @param {string} grado - Grado a filtrar
   * @param {string} seccion - Sección a filtrar (opcional)
   */
  function filterActas(grado, seccion) {
    const cards = Array.from(document.querySelectorAll(window.APP_CONFIG.SELECTORS.ACTA_CARDS));
    let found = false;

    cards.forEach(card => {
      const matchGrado = card.dataset.grado === grado;
      const matchSeccion = !seccion || card.dataset.seccion === seccion;
      const shouldShow = matchGrado && matchSeccion;
      
      card.style.display = shouldShow ? '' : 'none';
      if (shouldShow) found = true;
    });

    if (!found) {
      showNoActaMessage();
    }
  }

  /**
   * Muestra un mensaje cuando no se encuentra el acta
   */
  function showNoActaMessage() {
    const main = document.querySelector('main');
    if (main) {
      const msg = document.createElement('div');
      msg.className = 'acta-card';
      msg.innerHTML = `<p>${window.APP_CONFIG.MESSAGES.NO_ACTA_FOUND}</p>`;
      main.appendChild(msg);
    }
  }

  // API pública del módulo
  return {
    initFilter
  };

})();
