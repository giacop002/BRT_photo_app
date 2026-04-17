# BRT_photo_app

UI (frontend)
Svelte
- formulario subir foto + metadata
- tabla/listado de muestras
- vista detalle con imagen
- campo de observaciones

backend local
Node.js

BBDD
SQLite


## Flujo típico de uso

1. subir muestra
    - usuario selecciona img
    - app copia a /data/img/, genera ID, guarda metadata en BBDD
2. Listar muestras
    - query a SQLite
    - UI muestra tabla: profundidad, fecha, preview img
3. Ver detalle
    - carga img desde disco
    - muestra observaciones existentes
4. agregar observación
    - inserta en tabla observaciones
    - se actualiza UI


Supuestos/Decisiones
- guardar img en local filesystem(?), db guarda solo ruta, o guardar img en bbdd
- 1 user por pc (sin control de sesión)
- al final tendrías una UI para ver ordenadas las muestras/sondas, las fotos, sus datos y hacer/guardar las observaciones.
- poder "exportar" fotos en un formato estándar, que incluya los datos asociados