// El guion de la cinemática inicial (datos, no código): textos, lugares, sonidos y luces de cada escena.
// Para cambiar una frase, un sonido o una luz se edita este archivo; el motor no se toca.
import type { StoryScene } from '../core/cinematic/storyTypes';

export const PROTAGONIST = {
  firstName: 'Adrián',
  lastName: 'Vargas',
  fullName: 'Adrián Vargas'
} as const;

const NAME = PROTAGONIST.fullName;

export const STORY_SCENES: readonly StoryScene[] = [
  {
    id: 'escena-1',
    art: 'havana',
    caption: `LITTLE HAVANA, 2078 - ${NAME}, 14 AÑOS`,
    lines: [
      'Little Havana, 2078. Catorce años, cero planes y un cafecito demasiado fuerte para mi edad.',
      'Mi madre limpiaba torres en Downtown, de noche. De mi padre, mejor no hablamos.',
      'Éramos ella y yo. Con eso bastaba. O eso creía.'
    ],
    ambience: 'street',
    rain: true,
    cues: [{ line: 1, delayMs: 500, sfx: 'thunder' }],
    lights: [{ x: 160, y: 138, radius: 22, color: 0x19f3ff, peakAlpha: 0.32, pulseMs: 2400 }],
    pan: { fromX: 0, fromY: 0, toX: -20, toY: -8, durationMs: 26000 }
  },
  {
    id: 'escena-2',
    art: 'implant',
    caption: '2078 - EL IMPLANTE',
    lines: [
      'Su corazón latía gracias a un implante. Y el implante, gracias a una suscripción.',
      'Una gran empresa decidía cuánto valía cada latido. Un mes sin pagar y se apagaba. Sin avisos. Sin segundas oportunidades.',
      'Me quedaban cuarenta y ocho horas y ni un dólar.'
    ],
    ambience: 'bedroom',
    rain: false,
    cues: [{ line: 1, delayMs: 2600, sfx: 'warning' }],
    lights: [
      { x: 136, y: 146, radius: 16, color: 0x19f3ff, peakAlpha: 0.5, pulseMs: 1150 },
      { x: 285, y: 80, radius: 44, color: 0xff3b5c, peakAlpha: 0.22, pulseMs: 1800 }
    ],
    pan: { fromX: -18, fromY: -6, toX: 0, toY: 0, durationMs: 26000 }
  },
  {
    id: 'escena-3',
    art: 'offer',
    caption: 'CALLE OCHO - MEDIANOCHE',
    lines: [
      'Entonces apareció un tipo de uno de esos grupos pequeños que mandan en las esquinas.',
      'Trescientos dólares por llevar una bolsa tres calles más allá. Sin preguntas.',
      'Dudé lo que tarda en sonar un latido. Y dije que sí.'
    ],
    ambience: 'alley',
    rain: true,
    cues: [
      { line: 1, delayMs: 900, sfx: 'rustle' },
      { line: 2, delayMs: 3300, sfx: 'deal' }
    ],
    lights: [{ x: 252, y: 70, radius: 40, color: 0xffb347, peakAlpha: 0.2, pulseMs: 3200 }],
    pan: { fromX: 0, fromY: -8, toX: -20, toY: 0, durationMs: 26000 }
  },
  {
    id: 'escena-4',
    art: 'talent',
    caption: 'LOS MESES SIGUIENTES',
    lines: [
      'Resultó que se me daba bien. No solo lo de correr: la tecnología.',
      'Arreglé un escáner que ellos daban por muerto. Dos días después, tenía más encargos que tiempo.',
      'Cada vez me decía lo mismo: solo una vez. Siempre es solo una vez.'
    ],
    ambience: 'workshop',
    rain: false,
    cues: [
      { line: 1, delayMs: 300, sfx: 'sparks' },
      { line: 1, delayMs: 1700, sfx: 'scanOk' }
    ],
    lights: [
      { x: 245, y: 125, radius: 40, color: 0x19f3ff, peakAlpha: 0.3, pulseMs: 2000 },
      { x: 438, y: 120, radius: 46, color: 0xffb347, peakAlpha: 0.2, pulseMs: 3600 }
    ],
    pan: { fromX: -20, fromY: 0, toX: 0, toY: -8, durationMs: 26000 }
  },
  {
    id: 'escena-5',
    art: 'exit',
    caption: '2082 - LA ÚLTIMA VEZ',
    lines: [
      'A los dieciocho, un transporte salió mal. Muy mal. Alguien resultó herido.',
      'No voy a contar el resto. Todavía no.',
      'Esa noche dejé la bolsa, el barrio y a la gente que lo mandaba todo. No miré atrás.'
    ],
    ambience: 'road',
    rain: true,
    cues: [
      { line: 0, delayMs: 800, sfx: 'doorThud' },
      { line: 0, delayMs: 2200, sfx: 'siren' },
      { line: 2, delayMs: 600, sfx: 'footsteps' }
    ],
    lights: [
      { x: 430, y: 128, radius: 52, color: 0xff3b5c, peakAlpha: 0.38, pulseMs: 700 },
      { x: 446, y: 128, radius: 52, color: 0x2f6bff, peakAlpha: 0.38, pulseMs: 700, delayMs: 350 }
    ],
    pan: { fromX: 0, fromY: 0, toX: -20, toY: -6, durationMs: 26000 }
  },
  {
    id: 'escena-6',
    art: 'present',
    caption: `MIAMI, 2089 - ${NAME}, 25 AÑOS`,
    lines: [
      'Siete años después, soy mecánico. Arreglo cosas que se rompen sin que nadie me dispare.',
      'Un taller, un cafecito, la radio baja. Una vida tranquila. Aburrida, incluso. Me gusta.',
      'Entonces vibra el teléfono. Número desconocido. Pero ese prefijo lo conozco.',
      'Y yo que pensaba que el pasado se cansaba de llamar.'
    ],
    ambience: 'bench',
    rain: false,
    cues: [{ line: 2, delayMs: 200, sfx: 'phoneBuzz' }],
    lights: [{ x: 322, y: 100, radius: 46, color: 0xff2bd6, peakAlpha: 0.28, pulseMs: 900 }],
    pan: { fromX: -20, fromY: -8, toX: 0, toY: 0, durationMs: 30000 }
  }
];
