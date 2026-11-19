# NO MERCY 2089
*Miami no perdona.*

## 1. Puesta en marcha (una sola vez)
1. Crea una cuenta en https://github.com y un repositorio nuevo llamado `no-mercy-2089` (público, para usar GitHub Pages gratis).
2. Sube el contenido de esta carpeta al repositorio (en la web: "Add file" → "Upload files", arrastrando todo el contenido, incluida la carpeta oculta `.github`).
3. En el repositorio: **Settings → Pages → Source: "GitHub Actions"**.
4. Pestaña **Actions**: espera a que "Publicar versión web" termine (círculo verde).
5. Tu juego estará en `https://TU-USUARIO.github.io/no-mercy-2089/`.

## 2. Probar la versión web
Abre esa URL en el navegador. Se actualiza sola cada vez que se suben cambios.

## 3. Pedir el .exe (solo cuando se decida)
Cuando le digas a Claude "ahora entrégame el proyecto en .exe", el proceso es:
1. En GitHub: pestaña **Actions** → "Build .exe (Windows)" → botón **Run workflow** → Run.
2. Espera unos 5-10 minutos hasta el círculo verde.
3. Entra en esa ejecución y, abajo en **Artifacts**, descarga `NO-MERCY-2089-exe` (un zip).
4. Descomprime y haz doble clic en `NO-MERCY-2089-<versión>.exe`.
5. Si Windows muestra "Windows protegió su PC": **Más información → Ejecutar de todas formas** (es normal, el juego no está firmado).
No necesitas instalar nada en tu ordenador.

## Estado
- Prototipo 0.0 (Infraestructura): escrito, **pendiente de verificar** en GitHub.
- Siguiente: 0.1 Movimiento, solo tras feedback y aprobación del 0.0.
