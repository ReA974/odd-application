/* eslint-disable react/destructuring-assignment */
function CloseMarker(coords, marker) {
  // eslint-disable-next-line max-len
  const distance = Math.sqrt((marker.coordinates.latitude - coords.latitude) ** 2 + (marker.coordinates.longitude - coords.longitude) ** 2);
  return distance < 0.00015 ? marker : null;
}

export default CloseMarker;
