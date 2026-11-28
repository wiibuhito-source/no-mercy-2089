// Las once ilustraciones de la cinemática, por nombre (es el campo `art` de src/data/story.ts).
import { buildBusArt } from './bus';
import { buildExitArt } from './exit';
import { buildHavanaArt } from './havana';
import { buildImplantArt } from './implant';
import type { SceneArt } from './kit';
import { buildNeonStreetArt } from './neonstreet';
import { buildOfferArt } from './offer';
import { buildPresentArt } from './present';
import { buildRunArt } from './run';
import { buildSkylineArt } from './skyline';
import { buildTalentArt } from './talent';
import { buildTowerArt } from './tower';

export const ART_BUILDERS: Readonly<Record<string, () => SceneArt>> = {
  skyline: buildSkylineArt,
  havana: buildHavanaArt,
  tower: buildTowerArt,
  implant: buildImplantArt,
  neonstreet: buildNeonStreetArt,
  offer: buildOfferArt,
  talent: buildTalentArt,
  run: buildRunArt,
  exit: buildExitArt,
  bus: buildBusArt,
  present: buildPresentArt
};
