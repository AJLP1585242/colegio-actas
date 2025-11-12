/**
 * ============================================
 * ESTRUCTURA DEL PROYECTO
 * ============================================
 * Organización de carpetas y archivos del sistema
 */

/*
ESTRUCTURA ACTUAL (Raíz del proyecto):
========================================

colegio/
│
├── 📄 index.html                    # Página principal (login y menús)
│
├── 📁 css/                          # Estilos del sistema
│   └── estilos.css                  # Archivo único de estilos
│
├── 📁 js/                           # Módulos JavaScript
│   ├── config.js                    # ⚙️  Configuración (AQUÍ MODIFICAR CONTRASEÑA)
│   ├── auth.js                      # 🔐 Autenticación
│   ├── navigation.js                # 🧭 Navegación
│   ├── filter.js                    # 🔍 Filtrado
│   ├── zoom.js                      # 🔎 Zoom
│   ├── pdf.js                       # 📄 PDFs
│   ├── app.js                       # 🚀 Inicializador
│   └── funciones.js                 # ⚠️  Legacy (mantener por compatibilidad)
│
├── 📁 1990/ hasta 📁 2012/          # Actas por año (26 carpetas)
│   └── YYYY.html                    # Archivo HTML con las actas del año
│
├── 📁 1995_rp/                      # Actas de recuperación
│   └── 1995rp.html
│
└── 📄 README.md                     # Documentación principal
└── 📄 DOCUMENTACION.md              # Documentación técnica


VENTAJAS DE ESTA ESTRUCTURA:
=============================
✅ Simple y directa
✅ Fácil de navegar
✅ URLs cortas (2012/2012.html)
✅ Compatible con GitHub Pages
✅ Sin rutas complejas


MODIFICACIONES COMUNES:
========================

1. CAMBIAR CONTRASEÑA:
   Archivo: js/config.js
   Línea: 9
   
2. AGREGAR NUEVO AÑO:
   - Crear carpeta: YYYY/
   - Crear archivo: YYYY/YYYY.html
   - Actualizar: index.html (selector de años)
   
3. MODIFICAR ESTILOS:
   Archivo: css/estilos.css
   
4. CAMBIAR MENSAJES:
   Archivo: js/config.js
   Sección: MESSAGES


FLUJO DE NAVEGACIÓN:
====================

1. Usuario abre → index.html
2. Login → js/auth.js
3. Selector de tipo → js/navigation.js
4. Selector de actas → index.html (menús)
5. Ver acta → YYYY/YYYY.html
6. Funcionalidades → js/zoom.js, js/pdf.js


BUENAS PRÁCTICAS:
=================

📌 NO mover archivos sin actualizar rutas
📌 NO modificar estructura de carpetas de años
📌 SÍ modificar solo js/config.js para configuración
📌 SÍ mantener backup antes de cambios grandes


ARCHIVOS CRÍTICOS (no eliminar):
=================================

- index.html                  (página principal)
- js/config.js                (configuración)
- js/app.js                   (inicializador)
- css/estilos.css             (estilos)
- Carpetas 1990-2012/         (actas)

*/

// Esta es solo documentación, no código ejecutable
