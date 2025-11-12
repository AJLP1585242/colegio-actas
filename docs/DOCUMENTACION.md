# 📚 Sistema de Actas - Documentación Técnica

## 🏗️ Arquitectura del Sistema

El sistema está organizado en módulos independientes para facilitar el mantenimiento y escalabilidad.

### Estructura de Archivos

```
colegio/
├── index.html              # Página principal
├── css/
│   └── estilos.css        # Estilos globales
├── js/
│   ├── config.js          # ⚙️ Configuración centralizada
│   ├── auth.js            # 🔐 Autenticación y sesiones
│   ├── navigation.js      # 🧭 Navegación entre niveles
│   ├── filter.js          # 🔍 Filtrado de actas
│   ├── zoom.js            # 🔎 Sistema de zoom de imágenes
│   ├── pdf.js             # 📄 Generación de PDFs
│   ├── app.js             # 🚀 Inicializador principal
│   └── funciones.js       # [DEPRECADO] Mantener para compatibilidad
├── 1990/ ... 2012/        # Carpetas de años
└── 1995_rp/               # Carpetas de recuperación
```

---

## 📦 Módulos del Sistema

### 1. **config.js** - Configuración Centralizada

**Propósito:** Mantener todas las configuraciones en un solo lugar.

**Qué modificar aquí:**
- Credenciales de acceso (`AUTH.USERNAME`, `AUTH.PASSWORD`)
- Rutas del sistema
- Configuración de PDF (márgenes, calidad, formato)
- Límites de zoom
- Mensajes del sistema

**Ejemplo de uso:**
```javascript
// Cambiar credenciales
CONFIG.AUTH.USERNAME = 'nuevo_usuario';
CONFIG.AUTH.PASSWORD = 'nueva_contraseña';

// Cambiar calidad de PDF
CONFIG.PDF.IMAGE_QUALITY = 0.8; // 80% de calidad
```

---

### 2. **auth.js** - Módulo de Autenticación

**Propósito:** Manejar login, logout y verificación de sesión.

**Funciones principales:**
- `AuthModule.login()` - Realiza el login
- `AuthModule.logout()` - Cierra sesión
- `AuthModule.isAuthenticated()` - Verifica si hay sesión activa
- `AuthModule.checkAuthentication()` - Verifica al cargar página

**Cuándo modificar:**
- Cambiar lógica de autenticación
- Agregar validaciones adicionales
- Modificar comportamiento de sesión

---

### 3. **navigation.js** - Módulo de Navegación

**Propósito:** Controlar la navegación entre los 3 niveles del sistema.

**Niveles:**
1. **Login** - Autenticación
2. **Selector de Tipo** - Actas Normales o Recuperación  
3. **Selector de Actas** - Año/Grado/Sección

**Funciones principales:**
- `NavigationModule.showTypeSelector()` - Muestra selector de tipo
- `NavigationModule.showMenu(tipo)` - Muestra selector de actas
- `NavigationModule.backToTypeSelector()` - Vuelve al nivel 2
- `NavigationModule.goToActa()` - Navega a una acta específica

**Cuándo modificar:**
- Cambiar flujo de navegación
- Agregar nuevos niveles
- Modificar botones de navegación

---

### 4. **filter.js** - Módulo de Filtrado

**Propósito:** Filtrar actas por grado y sección en páginas de años.

**Funciones principales:**
- `FilterModule.initFilter()` - Inicializa el filtrado
- `filterActas(grado, seccion)` - Filtra las actas visibles

**Cuándo modificar:**
- Cambiar criterios de filtrado
- Agregar nuevos filtros
- Modificar mensaje de "no encontrado"

---

### 5. **zoom.js** - Módulo de Zoom

**Propósito:** Sistema de zoom y navegación para imágenes de actas.

**Características:**
- Zoom con botones +/-
- Zoom con rueda del mouse
- Arrastrar imagen con zoom activo
- Reset a tamaño original
- Indicador de nivel de zoom

**Funciones principales:**
- `ZoomModule.initZoom()` - Inicializa sistema de zoom
- `wrapImageWithZoom(img)` - Envuelve imagen con controles

**Cuándo modificar:**
- Cambiar límites de zoom (modificar `CONFIG.ZOOM`)
- Modificar controles visuales
- Agregar nuevas funcionalidades de zoom

---

### 6. **pdf.js** - Módulo de PDF

**Propósito:** Generar PDFs a partir de imágenes de actas.

**Funciones principales:**
- `PDFModule.generatePDF(anio, grado, seccion, url1, url2)` - Genera PDF

**Cuándo modificar:**
- Cambiar formato de PDF
- Modificar diseño del documento
- Agregar marcas de agua o metadatos

---

### 7. **app.js** - Inicializador Principal

**Propósito:** Coordinar la inicialización de todos los módulos.

**Funciones principales:**
- `detectPageType()` - Detecta tipo de página actual
- `initYearPage()` - Inicializa módulos para páginas de años
- `initIndexPage()` - Inicializa módulos para index

