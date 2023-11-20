/**
 * @param d time in seconds
 * @returns string in format 00:00:00
 * @example Converts 200s to 00:03:40
 */

export function secondsToHms(d: number | string) {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);

  const hDisplay = h !== 0 ? h.toString().padStart(2, "0") + ":" : "00:";
  const mDisplay = m !== 0 ? m.toString().padStart(2, "0") + ":" : "00:";
  const sDisplay = s !== 0 ? s.toString().padStart(2, "0") : "00";

  return hDisplay + mDisplay + sDisplay;
}
