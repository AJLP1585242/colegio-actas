// =================================
// IMAGE ENHANCER - Mejora de nitidez con IA y filtros avanzados
// =================================

/**
 * Módulo para mejorar la nitidez y legibilidad de texto en imágenes
 * Implementa algoritmos de sharpening, unsharp mask y mejora de contraste
 */
const ImageEnhancer = (function() {
  'use strict';

  /**
   * Aplica Unsharp Mask (técnica profesional de sharpening)
   * Simula técnica de fotografía profesional
   * @param {ImageData} imageData - Datos de la imagen
   * @param {number} amount - Intensidad (1.0 - 3.0, default: 2.0)
   * @param {number} radius - Radio del blur (1-5, default: 2)
   * @param {number} threshold - Umbral para evitar ruido (0-255, default: 0)
   * @returns {ImageData} Imagen procesada
   */
  function unsharpMask(imageData, amount = 2.0, radius = 2, threshold = 0) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    
    // Crear copia para el blur
    const blurred = gaussianBlur(imageData, radius);
    
    // Aplicar unsharp mask: original + amount * (original - blurred)
    for (let i = 0; i < data.length; i += 4) {
      for (let j = 0; j < 3; j++) { // RGB (sin alpha)
        const original = data[i + j];
        const blur = blurred.data[i + j];
        const diff = original - blur;
        
        if (Math.abs(diff) > threshold) {
          data[i + j] = clamp(original + amount * diff, 0, 255);
        }
      }
    }
    
    return imageData;
  }

  /**
   * Gaussian Blur para unsharp mask
   */
  function gaussianBlur(imageData, radius) {
    const width = imageData.width;
    const height = imageData.height;
    const data = new Uint8ClampedArray(imageData.data);
    const result = new ImageData(width, height);
    
    // Kernel gaussiano simplificado
    const kernel = generateGaussianKernel(radius);
    const kernelSize = kernel.length;
    const halfKernel = Math.floor(kernelSize / 2);
    
    // Aplicar convolución
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, weightSum = 0;
        
        for (let ky = 0; ky < kernelSize; ky++) {
          for (let kx = 0; kx < kernelSize; kx++) {
            const py = y + ky - halfKernel;
            const px = x + kx - halfKernel;
            
            if (py >= 0 && py < height && px >= 0 && px < width) {
              const idx = (py * width + px) * 4;
              const weight = kernel[ky][kx];
              
              r += data[idx] * weight;
              g += data[idx + 1] * weight;
              b += data[idx + 2] * weight;
              weightSum += weight;
            }
          }
        }
        
        const idx = (y * width + x) * 4;
        result.data[idx] = r / weightSum;
        result.data[idx + 1] = g / weightSum;
        result.data[idx + 2] = b / weightSum;
        result.data[idx + 3] = 255;
      }
    }
    
    return result;
  }

  /**
   * Genera kernel gaussiano
   */
  function generateGaussianKernel(radius) {
    const size = radius * 2 + 1;
    const kernel = [];
    const sigma = radius / 2;
    const sigma22 = 2 * sigma * sigma;
    const sigmaPi2 = Math.PI * sigma22;
    let sum = 0;
    
    for (let y = -radius; y <= radius; y++) {
      const row = [];
      for (let x = -radius; x <= radius; x++) {
        const value = Math.exp(-(x * x + y * y) / sigma22) / sigmaPi2;
        row.push(value);
        sum += value;
      }
      kernel.push(row);
    }
    
    // Normalizar
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        kernel[y][x] /= sum;
      }
    }
    
    return kernel;
  }

  /**
   * Mejora de contraste adaptativo (CLAHE simplificado)
   * Contrast Limited Adaptive Histogram Equalization
   */
  function adaptiveContrast(imageData, clipLimit = 2.0) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    
    // Convertir a escala de grises para análisis
    const gray = new Uint8Array(width * height);
    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      gray[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }
    
    // Calcular histograma
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < gray.length; i++) {
      histogram[Math.floor(gray[i])]++;
    }
    
    // Ecualización con clip limit
    const clipHistogram = clipLimit * (gray.length / 256);
    let excess = 0;
    
    for (let i = 0; i < 256; i++) {
      if (histogram[i] > clipHistogram) {
        excess += histogram[i] - clipHistogram;
        histogram[i] = clipHistogram;
      }
    }
    
    // Redistribuir exceso
    const redistribution = excess / 256;
    for (let i = 0; i < 256; i++) {
      histogram[i] += redistribution;
    }
    
    // Calcular CDF (función de distribución acumulativa)
    const cdf = new Array(256);
    cdf[0] = histogram[0];
    for (let i = 1; i < 256; i++) {
      cdf[i] = cdf[i - 1] + histogram[i];
    }
    
    // Normalizar CDF
    const cdfMin = cdf.find(val => val > 0);
    const cdfMax = cdf[255];
    const cdfRange = cdfMax - cdfMin;
    
    // Crear tabla de mapeo
    const mapping = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      mapping[i] = Math.round(((cdf[i] - cdfMin) / cdfRange) * 255);
    }
    
    // Aplicar mapeo a todos los canales
    for (let i = 0; i < data.length; i += 4) {
      data[i] = mapping[data[i]];         // R
      data[i + 1] = mapping[data[i + 1]]; // G
      data[i + 2] = mapping[data[i + 2]]; // B
    }
    
    return imageData;
  }

  /**
   * Sharpening con kernel convolucional
   * Kernel de nitidez clásico
   */
  function sharpenKernel(imageData, strength = 1.0) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const result = new Uint8ClampedArray(data);
    
    // Kernel de sharpening (-1 en bordes, 9 en centro)
    const kernel = [
      [0, -1, 0],
      [-1, 5 + strength * 4, -1],
      [0, -1, 0]
    ];
    
    // Aplicar convolución
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) { // RGB
          let sum = 0;
          
          for (let ky = 0; ky < 3; ky++) {
            for (let kx = 0; kx < 3; kx++) {
              const py = y + ky - 1;
              const px = x + kx - 1;
              const idx = (py * width + px) * 4 + c;
              sum += data[idx] * kernel[ky][kx];
            }
          }
          
          const idx = (y * width + x) * 4 + c;
          result[idx] = clamp(sum, 0, 255);
        }
      }
    }
    
    // Copiar resultado
    for (let i = 0; i < data.length; i++) {
      data[i] = result[i];
    }
    
    return imageData;
  }

  /**
   * Reducción de ruido bilateral (preserva bordes)
   */
  function bilateralFilter(imageData, spatialSigma = 3, intensitySigma = 50) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const result = new Uint8ClampedArray(data);
    
    const windowSize = Math.ceil(spatialSigma * 3);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let rSum = 0, gSum = 0, bSum = 0, weightSum = 0;
        const idx = (y * width + x) * 4;
        const centerR = data[idx];
        const centerG = data[idx + 1];
        const centerB = data[idx + 2];
        
        for (let ky = -windowSize; ky <= windowSize; ky++) {
          for (let kx = -windowSize; kx <= windowSize; kx++) {
            const py = y + ky;
            const px = x + kx;
            
            if (py >= 0 && py < height && px >= 0 && px < width) {
              const pidx = (py * width + px) * 4;
              
              // Peso espacial (gaussiano)
              const spatialDist = kx * kx + ky * ky;
              const spatialWeight = Math.exp(-spatialDist / (2 * spatialSigma * spatialSigma));
              
              // Peso de intensidad (diferencia de color)
              const dr = data[pidx] - centerR;
              const dg = data[pidx + 1] - centerG;
              const db = data[pidx + 2] - centerB;
              const intensityDist = dr * dr + dg * dg + db * db;
              const intensityWeight = Math.exp(-intensityDist / (2 * intensitySigma * intensitySigma));
              
              const weight = spatialWeight * intensityWeight;
              
              rSum += data[pidx] * weight;
              gSum += data[pidx + 1] * weight;
              bSum += data[pidx + 2] * weight;
              weightSum += weight;
            }
          }
        }
        
        result[idx] = rSum / weightSum;
        result[idx + 1] = gSum / weightSum;
        result[idx + 2] = bSum / weightSum;
      }
    }
    
    for (let i = 0; i < data.length; i++) {
      data[i] = result[i];
    }
    
    return imageData;
  }

  /**
   * Pipeline completo de mejora de legibilidad
   * Combina múltiples técnicas para texto borroso
   */
  function enhanceTextLegibility(img, options = {}) {
    const {
      denoiseStrength = 0.5,      // 0-1: reducción de ruido
      contrastBoost = 1.8,         // 1.0-3.0: contraste adaptativo
      sharpenAmount = 2.5,         // 1.0-5.0: nitidez
      unsharpRadius = 2,           // 1-5: radio unsharp mask
      brightness = 1.05,           // 0.5-1.5: ajuste de brillo
      gamma = 1.1                  // 0.5-2.0: corrección gamma
    } = options;
    
    // Crear canvas temporal
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext('2d', {
      willReadFrequently: true
    });
    
    // Dibujar imagen original
    ctx.drawImage(img, 0, 0);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // PASO 1: Reducción de ruido (leve, para no perder detalle)
    if (denoiseStrength > 0) {
      imageData = bilateralFilter(imageData, 2, 30 * denoiseStrength);
    }
    
    // PASO 2: Ajuste de brillo y gamma
    applyBrightnessGamma(imageData, brightness, gamma);
    
    // PASO 3: Contraste adaptativo (CLAHE)
    imageData = adaptiveContrast(imageData, contrastBoost);
    
    // PASO 4: Unsharp mask (nitidez profesional)
    imageData = unsharpMask(imageData, sharpenAmount, unsharpRadius, 5);
    
    // PASO 5: Sharpening adicional leve
    imageData = sharpenKernel(imageData, 0.3);
    
    // Escribir resultado
    ctx.putImageData(imageData, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.98);
  }

  /**
   * Aplica ajustes de brillo y gamma
   */
  function applyBrightnessGamma(imageData, brightness, gamma) {
    const data = imageData.data;
    const gammaCorrection = 1 / gamma;
    
    for (let i = 0; i < data.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        // Normalizar a 0-1
        let normalized = data[i + j] / 255;
        
        // Aplicar gamma
        normalized = Math.pow(normalized, gammaCorrection);
        
        // Aplicar brillo
        normalized *= brightness;
        
        // Volver a 0-255
        data[i + j] = clamp(normalized * 255, 0, 255);
      }
    }
  }

  /**
   * Función auxiliar: clamp
   */
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Aplicar mejora automática a todas las imágenes de actas
   */
  function enhanceAllImages(intensity = 'medium') {
    const presets = {
      light: {
        denoiseStrength: 0.3,
        contrastBoost: 1.5,
        sharpenAmount: 1.8,
        unsharpRadius: 1,
        brightness: 1.03,
        gamma: 1.05
      },
      medium: {
        denoiseStrength: 0.5,
        contrastBoost: 1.8,
        sharpenAmount: 2.5,
        unsharpRadius: 2,
        brightness: 1.05,
        gamma: 1.1
      },
      strong: {
        denoiseStrength: 0.7,
        contrastBoost: 2.2,
        sharpenAmount: 3.5,
        unsharpRadius: 2,
        brightness: 1.08,
        gamma: 1.15
      }
    };
    
    const options = presets[intensity] || presets.medium;
    const images = document.querySelectorAll('.acta-card img, .card img');
    let processed = 0;
    
    images.forEach((img, index) => {
      // Esperar a que cargue
      if (img.complete) {
        processImage(img, options);
      } else {
        img.addEventListener('load', function() {
          processImage(this, options);
        }, { once: true });
      }
    });
    
    function processImage(img, options) {
      // Guardar URL original
      if (!img.dataset.originalSrc) {
        img.dataset.originalSrc = img.src;
      }
      
      // Aplicar mejora
      const enhanced = enhanceTextLegibility(img, options);
      img.src = enhanced;
      
      processed++;
      console.log(`✓ Imagen ${processed} mejorada con IA`);
    }
    
    console.log(`🤖 Procesando ${images.length} imágenes con IA (intensidad: ${intensity})...`);
  }

  /**
   * Restaurar imágenes originales
   */
  function restoreOriginalImages() {
    const images = document.querySelectorAll('img[data-original-src]');
    images.forEach(img => {
      img.src = img.dataset.originalSrc;
      delete img.dataset.originalSrc;
    });
    console.log(`↩️ ${images.length} imágenes restauradas`);
  }

  /**
   * Crear interfaz de control
   */
  function createEnhancerUI() {
    const container = document.createElement('div');
    container.id = 'enhancer-ui';
    container.innerHTML = `
      <style>
        #enhancer-ui {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: rgba(15, 32, 39, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(52, 211, 153, 0.3);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          z-index: 9999;
          min-width: 280px;
        }
        #enhancer-ui h4 {
          margin: 0 0 12px 0;
          color: #34d399;
          font-size: 14px;
          font-weight: 600;
        }
        #enhancer-ui button {
          width: 100%;
          padding: 10px;
          margin: 6px 0;
          background: linear-gradient(135deg, #34d399, #10b981);
          border: none;
          border-radius: 6px;
          color: #0f2027;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        #enhancer-ui button:hover {
          background: linear-gradient(135deg, #10b981, #059669);
          transform: translateY(-1px);
        }
        #enhancer-ui button.restore {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }
        #enhancer-ui button.restore:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
        }
        #enhancer-ui .close-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 20px;
          padding: 0;
          width: auto;
          line-height: 1;
        }
      </style>
      <button class="close-btn" onclick="document.getElementById('enhancer-ui').style.display='none'">×</button>
      <h4>🤖 Mejorar Legibilidad IA</h4>
      <button onclick="ImageEnhancer.enhance('light')">✨ Leve</button>
      <button onclick="ImageEnhancer.enhance('medium')">🔥 Medio (Recomendado)</button>
      <button onclick="ImageEnhancer.enhance('strong')">⚡ Intenso</button>
      <button class="restore" onclick="ImageEnhancer.restore()">↩️ Restaurar Original</button>
    `;
    
    document.body.appendChild(container);
  }

  // API pública
  return {
    enhance: enhanceAllImages,
    restore: restoreOriginalImages,
    createUI: createEnhancerUI,
    enhanceImage: enhanceTextLegibility
  };

})();

// Crear UI automáticamente en páginas de actas
document.addEventListener('DOMContentLoaded', () => {
  // Solo crear UI si estamos en una página de actas (no en index)
  if (document.querySelector('.acta-card, .card')) {
    ImageEnhancer.createUI();
    console.log('🤖 IA de mejora de imágenes disponible (botón abajo-derecha)');
  }
});

// Exponer globalmente
window.ImageEnhancer = ImageEnhancer;
