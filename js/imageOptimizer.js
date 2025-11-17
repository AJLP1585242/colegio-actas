// =================================
// IMAGE OPTIMIZER - Mejora automática de calidad de imágenes
// =================================

/**
 * Optimiza URLs de Cloudinary para máxima calidad
 * Aplica transformaciones: q_auto:best, f_auto, dpr_2.0
 */
function optimizarImagenesCloudinary() {
  const imagenes = document.querySelectorAll('img[src*="cloudinary"]');
  
  imagenes.forEach(img => {
    const urlOriginal = img.src;
    
    // Si ya tiene transformaciones, no modificar
    if (urlOriginal.includes('/q_auto:best') || urlOriginal.includes('/dpr_')) {
      return;
    }
    
    // Detectar el punto de inserción de transformaciones
    const uploadIndex = urlOriginal.indexOf('/upload/');
    
    if (uploadIndex !== -1) {
      // Insertar parámetros de calidad
      const transformaciones = 'q_auto:best,f_auto,dpr_2.0,w_2000,c_limit';
      const urlOptimizada = 
        urlOriginal.slice(0, uploadIndex + 8) + // /upload/
        transformaciones + '/' +
        urlOriginal.slice(uploadIndex + 8);
      
      // Actualizar src con imagen optimizada
      img.src = urlOptimizada;
      
      // Log para debug (opcional)
      console.log('✓ Imagen optimizada:', img.alt || 'Sin alt');
    }
  });
  
  console.log(`✓ ${imagenes.length} imágenes optimizadas para alta calidad`);
}

/**
 * Aplicar nitidez adicional con Canvas (opcional)
 * Usa para imágenes que necesitan realce extremo
 */
function aplicarNitidezCanvas(img) {
  // Crear canvas temporal
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  
  // Dibujar imagen original
  ctx.drawImage(img, 0, 0);
  
  // Aplicar filtro de nitidez (sharpening)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Kernel de nitidez simple
  const kernel = [
    0, -1,  0,
   -1,  5, -1,
    0, -1,  0
  ];
  
  const weight = 1;
  const side = Math.round(Math.sqrt(kernel.length));
  const halfSide = Math.floor(side / 2);
  
  const src = data.slice();
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const dstOff = (y * canvas.width + x) * 4;
      let r = 0, g = 0, b = 0;
      
      for (let cy = 0; cy < side; cy++) {
        for (let cx = 0; cx < side; cx++) {
          const scy = Math.min(canvas.height - 1, Math.max(0, y + cy - halfSide));
          const scx = Math.min(canvas.width - 1, Math.max(0, x + cx - halfSide));
          const srcOff = (scy * canvas.width + scx) * 4;
          const wt = kernel[cy * side + cx];
          
          r += src[srcOff] * wt;
          g += src[srcOff + 1] * wt;
          b += src[srcOff + 2] * wt;
        }
      }
      
      data[dstOff] = Math.min(255, Math.max(0, r / weight));
      data[dstOff + 1] = Math.min(255, Math.max(0, g / weight));
      data[dstOff + 2] = Math.min(255, Math.max(0, b / weight));
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Reemplazar imagen con versión nitida
  img.src = canvas.toDataURL('image/jpeg', 1.0);
}

/**
 * Lazy loading inteligente para mejorar rendimiento
 */
function implementarLazyLoading() {
  const imagenes = document.querySelectorAll('img[src*="cloudinary"]');
  
  const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01
  };
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Cargar imagen en alta resolución
        if (img.dataset.highres) {
          img.src = img.dataset.highres;
          delete img.dataset.highres;
        }
        
        // Agregar clase de carga completa
        img.classList.add('imagen-cargada');
        
        observer.unobserve(img);
      }
    });
  }, observerOptions);
  
  imagenes.forEach(img => {
    imageObserver.observe(img);
  });
}

/**
 * Mejorar calidad de imágenes al cargar
 */
function mejorarCalidadAlCargar() {
  const imagenes = document.querySelectorAll('img');
  
  imagenes.forEach(img => {
    img.addEventListener('load', function() {
      // Aplicar mejoras CSS adicionales después de carga
      this.style.imageRendering = 'high-quality';
      this.style.filter = 'contrast(1.05) brightness(1.02)';
    }, { once: true });
  });
}

// Ejecutar optimizaciones al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  optimizarImagenesCloudinary();
  mejorarCalidadAlCargar();
  
  console.log('✓ Optimizador de imágenes 4K activado');
});

// Exportar para uso en otros módulos
window.optimizarImagenes = {
  cloudinary: optimizarImagenesCloudinary,
  nitidez: aplicarNitidezCanvas,
  lazyLoad: implementarLazyLoading,
  mejorarCarga: mejorarCalidadAlCargar
};