**Cuándo modificar:**
- Cambiar orden de inicialización
- Agregar nuevos módulos
- Modificar lógica de inicio

---

## 🔧 Guía de Modificación Común

### Cambiar Credenciales de Acceso

**Archivo:** `js/config.js`

```javascript
const CONFIG = {
  AUTH: {
    USERNAME: 'tu_usuario',  // ← Cambiar aquí
    PASSWORD: 'tu_clave',    // ← Cambiar aquí
    SESSION_KEY: 'authenticated'
  },
  // ...
};
```

---

### Agregar Nuevo Año

1. Crear carpeta: `YYYY/`
2. Crear archivo: `YYYY/YYYY.html`
3. Agregar al selector en `index.html`:
```html
<option value="YYYY/YYYY.html">YYYY</option>
```

---

### Modificar Límites de Zoom

**Archivo:** `js/config.js`

```javascript
ZOOM: {
  MIN: 0.5,    // ← Zoom mínimo (50%)
  MAX: 5,      // ← Zoom máximo (500%)
  STEP: 1.2,   // ← Paso de zoom (20%)
  DEFAULT: 1   // ← Zoom inicial (100%)
}
```

---

### Cambiar Calidad de PDF

**Archivo:** `js/config.js`

```javascript
PDF: {
  PAGE_FORMAT: 'a4',        // 'a4', 'letter', etc.
  ORIENTATION: 'p',         // 'p' = vertical, 'l' = horizontal
  UNIT: 'mm',
  MARGIN: 10,               // ← Márgenes en mm
  IMAGE_QUALITY: 1.0,       // ← 1.0 = 100%, 0.8 = 80%
  IMAGE_FORMAT: 'JPEG'      // 'JPEG' o 'PNG'
}
```

---

### Modificar Mensajes del Sistema

**Archivo:** `js/config.js`

```javascript
MESSAGES: {
  LOGIN_ERROR: 'Usuario o clave incorrectos',
  SESSION_EXPIRED: 'Sesión no válida, redirigiendo al login...',
  SELECT_REQUIRED: 'Por favor selecciona al menos año y grado.',
  NO_ACTA_FOUND: 'No se encontró el acta seleccionada.'
}
```

---

## 🐛 Debugging

### Ver información del sistema en consola:

```javascript
// En la consola del navegador
APP_INFO.debug()
```

### Verificar estado de autenticación:

```javascript
AuthModule.isAuthenticated()  // true o false
```

### Ver configuración actual:

```javascript
APP_CONFIG  // Muestra toda la configuración
```

---

## ⚠️ Importante

### Orden de Carga de Scripts

El orden en `index.html` es **crítico**:

```html
<script src="js/config.js"></script>      <!-- 1. Configuración primero -->
<script src="js/auth.js"></script>        <!-- 2. Autenticación -->
<script src="js/navigation.js"></script>  <!-- 3. Navegación -->
<script src="js/filter.js"></script>      <!-- 4. Filtrado -->
<script src="js/zoom.js"></script>        <!-- 5. Zoom -->
<script src="js/pdf.js"></script>         <!-- 6. PDF -->
<script src="js/app.js"></script>         <!-- 7. Inicializador al final -->
```

**No cambiar el orden sin verificar dependencias.**

---

## 🎯 Buenas Prácticas

1. **Siempre modificar `config.js` primero** para cambios de configuración
2. **Usar la consola del navegador** para debugging (F12)
3. **Probar en diferentes navegadores** después de cambios
4. **Hacer backup antes de modificaciones grandes**
5. **Comentar código nuevo** siguiendo el estilo existente
6. **Verificar `funciones.js`** si algo no funciona (compatibilidad legacy)

---

## 📞 Solución de Problemas

| Problema | Posible Solución |
|----------|------------------|
| No carga la página | Verificar orden de scripts en index.html |
| Login no funciona | Revisar credenciales en config.js |
| Zoom no funciona | Verificar que zoom.js se carga correctamente |
| PDF no genera | Verificar que jsPDF está cargado (CDN) |
| Navegación rota | Revisar navigation.js y auth.js |
| Imágenes no se ven | Verificar URLs en los archivos HTML de años |

---

## 🔄 Migración desde funciones.js

El archivo `funciones.js` se mantiene por compatibilidad pero ya no se usa. 

**Para eliminar completamente:**
1. Verificar que todo funciona con los nuevos módulos
2. Eliminar `<script src="js/funciones.js"></script>` del index.html
3. Borrar el archivo `js/funciones.js`

---

## 📝 Changelog

### v2.0.0 (2025-11-12)
- ✅ Reestructuración modular completa
- ✅ Separación de responsabilidades
- ✅ Configuración centralizada
- ✅ Documentación completa
- ✅ Mejor mantenibilidad

---

**Sistema desarrollado para: Antonia Moreno de Caceres**
