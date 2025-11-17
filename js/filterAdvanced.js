// =================================
// FILTER ADVANCED - Sistema de filtros mejorado
// =================================

const FilterAdvanced = (function() {
  'use strict';

  let currentMode = 'year-grade-section'; // Modo actual de filtrado

  /**
   * Cambiar modo de visualización
   */
  function setFilterMode(mode) {
    currentMode = mode;
    updateFilterUI();
    console.log(`📋 Modo de filtro: ${mode}`);
  }

  /**
   * Actualizar UI según el modo
   */
  function updateFilterUI() {
    const gradoContainer = document.querySelector('.grado-container');
    const seccionContainer = document.querySelector('.seccion-container');
    const modeSelector = document.getElementById('filter-mode');

    if (!gradoContainer || !seccionContainer) return;

    switch(currentMode) {
      case 'year-only':
        // Solo año (ver todas las actas del año)
        gradoContainer.style.display = 'none';
        seccionContainer.style.display = 'none';
        break;
      
      case 'year-grade':
        // Año + grado (todas las secciones del grado)
        gradoContainer.style.display = 'block';
        seccionContainer.style.display = 'none';
        break;
      
      case 'year-grade-section':
        // Año + grado + sección (específico)
        gradoContainer.style.display = 'block';
        seccionContainer.style.display = 'block';
        break;
    }

    if (modeSelector) {
      modeSelector.value = currentMode;
    }
  }

  /**
   * Crear selector de modo
   */
  function createModeSelector() {
    const container = document.querySelector('.login-box') || document.querySelector('.menu-box');
    if (!container) return;

    const existingSelector = document.getElementById('filter-mode-container');
    if (existingSelector) return;

    const modeContainer = document.createElement('div');
    modeContainer.id = 'filter-mode-container';
    modeContainer.style.marginBottom = '20px';
    modeContainer.innerHTML = `
      <label for="filter-mode" style="color: #e5e7eb; font-size: 0.9rem; margin-bottom: 8px; display: block;">
        📋 Modo de filtro:
      </label>
      <select id="filter-mode" style="width: 100%; padding: 12px; border-radius: 8px; background: rgba(31, 41, 55, 0.8); color: white; border: 1px solid rgba(52, 211, 153, 0.2);">
        <option value="year-only">🗂️ Solo Año (todas las actas)</option>
        <option value="year-grade">📚 Año + Grado (todas secciones)</option>
        <option value="year-grade-section" selected>📄 Año + Grado + Sección (específico)</option>
      </select>
    `;

    // Insertar antes del selector de año
    const anioContainer = container.querySelector('label[for="anio"]')?.parentElement;
    if (anioContainer) {
      container.insertBefore(modeContainer, anioContainer);
    } else {
      container.insertBefore(modeContainer, container.firstChild);
    }

    // Event listener
    document.getElementById('filter-mode').addEventListener('change', function(e) {
      setFilterMode(e.target.value);
    });
  }

  /**
   * Inicializar en página index
   */
  function init() {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
      setTimeout(() => {
        createModeSelector();
        updateFilterUI();
      }, 100);
    }
  }

  return {
    init,
    setMode: setFilterMode,
    getMode: () => currentMode
  };
})();

// Auto-inicializar
document.addEventListener('DOMContentLoaded', () => {
  FilterAdvanced.init();
});

window.FilterAdvanced = FilterAdvanced;
