mapboxgl.accessToken = 'pk.eyJ1IjoiYWxiZXJ0bWloYWkiLCJhIjoiY2w0Y2s5dnV1MDAxczNoczRzemkzbzNnaSJ9.yjTPqV4V2khQupy-nciHbw';
  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/dark-v10', // style URL
  center: school.geometry.coordinates, // starting position [lng, lat]
  zoom: 9 // starting zoom
});

new mapboxgl.Marker()
.setLngLat(school.geometry.coordinates)
.setPopup(
  new mapboxgl.Popup({offset: 25})
  .setHTML(
    `<h3>${school.title}</h3>`
  )
)
.addTo(map)