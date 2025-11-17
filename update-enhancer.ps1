# Script para agregar imageEnhancer.js a todos los archivos HTML

Write-Host "Actualizando actas normales..." -ForegroundColor Cyan

$normales = Get-ChildItem -Path "actas\normales" -Recurse -Filter "*.html"
foreach($file in $normales) {
    $content = Get-Content $file.FullName -Raw
    
    # Solo procesar si no tiene imageEnhancer
    if($content -notmatch 'imageEnhancer\.js') {
        # Buscar la línea de imageOptimizer y agregar imageEnhancer después
        $pattern = '(<script src="../../../js/imageOptimizer\.js"></script>)'
        $replacement = '<script src="../../../js/imageOptimizer.js"></script>' + "`r`n" + '  <script src="../../../js/imageEnhancer.js"></script>'
        
        $content = $content -replace $pattern, $replacement
        $content | Set-Content -Path $file.FullName -NoNewline
        
        Write-Host "  ✓" $file.Name -ForegroundColor Green
    }
}

Write-Host "`nActualizando actas de recuperacion..." -ForegroundColor Cyan

$recuperacion = Get-ChildItem -Path "actas\recuperacion" -Recurse -Filter "*.html"
foreach($file in $recuperacion) {
    $content = Get-Content $file.FullName -Raw
    
    if($content -notmatch 'imageEnhancer\.js') {
        # Para recuperación, buscar antes del </head>
        $pattern = '(</head>)'
        $replacement = '  <script src="../../../js/imageEnhancer.js"></script>' + "`r`n" + '</head>'
        
        $content = $content -replace $pattern, $replacement
        $content | Set-Content -Path $file.FullName -NoNewline
        
        Write-Host "  ✓" $file.Name -ForegroundColor Green
    }
}

Write-Host "`n✅ Actualización completada!" -ForegroundColor Green
Write-Host "Total archivos procesados: $($normales.Count + $recuperacion.Count)" -ForegroundColor Yellow
