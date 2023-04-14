const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

const myMap = L.map('map').setView([30, 33], 4);

// Add OpenStreetMap tiles to map
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}).addTo(myMap);

// Add legend to map
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'legend');
    const depthValues = [-10, 10, 30, 50, 70, 100];

    // Add title to legend
    div.innerHTML += '<h4>Depth</h4>';

    // Add color gradient to legend
    div.innerHTML += '<div class="color-scale" style="background: linear-gradient(to right, #32CD32, #FFFF00, #FFCC00, #FF9900, #ff0000)"></div>';

    // Generate a label with a colored square for each depth interval
    for (let i = 0; i < depthValues.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depthValues[i] + 1) + '"></i> ' +
            depthValues[i] + (depthValues[i + 1] ? '&ndash;' + depthValues[i + 1] + '<br>' : '+');
    }
    div.style.backgroundColor = '#fff';
    return div;
};
legend.addTo(myMap);

// Add earthquake and tectonic plates layers to map
const earthquakeLayer = L.layerGroup().addTo(myMap);
const tectonicPlatesLayer = L.layerGroup().addTo(myMap);

// Add earthquakes to earthquake layer group
$.getJSON(url, function (data) {
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            const radius = Math.pow(2, feature.properties.mag) * 0.1;
            const depth = feature.geometry.coordinates[2];
            const color = depth > 100 ? '#f03b20' :
                depth > 70 ? '#feb24c' :
                    depth > 50 ? '#fed976' :
                        depth > 30 ? '#ffeda0' :
                            depth > 10 ? '#c7e9c0' :
                                depth > 0 ? '#a1d99b' :
                                    '#4d9221';
            return L.circleMarker(latlng, {
                radius: radius,
                fillColor: color,
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup('<h3>' + feature.properties.place + '</h3><p>' + new Date(feature.properties.time) + '</p><p>Magnitude: ' + feature.properties.mag + '</p><p>Depth: ' + feature.geometry.coordinates[2] + ' km</p>');
        }
    }).addTo(earthquakeLayer);
});

// Add tectonic plates to tectonic plates layer group
$.getJSON('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json', function (data) {
    L.geoJSON(data, {
        style: function () {
            return {
                color: 'orange',
                weight: 2,
                opacity: 1
            };
        }
    }).addTo(tectonicPlatesLayer);
});

