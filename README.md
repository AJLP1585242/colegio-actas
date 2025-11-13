# Sistema de Actas - Colegio Antonia Moreno de Caceres

Sistema web para consultar actas escolares digitalizadas (1990-2012).

## Acceso Rápido

- **Demo en vivo**: [https://ajlp1585242.github.io/colegio-actas/](https://ajlp1585242.github.io/colegio-actas/)
- **Credenciales**: usuario: `admin` / contraseña: `1234`

## Documentación Completa

Toda la documentación técnica se encuentra en la carpeta `docs/`:

- **[Documentación Técnica Completa](docs/DOCUMENTACION.md)** - Arquitectura, módulos, configuración
- **[Guía Rápida](docs/GUIA-RAPIDA.md)** - Instrucciones para desarrolladores
- **[Estructura del Proyecto](docs/ESTRUCTURA.md)** - Organización de archivos

## Estructura Simplificada

```
colegio/
├── index.html              # Punto de entrada
├── actas/
│   ├── normales/          # Actas 1990-2012 (23 años)
│   └── recuperacion/      # Actas de recuperación
├── css/                   # Estilos
├── js/                    # Módulos JavaScript
└── docs/                  # Documentación técnica
```

## Tecnologías

- HTML5 + CSS3 + JavaScript ES6+
- jsPDF para generación de PDFs
- Cloudinary para almacenamiento de imágenes
- GitHub Pages para deployment

## Para más información

Consulta la [documentación completa](docs/DOCUMENTACION.md) para detalles técnicos, instrucciones de mantenimiento y guías de desarrollo.