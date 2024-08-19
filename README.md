# El Ahorcado

Este proyecto es una implementación del clásico juego "El Ahorcado" utilizando HTML, CSS y JavaScript. El juego incluye una integración con Supabase para almacenar y mostrar una tabla de puntuaciones.

## Características

- Juego del Ahorcado completamente funcional
- Palabras aleatorias en español
- Sistema de puntuación basado en tiempo y intentos restantes
- Tabla de puntuaciones almacenada en Supabase
- Interfaz de usuario intuitiva y responsive

## Requisitos previos

Antes de comenzar, asegúrate de tener lo siguiente:

- Un navegador web moderno (Chrome, Firefox, Safari, Edge)
- Una cuenta en [Supabase](https://supabase.com/) (gratuita)
- Un editor de código (recomendado: Visual Studio Code)

## Instalación

Sigue estos pasos para instalar y configurar el proyecto:

1. Clona este repositorio o descarga los archivos del proyecto:
   ```
   git clone https://github.com/tu-usuario/el-ahorcado.git
   ```

2. Navega al directorio del proyecto:
   ```
   cd el-ahorcado
   ```

3. Abre el archivo `index.html` en tu editor de código.

4. En el archivo `script.js`, busca la función `initSupabase()` y reemplaza las credenciales de Supabase con las tuyas:
   ```javascript
   const supabaseUrl = 'TU_URL_DE_SUPABASE';
   const supabaseKey = 'TU_CLAVE_DE_SUPABASE';
   ```

5. Configura tu proyecto Supabase:
   - Crea una nueva tabla llamada `score` con las siguientes columnas:
     - `id` (int8, primary key)
     - `nombre` (varchar)
     - `puntos` (int4)
     - `fecha` (timestamptz)
   - Asegúrate de que las políticas de seguridad permitan leer y escribir en esta tabla.

## Uso

Para jugar "El Ahorcado":

1. Abre el archivo `index.html` en tu navegador web.
2. Haz clic en "Nuevo Juego" para comenzar.
3. Intenta adivinar la palabra haciendo clic en las letras.
4. Si ganas, podrás ingresar tu nombre para guardar tu puntuación.
5. La tabla de puntuaciones se actualizará automáticamente.

## Estructura del proyecto

- `index.html`: Estructura HTML del juego
- `styles.css`: Estilos CSS para la interfaz de usuario
- `script.js`: Lógica del juego y conexión con Supabase

## Solución de problemas

Si encuentras algún problema al cargar la tabla de puntuaciones:

1. Verifica tu conexión a internet.
2. Asegúrate de que las credenciales de Supabase sean correctas.
3. Revisa la consola del navegador (F12) para ver mensajes de error detallados.
4. Verifica que la tabla `score` en Supabase esté configurada correctamente.

## Contribuir

Si deseas contribuir a este proyecto, por favor:

1. Haz un fork del repositorio
2. Crea una nueva rama (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

