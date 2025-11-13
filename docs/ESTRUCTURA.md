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
├── index.html                       # Página principal (login y menús)
├── README.md                        # Documentación principal
│
├── actas/                           # Archivos de actas organizados
│   ├── normales/                    # Actas normales por año
│   │   ├── 1990/ hasta 2012/       # 23 carpetas de años
│   │   │   └── YYYY.html           # HTML con actas del año
│   │
│   └── recuperacion/                # Actas de recuperación
│       └── 1995_rp/
│           └── 1995rp.html
│
├── css/                             # Estilos del sistema
│   └── estilos.css                  # Archivo único de estilos
│
├── js/                              # Módulos JavaScript
│   ├── config.js                    # Configuración (AQUÍ MODIFICAR CONTRASEÑA)
│   ├── auth.js                      # Autenticación
│   ├── navigation.js                # Navegación
│   ├── filter.js                    # Filtrado
│   ├── zoom.js                      # Zoom
│   ├── pdf.js                       # PDFs
│   ├── app.js                       # Inicializador
│   └── funciones.js                 # Legacy (mantener por compatibilidad)
│
└── docs/                            # Documentación técnica
    ├── DOCUMENTACION.md             # Guía técnica completa
    ├── GUIA-RAPIDA.md               # Referencia rápida
    ├── ESTRUCTURA.md                # Este archivo
    └── README.md                    # Resumen del proyecto


VENTAJAS DE ESTA ESTRUCTURA:
=============================
- Organización profesional y escalable
- Separación clara entre actas normales y recuperación
- Documentación centralizada en docs/
- Fácil mantenimiento y modificación
- Compatible con GitHub Pages


MODIFICACIONES COMUNES:
========================

1. CAMBIAR CONTRASEÑA:
   Archivo: js/config.js
   Línea: 9
   
2. AGREGAR NUEVO AÑO:
   - Crear carpeta: actas/normales/YYYY/
   - Crear archivo: actas/normales/YYYY/YYYY.html
   - Actualizar: index.html (selector de años y fallbackCatalogo)
   
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
5. Ver acta → actas/normales/YYYY/YYYY.html
6. Funcionalidades → js/zoom.js, js/pdf.js


BUENAS PRÁCTICAS:
=================

- NO mover archivos sin actualizar rutas
- NO modificar estructura de carpetas de actas/
- SÍ modificar solo js/config.js para configuración
- SÍ mantener backup antes de cambios grandes


ARCHIVOS CRÍTICOS (no eliminar):
=================================

- index.html                  (página principal)
- js/config.js                (configuración)
- js/app.js                   (inicializador)
- css/estilos.css             (estilos)
- actas/normales/             (actas 1990-2012)
- actas/recuperacion/         (actas de recuperación)

*/

// Esta es solo documentación, no código ejecutable
