# 📚 Sistema de Actas Escolares
## Antonia Moreno de Caceres

Sistema web para consulta de actas escolares desde 1990 hasta 2012.

---

## 🚀 Inicio Rápido

**Acceso:**
- Usuario: `admin`
- Contraseña: `1234`
- URL: https://ajlp1585242.github.io/colegio-actas/

**📖 Documentación:**
- **Guía de uso:** Ver `GUIA-RAPIDA.md`
- **Documentación técnica:** Ver `DOCUMENTACION.md`
- **Estructura:** Ver `ESTRUCTURA.md`

---

## ✨ Características
- 🔐 Sistema de autenticación con sesión
- 📱 Diseño responsive (móvil y desktop)
- 🔍 Búsqueda por año, grado y sección
- 📄 Generación de PDFs
- 🔎 Zoom de imágenes con controles
- ☁️ Imágenes alojadas en Cloudinary
- 🧭 Navegación por niveles intuitiva
- ⚙️ Configuración centralizada

---

## 📂 Organización

```
colegio/
├── index.html              # Página principal
├── css/estilos.css         # Estilos
├── js/                     # Módulos JavaScript
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
