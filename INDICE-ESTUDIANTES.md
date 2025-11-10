# Generador de Índice de Estudiantes

## ¿Qué es el índice?

El índice (`js/indice-estudiantes.json`) es un archivo JSON que contiene todos los nombres de estudiantes y su ubicación (año, grado, sección). Esto permite búsquedas **instantáneas** sin necesidad de analizar las imágenes cada vez.

## Cómo generar el índice completo

### Opción 1: Desde el navegador (recomendado para primera vez)

1. Abre el sitio y accede con tu usuario
2. Intenta buscar cualquier nombre
3. Si no existe el índice, el sistema te preguntará si deseas generarlo
4. Acepta y espera (puede tomar 10-30 minutos dependiendo de la cantidad de actas)
5. Una vez completado, el sistema mostrará el JSON generado
6. Copia el contenido y guárdalo como `js/indice-estudiantes.json`
7. Haz commit y push del archivo

### Opción 2: Índice de ejemplo (para pruebas rápidas)

El archivo `js/indice-estudiantes.json` incluido tiene 5 nombres de ejemplo:
- MARIA GARCIA LOPEZ
- JUAN CARLOS RAMIREZ
- ANA SOFIA MARTINEZ
- PEDRO HERNANDEZ DIAZ
- LAURA FERNANDEZ CRUZ

Puedes buscar estos nombres para probar el sistema.

### Opción 3: Agregar nombres manualmente

Edita `js/indice-estudiantes.json` con este formato:

```json
{
  "NOMBRE COMPLETO DEL ESTUDIANTE": [
    {
      "anio": "2012",
      "grado": "5",
      "seccion": "A"
    }
  ],
  "OTRO ESTUDIANTE": [
    {
      "anio": "2011",
      "grado": "4",
      "seccion": "B"
    },
    {
      "anio": "2012",
      "grado": "5",
      "seccion": "B"
    }
  ]
}
```

**Nota:** Un estudiante puede aparecer en múltiples años/grados (array de ubicaciones).

## Ventajas del sistema de índice

✅ **Búsqueda instantánea** - Menos de 1 segundo
✅ **Sin dependencias pesadas** - No necesita cargar librería OCR
✅ **Funciona offline** - Una vez cargado el índice
✅ **Escalable** - Miles de estudiantes sin perder velocidad
✅ **Actualizable** - Puedes regenerar o editar manualmente

## Mantenimiento

- **Agregar nuevos años:** Regenera el índice completo o agrega manualmente los nuevos estudiantes
- **Corregir errores:** Edita el JSON directamente
- **Backup:** Mantén una copia del índice antes de regenerarlo

## Tamaño aproximado

- 100 estudiantes: ~10 KB
- 1000 estudiantes: ~100 KB
- 10000 estudiantes: ~1 MB

El archivo es pequeño y se carga rápido incluso con conexiones lentas.
