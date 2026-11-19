# CLAUDE.md — NO MERCY 2089 (GDD 2.0)

Eres el programador principal. El jugador/dueño del proyecto NO programa: explica brevemente qué haces y por qué.

## 1. Resumen del GDD
- **Juego:** NO MERCY 2089 — "Miami no perdona." Miami 2089. Acción, combate, exploración y aventura narrativa.
- **Perspectiva:** 2D cenital pura (estilo Hotline Miami), movimiento en 8 direcciones, pixel art futurista/cyberpunk.
- **Protagonista:** Adrián Vega (25, cubanoamericano de Little Havana, mecánico tecnológico con pasado criminal). Aliados/figuras: Valentina Cruz (información), Marcus Reed (taller), Dante Moretti (antagonista; influye por subordinados, no es jefe de arena).
- **Pilares:** combate técnico y dinámico · exploración urbana · progresión con sentido · IA competitiva · historia con decisiones · identidad visual propia.
- **Combate:** rápido, técnico, como PvP. Ataque rápido/fuerte, combos, bloqueo, parry, parada perfecta, esquiva con invulnerabilidad, contraataque. Fases en frames (startup/activo/recovery) a 60 pasos/s.
- **Enemigos:** SOLO humanos. Street Kid, Brawler, Gunner, Counter, Assassin, Veteran, Executor. Máquina de estados (Idle, Chase, Circle, Attack, Block, Stunned, Retreat, Dead), A* en cuadrícula, coordinador de turnos de ataque.
- **Encuentros:** zonas semiabiertas, accesos que se cierran, refuerzos limitados y coherentes, escape posible.
- **Combat Rush:** puntuación por habilidad y variedad (solo escucha eventos). Rangos D Rookie, C Street, B Dangerous, A Professional, S Untouchable, SS Miami Legend.
- **Heat Level:** 0 Normal · 1 Atención · 2 Vigilancia · 3 Amenaza · 4 Objetivo prioritario. Cambia el comportamiento del mundo.
- **Mapa:** distritos desbloqueables: Little Havana, Downtown, Miami Beach, Neon District, Industrial Zone, Underground.
- **Plan:** 0.0 Infraestructura · 0.1 Movimiento · 0.2 Combate básico · 0.3 IA · 0.4 Encuentros · 0.5 Combat Rush · 0.6 Primer distrito (Little Havana).

## 2. Reglas innegociables (GDD sección 20)
1. Perspectiva siempre cenital.
2. Movimiento en ocho direcciones.
3. Sin saltos ni plataformas.
4. Enemigos siempre humanos.
5. Sin jefes tradicionales.
6. Combate técnico y dinámico.
7. Enemigos con comportamientos diferenciados.
8. Encuentros con límites y condiciones coherentes.
9. La exploración ofrece recompensas interesantes.
10. Las decisiones del jugador influyen en la historia.
11. Pixel art detallado con identidad propia.
12. Se desarrolla por sistemas y etapas.
13. Cada sistema se prueba antes de añadir más mecánicas.
14. La lógica del juego se separa de Phaser y se prueba con tests.
15. Los valores de game feel viven en datos, no en el código.
16. Cada prototipo debe dejar una versión jugable y un .exe de prueba.

## 3. Arquitectura (GDD sección 17)
**Stack:** Phaser 3 · TypeScript estricto · Vite · Vitest · Playwright (a partir de cuando haga falta) · Electron + electron-builder · GitHub + GitHub Actions · Aseprite (PNG+JSON) / Tiled.

**Regla clave:** todo lo que pueda ser lógica pura va en `src/core`, SIN depender de Phaser, y se prueba con Vitest. Phaser solo dibuja, lee controles y reproduce sonido.

```
src/
  core/        lógica pura (testeable)
    combat/ ai/ rush/ heat/ encounters/ progression/ events/
  game/        Phaser: escenas, entidades, cámara
  ui/          HUD, menús, diálogos, resultados
  data/        ataques, enemigos, encuentros, rangos (datos, no código)
  debug/       hitboxes, estado de IA, valores en vivo
  assets/      sprites, tilemaps, audio
electron/      proceso principal y empaquetado
tests/
.github/workflows/   generación automática del .exe
```

**Módulos:** Player Movement · Player Combat · PlayerAnimation · EnemyAI · Enemy Combat · Encounter Manager · Combat Rush · Heat Level · Inventory · Equipment · Progression · Dialogue System · Mission System · World and District Management · Save System. Un archivo, una responsabilidad.

**Decisiones técnicas:**
- Datos primero (tipados, editables sin tocar lógica). Valores de game feel NUNCA fijos en el código.
- Tiempo fijo: lógica de combate a 60 pasos/s, independiente de los FPS.
- Controles: teclado y mando (Gamepad API), mapa de acciones reconfigurable (Mover, Ataque rápido, Ataque fuerte, Bloquear/Parry, Esquivar, Interactuar).
- Guardado: una sola interfaz; navegador = almacenamiento local, .exe = archivos en la carpeta de datos del usuario.
- Resolución base 480×270, escalado entero con filtrado nearest. Tamaño de tile (16 o 32) se fija en el Prototipo 0.0 y no se cambia.
- Rendimiento: 60 FPS estables.
- Vite usa `base: './'` para que el .exe cargue bien los archivos locales.

## 4. Normas de trabajo (GDD sección 18.3)
- No adelantar sistemas de prototipos futuros.
- Explicar brevemente qué hace cada cosa y por qué.
- Tests para toda lógica pura; build limpio antes de entregar.
- Cualquier conflicto con el GDD se avisa antes de implementarlo.
- Si una limitación técnica de la nube bloquea algo (p. ej. generar el .exe), se informa de inmediato con alternativas.
- Ciclo por prototipo: leer GDD + este archivo → implementar solo el prototipo actual → tests + build → commits pequeños → versión web + .exe de prueba → resumen (qué probar, valores a ajustar, estado) → feedback del jugador → ajustar. No avanzar hasta que el jugador apruebe.

## 5. Decisión del dueño (modifica la regla 16 y el punto 19 del GDD)
- Cada prototipo deja una **versión web jugable publicada en GitHub Pages** (workflow `deploy-web.yml`, automático).
- El **.exe NO se genera en cada prototipo**: solo cuando el dueño lo pida ("ahora entrégame el proyecto en .exe"). Entonces: lanzar/verificar el workflow manual `build-exe.yml` y darle la guía paso a paso del README (sección 3).
- Se comprobará el .exe una vez pronto para detectar problemas de empaquetado cuanto antes.

## 6. Estado actual
Ver sección "Estado" del README.md.
