const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

const myMap = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}).addTo(myMap);

$.getJSON(url, function(data) {
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            const radius = Math.pow(2, feature.properties.mag) * 0.1;

            const depth = feature.geometry.coordinates[2];
          
            
            const color = depth > 100 ? "#f03b20" :
                        depth > 70  ? "#feb24c" :
                        depth > 50  ? "#fed976" :
                        depth > 30  ? "#ffeda0" :
                        depth > 10  ? "#c7e9c0" :
                        depth > 0   ? "#a1d99b" :
                                      "#4d9221";

            return L.circleMarker(latlng, {
                radius: radius,
                fillColor: color,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + "</h3><p>" + new Date(feature.properties.time) + "</p><p>Magnitude: " + feature.properties.mag + "</p><p>Depth: " + feature.geometry.coordinates[2] + " km</p>");
        }
    }).addTo(myMap);
});

function getColor(d) {
    return d >= 100 ? "#f03b20" :
           d >= 70 ? "#feb24c" :
           d >= 50 ? "#fed976" :
           d >= 30 ? "#ffeda0" :
           d >= 10 ? "#c7e9c0":
                     "#a1d99b";
}

const legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'legend'),
      depthValues = [-10, 10, 30, 50, 70, 100],
      labels = [];

  // Add a title for the legend
  div.innerHTML += '<h4>Depth</h4>';

  // Add a color gradient to the legend
  div.innerHTML += '<div class="color-scale" style="background: linear-gradient(to right, #32CD32, #FFFF00, #FFCC00, #FF9900, #ff0000)"></div>';

  // loop through the depth intervals and generate a label with a colored square for each interval
  for (var i = 0; i < depthValues.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(depthValues[i] + 1) + '"></i> ' +
          depthValues[i] + (depthValues[i + 1] ? '&ndash;' + depthValues[i + 1] + '<br>' : '+');
  }
  div.style.backgroundColor = '#fff'; // set background color of legend
  return div;
};

legend.addTo(myMap);
