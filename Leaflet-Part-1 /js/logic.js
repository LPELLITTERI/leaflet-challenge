// Data for significant earthquakes for the last days 

url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'

d3.json(url)
  .then(function(data) {
    // Use the retrieved data here
    console.log(data);
  })
  .catch(function(error) {
    // Handle any errors that occur during the AJAX request
    console.error(error);
  });



//Using Leaflet, create a map that plots all the earthquakes from your dataset based on their longitude and latitude.



////Your data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.
// Hint: The depth of the earth can be found as the third coordinate for each earthquake.
// Include popups that provide additional information about the earthquake when its associated marker is clicked.
// Create a legend that will provide context for your map data.
// Your visualization should look something like the preceding map.