//GeoJSON end point with d3
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function(data) {
  // Build Map 
  var myMap = L.map("map", {
    center: [37.7749, -110.4194],
    zoom: 4.5
  });

  console.log(data);

  // Build Tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  // Loop through earthquake data & features
  data.features.forEach(function(feature) {
    // Latitude, Longitude, Magnitude, Depth of the Earthquake
    var latitude = feature.geometry.coordinates[1];
    var longitude = feature.geometry.coordinates[0];
    var magnitude = feature.properties.mag;
    var depth = feature.geometry.coordinates[2];

    // Build earthquake markers. Plot Latitude, Longitude
    // Adjust size and color per Magnitude & Depth
    var marker = L.circleMarker([latitude, longitude], {
      radius: getRadius(magnitude),
      fillColor: getColor(depth),
      color: "black",
      fillOpacity: 0.9,
      weight: 0.5
    }).addTo(myMap);

    // Build popup of earthquake information
    var popupContent = "<strong>Magnitude:</strong> " + magnitude + "<br>" +
      "<strong>Depth:</strong> " + depth + "<br>" + "<strong>Place:</strong> " + feature.properties.place;
    marker.bindPopup(popupContent);
  });

  // Build Legend 
  let legend = L.control({
    position: "bottomright"
  });

  // Expand details of Legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    div.style.backgroundColor = "#fff"; 
    let ranges = [-10, 10, 30, 50, 70, 90];
    let colors = [
      "#98EE00",
      "#D4EE00",
      "#EECC00",
      "#EE9C00",
      "#EA822C",
      "#EA2C2C"
    ];
    // Loop through legend details generate labels
    // Additional CSS code was added to style.css to accomodate colorscale
    for (let i = 0; i < ranges.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + ranges[i] + (ranges[i + 1] ? "&ndash;" + ranges[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Add legend to myMap
  legend.addTo(myMap);

  // Color per Depth
  function getColor(depth) {
    return depth < 10 ? "#98EE00" :
           depth < 30 ? "#D4EE00" :
           depth < 50 ? "#EECC00" :
           depth < 70 ? "#EE9C00" :
           depth < 90 ? "#EA822C" :
                         "#EA2C2C";
  }
  // Radius of marker per Magnitude
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

});