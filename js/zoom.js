/**
 * ============================================
 * MÓDULO DE ZOOM DE IMÁGENES
 * ============================================
 * Sistema de zoom y navegación para imágenes de actas
 * Funcionalidades:
 * - Zoom con controles +/-
 * - Zoom con rueda del mouse
 * - Arrastrar imagen cuando está en zoom
 * - Reset a tamaño original
 */

const ZoomModule = (function() {
  'use strict';

  const config = window.APP_CONFIG.ZOOM;

  /**
   * Inicializa el sistema de zoom para todas las imágenes
   */
  function initZoom() {
    // Procesar imágenes existentes
    processExistingImages();
    
    // Observer para imágenes dinámicas
    observeNewImages();
  }

  /**
   * Procesa todas las imágenes existentes en la página
   */
  function processExistingImages() {
    const images = document.querySelectorAll(window.APP_CONFIG.SELECTORS.ACTA_IMAGES);
    images.forEach(img => wrapImageWithZoom(img));
  }

  /**
   * Observa y procesa imágenes que se agreguen dinámicamente
   */
  function observeNewImages() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            const selector = window.APP_CONFIG.SELECTORS.ACTA_IMAGES;
            const newImages = node.querySelectorAll ? 
                            node.querySelectorAll(selector + ':not(.zoom-image)') : [];
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

  /**
   * Envuelve una imagen con controles de zoom
   * @param {HTMLImageElement} img - Imagen a procesar
   */
  function wrapImageWithZoom(img) {
    if (img.classList.contains('zoom-image')) return;
    
    // Crear contenedor
    const container = createZoomContainer(img);
    
    // Crear controles
    const controls = createZoomControls();
    const zoomLevel = createZoomLevelIndicator();
    
    container.appendChild(controls);
    container.appendChild(zoomLevel);
    
    // Inicializar funcionalidad de zoom
    initZoomFunctionality(container, img, controls, zoomLevel);
  }

  /**
   * Crea el contenedor de zoom
   * @param {HTMLImageElement} img - Imagen a envolver
   * @returns {HTMLElement} Contenedor creado
   */
  function createZoomContainer(img) {
    const container = document.createElement('div');
    container.className = 'zoom-container';
    
    img.parentNode.insertBefore(container, img);
    container.appendChild(img);
    img.classList.add('zoom-image');
    
    return container;
  }

  /**
   * Crea los controles de zoom
   * @returns {HTMLElement} Controles creados
   */
  function createZoomControls() {
    const controls = document.createElement('div');
    controls.className = 'zoom-controls';
    controls.innerHTML = `
      <button class="zoom-btn zoom-in" title="Acercar" aria-label="Acercar imagen">+</button>
      <button class="zoom-btn zoom-out" title="Alejar" aria-label="Alejar imagen">−</button>
      <button class="zoom-btn zoom-reset" title="Tamaño original" aria-label="Restaurar tamaño">⌂</button>
    `;
    return controls;
  }

  /**
   * Crea el indicador de nivel de zoom
   * @returns {HTMLElement} Indicador creado
   */
  function createZoomLevelIndicator() {
    const zoomLevel = document.createElement('div');
    zoomLevel.className = 'zoom-level';
    zoomLevel.textContent = '100%';
    return zoomLevel;
  }

  /**
   * Inicializa la funcionalidad de zoom para una imagen
   * @param {HTMLElement} container - Contenedor de la imagen
   * @param {HTMLImageElement} img - Imagen
   * @param {HTMLElement} controls - Controles de zoom
   * @param {HTMLElement} zoomLevel - Indicador de nivel
   */
  function initZoomFunctionality(container, img, controls, zoomLevel) {
    const state = {
      currentZoom: config.DEFAULT,
      isDragging: false,
      startX: 0,
      startY: 0,
      translateX: 0,
      translateY: 0
    };

    // Función para actualizar el transform
    const updateTransform = () => {
      img.style.transform = `scale(${state.currentZoom}) translate(${state.translateX}px, ${state.translateY}px)`;
      zoomLevel.textContent = `${Math.round(state.currentZoom * 100)}%`;
      updateCursor(img, state.currentZoom);
    };

    // Event listeners para los botones
    attachControlListeners(controls, state, updateTransform);
    
    // Zoom con rueda del mouse
    attachWheelListener(container, state, updateTransform);
    
    // Funcionalidad de arrastrar
    attachDragListeners(img, state, updateTransform);
  }

  /**
   * Adjunta listeners a los controles de zoom
   */
  function attachControlListeners(controls, state, updateTransform) {
    controls.querySelector('.zoom-in').addEventListener('click', (e) => {
      e.stopPropagation();
      state.currentZoom = Math.min(state.currentZoom * config.STEP, config.MAX);
      updateTransform();
    });
    
    controls.querySelector('.zoom-out').addEventListener('click', (e) => {
      e.stopPropagation();
      state.currentZoom = Math.max(state.currentZoom / config.STEP, config.MIN);
      updateTransform();
    });
    
    controls.querySelector('.zoom-reset').addEventListener('click', (e) => {
      e.stopPropagation();
      state.currentZoom = config.DEFAULT;
      state.translateX = 0;
      state.translateY = 0;
      updateTransform();
    });
  }

  /**
   * Adjunta listener para zoom con rueda del mouse
   */
  function attachWheelListener(container, state, updateTransform) {
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? (1 / config.STEP) : config.STEP;
      state.currentZoom = Math.max(config.MIN, Math.min(config.MAX, state.currentZoom * delta));
      updateTransform();
    });
  }

  /**
   * Adjunta listeners para arrastrar la imagen
   */
  function attachDragListeners(img, state, updateTransform) {
    img.addEventListener('mousedown', (e) => {
      if (state.currentZoom > 1) {
        state.isDragging = true;
        state.startX = e.clientX - state.translateX;
        state.startY = e.clientY - state.translateY;
        img.style.cursor = 'grabbing';
        e.preventDefault();
      }
    });
    
    document.addEventListener('mousemove', (e) => {
      if (state.isDragging) {
        state.translateX = e.clientX - state.startX;
        state.translateY = e.clientY - state.startY;
        updateTransform();
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (state.isDragging) {
        state.isDragging = false;
        updateCursor(img, state.currentZoom);
      }
    });
  }

  /**
   * Actualiza el cursor según el nivel de zoom
   */
  function updateCursor(img, zoom) {
    img.style.cursor = zoom > 1 ? 'grab' : 'crosshair';
  }

  // API pública del módulo
  return {
    initZoom
  };

})();
