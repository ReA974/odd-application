import { getAllPOI } from './firebaseQueries';

async function useCloseMarker(coords) {
  const markerArray = await getAllPOI();
  const markerClose = [];
  for (let i = 0; i < markerArray.length; i += 1) {
    const marker = markerArray[i];
    // eslint-disable-next-line max-len
    const distance = Math.sqrt((marker.coordinates.latitude - coords.latitude) ** 2 + (marker.coordinates.longitude - coords.longitude) ** 2);
    if (distance < 0.0005) {
      // eslint-disable-next-line no-console
      markerClose.push(marker);
    }
  }
  if (markerClose.length === 0) return null;
  return markerClose;
}

export default useCloseMarker;
