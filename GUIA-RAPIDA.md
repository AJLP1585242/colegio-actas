# 🎯 GUÍA RÁPIDA - Sistema de Actas

## 📋 INFORMACIÓN BÁSICA

**Sistema:** Actas Escolares - Antonia Moreno de Caceres  
**Versión:** 2.0.0  
**Usuario por defecto:** admin  
**Contraseña por defecto:** 1234

---

## 🔧 CONFIGURACIÓN RÁPIDA

### ✏️ Cambiar Contraseña

**Archivo:** `js/config.js`  
**Líneas 8-9:**

```javascript
USERNAME: 'admin',      // ← Cambiar aquí
PASSWORD: '1234',       // ← Cambiar aquí
```

### 📁 Estructura de Archivos

```
colegio/
├── index.html          ← Página principal
├── css/estilos.css     ← Estilos
├── js/                 ← Scripts (ver abajo)
├── 1990/ - 2012/       ← Actas por año
└── 1995_rp/            ← Actas recuperación
```

### 🗂️ Carpeta js/

```
js/
├── config.js           ← ⚙️ CONFIGURACIÓN (cambiar contraseña aquí)
├── auth.js             ← 🔐 Login/Logout
├── navigation.js       ← 🧭 Navegación
├── filter.js           ← 🔍 Filtros
├── zoom.js             ← 🔎 Zoom imágenes
├── pdf.js              ← 📄 Generar PDFs
└── app.js              ← 🚀 Inicializador
```

---

## 🚀 TAREAS COMUNES

### 1. Agregar un Nuevo Año

1. Crear carpeta: `2013/`
2. Crear archivo: `2013/2013.html` (copiar estructura de otro año)
3. Editar `index.html` y agregar en el selector:
   ```html
   <option value="2013/2013.html">2013</option>
   ```

### 2. Modificar Mensajes del Sistema

**Archivo:** `js/config.js`  
**Buscar:** `MESSAGES:`

```javascript
MESSAGES: {
  LOGIN_ERROR: 'Usuario o clave incorrectos',        // ← Modificar
  SESSION_EXPIRED: 'Sesión expirada...',            // ← Modificar
  SELECT_REQUIRED: 'Selecciona año y grado.',       // ← Modificar
  NO_ACTA_FOUND: 'No se encontró el acta.'         // ← Modificar
}
```

### 3. Cambiar Límites de Zoom

**Archivo:** `js/config.js`  
**Buscar:** `ZOOM:`

```javascript
ZOOM: {
  MIN: 0.5,    // Mínimo 50%
  MAX: 5,      // Máximo 500%
  STEP: 1.2,   // Incremento 20%
  DEFAULT: 1   // Inicial 100%
}
```

### 4. Ajustar Calidad de PDF

**Archivo:** `js/config.js`  
**Buscar:** `PDF:`

```javascript
PDF: {
  IMAGE_QUALITY: 1.0,    // 1.0 = 100%, 0.8 = 80%
  MARGIN: 10,            // Márgenes en mm
  IMAGE_FORMAT: 'JPEG'   // JPEG o PNG
}
```

---

## ⚠️ IMPORTANTE - NO MOVER

**Estos archivos deben estar en la raíz:**
- ✅ `index.html` 
- ✅ Carpetas `css/` y `js/`
- ✅ Carpetas de años (`1990/` - `2012/`)

**¿Por qué?**
- Las rutas están configuradas para esta estructura
- Mover archivos romperá los enlaces
- GitHub Pages requiere `index.html` en la raíz

---

## 🐛 SOLUCIÓN DE PROBLEMAS

| Problema | Solución |
|----------|----------|
| No carga la página | Verificar archivos en carpeta `js/` |
| Login no funciona | Revisar contraseña en `js/config.js` |
| Zoom no funciona | Actualizar página (Ctrl+F5) |
| PDF no genera | Verificar conexión a internet (usa CDN) |
| Actas no se ven | Verificar URLs de imágenes en archivos HTML |

---

## 📞 ACCESO RÁPIDO

**Login:**
- Usuario: `admin`
- Contraseña: `1234`

**Archivos principales:**
- Configuración: `js/config.js`
- Estilos: `css/estilos.css`
- Menú principal: `index.html`

**Documentación completa:** `DOCUMENTACION.md`

---

## ✅ VENTAJAS DE ESTA ESTRUCTURA

✔️ **Simple:** Todo en un solo nivel  
✔️ **Ordenado:** Archivos por tipo (js/, css/)  
✔️ **Mantenible:** Fácil encontrar cualquier archivo  
✔️ **Compatible:** Funciona con GitHub Pages  
✔️ **Escalable:** Fácil agregar nuevos años  

---

**Última actualización:** 12/11/2025
