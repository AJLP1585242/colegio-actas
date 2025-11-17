/**
 * ============================================
 * MÓDULO DE GENERACIÓN DE PDF
 * ============================================
 * Genera archivos PDF a partir de las imágenes de las actas
 */

const PDFModule = (function() {
  'use strict';

  const config = window.APP_CONFIG.PDF;

  /**
   * Genera un PDF con las imágenes de un acta
   * @param {string} anio - Año del acta
   * @param {string} grado - Grado del acta
   * @param {string} seccion - Sección del acta
   * @param {string} url1 - URL de la primera imagen
   * @param {string} url2 - URL de la segunda imagen (opcional)
   */
  function generatePDF(anio, grado, seccion, url1, url2) {
    const { jsPDF } = window.jspdf;
    
    if (!jsPDF) {
      alert('Error: Librería jsPDF no cargada');
      return;
    }

    const pdf = new jsPDF(config.ORIENTATION, config.UNIT, config.PAGE_FORMAT);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Título del PDF
    pdf.setFontSize(14);
    pdf.text(`${anio} - Grado ${grado} - Sección ${seccion}`, 15, 15);

    loadAndAddImage(pdf, url1, pageWidth, pageHeight, 0, (pdf, firstImageHeight) => {
      if (url2) {
        // Si hay segunda imagen, agregarla
        loadAndAddImage(pdf, url2, pageWidth, pageHeight, firstImageHeight, (pdf) => {
          savePDF(pdf, anio, grado, seccion);
        });
      } else {
        // Solo una imagen
        savePDF(pdf, anio, grado, seccion);
      }
    });
  }

  /**
   * Optimiza URL de Cloudinary para máxima calidad en PDF
   * @param {string} url - URL original de Cloudinary
   * @returns {string} URL optimizada para impresión
   */
  function optimizarURLParaPDF(url) {
    if (!url.includes('cloudinary')) {
      return url;
    }
    
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) {
      return url;
    }
    
    // Parámetros para máxima calidad en PDF (impresión 300 DPI)
    const transformaciones = 'q_100,f_jpg,dpr_3.0,w_3000,c_limit,fl_progressive:steep';
    
    return url.slice(0, uploadIndex + 8) + transformaciones + '/' + url.slice(uploadIndex + 8);
  }

  /**
   * Carga y agrega una imagen al PDF con máxima calidad
   * @param {jsPDF} pdf - Instancia de jsPDF
   * @param {string} url - URL de la imagen
   * @param {number} pageWidth - Ancho de la página
   * @param {number} pageHeight - Alto de la página
   * @param {number} previousHeight - Alto de imágenes previas
   * @param {Function} callback - Función a ejecutar cuando termine
   */
  function loadAndAddImage(pdf, url, pageWidth, pageHeight, previousHeight, callback) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    // Intentar usar la imagen mejorada si existe
    const imgElement = document.querySelector(`img[data-original-src*="${url}"]`) || 
                       document.querySelector(`img[src="${url}"]`);
    
    if (imgElement && imgElement.dataset.originalSrc) {
      // Usar la versión mejorada con IA
      console.log('📄 Usando imagen mejorada con IA para PDF');
      img.src = imgElement.src; // Ya está procesada
    } else {
      // Usar URL optimizada para PDF de alta calidad
      const urlOptimizada = optimizarURLParaPDF(url);
      img.src = urlOptimizada;
    }
    
    img.onload = function() {
      const imgWidth = pageWidth - (config.MARGIN * 2);
      const ratio = img.width / img.height;
      let imgHeight = imgWidth / ratio;

      // Ajustar si excede el espacio disponible
      const availableSpace = pageHeight - 25 - config.MARGIN - previousHeight;
      if (imgHeight > availableSpace) {
        const factor = availableSpace / imgHeight;
        imgHeight *= factor;
      }

      // Canvas de alta resolución para PDF de calidad
      const canvas = document.createElement('canvas');
      // Usar resolución nativa completa (300 DPI equivalente)
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      const ctx = canvas.getContext('2d', {
        alpha: false,
        desynchronized: false,
        willReadFrequently: false
      });
      
      // Configuración para máxima calidad de renderizado
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Aplicar ligero sharpening para mejor legibilidad en PDF
      ctx.filter = 'contrast(1.05) brightness(1.01)';
      
      // Dibujar imagen en canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convertir a base64 con máxima calidad (1.0 = 100%)
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Posición Y: después del título y de imágenes previas
      const yPosition = 25 + previousHeight + (previousHeight > 0 ? config.MARGIN : 0);
      pdf.addImage(imgData, 'JPEG', config.MARGIN, yPosition, imgWidth, imgHeight);
      
      if (callback) callback(pdf, imgHeight);
    };

    img.onerror = function() {
      console.error('Error cargando imagen:', url);
      alert('Error al cargar la imagen. Verifica la conexión.');
    };
  }

  /**
   * Guarda el PDF generado
   * @param {jsPDF} pdf - Instancia de jsPDF
   * @param {string} anio - Año del acta
   * @param {string} grado - Grado del acta
   * @param {string} seccion - Sección del acta
   */
  function savePDF(pdf, anio, grado, seccion) {
    const filename = `acta_${anio}_${grado}${seccion}.pdf`;
    pdf.save(filename);
  }

  // API pública del módulo
  return {
    generatePDF
  };

})();

// Exponer función global para compatibilidad con HTML onclick
window.generarPDF = PDFModule.generatePDF;
