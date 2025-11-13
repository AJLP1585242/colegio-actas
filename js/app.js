/**
 * ============================================
 * INICIALIZADOR PRINCIPAL DE LA APLICACIÓN
 * ============================================
 * Coordina la inicialización de todos los módulos
 * Este es el punto de entrada principal del sistema
 */

(function() {
  'use strict';

  /**
   * Inicializa la aplicación cuando el DOM esté listo
   */
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando Sistema de Actas...');
    
    // 1. Verificar autenticación
    const isAuthenticated = AuthModule.checkAuthentication();
    
    // 2. Detectar tipo de página
    const pageType = detectPageType();
    console.log(`Tipo de página: ${pageType}`);
    
    // 3. Inicializar módulos según el tipo de página
    if (pageType === 'year' || pageType === 'recovery') {
      initYearPage();
    } else if (pageType === 'index') {
      initIndexPage();
    }
    
    console.log('Sistema iniciado correctamente');
  });

  /**
   * Detecta el tipo de página actual
   * @returns {string} 'year', 'recovery' o 'index'
   */
  function detectPageType() {
    const path = window.location.pathname.replace(/\\/g, '/');
    const config = window.APP_CONFIG.SELECTORS;
    
    if (config.YEAR_PAGE_PATTERN.test(path)) return 'year';
    if (config.RECOVERY_PAGE_PATTERN.test(path)) return 'recovery';
    return 'index';
  }

  /**
   * Inicializa módulos para páginas de años
   */
  function initYearPage() {
    console.log('Inicializando página de año...');
    
    // Agregar botones de navegación
    NavigationModule.addYearPageButtons();
    
    // Inicializar sistema de zoom
    ZoomModule.initZoom();
    
    // Inicializar filtrado de actas
    FilterModule.initFilter();
  }

  /**
   * Inicializa módulos para la página index
   */
  function initIndexPage() {
    console.log('Inicializando página index...');
    // La autenticación ya fue verificada en AuthModule.checkAuthentication()
  }

  /**
   * Manejo global de errores
   */
  window.addEventListener('error', function(event) {
    console.error('Error en la aplicación:', event.error);
  });

  /**
   * Información de la aplicación (útil para debugging)
   */
  window.APP_INFO = {
    version: '2.0.0',
    name: 'Sistema de Actas - Antonia Moreno de Caceres',
    modules: [
      'Config',
      'Auth',
      'Navigation', 
      'Filter',
      'Zoom',
      'PDF'
    ],
    debug: function() {
      console.table({
        'Autenticado': AuthModule.isAuthenticated(),
        'Tipo de página': detectPageType(),
        'URL actual': window.location.href
      });
    }
  };

  console.log(`${window.APP_INFO.name} v${window.APP_INFO.version}`);

})();
