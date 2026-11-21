// Las seis ilustraciones de la cinemática, por nombre (es el campo `art` de src/data/story.ts).
import type { PixelCanvas } from '../../../core/pixelCanvas';
import { buildExit } from './exit';
import { buildHavana } from './havana';
import { buildImplant } from './implant';
import { buildOffer } from './offer';
import { buildPresent } from './present';
import { buildTalent } from './talent';

export const ART_BUILDERS: Readonly<Record<string, () => PixelCanvas>> = {
  havana: buildHavana,
  implant: buildImplant,
  offer: buildOffer,
  talent: buildTalent,
  exit: buildExit,
  present: buildPresent
};
