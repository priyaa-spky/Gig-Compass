import { load, delay } from './mockDb';

export async function getPlacementTrends() {
  await delay(400);
  return load().trends;
}
