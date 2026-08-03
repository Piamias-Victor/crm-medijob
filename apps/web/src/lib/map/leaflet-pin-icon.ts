import L from 'leaflet'

export const leafletPinIcon = L.divIcon({
  className: 'medijob-map-pin',
  html: '<span class="medijob-map-pin__dot"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -10],
})
