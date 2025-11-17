// =================================
// PRESENTATION MODE - Modo presentación
// =================================

const PresentationMode = (function() {
  'use strict';

  let isPresenting = false;
  let currentSlide = 0;
  let slides = [];
  let presentationContainer = null;
  let controls = null;
  let autoHideTimeout = null;

  /**
   * Iniciar modo presentación
   */
  function start() {
    if (isPresenting) return;

    // Obtener todas las imágenes de actas
    const images = Array.from(document.querySelectorAll('.acta-card img'));
    if (images.length === 0) {
      alert('No hay imágenes para presentar');
      return;
    }

    slides = images;
    currentSlide = 0;
    isPresenting = true;

    createPresentationUI();
    enterFullscreen();
    showSlide(currentSlide);
    registerPresentationShortcuts();

    console.log('🎬 Modo presentación iniciado');
  }

  /**
   * Crear UI de presentación
   */
  function createPresentationUI() {
    presentationContainer = document.createElement('div');
    presentationContainer.id = 'presentation-mode';
    presentationContainer.innerHTML = `
      <style>
        #presentation-mode {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        #presentation-mode .slide-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        #presentation-mode .slide-image {
          max-width: 95%;
          max-height: 95%;
          object-fit: contain;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
          border: 2px solid rgba(52, 211, 153, 0.3);
          border-radius: 8px;
          animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        #presentation-mode .controls {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
          padding: 32px 24px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        #presentation-mode .controls.hidden {
          opacity: 0;
          transform: translateY(100%);
          pointer-events: none;
        }
        #presentation-mode .control-btn {
          background: rgba(52, 211, 153, 0.2);
          border: 2px solid #34d399;
          color: #34d399;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        #presentation-mode .control-btn:hover {
          background: rgba(52, 211, 153, 0.4);
          transform: translateY(-2px);
        }
        #presentation-mode .control-btn:active {
          transform: translateY(0);
        }
        #presentation-mode .counter {
          background: rgba(15, 32, 39, 0.9);
          border: 2px solid #34d399;
          color: #34d399;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          min-width: 100px;
          text-align: center;
        }
        #presentation-mode .exit-btn {
          position: fixed;
          top: 24px;
          right: 24px;
          background: rgba(239, 68, 68, 0.9);
          border: 2px solid #ef4444;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.2s ease;
          z-index: 10;
        }
        #presentation-mode .exit-btn:hover {
          background: rgba(220, 38, 38, 0.9);
          transform: scale(1.05);
        }
        #presentation-mode .nav-hint {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(52, 211, 153, 0.3);
          font-size: 64px;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }
        #presentation-mode .nav-hint.left {
          left: 24px;
        }
        #presentation-mode .nav-hint.right {
          right: 24px;
        }
        #presentation-mode .nav-hint:hover {
          opacity: 0.8;
        }
      </style>
      
      <div class="slide-container">
        <img class="slide-image" alt="Slide actual">
        <div class="nav-hint left" onclick="PresentationMode.previous()">◀</div>
        <div class="nav-hint right" onclick="PresentationMode.next()">▶</div>
      </div>

      <button class="exit-btn" onclick="PresentationMode.exit()">
        ✕ Salir (Esc)
      </button>

      <div class="controls">
        <button class="control-btn" onclick="PresentationMode.first()">
          ⏮ Inicio
        </button>
        <button class="control-btn" onclick="PresentationMode.previous()">
          ◀ Anterior
        </button>
        <div class="counter">
          <span id="current-slide">1</span> / <span id="total-slides">${slides.length}</span>
        </div>
        <button class="control-btn" onclick="PresentationMode.next()">
          Siguiente ▶
        </button>
        <button class="control-btn" onclick="PresentationMode.last()">
          Fin ⏭
        </button>
      </div>
    `;

    document.body.appendChild(presentationContainer);
    controls = presentationContainer.querySelector('.controls');

    // Auto-ocultar controles
    setupAutoHide();
  }

  /**
   * Mostrar slide específico
   */
  function showSlide(index) {
    if (index < 0 || index >= slides.length) return;

    currentSlide = index;
    const img = presentationContainer.querySelector('.slide-image');
    const sourceImg = slides[currentSlide];

    // Usar imagen mejorada si existe
    const enhancedSrc = sourceImg.getAttribute('data-enhanced-src') || 
                        sourceImg.getAttribute('data-original-src') || 
                        sourceImg.src;

    img.src = enhancedSrc;
    img.alt = sourceImg.alt || `Slide ${currentSlide + 1}`;

    // Actualizar contador
    document.getElementById('current-slide').textContent = currentSlide + 1;
    document.getElementById('total-slides').textContent = slides.length;

    // Anunciar a lectores de pantalla
    if (window.Accessibility) {
      window.Accessibility.announceToScreenReader(`Slide ${currentSlide + 1} de ${slides.length}`);
    }
  }

  /**
   * Configurar auto-ocultamiento de controles
   */
  function setupAutoHide() {
    let hideTimer;

    const showControls = () => {
      if (controls) {
        controls.classList.remove('hidden');
      }
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (controls) {
          controls.classList.add('hidden');
        }
      }, 3000);
    };

    presentationContainer.addEventListener('mousemove', showControls);
    presentationContainer.addEventListener('click', showControls);
    
    showControls();
  }

  /**
   * Registrar atajos de teclado para presentación
   */
  function registerPresentationShortcuts() {
    const handler = (e) => {
      if (!isPresenting) {
        document.removeEventListener('keydown', handler);
        return;
      }

      switch(e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          previous();
          break;
        case 'Home':
          e.preventDefault();
          first();
          break;
        case 'End':
          e.preventDefault();
          last();
          break;
        case 'Escape':
          e.preventDefault();
          exit();
          break;
      }
    };

    document.addEventListener('keydown', handler);
  }

  /**
   * Entrar en pantalla completa
   */
  function enterFullscreen() {
    if (presentationContainer.requestFullscreen) {
      presentationContainer.requestFullscreen();
    } else if (presentationContainer.webkitRequestFullscreen) {
      presentationContainer.webkitRequestFullscreen();
    } else if (presentationContainer.mozRequestFullScreen) {
      presentationContainer.mozRequestFullScreen();
    } else if (presentationContainer.msRequestFullscreen) {
      presentationContainer.msRequestFullscreen();
    }
  }

  /**
   * Navegación
   */
  function next() {
    if (currentSlide < slides.length - 1) {
      showSlide(currentSlide + 1);
    }
  }

  function previous() {
    if (currentSlide > 0) {
      showSlide(currentSlide - 1);
    }
  }

  function first() {
    showSlide(0);
  }

  function last() {
    showSlide(slides.length - 1);
  }

  /**
   * Salir del modo presentación
   */
  function exit() {
    if (!isPresenting) return;

    isPresenting = false;
    
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }

    if (presentationContainer) {
      presentationContainer.remove();
      presentationContainer = null;
    }

    slides = [];
    currentSlide = 0;

    console.log('🎬 Modo presentación finalizado');
  }

  /**
   * Agregar botón de presentación al menú
   */
  function addPresentationButton() {
    // Buscar contenedor de botones
    const menuBox = document.querySelector('.menu-box');
    if (!menuBox) {
      console.warn('No se encontró .menu-box para agregar botón de presentación');
      return;
    }

    const presentBtn = document.createElement('button');
    presentBtn.className = 'btn-presentacion';
    presentBtn.innerHTML = '🎬 Modo Presentación';
    presentBtn.style.cssText = `
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      color: white;
      border: 2px solid #a78bfa;
      padding: 12px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.2s ease;
      margin-top: 16px;
      width: 100%;
    `;
    presentBtn.onmouseover = () => {
      presentBtn.style.background = 'linear-gradient(135deg, #7c3aed, #6d28d9)';
      presentBtn.style.transform = 'translateY(-2px)';
    };
    presentBtn.onmouseout = () => {
      presentBtn.style.background = 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
      presentBtn.style.transform = 'translateY(0)';
    };
    presentBtn.onclick = start;

    menuBox.appendChild(presentBtn);
  }

  /**
   * Inicializar módulo
   */
  function init() {
    setTimeout(addPresentationButton, 500);
    console.log('🎬 Módulo de presentación listo');
  }

  return {
    init,
    start,
    exit,
    next,
    previous,
    first,
    last
  };
})();

// Auto-inicializar
document.addEventListener('DOMContentLoaded', () => {
  PresentationMode.init();
});

window.PresentationMode = PresentationMode;
