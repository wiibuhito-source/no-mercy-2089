// El guion de la cinemática inicial (datos, no código): textos, lugares, sonidos, luces y efectos de cada escena.
// Para cambiar una frase, un sonido o una luz se edita este archivo; el motor no se toca.
// Las ilustraciones están en src/game/cinematic/art/ (una por escena, con sus capas).
import type { StoryScene } from '../core/cinematic/storyTypes';

export const PROTAGONIST = {
  firstName: 'Adrián',
  lastName: 'Vargas',
  fullName: 'Adrián Vargas'
} as const;

const NAME = PROTAGONIST.fullName;

// Colores de los coches voladores lejanos
const CAR = 0x0d0722;
const HEADLIGHT = 0xffe9a8;

export const STORY_SCENES: readonly StoryScene[] = [
  {
    id: 'escena-1',
    art: 'skyline',
    caption: 'MIAMI, 2089',
    lines: [
      'Miami, 2089. Dicen que esta ciudad nunca duerme. Yo creo que simplemente no tiene remordimientos.',
      'Pero no vengo a hablar de ella. Vengo a contarte cómo llegué a conocerla demasiado bien.'
    ],
    rain: false,
    lights: [
      { x: 61, y: 27, radius: 9, color: 0xff3b5c, peakAlpha: 0.85, pulseMs: 1500 },
      { x: 430, y: 41, radius: 9, color: 0xff3b5c, peakAlpha: 0.85, pulseMs: 1900, delayMs: 600 },
      { x: 259, y: 100, radius: 48, color: 0xff2bd6, peakAlpha: 0.12, pulseMs: 4200 }
    ],
    effects: [
      { type: 'traffic', y: 62, count: 4, speed: 34, dir: 1, color: CAR, lightColor: HEADLIGHT, layer: 1 },
      { type: 'traffic', y: 98, count: 3, speed: 22, dir: -1, color: CAR, lightColor: 0xff7a8a, layer: 1 },
      { type: 'ripples', x0: 0, x1: 500, y0: 172, y1: 262, everyMs: 260, color: 0xdfe6ff },
      { type: 'fog', y0: 150, y1: 205, color: 0x9a6aff, alpha: 0.2, speed: 6 },
      { type: 'dust', count: 22, color: 0xdfe6ff, alpha: 0.28 }
    ],
    grade: { color: 0x4a0a6a, alpha: 0.05 },
    pan: { fromX: 0, fromY: 0, toX: -14, toY: -6, durationMs: 30000 }
  },
  {
    id: 'escena-2',
    art: 'havana',
    caption: `LITTLE HAVANA, 2078 - ${NAME}, 14 AÑOS`,
    card: { title: '2078', sub: 'ONCE AÑOS ANTES' },
    lines: [
      'Little Havana, 2078. Catorce años, cero planes y un cafecito demasiado fuerte para mi edad.',
      'Éramos mi madre y yo. Con eso bastaba. O eso creía.'
    ],
    rain: true,
    lights: [
      { x: 134, y: 128, radius: 30, color: 0x19f3ff, peakAlpha: 0.3, pulseMs: 2600 },
      { x: 192, y: 108, radius: 28, color: 0xffcf6b, peakAlpha: 0.28, pulseMs: 2400, mode: 'flicker' },
      { x: 62, y: 172, radius: 36, color: 0xffcf6b, peakAlpha: 0.14, pulseMs: 3200 }
    ],
    effects: [
      { type: 'smoke', x: 221, y: 179, everyMs: 420, color: 0xf4f0ff, alpha: 0.5, rise: 15, drift: 3 },
      { type: 'smoke', x: 239, y: 176, everyMs: 520, color: 0xf4f0ff, alpha: 0.4, rise: 13, drift: 2 },
      { type: 'lightning', minGapMs: 9000, maxGapMs: 15000, shake: true },
      { type: 'traffic', y: 30, count: 2, speed: 40, dir: 1, color: CAR, lightColor: HEADLIGHT, layer: 0 },
      { type: 'ripples', x0: 8, x1: 492, y0: 206, y1: 238, everyMs: 120, color: 0xcfd8ff },
      { type: 'fog', y0: 158, y1: 214, color: 0xb08aff, alpha: 0.2, speed: 8 },
      { type: 'wind', count: 14, colors: [0xf4f0ff, 0xffd36b, 0x7ad07a], speed: 60, y0: 90, y1: 196 }
    ],
    grade: { color: 0x3a0a6a, alpha: 0.07 },
    pan: { fromX: 0, fromY: 0, toX: -16, toY: -8, durationMs: 26000 }
  },
  {
    id: 'escena-3',
    art: 'tower',
    caption: 'DOWNTOWN - MEDIANOCHE',
    lines: [
      'Mi madre limpiaba torres en Downtown, de noche. Oficinas de cristal donde nadie sabía cómo se llamaba.',
      'De mi padre, mejor no hablamos.'
    ],
    rain: false,
    lights: [
      { x: 330, y: 66, radius: 36, color: 0x19f3ff, peakAlpha: 0.3, pulseMs: 2600 },
      { x: 330, y: 66, radius: 26, color: 0xff2bd6, peakAlpha: 0.2, pulseMs: 2600, delayMs: 1300 }
    ],
    effects: [
      { type: 'traffic', y: 78, count: 3, speed: 30, dir: -1, color: 0x2a1450, lightColor: HEADLIGHT, layer: 0 },
      { type: 'dust', count: 36, color: 0xdfe6ff, alpha: 0.32 },
      { type: 'wind', count: 5, colors: [0xf4f0ff], speed: 10, y0: 130, y1: 190 }
    ],
    grade: { color: 0x0a3a5a, alpha: 0.07 },
    pan: { fromX: -14, fromY: -6, toX: 0, toY: 0, durationMs: 26000 }
  },
  {
    id: 'escena-4',
    art: 'implant',
    caption: '2078 - EL IMPLANTE',
    lines: [
      'Su corazón latía gracias a un implante. Y el implante, gracias a una suscripción.',
      'Una gran empresa decidía cuánto valía cada latido. Un mes sin pagar y se apagaba. Sin avisos. Sin segundas oportunidades.',
      { who: 'madre', say: 'Tranquilo, mijo. Es solo un número en una pantalla.' },
      'Me quedaban cuarenta y ocho horas y ni un dólar.'
    ],
    rain: false,
    lights: [
      { x: 130, y: 145, radius: 16, color: 0x19f3ff, peakAlpha: 0.5, pulseMs: 1150 },
      { x: 99, y: 86, radius: 16, color: 0xffb347, peakAlpha: 0.5, pulseMs: 1800, mode: 'flicker' },
      { x: 362, y: 128, radius: 38, color: 0xffcf6b, peakAlpha: 0.26, pulseMs: 3600 },
      { x: 163, y: 84, radius: 42, color: 0x19f3ff, peakAlpha: 0.14, pulseMs: 2400, delayMs: 600 },
      { x: 307, y: 70, radius: 46, color: 0xff3b5c, peakAlpha: 0.22, pulseMs: 1800, fromLine: 1 }
    ],
    effects: [
      { type: 'traffic', y: 70, count: 2, speed: 26, dir: 1, color: 0x2a1450, lightColor: HEADLIGHT, layer: 0 },
      { type: 'dust', count: 26, color: 0xdfe6ff, alpha: 0.22 }
    ],
    grade: { color: 0x2a0a5a, alpha: 0.06 },
    pan: { fromX: -16, fromY: -6, toX: 0, toY: 0, durationMs: 30000 }
  },
  {
    id: 'escena-5',
    art: 'neonstreet',
    caption: 'LITTLE HAVANA - MADRUGADA',
    lines: [
      'Pedir ayuda no servía de nada. Los bancos no abrían de noche y los vecinos tampoco andaban sobrados.',
      'Solo había anuncios, y ninguno hablaba de mi problema.'
    ],
    rain: true,
    lights: [
      { x: 192, y: 130, radius: 32, color: 0xff9a4a, peakAlpha: 0.38, pulseMs: 2000, mode: 'flicker' },
      { x: 387, y: 77, radius: 84, color: 0xff2bd6, peakAlpha: 0.18, pulseMs: 3000 },
      { x: 135, y: 168, radius: 24, color: 0x1ff3a0, peakAlpha: 0.24, pulseMs: 2200 },
      { x: 318, y: 160, radius: 26, color: 0xff2bd6, peakAlpha: 0.22, pulseMs: 2600, delayMs: 800 },
      { x: 361, y: 172, radius: 22, color: 0x19f3ff, peakAlpha: 0.22, pulseMs: 3000, mode: 'flicker' }
    ],
    effects: [
      { type: 'smoke', x: 264, y: 201, everyMs: 280, color: 0xdfe6ff, alpha: 0.32, rise: 24, drift: -4 },
      { type: 'lightning', minGapMs: 12000, maxGapMs: 20000, shake: false },
      { type: 'traffic', y: 40, count: 2, speed: 36, dir: -1, color: CAR, lightColor: 0xff7a8a, layer: 0 },
      { type: 'ripples', x0: 6, x1: 494, y0: 206, y1: 240, everyMs: 110, color: 0xcfd8ff },
      { type: 'fog', y0: 152, y1: 214, color: 0xb08aff, alpha: 0.22, speed: 8 },
      { type: 'wind', count: 16, colors: [0xf4f0ff, 0xffd36b, 0x7ad07a], speed: 80, y0: 110, y1: 196 }
    ],
    grade: { color: 0x5a0a7a, alpha: 0.07 },
    pan: { fromX: 0, fromY: -4, toX: -16, toY: 0, durationMs: 26000 }
  },
  {
    id: 'escena-6',
    art: 'offer',
    caption: 'CALLE OCHO - MEDIANOCHE',
    lines: [
      'Entonces apareció un tipo de uno de esos grupos pequeños que mandan en las esquinas.',
      { who: 'tipo', say: 'Tres calles. Una bolsa. Trescientos dólares. Y no preguntes qué lleva.' },
      'Dudé lo que tarda en sonar un latido. Y dije que sí.'
    ],
    rain: true,
    lights: [
      { x: 252, y: 70, radius: 40, color: 0xffb347, peakAlpha: 0.26, pulseMs: 2400, mode: 'flicker' },
      { x: 150, y: 115, radius: 50, color: 0xff2bd6, peakAlpha: 0.14, pulseMs: 3600 }
    ],
    effects: [
      { type: 'smoke', x: 120, y: 203, everyMs: 300, color: 0xdfe6ff, alpha: 0.3, rise: 22, drift: 3 },
      { type: 'smoke', x: 62, y: 70, everyMs: 700, color: 0xdfe6ff, alpha: 0.18, rise: 10, drift: 2 },
      { type: 'ripples', x0: 40, x1: 460, y0: 204, y1: 240, everyMs: 120, color: 0xcfd8ff },
      { type: 'fog', y0: 150, y1: 206, color: 0xb08aff, alpha: 0.2, speed: 7 },
      { type: 'wind', count: 10, colors: [0xf4f0ff, 0xffd36b], speed: 45, y0: 100, y1: 196 }
    ],
    grade: { color: 0x1a0a4a, alpha: 0.08 },
    pan: { fromX: 0, fromY: -8, toX: -16, toY: 0, durationMs: 26000 }
  },
  {
    id: 'escena-7',
    art: 'talent',
    caption: 'LOS MESES SIGUIENTES',
    lines: [
      'Resultó que se me daba bien. No solo lo de correr: la tecnología.',
      { who: 'tipo', say: 'Ese escáner llevaba un mes muerto. ¿Qué le has hecho?' },
      { who: 'adrian', say: 'Nada. Solo lo he convencido.' },
      'Dos días después, tenía más encargos que tiempo. Y cada vez me decía lo mismo: solo una vez. Siempre es solo una vez.'
    ],
    rain: false,
    lights: [
      { x: 245, y: 125, radius: 40, color: 0x19f3ff, peakAlpha: 0.3, pulseMs: 2000 },
      { x: 438, y: 120, radius: 46, color: 0xffb347, peakAlpha: 0.2, pulseMs: 3600 },
      { x: 70, y: 52, radius: 22, color: 0xffe9a8, peakAlpha: 0.3, pulseMs: 2800, mode: 'flicker' }
    ],
    effects: [
      { type: 'sparks', x: 213, y: 146, everyMs: 1900, count: 8, color: 0xffe66d },
      { type: 'smoke', x: 213, y: 143, everyMs: 600, color: 0xc9c9d9, alpha: 0.3, rise: 12, drift: 2 },
      { type: 'dust', count: 40, color: 0xffcf6b, alpha: 0.3 }
    ],
    grade: { color: 0x6a3a0a, alpha: 0.06 },
    pan: { fromX: -16, fromY: 0, toX: 0, toY: -8, durationMs: 30000 }
  },
  {
    id: 'escena-8',
    art: 'run',
    caption: 'LOS AÑOS SIGUIENTES',
    lines: [
      'Un encargo se convirtió en diez. Aprendí qué calles evitar, qué puertas no abrir y qué preguntas no hacer.',
      'Me hice bueno en no existir.'
    ],
    rain: false,
    lights: [],
    effects: [
      { type: 'speedlines', count: 16, speed: 560, color: 0xdfe6ff, alpha: 0.3 },
      { type: 'traffic', y: 46, count: 3, speed: 60, dir: -1, color: CAR, lightColor: HEADLIGHT, layer: 0 },
      { type: 'traffic', y: 84, count: 2, speed: 90, dir: 1, color: CAR, lightColor: 0xff7a8a, layer: 0 },
      { type: 'fog', y0: 190, y1: 232, color: 0xff8ac8, alpha: 0.16, speed: 40 },
      { type: 'wind', count: 14, colors: [0xf4f0ff, 0xffd36b], speed: 180, y0: 60, y1: 200 }
    ],
    grade: { color: 0x6a0a5a, alpha: 0.06 },
    pan: { fromX: 0, fromY: 0, toX: -8, toY: 0, durationMs: 24000 }
  },
  {
    id: 'escena-9',
    art: 'exit',
    caption: '2082 - LA ÚLTIMA VEZ',
    transition: 'flash',
    lines: [
      'A los dieciocho, un transporte salió mal. Muy mal. Alguien resultó herido.',
      'No voy a contar el resto. Todavía no.'
    ],
    rain: true,
    lights: [
      { x: 430, y: 128, radius: 52, color: 0xff3b5c, peakAlpha: 0.38, pulseMs: 700 },
      { x: 446, y: 128, radius: 52, color: 0x2f6bff, peakAlpha: 0.38, pulseMs: 700, delayMs: 350 }
    ],
    effects: [
      { type: 'smoke', x: 186, y: 168, everyMs: 380, color: 0xb0b6d8, alpha: 0.3, rise: 18, drift: 6 },
      { type: 'ripples', x0: 30, x1: 490, y0: 176, y1: 240, everyMs: 100, color: 0xffb0c0 },
      { type: 'fog', y0: 120, y1: 205, color: 0xff5a7a, alpha: 0.09, speed: 5 },
      { type: 'wind', count: 12, colors: [0xf4f0ff], speed: 70, y0: 90, y1: 200 }
    ],
    grade: { color: 0x4a0a1a, alpha: 0.07 },
    pan: { fromX: 0, fromY: 0, toX: -16, toY: -6, durationMs: 26000 }
  },
  {
    id: 'escena-10',
    art: 'bus',
    caption: 'ESA MISMA NOCHE',
    lines: [
      'Esa noche dejé la bolsa, el barrio y a la gente que lo mandaba todo.',
      'No miré atrás. Mirar atrás es lo que hacen los que piensan volver.'
    ],
    rain: false,
    lights: [{ x: 250, y: 100, radius: 76, color: 0xffcf6b, peakAlpha: 0.22, pulseMs: 2800 }],
    effects: [{ type: 'dust', count: 22, color: 0xdfe6ff, alpha: 0.22 }],
    grade: { color: 0x2a0a5a, alpha: 0.06 },
    pan: { fromX: -10, fromY: -4, toX: 0, toY: 0, durationMs: 26000 }
  },
  {
    id: 'escena-11',
    art: 'present',
    caption: `MIAMI, 2089 - ${NAME}, 25 AÑOS`,
    card: { title: '2089', sub: 'HOY' },
    lines: [
      'Siete años después, soy mecánico. Arreglo cosas que se rompen sin que nadie me dispare.',
      'Un taller, un cafecito, la radio baja. Una vida tranquila. Aburrida, incluso. Me gusta.',
      'Entonces vibra el teléfono. Número desconocido. Pero ese prefijo lo conozco.',
      { who: 'voz', say: 'Adrián Vargas. Cuánto tiempo. Tenemos que hablar.' },
      'Y yo que pensaba que el pasado se cansaba de llamar.'
    ],
    rain: false,
    lights: [
      { x: 322, y: 100, radius: 46, color: 0xff2bd6, peakAlpha: 0.28, pulseMs: 900, fromLine: 2 },
      { x: 160, y: 78, radius: 30, color: 0xffcf6b, peakAlpha: 0.2, pulseMs: 3200 }
    ],
    effects: [
      { type: 'smoke', x: 152, y: 132, everyMs: 480, color: 0xf4f0ff, alpha: 0.45, rise: 14, drift: 2 },
      { type: 'dust', count: 36, color: 0xffcf6b, alpha: 0.3 }
    ],
    grade: { color: 0x5a2a0a, alpha: 0.05 },
    pan: { fromX: -16, fromY: -8, toX: 0, toY: 0, durationMs: 34000 }
  }
];
