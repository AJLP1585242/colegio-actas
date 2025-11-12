# Sistema de Actas - Colegio Antonia Moreno de Caceres# 📚 Sistema de Actas Escolares

## Antonia Moreno de Caceres

Sistema web para consultar actas escolares digitalizadas (1990-2012).

Sistema web para consulta de actas escolares desde 1990 hasta 2012.

## 🚀 Acceso Rápido

---

- **Demo en vivo**: [https://ajlp1585242.github.io/colegio-actas/](https://ajlp1585242.github.io/colegio-actas/)

- **Credenciales**: usuario: `admin` / contraseña: `1234`## 🚀 Inicio Rápido



## 📚 Documentación Completa**Acceso:**

- Usuario: `admin`

Toda la documentación técnica se encuentra en la carpeta `docs/`:- Contraseña: `1234`

- URL: https://ajlp1585242.github.io/colegio-actas/

- **[Documentación Técnica Completa](docs/DOCUMENTACION.md)** - Arquitectura, módulos, configuración

- **[Guía Rápida](docs/GUIA-RAPIDA.md)** - Instrucciones para desarrolladores**📖 Documentación:**

- **[Estructura del Proyecto](docs/ESTRUCTURA.md)** - Organización de archivos- **Guía de uso:** Ver `GUIA-RAPIDA.md`

- **Documentación técnica:** Ver `DOCUMENTACION.md`

## 📂 Estructura Simplificada- **Estructura:** Ver `ESTRUCTURA.md`



```---

colegio/

├── index.html              # Punto de entrada## ✨ Características

├── actas/- 🔐 Sistema de autenticación con sesión

│   ├── normales/          # Actas 1990-2012 (23 años)- 📱 Diseño responsive (móvil y desktop)

│   └── recuperacion/      # Actas de recuperación- 🔍 Búsqueda por año, grado y sección

├── css/                   # Estilos- 📄 Generación de PDFs

├── js/                    # Módulos JavaScript- 🔎 Zoom de imágenes con controles

└── docs/                  # Documentación técnica- ☁️ Imágenes alojadas en Cloudinary

```- 🧭 Navegación por niveles intuitiva

- ⚙️ Configuración centralizada

## 🛠️ Tecnologías

---

- HTML5 + CSS3 + JavaScript ES6+

- jsPDF para generación de PDFs## 📂 Organización

- Cloudinary para almacenamiento de imágenes

- GitHub Pages para deployment```

colegio/

## 📖 Para más información├── index.html              # Página principal

├── css/estilos.css         # Estilos

Consulta la [documentación completa](docs/DOCUMENTACION.md) para detalles técnicos, instrucciones de mantenimiento y guías de desarrollo.├── js/                     # Módulos JavaScript

│   ├── config.js          # ⚙️ Configuración (cambiar contraseña aquí)
│   ├── auth.js            # 🔐 Autenticación
│   ├── navigation.js      # 🧭 Navegación
│   ├── filter.js          # 🔍 Filtros
│   ├── zoom.js            # 🔎 Zoom
│   ├── pdf.js             # 📄 PDFs
│   └── app.js             # 🚀 Inicializador
├── 1990/ - 2012/           # Actas por año
├── 1995_rp/                # Recuperación
└── docs/                   # Documentación
```

**¿Por qué esta estructura?**
- ✅ Simple y directa
- ✅ Fácil de navegar
- ✅ Compatible con GitHub Pages
- ✅ URLs cortas
- ✅ Mantenible

---

## 🔧 Configuración

**Cambiar contraseña:**
```javascript
// Archivo: js/config.js (líneas 8-9)
USERNAME: 'admin',      // ← Cambiar aquí
PASSWORD: '1234',       // ← Cambiar aquí
```

**Más configuraciones:**  
Ver archivo `js/config.js` - Todo centralizado ahí

---

## 🛠️ Tecnologías
- HTML5
- CSS3
- JavaScript ES6+ (Modular)
- jsPDF (generación de PDFs)
- Cloudinary (almacenamiento de imágenes)
- GitHub Pages (hosting)

---

## 📝 Versión
**v2.0.0** - Sistema modular profesional  
**Fecha:** Noviembre 2025

---

**Desarrollado para:** Antonia Moreno de Caceres
