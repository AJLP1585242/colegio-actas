/**
 * ============================================
 * CONFIGURACIÓN DEL SISTEMA
 * ============================================
 * Archivo de configuración centralizado
 * Modifica estos valores para cambiar el comportamiento del sistema
 */

const CONFIG = {
  // Credenciales de acceso
  // MODIFICAR AQUÍ para cambiar usuario y contraseña
  AUTH: {
    USERNAME: 'admin',
    PASSWORD: '1234',
    SESSION_KEY: 'authenticated'
  },

  // Rutas del sistema
  PATHS: {
    INDEX: '../../../index.html',
    LOGIN_REDIRECT: '../../../index.html'
  },

  // Configuración de PDF (calidad máxima para impresión)
  PDF: {
    PAGE_FORMAT: 'a4',
    ORIENTATION: 'p', // 'p' = portrait, 'l' = landscape
    UNIT: 'mm',
    MARGIN: 10,
    IMAGE_QUALITY: 1.0, // 100% calidad (máximo)
    IMAGE_FORMAT: 'JPEG' // JPEG con q=100 en Cloudinary
    // Las imágenes se cargan con transformación Cloudinary:
    // q_100 (calidad 100%), dpr_3.0 (retina x3), w_3000 (ancho 3000px)
    // Esto garantiza PDFs de calidad profesional para impresión (300 DPI)
  },

  // Configuración de Zoom
  ZOOM: {
    MIN: 0.5,
    MAX: 5,
    STEP: 1.2, // Factor de zoom (1.2 = 20% más/menos)
    DEFAULT: 1
  },

  // Mensajes del sistema
  MESSAGES: {
    LOGIN_ERROR: 'Usuario o clave incorrectos',
    SESSION_EXPIRED: 'Sesión no válida, redirigiendo al login...',
    SELECT_REQUIRED: 'Por favor selecciona al menos año y grado.',
    NO_ACTA_FOUND: 'No se encontró el acta seleccionada.'
  },

  // Selectores CSS
  SELECTORS: {
    YEAR_PAGE_PATTERN: /\/\d{4}\/\d{4}\.html$/,
    RECOVERY_PAGE_PATTERN: /\/\d{4}_rp\/\d{4}rp\.html$/,
    ACTA_CARDS: '.card, .acta-card',
    ACTA_IMAGES: '.card img, .acta-card img'
  }
};

// Hacer CONFIG accesible globalmente
window.APP_CONFIG = CONFIG;
