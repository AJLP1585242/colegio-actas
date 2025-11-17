// =================================
// ACCESSIBILITY - Accesibilidad y atajos de teclado
// =================================

const Accessibility = (function() {
  'use strict';

  let highContrastMode = false;
  let shortcuts = {
    'Alt+N': nextActa,
    'Alt+P': previousActa,
    'Alt+Z': toggleZoom,
    'Alt+D': downloadPDF,
    'Alt+H': showHelp,
    'Alt+C': toggleHighContrast,
    'Escape': exitFullscreen
  };

  /**
   * Navegar a siguiente acta
   */
  function nextActa() {
    const cards = document.querySelectorAll('.acta-card');
    if (cards.length === 0) return;

    const currentScroll = window.scrollY;
    let targetCard = null;

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.top > 100 && !targetCard) {
        targetCard = card;
      }
    });

    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      announceToScreenReader('Navegando a siguiente acta');
    }
  }

  /**
   * Navegar a acta anterior
   */
  function previousActa() {
    const cards = Array.from(document.querySelectorAll('.acta-card'));
    if (cards.length === 0) return;

    const currentScroll = window.scrollY;
    let targetCard = null;

    for (let i = cards.length - 1; i >= 0; i--) {
      const rect = cards[i].getBoundingClientRect();
      if (rect.top < -100) {
        targetCard = cards[i];
        break;
      }
    }

    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      announceToScreenReader('Navegando a acta anterior');
    }
  }

  /**
   * Toggle zoom en imagen actual
   */
  function toggleZoom() {
    const images = document.querySelectorAll('.acta-card img');
    if (images.length === 0) return;

    // Buscar imagen visible
    let targetImg = null;
    images.forEach(img => {
      const rect = img.getBoundingClientRect();
      if (rect.top > 0 && rect.top < window.innerHeight && !targetImg) {
        targetImg = img;
      }
    });

    if (targetImg) {
      const zoomBtn = targetImg.closest('.zoom-container')?.querySelector('.zoom-in');
      if (zoomBtn) {
        zoomBtn.click();
        announceToScreenReader('Zoom aplicado');
      }
    }
  }

  /**
   * Descargar PDF de acta actual
   */
  function downloadPDF() {
    const cards = document.querySelectorAll('.acta-card');
    if (cards.length === 0) return;

    // Buscar card visible
    let targetCard = null;
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.top > 0 && rect.top < window.innerHeight / 2 && !targetCard) {
        targetCard = card;
      }
    });

    if (targetCard) {
      const pdfBtn = targetCard.querySelector('button[onclick*="generarPDF"]');
      if (pdfBtn) {
        pdfBtn.click();
        announceToScreenReader('Generando PDF');
      }
    }
  }

  /**
   * Toggle modo alto contraste
   */
  function toggleHighContrast() {
    highContrastMode = !highContrastMode;
    document.body.classList.toggle('high-contrast', highContrastMode);
    localStorage.setItem('highContrast', highContrastMode);
    announceToScreenReader(highContrastMode ? 'Modo alto contraste activado' : 'Modo alto contraste desactivado');
  }

  /**
   * Salir de pantalla completa
   */
  function exitFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      announceToScreenReader('Saliendo de pantalla completa');
    }
  }

  /**
   * Mostrar ayuda de atajos
   */
  function showHelp() {
    const helpModal = document.getElementById('shortcuts-help');
    if (helpModal) {
      helpModal.style.display = 'block';
    } else {
      createHelpModal();
    }
    announceToScreenReader('Mostrando ayuda de atajos de teclado');
  }

  /**
   * Crear modal de ayuda
   */
  function createHelpModal() {
    const modal = document.createElement('div');
    modal.id = 'shortcuts-help';
    modal.innerHTML = `
      <style>
        #shortcuts-help {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        #shortcuts-help .modal-content {
          background: rgba(15, 32, 39, 0.98);
          backdrop-filter: blur(20px);
          border: 2px solid #34d399;
          border-radius: 16px;
          padding: 32px;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }
        #shortcuts-help h2 {
          color: #34d399;
          margin: 0 0 24px 0;
          font-size: 24px;
        }
        #shortcuts-help .shortcut-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(52, 211, 153, 0.1);
        }
        #shortcuts-help .shortcut-item:last-child {
          border-bottom: none;
        }
        #shortcuts-help .key {
          background: rgba(52, 211, 153, 0.2);
          color: #34d399;
          padding: 4px 12px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 14px;
        }
        #shortcuts-help .desc {
          color: #9ca3af;
          font-size: 14px;
        }
        #shortcuts-help .close-btn {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          margin-top: 24px;
          width: 100%;
        }
        #shortcuts-help .close-btn:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
        }
      </style>
      <div class="modal-content" role="dialog" aria-label="Ayuda de atajos de teclado">
        <h2>⌨️ Atajos de Teclado</h2>
        <div class="shortcut-item">
          <span class="key">Alt + N</span>
          <span class="desc">Siguiente acta</span>
        </div>
        <div class="shortcut-item">
          <span class="key">Alt + P</span>
          <span class="desc">Acta anterior</span>
        </div>
        <div class="shortcut-item">
          <span class="key">Alt + Z</span>
          <span class="desc">Aplicar zoom</span>
        </div>
        <div class="shortcut-item">
          <span class="key">Alt + D</span>
          <span class="desc">Descargar PDF</span>
        </div>
        <div class="shortcut-item">
          <span class="key">Alt + C</span>
          <span class="desc">Alto contraste</span>
        </div>
        <div class="shortcut-item">
          <span class="key">Alt + H</span>
          <span class="desc">Ayuda (esta ventana)</span>
        </div>
        <div class="shortcut-item">
          <span class="key">Esc</span>
          <span class="desc">Salir pantalla completa</span>
        </div>
        <button class="close-btn" onclick="document.getElementById('shortcuts-help').remove()">
          Cerrar (Esc)
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    // Cerrar con Esc
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  /**
   * Anunciar a lectores de pantalla
   */
  function announceToScreenReader(message) {
    let announcer = document.getElementById('sr-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'sr-announcer';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.position = 'absolute';
      announcer.style.left = '-10000px';
      announcer.style.width = '1px';
      announcer.style.height = '1px';
      announcer.style.overflow = 'hidden';
      document.body.appendChild(announcer);
    }
    announcer.textContent = message;
  }

  /**
   * Registrar atajos de teclado
   */
  function registerShortcuts() {
    document.addEventListener('keydown', (e) => {
      const key = [];
      if (e.altKey) key.push('Alt');
      if (e.ctrlKey) key.push('Ctrl');
      if (e.shiftKey) key.push('Shift');
      key.push(e.key.toUpperCase());

      const combo = key.join('+');

      // Buscar shortcut
      Object.keys(shortcuts).forEach(shortcut => {
        if (shortcut === combo || shortcut === e.key) {
          e.preventDefault();
          shortcuts[shortcut]();
        }
      });
    });
  }

  /**
   * Aplicar estilos de alto contraste
   */
  function applyHighContrastStyles() {
    if (!document.getElementById('high-contrast-styles')) {
      const style = document.createElement('style');
      style.id = 'high-contrast-styles';
      style.textContent = `
        body.high-contrast {
          filter: contrast(1.5) brightness(1.2);
        }
        body.high-contrast img {
          filter: contrast(1.8) brightness(1.3) !important;
        }
        body.high-contrast .acta-card {
          border: 3px solid #34d399 !important;
          background: #000 !important;
        }
        body.high-contrast button {
          border: 2px solid #34d399 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Mejorar accesibilidad de elementos existentes
   */
  function enhanceAccessibility() {
    // Agregar atributos ARIA
    const cards = document.querySelectorAll('.acta-card');
    cards.forEach((card, index) => {
      card.setAttribute('role', 'article');
      card.setAttribute('aria-label', `Acta ${index + 1}`);
      
      const images = card.querySelectorAll('img');
      images.forEach(img => {
        if (!img.alt || img.alt === '') {
          img.alt = 'Imagen de acta escolar';
        }
      });

      const buttons = card.querySelectorAll('button');
      buttons.forEach(btn => {
        if (!btn.getAttribute('aria-label')) {
          btn.setAttribute('aria-label', btn.textContent.trim());
        }
      });
    });

    // Hacer zoom buttons más accesibles
    const zoomButtons = document.querySelectorAll('.zoom-btn');
    zoomButtons.forEach(btn => {
      btn.setAttribute('tabindex', '0');
      btn.setAttribute('role', 'button');
    });
  }

  /**
   * Inicializar módulo
   */
  function init() {
    registerShortcuts();
    applyHighContrastStyles();

    // Cargar preferencia de alto contraste
    const savedContrast = localStorage.getItem('highContrast');
    if (savedContrast === 'true') {
      toggleHighContrast();
    }

    // Mejorar accesibilidad de página
    setTimeout(enhanceAccessibility, 500);

    console.log('♿ Módulo de accesibilidad activado');
    console.log('💡 Presiona Alt+H para ver atajos de teclado');
  }

  return {
    init,
    showHelp,
    toggleHighContrast
  };
})();

// Auto-inicializar
document.addEventListener('DOMContentLoaded', () => {
  Accessibility.init();
});

window.Accessibility = Accessibility;
