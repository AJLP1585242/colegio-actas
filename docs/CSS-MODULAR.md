# Actualización de CSS Modular

## Archivos CSS creados

Los estilos se han separado en 6 módulos:

- **base.css** - Reset, configuración general, body, tipografía
- **layout.css** - Header, main, cajas de login/menú
- **components.css** - Inputs, botones, cards, tarjetas
- **zoom.css** - Funcionalidad de zoom
- **animations.css** - Animaciones (fadeIn, etc.)
- **responsive.css** - Media queries para diferentes pantallas

## Cómo actualizar los archivos HTML

### En index.html (✅ Ya actualizado)

Reemplazar:
```html
<link rel="stylesheet" href="css/estilos.css">
```

Por:
```html
<!-- Estilos modulares CSS -->
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/zoom.css">
<link rel="stylesheet" href="css/animations.css">
<link rel="stylesheet" href="css/responsive.css">
```

### En archivos de actas (TODO - 34 archivos)

Reemplazar:
```html
<link rel="stylesheet" href="../../../css/estilos.css">
```

Por:
```html
<!-- Estilos modulares CSS -->
<link rel="stylesheet" href="../../../css/base.css">
<link rel="stylesheet" href="../../../css/layout.css">
<link rel="stylesheet" href="../../../css/components.css">
<link rel="stylesheet" href="../../../css/zoom.css">
<link rel="stylesheet" href="../../../css/animations.css">
<link rel="stylesheet" href="../../../css/responsive.css">
```

## Script PowerShell para actualización masiva

```powershell
# Actualizar archivos de actas normales y recuperación
$files = Get-ChildItem -Path "c:\colegio\actas" -Recurse -Filter "*.html"

foreach($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    $oldLink = '<link rel="stylesheet" href="../../../css/estilos.css">'
    $newLinks = @"
<!-- Estilos modulares CSS -->
  <link rel="stylesheet" href="../../../css/base.css">
  <link rel="stylesheet" href="../../../css/layout.css">
  <link rel="stylesheet" href="../../../css/components.css">
  <link rel="stylesheet" href="../../../css/zoom.css">
  <link rel="stylesheet" href="../../../css/animations.css">
  <link rel="stylesheet" href="../../../css/responsive.css">
"@
    
    if($content -match [regex]::Escape($oldLink)) {
        $content = $content -replace [regex]::Escape($oldLink), $newLinks
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Actualizado: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nActualización completada!" -ForegroundColor Cyan
```

## Ventajas de esta estructura

✅ **Organización clara** - Cada archivo tiene una responsabilidad específica
✅ **Fácil mantenimiento** - Encuentra rápidamente los estilos que necesitas modificar
✅ **Mejor rendimiento** - Los navegadores pueden cachear archivos independientes
✅ **Desarrollo en equipo** - Varios desarrolladores pueden trabajar en diferentes archivos CSS
✅ **Depuración más fácil** - Los errores son más fáciles de localizar
✅ **Escalable** - Fácil añadir nuevos módulos CSS en el futuro

## Orden de carga recomendado

1. **base.css** - Primero porque define los fundamentos
2. **layout.css** - Estructura general
3. **components.css** - Componentes específicos
4. **zoom.css** - Funcionalidad adicional
5. **animations.css** - Efectos visuales
6. **responsive.css** - Último para sobrescribir según pantalla
